/**
 * Website orders and payments (E24-S02 … S05). The rules are in
 * services/orders.service.js; this file is HTTP only.
 */
import { logger } from '../config/logger.js';
import { getDb } from '../config/firebase.js';
import {
  activeGateway, gateway, parseWebhookEvent, simulator,
} from '../services/paymentGateway.service.js';
import {
  applyGatewayEvent, confirmReturn, createOrder, getOrder, listOrders, markFailed,
  publicOrder, reconcile, retryMatter,
} from '../services/orders.service.js';

const fail = (res, err, context) => {
  if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message, code: err.code });
  if (err?.status === 502 || err?.status === 503) return res.status(err.status).json({ message: err.message, code: err.code });
  logger.error({ err }, context);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

const isStaff = (req) => ['admin', 'manager'].includes(req.user?.role);

/** GET /api/orders/config — is online payment on, and through which gateway. Public. */
export function getPaymentConfig(_req, res) {
  res.json({ enabled: !!activeGateway(), gateway: activeGateway() });
}

/** POST /api/orders — start an order for a plan. The amount is the server's. */
export async function postOrder(req, res) {
  try {
    const { productKey, planId, customer, simulate } = req.body;
    const profile = await getDb().collection('users').doc(req.user.uid).get();
    const p = profile.exists ? profile.data() : {};
    const order = await createOrder({
      uid: req.user.uid,
      // Identity comes from the token and the stored profile, not the request.
      customer: {
        name: customer?.name || p.name || p.fullName || req.user.name || '',
        email: req.user.email || p.email || '',
        phone: customer?.phone || p.phone || p.mobile || '',
      },
      productKey, planId, simulate,
    });
    res.status(201).json({ ...publicOrder(order), checkout: order.checkout });
  } catch (err) { fail(res, err, 'postOrder error'); }
}

/** GET /api/orders/:orderId — the customer's own order (staff may read any). */
export async function getOrderById(req, res) {
  try {
    const order = await getOrder(req.params.orderId);
    if (!order || (order.uid !== req.user.uid && !isStaff(req))) return res.status(404).json({ message: 'Order not found.' });
    res.json(isStaff(req) ? order : publicOrder(order));
  } catch (err) { fail(res, err, 'getOrderById error'); }
}

/** POST /api/orders/:orderId/verify — the signed result the checkout handed the browser. */
export async function postVerify(req, res) {
  try {
    const { order } = await confirmReturn(req.params.orderId, req.user.uid, req.body);
    res.json(publicOrder(order));
  } catch (err) { fail(res, err, 'postVerify error'); }
}

/** POST /api/orders/:orderId/failed — the customer cancelled or was declined. */
export async function postFailed(req, res) {
  try {
    res.json(publicOrder(await markFailed(req.params.orderId, req.user.uid, req.body?.reason)));
  } catch (err) { fail(res, err, 'postFailed error'); }
}

/**
 * POST /api/orders/webhook — the gateway telling us what happened, whether or
 * not the customer's browser ever came back. PUBLIC by necessity (the gateway
 * has no token), so the signature over the RAW body is the whole of its
 * authentication: an unsigned or mis-signed call changes nothing.
 */
export async function postWebhook(req, res) {
  try {
    const gw = gateway();
    if (!gw) return res.status(503).json({ message: 'Payments are off.' });
    const signature = req.get('x-razorpay-signature') || '';
    const raw = req.rawBody ? req.rawBody.toString('utf8') : '';
    if (!raw || !gw.verifyWebhookSignature(raw, signature)) {
      logger.warn({ security: true }, 'orders: webhook signature did not verify');
      return res.status(400).json({ message: 'Invalid signature.' });
    }
    const event = parseWebhookEvent(req.body);
    // An event we do not act on is acknowledged, or the gateway would retry it forever.
    if (!event) return res.json({ received: true, handled: false });
    res.json({ received: true, ...(await applyGatewayEvent(event)) });
  } catch (err) {
    // 500 so the gateway retries: a payment must not be lost to a passing failure.
    logger.error({ err }, 'postWebhook error');
    res.status(500).json({ message: 'Temporary failure.' });
  }
}

/** GET /api/orders — staff: every order, newest first. */
export async function getOrders(req, res) {
  try {
    res.json(await listOrders({ limit: req.query.limit, cursor: req.query.cursor }));
  } catch (err) { fail(res, err, 'getOrders error'); }
}

/** POST /api/orders/:orderId/retry-matter — staff: open the matter a paid order lacks. */
export async function postRetryMatter(req, res) {
  try { res.json(await retryMatter(req.params.orderId)); } catch (err) { fail(res, err, 'postRetryMatter error'); }
}

/** POST /api/orders/:orderId/reconcile — staff: ask the gateway what really happened. */
export async function postReconcile(req, res) {
  try {
    const { order, outcome } = await reconcile(req.params.orderId);
    res.json({ outcome, order });
  } catch (err) { fail(res, err, 'postReconcile error'); }
}

/**
 * POST /api/orders/:orderId/simulate — TEST ENVIRONMENTS ONLY. Plays the part
 * of the customer at the gateway. Answers 404 wherever the simulator is not the
 * active gateway, which is everywhere but QA and the local test stack.
 */
export async function postSimulate(req, res) {
  try {
    const sim = simulator();
    if (!sim) return res.status(404).json({ message: 'Not found.' });
    const order = await getOrder(req.params.orderId);
    if (!order || order.uid !== req.user.uid) return res.status(404).json({ message: 'Order not found.' });
    const g = order.gatewayOrderId;
    const deliver = async (event, fields) => {
      const { rawBody, signature } = sim.webhook(event, { gatewayOrderId: g, ...fields });
      if (!sim.verifyWebhookSignature(rawBody, signature)) throw new Error('simulator signed a webhook it cannot verify');
      const parsed = parseWebhookEvent(JSON.parse(rawBody));
      return applyGatewayEvent(parsed);
    };

    switch (req.body.outcome) {
      case 'success': {
        const paid = await sim.pay(g);
        return res.json({ gatewayPaymentId: paid.gatewayPaymentId, signature: paid.signature });
      }
      case 'bad_signature': {
        const paid = await sim.pay(g);
        return res.json({ gatewayPaymentId: paid.gatewayPaymentId, signature: 'not-the-real-signature' });
      }
      case 'failure':
        return res.json({ error: { reason: 'Your bank declined the payment.' } });
      case 'success_webhook': {
        const paid = await sim.pay(g);
        return res.json({ delivered: await deliver('payment.captured', { gatewayPaymentId: paid.gatewayPaymentId, amount: paid.amount }) });
      }
      case 'duplicate_webhook': {
        const paid = await sim.pay(g);
        const first = await deliver('payment.captured', { gatewayPaymentId: paid.gatewayPaymentId, amount: paid.amount });
        const second = await deliver('payment.captured', { gatewayPaymentId: paid.gatewayPaymentId, amount: paid.amount });
        return res.json({ delivered: [first, second] });
      }
      case 'amount_mismatch': {
        const paid = await sim.pay(g, { amount: order.amount - 1 });
        return res.json({ delivered: await deliver('payment.captured', { gatewayPaymentId: paid.gatewayPaymentId, amount: paid.amount }) });
      }
      case 'paid_silently': {
        await sim.pay(g);
        return res.json({ note: 'Paid at the gateway; nothing was sent to us.' });
      }
      case 'failed_webhook':
        return res.json({ delivered: await deliver('payment.failed', { gatewayPaymentId: null, amount: order.amount, reason: 'Your bank declined the payment.' }) });
      case 'refund':
        return res.json({ delivered: await deliver('refund.processed', { gatewayPaymentId: order.gatewayPaymentId, amount: order.amount }) });
      default:
        return res.status(400).json({ message: 'Unknown outcome.' });
    }
  } catch (err) { fail(res, err, 'postSimulate error'); }
}
