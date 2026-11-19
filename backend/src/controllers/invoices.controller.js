import { db, getBucket } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { clientCanSeeMatter } from './tasks.controller.js';
import {
  INVOICES_SUB,
  INVOICE_CONTENT_TYPE,
  INVOICE_MAX_BYTES,
  INVOICE_URL_TTL_MS,
  canManageInvoices,
  canReadInvoices,
  checkUploadedInvoice,
  invoiceForViewer,
  invoiceObjectPath,
  isInvoiceId,
  listableInvoices,
  newInvoiceId,
  safeInvoiceFileName,
} from '../services/invoices.service.js';

/**
 * #313 — invoices on a matter's Payments tab, HTTP only. The storage model and
 * the access rules are documented (and unit-tested) in invoices.service.js.
 *
 * The routes carry the role guards (admin/manager write; admin/manager/client
 * read). This file adds OWNERSHIP: a client reaches only the invoices of a
 * matter they can see, and any other matter answers 404 — the same answer as a
 * matter that does not exist, so nothing can be probed (as refunds, #240).
 */

const tasksCol = () => db.collection('tasks');
const invoicesCol = (taskId) => tasksCol().doc(taskId).collection(INVOICES_SUB);
const NOT_FOUND = { message: 'Invoice not found' };

/**
 * Load the matter and check the caller may act on its invoices. Returns the
 * matter's data, or null after answering.
 */
async function loadMatter(req, res, { manage = false } = {}) {
  const { role } = req.user;
  // The route guard already refused other roles; checked again here so a
  // future route without a guard still fails closed.
  if (manage ? !canManageInvoices(role) : !canReadInvoices({ role, clientCanSee: role === 'client' })) {
    res.status(403).json({ message: 'Forbidden' });
    return null;
  }
  const snap = await tasksCol().doc(req.params.taskId).get();
  if (!snap.exists) { res.status(404).json({ message: 'Matter not found' }); return null; }
  const task = snap.data();
  const clientCanSee = role === 'client' && clientCanSeeMatter(req.user, task);
  if (!canReadInvoices({ role, clientCanSee })) {
    res.status(404).json({ message: 'Matter not found' });
    return null;
  }
  return task;
}

async function logEvent(taskId, req, type, comment) {
  try {
    await tasksCol().doc(taskId).collection('events').add({
      type,
      actorUid: req.user.uid ?? null,
      byRole: req.user.role ?? null,
      comment,
      at: new Date().toISOString(),
    });
  } catch (err) {
    logger.warn({ err, taskId }, 'invoices: activity log failed');
  }
}

async function removeObject(objectPath) {
  if (!objectPath) return;
  try {
    await getBucket().file(objectPath).delete({ ignoreNotFound: true });
  } catch (err) {
    logger.warn({ err, objectPath }, 'invoices: object delete failed');
  }
}

// ─── GET /api/tasks/:taskId/invoices ───────────────────────────────────────
export async function listInvoices(req, res) {
  try {
    const task = await loadMatter(req, res);
    if (!task) return;
    const snap = await invoicesCol(req.params.taskId).get();
    const client = req.user.role === 'client';
    const rows = listableInvoices(snap.docs.map((d) => ({ id: d.id, data: d.data() })));
    res.json({ data: rows.map((r) => invoiceForViewer(r.id, r.data, { client })) });
  } catch (err) {
    logger.error({ err }, 'listInvoices error');
    res.status(500).json({ message: 'The invoices could not be loaded. Please try again.' });
  }
}

// ─── POST /api/tasks/:taskId/invoices/signed-upload-url ────────────────────
// Body: { fileName, contentType: 'application/pdf', replaces? }. Creates an
// `awaiting_upload` record and returns a 15-minute signed PUT URL.
export async function createInvoiceUploadUrl(req, res) {
  try {
    const task = await loadMatter(req, res, { manage: true });
    if (!task) return;
    const { taskId } = req.params;
    const { fileName, replaces } = req.body; // shape (and the PDF type) validated by schema

    if (replaces) {
      const old = isInvoiceId(replaces) ? await invoicesCol(taskId).doc(replaces).get() : null;
      if (!old?.exists || old.data().status !== 'uploaded') return res.status(404).json(NOT_FOUND);
    }

    const invoiceId = newInvoiceId();
    const safeName = safeInvoiceFileName(fileName);
    const objectPath = invoiceObjectPath(taskId, invoiceId, safeName);

    // The content type is pinned into the signature, so only a PDF PUT is accepted.
    const [signedUrl] = await getBucket().file(objectPath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + INVOICE_URL_TTL_MS,
      contentType: INVOICE_CONTENT_TYPE,
    });

    await invoicesCol(taskId).doc(invoiceId).set({
      taskId,
      fileName: safeName,
      contentType: INVOICE_CONTENT_TYPE,
      objectPath,
      status: 'awaiting_upload',
      replaces: replaces ?? null,
      uploadedBy: req.user.uid ?? null,
      uploadedByName: req.user.name ?? req.user.email ?? null,
      createdAt: new Date(),
    });

    res.status(201).json({ invoiceId, signedUrl, expiresInMs: INVOICE_URL_TTL_MS, maxBytes: INVOICE_MAX_BYTES });
  } catch (err) {
    logger.error({ err }, 'createInvoiceUploadUrl error');
    res.status(500).json({ message: 'The invoice could not be uploaded. Please try again.' });
  }
}

// ─── POST /api/tasks/:taskId/invoices/:invoiceId/confirm ───────────────────
// Checks the bytes landed, are a PDF and within the size cap, then marks the
// invoice `uploaded`. A replacement removes the invoice it replaces.
export async function confirmInvoiceUpload(req, res) {
  try {
    const task = await loadMatter(req, res, { manage: true });
    if (!task) return;
    const { taskId, invoiceId } = req.params;
    if (!isInvoiceId(invoiceId)) return res.status(404).json(NOT_FOUND);

    const ref = invoicesCol(taskId).doc(invoiceId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json(NOT_FOUND);
    const inv = snap.data();
    if (inv.status === 'uploaded') return res.json(invoiceForViewer(invoiceId, inv));

    // The signed URL bounds the type label but not the size or the bytes, so
    // both are checked here before the invoice becomes visible to anyone.
    const file = getBucket().file(inv.objectPath);
    const [exists] = await file.exists();
    let refusal;
    if (!exists) {
      refusal = checkUploadedInvoice({ size: 0 });
    } else {
      const [meta] = await file.getMetadata();
      const size = Number(meta?.size ?? 0);
      const [head] = size > 0 && size <= INVOICE_MAX_BYTES ? await file.download({ start: 0, end: 7 }) : [null];
      refusal = checkUploadedInvoice({ size, head });
      if (!refusal) inv.size = size;
    }
    if (refusal) {
      // A refused upload leaves nothing behind (an absent object stays retryable).
      if (exists) {
        await removeObject(inv.objectPath);
        await ref.delete();
      }
      return res.status(refusal.status).json({ message: refusal.message, code: refusal.code });
    }

    const now = new Date();
    await ref.set({ status: 'uploaded', size: inv.size, uploadedAt: now }, { merge: true });

    let replaced = null;
    if (inv.replaces && isInvoiceId(inv.replaces)) {
      const oldRef = invoicesCol(taskId).doc(inv.replaces);
      const old = await oldRef.get();
      if (old.exists) {
        replaced = old.data();
        await removeObject(replaced.objectPath);
        await oldRef.delete();
      }
    }

    await logEvent(taskId, req, replaced ? 'INVOICE_REPLACED' : 'INVOICE_UPLOADED',
      replaced
        ? `Replaced invoice "${replaced.fileName}" with "${inv.fileName}"`
        : `Uploaded invoice "${inv.fileName}"`);
    logger.info({ taskId, invoiceId, size: inv.size, replaced: inv.replaces ?? null }, 'invoice uploaded');

    const updated = await ref.get();
    res.json(invoiceForViewer(invoiceId, updated.data()));
  } catch (err) {
    logger.error({ err }, 'confirmInvoiceUpload error');
    res.status(500).json({ message: 'The invoice could not be uploaded. Please try again.' });
  }
}

// ─── GET /api/tasks/:taskId/invoices/:invoiceId/download ───────────────────
// Streams the PDF through the backend — never a signed URL.
export async function downloadInvoice(req, res) {
  try {
    const task = await loadMatter(req, res);
    if (!task) return;
    const { taskId, invoiceId } = req.params;
    if (!isInvoiceId(invoiceId)) return res.status(404).json(NOT_FOUND);

    const snap = await invoicesCol(taskId).doc(invoiceId).get();
    if (!snap.exists || snap.data().status !== 'uploaded') return res.status(404).json(NOT_FOUND);
    const inv = snap.data();

    const file = getBucket().file(inv.objectPath);
    const [exists] = await file.exists();
    if (!exists) return res.status(404).json(NOT_FOUND);

    res.setHeader('Content-Type', INVOICE_CONTENT_TYPE);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(inv.fileName || 'invoice.pdf')}`);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const stream = file.createReadStream();
    stream.on('error', (err) => {
      logger.error({ err, taskId, invoiceId }, 'downloadInvoice stream error');
      if (!res.headersSent) res.status(500).json({ message: 'The invoice could not be downloaded. Please try again.' });
      else res.destroy();
    });
    stream.pipe(res);
  } catch (err) {
    logger.error({ err }, 'downloadInvoice error');
    if (!res.headersSent) res.status(500).json({ message: 'The invoice could not be downloaded. Please try again.' });
  }
}

// ─── DELETE /api/tasks/:taskId/invoices/:invoiceId ─────────────────────────
export async function deleteInvoice(req, res) {
  try {
    const task = await loadMatter(req, res, { manage: true });
    if (!task) return;
    const { taskId, invoiceId } = req.params;
    if (!isInvoiceId(invoiceId)) return res.status(404).json(NOT_FOUND);

    const ref = invoicesCol(taskId).doc(invoiceId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json(NOT_FOUND);
    const inv = snap.data();

    await removeObject(inv.objectPath);
    await ref.delete();
    if (inv.status === 'uploaded') {
      await logEvent(taskId, req, 'INVOICE_DELETED', `Deleted invoice "${inv.fileName}"`);
    }
    logger.info({ taskId, invoiceId }, 'invoice deleted');
    res.json({ success: true, id: invoiceId });
  } catch (err) {
    logger.error({ err }, 'deleteInvoice error');
    res.status(500).json({ message: 'The invoice could not be deleted. Please try again.' });
  }
}
