/**
 * #240 — the refund log.
 *
 * Admins and managers RECORD refunds; nothing here moves money. Razorpay's
 * refund API is NOT wired in, so a refund is made in the Razorpay dashboard (or
 * at the bank, for an offline payment) and its progress is set here BY HAND.
 * (Razorpay's own `refund.processed` webhook still marks a website order
 * `refunded` — orders.service.js — but it creates no record in this log.)
 *
 *   initiated ─▶ processing ─▶ credited ("Successfully Credited")
 *       │             └──────▶ failed
 *       └──────────────────────▶ credited | failed
 *
 * `credited` and `failed` are final. A refund that failed and is tried again is
 * a NEW record, so the log keeps what really happened. Marking a refund
 * credited needs its transaction id — the bank's or gateway's confirmation.
 *
 * WHERE A REFUND LIVES
 *   - against a matter:              tasks/{taskId}/refunds/{refundId}
 *   - against a website order whose
 *     matter was never opened (#242): paymentOrders/{orderId}/refunds/{refundId}
 * The parent document carries `refundSummary` — a rollup recomputed from its
 * refunds in the same transaction as every write, exactly as the payment
 * ledger's rollups are, so the client dashboard reads no subcollection.
 *
 * MONEY (decided for #240): a refund does NOT change the payment ledger. The
 * matter's `amountPaid` stays the sum of what was received and `amountDue`
 * stays what the work costs; a credited refund is shown BESIDE them, as
 * "net received". Rewriting the paid figure would reopen a payment gate on a
 * matter that was paid, and lose the record of the money that came in.
 *
 * A refund of an order before approval blocks approval while it stands (any
 * refund that has not failed): the service was cancelled. When refunds
 * credited reach the amount paid the order itself becomes `refunded`.
 *
 * The rules are pure and unit-tested; I/O is below the line.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { createNotification } from '../controllers/notifications.controller.js';

export const REFUND_STATUSES = ['initiated', 'processing', 'credited', 'failed'];
export const FINAL_STATUSES = new Set(['credited', 'failed']);
export const REFUND_LABEL = {
  initiated: 'Initiated',
  processing: 'Processing',
  credited: 'Successfully Credited',
  failed: 'Failed',
};

const httpError = (status, message, code) => Object.assign(new Error(message), { status, code });
const money = (n) => Math.round((Number(n) || 0) * 100) / 100;
const rupees = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** What has been, or is being, refunded: every refund that has not failed. */
export function activeRefundTotal(refunds, excludeId = null) {
  return money(refunds
    .filter((r) => r.id !== excludeId && r.status !== 'failed')
    .reduce((n, r) => n + (Number(r.refundAmount) || 0), 0));
}

/** The most recent refund: by initiation date, then by when it was recorded. */
export function latestRefund(refunds) {
  return [...refunds].sort((a, b) =>
    String(b.initiatedAt ?? '').localeCompare(String(a.initiatedAt ?? ''))
    || String(b.recordedAt ?? '').localeCompare(String(a.recordedAt ?? '')))[0] ?? null;
}

/**
 * The rollup kept on the parent document. Holds only what the CLIENT may see —
 * no staff names — because the client's own matter and order carry it.
 */
export function summariseRefunds(refunds) {
  const latest = latestRefund(refunds);
  return {
    count: refunds.length,
    // Refunded or on its way (not failed).
    activeTotal: activeRefundTotal(refunds),
    creditedTotal: money(refunds.filter((r) => r.status === 'credited')
      .reduce((n, r) => n + (Number(r.refundAmount) || 0), 0)),
    latest: latest ? {
      id: latest.id ?? null,
      status: latest.status,
      refundAmount: latest.refundAmount,
      reason: latest.reason,
      initiatedAt: latest.initiatedAt,
      transactionId: latest.transactionId ?? null,
    } : null,
  };
}

/**
 * Why this refund may NOT be recorded, or null. Pure.
 * The amount refunded — this one plus every one still standing — may never
 * exceed what was paid.
 */
export function refundRefusal({ refundAmount, paid, refunds, status, transactionId }) {
  const paidNum = money(paid);
  if (paidNum <= 0) return { status: 409, message: 'Nothing has been paid, so there is nothing to refund.', code: 'NOTHING_PAID' };
  const left = money(paidNum - activeRefundTotal(refunds));
  if (money(refundAmount) > left) {
    return {
      status: 400,
      message: left > 0
        ? `The refund cannot be more than the amount paid. At most ${rupees(left)} can still be refunded.`
        : 'The full amount paid has already been refunded.',
      code: 'REFUND_EXCEEDS_PAID',
    };
  }
  if (status === 'credited' && !transactionId) {
    return { status: 400, message: 'Enter the refund transaction id before marking it Successfully Credited.', code: 'TRANSACTION_ID_REQUIRED' };
  }
  return null;
}

/** Why this refund may NOT be changed to `patch`, or null. Pure. */
export function refundUpdateRefusal(current, patch) {
  if (FINAL_STATUSES.has(current.status)) {
    return {
      status: 409,
      message: `This refund is ${REFUND_LABEL[current.status]} and can no longer be changed. Record a new refund instead.`,
      code: 'REFUND_FINAL',
    };
  }
  const nextStatus = patch.status ?? current.status;
  const txn = patch.transactionId ?? current.transactionId;
  if (nextStatus === 'credited' && !txn) {
    return { status: 400, message: 'Enter the refund transaction id before marking it Successfully Credited.', code: 'TRANSACTION_ID_REQUIRED' };
  }
  return null;
}

/**
 * Why a refund may NOT be recorded against this website ORDER, or null. Pure.
 * An order refund is for money taken before any matter existed; once a matter
 * is open its payments, and so its refunds, are the matter's.
 */
export function orderRefundRefusal(order) {
  if (!order) return { status: 404, message: 'Order not found.' };
  if (order.kind === 'matter_balance') {
    return { status: 409, message: 'This was a payment towards a matter. Record the refund on the matter.', code: 'USE_MATTER' };
  }
  if (!['paid', 'review', 'refunded'].includes(order.status)) {
    return { status: 409, message: 'Only a paid order can be refunded.', code: 'NOT_PAID' };
  }
  const state = order.matter?.state ?? 'none';
  if (state === 'created') {
    return { status: 409, message: "This order's matter is open. Record the refund on the matter.", code: 'USE_MATTER' };
  }
  if (state === 'pending') {
    return { status: 409, message: 'This order is being approved right now. Try again in a moment.', code: 'BUSY' };
  }
  return null;
}

/** What was paid on an order: what the gateway reported, else what was charged. */
export const orderPaid = (o) => Number(o?.amountPaid ?? o?.amount ?? 0) || 0;

/** One refund for the API. A client never sees which member of staff recorded it. */
export function refundForViewer(row, { client = false } = {}) {
  const out = {
    id: row.id,
    refundAmount: row.refundAmount,
    paymentAmount: row.paymentAmount ?? null,
    reason: row.reason,
    initiatedAt: row.initiatedAt,
    transactionId: row.transactionId ?? null,
    status: row.status,
    clientName: row.clientName ?? null,
    taskId: row.taskId ?? null,
    orderId: row.orderId ?? null,
    serviceName: row.serviceName ?? null,
    updatedAt: row.updatedAt ?? null,
  };
  if (!client) {
    out.recordedBy = row.recordedBy ?? null;
    out.recordedByName = row.recordedByName ?? null;
    out.recordedAt = row.recordedAt ?? null;
    out.statusHistory = row.statusHistory ?? [];
  }
  return out;
}

/**
 * #242 — where a client's website order stands, in their terms. Pure.
 * Returns null for an order that is not a service request (never paid, or a
 * Pay Now payment towards a matter they already have).
 *
 *   awaiting_approval   paid; the team is reviewing it — no matter yet
 *   under_review        money arrived but not the amount charged
 *   refund_in_progress  a refund is recorded and not yet credited in full
 *   refunded            refunded (by the gateway, or credited in full here)
 *   approved            the matter is open
 */
export function clientOrderStage(o) {
  if (!o || o.kind === 'matter_balance') return null;
  if (!['paid', 'review', 'refunded'].includes(o.status)) return null;
  if (o.matter?.state === 'created') return 'approved';
  if (o.status === 'refunded') return 'refunded';
  const r = o.refundSummary;
  if ((r?.activeTotal ?? 0) > 0) {
    return money(r.creditedTotal) >= money(orderPaid(o)) ? 'refunded' : 'refund_in_progress';
  }
  if (o.status === 'review') return 'under_review';
  return 'awaiting_approval';
}

/* ───────────────────────────── I/O below ───────────────────────────── */

const parentRef = (target) => getDb()
  .collection(target.kind === 'order' ? 'paymentOrders' : 'tasks').doc(target.id);

async function actorName(uid) {
  try {
    const snap = await getDb().collection('users').doc(uid).get();
    const d = snap.exists ? snap.data() : {};
    return d.name || d.fullName || d.email || null;
  } catch { return null; }
}

/** Tell the client, in the portal only — never fatal. */
async function tellClient(uid, title, message, taskId) {
  if (!uid) return;
  try {
    await createNotification({ recipientUid: uid, type: 'info', title, message, taskId: taskId ?? undefined });
  } catch (err) {
    logger.warn({ err }, 'refunds: could not notify the client');
  }
}

/** Read a parent, its refunds, and check the reader may see them. */
export async function listRefunds(target, { canSee }) {
  const ref = parentRef(target);
  const snap = await ref.get();
  if (!snap.exists || !canSee(snap.data())) throw httpError(404, target.kind === 'order' ? 'Order not found.' : 'Matter not found.');
  const rows = await ref.collection('refunds').get();
  const refunds = rows.docs.map((d) => ({ id: d.id, ...d.data() }));
  const data = snap.data();
  const paid = target.kind === 'order' ? orderPaid(data) : Number(data.amountPaid ?? 0) || 0;
  return { parent: data, refunds, paid };
}

/**
 * Record a refund. The payment amount and the client are the server's — read
 * from the matter or order — never the request's. Claimed in a transaction so
 * two people refunding at once cannot refund more than was paid.
 */
export async function recordRefund(target, input, actor) {
  const db = getDb();
  const ref = parentRef(target);
  const refundRef = ref.collection('refunds').doc();
  const recordedByName = await actorName(actor.uid);
  const now = new Date().toISOString();

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw httpError(404, target.kind === 'order' ? 'Order not found.' : 'Matter not found.');
    const parent = snap.data();
    if (target.kind === 'order') {
      const why = orderRefundRefusal(parent);
      if (why) throw httpError(why.status, why.message, why.code);
    }
    const existing = (await tx.get(ref.collection('refunds'))).docs.map((d) => ({ id: d.id, ...d.data() }));
    const paid = target.kind === 'order' ? orderPaid(parent) : Number(parent.amountPaid ?? 0) || 0;
    const refusal = refundRefusal({ ...input, paid, refunds: existing });
    if (refusal) throw httpError(refusal.status, refusal.message, refusal.code);

    const row = {
      refundAmount: money(input.refundAmount),
      paymentAmount: money(paid),
      reason: input.reason,
      initiatedAt: input.initiatedAt,
      transactionId: input.transactionId || null,
      status: input.status,
      clientUid: target.kind === 'order' ? parent.uid : (parent.clientUid ?? null),
      clientName: target.kind === 'order'
        ? (parent.customer?.name || parent.customer?.email || null)
        : (parent.clientName || null),
      taskId: target.kind === 'task' ? target.id : null,
      orderId: target.kind === 'order' ? target.id : (parent.websiteOrderId ?? null),
      serviceName: target.kind === 'order'
        ? [parent.label, parent.planName].filter(Boolean).join(' — ') || null
        : (parent.serviceName || parent.workflowType || null),
      recordedBy: actor.uid,
      recordedByName,
      recordedAt: now,
      updatedAt: now,
      statusHistory: [{ status: input.status, at: now, by: actor.uid, byName: recordedByName }],
    };
    const all = [...existing, { id: refundRef.id, ...row }];
    const summary = summariseRefunds(all);
    tx.set(refundRef, row);
    tx.set(ref, { refundSummary: summary, ...orderRefundedFields(target, parent, summary, now), updatedAt: now }, { merge: true });
    if (target.kind === 'task') {
      tx.set(ref.collection('events').doc(), {
        type: 'REFUND_RECORDED',
        comment: `Refund of ${rupees(row.refundAmount)} recorded (${REFUND_LABEL[row.status]}): ${row.reason}`,
        fromStep: parent.currentStepNumber ?? null,
        toStep: parent.currentStepNumber ?? null,
        byUid: actor.uid, byRole: actor.role ?? null, at: now,
      });
    }
    return { row: { id: refundRef.id, ...row }, summary };
  });

  logger.info({ kind: target.kind, id: target.id, refundId: result.row.id, actorUid: actor.uid, status: result.row.status }, 'refunds: recorded');
  await tellClient(result.row.clientUid, 'Refund recorded',
    `A refund of ${rupees(result.row.refundAmount)} for ${result.row.serviceName || 'your service'} has been recorded. Status: ${REFUND_LABEL[result.row.status]}.`,
    target.kind === 'task' ? target.id : undefined);
  return result;
}

/** An order whose credited refunds reach what was paid becomes `refunded`. */
function orderRefundedFields(target, parent, summary, now) {
  if (target.kind !== 'order' || parent.status === 'refunded') return {};
  if (summary.creditedTotal > 0 && money(summary.creditedTotal) >= money(orderPaid(parent))) {
    return { status: 'refunded', refundedAt: now };
  }
  return {};
}

/** Move a refund on: its status, by hand, and/or its transaction id. */
export async function updateRefund(target, refundId, patch, actor) {
  const db = getDb();
  const ref = parentRef(target);
  const refundRef = ref.collection('refunds').doc(refundId);
  const byName = await actorName(actor.uid);
  const now = new Date().toISOString();

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw httpError(404, target.kind === 'order' ? 'Order not found.' : 'Matter not found.');
    const parent = snap.data();
    const all = (await tx.get(ref.collection('refunds'))).docs.map((d) => ({ id: d.id, ...d.data() }));
    const current = all.find((r) => r.id === refundId);
    if (!current) throw httpError(404, 'Refund not found.');
    const why = refundUpdateRefusal(current, patch);
    if (why) throw httpError(why.status, why.message, why.code);

    const changes = { updatedAt: now };
    if (patch.transactionId !== undefined) changes.transactionId = patch.transactionId || null;
    const statusChanged = patch.status && patch.status !== current.status;
    if (statusChanged) {
      changes.status = patch.status;
      changes.statusHistory = [...(current.statusHistory ?? []), { status: patch.status, at: now, by: actor.uid, byName }];
    }
    const next = { ...current, ...changes };
    const summary = summariseRefunds(all.map((r) => (r.id === refundId ? next : r)));
    tx.set(refundRef, changes, { merge: true });
    tx.set(ref, { refundSummary: summary, ...orderRefundedFields(target, parent, summary, now), updatedAt: now }, { merge: true });
    if (target.kind === 'task' && statusChanged) {
      tx.set(ref.collection('events').doc(), {
        type: 'REFUND_UPDATED',
        comment: `Refund of ${rupees(current.refundAmount)}: ${REFUND_LABEL[current.status]} → ${REFUND_LABEL[patch.status]}`,
        fromStep: parent.currentStepNumber ?? null,
        toStep: parent.currentStepNumber ?? null,
        byUid: actor.uid, byRole: actor.role ?? null, at: now,
      });
    }
    return { row: next, summary, statusChanged };
  });

  logger.info({ kind: target.kind, id: target.id, refundId, actorUid: actor.uid, status: result.row.status }, 'refunds: updated');
  if (result.statusChanged && FINAL_STATUSES.has(result.row.status)) {
    await tellClient(result.row.clientUid,
      result.row.status === 'credited' ? 'Refund credited' : 'Refund failed',
      result.row.status === 'credited'
        ? `Your refund of ${rupees(result.row.refundAmount)} for ${result.row.serviceName || 'your service'} has been credited (reference ${result.row.transactionId}).`
        : `Your refund of ${rupees(result.row.refundAmount)} for ${result.row.serviceName || 'your service'} could not be completed. Our team will be in touch.`,
      target.kind === 'task' ? target.id : undefined);
  }
  return result;
}
