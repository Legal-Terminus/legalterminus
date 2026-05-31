import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getDb } from '../config/firebase.js';

const router = express.Router();

function getRazorpayInstance() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * POST /api/payment/create-order
 *
 * Creates a Razorpay order and returns { orderId, amount, currency, keyId }.
 * The frontend uses keyId + orderId to open the Razorpay checkout popup.
 */
router.post('/create-order', async (req, res) => {
  const { amount, planName, userId } = req.body;

  if (!amount || !planName) {
    return res.status(400).json({ error: 'Missing required fields: amount, planName' });
  }

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay credentials are not configured on the server.' });
  }

  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount:   Math.round(Number(amount) * 100), // convert to paise
      currency: 'INR',
      receipt:  `LT-${Date.now()}`,
      notes:    { planName, userId: userId || '' },
    });

    return res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

/**
 * POST /api/payment/verify
 *
 * Verifies the Razorpay payment signature (HMAC-SHA256) received from the
 * frontend after the user completes payment in the Razorpay popup.
 * On success, saves the transaction to Firestore.
 */
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName, userId, amount } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  const { RAZORPAY_KEY_SECRET } = process.env;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    console.error('Razorpay signature mismatch');
    return res.status(400).json({ error: 'Payment signature verification failed' });
  }

  // Save to Firestore
  if (userId) {
    try {
      const db = getDb();
      await db.collection('users').doc(userId).collection('payments').doc(razorpay_order_id).set({
        orderId:   razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount:    parseFloat(amount) || 0,
        planName:  planName || '',
        status:    'success',
        paymentDate: new Date(),
        updatedAt:   new Date(),
      });

      await db.collection('users').doc(userId).update({
        currentPlan:   planName,
        paidPlanStart: new Date(),
        updatedAt:     new Date(),
      }).catch((err) => console.error('Error updating user subscription:', err));
    } catch (err) {
      console.error('Error saving payment to Firestore:', err);
    }
  }

  return res.json({ success: true });
});

export default router;
