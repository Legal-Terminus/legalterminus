import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';

/**
 * Story 33.1 — the `/api/v1` read API.
 *
 * ── Dedicated serializers, never the internal ones ──
 *
 * These response shapes are a PUBLIC CONTRACT: once a firm's script reads
 * `matter.status`, we cannot rename it. Reusing an internal shaper would mean
 * every future field added to a task document silently becomes part of that
 * contract — and would leak internal bookkeeping (assignment history, storage
 * paths, approval internals) to anyone with a read key.
 *
 * So each resource has an explicit allowlist below. A field appears in the API
 * because someone chose to publish it, never because it happened to exist.
 */

/** Firestore's ceiling per page, matching the field benchmark (Karbon: 100). */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 25;

function pageArgs(req) {
  const raw = Number(req.query.limit);
  const limit = Number.isFinite(raw) ? Math.min(Math.max(Math.trunc(raw), 1), MAX_LIMIT) : DEFAULT_LIMIT;
  const cursor = typeof req.query.cursor === 'string' && req.query.cursor ? req.query.cursor : null;
  const updatedAfter = typeof req.query.updatedAfter === 'string' ? req.query.updatedAfter : null;
  return { limit, cursor, updatedAfter };
}

/** A matter, as the outside world sees it. */
export function serializeMatter(id, d) {
  return {
    id,
    status: d.status ?? null,
    service: d.serviceName ?? d.workflowType ?? null,
    organisation: d.organisation ?? null,
    clientId: d.clientUid ?? null,
    clientName: d.clientName ?? null,
    currentStep: typeof d.currentStepNumber === 'number' ? d.currentStepNumber : null,
    isUrgent: d.isUrgent === true,
    paymentStatus: d.paymentStatus ?? null,
    // Money is published because a firm's own billing system is the obvious
    // consumer of this API.
    totalCost: typeof d.totalCost === 'number' ? d.totalCost : null,
    amountPaid: typeof d.amountPaid === 'number' ? d.amountPaid : null,
    amountDue: typeof d.amountDue === 'number' ? d.amountDue : null,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
}

/** A client. Deliberately excludes internal profile bookkeeping. */
export function serializeClient(id, d) {
  return {
    id,
    name: d.name ?? d.fullName ?? null,
    email: d.email ?? null,
    phone: d.phone ?? null,
    organisation: d.organisation ?? null,
    createdAt: d.createdAt ?? null,
  };
}

/**
 * Document METADATA only. No bytes and no signed URL over an API key (the
 * story's explicit v1 boundary): downloads stay behind the authenticated
 * proxy, so a leaked read key cannot pull a client's PAN card out of Storage.
 * `objectPath` is omitted for the same reason.
 */
export function serializeDocumentMeta(id, d) {
  return {
    id,
    fileName: d.fileName ?? null,
    docType: d.docType ?? null,
    status: d.status ?? null,
    stepNumber: typeof d.stepNumber === 'number' ? d.stepNumber : null,
    contentType: d.contentType ?? null,
    uploadedAt: d.uploadedAt ?? d.createdAt ?? null,
    reviewedAt: d.reviewedAt ?? null,
  };
}

/** Uniform 500 — never the internal error (SECURITY STANDARDS §3). */
function failed(res, err, context) {
  logger.error({ err }, context);
  return res.status(500).json({ error: 'internal_error', message: 'The request could not be completed.' });
}

// ─── GET /api/v1/matters ────────────────────────────────────────────────────

export async function listMatters(req, res) {
  const { limit, cursor, updatedAfter } = pageArgs(req);
  try {
    let q = db.collection('tasks');
    if (req.query.status) q = q.where('status', '==', String(req.query.status));
    // Ordered by updatedAt so `updatedAfter` gives a caller a cheap way to poll
    // for changes without re-reading everything — the main reason a firm's
    // system consults this API on a schedule.
    if (updatedAfter) q = q.where('updatedAt', '>=', updatedAfter);
    q = q.orderBy('updatedAt', 'desc');
    if (cursor) q = q.startAfter(cursor);

    const snap = await q.limit(limit + 1).get();
    const docs = snap.docs.slice(0, limit);
    const data = docs.map((d) => serializeMatter(d.id, d.data()));
    res.json({
      data,
      nextCursor: snap.docs.length > limit ? (data[data.length - 1]?.updatedAt ?? null) : null,
    });
  } catch (err) {
    return failed(res, err, 'v1 listMatters failed');
  }
}

// ─── GET /api/v1/matters/:id ────────────────────────────────────────────────

export async function getMatter(req, res) {
  try {
    const snap = await db.collection('tasks').doc(req.params.id).get();
    // An unknown id is a plain miss. There is no per-key matter scoping: a key
    // belongs to the firm, and the firm owns every matter here.
    if (!snap.exists) return res.status(404).json({ error: 'not_found', message: 'No such matter.' });
    res.json({ data: serializeMatter(snap.id, snap.data()) });
  } catch (err) {
    return failed(res, err, 'v1 getMatter failed');
  }
}

// ─── GET /api/v1/matters/:id/documents ──────────────────────────────────────

export async function listMatterDocuments(req, res) {
  try {
    const taskRef = db.collection('tasks').doc(req.params.id);
    const task = await taskRef.get();
    if (!task.exists) return res.status(404).json({ error: 'not_found', message: 'No such matter.' });

    const snap = await taskRef.collection('documents').get();
    // Sorted in memory: an orderBy would silently DROP documents missing the
    // field, and a document that vanishes from an API listing is worse than an
    // unordered one.
    const data = snap.docs
      .map((d) => serializeDocumentMeta(d.id, d.data()))
      .sort((a, b) => String(b.uploadedAt ?? '').localeCompare(String(a.uploadedAt ?? '')));
    res.json({ data });
  } catch (err) {
    return failed(res, err, 'v1 listMatterDocuments failed');
  }
}

// ─── GET /api/v1/clients ────────────────────────────────────────────────────

export async function listClients(req, res) {
  const { limit, cursor } = pageArgs(req);
  try {
    // Filter in Firestore, order and page in memory — the `portalUsers`
    // precedent. An `orderBy('name')` here drops every client without a name,
    // which is exactly how the /clients roster once hid real clients.
    const snap = await db.collection('users').where('role', '==', 'client').get();
    const all = snap.docs
      .map((d) => serializeClient(d.id, d.data()))
      .sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')));

    const start = cursor ? all.findIndex((c) => c.id === cursor) + 1 : 0;
    const page = all.slice(start, start + limit);
    res.json({
      data: page,
      nextCursor: start + limit < all.length ? page[page.length - 1]?.id ?? null : null,
    });
  } catch (err) {
    return failed(res, err, 'v1 listClients failed');
  }
}
