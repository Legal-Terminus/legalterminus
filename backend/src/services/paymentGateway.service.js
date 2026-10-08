/**
 * The payment gateway, behind one small interface (E24-S02).
 *
 *   createOrder({ amount, receipt })      → { gatewayOrderId }
 *   verifyPaymentSignature({ gatewayOrderId, gatewayPaymentId, signature })
 *   verifyWebhookSignature(rawBody, signature)
 *   fetchOrder(gatewayOrderId)            → { paid, gatewayPaymentId, amount, method } | null
 *   fetchPayment(gatewayOrderId, id)      → { ok, amount, method } | null   (one specific payment)
 *   checkout(...)                         → what the browser needs to open the payment screen
 *
 * TWO IMPLEMENTATIONS.
 *
 * `razorpay` — the real one. Active when RAZORPAY_KEY_ID and
 * RAZORPAY_KEY_SECRET are set.
 *
 * `simulated` — a stand-in used to build and test everything AROUND the
 * gateway before its keys exist. It signs and verifies exactly the way Razorpay
 * does (HMAC-SHA256 over "order_id|payment_id"; HMAC-SHA256 over the raw
 * webhook body) and speaks Razorpay's webhook payload shape, so the order,
 * settlement and failure-handling code is exercised unchanged. What it does NOT
 * exercise is Razorpay's own API and checkout script.
 *
 * THE SIMULATOR CAN TAKE "PAYMENT" FOR FREE, so it is refused outside a test
 * environment whatever the configuration says: it needs PAYMENT_GATEWAY=simulated
 * AND a deployment guarded by TEST_ACCOUNT_EMAIL_DOMAINS (config/testEnvironment.js).
 * Production sets neither.
 *
 * With no gateway configured, payments are simply off: `activeGateway()` is
 * null and the order endpoint answers 503.
 */
import crypto from 'crypto';
import { getDb } from '../config/firebase.js';
import { isTestEnvironment } from '../config/testEnvironment.js';

const hmac = (secret, data) => crypto.createHmac('sha256', secret).update(data).digest('hex');
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a ?? '')); const y = Buffer.from(String(b ?? ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/** Which gateway this deployment uses: 'razorpay', 'simulated' or null (payments off). */
export function activeGateway(env = process.env) {
  if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) return 'razorpay';
  if (String(env.PAYMENT_GATEWAY ?? '').toLowerCase() === 'simulated' && isTestEnvironment()) return 'simulated';
  return null;
}

/* ───────────── shared: Razorpay's signature scheme, used by both ───────────── */

export const paymentSignature = (secret, gatewayOrderId, gatewayPaymentId) =>
  hmac(secret, `${gatewayOrderId}|${gatewayPaymentId}`);

/**
 * A gateway webhook, reduced to what we act on. Razorpay's payload shape:
 *   { event, payload: { payment: { entity: { id, order_id, amount (paise), method, error_description } },
 *                       refund:  { entity: { payment_id, amount } } } }
 * Returns null for an event we do not handle.
 */
export function parseWebhookEvent(body) {
  const payment = body?.payload?.payment?.entity;
  if (!payment?.order_id) return null;
  const base = {
    gatewayOrderId: payment.order_id,
    gatewayPaymentId: payment.id ?? null,
    amount: Number.isFinite(payment.amount) ? payment.amount / 100 : null, // paise → rupees
    method: payment.method ?? null,
  };
  switch (body.event) {
    case 'payment.captured':
    case 'order.paid':
      return { type: 'paid', ...base };
    case 'payment.failed':
      return { type: 'failed', ...base, reason: payment.error_description || 'Payment failed' };
    case 'refund.processed':
    case 'refund.created':
      return { type: 'refunded', ...base };
    default:
      return null;
  }
}

/* ───────────────────────────── simulated ───────────────────────────── */

// Not a secret worth protecting: the simulator only exists where no money moves.
const SIM_SECRET = 'simulated-gateway-secret';
const SIM_COLLECTION = 'paymentSimulator';

const simulated = {
  name: 'simulated',
  async createOrder({ amount, receipt, simulate }) {
    // Lets a test exercise "the gateway is unreachable" without a real outage.
    if (simulate === 'gateway_down') throw new Error('Simulated gateway outage');
    const gatewayOrderId = `sim_order_${crypto.randomBytes(9).toString('hex')}`;
    await getDb().collection(SIM_COLLECTION).doc(gatewayOrderId).set({
      amount, receipt, paid: false, createdAt: new Date().toISOString(),
    });
    return { gatewayOrderId };
  },
  verifyPaymentSignature: ({ gatewayOrderId, gatewayPaymentId, signature }) =>
    safeEqual(paymentSignature(SIM_SECRET, gatewayOrderId, gatewayPaymentId), signature),
  verifyWebhookSignature: (rawBody, signature) => safeEqual(hmac(SIM_SECRET, rawBody), signature),
  async fetchOrder(gatewayOrderId) {
    const snap = await getDb().collection(SIM_COLLECTION).doc(gatewayOrderId).get();
    if (!snap.exists) return null;
    const d = snap.data();
    return { paid: d.paid === true, gatewayPaymentId: d.paymentId ?? null, amount: d.paidAmount ?? d.amount, method: d.method ?? null };
  },
  async fetchPayment(gatewayOrderId, gatewayPaymentId) {
    const snap = await getDb().collection(SIM_COLLECTION).doc(gatewayOrderId).get();
    const d = snap.exists ? snap.data() : null;
    if (!d || d.paymentId !== gatewayPaymentId) return null;
    return { ok: d.paid === true, amount: d.paidAmount ?? d.amount, method: d.method ?? null };
  },
  checkout: ({ gatewayOrderId }) => ({ gateway: 'simulated', gatewayOrderId }),

  /* The simulator's own controls — what "the customer did at the gateway". */
  /** Record a payment at the pretend gateway. Returns what Razorpay's checkout would hand the browser. */
  async pay(gatewayOrderId, { amount, method = 'upi' } = {}) {
    const ref = getDb().collection(SIM_COLLECTION).doc(gatewayOrderId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('Unknown simulated order');
    const gatewayPaymentId = snap.data().paymentId ?? `sim_pay_${crypto.randomBytes(9).toString('hex')}`;
    const paidAmount = amount ?? snap.data().amount;
    await ref.set({ paid: true, paymentId: gatewayPaymentId, paidAmount, method, paidAt: new Date().toISOString() }, { merge: true });
    return { gatewayPaymentId, signature: paymentSignature(SIM_SECRET, gatewayOrderId, gatewayPaymentId), amount: paidAmount, method };
  },
  /** A signed webhook exactly as Razorpay would send it: { rawBody, signature }. */
  webhook(event, { gatewayOrderId, gatewayPaymentId, amount, method = 'upi', reason }) {
    const rawBody = JSON.stringify({
      event,
      payload: { payment: { entity: {
        id: gatewayPaymentId, order_id: gatewayOrderId, amount: Math.round(amount * 100), method,
        ...(reason ? { error_description: reason } : {}),
      } } },
    });
    return { rawBody, signature: hmac(SIM_SECRET, rawBody) };
  },
};

/* ───────────────────────────── razorpay ───────────────────────────── */

const razorpay = {
  name: 'razorpay',
  async client() {
    const { default: Razorpay } = await import('razorpay');
    return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  },
  async createOrder({ amount, receipt }) {
    const order = await (await this.client()).orders.create({
      amount: Math.round(amount * 100), currency: 'INR', receipt, payment_capture: 1,
    });
    return { gatewayOrderId: order.id };
  },
  verifyPaymentSignature: ({ gatewayOrderId, gatewayPaymentId, signature }) =>
    safeEqual(paymentSignature(process.env.RAZORPAY_KEY_SECRET, gatewayOrderId, gatewayPaymentId), signature),
  verifyWebhookSignature: (rawBody, signature) => !!process.env.RAZORPAY_WEBHOOK_SECRET
    && safeEqual(hmac(process.env.RAZORPAY_WEBHOOK_SECRET, rawBody), signature),
  async fetchOrder(gatewayOrderId) {
    const rz = await this.client();
    const order = await rz.orders.fetch(gatewayOrderId);
    if (!order) return null;
    const payments = await rz.orders.fetchPayments(gatewayOrderId);
    const captured = (payments?.items ?? []).find((p) => p.status === 'captured');
    return {
      paid: order.status === 'paid' || !!captured,
      gatewayPaymentId: captured?.id ?? null,
      amount: captured ? captured.amount / 100 : order.amount_paid / 100,
      method: captured?.method ?? null,
    };
  },
  /**
   * One payment, by id. A payment the customer has just completed is first
   * `authorized` and becomes `captured` a moment later (orders are created with
   * auto-capture). Both mean the customer has paid; asking the ORDER instead
   * would say "not paid" during that moment — learned from the live test API.
   */
  async fetchPayment(gatewayOrderId, gatewayPaymentId) {
    const p = await (await this.client()).payments.fetch(gatewayPaymentId);
    if (!p || p.order_id !== gatewayOrderId) return null;
    return { ok: p.status === 'captured' || p.status === 'authorized', amount: p.amount / 100, method: p.method ?? null };
  },
  // The key id is public — it is what Razorpay's checkout script is opened with.
  checkout: ({ gatewayOrderId }) => ({ gateway: 'razorpay', gatewayOrderId, keyId: process.env.RAZORPAY_KEY_ID }),
};

const GATEWAYS = { simulated, razorpay };

/** The active gateway's implementation, or null when payments are off. */
export const gateway = () => GATEWAYS[activeGateway()] ?? null;
/** The simulator, only when it is the active gateway — null everywhere else. */
export const simulator = () => (activeGateway() === 'simulated' ? simulated : null);
