/**
 * Website orders (E24-S02 … S05): what a customer bought, whether it is paid,
 * and what happened as a result.
 *
 * One document per order in `paymentOrders/{orderId}`. Its `status`:
 *
 *   created ─▶ paid ─▶ refunded
 *      │  └──▶ review        (money arrived, but not the amount we asked for)
 *      ├──▶ failed           (declined or cancelled — may still become paid)
 *      └──▶ abandoned        (never completed — may still become paid)
 *
 * THE RULES THIS MODULE EXISTS TO KEEP
 *
 * 1. The AMOUNT comes from the price catalogue (`resolvePlan`), never from the
 *    request.
 * 2. An order becomes paid only on a VERIFIED signal: a signed return from the
 *    checkout, a signed webhook, or the gateway's own answer when asked.
 * 3. A payment is settled EXACTLY ONCE. The return and the webhook can arrive
 *    in either order, or twice; the transaction in `settlePaid` lets only the
 *    first one change the order, and `fulfil` claims the follow-up work so a
 *    matter is opened once.
 * 4. A payment is never lost to a later failure. If opening the matter fails,
 *    the order stays paid and says so, and staff can retry.
 *
 * `decideSettlement` and `matterOutcome` are pure and unit-tested.
 */
import crypto from 'crypto';
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { resolvePlan } from './pricing.service.js';
import { gateway } from './paymentGateway.service.js';
import { getCompiledForServiceKey } from './workflowDefinitions.service.js';
import { createNotification } from '../controllers/notifications.controller.js';
import { sendNotificationEmail, publicSiteUrl } from './emailService.js';

export const COLLECTION = 'paymentOrders';
/** An order nobody completed is marked abandoned after this long. */
export const ABANDON_AFTER_MS = 30 * 60 * 1000;

const httpError = (status, message, code) => Object.assign(new Error(message), { status, code });
const col = () => getDb().collection(COLLECTION);
const nowIso = () => new Date().toISOString();

/** `LT-20261004-7F3K2Q` — short enough to read out on a phone call. */
export function newOrderId(now = new Date()) {
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  const tail = crypto.randomBytes(4).toString('base64url').replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase().padEnd(6, 'X');
  return `LT-${day}-${tail}`;
}

/**
 * What a verified payment does to an order. Pure.
 *   noop   — already settled; this is a repeat. Change nothing.
 *   review — money arrived but it is not the amount we asked for. Record it,
 *            open nothing, tell staff.
 *   paid   — settle it.
 */
export function decideSettlement(order, payment) {
  if (['paid', 'review', 'refunded'].includes(order.status)) return { action: 'noop' };
  if (payment.amount != null && Math.round(payment.amount * 100) !== Math.round(order.amount * 100)) {
    return { action: 'review', reason: `Paid ₹${payment.amount}, expected ₹${order.amount}.` };
  }
  return { action: 'paid' };
}

/** Whether a paid order opens a matter by itself. Pure. */
export function matterOutcome(order, hasWorkflow) {
  if (!order.serviceKey) return { open: false, why: 'This service is not linked to a portal service.' };
  if (!hasWorkflow) return { open: false, why: 'The linked portal service has no workflow yet.' };
  return { open: true };
}

/** What the customer may see of their own order. */
export function publicOrder(o) {
  return {
    orderId: o.orderId, status: o.status, productCode: o.productCode ?? '', label: o.label, planName: o.planName,
    amount: o.amount, currency: o.currency, createdAt: o.createdAt, paidAt: o.paidAt ?? null,
    paymentReference: o.gatewayPaymentId ?? null, failureReason: o.failureReason ?? null,
    // Whether there is a matter to go and look at — not its internal state.
    matterId: o.matter?.state === 'created' ? o.matter.taskId : null,
  };
}

/* ───────────────────────────── I/O below ───────────────────────────── */

export async function getOrder(orderId) {
  const snap = await col().doc(orderId).get();
  return snap.exists ? { orderId: snap.id, ...snap.data() } : null;
}

async function activeAdmins() {
  const snap = await getDb().collection('users').where('role', '==', 'admin').get();
  return snap.docs.filter((d) => d.data().status !== 'deactivated').map((d) => d.id);
}

async function tellStaff(title, message, taskId) {
  try {
    for (const uid of await activeAdmins()) {
      await createNotification({ recipientUid: uid, type: 'info', title, message, taskId: taskId ?? undefined });
    }
  } catch (err) {
    logger.warn({ err }, 'orders: could not notify staff');
  }
}

/**
 * Start an order. The gateway order is created FIRST: if the gateway cannot be
 * reached nothing is stored, so there is no half-made order to explain later.
 */
export async function createOrder({ uid, customer, productKey, planId, simulate }) {
  const gw = gateway();
  if (!gw) throw httpError(503, 'Online payment is not available right now.', 'PAYMENTS_OFF');
  const plan = await resolvePlan(productKey, planId);
  if (!plan) throw httpError(404, 'That plan is not available.', 'PLAN_NOT_FOUND');

  const orderId = newOrderId();
  let gatewayOrderId;
  try {
    ({ gatewayOrderId } = await gw.createOrder({ amount: plan.amount, receipt: orderId, simulate }));
  } catch (err) {
    logger.error({ err, productKey, planId }, 'orders: the gateway could not create an order');
    throw httpError(502, 'We could not reach the payment service. Please try again in a few minutes.', 'GATEWAY_UNAVAILABLE');
  }

  const order = {
    uid, customer: customer ?? {},
    productKey, productCode: plan.productCode ?? '', planId, label: plan.label, planName: plan.planName, serviceKey: plan.serviceKey,
    amount: plan.amount, currency: 'INR',
    status: 'created', gateway: gw.name, gatewayOrderId,
    matter: { state: 'none' },
    createdAt: nowIso(), updatedAt: nowIso(),
  };
  await col().doc(orderId).set(order);
  logger.info({ orderId, uid, productKey, planId, amount: plan.amount, gateway: gw.name }, 'orders: created');
  return { orderId, ...order, checkout: gw.checkout({ gatewayOrderId }) };
}

/**
 * Record a verified payment. Returns { order, outcome } where outcome is
 * 'paid' | 'review' | 'noop'. Only the FIRST verified signal changes the order.
 */
export async function settlePaid(orderId, payment, source) {
  const ref = col().doc(orderId);
  const outcome = await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw httpError(404, 'Order not found.');
    const decision = decideSettlement(snap.data(), payment);
    if (decision.action === 'noop') return 'noop';
    const common = {
      gatewayPaymentId: payment.gatewayPaymentId ?? null, method: payment.method ?? null,
      amountPaid: payment.amount ?? snap.data().amount, settledBy: source,
      failureReason: null, updatedAt: nowIso(),
    };
    if (decision.action === 'review') {
      tx.set(ref, { ...common, status: 'review', reviewReason: decision.reason, paidAt: nowIso() }, { merge: true });
      return 'review';
    }
    tx.set(ref, { ...common, status: 'paid', paidAt: nowIso() }, { merge: true });
    return 'paid';
  });

  const order = await getOrder(orderId);
  if (outcome === 'paid') {
    logger.info({ orderId, source, gatewayPaymentId: payment.gatewayPaymentId }, 'orders: paid');
    await fulfil(orderId);
  } else if (outcome === 'review') {
    logger.warn({ orderId, source, expected: order.amount, paid: payment.amount }, 'orders: amount mismatch — held for review');
    await tellStaff('Website payment needs review',
      `Order ${orderId} (${order.label} — ${order.planName}): ${order.reviewReason} No matter was opened.`);
  }
  return { order: await getOrder(orderId), outcome };
}

/**
 * Everything that follows a payment: the customer's order history, the matter,
 * the staff alert, the confirmation email. Claimed in a transaction so two
 * simultaneous confirmations cannot both open a matter. Never throws — a
 * failure here must not undo a payment.
 */
export async function fulfil(orderId, { retry = false } = {}) {
  const ref = col().doc(orderId);
  const claimed = await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const o = snap.data();
    if (!snap.exists || o.status !== 'paid') return null;
    const state = o.matter?.state ?? 'none';
    if (state === 'created' || state === 'not_applicable') return null;
    if (state === 'pending' && !retry) return null;
    // update(), not a merge: `matter` is replaced whole, so an old error or
    // reason cannot linger beside a new state.
    tx.update(ref, { matter: { state: 'pending' }, updatedAt: nowIso() });
    return { orderId, ...o };
  });
  if (!claimed) return getOrder(orderId);
  const o = claimed;

  // The customer's own order history (what "My Orders" reads).
  try {
    await getDb().collection('users').doc(o.uid).collection('payments').doc(orderId).set({
      orderId, paymentId: o.gatewayPaymentId ?? '', amount: o.amount,
      planName: `${o.label} — ${o.planName}`, source: o.productKey, sourceLabel: o.label,
      status: 'success', failureReason: null, paymentDate: new Date(), updatedAt: new Date(),
    });
  } catch (err) {
    logger.warn({ err, orderId }, 'orders: could not write the customer order history');
  }

  let matter;
  let hasWorkflow = false;
  try {
    hasWorkflow = !!(o.serviceKey && await getCompiledForServiceKey(o.serviceKey));
  } catch { /* treated as no workflow */ }
  const plan = matterOutcome(o, hasWorkflow);
  if (!plan.open) {
    matter = { state: 'not_applicable', reason: plan.why };
  } else {
    try {
      matter = { state: 'created', taskId: await openMatter(o) };
    } catch (err) {
      logger.error({ err, orderId }, 'orders: paid, but the matter could not be opened');
      matter = { state: 'failed', error: err?.message || 'The matter could not be opened.' };
    }
  }
  await ref.update({ matter, updatedAt: nowIso() });

  const who = o.customer?.name || o.customer?.email || 'A customer';
  const paid = `₹${o.amount.toLocaleString('en-IN')}`;
  if (matter.state === 'created') {
    await tellStaff('Website order paid — matter opened',
      `${who} paid ${paid} for ${o.label} — ${o.planName} (order ${orderId}). A matter has been opened.`, matter.taskId);
  } else if (matter.state === 'failed') {
    await tellStaff('Website order paid — the matter could NOT be opened',
      `${who} paid ${paid} for ${o.label} — ${o.planName} (order ${orderId}), but the matter could not be opened: ${matter.error} Open it by hand or retry from the order.`);
  } else {
    await tellStaff('Website order paid — open the matter by hand',
      `${who} paid ${paid} for ${o.label} — ${o.planName} (order ${orderId}). ${matter.reason} Please open the matter.`);
  }

  if (o.customer?.email) {
    sendNotificationEmail({
      to: o.customer.email,
      title: 'Payment received',
      message: [
        `Thank you. We have received your payment of ${paid} for ${o.label} — ${o.planName}.`,
        '', `Order reference: ${orderId}`,
        '', 'Our team will be in touch shortly. You can follow progress in your portal.',
      ].join('\n'),
      action: { label: 'Open your portal', url: `${publicSiteUrl()}/portal/` },
    }).catch((err) => logger.warn({ err, orderId }, 'orders: confirmation email failed'));
  }
  return getOrder(orderId);
}

/**
 * Open the matter for a paid order, through the same code an admin's "Create
 * Matter" uses — so the workflow, the steps, the payment history and the
 * assignment rules are identical. A matter already opened for this order is
 * reused instead of being opened twice.
 */
async function openMatter(o) {
  const db = getDb();
  const existing = await db.collection('tasks').where('websiteOrderId', '==', o.orderId).limit(1).get();
  if (!existing.empty) return existing.docs[0].id;

  const { createTask } = await import('../controllers/tasks.controller.js');
  const result = {};
  const res = {
    status(code) { result.code = code; return this; },
    json(body) { result.body = body; return this; },
  };
  await createTask({
    // Paid in full by the customer, so it is opened as an admin's fully-paid
    // matter is: live, not waiting for approval.
    user: { uid: 'system:website-order', role: 'admin' },
    body: {
      clientUid: o.uid, serviceKey: o.serviceKey,
      paymentStatus: 'fully_paid', totalCost: o.amount, amountReceived: o.amount,
      paymentMode: o.gateway === 'simulated' ? 'Online (test payment)' : 'Online (Razorpay)',
      paymentDescription: `Website order ${o.orderId}${o.gatewayPaymentId ? `, payment ${o.gatewayPaymentId}` : ''}`,
    },
  }, res);
  if (result.code !== 201 || !result.body?.id) {
    throw new Error(result.body?.message || `The matter could not be opened (${result.code ?? 'no response'}).`);
  }
  await db.collection('tasks').doc(result.body.id).set({ websiteOrderId: o.orderId }, { merge: true });
  return result.body.id;
}

/** The customer came back with a signed result from the checkout. */
export async function confirmReturn(orderId, uid, { gatewayPaymentId, signature }) {
  const order = await getOrder(orderId);
  if (!order || order.uid !== uid) throw httpError(404, 'Order not found.');
  const gw = gateway();
  if (!gw) throw httpError(503, 'Online payment is not available right now.', 'PAYMENTS_OFF');
  if (!gw.verifyPaymentSignature({ gatewayOrderId: order.gatewayOrderId, gatewayPaymentId, signature })) {
    // Someone is claiming a payment they cannot prove. Never settle on it.
    logger.warn({ orderId, uid, security: true }, 'orders: payment signature did not verify');
    throw httpError(400, 'We could not confirm this payment. If money was taken, it will be matched automatically.', 'BAD_SIGNATURE');
  }
  // The signature proves the ids; the gateway's own record gives the amount.
  const at = await gw.fetchOrder(order.gatewayOrderId).catch(() => null);
  if (at && at.paid === false) throw httpError(409, 'The payment is not complete yet.', 'NOT_PAID');
  return settlePaid(orderId, { gatewayPaymentId, amount: at?.amount ?? null, method: at?.method ?? null }, 'return');
}

/** The customer cancelled, or the payment was declined. Only a `created` order changes. */
export async function markFailed(orderId, uid, reason) {
  const ref = col().doc(orderId);
  await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists || (uid && snap.data().uid !== uid)) throw httpError(404, 'Order not found.');
    if (snap.data().status !== 'created') return; // a paid order is never turned back into a failed one
    tx.set(ref, { status: 'failed', failureReason: String(reason || 'Payment was not completed.').slice(0, 300), updatedAt: nowIso() }, { merge: true });
  });
  return getOrder(orderId);
}

/** A signed message from the gateway, already verified by the caller. */
export async function applyGatewayEvent(event) {
  const snap = await col().where('gatewayOrderId', '==', event.gatewayOrderId).limit(1).get();
  if (snap.empty) {
    logger.warn({ gatewayOrderId: event.gatewayOrderId, type: event.type }, 'orders: webhook for an order we do not have');
    return { handled: false };
  }
  const orderId = snap.docs[0].id;
  if (event.type === 'paid') {
    const { outcome } = await settlePaid(orderId, event, 'webhook');
    return { handled: true, orderId, outcome };
  }
  if (event.type === 'failed') {
    await markFailed(orderId, null, event.reason);
    return { handled: true, orderId, outcome: 'failed' };
  }
  if (event.type === 'refunded') {
    const changed = await getDb().runTransaction(async (tx) => {
      const s = await tx.get(col().doc(orderId));
      if (!['paid', 'review'].includes(s.data().status)) return false;
      tx.set(col().doc(orderId), { status: 'refunded', refundedAt: nowIso(), updatedAt: nowIso() }, { merge: true });
      return true;
    });
    if (changed) {
      const o = await getOrder(orderId);
      // The matter is deliberately left alone: whether work stops is a decision for a person.
      await tellStaff('Website order refunded',
        `Order ${orderId} (${o.label} — ${o.planName}) was refunded at the payment gateway.${o.matter?.taskId ? ' Its matter is still open — decide what to do with it.' : ''}`,
        o.matter?.taskId);
    }
    return { handled: true, orderId, outcome: changed ? 'refunded' : 'noop' };
  }
  return { handled: false };
}

/**
 * Ask the gateway what really happened to an order — for a payment that
 * succeeded there but never reached us (the browser closed and the webhook was
 * lost, or our write failed).
 */
export async function reconcile(orderId) {
  const order = await getOrder(orderId);
  if (!order) throw httpError(404, 'Order not found.');
  const gw = gateway();
  if (!gw) throw httpError(503, 'Online payment is not available right now.', 'PAYMENTS_OFF');
  const at = await gw.fetchOrder(order.gatewayOrderId);
  if (!at?.paid) return { order, outcome: 'not_paid' };
  return settlePaid(orderId, { gatewayPaymentId: at.gatewayPaymentId, amount: at.amount, method: at.method }, 'reconcile');
}

/** Mark orders nobody completed as abandoned. Cheap: only `created` orders are read. */
export async function expireStaleOrders(now = Date.now()) {
  const snap = await col().where('status', '==', 'created').limit(200).get();
  const stale = snap.docs.filter((d) => now - new Date(d.data().createdAt).getTime() > ABANDON_AFTER_MS);
  for (const d of stale) {
    await d.ref.set({ status: 'abandoned', updatedAt: nowIso() }, { merge: true });
  }
  return stale.length;
}

/** Staff list: newest first, one page. */
export async function listOrders({ limit = 25, cursor } = {}) {
  await expireStaleOrders().catch(() => {});
  let q = col().orderBy('createdAt', 'desc').limit(limit + 1);
  if (cursor) {
    const after = await col().doc(cursor).get();
    if (after.exists) q = q.startAfter(after);
  }
  const snap = await q.get();
  const rows = snap.docs.map((d) => ({ orderId: d.id, ...d.data() }));
  return { data: rows.slice(0, limit), nextCursor: rows.length > limit ? rows[limit - 1].orderId : null };
}

/** Staff: try again to open the matter of a paid order that has none. */
export async function retryMatter(orderId) {
  const order = await getOrder(orderId);
  if (!order) throw httpError(404, 'Order not found.');
  if (order.status !== 'paid') throw httpError(409, 'Only a paid order can have a matter opened.');
  if (order.matter?.state === 'created') return order;
  await col().doc(orderId).update({ matter: { state: 'none' } });
  return fulfil(orderId, { retry: true });
}
