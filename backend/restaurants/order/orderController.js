import pool from "../../db.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

import { getIO } from "../../socket.js";

dayjs.extend(relativeTime);

export const getRecentOrders = async (req, res) => {
  const restaurantId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        O.order_id,
        O.status,
        O.total_amount,
        U.name AS customer,
        U.phone_number,
        O.created_at,
        MI.name AS menu_item_name,
        MI.price,
        OI.quantity
      FROM orders O
      JOIN users U ON O.user_id = U.user_id
      JOIN order_items OI ON O.order_id = OI.order_id
      JOIN menu_items MI ON OI.menu_item_id = MI.menu_item_id
      WHERE O.restaurant_id = $1
      ORDER BY O.created_at DESC
      LIMIT 15
      `,
      [restaurantId]
    );

    const ordersMap = {};

    for (const row of result.rows) {
      const orderId = row.order_id;

      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          id: `#ORD-${String(orderId).padStart(3, "0")}`,
          customer: row.customer,
          phone: row.phone_number,
          created_at: row.created_at,
          items: [],
          total: 0,
          status: row.status,
          orderTime: new Date(row.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          paymentMethod: row.payment_method,
        };
      }

      ordersMap[orderId].items.push({
        name: row.menu_item_name,
        quantity: row.quantity,
        price: parseFloat(row.price),
      });

      ordersMap[orderId].total += row.quantity * parseFloat(row.price);
    }

    const orders = Object.values(ordersMap).map((order) => ({
      ...order,
      total: parseFloat(order.total.toFixed(2)),
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  const restaurant_id = req.user.id;
  try {
    const orders = await pool.query(
      `SELECT
        o.order_id,
        o.user_id AS customer_id,
        u.name AS customer_name,
        u.phone_number AS customer_phone,
        o.total_amount,
        o.status,
        p.method_type AS payment_method,
        d.dropoff_addr,
        o.created_at,
        o.rider_id,
        r.name AS rider_name,
        r.phone_number AS rider_phone,
        JSON_AGG(
          json_build_object(
          'order_id', oi.order_id,
      'quantity', oi.quantity,
      'menu_item_id', mi.menu_item_id,
      'name', mi.name,
      'price', mi.price,
      'menu_item_image_url',mi.menu_item_image_url
          
          )
        
        ) AS items
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN users r ON o.rider_id = r.user_id
      LEFT JOIN deliveries d ON o.order_id = d.order_id
      LEFT JOIN payments p ON o.order_id = p.order_id
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN menu_items mi ON mi.menu_item_id = oi.menu_item_id
      WHERE o.restaurant_id = $1
      GROUP BY o.order_id, u.name, u.phone_number, r.name, r.phone_number, d.dropoff_addr, p.method_type
      ORDER BY o.created_at DESC`,
      [restaurant_id]
    );
    //  JSON_AGG(oi.*) AS items
    //console.log(orders.rows);
    res.status(200).json(orders.rows);
  } catch (err) {
    console.error("Error in get_orders controller:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

function extractOrderNumber(orderId) {
  const match = orderId.match(/\d+/); // matches one or more digits
  return match ? parseInt(match[0], 10) : null;
}

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // expecting 'preparing' or 'restaurant_rejected' or 'ready_for_pickup'
  console.log(
    `Backend received update status request for order ${orderId} with status: ${status}`
  );

  if (
    !["preparing", "restaurant_rejected", "ready_for_pickup"].includes(status)
  ) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      "UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *",
      [status, orderId]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    // Emit order status updated event to the restaurant
    getIO()
      .to(`restaurant_${order.restaurant_id}`)
      .emit("order_status_updated", order);

    if (status === "ready_for_pickup") {
      await client.query(
        `UPDATE deliveries SET status = 'pending' WHERE order_id = $1`,
        [orderId]
      );

      // Fetch additional order details for the notification, including calculated delivery fee
      const deliveryDetailsResult = await client.query(
        `SELECT
          o.*,
          r.name as restaurant_name,
          d.dropoff_addr,
          (
            2.0 + -- Base Fee
            (
              ST_Distance(
                ST_MakePoint(rl.longitude, rl.latitude)::geography,
                ST_MakePoint(d.dropoff_longitude, d.dropoff_latitude)::geography
              ) / 1000 -- Convert to KM
            ) * 0.50 -- Rate per KM
          )::decimal(10, 2) AS delivery_fee
         FROM orders o
         JOIN restaurants r ON o.restaurant_id = r.restaurant_id
         JOIN deliveries d ON o.order_id = d.order_id
         JOIN user_locations rl on rl.restaurant_id = r.restaurant_id
         WHERE o.order_id = $1`,
        [orderId]
      );
      //JOIN user_locations rl ON r.location_id = rl.location_id

      if (deliveryDetailsResult.rows.length > 0) {
        const deliveryDetails = deliveryDetailsResult.rows[0];
        // Emit new delivery event to all riders
        const io = getIO();
        console.log(
          `Emitting 'new_delivery' to 'riders' room with data:`,
          deliveryDetails
        );
        io.to("riders").emit("new_delivery", deliveryDetails);

        // Store notification for all available riders
        const availableRiders = await client.query(
          "SELECT user_id FROM rider_profiles WHERE is_available = true"
        );
        for (const rider of availableRiders.rows) {
          await client.query(
            "INSERT INTO notifications (user_id, target_type, target_id, order_id, type, message) VALUES ($1, $2, $3, $4, $5, $6)",
            [
              order.user_id,
              "rider",
              rider.user_id,
              orderId,
              "delivery_status",
              `A new delivery is available from ${deliveryDetails.restaurant_name}.`,
            ]
          );
        }
      } else {
        console.error(
          `Could not fetch delivery details for order ${orderId}. Notification to riders not sent.`
        );
      }
    }

    await client.query("COMMIT");
    res
      .status(200)
      .json({ message: "Order status updated successfully", order: order });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating order status:", error);
    res.status(500).send("Server error");
  } finally {
    client.release();
  }
};
