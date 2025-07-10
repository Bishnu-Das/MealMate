import db from '../../db.js';
import { createOrderFromCart } from './orderController.js';
import axios from 'axios';

const getBkashToken = async () => {
  try {
    const response = await axios.post(
      'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant',
      {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          username: process.env.BKASH_USER_NAME,
          password: process.env.BKASH_PASSWORD,
        },
      }
    );
    return response.data.id_token;
  } catch (error) {
    console.error('Error getting bKash token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const initiatePayment = async (req, res) => {
  const { cartItems, paymentMethod } = req.body;
  const userId = req.user.id;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const newPayment = await db.query(
      'INSERT INTO payments (user_id, method_type, amount, status) VALUES ($1, $2, $3, $4) RETURNING payment_id',
      [userId, paymentMethod, totalAmount, 'pending']
    );

    const paymentId = newPayment.rows[0].payment_id;

    if (paymentMethod === 'bkash') {
      const token = await getBkashToken();
      const { data } = await axios.post(
        'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create',
        {
          mode: '0011',
          payerReference: ' ',
          callbackURL: process.env.BKASH_CALLBACK_URL,
          amount: totalAmount,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: paymentId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization: token,
            'x-app-key': process.env.BKASH_APP_KEY,
          },
        }
      );
      return res.json({ paymentUrl: data.bkashURL });
    }

    const paymentUrl = `http://localhost:5173/simulate-payment-gateway?paymentId=${paymentId}`;

    res.json({ paymentUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

export const bkashCallback = async (req, res) => {
  const { paymentID, status, trxID } = req.query;

  if (status === 'success') {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const token = await getBkashToken();
      const { data } = await axios.post(
        'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute',
        { paymentID },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization: token,
            'x-app-key': process.env.BKASH_APP_KEY,
          },
        }
      );

      if (data.statusCode === '0000') {
        const paymentResult = await client.query('SELECT user_id FROM payments WHERE payment_id = $1 FOR UPDATE', [
          data.merchantInvoiceNumber,
        ]);
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

          await client.query('UPDATE payments SET status = $1, order_id = $2, transaction_id = $3 WHERE payment_id = $4', [
            'paid',
            createdOrderIds[0],
            trxID,
            data.merchantInvoiceNumber,
          ]);

          await client.query(`UPDATE carts SET status = 'completed' WHERE user_id = $1 AND status = 'active'`, [userId]);

          await client.query('COMMIT');
          return res.redirect('http://localhost:5173/order-history');
        } else {
          console.error('No active cart found for user ID:', userId);
          await client.query('UPDATE payments SET status = $1 WHERE payment_id = $2', ['failed', data.merchantInvoiceNumber]);
          await client.query('COMMIT');
          return res.redirect('http://localhost:5173/checkout');
        }
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      return res.status(500).send('Server error');
    } finally {
      client.release();
    }
  } else {
    return res.redirect('http://localhost:5173/checkout');
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
