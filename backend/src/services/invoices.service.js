import { randomUUID } from 'crypto';

/**
 * #313 — invoices on a matter's Payments tab.
 *
 * Admin / manager upload PDF invoices (several per matter), replace or delete
 * one; the client of the matter sees and downloads them. Team members and
 * professionals never see them: an invoice is payment information (#148).
 *
 * The upload reuses the document cycle's transport (E-05): the backend issues a
 * 15-minute V4 signed PUT URL with the content type pinned, the browser PUTs the
 * bytes straight to the bucket, then confirms. The DOWNLOAD streams through the
 * backend after a per-request check — never a signed URL (security rule 8).
 *
 * Storage:
 *   • Bytes    → bucket `tasks/{taskId}/invoices/{invoiceId}/{fileName}`
 *     (under the matter's prefix, so deleting the matter sweeps them)
 *   • Metadata → Firestore `tasks/{taskId}/invoices/{invoiceId}`
 *
 * Lifecycle: `awaiting_upload` (URL issued, no bytes yet) → `uploaded`. Only an
 * `uploaded` invoice is listed or downloadable. A REPLACEMENT is a fresh upload
 * carrying `replaces: <invoiceId>`; when it is confirmed, the old invoice (its
 * metadata and its bytes) is removed, so the list never shows both.
 *
 * Everything in this file is pure so the access rules are unit-tested without
 * Firestore or Storage.
 */

export const INVOICES_SUB = 'invoices';
export const INVOICE_CONTENT_TYPE = 'application/pdf';
export const INVOICE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB — the same cap as documents
export const INVOICE_URL_TTL_MS = 15 * 60 * 1000; // 15 minutes — the same as documents

/** Who may upload, replace or delete an invoice. */
const MANAGERS = new Set(['admin', 'manager']);

export const newInvoiceId = () => randomUUID().replace(/-/g, '');
const INVOICE_ID_RE = /^[a-f0-9]{32}$/;
export const isInvoiceId = (s) => typeof s === 'string' && INVOICE_ID_RE.test(s);

/** A file name safe to put in an object path and a Content-Disposition header. */
export function safeInvoiceFileName(name) {
  let s = String(name ?? '').replace(/[^\w.\-() ]/g, '_').trim().slice(0, 200);
  if (!s) s = 'invoice';
  if (!/\.pdf$/i.test(s)) s = `${s.slice(0, 196)}.pdf`;
  return s;
}

export const invoiceObjectPath = (taskId, invoiceId, fileName) =>
  `tasks/${taskId}/${INVOICES_SUB}/${invoiceId}/${fileName}`;

/** Admin and manager manage invoices. Nobody else — deny by default. */
export const canManageInvoices = (role) => MANAGERS.has(role);

/**
 * Who may list and download a matter's invoices.
 *   • admin / manager — any matter;
 *   • client — only a matter they can see (`clientCanSee`, the same rule every
 *     client-facing read applies: own scope, or listed as a contact #188);
 *   • everyone else (team_member, professional, an unknown role) — never (#148).
 */
export function canReadInvoices({ role, clientCanSee = false }) {
  if (MANAGERS.has(role)) return true;
  if (role === 'client') return clientCanSee === true;
  return false;
}

/**
 * The bytes really are a PDF: every PDF starts with `%PDF-`. The content type
 * is pinned into the signed URL, but a type is only a label — a renamed HTML
 * file PUT as application/pdf would pass it. Called on confirm.
 */
export function looksLikePdf(head) {
  if (!head || head.length < 5) return false;
  return Buffer.from(head).subarray(0, 5).toString('latin1') === '%PDF-';
}

/**
 * Check an uploaded object before it is accepted. Returns null when it is fine,
 * or `{ status, code, message }` to refuse it with.
 */
export function checkUploadedInvoice({ size, head }) {
  const n = Number(size);
  if (!Number.isFinite(n) || n <= 0) {
    return { status: 409, code: 'INVOICE_NOT_UPLOADED', message: 'The invoice did not finish uploading. Please try again.' };
  }
  if (n > INVOICE_MAX_BYTES) {
    return { status: 413, code: 'INVOICE_TOO_LARGE', message: 'The invoice is too large. The limit is 10 MB.' };
  }
  if (!looksLikePdf(head)) {
    return { status: 415, code: 'INVOICE_NOT_PDF', message: 'Only PDF invoices can be uploaded.' };
  }
  return null;
}

const toISO = (ts) => {
  if (!ts) return null;
  if (typeof ts === 'string') return ts;
  const ms = ts.toMillis?.() ?? (ts instanceof Date ? ts.getTime() : 0);
  return ms ? new Date(ms).toISOString() : null;
};

/**
 * API shape of an invoice. Never carries the object path; a client is not told
 * which member of staff uploaded it (the same masking as payment requests).
 */
export function invoiceForViewer(id, d, { client = false } = {}) {
  return {
    id,
    fileName: d.fileName ?? 'invoice.pdf',
    size: d.size ?? null,
    uploadedAt: toISO(d.uploadedAt),
    ...(client ? {} : { uploadedBy: d.uploadedBy ?? null, uploadedByName: d.uploadedByName ?? null }),
  };
}

/** The invoices a list shows: uploaded ones only, newest first. */
export function listableInvoices(rows) {
  return rows
    .filter((r) => r.data?.status === 'uploaded')
    .sort((a, b) => String(toISO(b.data.uploadedAt) ?? '').localeCompare(String(toISO(a.data.uploadedAt) ?? '')));
}
