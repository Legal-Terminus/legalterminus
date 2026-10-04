import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import {
  getWebsiteOrders, reconcileOrder, retryOrderMatter, WEBSITE_ORDERS_KEY,
  type OrderStatus, type WebsiteOrder,
} from '../../api/websiteOrders';

/**
 * E24 — Website orders: what was bought and paid for on the website, and what
 * became of it.
 *
 * The question this screen answers is "did every payment turn into work?". So
 * each row says whether a matter was opened, and when it was not, WHY and what
 * to do — because a payment with no matter is a customer waiting for nothing.
 */

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;
const when = (iso?: string) => (iso
  ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  : '—');

// Colour marks the exception. A paid order is the normal, good case; an order
// nobody finished is not staff's problem, so it stays neutral.
const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  paid: { label: 'Paid', cls: 'badge-green' },
  review: { label: 'Needs review', cls: 'badge-amber' },
  created: { label: 'In progress', cls: 'badge-blue' },
  failed: { label: 'Not completed', cls: 'badge-gray' },
  abandoned: { label: 'Abandoned', cls: 'badge-gray' },
  refunded: { label: 'Refunded', cls: 'badge-gray' },
};

/** What to tell staff about the matter, and whether there is something to do. */
function matterLine(o: WebsiteOrder): { text: string; warn: boolean } {
  if (o.status === 'review') return { text: o.reviewReason ?? 'The amount paid does not match. Check before opening a matter.', warn: true };
  if (o.status !== 'paid') return { text: '—', warn: false };
  switch (o.matter.state) {
    case 'created': return { text: 'Matter opened', warn: false };
    case 'failed': return { text: `Could not open the matter: ${o.matter.error ?? 'unknown reason'}`, warn: true };
    case 'not_applicable': return { text: `No matter opened. ${o.matter.reason ?? ''} Open one by hand.`, warn: true };
    default: return { text: 'Opening the matter…', warn: false };
  }
}

export default function WebsiteOrdersPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: WEBSITE_ORDERS_KEY,
    queryFn: ({ pageParam }) => getWebsiteOrders(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    refetchInterval: 30_000,
  });
  const orders = data?.pages.flatMap((p) => p.data) ?? [];
  const refresh = () => qc.invalidateQueries({ queryKey: WEBSITE_ORDERS_KEY });

  const retry = useMutation({
    mutationFn: retryOrderMatter,
    onSuccess: (o) => {
      refresh();
      if (o.matter.state === 'created') toast.success('Matter opened.');
      else toast.error(o.matter.error || o.matter.reason || 'The matter could not be opened.');
    },
    onError: (e: Error) => toast.error(e.message || 'Could not open the matter.'),
  });
  const check = useMutation({
    mutationFn: reconcileOrder,
    onSuccess: (r) => {
      refresh();
      if (r.outcome === 'not_paid') toast.info('The payment gateway has no payment for this order.');
      else if (r.outcome === 'review') toast.info('A payment was found, but for a different amount. It needs review.');
      else toast.success('A payment was found and the order is now paid.');
    },
    onError: (e: Error) => toast.error(e.message || 'Could not check with the payment gateway.'),
  });
  const busy = retry.isPending || check.isPending;

  const Actions = ({ o }: { o: WebsiteOrder }) => (
    <div className="flex flex-wrap gap-2">
      {o.matter.state === 'created' && o.matter.taskId && (
        <Link to={`/tasks/${o.matter.taskId}`} className="btn-secondary min-h-11">Open matter</Link>
      )}
      {o.status === 'paid' && (o.matter.state === 'failed' || o.matter.state === 'not_applicable') && (
        <button type="button" className="btn-secondary min-h-11 disabled:opacity-50" disabled={busy}
          aria-label={`Try to open the matter for order ${o.orderId}`} onClick={() => retry.mutate(o.orderId)}>
          Try again
        </button>
      )}
      {(o.status === 'created' || o.status === 'failed' || o.status === 'abandoned') && (
        <button type="button" className="btn-secondary min-h-11 disabled:opacity-50" disabled={busy}
          aria-label={`Check order ${o.orderId} with the payment gateway`} onClick={() => check.mutate(o.orderId)}>
          Check payment
        </button>
      )}
    </div>
  );

  return (
    <PageShell
      title="Website orders"
      subtitle="What was paid for on the website, and whether a matter was opened for it."
    >
      {isLoading ? <SkeletonCards count={4} /> : isError ? (
        <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">The orders could not be loaded.</div>
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-muted">No website orders yet.</div>
      ) : (
        <>
          {/* Desktop: a table. Phones: one card per order — no sideways scroll. */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Website orders, newest first</caption>
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                  <th className="p-3 font-medium">Order</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Service</th>
                  <th className="p-3 font-medium text-right">Amount</th>
                  <th className="p-3 font-medium">Payment</th>
                  <th className="p-3 font-medium">Matter</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const m = matterLine(o);
                  return (
                    <tr key={o.orderId} className="border-b border-hairline last:border-0 align-top">
                      <td className="p-3">
                        <p className="text-ink font-medium whitespace-nowrap">{o.orderId}</p>
                        <p className="text-xs text-ink-muted">{when(o.createdAt)}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-ink">{o.customer?.name || '—'}</p>
                        <p className="text-xs text-ink-muted">{o.customer?.email}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-ink">{o.label}</p>
                        <p className="text-xs text-ink-muted">{[o.productCode, o.planName].filter(Boolean).join(' · ')}</p>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">{inr(o.amount)}</td>
                      <td className="p-3"><span className={STATUS[o.status].cls}>{STATUS[o.status].label}</span></td>
                      <td className={`p-3 max-w-xs ${m.warn ? 'text-amber-800' : 'text-ink-muted'}`}>{m.text}</td>
                      <td className="p-3"><Actions o={o} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="md:hidden space-y-2">
            {orders.map((o) => {
              const m = matterLine(o);
              return (
                <li key={o.orderId} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{o.label} — {o.planName}</p>
                      <p className="text-xs text-ink-muted">{[o.productCode, o.customer?.name || o.customer?.email || '—'].filter(Boolean).join(' · ')}</p>
                    </div>
                    <span className={`${STATUS[o.status].cls} shrink-0`}>{STATUS[o.status].label}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink">{inr(o.amount)} <span className="text-xs text-ink-muted">· {o.orderId} · {when(o.createdAt)}</span></p>
                  <p className={`mt-1 text-sm ${m.warn ? 'text-amber-800' : 'text-ink-muted'}`}>{m.text}</p>
                  <div className="mt-3"><Actions o={o} /></div>
                </li>
              );
            })}
          </ul>

          {hasNextPage && (
            <div className="mt-4 text-center">
              <button type="button" className="btn-secondary min-h-11" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
                {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />} Show older orders
              </button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
