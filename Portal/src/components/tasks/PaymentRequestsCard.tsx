import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { useConfirm } from '../common/confirmContext';
import { PAYMENT_MODES } from '../../lib/paymentModes';
import {
  PAYMENT_CONFIG_KEY, PayNowError, confirmPayNow, getPaymentConfig, payWithRazorpay, reportPayNowFailure,
  simulatePayNow, type PayNowOrder,
} from '../../api/payNow';
import {
  cancelPaymentRequest, getPaymentRequests, linesTotal, paymentRequestsKey, recordPaymentRequest,
  sendPaymentRequest, startPaymentRequestOrder, type PaymentRequest, type PaymentRequestStatus,
} from '../../api/paymentRequests';
import type { Task } from '../../types/task';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const MAX_LINES = 20;

// Open is the one state that needs someone (the client) to act — amber; paid is
// done — emerald; cancelled is history — neutral.
const STATUS: Record<PaymentRequestStatus, { label: string; cls: string }> = {
  sent: { label: 'Awaiting payment', cls: 'badge-amber' },
  paid: { label: 'Paid', cls: 'badge-green' },
  cancelled: { label: 'Cancelled', cls: 'badge-gray' },
};

function when(iso: string | null | undefined) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * #222 — additional payment requests, in the matter's Payments tab.
 *
 *  - STAFF (admin, manager, team member): raise a request with one or more fee
 *    lines, add or remove lines, see the total, and send it to the client.
 *  - ADMIN / MANAGER: cancel an unpaid request, or record it paid when the
 *    client paid some other way.
 *  - CLIENT: see each request's fee breakup and total, and pay it online.
 *
 * The total shown while composing is a preview; the server adds the lines up
 * itself and charges its own figure.
 */
export default function PaymentRequestsCard({ task, canSend, canManage, isClient }: {
  task: Task; canSend: boolean; canManage: boolean; isClient: boolean;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: paymentRequestsKey(task.id),
    queryFn: () => getPaymentRequests(task.id),
  });
  const [composing, setComposing] = useState(false);
  const requests = data?.requests ?? [];

  // The client sees the card only when there is something to show.
  if (isClient && requests.length === 0) return null;

  return (
    <div className="card p-5" data-testid="payment-requests">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Additional payment requests</p>
          <p className="text-xs text-ink-muted mt-0.5">
            {isClient
              ? 'Fees we have asked you to pay on top of the agreed cost — usually government fees. Review the breakup and pay online.'
              : 'Ask the client for government fees or other charges, fee by fee. A sent request is added to the total cost.'}
          </p>
        </div>
        {canSend && !composing && (
          <button type="button" onClick={() => setComposing(true)} className="btn-secondary min-h-11 shrink-0 justify-center">
            <Plus className="w-4 h-4" /> Request additional payment
          </button>
        )}
      </div>

      {composing && <ComposeRequest task={task} onDone={() => setComposing(false)} />}

      {isLoading ? (
        <p className="text-xs text-ink-muted mt-4">Loading…</p>
      ) : isError ? (
        <p className="text-xs text-red-600 mt-4">Could not load the payment requests.</p>
      ) : requests.length === 0 ? (
        !composing && <p className="text-xs text-ink-muted mt-4">No additional payments have been requested on this matter.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {requests.map((r) => (
            <RequestItem key={r.id} task={task} request={r} canManage={canManage} isClient={isClient} />
          ))}
        </ul>
      )}
    </div>
  );
}

interface DraftLine { name: string; description: string; amount: string }
const emptyLine = (): DraftLine => ({ name: '', description: '', amount: '' });

function ComposeRequest({ task, onDone }: { task: Task; onDone: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [lines, setLines] = useState<DraftLine[]>([emptyLine()]);
  const [note, setNote] = useState('');

  const parsed = lines.map((l) => ({ name: l.name.trim(), description: l.description.trim(), amount: Number(l.amount) }));
  const total = linesTotal(parsed.map((l) => ({ amount: Number.isFinite(l.amount) ? l.amount : 0 })));
  const invalid = parsed.some((l) => !l.name || !(l.amount > 0) || Math.round(l.amount * 100) !== l.amount * 100);
  const unpriced = !((task.totalCost ?? 0) > 0);

  const set = (i: number, patch: Partial<DraftLine>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const send = useMutation({
    mutationFn: () => sendPaymentRequest(task.id, {
      lines: parsed.map((l) => ({ name: l.name, amount: l.amount, ...(l.description ? { description: l.description } : {}) })),
      ...(note.trim() ? { note: note.trim() } : {}),
    }),
    onSuccess: () => {
      toast.success('Payment request sent to the client.');
      queryClient.invalidateQueries({ queryKey: paymentRequestsKey(task.id) });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      queryClient.invalidateQueries({ queryKey: ['payments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task-events', task.id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onDone();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not send the payment request.'),
  });

  const submit = async () => {
    const ok = await confirm({
      title: `Send a request for ${rupees(total)}?`,
      message: `The client is told by email and in the portal, and ${rupees(total)} is added to this matter's total cost. No GST is added to these fees.`,
      confirmLabel: 'Send request',
    });
    if (ok) send.mutate();
  };

  return (
    <div className="mt-4 space-y-3 border-b border-hairline pb-4" role="group" aria-label="New payment request">
      {unpriced && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">Set this matter&apos;s total cost first — the request is added to it.</p>
      )}
      {lines.map((l, i) => (
        <div key={i} className="rounded-lg border border-hairline p-3 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_10rem] gap-2">
            <label className="block">
              <span className="text-xs text-ink-muted">Fee name</span>
              <input value={l.name} maxLength={120} onChange={(e) => set(i, { name: e.target.value })}
                aria-label={`Fee ${i + 1} name`} placeholder="e.g. ROC filing fee" className="input-field mt-1 w-full px-4 py-3 sm:py-2" />
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Amount (₹)</span>
              <input type="number" inputMode="decimal" min="0" step="0.01" value={l.amount}
                onChange={(e) => set(i, { amount: e.target.value })}
                aria-label={`Fee ${i + 1} amount`} className="input-field mt-1 w-full px-4 py-3 sm:py-2" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-ink-muted">Description (optional)</span>
            <input value={l.description} maxLength={500} onChange={(e) => set(i, { description: e.target.value })}
              aria-label={`Fee ${i + 1} description`} placeholder="e.g. Form INC-32 filing" className="input-field mt-1 w-full px-4 py-3 sm:py-2" />
          </label>
          {lines.length > 1 && (
            <button type="button" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
              className="btn-secondary min-h-11 text-xs" aria-label={`Remove fee ${i + 1}`}>
              <Trash2 className="w-4 h-4" /> Remove
            </button>
          )}
        </div>
      ))}
      {lines.length < MAX_LINES && (
        <button type="button" onClick={() => setLines((ls) => [...ls, emptyLine()])} className="btn-secondary min-h-11 text-xs">
          <Plus className="w-4 h-4" /> Add another fee
        </button>
      )}
      <label className="block">
        <span className="text-xs text-ink-muted">Note to the client (optional)</span>
        <textarea value={note} maxLength={1000} rows={2} onChange={(e) => setNote(e.target.value)}
          aria-label="Note to the client" className="input-field mt-1 w-full resize-y" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink" aria-live="polite">
          Total: <span className="font-semibold" data-testid="request-total">{rupees(total)}</span>
          <span className="block text-xs text-ink-muted">Charged as entered — no GST is added.</span>
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={submit} disabled={invalid || unpriced || send.isPending}
            className="btn-primary min-h-11 justify-center disabled:opacity-50">
            {send.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Send to client
          </button>
          <button type="button" onClick={onDone} disabled={send.isPending} className="btn-secondary min-h-11">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function RequestItem({ task, request: r, canManage, isClient }: {
  task: Task; request: PaymentRequest; canManage: boolean; isClient: boolean;
}) {
  const s = STATUS[r.status] ?? STATUS.sent;
  return (
    <li className="rounded-lg border border-hairline p-3" data-testid="payment-request" data-status={r.status}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          Requested {when(r.createdAt)}{!isClient && r.createdByName ? ` by ${r.createdByName}` : ''}
        </p>
        <span className={s.cls}>{s.label}</span>
      </div>
      <ul className="mt-2 divide-y divide-hairline" aria-label="Fee breakup">
        {r.lines.map((l, i) => (
          <li key={i} className="flex items-start justify-between gap-3 py-2">
            <span className="min-w-0">
              <span className="block text-sm text-ink break-words">{l.name}</span>
              {l.description && <span className="block text-xs text-ink-muted break-words">{l.description}</span>}
            </span>
            <span className="text-sm text-ink shrink-0">{rupees(l.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-hairline pt-2">
        <span className="text-sm font-semibold text-ink">Total</span>
        <span className="text-sm font-semibold text-ink" data-testid="payment-request-total">{rupees(r.total)}</span>
      </div>
      {r.note && <p className="mt-2 text-xs text-ink-muted whitespace-pre-wrap">{r.note}</p>}
      {r.status === 'paid' && (
        <p className="mt-2 text-xs text-ink-muted">
          Paid {when(r.paidAt)}{r.paidVia === 'online' ? ' online' : ''}. It is in the payment history.
        </p>
      )}
      {r.status === 'cancelled' && !isClient && (
        <p className="mt-2 text-xs text-ink-muted">
          Cancelled {when(r.cancelledAt)}{r.cancelledByName ? ` by ${r.cancelledByName}` : ''}{r.cancelReason ? ` — ${r.cancelReason}` : ''}.
        </p>
      )}
      {r.status === 'sent' && isClient && <PayRequest task={task} request={r} />}
      {r.status === 'sent' && canManage && <ManageRequest task={task} request={r} />}
    </li>
  );
}

function useRefresh(taskId: string) {
  const queryClient = useQueryClient();
  return () => {
    for (const key of [paymentRequestsKey(taskId), ['task', taskId], ['payments', taskId], ['task-events', taskId], ['tasks']]) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  };
}

function ManageRequest({ task, request: r }: { task: Task; request: PaymentRequest }) {
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh(task.id);
  const [recording, setRecording] = useState(false);
  const [mode, setMode] = useState<string>(PAYMENT_MODES[0]);
  const [reference, setReference] = useState('');

  const cancel = useMutation({
    mutationFn: () => cancelPaymentRequest(task.id, r.id),
    onSuccess: () => { toast.success('Payment request cancelled.'); refresh(); },
    onError: (err: Error) => toast.error(err.message || 'Could not cancel the request.'),
  });
  const record = useMutation({
    mutationFn: () => recordPaymentRequest(task.id, r.id, { mode, ...(reference.trim() ? { reference: reference.trim() } : {}) }),
    onSuccess: () => { toast.success('Recorded as paid.'); setRecording(false); refresh(); },
    onError: (err: Error) => toast.error(err.message || 'Could not record the payment.'),
  });

  const onCancel = async () => {
    const ok = await confirm({
      title: 'Cancel this payment request?',
      message: `The client will no longer be asked for ${rupees(r.total)}, and it is taken off the matter's total cost.`,
      confirmLabel: 'Cancel request', cancelLabel: 'Keep it', tone: 'danger',
    });
    if (ok) cancel.mutate();
  };

  const busy = cancel.isPending || record.isPending;
  return (
    <div className="mt-3">
      {!recording ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary min-h-11 text-xs" disabled={busy} onClick={() => setRecording(true)}>
            Record as paid
          </button>
          <button type="button" className="btn-secondary min-h-11 text-xs disabled:opacity-50" disabled={busy} onClick={onCancel}>
            Cancel request
          </button>
        </div>
      ) : (
        <div className="space-y-2" role="group" aria-label="Record the request as paid">
          <p className="text-xs text-ink-muted">The client paid {rupees(r.total)} some other way. It is added to the payment history.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs text-ink-muted">Payment mode</span>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="input-field mt-1 w-full" aria-label="Payment mode">
                {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-ink-muted">Reference (optional)</span>
              <input value={reference} maxLength={200} onChange={(e) => setReference(e.target.value)} className="input-field mt-1 w-full" aria-label="Reference" />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-primary min-h-11 disabled:opacity-50" disabled={busy} onClick={() => record.mutate()}>
              {record.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Record {rupees(r.total)}
            </button>
            <button type="button" className="btn-secondary min-h-11" disabled={busy} onClick={() => setRecording(false)}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PayRequest({ task, request: r }: { task: Task; request: PaymentRequest }) {
  const toast = useToast();
  const refresh = useRefresh(task.id);
  const { data: config } = useQuery({ queryKey: PAYMENT_CONFIG_KEY, queryFn: getPaymentConfig, staleTime: 5 * 60_000 });
  const [busy, setBusy] = useState(false);
  // The simulated gateway (test environments only) stands in for Razorpay's screen.
  const [testOrder, setTestOrder] = useState<PayNowOrder | null>(null);

  if (!config?.enabled) {
    return <p className="mt-3 text-xs text-ink-muted">Online payment is not available right now. Please contact us to pay.</p>;
  }

  const finish = async (order: PayNowOrder, result: { gatewayPaymentId: string; signature: string }) => {
    await confirmPayNow(order.orderId, result);
    toast.success(`Payment of ${rupees(order.amount)} received. Thank you.`);
    refresh();
  };

  const pay = async () => {
    setBusy(true);
    let order: PayNowOrder | null = null;
    try {
      order = await startPaymentRequestOrder(task.id, r.id);
      if (order.checkout.gateway === 'simulated') { setTestOrder(order); return; }
      await finish(order, await payWithRazorpay(order));
    } catch (err) {
      if (order) reportPayNowFailure(order.orderId, (err as Error)?.message);
      if (err instanceof PayNowError && err.code === 'CANCELLED') toast.info('Payment cancelled. Nothing was charged.');
      else toast.error((err as Error)?.message || 'The payment could not be completed. Please try again.');
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const simulate = async (outcome: 'success' | 'failure') => {
    if (!testOrder) return;
    setBusy(true);
    try {
      const res = await simulatePayNow(testOrder.orderId, outcome);
      if (outcome === 'success' && res.gatewayPaymentId && res.signature) {
        await finish(testOrder, { gatewayPaymentId: res.gatewayPaymentId, signature: res.signature });
      } else {
        await reportPayNowFailure(testOrder.orderId, res.error?.reason);
        toast.error(res.error?.reason || 'The payment was declined.');
      }
      setTestOrder(null);
    } catch (err) {
      toast.error((err as Error)?.message || 'The payment could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3">
      {!testOrder ? (
        <button type="button" onClick={pay} disabled={busy} className="btn-primary min-h-11 w-full sm:w-auto justify-center disabled:opacity-50">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Pay {rupees(r.total)}
        </button>
      ) : (
        <div className="rounded-lg border border-dashed p-3" role="group" aria-label="Test payment">
          <p className="text-xs text-ink-muted">Test payment screen — no money moves in this environment.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="btn-primary min-h-11 disabled:opacity-50" disabled={busy} onClick={() => simulate('success')}>
              Complete test payment
            </button>
            <button type="button" className="btn-secondary min-h-11 disabled:opacity-50" disabled={busy} onClick={() => simulate('failure')}>
              Decline test payment
            </button>
          </div>
        </div>
      )}
      <p className="mt-2 text-xs text-ink-muted">You pay exactly this total; it is added to your payment history straight away.</p>
    </div>
  );
}
