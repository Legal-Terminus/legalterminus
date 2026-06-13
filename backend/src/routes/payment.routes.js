import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { getDb } from '../config/firebase.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

const PAYU_KEY      = () => process.env.PAYU_KEY;
const PAYU_SALT     = () => process.env.PAYU_SALT;
const PAYU_BASE_URL = () => process.env.PAYU_API_BASE || 'https://secure.payu.in/_payment';
const PAYU_VERIFY_URL = () => process.env.PAYU_VERIFY_URL || 'https://info.payu.in/merchant/postservice?form=2';

function sha512(str) {
  return crypto.createHash('sha512').update(str).digest('hex');
}

/**
 * Compute PayU request hash:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
function computeRequestHash({ key, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '' }) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}||||||||${PAYU_SALT()}`;
  return sha512(hashString);
}

/**
 * Verify PayU response hash:
 * sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
function verifyResponseHash(params) {
  const { key, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', status, hash } = params;
  const hashString = `${PAYU_SALT()}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  return sha512(hashString) === hash;
}

/**
 * POST /api/payment/initiate
 *
 * Returns PayU form fields (key, txnid, hash, etc.) to the frontend,
 * which then auto-submits a hidden form to PayU's payment page.
 */
router.post('/initiate', verifyToken, async (req, res) => {
  const { amount, planName, form, source, sourceLabel } = req.body;

  // userId is taken from the verified token — never from the request body — so a
  // user cannot initiate a payment that records against another user's account.
  // The value is signed into udf1 below and re-verified on the PayU callback.
  const userId = req.user.uid;

  if (!amount || !planName) {
    return res.status(400).json({ error: 'Missing required fields: amount, planName' });
  }

  const key       = PAYU_KEY();
  const txnid     = `LT-${Date.now()}`;
  const amountStr = Number(amount).toFixed(2);
  const { BASE_URL, FRONTEND_URL } = process.env;

  const surl = `${BASE_URL}/api/payment/redirect?txnId=${txnid}&planName=${encodeURIComponent(planName)}&userId=${encodeURIComponent(userId || '')}&amount=${amount}&source=${encodeURIComponent(source || 'unknown')}&sourceLabel=${encodeURIComponent(sourceLabel || '')}&status_type=success`;
  const furl = `${BASE_URL}/api/payment/redirect?txnId=${txnid}&planName=${encodeURIComponent(planName)}&userId=${encodeURIComponent(userId || '')}&amount=${amount}&source=${encodeURIComponent(source || 'unknown')}&sourceLabel=${encodeURIComponent(sourceLabel || '')}&status_type=failure`;

  const payuParams = {
    key,
    txnid,
    amount:      amountStr,
    productinfo: `LegalTerminus ${planName} Plan`,
    firstname:   form?.fullName   || '',
    email:       form?.email      || '',
    phone:       form?.mobile     || '',
    surl,
    furl,
    udf1:        userId           || '',
    udf2:        planName,
    udf3:        form?.mobile     || '',
  };

  const hash = computeRequestHash(payuParams);

  return res.json({
    payuUrl: PAYU_BASE_URL(),
    params:  { ...payuParams, hash },
    transactionId: txnid,
  });
});

/**
 * POST /api/payment/redirect
 *
 * PayU POSTs back here after payment (both success and failure).
 * We verify the hash, save to Firestore, then redirect to the frontend result page.
 */
router.post('/redirect', express.urlencoded({ extended: true }), async (req, res) => {
  const body = req.body;
  const { txnId, planName, userId, amount, source, sourceLabel } = req.query;
  const { FRONTEND_URL } = process.env;

  console.log(`PayU redirect: txnId=${txnId}, status=${body.status}, userId=${userId}`);

  if (!txnId) {
    return res.redirect(`${FRONTEND_URL}/payment/result?status=failed&reason=missing_transaction`);
  }

  // Verify response hash to prevent tampering
  const hashValid = verifyResponseHash({
    key:         body.key         || PAYU_KEY(),
    txnid:       body.txnid       || txnId,
    amount:      body.amount      || amount,
    productinfo: body.productinfo || '',
    firstname:   body.firstname   || '',
    email:       body.email       || '',
    udf1:        body.udf1        || userId || '',
    udf2:        body.udf2        || planName || '',
    udf3:        body.udf3        || '',
    udf4:        body.udf4        || '',
    udf5:        body.udf5        || '',
    status:      body.status,
    hash:        body.hash,
  });

  if (!hashValid) {
    console.error('PayU hash verification failed for txnId:', txnId);
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason: 'Hash verification failed' });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  }

  const payuStatus = body.status;           // 'success' | 'failure' | 'pending'
  const paymentId  = body.mihpayid || txnId;
  const isSuccess  = payuStatus === 'success';

  // Use the hash-protected udf1/udf2/amount from the verified PayU body as the
  // authoritative values. The query-string copies are unsigned and must not be
  // trusted to decide whose account gets credited or how much.
  const trustedUserId   = body.udf1   || userId;
  const trustedPlanName = body.udf2   || planName;
  const trustedAmount   = body.amount || amount;

  try {
    if (isSuccess) {
      await savePayment({ userId: trustedUserId, transactionId: txnId, paymentId, amount: trustedAmount, planName: trustedPlanName, source, sourceLabel, status: 'success' });
      const query = new URLSearchParams({ status: 'success', order_id: txnId, amount: trustedAmount, tracking_id: paymentId });
      return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
    }

    const reason = body.error_Message || body.field9 || 'Payment failed';
    await savePayment({ userId: trustedUserId, transactionId: txnId, paymentId, amount: trustedAmount, planName: trustedPlanName, source, sourceLabel, status: 'failed', failureReason: reason });
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  } catch (err) {
    console.error('PayU redirect handler error:', err.message);
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason: 'Server error' });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  }
});

/**
 * GET /api/payment/redirect
 *
 * Fallback for browser GET redirects (some PayU configurations send a GET).
 * Reads status from query params appended by us in surl/furl.
 */
router.get('/redirect', async (req, res) => {
  const { txnId, planName, userId, amount, source, sourceLabel, status_type } = req.query;
  const { FRONTEND_URL } = process.env;

  console.log(`PayU GET redirect: txnId=${txnId}, status_type=${status_type}`);

  if (!txnId) {
    return res.redirect(`${FRONTEND_URL}/payment/result?status=failed&reason=missing_transaction`);
  }

  // For GET redirects we can't verify hash (PayU doesn't send it on GET).
  // Do a server-side status check via PayU Verify API instead.
  try {
    const key    = PAYU_KEY();
    const salt   = PAYU_SALT();
    const cmdStr = 'verify_payment';
    const verifyHash = sha512(`${key}|${cmdStr}|${txnId}|${salt}`);

    const verifyRes = await axios.post(
      PAYU_VERIFY_URL(),
      new URLSearchParams({ key, command: cmdStr, var1: txnId, hash: verifyHash }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const txnData  = verifyRes.data?.transaction_details?.[txnId];
    const status   = txnData?.status;
    const paymentId = txnData?.mihpayid || txnId;
    const isSuccess = status === 'success';

    // Prefer the authoritative values returned by PayU's Verify API over the
    // unsigned query params, which the user controls. udf1=userId, udf2=planName
    // were set server-side from the verified token at /initiate.
    const trustedUserId   = txnData?.udf1 || userId;
    const trustedPlanName = txnData?.udf2 || planName;
    const trustedAmount   = txnData?.amt  || txnData?.amount || amount;

    console.log(`[PayU Verify] txnId=${txnId}, status=${status}`);

    if (isSuccess) {
      await savePayment({ userId: trustedUserId, transactionId: txnId, paymentId, amount: trustedAmount, planName: trustedPlanName, source, sourceLabel, status: 'success' });
      const query = new URLSearchParams({ status: 'success', order_id: txnId, amount: trustedAmount, tracking_id: paymentId });
      return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
    }

    const reason = txnData?.error_Message || 'Payment failed';
    await savePayment({ userId: trustedUserId, transactionId: txnId, paymentId, amount: trustedAmount, planName: trustedPlanName, source, sourceLabel, status: 'failed', failureReason: reason });
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  } catch (err) {
    console.error('PayU verify error:', err.response?.data || err.message);
    const query = new URLSearchParams({ status: 'failed', order_id: txnId, reason: 'Status check failed' });
    return res.redirect(`${FRONTEND_URL}/payment/result?${query}`);
  }
});

/* ─── helpers ─── */

async function savePayment({ userId, transactionId, paymentId, amount, planName, source, sourceLabel, status, failureReason }) {
  console.log(`[savePayment] userId=${userId}, txnId=${transactionId}, status=${status}, source=${source}`);

  if (!userId) {
    console.warn('[savePayment] userId is missing — payment NOT saved to database');
    return;
  }

  try {
    const db = getDb();
    await db.collection('users').doc(userId).collection('payments').doc(transactionId).set({
      orderId:       transactionId,
      paymentId:     paymentId || '',
      amount:        parseFloat(amount) || 0,
      planName:      planName || '',
      source:        source || 'unknown',
      sourceLabel:   sourceLabel || '',
      status,
      failureReason: failureReason || null,
      paymentDate:   new Date(),
      updatedAt:     new Date(),
    });

    console.log('[savePayment] Payment saved successfully');

    if (status === 'success') {
      await db.collection('users').doc(userId).update({
        currentPlan:   planName,
        paidPlanStart: new Date(),
        updatedAt:     new Date(),
      }).catch((err) => console.error('[savePayment] Error updating user subscription:', err));
    }
  } catch (err) {
    console.error('[savePayment] Error saving payment to Firestore:', err);
  }
}

export default router;
