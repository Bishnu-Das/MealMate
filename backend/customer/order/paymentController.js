import db from '../../db.js';
import { createOrderFromCart } from './orderController.js';

export const initiatePayment = async (req, res) => {
  const { cartItems, paymentMethod } = req.body;
  const userId = req.user.id;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 2.99; // 2.99 delivery fee

  try {
    const newPayment = await db.query(
      'INSERT INTO payments (user_id, method_type, amount, status) VALUES ($1, $2, $3, $4) RETURNING payment_id',
      [userId, paymentMethod, totalAmount, 'pending']
    );

    const paymentId = newPayment.rows[0].payment_id;
    const paymentUrl = `http://localhost:5173/simulate-payment-gateway?paymentId=${paymentId}`;

    res.json({ paymentUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

export const confirmPayment = async (req, res) => {
  const { paymentId, status } = req.query;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    if (status === 'success') {
      const paymentResult = await client.query('SELECT user_id FROM payments WHERE payment_id = $1 FOR UPDATE', [paymentId]);
      if (paymentResult.rows.length === 0) {
        return res.status(404).send('Payment not found');
      }
      const userId = paymentResult.rows[0].user_id;

      const userCart = await client.query(
        `SELECT ci.menu_item_id, ci.quantity, mi.price, mi.name, r.restaurant_id, r.name as restaurant_name FROM cart_item ci JOIN menu_items mi ON ci.menu_item_id = mi.menu_item_id JOIN restaurants r ON mi.restaurant_id = r.restaurant_id WHERE ci.cart_id = (SELECT cart_id FROM carts WHERE user_id = $1 AND status = 'active')`,
        [userId]
      );

      if (userCart.rows.length > 0) {
        const createdOrderIds = await createOrderFromCart(userId, userCart.rows, client);

        // For simplicity, we'll link the payment to the first order created.
        // In a real-world scenario with multiple orders, you might want to handle this differently.
        await client.query('UPDATE payments SET status = $1, order_id = $2 WHERE payment_id = $3', ['paid', createdOrderIds[0], paymentId]);

        await client.query(`UPDATE carts SET status = 'completed' WHERE user_id = $1 AND status = 'active'`, [userId]);

        await client.query('COMMIT');
        res.redirect('http://localhost:5173/order-history');
      } else {
        console.error('No active cart found for user ID:', userId);
        await client.query('UPDATE payments SET status = $1 WHERE payment_id = $2', ['failed', paymentId]);
        await client.query('COMMIT');
        res.redirect('http://localhost:5173/checkout');
      }
    } else {
      await client.query('UPDATE payments SET status = $1 WHERE payment_id = $2', ['cancelled', paymentId]);
      await client.query('COMMIT');
      res.redirect('http://localhost:5173/checkout');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
};
