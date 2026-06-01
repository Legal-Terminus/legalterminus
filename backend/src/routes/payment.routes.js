import express from 'express';
import axios from 'axios';
import { getDb } from '../config/firebase.js';

const router = express.Router();

const PHONEPE_API_BASE = process.env.PHONEPE_API_BASE || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const CLIENT_ID        = () => process.env.PHONEPE_CLIENT_ID;
const CLIENT_SECRET    = () => process.env.PHONEPE_CLIENT_SECRET;
const CLIENT_VERSION   = () => process.env.PHONEPE_CLIENT_VERSION || '1';

/* ─── OAuth2 token cache ─── */
let _tokenCache = { token: null, expiresAt: 0 };

async function getAccessToken() {
  const now = Date.now();
  if (_tokenCache.token && now < _tokenCache.expiresAt - 60_000) {
    return _tokenCache.token;
  }

  const params = new URLSearchParams({
    client_id:      CLIENT_ID(),
    client_secret:  CLIENT_SECRET(),
    client_version: CLIENT_VERSION(),
    grant_type:     'client_credentials',
  });

  const response = await axios.post(
    `${PHONEPE_API_BASE}/v1/oauth/token`,
    params.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  const { access_token, expires_in } = response.data;
  _tokenCache = {
    token:     access_token,
    expiresAt: now + (expires_in || 900) * 1000,
  };
  return access_token;
}

/**
 * POST /api/payment/initiate
 *
 * Obtains an OAuth2 bearer token, calls PhonePe v2 checkout,
 * and returns { redirectUrl, transactionId } to the frontend.
 */
router.post('/initiate', async (req, res) => {
  const { amount, planName, userId, form } = req.body;

  if (!amount || !planName) {
    return res.status(400).json({ error: 'Missing required fields: amount, planName' });
  }

  const transactionId = `LT-${Date.now()}`;
  const { BASE_URL, FRONTEND_URL } = process.env;

  // Backend redirect — we verify status here before sending user to frontend result page
  const redirectUrl = `${BASE_URL}/api/payment/redirect?txnId=${transactionId}&planName=${encodeURIComponent(planName)}&userId=${encodeURIComponent(userId || '')}&amount=${amount}`;

  const payload = {
    merchantOrderId: transactionId,
    amount: Math.round(Number(amount) * 100), // paise
    expireAfter: 1200,
    metaInfo: {
      udf1: userId || '',
      udf2: planName,
      udf3: form?.mobile || '',
    },
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: `LegalTerminus ${planName} plan`,
      merchantUrls: {
        redirectUrl,
      },
    },
  };

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${PHONEPE_API_BASE}/checkout/v2/pay`,
      payload,
      {
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `O-Bearer ${token}`,
        },
      },
    );

    const phonepeRedirectUrl = response.data?.redirectUrl;
    if (!phonepeRedirectUrl) {
      console.error('PhonePe v2 initiate response:', JSON.stringify(response.data));
      return res.status(502).json({ error: 'PhonePe did not return a redirect URL' });
    }

    return res.json({ redirectUrl: phonepeRedirectUrl, transactionId });
  } catch (err) {
    const errData = err.response?.data;
    console.error('PhonePe v2 initiate error:', JSON.stringify(errData || err.message));
    // Invalidate token cache on auth errors so the next request fetches a fresh one
    if (err.response?.status === 401) _tokenCache = { token: null, expiresAt: 0 };
    return res.status(502).json({ error: errData?.message || 'Failed to initiate PhonePe payment' });
  }
});

/**
 * GET /api/payment/redirect
 *
 * PhonePe redirects the user's browser here after payment.
 * We check order status via v2 API, save to Firestore,
 * then redirect the user to the frontend result page.
 */
router.get('/redirect', async (req, res) => {
  const { txnId, planName, userId, amount } = req.query;
  const { FRONTEND_URL } = process.env;

  if (!txnId) {
    return res.redirect(`${FRONTEND_URL}/payment/result?status=failed&reason=missing_transaction`);
  }

  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${PHONEPE_API_BASE}/checkout/v2/order/${txnId}/status`,
      {
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `O-Bearer ${token}`,
        },
      },
    );

    const data      = response.data;
    const state     = data?.state;          // COMPLETED | FAILED | PENDING
    const paymentId = data?.paymentDetails?.[0]?.transactionId || txnId;
    const isSuccess = state === 'COMPLETED';

    if (isSuccess) {
      await savePayment({ userId, transactionId: txnId, paymentId, amount, planName, status: 'success' });
      const query = new URLSearchParams({ status: 'success', order_id: txnId, amount, tracking_id: paymentId });
      return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
    }

    const reason = data?.errorCode || data?.message || 'Payment failed';
    await savePayment({ userId, transactionId: txnId, paymentId, amount, planName, status: 'failed', failureReason: reason });
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  } catch (err) {
    console.error('PhonePe v2 status check error:', err.response?.data || err.message);
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason: 'Status check failed' });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  }
});

/**
 * POST /api/payment/callback
 *
 * Server-to-server callback from PhonePe (optional in local dev).
 * PhonePe v2 sends a JSON body — just acknowledge it.
 */
router.post('/callback', express.json(), async (req, res) => {
  try {
    const event = req.body;
    console.log('PhonePe v2 callback event:', JSON.stringify(event));
    // Actual status is confirmed via /redirect; callback is best-effort
    res.status(200).send('OK');
  } catch (err) {
    console.error('PhonePe callback error:', err.message);
    res.status(200).send('OK'); // always 200 to PhonePe
  }
});

/* ─── helpers ─── */

async function savePayment({ userId, transactionId, paymentId, amount, planName, status, failureReason }) {
  if (!userId) return;
  try {
    const db = getDb();
    await db.collection('users').doc(userId).collection('payments').doc(transactionId).set({
      orderId:       transactionId,
      paymentId:     paymentId || '',
      amount:        parseFloat(amount) || 0,
      planName:      planName || '',
      status,
      failureReason: failureReason || null,
      paymentDate:   new Date(),
      updatedAt:     new Date(),
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
