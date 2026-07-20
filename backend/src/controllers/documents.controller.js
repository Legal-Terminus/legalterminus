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
 * Lifecycle status (#113):
 *   `awaiting_upload` → `draft` → `pending_review` → `approved` | `rejected`
 * An upload lands as `draft` — the uploader can view, replace or delete it. Only
 * SUBMIT flips drafts to `pending_review`, making them reviewable.
 *
 * #112: uploading does NOT archive unreviewed documents. Only an already-REVIEWED
 * doc (`approved`/`rejected`) is superseded to `archived` when a replacement is
 * uploaded for the same scope, so every unreviewed document stays visible and is
 * approved/rejected individually. `archived` therefore means "superseded after
 * review", never "buried before anyone looked at it".
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

    // #112: only supersede documents that were ALREADY REVIEWED. Previously every
    // prior non-archived doc in scope was archived on each upload, which silently
    // buried documents before anyone could review them — so a client uploading
    // three files left only the last one reviewable. Unreviewed docs (draft /
    // pending_review) now coexist and are approved or rejected individually.
    // Read ALL docs and filter in memory — Firestore `where('stepNumber','==',null)`
    // doesn't match null fields reliably, so step-less uploads must be matched here.
    const all = await docsCol(taskId).get();
    all.forEach((s) => {
      if (s.id === docId) return;
      const sd = s.data();
      // Never touch: already archived, still awaiting bytes, or NOT YET REVIEWED.
      if (sd.status !== 'approved' && sd.status !== 'rejected') return;
      const sameScope = doc.stepNumber != null ? sd.stepNumber === doc.stepNumber : true;
      if (sameScope) batch.set(s.ref, { status: 'archived', archivedAt: now }, { merge: true });
    });

    // #113: an upload lands as DRAFT — the uploader can still view, replace or
    // delete it. It only becomes reviewable when they press Submit (see
    // submitDocuments), which flips every draft to `pending_review` at once.
    batch.set(ref, {
      status: 'draft',
      uploadedAt: now,
      expiresAt: new Date(now.getTime() + ONE_YEAR_MS),
    }, { merge: true });

    await batch.commit();

    // #113: NO reviewer notification here — the document is only a draft. The
    // reviewer is pinged on SUBMIT (submitDocuments), which is when it actually
    // becomes reviewable.

    const updated = await ref.get();
    res.json(serialize(updated));
  } catch (err) {
    logger.error({ err }, 'confirmUpload error:');
    res.status(500).json({ message: 'Failed to confirm upload' });
  }
}

/**
 * #113 — POST /api/tasks/:taskId/documents/submit
 * Flips the caller's DRAFT documents to `pending_review` so the internal team can
 * review them. Optionally scoped to a step via body `{ stepNumber }`. Clients may
 * only submit their own drafts; staff may submit any on the matter. Notifies the
 * reviewer once for the whole batch (rather than per file).
 */
export async function submitDocuments(req, res) {
  try {
    const { taskId } = req.params;
    const stepNumber = req.body?.stepNumber ?? null;
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    const all = await docsCol(taskId).get();
    const now = new Date();
    const batch = db.batch();
    const submitted = [];

    all.forEach((s) => {
      const d = s.data();
      if (d.status !== 'draft') return;
      // A client may only submit their OWN drafts; staff may submit any.
      if (req.user.role === 'client' && d.uploadedBy !== req.user.uid) return;
      if (stepNumber != null && d.stepNumber !== stepNumber) return;
      batch.set(s.ref, { status: 'pending_review', submittedAt: now }, { merge: true });
      submitted.push({ id: s.id, fileName: d.fileName, stepNumber: d.stepNumber ?? null });
    });

    if (submitted.length === 0) {
      return res.status(409).json({ message: 'No draft documents to submit.', code: 'NO_DRAFTS' });
    }

    await batch.commit();

    // Notify the reviewer once for the batch (matter owner, else step assignee).
    try {
      let reviewer = task.assignedTo ?? null;
      const firstStep = submitted.find((d) => d.stepNumber != null)?.stepNumber ?? null;
      if (!reviewer && firstStep != null) {
        const stepSnap = await db.collection('tasks').doc(taskId).collection('steps').doc(String(firstStep)).get();
        reviewer = stepSnap.exists ? stepSnap.data().assignedTo : null;
      }
      if (reviewer && reviewer !== req.user.uid) {
        const names = submitted.map((d) => d.fileName).join(', ');
        await createNotification({
          recipientUid: reviewer,
          type: 'info',
          title: submitted.length === 1 ? 'Document awaiting review' : `${submitted.length} documents awaiting review`,
          message: `${task.clientName ?? ''} · ${task.serviceName ?? ''}: ${names}`.slice(0, 500),
          taskId,
        });
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'submitDocuments: reviewer notification failed');
    }

    res.json({ success: true, submitted: submitted.length, documents: submitted });
  } catch (err) {
    logger.error({ err }, 'submitDocuments error:');
    res.status(500).json({ message: 'Failed to submit documents' });
  }
}

/**
 * #113 — DELETE /api/tasks/:taskId/documents/:docId
 * Deletes a document uploaded by mistake. An ADMIN may delete any document; the
 * uploader may delete their own while it is still a DRAFT (not yet submitted).
 * Removes the stored object (best-effort) and the metadata, and records the
 * deletion on the matter's activity log.
 */
export async function deleteDocument(req, res) {
  try {
    const { taskId, docId } = req.params;
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    const ref = docsCol(taskId).doc(docId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Document not found' });
    const doc = snap.data();

    const isAdmin = req.user.role === 'admin';
    const isOwnDraft = doc.uploadedBy === req.user.uid && doc.status === 'draft';
    if (!isAdmin && !isOwnDraft) {
      return res.status(403).json({
        message: 'Only an admin can delete a submitted document. You can delete your own documents while they are still drafts.',
        code: 'DELETE_NOT_ALLOWED',
      });
    }

    // Remove the bytes (best-effort — metadata removal is what matters).
    try {
      if (doc.objectPath) await getBucket().file(doc.objectPath).delete({ ignoreNotFound: true });
    } catch (e) {
      logger.warn({ err: e?.message, objectPath: doc.objectPath }, 'deleteDocument: object delete failed');
    }

    await ref.delete();

    // Audit trail on the matter's activity log.
    try {
      await db.collection('tasks').doc(taskId).collection('events').add({
        type: 'DOCUMENT_DELETED',
        actorUid: req.user.uid ?? null,
        byRole: req.user.role ?? null,
        comment: `Deleted document "${doc.fileName}"${doc.stepNumber != null ? ` (step ${doc.stepNumber})` : ''}`,
        stepNumber: doc.stepNumber ?? null,
        at: new Date().toISOString(),
      });
    } catch (e) {
      logger.warn({ err: e?.message }, 'deleteDocument: activity log failed');
    }

    res.json({ success: true, id: docId });
  } catch (err) {
    logger.error({ err }, 'deleteDocument error:');
    res.status(500).json({ message: 'Failed to delete document' });
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
