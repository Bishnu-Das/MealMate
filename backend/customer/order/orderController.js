import pool from '../../db.js';
import { io } from '../../index.js';

// This is the new reusable function for creating orders.
// It's designed to be called from different parts of the application (e.g., COD checkout, payment confirmation).
// It takes a database client as an argument to run within a transaction.
export const createOrderFromCart = async (userId, cartItems, client) => {
  const ordersByRestaurant = cartItems.reduce((acc, item) => {
    const { restaurant_id } = item;
    if (!acc[restaurant_id]) {
      acc[restaurant_id] = [];
    }
    acc[restaurant_id].push(item);
    return acc;
  }, {});

  const createdOrders = [];

  for (const restaurantId in ordersByRestaurant) {
    const items = ordersByRestaurant[restaurantId];
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, restaurant_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, restaurantId, totalAmount, 'pending_restaurant_acceptance']
    );
    const order = orderResult.rows[0];
    createdOrders.push(order);

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.order_id, item.menu_item_id, item.quantity, item.price]
      );
    }

    // Create a delivery record for the order
    const locationResult = await client.query(
      'SELECT * FROM user_locations WHERE user_id = $1 AND is_primary = true',
      [userId]
    );

    if (locationResult.rows.length > 0) {
      const location = locationResult.rows[0];
      await client.query(
        'INSERT INTO deliveries (order_id, restaurant_id, dropoff_latitude, dropoff_longitude, dropoff_addr, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [order.order_id, restaurantId, location.latitude, location.longitude, location.addr_link, 'awaiting_restaurant']
      );
    } else {
        // Handle case where user has no primary location
        // For now, we'll just log a warning. In a real application, you might want to throw an error or use a default location.
        console.warn(`User ${userId} has no primary location. Could not create delivery record for order ${order.order_id}.`);
    }
  }
  return createdOrders;
};

// This is the handler for the COD (Cash on Delivery) case.
export const createOrder = async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const createdOrders = await createOrderFromCart(userId, cartItems, client);

    for (const order of createdOrders) {
      await client.query(
        'INSERT INTO payments (order_id, user_id, method_type, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [order.order_id, userId, 'cod', order.total_amount, 'pending']
      );
      // Emit a new order event to the restaurant
      io.to(`restaurant_${order.restaurant_id}`).emit('new_order', order);
    }

    // After creating the order, clear the user's active cart
    await client.query("UPDATE carts SET status = 'completed' WHERE user_id = $1 AND status = 'active'", [userId]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Orders created successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
};


export const getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch all orders for the user
    const ordersResult = await pool.query(
      `SELECT 
        o.order_id, 
        o.status, 
        o.total_amount, 
        o.created_at, 
        o.rider_id, 
        r.name as restaurant_name, 
        r.restaurant_id, 
        u.name as rider_name,
        EXISTS(SELECT 1 FROM reviews WHERE user_id = o.user_id AND restaurant_id = o.restaurant_id AND order_id = o.order_id) as has_restaurant_review,
        EXISTS(SELECT 1 FROM reviews WHERE user_id = o.user_id AND rider_id = o.rider_id AND order_id = o.order_id) as has_rider_review
      FROM orders o 
      JOIN restaurants r ON o.restaurant_id = r.restaurant_id 
      LEFT JOIN users u ON o.rider_id = u.user_id 
      WHERE o.user_id = $1 
      ORDER BY o.created_at DESC`,
      [userId]
    );
    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.json([]); // No orders found
    }

    // Get all order IDs
    const orderIds = orders.map(order => order.order_id);

    // Fetch all items for these orders
    const itemsResult = await pool.query(
      `SELECT oi.order_id, oi.quantity, oi.price, mi.name as menu_item_name
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
       WHERE oi.order_id = ANY($1::int[])`, // Use ANY for efficient lookup of multiple order IDs
      [orderIds]
    );
    const orderItems = itemsResult.rows;

    // Map items to their respective orders
    const ordersWithItems = orders.map(order => {
      const itemsForThisOrder = orderItems.filter(item => item.order_id === order.order_id);
      return { ...order, items: itemsForThisOrder };
    });

    res.json(ordersWithItems);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'SELECT oi.quantity, oi.price, mi.name as menu_item_name FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id WHERE oi.order_id = $1',
      [orderId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
