import { apiFetch } from './client';
import { auth } from '../lib/firebase';
import { getIdToken } from 'firebase/auth';

/**
 * Document Cycle API (E-05). Upload is a two-step signed-URL flow: ask the backend
 * for a signed PUT URL, PUT the bytes straight to storage, then confirm. Review +
 * download issue short-lived signed URLs too — bytes never route through our API.
 */
export type DocumentStatus =
  // #113: `draft` = uploaded but not yet submitted (viewable/deletable by the
  // uploader). Only Submit flips drafts to `pending_review`.
  | 'awaiting_upload' | 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';

export interface TaskDocument {
  docId: string;
  taskId: string;
  stepNumber: number | null;
  fileName: string;
  docType: string | null; // #79: e.g. PAN, TAN, Address proof
  contentType: string;
  status: DocumentStatus;
  rejectionRemark: string | null;
  uploadedBy: string | null;
  /** #125: who uploaded — labels the doc 'Legal Terminus' or 'Client'. */
  uploaderRole?: 'client' | 'staff' | null;
  uploadedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  expiresAt: string | null;
  archivedAt: string | null;
  /** #113: when the draft was submitted for review. */
  submittedAt?: string | null;
}

/** Allowed upload types (mirrors the backend allow-list) + max size. */
export const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx (#77)
  'application/vnd.ms-excel', // .xls (#77)
];
export const ALLOWED_DOC_EXT = '.pdf,.jpg,.jpeg,.png,.docx,.xlsx,.xls';
export const MAX_DOC_BYTES = 10 * 1024 * 1024;

/** MIME by extension — the fallback when the browser gives an empty/wrong
 *  file.type (common for legacy .xls). */
const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
};

/** Prefer the browser's MIME if it's on the allow-list; otherwise resolve from
 *  the file extension. Returns '' when neither is recognized. */
export function effectiveContentType(file: File): string {
  if (ALLOWED_DOC_TYPES.includes(file.type)) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_MIME[ext] ?? file.type ?? '';
}

export const getDocuments = (taskId: string) =>
  apiFetch<{ data: TaskDocument[] }>(`/api/tasks/${taskId}/documents`).then((r) => r.data);

interface SignedUploadResponse {
  docId: string;
  signedUrl: string;
  expiresInMs: number;
  maxBytes: number;
}

/**
 * Full upload: request a signed URL, PUT the file to storage, then confirm.
 * Returns the confirmed document. Throws with a friendly message on failure.
 */
export async function uploadDocument(
  taskId: string,
  file: File,
  stepNumber?: number,
  docType?: string,
): Promise<TaskDocument> {
  if (file.size > MAX_DOC_BYTES) {
    throw new Error('File is too large (max 10MB).');
  }
  // Some browsers report an empty/incorrect MIME for legacy .xls — resolve an
  // effective content type from the extension so those still upload (#77).
  const contentType = effectiveContentType(file);
  if (!ALLOWED_DOC_TYPES.includes(contentType)) {
    throw new Error('Unsupported file type. Allowed: PDF, JPG, PNG, DOCX, XLSX, XLS.');
  }

  // Step 1 — signed PUT URL + a pre-created metadata doc.
  const { docId, signedUrl } = await apiFetch<SignedUploadResponse>(
    `/api/tasks/${taskId}/documents/signed-upload-url`,
    { method: 'POST', body: JSON.stringify({ stepNumber, fileName: file.name, contentType, docType: docType?.trim() || undefined }) },
  );

  // Step 2 — PUT the bytes straight to storage (no backend bandwidth). The
  // Content-Type must match what was signed, or the PUT is rejected.
  const put = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!put.ok) throw new Error('Upload failed. Please try again.');

  // Step 3 — confirm; backend stores it as a DRAFT (#113). It becomes reviewable
  // only when the user presses Submit (submitDocuments).
  return apiFetch<TaskDocument>(
    `/api/tasks/${taskId}/documents/${docId}/confirm`,
    { method: 'POST', body: JSON.stringify({ uploaded: true }) },
  );
}

/**
 * Download/open a document by STREAMING it through the authenticated backend —
 * the browser never receives a Google Storage signed URL (nothing replayable).
 * Fetches the bytes as a blob with the auth header, then opens an object URL.
 */
export async function openDocument(taskId: string, docId: string): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const headers: Record<string, string> = {};
  if (auth.currentUser) headers.Authorization = `Bearer ${await getIdToken(auth.currentUser)}`;

  const res = await fetch(`${base}/api/tasks/${taskId}/documents/${docId}/download`, { headers });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ message: 'Failed to open document' }));
    throw new Error((msg as { message?: string }).message ?? 'Failed to open document');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  // Revoke shortly after so the tab has time to load it.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** Staff approve/reject a pending document. Reject requires a remark. */
export const reviewDocument = (
  taskId: string,
  docId: string,
  action: 'approve' | 'reject',
  remark?: string,
) =>
  apiFetch<TaskDocument>(`/api/tasks/${taskId}/documents/${docId}/review`, {
    method: 'POST',
    body: JSON.stringify({ action, remark }),
  });

/**
 * #113: submit the caller's DRAFT documents for review (optionally scoped to a
 * step). Drafts are viewable/deletable until this is called.
 */
export const submitDocuments = (taskId: string, stepNumber?: number | null) =>
  apiFetch<{ success: boolean; submitted: number }>(`/api/tasks/${taskId}/documents/submit`, {
    method: 'POST',
    body: JSON.stringify(stepNumber == null ? {} : { stepNumber }),
  });

/**
 * #113: delete a document. An admin may delete any; the uploader may delete their
 * own while it is still a draft.
 */
export const deleteDocument = (taskId: string, docId: string) =>
  apiFetch<{ success: boolean; id: string }>(`/api/tasks/${taskId}/documents/${docId}`, {
    method: 'DELETE',
  });
