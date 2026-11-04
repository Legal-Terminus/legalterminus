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
 * 5. A matter is opened only after a member of staff APPROVES the paid order
 *    (#212, decided by the firm 2026-10-12). Payment alone opens nothing.
 *
 * The order's `matter.state`:
 *
 *   none ─▶ awaiting_approval ─▶ pending ─▶ created
 *      │                            └─────▶ failed      (staff retry)
 *      └──▶ not_applicable    (no linked service, or it has no workflow)
 *
 * AMOUNTS (#212): `price` is the catalogue price, `gst` the GST added to it,
 * and `amount` the total charged — the figure every payment check compares.
 *
 * PAY NOW (#220): an order of `kind: 'matter_balance'` pays what is due on an
 * EXISTING matter (`taskId`). Its amount is the matter's `amountDue` when the
 * order is made — never the request's. Once paid it is added to that matter's
 * payment history (`creditMatter`) instead of waiting for approval, and its
 * `matter.state` runs balance ─▶ crediting ─▶ credited | credit_failed.
 *
 * `decideSettlement`, `matterOutcome`, `canApprove` and `payNowRefusal` are pure
 * and unit-tested.
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

/**
 * Whether a paid order can be approved now. Pure. Returns null when it can,
 * or the reason it cannot.
 */
export function canApprove(order) {
  if (order.status === 'refunded') return 'This order was refunded. A matter cannot be opened for it.';
  if (order.status !== 'paid') return 'Only a paid order can be approved.';
  const state = order.matter?.state ?? 'none';
  if (state === 'created') return 'A matter has already been opened for this order.';
  if (state === 'pending') return 'This order is already being approved.';
  if (state !== 'awaiting_approval') return 'This order is not waiting for approval.';
  return null;
}

/** The price before GST. An order made before GST was added has only `amount`. */
const priceOf = (o) => o.price ?? o.amount;
const rupees = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** What the customer may see of their own order. */
export function publicOrder(o) {
  return {
    orderId: o.orderId, status: o.status, label: o.label, planName: o.planName,
    price: priceOf(o), gst: o.gst ?? 0, gstPercent: o.gstPercent ?? 0,
    amount: o.amount, currency: o.currency, createdAt: o.createdAt, paidAt: o.paidAt ?? null,
    paymentReference: o.gatewayPaymentId ?? null, failureReason: o.failureReason ?? null,
    // Whether there is a matter to go and look at — not its internal state.
    matterId: o.matter?.state === 'created' || o.kind === 'matter_balance' ? (o.matter?.taskId ?? o.taskId ?? null) : null,
    kind: o.kind ?? 'website',
  };
}

/* ───────────────────────────── I/O below ───────────────────────────── */

export async function getOrder(orderId) {
  const snap = await col().doc(orderId).get();
  return snap.exists ? { orderId: snap.id, ...snap.data() } : null;
}

async function activeStaff(roles) {
  const snap = await getDb().collection('users').where('role', 'in', roles).get();
  return snap.docs.filter((d) => d.data().status !== 'deactivated').map((d) => d.id);
}

/** Admins by default. A request to APPROVE also goes to managers, who can act on it. */
async function tellStaff(title, message, taskId, roles = ['admin']) {
  try {
    for (const uid of await activeStaff(roles)) {
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
    // Charged: price + GST. All three are the server's, from the catalogue.
    price: plan.price, gst: plan.gst, gstPercent: plan.gstPercent, amount: plan.amount, currency: 'INR',
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
    // #220: a Pay Now order is added to its matter; a website order waits for approval.
    if (order.kind === 'matter_balance') await creditMatter(orderId);
    else await fulfil(orderId);
  } else if (outcome === 'review') {
    logger.warn({ orderId, source, expected: order.amount, paid: payment.amount }, 'orders: amount mismatch — held for review');
    await tellStaff(order.kind === 'matter_balance' ? 'Online matter payment needs review' : 'Website payment needs review',
      order.kind === 'matter_balance'
        ? `Order ${orderId} (${order.planName}): ${order.reviewReason} It was NOT added to the matter's payment history.`
        : `Order ${orderId} (${order.label} — ${order.planName}): ${order.reviewReason} No matter was opened.`,
      order.taskId ?? undefined, ['admin', 'manager']);
  }
  return { order: await getOrder(orderId), outcome };
}

/**
 * Everything that follows a payment: the customer's order history, the staff
 * alert, the confirmation email — and whether the order now WAITS FOR APPROVAL
 * (its service has a workflow) or needs a matter opened by hand. It opens no
 * matter itself: that is `approveMatter`. Claimed in a transaction so two
 * simultaneous confirmations do this once. Never throws — a failure here must
 * not undo a payment.
 */
export async function fulfil(orderId, { retry = false } = {}) {
  const ref = col().doc(orderId);
  const claimed = await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const o = snap.data();
    if (!snap.exists || o.status !== 'paid') return null;
    const state = o.matter?.state ?? 'none';
    if (state === 'created' || state === 'awaiting_approval' || state === 'pending') return null;
    // A second look — at an order that could have no matter (its service has a
    // workflow now, perhaps), or one that failed — is only ever asked for by staff.
    if ((state === 'not_applicable' || state === 'failed') && !retry) return null;
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

  let hasWorkflow = false;
  try {
    hasWorkflow = !!(o.serviceKey && await getCompiledForServiceKey(o.serviceKey));
  } catch { /* treated as no workflow */ }
  const plan = matterOutcome(o, hasWorkflow);
  const matter = plan.open ? { state: 'awaiting_approval' } : { state: 'not_applicable', reason: plan.why };
  await ref.update({ matter, updatedAt: nowIso() });
  // A staff "look again" that changes nothing has already been announced.
  if (retry && matter.state === 'not_applicable') return getOrder(orderId);

  const who = o.customer?.name || o.customer?.email || 'A customer';
  const paid = rupees(o.amount);
  if (matter.state === 'awaiting_approval') {
    await tellStaff('Website order paid — approve it to open the matter',
      `${who} paid ${paid} for ${o.label} — ${o.planName} (order ${orderId}). Approve the order under Website Orders and its matter will be opened.`,
      undefined, ['admin', 'manager']);
    // Told once: the customer's email below went out when the payment arrived.
    if (retry) return getOrder(orderId);
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
        ...(o.gst ? [`That is ${rupees(priceOf(o))} plus ${rupees(o.gst)} GST (${o.gstPercent}%).`] : []),
        '', `Order reference: ${orderId}`,
        '', 'Our team will be in touch shortly. You can follow progress in your portal.',
      ].join('\n'),
      action: { label: 'Open your portal', url: `${publicSiteUrl()}/portal/` },
    }).catch((err) => logger.warn({ err, orderId }, 'orders: confirmation email failed'));
  }
  return getOrder(orderId);
}

/**
 * Staff approve a paid order, and its matter is opened (#212). Claimed in a
 * transaction, so two people approving at once open one matter. The payment is
 * never at risk: if the matter cannot be opened the order stays paid and
 * approved, says why, and `retryMatter` tries again.
 */
export async function approveMatter(orderId, actor) {
  const ref = col().doc(orderId);
  const approval = { approvedBy: actor.uid, approvedByName: actor.name ?? '', approvedAt: nowIso() };
  const claimed = await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw httpError(404, 'Order not found.');
    const why = canApprove(snap.data());
    if (why) throw httpError(409, why, 'NOT_APPROVABLE');
    tx.update(ref, { matter: { state: 'pending', ...approval }, updatedAt: nowIso() });
    return { orderId, ...snap.data() };
  });
  logger.info({ orderId, actorUid: actor.uid }, 'orders: approved');
  return openApprovedMatter(claimed, approval);
}

/** Open the matter of an order that has been approved, and record how it went. */
async function openApprovedMatter(o, approval) {
  let matter;
  try {
    matter = { state: 'created', taskId: await openMatter(o, approval), ...approval };
  } catch (err) {
    logger.error({ err, orderId: o.orderId }, 'orders: approved, but the matter could not be opened');
    matter = { state: 'failed', error: err?.message || 'The matter could not be opened.', ...approval };
  }
  await col().doc(o.orderId).update({ matter, updatedAt: nowIso() });
  if (matter.state === 'failed') {
    const who = o.customer?.name || o.customer?.email || 'A customer';
    await tellStaff('Website order approved — the matter could NOT be opened',
      `${who}'s order ${o.orderId} (${o.label} — ${o.planName}) was approved, but the matter could not be opened: ${matter.error} Retry from the order, or open it by hand.`);
  }
  return getOrder(o.orderId);
}

/**
 * Open the matter for a paid order, through the same code an admin's "Create
 * Matter" uses — so the workflow, the steps, the payment history and the
 * assignment rules are identical. A matter already opened for this order is
 * reused instead of being opened twice.
 */
async function openMatter(o, approval = {}) {
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
    // Paid in full by the customer and approved by staff on the order, so it
    // is opened as an admin's fully-paid matter is: live, with no second
    // approval. The total includes GST — it is what the customer paid.
    user: { uid: 'system:website-order', role: 'admin' },
    body: {
      clientUid: o.uid, serviceKey: o.serviceKey,
      paymentStatus: 'fully_paid', totalCost: o.amount, amountReceived: o.amount,
      paymentMode: o.gateway === 'simulated' ? 'Online (test payment)' : 'Online (Razorpay)',
      paymentDescription: `Website order ${o.orderId}${o.gatewayPaymentId ? `, payment ${o.gatewayPaymentId}` : ''}${o.gst ? ` (${rupees(priceOf(o))} + ${rupees(o.gst)} GST)` : ''}`,
    },
  }, res);
  if (result.code !== 201 || !result.body?.id) {
    throw new Error(result.body?.message || `The matter could not be opened (${result.code ?? 'no response'}).`);
  }
  await db.collection('tasks').doc(result.body.id).set({
    websiteOrderId: o.orderId, websiteOrderApprovedBy: approval.approvedBy ?? null,
  }, { merge: true });
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
  // The signature proves the ids belong together; the gateway's own record of
  // THIS payment gives the amount and confirms the customer completed it.
  const payment = await gw.fetchPayment(order.gatewayOrderId, gatewayPaymentId).catch((err) => {
    logger.warn({ err, orderId }, 'orders: could not read the payment back from the gateway');
    return undefined; // unreachable: the signature alone still settles, the webhook confirms the amount
  });
  if (payment === null) throw httpError(400, 'We could not confirm this payment.', 'BAD_SIGNATURE');
  if (payment && !payment.ok) throw httpError(409, 'The payment is not complete yet.', 'NOT_PAID');
  return settlePaid(orderId, { gatewayPaymentId, amount: payment?.amount ?? null, method: payment?.method ?? null }, 'return');
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
      if (o.kind === 'matter_balance') {
        // #220: the ledger is the firm's record; a refund is reflected there by a person.
        await tellStaff('Online matter payment refunded',
          `Order ${orderId} (${o.planName}) was refunded at the payment gateway. The payment is still in the matter's payment history — remove it there if the refund stands.`,
          o.taskId, ['admin', 'manager']);
      } else {
        await tellStaff('Website order refunded',
          `Order ${orderId} (${o.label} — ${o.planName}) was refunded at the payment gateway.${o.matter?.taskId ? ' Its matter is still open — decide what to do with it.' : ''}`,
          o.matter?.taskId);
      }
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
  const data = rows.slice(0, limit);
  // A matter can be deleted after its order opened it. Say so, rather than
  // offer a link that leads nowhere — one read for the page, not one per row.
  const linked = data.filter((o) => o.matter?.state === 'created' && o.matter.taskId);
  if (linked.length) {
    const found = await getDb().getAll(...linked.map((o) => getDb().collection('tasks').doc(o.matter.taskId)));
    found.forEach((t, i) => { if (!t.exists) linked[i].matter = { ...linked[i].matter, deleted: true }; });
  }
  return { data, nextCursor: rows.length > limit ? rows[limit - 1].orderId : null };
}

/** TEST ENVIRONMENTS ONLY (reached through the simulator): remove a simulated order. */
export async function discardOrder(orderId) {
  await col().doc(orderId).delete();
}

/**
 * Staff: try again for a paid order that has no matter.
 *  - Approved, but the matter failed to open: open it now. The approval stands.
 *  - No matter was possible (its service had no workflow): look again — if it
 *    has one now, the order starts waiting for approval.
 * An order still waiting for approval is not retried; it is approved.
 */
export async function retryMatter(orderId) {
  const order = await getOrder(orderId);
  if (!order) throw httpError(404, 'Order not found.');
  // #220: for a Pay Now order, "try again" means add it to its matter again.
  if (order.kind === 'matter_balance') {
    if (order.status !== 'paid') throw httpError(409, 'Only a paid order can be added to its matter.');
    if (order.matter?.state === 'credited') return order;
    return creditMatter(orderId, { retry: true });
  }
  if (order.status !== 'paid') throw httpError(409, 'Only a paid order can have a matter opened.');
  const m = order.matter ?? {};
  if (m.state === 'created') return order;
  if (m.state === 'awaiting_approval') throw httpError(409, 'Approve this order to open its matter.', 'NEEDS_APPROVAL');
  if (m.state === 'failed' && m.approvedBy) {
    const approval = { approvedBy: m.approvedBy, approvedByName: m.approvedByName ?? '', approvedAt: m.approvedAt ?? nowIso() };
    await col().doc(orderId).update({ matter: { state: 'pending', ...approval }, updatedAt: nowIso() });
    return openApprovedMatter(order, approval);
  }
  return fulfil(orderId, { retry: true });
}

/* ─────────────────────────── Pay Now (#220) ─────────────────────────── */

/** What is still due on a matter, from its rollups. */
export const amountDueOf = (task) => Math.max(0, Number(
  task?.amountDue ?? ((task?.totalCost ?? 0) - (task?.amountPaid ?? 0)),
) || 0);

/**
 * Why this client may NOT pay this matter online now, or null when they may.
 * Pure. `canSee` is the caller's answer to "may this client see the matter".
 * The issue asks for Pay Now on a matter that is PART paid; a matter with
 * nothing paid yet is settled with the firm before work starts.
 */
export function payNowRefusal(task, canSee) {
  if (!task || !canSee) return { status: 404, message: 'Matter not found.', code: 'NOT_FOUND' };
  if (task.onlinePaymentEnabled === false) {
    return { status: 409, message: 'Online payment is switched off for this matter. Please contact us to pay.', code: 'PAY_NOW_OFF' };
  }
  if (task.paymentStatus !== 'part_paid' || amountDueOf(task) <= 0) {
    return { status: 409, message: 'There is no part payment due on this matter.', code: 'NOTHING_DUE' };
  }
  return null;
}

/**
 * Start paying what is due on a matter. The amount is the matter's amount due,
 * read here, never sent by the page. A client who clicks twice, or comes back
 * within the half hour, gets the order they already started (same amount, same
 * gateway) instead of a second one that could be paid twice.
 */
export async function createMatterBalanceOrder({ user, customer, taskId }) {
  const gw = gateway();
  if (!gw) throw httpError(503, 'Online payment is not available right now.', 'PAYMENTS_OFF');
  const taskSnap = await getDb().collection('tasks').doc(taskId).get();
  const task = taskSnap.exists ? taskSnap.data() : null;
  const { clientCanSeeMatter } = await import('../controllers/tasks.controller.js');
  const refusal = payNowRefusal(task, task && clientCanSeeMatter(user, task));
  if (refusal) throw httpError(refusal.status, refusal.message, refusal.code);
  const due = amountDueOf(task);

  const open = await col().where('taskId', '==', taskId).where('status', '==', 'created').get();
  const reuse = open.docs.map((d) => ({ orderId: d.id, ...d.data() })).find((o) => o.uid === user.uid
    && o.gateway === gw.name && Math.round(o.amount * 100) === Math.round(due * 100)
    && Date.now() - new Date(o.createdAt).getTime() < ABANDON_AFTER_MS);
  if (reuse) return { ...reuse, checkout: gw.checkout({ gatewayOrderId: reuse.gatewayOrderId }) };

  const orderId = newOrderId();
  let gatewayOrderId;
  try {
    ({ gatewayOrderId } = await gw.createOrder({ amount: due, receipt: orderId }));
  } catch (err) {
    logger.error({ err, taskId }, 'orders: the gateway could not create a Pay Now order');
    throw httpError(502, 'We could not reach the payment service. Please try again in a few minutes.', 'GATEWAY_UNAVAILABLE');
  }
  const order = {
    kind: 'matter_balance', taskId,
    uid: user.uid, customer: customer ?? {},
    productKey: null, productCode: '', planId: null,
    label: 'Matter payment', planName: `${task.serviceName || 'Matter'} (${taskId})`, serviceKey: task.serviceKey ?? null,
    // Nothing is added on top: the matter's total already is what the firm charges.
    price: due, gst: 0, gstPercent: 0, amount: due, currency: 'INR',
    status: 'created', gateway: gw.name, gatewayOrderId,
    matter: { state: 'balance', taskId },
    createdAt: nowIso(), updatedAt: nowIso(),
  };
  await col().doc(orderId).set(order);
  logger.info({ orderId, uid: user.uid, taskId, amount: due, gateway: gw.name }, 'orders: Pay Now order created');
  return { orderId, ...order, checkout: gw.checkout({ gatewayOrderId }) };
}

/**
 * Add a paid Pay Now order to its matter's payment history. Claimed in a
 * transaction so the return and the webhook add it once; the ledger row's id is
 * the order's, so even a retry cannot add it twice. Never throws: the money is
 * already taken, so a failure is recorded on the order and staff are told.
 */
export async function creditMatter(orderId, { retry = false } = {}) {
  const ref = col().doc(orderId);
  const claimed = await getDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const o = snap.data();
    if (!snap.exists || o.kind !== 'matter_balance' || o.status !== 'paid') return null;
    const state = o.matter?.state ?? 'balance';
    if (state === 'credited' || state === 'crediting') return null;
    if (state === 'credit_failed' && !retry) return null;
    tx.update(ref, { matter: { state: 'crediting', taskId: o.taskId }, updatedAt: nowIso() });
    return { orderId, ...o };
  });
  if (!claimed) return getOrder(orderId);
  const o = claimed;
  const paid = rupees(o.amountPaid ?? o.amount);
  const who = o.customer?.name || o.customer?.email || 'The client';

  let result;
  try {
    const { creditOnlinePayment } = await import('../controllers/tasks.controller.js');
    result = await creditOnlinePayment(o.taskId, {
      orderId, amount: o.amountPaid ?? o.amount, payerUid: o.uid, reference: o.gatewayPaymentId ?? null,
      mode: o.gateway === 'simulated' ? 'Online (test payment)' : 'Online (Razorpay)',
    });
  } catch (err) {
    logger.error({ err, orderId, taskId: o.taskId }, 'orders: paid, but could not be added to the matter');
    const error = err?.code ? err.message : 'The payment could not be added to the matter.';
    await ref.update({ matter: { state: 'credit_failed', taskId: o.taskId, error }, updatedAt: nowIso() });
    await tellStaff('Online payment could NOT be added to the matter',
      `${who} paid ${paid} with Pay Now (order ${orderId}), but it could not be added to the matter's payment history: ${error} The money was received. Try again from Website Orders, or record it by hand.`,
      o.taskId, ['admin', 'manager']);
    return getOrder(orderId);
  }
  await ref.update({ matter: { state: 'credited', taskId: o.taskId, paymentId: result.paymentId }, updatedAt: nowIso() });
  if (result.already) return getOrder(orderId);

  await tellStaff('Client paid online',
    `${who} paid ${paid} with Pay Now (order ${orderId}). `
      + (result.paymentStatus === 'fully_paid'
        ? 'The matter is now fully paid. If it is waiting at a payment step, press Mark as Paid to continue it.'
        : `${rupees(result.amountDue)} is still due.`),
    o.taskId, ['admin', 'manager']);

  // The client's own order history (what "My Orders" reads), as for website orders.
  try {
    await getDb().collection('users').doc(o.uid).collection('payments').doc(orderId).set({
      orderId, paymentId: o.gatewayPaymentId ?? '', amount: o.amountPaid ?? o.amount,
      planName: o.planName, source: 'matter-payment', sourceLabel: o.label,
      status: 'success', failureReason: null, paymentDate: new Date(), updatedAt: new Date(),
    });
  } catch (err) {
    logger.warn({ err, orderId }, 'orders: could not write the client order history');
  }

  if (o.customer?.email) {
    sendNotificationEmail({
      to: o.customer.email,
      title: 'Payment received',
      message: [
        `Thank you. We have received your payment of ${paid} for ${o.planName}.`,
        result.paymentStatus === 'fully_paid' ? 'Your matter is now fully paid.' : `${rupees(result.amountDue)} is still due on this matter.`,
        '', `Order reference: ${orderId}`,
      ].join('\n'),
      action: { label: 'Open your portal', url: `${publicSiteUrl()}/portal/` },
    }).catch((err) => logger.warn({ err, orderId }, 'orders: Pay Now confirmation email failed'));
  }
  return getOrder(orderId);
}
