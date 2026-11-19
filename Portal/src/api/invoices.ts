import { apiFetch } from './client';
import { auth } from '../lib/firebase';
import { getIdToken } from 'firebase/auth';
import { shareBlobNative } from '../lib/native';

/**
 * #313 — invoices on a matter's Payments tab.
 *
 * Admin / manager upload PDF invoices (several per matter), replace or delete
 * one; the client of the matter downloads them. Upload is the documents'
 * two-step flow: ask the backend for a signed PUT URL, PUT the bytes straight
 * to storage, then confirm. Download streams through the authenticated backend
 * — the browser never receives a storage link.
 */
export interface MatterInvoice {
  id: string;
  fileName: string;
  size: number | null;
  uploadedAt: string | null;
  /** Staff only — the API leaves these out for a client. */
  uploadedBy?: string | null;
  uploadedByName?: string | null;
}

export const INVOICE_MAX_BYTES = 10 * 1024 * 1024;
export const invoicesKey = (taskId: string) => ['task-invoices', taskId] as const;

export const getInvoices = (taskId: string) =>
  apiFetch<{ data: MatterInvoice[] }>(`/api/tasks/${taskId}/invoices`).then((r) => r.data);

/** A PDF by type or, when the browser reports none, by extension. */
const isPdf = (file: File) =>
  file.type === 'application/pdf' || (!file.type && /\.pdf$/i.test(file.name));

/**
 * Upload a PDF invoice. With `replaces`, the new invoice takes the place of
 * that one: the old file is removed once the new one is confirmed.
 */
export async function uploadInvoice(taskId: string, file: File, replaces?: string): Promise<MatterInvoice> {
  if (!isPdf(file)) throw new Error('Only PDF invoices can be uploaded.');
  if (file.size > INVOICE_MAX_BYTES) throw new Error('The invoice is too large. The limit is 10 MB.');

  const { invoiceId, signedUrl } = await apiFetch<{ invoiceId: string; signedUrl: string }>(
    `/api/tasks/${taskId}/invoices/signed-upload-url`,
    { method: 'POST', body: JSON.stringify({ fileName: file.name, contentType: 'application/pdf', ...(replaces ? { replaces } : {}) }) },
  );

  // The Content-Type must match what was signed, or storage refuses the PUT.
  const put = await fetch(signedUrl, { method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body: file });
  if (!put.ok) throw new Error('Upload failed. Please try again.');

  return apiFetch<MatterInvoice>(`/api/tasks/${taskId}/invoices/${invoiceId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ uploaded: true }),
  });
}

export const deleteInvoice = (taskId: string, invoiceId: string) =>
  apiFetch<{ success: boolean; id: string }>(`/api/tasks/${taskId}/invoices/${invoiceId}`, { method: 'DELETE' });

/** Fetch the PDF through the backend with the caller's token, and save it. */
export async function downloadInvoice(taskId: string, invoice: Pick<MatterInvoice, 'id' | 'fileName'>): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const headers: Record<string, string> = {};
  if (auth.currentUser) headers.Authorization = `Bearer ${await getIdToken(auth.currentUser)}`;
  const res = await fetch(`${base}/api/tasks/${taskId}/invoices/${invoice.id}/download`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? 'The invoice could not be downloaded. Please try again.');
  }
  const blob = await res.blob();
  const name = invoice.fileName || 'invoice.pdf';
  if (await shareBlobNative(blob, name)) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
