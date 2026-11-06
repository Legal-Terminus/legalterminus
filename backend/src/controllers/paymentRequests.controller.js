/**
 * #222 — additional payment requests on a matter. HTTP only: the rules are in
 * services/paymentRequests.service.js, and paying one online goes through
 * services/orders.service.js like Pay Now.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { clientCanSeeMatter } from './tasks.controller.js';
import {
  cancelRequest, listRequests, outstandingTotal, projectRequest, sendRequest, settleRequest,
} from '../services/paymentRequests.service.js';
import { createPaymentRequestOrder, publicOrder } from '../services/orders.service.js';

const fail = (res, err, context) => {
  if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message, ...(err.code ? { code: err.code } : {}) });
  if (err?.status === 502 || err?.status === 503) return res.status(err.status).json({ message: err.message, code: err.code });
  logger.error({ err }, context);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

/** Who is acting — from the token and the stored profile, never the request. */
async function actorOf(req) {
  const p = await getDb().collection('users').doc(req.user.uid).get().catch(() => null);
  const d = p?.exists ? p.data() : {};
  return { uid: req.user.uid, role: req.user.role, name: d.name || d.fullName || req.user.name || req.user.email || null };
}

/**
 * GET /api/tasks/:taskId/payment-requests — staff see every request; the
 * client sees the open and paid ones on their own matter, without staff names.
 * `outstanding` is what the open requests ask for (the client's Pay Now pays
 * the rest of the balance).
 */
export async function getPaymentRequests(req, res) {
  try {
    const { role } = req.user;
    const snap = await getDb().collection('tasks').doc(req.params.taskId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found.' });
    if (role === 'client' && !clientCanSeeMatter(req.user, snap.data())) return res.status(404).json({ message: 'Matter not found.' });
    const all = await listRequests(req.params.taskId);
    const visible = role === 'client' ? all.filter((r) => r.status !== 'cancelled') : all;
    res.json({
      requests: visible.map((r) => projectRequest(r.id, r, role)),
      outstanding: outstandingTotal(all),
    });
  } catch (err) { fail(res, err, 'getPaymentRequests error'); }
}

/** POST /api/tasks/:taskId/payment-requests — admin, manager, team member raise and send one. */
export async function postPaymentRequest(req, res) {
  try {
    const result = await sendRequest(req.params.taskId, req.body, await actorOf(req));
    res.status(201).json(result);
  } catch (err) { fail(res, err, 'postPaymentRequest error'); }
}

/** POST /api/tasks/:taskId/payment-requests/:requestId/cancel — admin, manager. */
export async function postCancelPaymentRequest(req, res) {
  try {
    res.json(await cancelRequest(req.params.taskId, req.params.requestId, req.body ?? {}, await actorOf(req)));
  } catch (err) { fail(res, err, 'postCancelPaymentRequest error'); }
}

/**
 * POST /api/tasks/:taskId/payment-requests/:requestId/record — admin, manager:
 * the client paid this request some other way. The amount is the request's.
 */
export async function postRecordPaymentRequest(req, res) {
  try {
    const { mode, paidAt, reference } = req.body;
    const result = await settleRequest(req.params.taskId, req.params.requestId, {
      mode, paidAt, reference, via: 'recorded', actor: await actorOf(req),
    });
    res.json({ ...result, request: projectRequest(req.params.requestId, { ...result.request, status: 'paid', paidVia: 'recorded' }, req.user.role) });
  } catch (err) { fail(res, err, 'postRecordPaymentRequest error'); }
}

/**
 * POST /api/tasks/:taskId/payment-requests/:requestId/pay — the CLIENT starts
 * paying a request online. Answers like Pay Now, so the Portal opens the same
 * checkout and confirms through /api/orders/:orderId/verify.
 */
export async function postPayPaymentRequest(req, res) {
  try {
    const p = await getDb().collection('users').doc(req.user.uid).get();
    const d = p.exists ? p.data() : {};
    const order = await createPaymentRequestOrder({
      user: req.user, taskId: req.params.taskId, requestId: req.params.requestId,
      customer: { name: d.name || d.fullName || req.user.name || '', email: req.user.email || d.email || '', phone: d.phone || d.mobile || '' },
    });
    res.status(201).json({ ...publicOrder(order), checkout: order.checkout });
  } catch (err) { fail(res, err, 'postPayPaymentRequest error'); }
}
