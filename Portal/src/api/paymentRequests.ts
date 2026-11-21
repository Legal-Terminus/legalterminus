import { apiFetch } from './client';
import type { PayNowOrder } from './payNow';

/**
 * #222 — additional payment requests on a matter (government fees and the like).
 *
 * The Portal sends the fee LINES only, never a total: the server adds them up,
 * stores the total, and that stored total is what the client is charged. A
 * request whose body carries a `total` is refused.
 */
export interface FeeLine { name: string; description?: string | null; amount: number }

export type PaymentRequestStatus = 'sent' | 'paid' | 'cancelled';

export interface PaymentRequest {
  id: string;
  lines: FeeLine[];
  total: number;
  note: string | null;
  status: PaymentRequestStatus;
  createdAt: string | null;
  paidAt: string | null;
  /** online — through the payment gateway; recorded — by staff, paid some other way. */
  paidVia: 'online' | 'recorded' | null;
  // Staff only:
  createdByName?: string | null;
  cancelledAt?: string | null;
  cancelledByName?: string | null;
  cancelReason?: string | null;
  orderId?: string | null;
}

export interface PaymentRequestList {
  requests: PaymentRequest[];
  /** What the open requests ask for. The client's Pay Now pays the rest of the amount due. */
  outstanding: number;
}

export const paymentRequestsKey = (taskId: string) => ['payment-requests', taskId] as const;

export const getPaymentRequests = (taskId: string) =>
  apiFetch<PaymentRequestList>(`/api/tasks/${taskId}/payment-requests`);

export const sendPaymentRequest = (taskId: string, body: { lines: FeeLine[]; note?: string }) =>
  apiFetch<{ request: PaymentRequest }>(`/api/tasks/${taskId}/payment-requests`, { method: 'POST', body: JSON.stringify(body) });

export const cancelPaymentRequest = (taskId: string, requestId: string, reason?: string) =>
  apiFetch(`/api/tasks/${taskId}/payment-requests/${requestId}/cancel`, {
    method: 'POST', body: JSON.stringify(reason ? { reason } : {}),
  });

export const recordPaymentRequest = (taskId: string, requestId: string, body: { mode: string; paidAt?: string; reference?: string }) =>
  apiFetch(`/api/tasks/${taskId}/payment-requests/${requestId}/record`, { method: 'POST', body: JSON.stringify(body) });

/** The client starts paying a request. Nothing is sent: the amount is the request's. */
export const startPaymentRequestOrder = (taskId: string, requestId: string) =>
  apiFetch<PayNowOrder>(`/api/tasks/${taskId}/payment-requests/${requestId}/pay`, { method: 'POST', body: JSON.stringify({}) });

/** Adds up lines in paise, as the server does — for the preview only. */
export const linesTotal = (lines: { amount: number }[]) =>
  lines.reduce((sum, l) => sum + Math.round((Number(l.amount) || 0) * 100), 0) / 100;
