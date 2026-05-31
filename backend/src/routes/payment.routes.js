import express from 'express';
import axios from 'axios';
import { buildXVerify, verifyXVerify } from '../utils/phonepe.js';
import { getDb } from '../config/firebase.js';

const router = express.Router();

const PHONEPE_API_BASE   = process.env.PHONEPE_API_BASE   || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const PHONEPE_MERCHANT_ID = () => process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT';
const PHONEPE_SALT_KEY    = () => process.env.PHONEPE_SALT_KEY    || '099eb0cd-02cf-4dc2-a4fb-2fbb9d4ddf71';
const PHONEPE_SALT_INDEX  = () => process.env.PHONEPE_SALT_INDEX  || '1';

/**
 * POST /api/payment/initiate
 *
 * Builds a PhonePe PAY_PAGE request, signs it, and returns
 * { redirectUrl } — the frontend navigates to this URL.
 */
router.post('/initiate', async (req, res) => {
  const { amount, planName, userId, form } = req.body;

  if (!amount || !planName) {
    return res.status(400).json({ error: 'Missing required fields: amount, planName' });
  }

  const merchantId      = PHONEPE_MERCHANT_ID();
  const saltKey         = PHONEPE_SALT_KEY();
  const saltIndex       = PHONEPE_SALT_INDEX();
  const transactionId   = `LT-${Date.now()}`;
  const { BASE_URL, FRONTEND_URL } = process.env;

  // Debug: Log the credentials being used
  console.log(`PhonePe initiate: merchantId=${merchantId}, saltKey=${saltKey?.substring(0, 20)}...`);
  console.log(`  API_BASE=${PHONEPE_API_BASE}`);

  // Redirect goes to backend first so we can verify & save before showing result
  const redirectUrl = `${BASE_URL}/api/payment/redirect?txnId=${transactionId}&planName=${encodeURIComponent(planName)}&userId=${encodeURIComponent(userId || '')}&amount=${amount}`;
  const callbackUrl = `${BASE_URL}/api/payment/callback`;

  const payload = {
    merchantId,
    merchantTransactionId: transactionId,
    merchantUserId: userId || 'GUEST',
    amount: Math.round(Number(amount) * 100), // paise
    redirectUrl,
    redirectMode: 'GET',
    callbackUrl,
    mobileNumber: form?.mobile || '',
    paymentInstrument: { type: 'PAY_PAGE' },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const endpoint      = '/pg/v1/pay';
  const xVerify       = buildXVerify(base64Payload, endpoint, saltKey, saltIndex);

  console.log(`Payload (base64): ${base64Payload.substring(0, 50)}...`);
  console.log(`X-VERIFY: ${xVerify.substring(0, 50)}...`);

  try {
    const response = await axios.post(
      `${PHONEPE_API_BASE}${endpoint}`,
      { request: base64Payload },
      { headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify } },
    );

    const phonepeRedirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
    if (!phonepeRedirectUrl) {
      console.error('PhonePe initiate response:', JSON.stringify(response.data));
      return res.status(502).json({ error: 'PhonePe did not return a redirect URL' });
    }

    return res.json({ redirectUrl: phonepeRedirectUrl, transactionId });
  } catch (err) {
    const errData = err.response?.data;
    console.error('PhonePe initiate error:', JSON.stringify(errData || err.message));
    return res.status(502).json({ error: errData?.message || 'Failed to initiate PhonePe payment' });
  }
});

/**
 * GET /api/payment/redirect
 *
 * PhonePe redirects the user's browser here after payment.
 * We verify status via PhonePe's status API, save to Firestore,
 * then redirect the user to the frontend result page.
 */
router.get('/redirect', async (req, res) => {
  const { txnId, planName, userId, amount } = req.query;
  const { FRONTEND_URL } = process.env;

  if (!txnId) {
    return res.redirect(`${FRONTEND_URL}/payment/result?status=failed&reason=missing_transaction`);
  }

  const merchantId = PHONEPE_MERCHANT_ID();
  const saltKey    = PHONEPE_SALT_KEY();
  const saltIndex  = PHONEPE_SALT_INDEX();
  const endpoint   = `/pg/v1/status/${merchantId}/${txnId}`;
  const xVerify    = buildXVerify('', endpoint, saltKey, saltIndex);

  try {
    const response = await axios.get(
      `${PHONEPE_API_BASE}${endpoint}`,
      { headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify, 'X-MERCHANT-ID': merchantId } },
    );

    const data   = response.data;
    const isSuccess = data?.success === true && data?.data?.state === 'COMPLETED';
    const paymentId = data?.data?.transactionId || txnId;

    if (isSuccess) {
      await savePayment({ userId, transactionId: txnId, paymentId, amount, planName, status: 'success' });
      const query = new URLSearchParams({ status: 'success', order_id: txnId, amount, tracking_id: paymentId });
      return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
    }

    const reason = data?.message || 'Payment failed';
    await savePayment({ userId, transactionId: txnId, paymentId, amount, planName, status: 'failed', failureReason: reason });
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  } catch (err) {
    console.error('PhonePe status check error:', err.response?.data || err.message);
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason: 'Status check failed' });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  }
});

/**
 * POST /api/payment/callback
 *
 * Server-to-server callback from PhonePe (optional in local dev).
 * Verifies the X-VERIFY header and saves to Firestore.
 */
router.post('/callback', express.json(), async (req, res) => {
  const xVerifyHeader = req.headers['x-verify'];
  const { response: base64Response } = req.body;

  if (!base64Response) return res.status(400).send('Bad Request');

  const saltKey   = PHONEPE_SALT_KEY();
  const saltIndex = PHONEPE_SALT_INDEX();

  if (xVerifyHeader && !verifyXVerify(base64Response, xVerifyHeader, saltKey, saltIndex)) {
    console.error('PhonePe callback: X-VERIFY mismatch');
    return res.status(401).send('Unauthorized');
  }

  try {
    const decoded = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf8'));
    const isSuccess = decoded?.success === true && decoded?.data?.state === 'COMPLETED';
    const txnId     = decoded?.data?.merchantTransactionId || '';
    const paymentId = decoded?.data?.transactionId || '';

    console.log(`PhonePe callback: txnId=${txnId} success=${isSuccess}`);
    // Firestore write is handled in /redirect; callback is best-effort
    res.status(200).send('OK');
  } catch (err) {
    console.error('PhonePe callback parse error:', err.message);
    res.status(200).send('OK'); // always 200 to PhonePe
  }
});

/* ─── helpers ─── */

async function savePayment({ userId, transactionId, paymentId, amount, planName, status, failureReason }) {
  if (!userId) return;
  try {
    const db = getDb();
    await db.collection('users').doc(userId).collection('payments').doc(transactionId).set({
      orderId:   transactionId,
      paymentId: paymentId || '',
      amount:    parseFloat(amount) || 0,
      planName:  planName || '',
      status,
      failureReason: failureReason || null,
      paymentDate: new Date(),
      updatedAt:   new Date(),
    });

    if (status === 'success') {
      await db.collection('users').doc(userId).update({
        currentPlan:   planName,
        paidPlanStart: new Date(),
        updatedAt:     new Date(),
      }).catch((err) => console.error('Error updating user subscription:', err));
    }
  } catch (err) {
    console.error('Error saving payment to Firestore:', err);
  }
}

export default router;
