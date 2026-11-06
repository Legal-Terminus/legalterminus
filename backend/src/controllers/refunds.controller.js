/**
 * #240 — the refund log, HTTP only. The rules are in services/refunds.service.js.
 *
 * Routes carry the role guards; this file adds OWNERSHIP: a client reads the
 * refunds of their own matter only, and any other matter answers 404 — the
 * same answer as a matter that does not exist, so nothing can be probed.
 */
import { logger } from '../config/logger.js';
import { clientCanSeeMatter } from './tasks.controller.js';
import { listRefunds, recordRefund, refundForViewer, updateRefund, summariseRefunds } from '../services/refunds.service.js';

const fail = (res, err, context) => {
  if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message, ...(err.code ? { code: err.code } : {}) });
  logger.error({ err }, context);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

const STAFF = new Set(['admin', 'manager']);
const actor = (req) => ({ uid: req.user.uid, role: req.user.role });
const sortNewest = (rows) => [...rows].sort((a, b) =>
  String(b.initiatedAt ?? '').localeCompare(String(a.initiatedAt ?? ''))
  || String(b.recordedAt ?? '').localeCompare(String(a.recordedAt ?? '')));

function answer(res, { refunds, paid }, client) {
  const summary = summariseRefunds(refunds);
  res.json({
    refunds: sortNewest(refunds).map((r) => refundForViewer(r, { client })),
    amountPaid: paid,
    activeTotal: summary.activeTotal,
    creditedTotal: summary.creditedTotal,
    // Shown beside the ledger, never written into it (#240).
    netReceived: Math.max(0, Math.round((paid - summary.creditedTotal) * 100) / 100),
  });
}

/** GET /api/tasks/:taskId/refunds — admin, manager; a client for their own matter. */
export async function listMatterRefunds(req, res) {
  try {
    const client = req.user.role === 'client';
    const found = await listRefunds({ kind: 'task', id: req.params.taskId }, {
      canSee: (task) => STAFF.has(req.user.role) || (client && clientCanSeeMatter(req.user, task)),
    });
    answer(res, found, client);
  } catch (err) { fail(res, err, 'listMatterRefunds error'); }
}

/** POST /api/tasks/:taskId/refunds — admin, manager. */
export async function createMatterRefund(req, res) {
  try {
    const { row } = await recordRefund({ kind: 'task', id: req.params.taskId }, req.body, actor(req));
    res.status(201).json(refundForViewer(row));
  } catch (err) { fail(res, err, 'createMatterRefund error'); }
}

/** PATCH /api/tasks/:taskId/refunds/:refundId — admin, manager. */
export async function patchMatterRefund(req, res) {
  try {
    const { row } = await updateRefund({ kind: 'task', id: req.params.taskId }, req.params.refundId, req.body, actor(req));
    res.json(refundForViewer(row));
  } catch (err) { fail(res, err, 'patchMatterRefund error'); }
}

/** GET /api/orders/:orderId/refunds — admin, manager. */
export async function listOrderRefunds(req, res) {
  try {
    answer(res, await listRefunds({ kind: 'order', id: req.params.orderId }, { canSee: () => true }), false);
  } catch (err) { fail(res, err, 'listOrderRefunds error'); }
}

/** POST /api/orders/:orderId/refunds — admin, manager: a refund before approval. */
export async function createOrderRefund(req, res) {
  try {
    const { row } = await recordRefund({ kind: 'order', id: req.params.orderId }, req.body, actor(req));
    res.status(201).json(refundForViewer(row));
  } catch (err) { fail(res, err, 'createOrderRefund error'); }
}

/** PATCH /api/orders/:orderId/refunds/:refundId — admin, manager. */
export async function patchOrderRefund(req, res) {
  try {
    const { row } = await updateRefund({ kind: 'order', id: req.params.orderId }, req.params.refundId, req.body, actor(req));
    res.json(refundForViewer(row));
  } catch (err) { fail(res, err, 'patchOrderRefund error'); }
}
