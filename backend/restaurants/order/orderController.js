import pool from "../../db.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);

export const getRecentOrders = async (req, res) => {
  const resId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        O.order_id,
        U.name AS customer,
        MI.name AS menu_item_name,
        MI.price,
        CI.quantity,
        O.cart_id,
        O.status,
        O.created_at
      FROM orders O
      JOIN users U ON O.user_id = U.user_id
      JOIN carts C ON O.cart_id = C.cart_id
      JOIN cart_item CI ON CI.cart_id = C.cart_id
      JOIN menu_items MI ON CI.menu_item_id = MI.menu_item_id
      WHERE O.restaurant_id = $1
      ORDER BY O.order_id DESC
      `,
      [resId]
    );

    const ordersMap = {};

    for (const row of result.rows) {
      const orderId = row.order_id;

      if (!ordersMap[orderId]) {
        ordersMap[orderId] = {
          id: `#ORD-${String(orderId).padStart(3, "0")}`,
          customer: row.customer,
          items: [],
          total: 0,
          status: row.status,
          created_at: row.created_at,
        };
      }

      ordersMap[orderId].items.push(`${row.quantity}x ${row.menu_item_name}`);
      ordersMap[orderId].total += row.quantity * parseFloat(row.price);
    }

    const orders = Object.values(ordersMap).map((order) => ({
      id: order.id,
      customer: order.customer,
      items: order.items.join(", "),
      amount: `$${order.total.toFixed(2)}`,
      status: order.status,
      time: dayjs(order.created_at).fromNow(), // e.g., "5 minutes ago"
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error in restaurant order:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  const restaurantId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        O.order_id,
        O.status,
        O.created_at,
        U.name AS customer,
        U.phone_number,
        MI.name AS menu_item_name,
        MI.price,
        CI.quantity
      FROM orders O
      JOIN users U ON O.user_id = U.user_id
      JOIN carts C ON O.cart_id = C.cart_id
      JOIN cart_item CI ON CI.cart_id = C.cart_id
      JOIN menu_items MI ON CI.menu_item_id = MI.menu_item_id
      WHERE O.restaurant_id = $1
      ORDER BY O.order_id DESC
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
          phone: row.phone,
          address: row.address,
          items: [],
          total: 0,
          status: row.status,
          orderTime: new Date(row.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          estimatedTime: "25 min", // static placeholder
          paymentMethod: "Credit Card", // static placeholder
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
