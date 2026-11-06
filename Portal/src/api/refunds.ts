import { apiFetch } from './client';

/**
 * #240 — the refund log. Admins and managers record a refund against a matter
 * (or against a website order whose matter was never opened) and move its
 * status on BY HAND: Razorpay's refund API is not connected, so the portal
 * records a refund — it does not send one.
 *
 * A refund never changes the matter's payment history: "amount paid" stays what
 * was received, and the refund log shows the net beside it.
 */
export type RefundStatus = 'initiated' | 'processing' | 'credited' | 'failed';

export const REFUND_STATUS: Record<RefundStatus, { label: string; cls: string }> = {
  // Colour marks the exception: a refund on its way is "awaiting a system step"
  // (blue), a credited one is done (emerald), a failed one needs a person (red).
  initiated: { label: 'Initiated', cls: 'badge-blue' },
  processing: { label: 'Processing', cls: 'badge-blue' },
  credited: { label: 'Successfully Credited', cls: 'badge-green' },
  failed: { label: 'Failed', cls: 'badge-red' },
};
export const REFUND_STATUSES = Object.keys(REFUND_STATUS) as RefundStatus[];
/** Credited and failed are final: a refund tried again is a new record. */
export const isFinalRefund = (s: RefundStatus) => s === 'credited' || s === 'failed';

export interface Refund {
  id: string;
  refundAmount: number;
  /** What had been paid when the refund was recorded — the server's figure. */
  paymentAmount: number | null;
  reason: string;
  initiatedAt: string;
  transactionId: string | null;
  status: RefundStatus;
  clientName: string | null;
  taskId: string | null;
  orderId: string | null;
  serviceName: string | null;
  updatedAt: string | null;
  /** Staff only — never sent to a client. */
  recordedByName?: string | null;
  recordedAt?: string | null;
}

export interface RefundLog {
  refunds: Refund[];
  amountPaid: number;
  /** Refunded or on its way (every refund that has not failed). */
  activeTotal: number;
  creditedTotal: number;
  /** Amount paid less refunds credited. Shown, never written to the ledger. */
  netReceived: number;
}

/** The rollup a matter or order carries, for the dashboard. */
export interface RefundSummary {
  count: number;
  activeTotal: number;
  creditedTotal: number;
  latest: {
    status: RefundStatus; refundAmount: number; reason: string; initiatedAt: string; transactionId: string | null;
  } | null;
}

export interface RefundInput {
  reason: string;
  refundAmount: number;
  initiatedAt: string;
  transactionId?: string;
  status?: RefundStatus;
}

export type RefundTarget = { kind: 'task' | 'order'; id: string };
const base = (t: RefundTarget) => (t.kind === 'task' ? `/api/tasks/${t.id}/refunds` : `/api/orders/${t.id}/refunds`);
export const refundsKey = (t: RefundTarget) => ['refunds', t.kind, t.id] as const;

export const getRefunds = (t: RefundTarget) => apiFetch<RefundLog>(base(t));

export const recordRefund = (t: RefundTarget, body: RefundInput) =>
  apiFetch<Refund>(base(t), { method: 'POST', body: JSON.stringify(body) });

export const updateRefund = (t: RefundTarget, refundId: string, body: { status?: RefundStatus; transactionId?: string }) =>
  apiFetch<Refund>(`${base(t)}/${refundId}`, { method: 'PATCH', body: JSON.stringify(body) });
