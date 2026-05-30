import express from 'express';
import { encrypt, decrypt } from '../utils/ccavenue.js';

const router = express.Router();

// CCAvenue payment option mapping from UI value → CCAvenue code
const PAYMENT_OPTION_MAP = {
  upi:        'UPI',
  card:       'CC',
  netbanking: 'NB',
  wallet:     'PAYW',
};

/**
 * POST /api/payment/initiate
 *
 * Accepts order details from the frontend, builds the CCAvenue parameter
 * string, encrypts it, and returns { encRequest, accessCode, formUrl }.
 *
 * The frontend then creates a hidden <form> and submits it to formUrl
 * with encRequest + access_code — this initiates the CCAvenue checkout.
 *
 * NOTE: In local development, the redirect_url / cancel_url must be
 * publicly accessible for CCAvenue to POST back to them.
 * Use a tunnelling tool (e.g. ngrok) during testing, or deploy first.
 */
router.post('/initiate', (req, res) => {
  const { orderId, amount, form, planName, paymentMethod } = req.body;

  if (!orderId || !amount || !form) {
    return res.status(400).json({ error: 'Missing required fields: orderId, amount, form' });
  }

  const {
    CCAVENUE_MERCHANT_ID,
    CCAVENUE_ACCESS_CODE,
    CCAVENUE_WORKING_KEY,
    CCAVENUE_FORM_URL,
    BASE_URL,
    FRONTEND_URL,
  } = process.env;

  if (!CCAVENUE_MERCHANT_ID || !CCAVENUE_ACCESS_CODE || !CCAVENUE_WORKING_KEY) {
    return res.status(500).json({ error: 'CCAvenue credentials are not configured on the server.' });
  }

  const redirectUrl = `${BASE_URL}/api/payment/response`;
  const cancelUrl   = `${BASE_URL}/api/payment/cancel`;

  // Build URL-encoded parameter string exactly as CCAvenue expects
  const params = new URLSearchParams({
    merchant_id:     CCAVENUE_MERCHANT_ID,
    order_id:        orderId,
    currency:        'INR',
    amount:          Number(amount).toFixed(2),
    redirect_url:    redirectUrl,
    cancel_url:      cancelUrl,
    language:        'EN',
    billing_name:    form.fullName    || '',
    billing_email:   form.email       || '',
    billing_tel:     form.mobile      || '',
    billing_address: 'NA',
    billing_city:    'NA',
    billing_state:   form.state       || '',
    billing_country: 'India',
    billing_zip:     '000000',
    payment_option:  PAYMENT_OPTION_MAP[paymentMethod] || 'CC',
    merchant_param1: planName         || '',
  });

  const encRequest = encrypt(params.toString(), CCAVENUE_WORKING_KEY);

  return res.json({
    encRequest,
    accessCode: CCAVENUE_ACCESS_CODE,
    formUrl:    CCAVENUE_FORM_URL,
  });
});

/**
 * POST /api/payment/response
 *
 * CCAvenue POSTs the encrypted response here after the user completes
 * (or fails) payment on the CCAvenue-hosted page.
 * We decrypt, inspect order_status, and redirect to the SPA result page.
 */
router.post('/response', express.urlencoded({ extended: false }), (req, res) => {
  const { encResp } = req.body;
  const { CCAVENUE_WORKING_KEY, FRONTEND_URL } = process.env;

  if (!encResp) {
    return res.redirect(`${FRONTEND_URL}/payment/result?status=failed&reason=no_response`);
  }

  let decrypted;
  try {
    decrypted = decrypt(encResp, CCAVENUE_WORKING_KEY);
  } catch {
    return res.redirect(`${FRONTEND_URL}/payment/result?status=failed&reason=decrypt_error`);
  }

  const params       = new URLSearchParams(decrypted);
  const orderStatus  = params.get('order_status');
  const orderId      = params.get('order_id')     || '';
  const amount       = params.get('amount')        || '';
  const trackingId   = params.get('tracking_id')   || '';
  const failureMsg   = params.get('failure_message') || 'Payment failed';

  if (orderStatus === 'Success') {
    const query = new URLSearchParams({ status: 'success', order_id: orderId, amount, tracking_id: trackingId });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  }

  // Aborted / Invalid / Failure
  const query = new URLSearchParams({ status: 'failed', order_id: orderId, reason: failureMsg });
  return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
});

/**
 * POST /api/payment/cancel
 *
 * CCAvenue POSTs here when the user clicks "Cancel" on the payment page.
 */
router.post('/cancel', express.urlencoded({ extended: false }), (req, res) => {
  const { FRONTEND_URL } = process.env;
  const orderId = req.body.order_id || '';
  const query   = new URLSearchParams({ status: 'cancelled', order_id: orderId });
  return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
});

export default router;
