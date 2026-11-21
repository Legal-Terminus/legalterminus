import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useToast } from '../common/toastContext';
import {
  getRefunds, isFinalRefund, recordRefund, refundsKey, updateRefund, REFUND_STATUS, REFUND_STATUSES,
  type Refund, type RefundStatus, type RefundTarget,
} from '../../api/refunds';

/**
 * #240 — Refund History, under a matter's Payments (or a website order that
 * was never approved). Admins and managers record a refund and move its status
 * on by hand; the client sees the same list, read-only.
 *
 * The portal RECORDS refunds; it does not send them. Razorpay's refund API is
 * not connected, so the refund is made in Razorpay (or at the bank) and its
 * progress is set here — "Successfully Credited" only with the transaction id
 * that confirms it.
 */
const inr = (n: number | null | undefined) => `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const day = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const today = () => new Date().toISOString().slice(0, 10);

interface Props {
  target: RefundTarget;
  /** Admin / manager: may record refunds and change their status. */
  canEdit: boolean;
  /** Called after any change, so the caller can refresh what it shows. */
  onChanged?: () => void;
  /** A heading is not needed where the caller already titles the section. */
  compact?: boolean;
}

export default function RefundHistory({ target, canEdit, onChanged, compact = false }: Props) {
  const toast = useToast();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [initiatedAt, setInitiatedAt] = useState(today);
  const [transactionId, setTransactionId] = useState('');
  const [status, setStatus] = useState<RefundStatus>('initiated');

  const { data, isLoading, isError } = useQuery({ queryKey: refundsKey(target), queryFn: () => getRefunds(target) });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: refundsKey(target) });
    qc.invalidateQueries({ queryKey: ['task', target.id] });
    qc.invalidateQueries({ queryKey: ['task-events', target.id] });
    qc.invalidateQueries({ queryKey: ['tasks'] });
    onChanged?.();
  };
  const reset = () => { setReason(''); setAmount(''); setInitiatedAt(today()); setTransactionId(''); setStatus('initiated'); };

  const add = useMutation({
    mutationFn: () => recordRefund(target, {
      reason: reason.trim(),
      refundAmount: Number(amount) || 0,
      initiatedAt,
      transactionId: transactionId.trim() || undefined,
      status,
    }),
    onSuccess: () => { toast.success('Refund recorded.'); setAdding(false); reset(); refresh(); },
    onError: (e: Error) => toast.error(e.message || 'Could not record the refund.'),
  });

  const refunds = data?.refunds ?? [];
  const available = Math.max(0, (data?.amountPaid ?? 0) - (data?.activeTotal ?? 0));
  const amountNum = Number(amount) || 0;
  const exceeds = amountNum > available;
  const needsTxn = status === 'credited' && !transactionId.trim();

  return (
    <div className="card p-5" data-testid="refund-history">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {!compact && <p className="text-sm font-semibold text-ink">Refund history</p>}
          <p className="text-xs text-ink-muted mt-0.5">
            {canEdit
              ? 'Record a refund made in Razorpay or at the bank, and update its status as it progresses.'
              : 'Refunds made to you, and where each has got to.'}
          </p>
        </div>
        {canEdit && !adding && (data?.amountPaid ?? 0) > 0 && (
          <button type="button" onClick={() => setAdding(true)} className="btn-secondary min-h-11 text-sm">
            Record refund
          </button>
        )}
      </div>

      {adding && (
        <form
          className="mt-4 space-y-3 border-b border-hairline pb-4"
          onSubmit={(e) => { e.preventDefault(); if (!exceeds && !needsTxn && amountNum > 0 && reason.trim()) add.mutate(); }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-ink-muted">Payment amount</span>
              <p className="mt-1 px-1 py-2 text-sm font-semibold text-ink" aria-label="Payment amount">{inr(data?.amountPaid)}</p>
            </div>
            <label className="block">
              <span className="text-xs text-ink-muted">Refund amount (₹)</span>
              <input type="number" min="0" step="0.01" value={amount} aria-label="Refund amount"
                onChange={(e) => setAmount(e.target.value)} className="input-field mt-1 px-4 py-3" required />
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Refund initiation date</span>
              <input type="date" value={initiatedAt} aria-label="Refund initiation date"
                onChange={(e) => setInitiatedAt(e.target.value)} className="input-field mt-1 px-4 py-3" required />
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Refund status</span>
              <select value={status} aria-label="Refund status" onChange={(e) => setStatus(e.target.value as RefundStatus)}
                className="input-field mt-1 px-4 py-3">
                {REFUND_STATUSES.map((s) => <option key={s} value={s}>{REFUND_STATUS[s].label}</option>)}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs text-ink-muted">Refund transaction ID {status === 'credited' ? '' : '(optional until credited)'}</span>
              <input type="text" value={transactionId} maxLength={100} aria-label="Refund transaction ID"
                onChange={(e) => setTransactionId(e.target.value)} className="input-field mt-1 px-4 py-3"
                placeholder="e.g. rfnd_… or the bank's UTR" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-ink-muted">Refund reason</span>
            <textarea value={reason} maxLength={500} rows={2} aria-label="Refund reason"
              onChange={(e) => setReason(e.target.value)} className="input-field mt-1 w-full resize-y px-4 py-3" required />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-ink-muted">Can still be refunded: <span className="font-semibold text-ink">{inr(available)}</span></span>
            {exceeds && <span className="text-red-600">More than the amount paid</span>}
            {needsTxn && <span className="text-red-600">Enter the transaction ID to mark it Successfully Credited</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" disabled={add.isPending || amountNum <= 0 || exceeds || needsTxn || !reason.trim()}
              className="btn-primary min-h-11 disabled:opacity-50">
              {add.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Save refund
            </button>
            <button type="button" disabled={add.isPending} onClick={() => { setAdding(false); reset(); }} className="btn-secondary min-h-11">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-sm text-ink-faint mt-4">Loading refunds…</p>}
      {isError && <p className="text-sm text-red-600 mt-4">Could not load the refund history.</p>}
      {!isLoading && !isError && refunds.length === 0 && (
        <p className="text-sm text-ink-muted mt-4">No refunds recorded.</p>
      )}

      {refunds.length > 0 && (
        <>
          <ul className="mt-4 divide-y divide-hairline-soft" aria-label="Refunds">
            {refunds.map((r) => <RefundRow key={r.id} refund={r} target={target} canEdit={canEdit} onChanged={refresh} />)}
          </ul>
          {/* #240: the payment history is never rewritten by a refund; the net is shown here instead. */}
          <dl className="mt-3 pt-3 border-t border-hairline grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div><dt className="text-xs text-ink-muted">Amount paid</dt><dd className="font-semibold text-ink">{inr(data?.amountPaid)}</dd></div>
            <div><dt className="text-xs text-ink-muted">Refunded (credited)</dt><dd className="font-semibold text-ink">{inr(data?.creditedTotal)}</dd></div>
            <div><dt className="text-xs text-ink-muted">Net received</dt><dd className="font-semibold text-ink" data-testid="refund-net">{inr(data?.netReceived)}</dd></div>
          </dl>
        </>
      )}
    </div>
  );
}

function RefundRow({ refund: r, target, canEdit, onChanged }: { refund: Refund; target: RefundTarget; canEdit: boolean; onChanged: () => void }) {
  const toast = useToast();
  const [next, setNext] = useState<RefundStatus>(r.status);
  const [txn, setTxn] = useState(r.transactionId ?? '');
  const final = isFinalRefund(r.status);
  const s = REFUND_STATUS[r.status];

  const save = useMutation({
    mutationFn: () => updateRefund(target, r.id, {
      ...(next !== r.status ? { status: next } : {}),
      ...(txn.trim() !== (r.transactionId ?? '') ? { transactionId: txn.trim() } : {}),
    }),
    onSuccess: () => { toast.success('Refund updated.'); onChanged(); },
    onError: (e: Error) => toast.error(e.message || 'Could not update the refund.'),
  });
  const dirty = next !== r.status || txn.trim() !== (r.transactionId ?? '');
  const needsTxn = next === 'credited' && !txn.trim();

  return (
    <li className="py-3" data-testid="refund-row">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{inr(r.refundAmount)}</p>
          <p className="text-sm text-ink wrap-break-word">{r.reason}</p>
          <p className="text-xs text-ink-muted mt-0.5">
            Initiated {day(r.initiatedAt)}
            {r.transactionId ? ` · Ref ${r.transactionId}` : ''}
            {r.paymentAmount != null ? ` · of ${inr(r.paymentAmount)} paid` : ''}
            {r.recordedByName ? ` · recorded by ${r.recordedByName}` : ''}
          </p>
        </div>
        <span className={`${s.cls} shrink-0`}>{s.label}</span>
      </div>
      {canEdit && !final && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-end gap-2">
          <label className="block">
            <span className="text-xs text-ink-muted">Status</span>
            <select value={next} onChange={(e) => setNext(e.target.value as RefundStatus)}
              aria-label={`Status of refund ${inr(r.refundAmount)}`} className="input-field mt-1 px-4 py-3">
              {REFUND_STATUSES.map((x) => <option key={x} value={x}>{REFUND_STATUS[x].label}</option>)}
            </select>
          </label>
          <label className="block flex-1">
            <span className="text-xs text-ink-muted">Transaction ID</span>
            <input type="text" value={txn} maxLength={100} onChange={(e) => setTxn(e.target.value)}
              aria-label={`Transaction ID of refund ${inr(r.refundAmount)}`} className="input-field mt-1 px-4 py-3" />
          </label>
          <button type="button" className="btn-secondary min-h-11 disabled:opacity-50"
            disabled={!dirty || needsTxn || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Update
          </button>
        </div>
      )}
      {canEdit && !final && needsTxn && <p className="mt-1 text-xs text-red-600">Enter the transaction ID to mark it Successfully Credited.</p>}
    </li>
  );
}
