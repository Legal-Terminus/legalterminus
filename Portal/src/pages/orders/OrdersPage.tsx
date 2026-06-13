import { useQuery } from '@tanstack/react-query';
import PageShell from '../../components/common/PageShell';
import { getMyOrders, type Order } from '../../api/profile';
import { Package, AlertCircle, Calendar, IndianRupee } from 'lucide-react';

// Tolerates ISO strings, Firestore Timestamp objects, or missing.
function formatDate(value: unknown): string {
  if (!value) return '—';
  let ms = 0;
  if (typeof value === 'string' || typeof value === 'number') ms = new Date(value).getTime();
  else if (typeof value === 'object') {
    const o = value as { _seconds?: number; seconds?: number };
    const s = o._seconds ?? o.seconds;
    if (s != null) ms = s * 1000;
  }
  if (!ms || Number.isNaN(ms)) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusBadge(status?: string): string {
  switch ((status ?? '').toLowerCase()) {
    case 'success': return 'badge-green';
    case 'failed': return 'badge-red';
    case 'pending': return 'badge-amber';
    default: return 'badge-gray';
  }
}

export default function OrdersPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['myOrders'], queryFn: getMyOrders });
  const orders: Order[] = data?.orders ?? [];

  return (
    <PageShell title="My Orders" subtitle={isLoading ? undefined : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}>
      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading orders…</span>
        </div>
      ) : error ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <AlertCircle className="w-10 h-10 text-red-300" />
          <p className="text-sm font-medium text-red-600">Couldn’t load orders</p>
          <p className="text-xs text-ink-faint">{(error as Error).message}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Package className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{o.planName || o.sourceLabel || 'Order'}</p>
                  {o.sourceLabel && o.planName && (
                    <p className="text-xs text-ink-faint truncate">{o.sourceLabel}</p>
                  )}
                  <p className="text-xs text-ink-faint mt-1 font-mono">{o.orderId || o.id}</p>
                </div>
                <span className={`badge shrink-0 ${statusBadge(o.status)}`}>{o.status || 'unknown'}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-hairline-soft flex items-center justify-between text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-300" />{formatDate(o.paymentDate)}
                </span>
                {o.amount != null && (
                  <span className="flex items-center gap-0.5 font-semibold text-ink">
                    <IndianRupee className="w-3.5 h-3.5" />{o.amount.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {o.status?.toLowerCase() === 'failed' && o.failureReason && (
                <p className="text-xs text-red-500 mt-2">{o.failureReason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
