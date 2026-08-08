import { apiFetch } from './client';
import type { PaymentStatus } from '../types/task';

/**
 * Payment history (#148) — a matter's payments are a LEDGER, not a single latest
 * figure, because clients pay in instalments. Each entry lives in the
 * `tasks/{taskId}/payments` subcollection; the task doc carries amountPaid /
 * amountDue / paymentStatus as rollups the backend recomputes on every change.
 *
 * Admin/manager only — Team must not see payment information at all, which the
 * backend routes and firestore.rules both enforce.
 */
export interface PaymentEntry {
  id: string;
  amount: number;
  mode: string;
  /** When the money was received (may be back-dated). */
  paidAt: string | null;
  reference: string | null;
  notes: string | null;
  recordedBy: string | null;
  recordedByName: string | null;
  recordedAt: string | null;
  /** Balance remaining immediately AFTER this payment — computed server-side. */
  dueAfter: number;
}

export interface PaymentHistory {
  payments: PaymentEntry[];
  totalCost: number;
  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
}

/** Rollups returned by every mutation, so callers can update without a refetch. */
export interface PaymentRollup {
  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  totalCost: number;
}

export interface PaymentInput {
  amount: number;
  mode: string;
  paidAt?: string;
  reference?: string;
  notes?: string;
}

export const getPayments = (taskId: string) =>
  apiFetch<PaymentHistory>(`/api/tasks/${taskId}/payments`);

export const recordPayment = (taskId: string, body: PaymentInput) =>
  apiFetch<PaymentRollup & { id: string }>(`/api/tasks/${taskId}/payments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updatePaymentEntry = (
  taskId: string,
  paymentId: string,
  body: Partial<PaymentInput>,
) =>
  apiFetch<PaymentRollup & { success: boolean }>(
    `/api/tasks/${taskId}/payments/${paymentId}`,
    { method: 'PATCH', body: JSON.stringify(body) },
  );

export const deletePaymentEntry = (taskId: string, paymentId: string) =>
  apiFetch<PaymentRollup & { success: boolean }>(
    `/api/tasks/${taskId}/payments/${paymentId}`,
    { method: 'DELETE' },
  );
