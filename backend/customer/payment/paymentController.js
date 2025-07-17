import pool from "../../db.js";
import axios from 'axios';

// Base URL for SSLCommerz API
const SSL_COMMERZ_API_BASE_URL_LIVE = 'https://securepay.sslcommerz.com';
const SSL_COMMERZ_API_BASE_URL_SANDBOX = 'https://sandbox.sslcommerz.com';

export const initiatePayment = async (req, res, store_id, store_passwd) => {
  try {
    console.log('Initiating payment with store_id:', store_id, 'and store_passwd:', store_passwd);
    const is_live = process.env.SSL_COMMERZ_IS_LIVE === 'true';
    const SSL_COMMERZ_API_BASE_URL = is_live ? SSL_COMMERZ_API_BASE_URL_LIVE : SSL_COMMERZ_API_BASE_URL_SANDBOX;
    // Use v3 endpoint for sandbox as per guide
    const apiEndpoint = is_live
      ? `${SSL_COMMERZ_API_BASE_URL}/gwprocess/v4/api.php`
      : `${SSL_COMMERZ_API_BASE_URL}/gwprocess/v3/api.php`;

  const { cartItems = [], customerInfo = {}, total_amount, tran_id } = req.body;
  const user_id = req.user?.id || 'unknown';

  // Ensure all customer info fields are present and valid
  const cus_name = customerInfo.name || 'Test User';
  const cus_email = customerInfo.email || 'test@example.com';
  const cus_add1 = customerInfo.address || 'Dhaka';
  const cus_add2 = customerInfo.address2 || 'Dhaka';
  const cus_city = customerInfo.city || 'Dhaka';
  const cus_state = customerInfo.state || 'Dhaka';
  const cus_postcode = customerInfo.postcode || '1000';
  const cus_country = customerInfo.country || 'Bangladesh';
  const cus_phone = customerInfo.phone || '01700000000';
  const cus_fax = customerInfo.fax || '01700000001';

  // Shipping information
  const ship_name = customerInfo.ship_name || cus_name;
  const ship_add1 = customerInfo.ship_add1 || cus_add1;
  const ship_add2 = customerInfo.ship_add2 || cus_add2;
  const ship_city = customerInfo.ship_city || cus_city;
  const ship_state = customerInfo.ship_state || cus_state;
  const ship_postcode = customerInfo.ship_postcode || cus_postcode;
  const ship_country = customerInfo.ship_country || cus_country;

  // Fallbacks for URLs
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';

  // Ensure total_amount is a valid positive number
  const validAmount = typeof total_amount === 'number' && total_amount > 0 ? total_amount : 1.00;

  // Ensure tran_id is unique (add timestamp if not present)
  const validTranId = tran_id || `TXN_${Date.now()}`;

  const data = {
    store_id: store_id,
    store_passwd: store_passwd,
    total_amount: parseFloat(validAmount),
    currency: 'BDT',
    tran_id: validTranId,
    success_url: `${frontendUrl}/payment-success?tran_id=${validTranId}`,
    fail_url: `${frontendUrl}/payment-fail?tran_id=${validTranId}`,
    cancel_url: `${frontendUrl}/payment-cancel?tran_id=${validTranId}`,
    ipn_url: `${backendUrl}/api/customer/payment/ipn`,
    product_name: 'Food Order',
    product_category: 'Food',
    product_profile: 'general',
    cus_name,
    cus_email,
    cus_add1,
    cus_add2,
    cus_city,
    cus_state,
    cus_postcode,
    cus_country,
    cus_phone,
    cus_fax,
    ship_name,
    ship_add1,
    ship_add2,
    ship_city,
    ship_state,
    ship_postcode,
    ship_country,
    multi_card_name: 'mastercard,visacard,amexcard',
    value_a: 'ref001_A',
    value_b: 'ref002_B',
    value_c: 'ref003_C',
    value_d: 'ref004_D',
    shipping_method: 'NO',
    num_of_item: cartItems.length,
  };

    const response = await axios.post(apiEndpoint, data);

    if (response.data.status === 'SUCCESS') {
      res.status(200).json({ paymentUrl: response.data.GatewayPageURL });
    } else {
      console.error('SSLCommerz initiation failed:', response.data);
      res.status(400).json({ message: 'Payment initiation failed', details: response.data });
    }
  } catch (error) {
    console.error('Error initiating SSLCommerz payment:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const handleIPN = async (req, res) => {
  try {
    const ipnData = req.body;
    console.log('Received IPN:', ipnData);

    // **IMPORTANT: IPN Validation**
    // You MUST validate the IPN request to ensure it's from SSLCommerz and not tampered with.
    // This typically involves:
    // 1. Verifying the IPN hash/signature (if provided by SSLCommerz).
    // 2. Making a server-to-server validation call to SSLCommerz using the transaction ID.
    //    Example (conceptual, refer to SSLCommerz docs for exact implementation):
    /*
    const validationResponse = await axios.post(`${SSL_COMMERZ_API_BASE_URL}/validator/api/validationserver.php`, {
        val_id: ipnData.val_id, // Validation ID from IPN
        store_id: store_id,
        store_passwd: store_passwd,
    });
    if (validationResponse.data.status !== 'VALID') {
        return res.status(401).send('IPN validation failed');
    }
    */

    const { tran_id, status, amount, currency, val_id } = ipnData;

    // Update your order status in the database based on tran_id and status
    // Example:
    /*
    await pool.query(
      'UPDATE orders SET payment_status = $1, transaction_id = $2 WHERE tran_id = $3',
      [status, val_id, tran_id]
    );
    */

    res.status(200).send('IPN received and processed');
  } catch (error) {
    console.error('Error processing IPN:', error.message);
    res.status(500).send('Error processing IPN');
  }
};

// These are simple redirect handlers. SSLCommerz will redirect the user's browser to these.
// They typically just redirect the user to a frontend page.
export const handleSuccess = async (req, res) => {
  const { tran_id } = req.query;
  // You might fetch order details here and pass them to the frontend
  res.redirect(`${process.env.FRONTEND_URL}/payment-success?tran_id=${tran_id}`);
};

export const handleFail = async (req, res) => {
  const { tran_id } = req.query;
  res.redirect(`${process.env.FRONTEND_URL}/payment-fail?tran_id=${tran_id}`);
};

export const handleCancel = async (req, res) => {
  const { tran_id } = req.query;
  res.redirect(`${process.env.FRONTEND_URL}/payment-cancel?tran_id=${tran_id}`);
};