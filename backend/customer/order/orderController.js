import db from '../../db.js';

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
      'INSERT INTO orders (user_id, restaurant_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING order_id, total_amount',
      [userId, restaurantId, totalAmount, 'pending']
    );
    const { order_id, total_amount } = orderResult.rows[0];
    createdOrders.push({ order_id, total_amount });

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order_id, item.menu_item_id, item.quantity, item.price]
      );
    }
  }
  return createdOrders;
};

// This is the handler for the COD (Cash on Delivery) case.
export const createOrder = async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.id;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const createdOrders = await createOrderFromCart(userId, cartItems, client);

    for (const order of createdOrders) {
      await client.query(
        'INSERT INTO payments (order_id, user_id, method_type, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [order.order_id, userId, 'cod', order.total_amount, 'pending']
      );
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
    const ordersResult = await db.query(
      'SELECT o.order_id, o.status, o.total_amount, o.created_at, r.name as restaurant_name, r.restaurant_id FROM orders o JOIN restaurants r ON o.restaurant_id = r.restaurant_id WHERE o.user_id = $1 ORDER BY o.created_at DESC',
      [userId]
    );
    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.json([]); // No orders found
    }

    // Get all order IDs
    const orderIds = orders.map(order => order.order_id);

    // Fetch all items for these orders
    const itemsResult = await db.query(
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
    const result = await db.query(
      'SELECT oi.quantity, oi.price, mi.name as menu_item_name FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id WHERE oi.order_id = $1',
      [orderId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

