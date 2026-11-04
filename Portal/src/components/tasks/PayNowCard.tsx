import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { updatePayment } from '../../api/tasks';
import {
  PAYMENT_CONFIG_KEY, PayNowError, confirmPayNow, getPaymentConfig, payWithRazorpay, reportPayNowFailure,
  simulatePayNow, startPayNow, type PayNowOrder,
} from '../../api/payNow';
import type { Task } from '../../types/task';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * #220 Pay Now, in the matter's Payments tab.
 *
 *  - CLIENT: on a part-paid matter, a Pay Now button for exactly the amount due.
 *    The amount is shown, not entered: the server charges the matter's own
 *    amount due. After payment the matter's figures and history refresh.
 *  - ADMIN / MANAGER: a switch for whether this matter's client sees Pay Now.
 *    On by default.
 */
export default function PayNowCard({ task, isClient, canEdit }: { task: Task; isClient: boolean; canEdit: boolean }) {
  const { data: config } = useQuery({ queryKey: PAYMENT_CONFIG_KEY, queryFn: getPaymentConfig, staleTime: 5 * 60_000 });
  if (canEdit) return <PayNowSwitch task={task} paymentsOn={!!config?.enabled} />;
  if (!isClient || !config?.enabled) return null;
  const due = task.amountDue ?? 0;
  if (task.paymentStatus !== 'part_paid' || due <= 0 || task.onlinePaymentEnabled === false) return null;
  return <PayNowButton task={task} due={due} />;
}

function PayNowButton({ task, due }: { task: Task; due: number }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  // The simulated gateway (test environments only) stands in for Razorpay's screen.
  const [testOrder, setTestOrder] = useState<PayNowOrder | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['payments', task.id] });
    queryClient.invalidateQueries({ queryKey: ['task-events', task.id] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const finish = async (order: PayNowOrder, result: { gatewayPaymentId: string; signature: string }) => {
    await confirmPayNow(order.orderId, result);
    toast.success(`Payment of ${rupees(order.amount)} received. Thank you.`);
    refresh();
  };

  const pay = async () => {
    setBusy(true);
    let order: PayNowOrder | null = null;
    try {
      order = await startPayNow(task.id);
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
      const r = await simulatePayNow(testOrder.orderId, outcome);
      if (outcome === 'success' && r.gatewayPaymentId && r.signature) {
        await finish(testOrder, { gatewayPaymentId: r.gatewayPaymentId, signature: r.signature });
      } else {
        await reportPayNowFailure(testOrder.orderId, r.error?.reason);
        toast.error(r.error?.reason || 'The payment was declined.');
      }
      setTestOrder(null);
    } catch (err) {
      toast.error((err as Error)?.message || 'The payment could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-5" data-testid="pay-now">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Pay the amount due online</p>
          <p className="text-xs text-ink-muted mt-1">
            {rupees(due)} is due on this matter. You pay exactly this amount; it is added to your payment history straight away.
          </p>
        </div>
        {!testOrder && (
          <button type="button" onClick={pay} disabled={busy}
            className="btn-primary min-h-11 shrink-0 justify-center disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Pay Now {rupees(due)}
          </button>
        )}
      </div>
      {testOrder && (
        <div className="mt-4 rounded-lg border border-dashed p-3" role="group" aria-label="Test payment">
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
    </div>
  );
}

function PayNowSwitch({ task, paymentsOn }: { task: Task; paymentsOn: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const enabled = task.onlinePaymentEnabled !== false;
  const save = useMutation({
    mutationFn: (on: boolean) => updatePayment(task.id, { onlinePaymentEnabled: on }),
    onSuccess: (_r, on) => {
      toast.success(on ? 'Pay Now is on for this matter.' : 'Pay Now is off for this matter.');
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task-events', task.id] });
    },
    onError: (err: Error) => toast.error(err.message || 'Could not change Pay Now.'),
  });
  return (
    <div className="card p-5">
      <label className="flex items-start gap-3 cursor-pointer min-h-11">
        <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={enabled} disabled={save.isPending}
          onChange={(e) => save.mutate(e.target.checked)} aria-label="Let the client pay the amount due online" />
        <span>
          <span className="block text-sm font-semibold text-ink">Let the client pay the amount due online (Pay Now)</span>
          <span className="block text-xs text-ink-muted mt-1">
            While the matter is part paid, the client sees a Pay Now button for exactly the amount due.
            The payment is added to the payment history by itself.
            {!paymentsOn && ' Online payment is currently switched off for the whole portal, so the button is not shown.'}
          </span>
        </span>
      </label>
    </div>
  );
}
