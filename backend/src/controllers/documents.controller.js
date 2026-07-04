import { randomUUID } from 'crypto';
import { db, getBucket } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { createNotification } from './notifications.controller.js';

/**
 * Document Cycle (E-05) — signed-URL upload, review, and re-upload.
 *
 * Storage layout:
 *   • Bytes  → bucket object `tasks/{taskId}/{docId}/{fileName}` (uploaded
 *     directly by the browser via a signed PUT URL — no backend bandwidth).
 *   • Metadata → Firestore `tasks/{taskId}/documents/{docId}`.
 *
 * Lifecycle status: `awaiting_upload` → `pending_review` → `approved` | `rejected`.
 * A rejected doc's replacement archives the old one (status `archived`) so the
 * history is preserved (E05-S03).
 *
 * NOTE: documents are intentionally DECOUPLED from the XState workflow machine —
 * they have their own status lifecycle + endpoints rather than firing machine
 * events. This matches the data-driven model (the definition has no document
 * events) and keeps a step's document review independent of step transitions.
 */

const DOCS_SUB = 'documents';
const ONE_YEAR_MS = 365 * 86_400_000;
const SIGNED_URL_TTL_MS = 15 * 60 * 1000; // 15 minutes (E05-S01)

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_CONTENT_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx (#77)
  'application/vnd.ms-excel',                                                // .xls (#77)
]);

const toISO = (ts) => {
  if (!ts) return null;
  if (typeof ts === 'string') return ts;
  const ms = ts.toMillis?.() ?? (ts instanceof Date ? ts.getTime() : 0);
  return ms ? new Date(ms).toISOString() : null;
};

const docsCol = (taskId) => db.collection('tasks').doc(taskId).collection(DOCS_SUB);

// Serialize a Firestore document doc → API shape (never leaks the storage path).
const serialize = (doc) => {
  const d = doc.data();
  return {
    docId: doc.id,
    taskId: d.taskId,
    stepNumber: d.stepNumber ?? null,
    fileName: d.fileName ?? '',
    docType: d.docType ?? null, // #79: e.g. PAN, TAN, Address proof
    contentType: d.contentType ?? '',
    status: d.status ?? 'awaiting_upload',
    rejectionRemark: d.rejectionRemark ?? null,
    uploadedBy: d.uploadedBy ?? null,
    uploadedAt: toISO(d.uploadedAt),
    reviewedBy: d.reviewedBy ?? null,
    reviewedAt: toISO(d.reviewedAt),
    expiresAt: toISO(d.expiresAt),
    archivedAt: toISO(d.archivedAt),
  };
};

// Authorization: staff (admin/manager/team_member) may act on any matter's docs;
// a client may only act on their OWN matter's docs. Returns the task data or null.
async function loadAuthorizedTask(req, res, taskId, { clientWrites = true } = {}) {
  const snap = await db.collection('tasks').doc(taskId).get();
  if (!snap.exists) { res.status(404).json({ message: 'Matter not found' }); return null; }
  const task = snap.data();
  const role = req.user.role;
  if (role === 'client') {
    if (!clientWrites) { res.status(403).json({ message: 'Forbidden' }); return null; }
    if (task.clientUid !== req.user.uid) { res.status(403).json({ message: 'Forbidden' }); return null; }
  }
  return task;
}

// ─── GET /api/tasks/:taskId/documents ──────────────────────────────────────
// List a matter's documents (newest first). Staff see all; client sees own matter.
// By default archived docs are included so the history is visible (E05-S03).
export async function listDocuments(req, res) {
  try {
    const { taskId } = req.params;
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    const snap = await docsCol(taskId).get();
    const docs = snap.docs
      .map(serialize)
      .sort((a, b) => (b.uploadedAt ?? '').localeCompare(a.uploadedAt ?? ''));
    res.json({ data: docs });
  } catch (err) {
    logger.error({ err }, 'listDocuments error:');
    res.status(500).json({ message: 'Failed to list documents' });
  }
}

// ─── POST /api/tasks/:taskId/documents/signed-upload-url ───────────────────
// Step 1 of the upload (E05-S01). Body: { stepNumber?, fileName, contentType }.
// Validates type, creates an `awaiting_upload` doc, returns a 15-min signed PUT URL.
export async function createSignedUploadUrl(req, res) {
  try {
    const { taskId } = req.params;
    const { stepNumber, fileName, contentType, docType } = req.body; // shape validated by schema

    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return res.status(400).json({ message: 'Unsupported file type. Allowed: PDF, JPG, PNG, DOCX.' });
    }

    const docId = randomUUID();
    const safeName = String(fileName).replace(/[^\w.\-() ]/g, '_').slice(0, 200);
    const objectPath = `tasks/${taskId}/${docId}/${safeName}`;

    // Signed PUT URL — the browser uploads bytes straight to storage. The content
    // type is pinned into the signature so the client can't upload a different type.
    const [signedUrl] = await getBucket().file(objectPath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + SIGNED_URL_TTL_MS,
      contentType,
    });

    // Pre-create the metadata doc in `awaiting_upload` so confirm just flips status.
    await docsCol(taskId).doc(docId).set({
      taskId,
      stepNumber: stepNumber ?? null,
      fileName: safeName,
      docType: docType ? String(docType).trim().slice(0, 100) : null, // #79
      contentType,
      objectPath,
      status: 'awaiting_upload',
      uploadedBy: req.user.uid ?? null,
      createdAt: new Date(),
    });

    res.status(201).json({ docId, signedUrl, expiresInMs: SIGNED_URL_TTL_MS, maxBytes: MAX_BYTES });
  } catch (err) {
    logger.error({ err }, 'createSignedUploadUrl error:');
    res.status(500).json({ message: 'Failed to create upload URL' });
  }
}

// ─── POST /api/tasks/:taskId/documents/:docId/confirm ──────────────────────
// Step 3 of the upload (E05-S01/S03). Marks the doc `pending_review`, stamps
// uploadedAt/expiresAt, archives any prior active doc for the SAME step (re-upload,
// E05-S03), and notifies the matter's reviewer.
export async function confirmUpload(req, res) {
  try {
    const { taskId, docId } = req.params;
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    const ref = docsCol(taskId).doc(docId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Document not found' });
    const doc = snap.data();

    // A client may only confirm a doc they uploaded; staff may confirm any.
    if (req.user.role === 'client' && doc.uploadedBy !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Verify the object actually landed in storage (guards against a confirm with
    // no real upload). Best-effort: if the existence check itself errors, proceed.
    try {
      const [exists] = await getBucket().file(doc.objectPath).exists();
      if (!exists) return res.status(409).json({ message: 'Upload not found in storage. Please retry the upload.' });
    } catch (e) {
      logger.warn({ err: e?.message }, 'confirmUpload: storage existence check failed');
    }

    const now = new Date();
    const batch = db.batch();

    // Re-upload (E05-S03): archive the prior active (non-archived) document so
    // there's a single active doc, but history is preserved. Read ALL docs and
    // filter in memory — Firestore `where('stepNumber','==',null)` doesn't match
    // null fields reliably, so step-less uploads must be matched here, not in the
    // query. Scope: same step when this doc HAS a step; otherwise matter-wide
    // (covers step-less uploads, which is how the client uploader submits today).
    const all = await docsCol(taskId).get();
    all.forEach((s) => {
      if (s.id === docId) return;
      const sd = s.data();
      if (sd.status === 'archived' || sd.status === 'awaiting_upload') return;
      const sameScope = doc.stepNumber != null ? sd.stepNumber === doc.stepNumber : true;
      if (sameScope) batch.set(s.ref, { status: 'archived', archivedAt: now }, { merge: true });
    });

    batch.set(ref, {
      status: 'pending_review',
      uploadedAt: now,
      expiresAt: new Date(now.getTime() + ONE_YEAR_MS),
    }, { merge: true });

    await batch.commit();

    // Notify the reviewer (matter owner, else the step's assignee) that a document
    // is awaiting review (E05-S02 / E07-S01). Best-effort.
    try {
      let reviewer = task.assignedTo ?? null;
      if (!reviewer && doc.stepNumber != null) {
        const stepSnap = await db.collection('tasks').doc(taskId).collection('steps').doc(String(doc.stepNumber)).get();
        reviewer = stepSnap.exists ? stepSnap.data().assignedTo : null;
      }
      if (reviewer && reviewer !== req.user.uid) {
        await createNotification({
          recipientUid: reviewer,
          type: 'info',
          title: 'Document awaiting review',
          message: `${task.clientName ?? ''} · ${task.serviceName ?? ''}: ${doc.fileName}`,
          taskId,
        });
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'confirmUpload: reviewer notification failed');
    }

    const updated = await ref.get();
    res.json(serialize(updated));
  } catch (err) {
    logger.error({ err }, 'confirmUpload error:');
    res.status(500).json({ message: 'Failed to confirm upload' });
  }
}

// ─── GET /api/tasks/:taskId/documents/:docId/download-url ──────────────────
// Issues a short-lived signed READ URL so staff/owner-client can view/download a
// document without the bytes routing through the backend.
export async function downloadDocument(req, res) {
  try {
    const { taskId, docId } = req.params;
    // Auth + ownership are enforced on EVERY fetch here (staff, or owner-client).
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    const snap = await docsCol(taskId).doc(docId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Document not found' });
    const doc = snap.data();
    if (!doc.objectPath || doc.status === 'awaiting_upload') {
      return res.status(409).json({ message: 'Document has not been uploaded yet' });
    }

    // Stream the bytes THROUGH the backend so the browser never receives a
    // (replayable) Google Storage signed URL. The bucket stays deny-all; access is
    // tied to the caller's live session + ownership, checked above on each request.
    const file = getBucket().file(doc.objectPath);
    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ message: 'File not found in storage' });

    const safeName = encodeURIComponent(doc.fileName || 'document');
    res.setHeader('Content-Type', doc.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${safeName}`);
    res.setHeader('Cache-Control', 'private, no-store');

    const stream = file.createReadStream();
    stream.on('error', (e) => {
      logger.error({ err: e?.message }, 'downloadDocument stream error');
      if (!res.headersSent) res.status(500).json({ message: 'Failed to read document' });
      else res.destroy();
    });
    stream.pipe(res);
  } catch (err) {
    logger.error({ err }, 'downloadDocument error:');
    if (!res.headersSent) res.status(500).json({ message: 'Failed to download document' });
  }
}

// ─── POST /api/tasks/:taskId/documents/:docId/review ───────────────────────
// Staff approve/reject a pending document (E05-S02). Body: { action, remark? }.
// Reject requires a non-empty remark; the client is notified with it + a link.
export async function reviewDocument(req, res) {
  try {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'manager' && role !== 'team_member') {
      return res.status(403).json({ message: 'Forbidden: staff only' });
    }
    const { taskId, docId } = req.params;
    const { action, remark } = req.body; // shape validated by schema

    const taskSnap = await db.collection('tasks').doc(taskId).get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = taskSnap.data();

    const ref = docsCol(taskId).doc(docId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Document not found' });
    const doc = snap.data();
    if (doc.status !== 'pending_review') {
      return res.status(409).json({ message: 'Only a document pending review can be approved or rejected.' });
    }

    const now = new Date();
    const isApprove = action === 'approve';
    if (!isApprove) {
      const r = (remark ?? '').toString().trim();
      if (!r) return res.status(400).json({ message: 'A rejection remark is required.' });
    }

    await ref.set({
      status: isApprove ? 'approved' : 'rejected',
      rejectionRemark: isApprove ? null : remark.toString().trim().slice(0, 1000),
      reviewedBy: req.user.uid ?? null,
      reviewedAt: now,
    }, { merge: true });

    // Notify the client of the outcome (E05-S02 / E07-S01). Best-effort.
    try {
      await createNotification({
        recipientUid: task.clientUid,
        type: isApprove ? 'success' : 'error',
        title: isApprove ? 'Document approved' : 'Document needs changes',
        message: isApprove
          ? `${task.serviceName ?? ''}: ${doc.fileName} was approved.`
          : `${task.serviceName ?? ''}: ${doc.fileName} was rejected — ${remark.toString().trim()}`,
        taskId,
      });
    } catch (e) {
      logger.warn({ err: e?.message }, 'reviewDocument: client notification failed');
    }

    const updated = await ref.get();
    res.json(serialize(updated));
  } catch (err) {
    logger.error({ err }, 'reviewDocument error:');
    res.status(500).json({ message: 'Failed to review document' });
  }
}
