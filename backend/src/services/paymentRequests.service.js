/**
 * #222 — additional payment requests: staff ask a matter's client for more
 * money (typically government fees), listed fee by fee, and the client pays the
 * total online through the same gateway as Pay Now.
 *
 * One document per request in `tasks/{taskId}/paymentRequests/{requestId}`:
 *
 *   sent ─▶ paid          (online, through the gateway — or recorded by staff)
 *     └──▶ cancelled      (admin / manager, while unpaid)
 *
 * THE RULES THIS MODULE KEEPS
 *
 * 1. The TOTAL is the server's: the sum of the stored lines, in paise, computed
 *    here. The request body has no total, and the order charges the stored
 *    total — never a figure from a page.
 * 2. A sent request is part of what the matter costs. Sending adds its total to
 *    the matter's `totalCost` (so `amountDue`, the payment status and every
 *    dues report include it); cancelling takes it off again. Both go through
 *    `commitLedgerChange`, like every other change to a matter's money.
 * 3. A request is paid ONCE. Payment writes a ledger row whose id is derived
 *    from the request (`request-{requestId}`) and marks the request paid in the
 *    same transaction, so a second signal — or a second order — cannot add it
 *    twice. A payment that arrives for a request that is no longer open is kept
 *    on its order and staff are told; it is never silently dropped.
 * 4. Pay Now pays the REST of the balance: the matter's amount due less what is
 *    asked for in open requests, so the two cannot both collect the same money.
 * 5. No GST is added. Government fees are passed through at cost; the lines are
 *    charged exactly as entered.
 *
 * Everything above the I/O line is pure and unit-tested.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { createNotification } from '../controllers/notifications.controller.js';

export const SUBCOLLECTION = 'paymentRequests';
export const REQUEST_STATUSES = ['sent', 'paid', 'cancelled'];

const httpError = (status, message, code) => Object.assign(new Error(message), { status, code });
const paise = (n) => Math.round((Number(n) || 0) * 100);
export const round2 = (n) => paise(n) / 100;
export const rupees = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** The lines as stored: trimmed, amounts to the paisa, no empty descriptions. Pure. */
export function normaliseLines(lines) {
  return (lines ?? []).map((l) => ({
    name: String(l.name ?? '').trim(),
    description: String(l.description ?? '').trim() || null,
    amount: round2(l.amount),
  }));
}

/** The total of a request: the sum of its lines, added in paise so ₹0.10 + ₹0.20 is ₹0.30. Pure. */
export function requestTotal(lines) {
  return (lines ?? []).reduce((sum, l) => sum + paise(l.amount), 0) / 100;
}

/** What open (sent, unpaid) requests ask for. Pure. */
export function outstandingTotal(requests) {
  return (requests ?? []).filter((r) => r.status === 'sent').reduce((sum, r) => sum + paise(r.total), 0) / 100;
}

/**
 * Why a request cannot be sent on this matter, or null. Pure.
 * A matter with no total cost has no figure for the request to be added to:
 * adding to nothing would turn the request into the matter's whole price.
 */
export function sendRefusal(task) {
  if (!task) return { status: 404, message: 'Matter not found.', code: 'NOT_FOUND' };
  if (!(Number(task.totalCost) > 0)) {
    return {
      status: 409, code: 'NO_TOTAL_COST',
      message: "Set this matter's total cost before requesting an additional payment — the request is added to it.",
    };
  }
  return null;
}

/** Why staff cannot cancel this request, or null. Pure. */
export function cancelRefusal(request) {
  if (!request) return { status: 404, message: 'Payment request not found.', code: 'NOT_FOUND' };
  if (request.status === 'paid') return { status: 409, message: 'This request has been paid and cannot be cancelled.', code: 'ALREADY_PAID' };
  if (request.status === 'cancelled') return { status: 409, message: 'This request is already cancelled.', code: 'ALREADY_CANCELLED' };
  return null;
}

/**
 * Why a payment cannot settle this request, or null. Pure. `amount` is what was
 * actually paid; it must be the request's own total to the paisa.
 */
export function settleRefusal(request, amount) {
  if (!request) return { status: 404, message: 'Payment request not found.', code: 'NOT_FOUND' };
  if (request.status === 'paid') return { status: 409, message: 'This request has already been paid.', code: 'ALREADY_PAID' };
  if (request.status === 'cancelled') return { status: 409, message: 'This request was cancelled before the payment arrived.', code: 'REQUEST_CANCELLED' };
  if (amount != null && paise(amount) !== paise(request.total)) {
    return { status: 409, message: `Paid ${rupees(amount)}, but the request is for ${rupees(request.total)}.`, code: 'AMOUNT_MISMATCH' };
  }
  return null;
}

/**
 * Why this client may not start paying this request online, or null. Pure.
 * `canSee` is the caller's answer to "may this client see the matter".
 * Someone else's matter answers as if it did not exist.
 */
export function payRefusal(task, canSee, request) {
  if (!task || !canSee || !request) return { status: 404, message: 'Payment request not found.', code: 'NOT_FOUND' };
  if (request.status === 'paid') return { status: 409, message: 'This request has already been paid. Thank you.', code: 'ALREADY_PAID' };
  if (request.status === 'cancelled') return { status: 409, message: 'This request was cancelled. There is nothing to pay.', code: 'REQUEST_CANCELLED' };
  if (!(request.total > 0)) return { status: 409, message: 'There is nothing to pay on this request.', code: 'NOTHING_DUE' };
  return null;
}

/** One line for emails, notifications and the gateway's description. Pure. */
export function requestSummary(request) {
  const names = (request.lines ?? []).map((l) => l.name).filter(Boolean);
  const shown = names.slice(0, 3).join(', ') + (names.length > 3 ? ` and ${names.length - 3} more` : '');
  return `Additional payment${shown ? `: ${shown}` : ''}`;
}

/** The fee breakup as plain text, for the client's email. Pure. */
export function breakupText(request) {
  return [
    ...(request.lines ?? []).map((l) => `• ${l.name}${l.description ? ` — ${l.description}` : ''}: ${rupees(l.amount)}`),
    `Total payable: ${rupees(request.total)}`,
  ].join('\n');
}

/**
 * The request as an API caller may see it. Pure. A client sees the breakup
 * and the state but not which member of staff raised or cancelled it — internal
 * identities are masked for clients across the portal — and never a cancelled
 * request (it is not something they owe).
 */
export function projectRequest(id, r, role) {
  const base = {
    id,
    lines: r.lines ?? [],
    total: r.total ?? 0,
    note: r.note ?? null,
    status: r.status,
    createdAt: r.createdAt ?? null,
    paidAt: r.paidAt ?? null,
    paidVia: r.paidVia ?? null,
  };
  if (role === 'client') return base;
  return {
    ...base,
    createdBy: r.createdBy ?? null,
    createdByName: r.createdByName ?? null,
    cancelledAt: r.cancelledAt ?? null,
    cancelledByName: r.cancelledByName ?? null,
    cancelReason: r.cancelReason ?? null,
    orderId: r.orderId ?? null,
    paymentId: r.paymentId ?? null,
  };
}

/* ───────────────────────────── I/O below ───────────────────────────── */

const requestsOf = (taskId) => getDb().collection('tasks').doc(taskId).collection(SUBCOLLECTION);

export async function getRequest(taskId, requestId) {
  const snap = await requestsOf(taskId).doc(requestId).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

/** Every request on a matter, newest first. A matter carries a handful, so one read. */
export async function listRequests(taskId) {
  const snap = await requestsOf(taskId).get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
}

/** What open requests on a matter ask for — Pay Now pays the rest. */
export async function outstandingForTask(taskId) {
  const snap = await requestsOf(taskId).where('status', '==', 'sent').get();
  return outstandingTotal(snap.docs.map((d) => d.data()));
}

async function ledger() {
  return import('../controllers/tasks.controller.js');
}

/** A ledger refusal (a 4xx) becomes an error the controller answers with as-is. */
async function asHttp(work) {
  const { LedgerError } = await ledger();
  try {
    return await work();
  } catch (err) {
    if (err instanceof LedgerError) throw httpError(err.status, err.message, err.code ?? 'LEDGER_REFUSED');
    throw err;
  }
}

/**
 * Staff raise and send a request. Its total is added to the matter's total cost
 * in the same transaction that stores it, and the client is told (in the portal
 * and by email, with the matter's cc addresses).
 */
export async function sendRequest(taskId, { lines, note }, actor) {
  const { commitLedgerChange, LedgerError } = await ledger();
  const db = getDb();
  const taskRef = db.collection('tasks').doc(taskId);
  const ref = taskRef.collection(SUBCOLLECTION).doc();
  const stored = normaliseLines(lines);
  const total = requestTotal(stored);
  if (!(total > 0)) throw httpError(400, 'The request must be for more than ₹0.', 'NOTHING_DUE');

  let doc;
  let task;
  const rolled = await asHttp(() => commitLedgerChange(db, taskRef, actor, ({ task: t, now }) => {
    const why = sendRefusal(t);
    if (why) throw new LedgerError(why.status, why.message, why.code);
    task = t;
    doc = {
      lines: stored, total, note: note || null, status: 'sent',
      createdBy: actor.uid ?? null, createdByName: actor.name ?? null, createdByRole: actor.role ?? null,
      createdAt: now, updatedAt: now,
      totalCostBefore: Number(t.totalCost) || 0,
      paidAt: null, paidVia: null, orderId: null, paymentId: null,
    };
    return {
      totalCost: round2((Number(t.totalCost) || 0) + total),
      writes: (tx) => tx.set(ref, doc),
      exceeds: () => 'This request could not be added to the matter.',
      event: (r) => ({
        type: 'PAYMENT_REQUESTED',
        comment: `Additional payment requested: ${rupees(total)} (${stored.length} ${stored.length === 1 ? 'fee' : 'fees'}). `
          + `Total cost is now ${rupees(r.totalCost)}; ${rupees(r.amountDue)} due.`,
      }),
    };
  }));
  logger.info({ taskId, requestId: ref.id, total, lines: stored.length, actorUid: actor.uid }, 'paymentRequests: sent');

  if (task.clientUid) {
    createNotification({
      recipientUid: task.clientUid,
      type: 'info',
      title: 'Additional payment requested',
      message: [
        `We have requested an additional payment of ${rupees(total)} on your matter${task.serviceName ? ` (${task.serviceName})` : ''}.`,
        '', breakupText(doc),
        ...(doc.note ? ['', doc.note] : []),
        '', 'You can review the breakup and pay it online from the Payments tab of the matter in your portal.',
      ].join('\n'),
      taskId,
    }).catch((err) => logger.warn({ err, taskId }, 'paymentRequests: could not notify the client'));
  }
  return { request: projectRequest(ref.id, doc, actor.role), ...rolled };
}

/** Admin / manager cancel an unpaid request; its total comes off the matter's total cost. */
export async function cancelRequest(taskId, requestId, { reason }, actor) {
  const { commitLedgerChange, LedgerError } = await ledger();
  const db = getDb();
  const taskRef = db.collection('tasks').doc(taskId);
  const ref = taskRef.collection(SUBCOLLECTION).doc(requestId);
  let request;
  const rolled = await asHttp(() => commitLedgerChange(db, taskRef, actor, ({ task, now, pre }) => {
    const why = cancelRefusal(pre);
    if (why) throw new LedgerError(why.status, why.message, why.code);
    request = pre;
    const patch = {
      status: 'cancelled', cancelledAt: now, cancelledBy: actor.uid ?? null,
      cancelledByName: actor.name ?? null, cancelReason: reason || null, updatedAt: now,
    };
    return {
      totalCost: Math.max(0, round2((Number(task.totalCost) || 0) - pre.total)),
      writes: (tx) => tx.set(ref, patch, { merge: true }),
      exceeds: () => 'This request cannot be cancelled: the payments already recorded are more than the total cost would be without it. '
        + 'Correct the payment history first.',
      event: (r) => ({
        type: 'PAYMENT_REQUEST_CANCELLED',
        comment: `Additional payment request of ${rupees(pre.total)} cancelled${reason ? ` (${reason})` : ''}. `
          + `Total cost is now ${rupees(r.totalCost)}; ${rupees(r.amountDue)} due.`,
      }),
    };
  }, { preRead: async (tx) => { const s = await tx.get(ref); return s.exists ? s.data() : null; } }));
  logger.info({ taskId, requestId, actorUid: actor.uid }, 'paymentRequests: cancelled');
  return { request: projectRequest(requestId, { ...request, status: 'cancelled' }, actor.role), ...rolled };
}

/**
 * Mark a request paid and add it to the matter's payment history — one
 * transaction, one ledger row (`request-{requestId}`). Used for a VERIFIED
 * online payment (from orders.service, never from a request) and for a payment
 * staff record by hand. Throws an Error with a `code` when the payment cannot
 * settle the request (already paid, cancelled, wrong amount, more than is due).
 */
export async function settleRequest(taskId, requestId, { amount, mode, reference, paidAt, via, orderId, actor }) {
  const { commitLedgerChange, LedgerError } = await ledger();
  const db = getDb();
  const taskRef = db.collection('tasks').doc(taskId);
  const ref = taskRef.collection(SUBCOLLECTION).doc(requestId);
  const paymentRef = taskRef.collection('payments').doc(`request-${requestId}`);
  try {
    const rolled = await commitLedgerChange(db, taskRef, actor, ({ rows, now, pre }) => {
      // The ledger row's id is the request's: a second payment of it can never land twice.
      if (rows.has(paymentRef.id)) throw new LedgerError(409, 'This request has already been paid.', 'ALREADY_PAID');
      const why = settleRefusal(pre, amount);
      if (why) throw new LedgerError(why.status, why.message, why.code);
      const paid = pre.total;
      const row = {
        amount: paid, mode, paidAt: paidAt || now,
        reference: reference ?? null,
        notes: via === 'online'
          ? `Paid online by the client: ${requestSummary(pre)} (order ${orderId}).`
          : `Additional payment request: ${requestSummary(pre)}.`,
        recordedBy: via === 'online' ? null : (actor.uid ?? null),
        recordedByName: via === 'online' ? 'Online payment' : (actor.name ?? null),
        recordedAt: now,
        source: via === 'online' ? 'payment_request_online' : 'payment_request',
        requestId, orderId: orderId ?? null,
      };
      rows.set(paymentRef.id, row);
      return {
        delta: paid,
        writes: (tx) => {
          tx.set(paymentRef, row);
          tx.set(ref, {
            status: 'paid', paidAt: row.paidAt, paidVia: via, orderId: orderId ?? null,
            paymentId: paymentRef.id, updatedAt: now,
          }, { merge: true });
        },
        taskFields: { paymentMode: mode },
        exceeds: (left) => `The payment of ${rupees(paid)} is more than the ${rupees(Math.max(0, left))} now due on the matter.`,
        event: (r) => ({
          type: 'PAYMENT_RECORDED',
          comment: `${via === 'online' ? 'Paid online' : 'Payment received'}: ${rupees(paid)} for ${requestSummary(pre).toLowerCase()}. `
            + `${rupees(r.amountDue)} remaining of ${rupees(r.totalCost)}.`,
        }),
        result: { request: pre },
      };
    }, { preRead: async (tx) => { const s = await tx.get(ref); return s.exists ? s.data() : null; } });

    const { emitWebhook } = await import('./webhookEmit.service.js');
    emitWebhook(db, 'payment.recorded', {
      matterId: taskId, paymentId: paymentRef.id, amount: rolled.request.total, paymentStatus: rolled.paymentStatus,
    });
    logger.info({ taskId, requestId, via, orderId: orderId ?? null }, 'paymentRequests: paid');
    return { ...rolled, paymentId: paymentRef.id };
  } catch (err) {
    if (err instanceof LedgerError) throw httpError(err.status, err.message, err.code ?? 'LEDGER_REFUSED');
    throw err;
  }
}

/** Tell staff, and the member of staff who raised it, that a request was paid. */
export async function announcePaid(taskId, request, { who, how }) {
  try {
    const snap = await getDb().collection('users').where('role', 'in', ['admin', 'manager']).get();
    const uids = new Set(snap.docs.filter((d) => d.data().status !== 'deactivated').map((d) => d.id));
    if (request.createdBy) uids.add(request.createdBy);
    for (const uid of uids) {
      await createNotification({
        recipientUid: uid, type: 'info', title: 'Additional payment request paid',
        message: `${who} paid ${rupees(request.total)} for ${requestSummary(request).toLowerCase()} ${how}.`,
        taskId,
      });
    }
  } catch (err) {
    logger.warn({ err, taskId }, 'paymentRequests: could not notify staff');
  }
}
