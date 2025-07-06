import pool from "../db.js";

export const getDashboardData = async (req, res) => {
  try {
    const riderId = req.user.id; // Assuming the rider's ID is available in the request object

    if (!riderId) {
      return res.status(400).json({ message: "Rider ID not found in request." });
    }

    // Fetch available orders (status = 'pending')
    const availableOrders = await pool.query(
      `SELECT
        o.order_id,
        o.status,
        o.total_amount,
        r.name AS restaurant_name,
        r.phone AS restaurant_phone,
        r.email AS restaurant_email,
        cu.name AS customer_name,
        cu.phone_number AS customer_phone,
        d.dropoff_addr,
        d.dropoff_latitude,
        d.dropoff_longitude
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.restaurant_id
      JOIN users cu ON o.user_id = cu.user_id
      JOIN deliveries d ON o.order_id = d.order_id
      WHERE o.status = 'pending'`
    );

    // Fetch assigned order with detailed information
    const assignedOrderResult = await pool.query(
      `SELECT
        o.order_id,
        o.status AS order_status,
        o.total_amount,
        d.dropoff_addr,
        d.dropoff_latitude,
        d.dropoff_longitude,
        r.name AS restaurant_name,
        r.phone AS restaurant_phone,
        r.email AS restaurant_email,
        cu.name AS customer_name,
        cu.phone_number AS customer_phone
      FROM orders o
      JOIN deliveries d ON o.order_id = d.order_id
      JOIN restaurants r ON o.restaurant_id = r.restaurant_id
      JOIN users cu ON o.user_id = cu.user_id
      WHERE o.rider_id = $1 AND o.status IN ('preparing', 'out_for_delivery')`,
      [riderId]
    );

    const assignedOrder = assignedOrderResult.rows[0] || null;

    // Fetch rider's availability
    const riderProfile = await pool.query(
      "SELECT is_available FROM rider_profiles WHERE user_id = $1",
      [riderId]
    );

    res.status(200).json({
      availableOrders: availableOrders.rows,
      assignedOrder: assignedOrder,
      isAvailable: riderProfile.rows[0]?.is_available,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRiderProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await pool.query(
      "SELECT name, email, phone_number FROM users WHERE user_id = $1",
      [userId]
    );

    const riderProfile = await pool.query(
      "SELECT vehicle_type, is_available FROM rider_profiles WHERE user_id = $1",
      [userId]
    );

    if (user.rows.length === 0 || riderProfile.rows.length === 0) {
      return res.status(404).json({ message: "Rider profile not found" });
    }

    res.status(200).json({
      name: user.rows[0].name,
      email: user.rows[0].email,
      phone_number: user.rows[0].phone_number,
      vehicle_type: riderProfile.rows[0].vehicle_type,
      is_available: riderProfile.rows[0].is_available,
    });
  } catch (err) {
    console.error("Error fetching rider profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRiderProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone_number, vehicle_type } = req.body;

    // Update users table
    await pool.query(
      "UPDATE users SET name = $1, phone_number = $2 WHERE user_id = $3",
      [name, phone_number, userId]
    );

    // Update rider_profiles table
    await pool.query(
      "UPDATE rider_profiles SET vehicle_type = $1 WHERE user_id = $2",
      [vehicle_type, userId]
    );

    res.status(200).json({ message: "Rider profile updated successfully" });
  } catch (err) {
    console.error("Error updating rider profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRiderAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { is_available } = req.body;

    await pool.query(
      "UPDATE rider_profiles SET is_available = $1 WHERE user_id = $2",
      [is_available, userId]
    );

    res.status(200).json({ message: "Rider availability updated successfully" });
  } catch (err) {
    console.error("Error updating rider availability:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDeliveryHistory = async (req, res) => {
  try {
    const riderId = req.user.id;

    if (!riderId) {
      return res.status(400).json({ message: "Rider ID not found in request." });
    }

    const history = await pool.query(
      `SELECT
        o.order_id,
        o.status,
        o.total_amount,
        o.delivered_at
      FROM orders o
      JOIN deliveries d ON o.order_id = d.order_id
      WHERE o.rider_id = $1 AND o.status = 'delivered'
      ORDER BY o.delivered_at DESC`,
      [riderId]
    );

    res.status(200).json(history.rows);
  } catch (err) {
    console.error("Error fetching delivery history:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const riderId = req.user.id;

    // Check if the rider already has an active order (status 'preparing' or 'out_for_delivery')
    const activeOrderCheck = await pool.query(
      "SELECT order_id FROM orders WHERE rider_id = $1 AND status IN ('preparing', 'out_for_delivery')",
      [riderId]
    );

    if (activeOrderCheck.rows.length > 0) {
      return res.status(400).json({ message: "You already have an active order. Please complete it before accepting a new one." });
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET rider_id = $1, status = 'preparing' WHERE order_id = $2 AND status = 'pending' RETURNING *",
      [riderId, orderId]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ message: "Order not found or not pending" });
    }

    res.status(200).json({ message: "Order accepted successfully", order: updatedOrder.rows[0] });
  } catch (err) {
    console.error("Error accepting order:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *",
      [status, orderId]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder.rows[0] });
  } catch (err) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const riderId = req.user.id; // Ensure the rider is authorized to view this order

    const orderResult = await pool.query(
      `SELECT
        o.order_id,
        o.status,
        o.total_amount,
        o.rider_id,
        r.name AS restaurant_name,
        r.phone AS restaurant_phone,
        r.email AS restaurant_email,
        cu.name AS customer_name,
        cu.phone_number AS customer_phone,
        d.dropoff_addr,
        d.dropoff_latitude,
        d.dropoff_longitude
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.restaurant_id
      JOIN users cu ON o.user_id = cu.user_id
      JOIN deliveries d ON o.order_id = d.order_id
      WHERE o.order_id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    // If the order is pending, any rider can view its details
    if (order.status === 'pending') {
      return res.status(200).json({ order: order });
    }

    // For other statuses (e.g., preparing, out_for_delivery, delivered),
    // only the assigned rider can view the details.
    if (order.rider_id !== riderId) {
      return res.status(403).json({ message: "Order not authorized for this rider" });
    }

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found or not authorized" });
    }

    res.status(200).json({ order: orderResult.rows[0] });
  } catch (err) {
    console.error("Error fetching single order details:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};