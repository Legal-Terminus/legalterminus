import { apiFetch } from './client';

/**
 * Document Cycle API (E-05). Upload is a two-step signed-URL flow: ask the backend
 * for a signed PUT URL, PUT the bytes straight to storage, then confirm. Review +
 * download issue short-lived signed URLs too — bytes never route through our API.
 */
export type DocumentStatus =
  | 'awaiting_upload' | 'pending_review' | 'approved' | 'rejected' | 'archived';

export interface TaskDocument {
  docId: string;
  taskId: string;
  stepNumber: number | null;
  fileName: string;
  contentType: string;
  status: DocumentStatus;
  rejectionRemark: string | null;
  uploadedBy: string | null;
  uploadedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  expiresAt: string | null;
  archivedAt: string | null;
}

/** Allowed upload types (mirrors the backend allow-list) + max size. */
export const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const ALLOWED_DOC_EXT = '.pdf,.jpg,.jpeg,.png,.docx';
export const MAX_DOC_BYTES = 10 * 1024 * 1024;

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
): Promise<TaskDocument> {
  if (file.size > MAX_DOC_BYTES) {
    throw new Error('File is too large (max 10MB).');
  }
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Allowed: PDF, JPG, PNG, DOCX.');
  }

  // Step 1 — signed PUT URL + a pre-created metadata doc.
  const { docId, signedUrl } = await apiFetch<SignedUploadResponse>(
    `/api/tasks/${taskId}/documents/signed-upload-url`,
    { method: 'POST', body: JSON.stringify({ stepNumber, fileName: file.name, contentType: file.type }) },
  );

  // Step 2 — PUT the bytes straight to storage (no backend bandwidth). The
  // Content-Type must match what was signed, or the PUT is rejected.
  const put = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!put.ok) throw new Error('Upload failed. Please try again.');

  // Step 3 — confirm; backend flips status to pending_review + notifies the reviewer.
  return apiFetch<TaskDocument>(
    `/api/tasks/${taskId}/documents/${docId}/confirm`,
    { method: 'POST', body: JSON.stringify({ uploaded: true }) },
  );
}

/** Get a short-lived signed URL to view/download a document, then open it. */
export async function openDocument(taskId: string, docId: string): Promise<void> {
  const { signedUrl } = await apiFetch<{ signedUrl: string; fileName: string }>(
    `/api/tasks/${taskId}/documents/${docId}/download-url`,
  );
  window.open(signedUrl, '_blank', 'noopener,noreferrer');
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
