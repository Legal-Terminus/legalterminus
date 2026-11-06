import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import { useConfirm } from '../../components/common/confirmContext';
import { getPricing, PRICING_QUERY_KEY } from '../../api/pricing';
import {
  COUPONS_KEY, SCOPE_LABEL, deleteCoupon, discountText, getCoupons, inr, setCouponActive, validityText,
  type Coupon, type CouponState,
} from '../../api/coupons';

/**
 * #256, #257, #260 — coupon codes for the website checkout. Admins and
 * managers create them, switch them on and off, and see how often each was
 * used. A customer types a code at checkout; the server checks it and prices
 * the order with it. What happened to each use is the Coupon & Discount report.
 */

// Colour marks the exception: a code that works is the normal case.
const STATE: Record<CouponState, { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'badge-green' },
  in_checkout: { label: 'In a checkout', cls: 'badge-blue' },
  scheduled: { label: 'Not started', cls: 'badge-gray' },
  expired: { label: 'Expired', cls: 'badge-gray' },
  inactive: { label: 'Switched off', cls: 'badge-gray' },
  used: { label: 'Used', cls: 'badge-gray' },
};

/** "Applies to" in words, with the services' names. */
function scopeText(c: Coupon, names: Record<string, string>) {
  if (c.scope === 'services') return `Only ${c.productKeys.map((k) => names[k] ?? k).join(', ')}`;
  if (c.scope === 'min_amount') return `Orders of ${inr(c.minAmount ?? 0)} or more (before GST)`;
  return SCOPE_LABEL.general;
}

export default function CouponsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: COUPONS_KEY,
    queryFn: ({ pageParam }) => getCoupons(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
  const coupons = data?.pages.flatMap((p) => p.data) ?? [];
  const { data: products } = useQuery({ queryKey: PRICING_QUERY_KEY, queryFn: getPricing, staleTime: 60_000 });
  const names = Object.fromEntries((products ?? []).map((p) => [p.key, p.label]));
  const refresh = () => qc.invalidateQueries({ queryKey: COUPONS_KEY });

  const toggle = useMutation({
    mutationFn: (c: Coupon) => setCouponActive(c.code, !c.active),
    onSuccess: (c) => { refresh(); toast.success(c.active ? `${c.code} is switched on.` : `${c.code} is switched off.`); },
    onError: (e: Error) => toast.error(e.message || 'Could not change the coupon.'),
  });
  const remove = useMutation({
    mutationFn: (c: Coupon) => deleteCoupon(c.code),
    onSuccess: (_r, c) => { refresh(); toast.success(`${c.code} deleted.`); },
    onError: (e: Error) => toast.error(e.message || 'Could not delete the coupon.'),
  });
  const busy = toggle.isPending || remove.isPending;

  const onDelete = async (c: Coupon) => {
    const ok = await confirm({
      title: `Delete ${c.code}?`,
      message: 'Only a code nobody has used can be deleted. Customers will no longer be able to apply it.',
      confirmLabel: 'Delete', tone: 'danger',
    });
    if (ok) remove.mutate(c);
  };

  const Actions = ({ c }: { c: Coupon }) => (
    <div className="flex flex-wrap gap-2">
      <Link to={`/settings/coupons/edit/${encodeURIComponent(c.code)}`} className="btn-secondary min-h-11"
        aria-label={`Edit coupon ${c.code}`}>Edit</Link>
      {c.state !== 'used' && (
        <button type="button" className="btn-secondary min-h-11 disabled:opacity-50" disabled={busy}
          aria-label={`${c.active ? 'Switch off' : 'Switch on'} coupon ${c.code}`} onClick={() => toggle.mutate(c)}>
          {c.active ? 'Switch off' : 'Switch on'}
        </button>
      )}
      {c.usedCount === 0 && c.state !== 'in_checkout' && (
        <button type="button" className="btn-secondary min-h-11 disabled:opacity-50" disabled={busy}
          aria-label={`Delete coupon ${c.code}`} onClick={() => onDelete(c)}>
          Delete
        </button>
      )}
    </div>
  );

  return (
    <PageShell
      title="Coupons"
      subtitle="Discount codes customers can apply at checkout on the website."
      action={(
        <>
          <Link to="/reports/coupons" className="btn-secondary min-h-11">Coupon report</Link>
          <button type="button" className="btn-primary min-h-11" onClick={() => navigate('/settings/coupons/new')}>
            <Plus className="w-4 h-4" aria-hidden="true" /> New coupon
          </button>
        </>
      )}
    >
      {isLoading ? <SkeletonCards count={3} /> : isError ? (
        <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">The coupons could not be loaded.</div>
      ) : coupons.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-muted">No coupons yet. Create one with “New coupon”.</div>
      ) : (
        <>
          {/* Desktop: a table. Phones: one card per coupon — no sideways scroll. */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Coupons, newest first</caption>
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                  <th className="p-3 font-medium">Code</th>
                  <th className="p-3 font-medium">Discount</th>
                  <th className="p-3 font-medium">Applies to</th>
                  <th className="p-3 font-medium">Validity</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Used</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.code} className="border-b border-hairline last:border-0 align-top">
                    <td className="p-3">
                      <p className="font-mono font-semibold text-ink">{c.code}</p>
                      {c.description && <p className="text-xs text-ink-muted">{c.description}</p>}
                    </td>
                    <td className="p-3 whitespace-nowrap text-ink">{discountText(c)}</td>
                    <td className="p-3 text-ink-muted max-w-xs">{scopeText(c, names)}</td>
                    <td className="p-3 text-ink-muted whitespace-nowrap">{validityText(c)}</td>
                    <td className="p-3"><span className={STATE[c.state].cls}>{STATE[c.state].label}</span></td>
                    <td className="p-3 text-right">{c.usedCount}</td>
                    <td className="p-3"><Actions c={c} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="md:hidden space-y-2" aria-label="Coupons">
            {coupons.map((c) => (
              <li key={c.code} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-ink">{c.code}</p>
                    <p className="text-sm text-ink">{discountText(c)}</p>
                  </div>
                  <span className={`${STATE[c.state].cls} shrink-0`}>{STATE[c.state].label}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{scopeText(c, names)}</p>
                <p className="text-sm text-ink-muted">{validityText(c)} · used {c.usedCount} {c.usedCount === 1 ? 'time' : 'times'}</p>
                <div className="mt-3"><Actions c={c} /></div>
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <div className="mt-4 text-center">
              <button type="button" className="btn-secondary min-h-11" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
                {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />} Show older coupons
              </button>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
