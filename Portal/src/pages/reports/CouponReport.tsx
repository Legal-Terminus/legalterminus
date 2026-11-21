import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download, Loader2 } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import {
  COUPON_REDEMPTIONS_KEY, COUPONS_KEY, discountText, downloadRedemptionsCsv, getCoupons, getRedemptions, inr, istDay,
  type CouponRedemption, type RedemptionFilters,
} from '../../api/coupons';

/**
 * #256 — the Coupon & Discount report. Each use of a coupon: the code and its
 * discount, who created it and when, the client, what they bought, what it
 * would have cost, the discount, and what they paid — plus how many times each
 * coupon has been used. Each use keeps its own figures, so editing a coupon
 * later does not change this report.
 */

const when = (iso?: string | null) => (iso
  ? new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—');
const servicesText = (r: CouponRedemption) => r.services.map((s) => `${s.label} (${s.planName})`).join(', ');

export default function CouponReport() {
  const toast = useToast();
  const [filters, setFilters] = useState<RedemptionFilters>({});
  const uses = useInfiniteQuery({
    queryKey: [...COUPON_REDEMPTIONS_KEY, filters],
    queryFn: ({ pageParam }) => getRedemptions(filters, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
  const coupons = useInfiniteQuery({
    queryKey: [...COUPONS_KEY, 'report'],
    queryFn: ({ pageParam }) => getCoupons(pageParam, 50),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
  const rows = uses.data?.pages.flatMap((p) => p.data) ?? [];
  const perCoupon = coupons.data?.pages.flatMap((p) => p.data) ?? [];
  const [downloading, setDownloading] = useState(false);
  const csv = async () => {
    setDownloading(true);
    try { await downloadRedemptionsCsv(filters); } catch (e) { toast.error((e as Error).message || 'Could not download the CSV.'); } finally { setDownloading(false); }
  };

  return (
    <PageShell
      title="Coupon & discount report"
      subtitle="Every use of a coupon code on the website, and how often each code was used."
      back={<Link to="/reports" className="btn-secondary min-h-11 px-3" aria-label="Back to reports">←</Link>}
      action={(
        <button type="button" className="btn-secondary min-h-11 disabled:opacity-50" onClick={csv} disabled={downloading}>
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" aria-hidden="true" />} CSV
        </button>
      )}
    >
      <div className="space-y-6">
        <section aria-labelledby="coupon-uses">
          <div className="flex flex-col md:flex-row md:items-end gap-3 mb-3">
            <h2 id="coupon-uses" className="text-sm font-semibold text-ink md:flex-1">Coupon uses</h2>
            <div className="grid grid-cols-2 gap-3 md:w-96">
              <div>
                <label htmlFor="coupon-from" className="input-label">Used from</label>
                <input id="coupon-from" type="date" className="input-field text-base" value={filters.from ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || undefined }))} />
              </div>
              <div>
                <label htmlFor="coupon-to" className="input-label">Used to</label>
                <input id="coupon-to" type="date" className="input-field text-base" value={filters.to ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || undefined }))} />
              </div>
            </div>
          </div>

          {uses.isLoading ? <SkeletonCards count={3} /> : uses.isError ? (
            <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">The report could not be loaded.</div>
          ) : rows.length === 0 ? (
            <div className="card p-10 text-center text-sm text-ink-muted">No coupon has been used{filters.from || filters.to ? ' in these dates' : ' yet'}.</div>
          ) : (
            <>
              <div className="card overflow-x-auto hidden md:block">
                <table className="w-full text-sm">
                  <caption className="sr-only">Coupon uses, newest first</caption>
                  <thead>
                    <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                      <th className="p-3 font-medium">Coupon</th>
                      <th className="p-3 font-medium">Created</th>
                      <th className="p-3 font-medium">Client</th>
                      <th className="p-3 font-medium">Services</th>
                      <th className="p-3 font-medium text-right">Original</th>
                      <th className="p-3 font-medium text-right">Discount</th>
                      <th className="p-3 font-medium text-right">Paid</th>
                      <th className="p-3 font-medium">Used on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-hairline last:border-0 align-top">
                        <td className="p-3">
                          <p className="font-mono font-semibold text-ink">{r.code}</p>
                          <p className="text-xs text-ink-muted">{discountText(r)}</p>
                        </td>
                        <td className="p-3 text-ink-muted">
                          <p>{r.couponCreatedBy?.name || '—'}</p>
                          <p className="text-xs">{istDay(r.couponCreatedAt)}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-ink">{r.clientName || '—'}</p>
                          <p className="text-xs text-ink-muted">{r.clientEmail}</p>
                        </td>
                        <td className="p-3 text-ink-muted max-w-xs">
                          {servicesText(r)}
                          <p className="text-xs">Order {r.orderId}</p>
                          {r.note && <p className="text-xs text-amber-800">{r.note}</p>}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">{inr(r.originalAmount)}</td>
                        <td className="p-3 text-right whitespace-nowrap">−{inr(r.discount)}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <p className="text-ink font-medium">{inr(r.amountPaid)}</p>
                          <p className="text-xs text-ink-muted">incl. {inr(r.gst)} GST</p>
                        </td>
                        <td className="p-3 text-ink-muted whitespace-nowrap">{when(r.paidAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="md:hidden space-y-2" aria-label="Coupon uses">
                {rows.map((r) => (
                  <li key={r.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-sm font-semibold text-ink">{r.code}</p>
                      <p className="text-sm font-medium text-ink">{inr(r.amountPaid)}</p>
                    </div>
                    <p className="text-sm text-ink">{r.clientName || '—'} <span className="text-ink-muted">· {r.clientEmail}</span></p>
                    <p className="text-sm text-ink-muted">{servicesText(r)}</p>
                    <p className="text-sm text-ink-muted">
                      {inr(r.originalAmount)} − {inr(r.discount)} ({discountText(r)}) + {inr(r.gst)} GST
                    </p>
                    <p className="text-xs text-ink-muted mt-1">
                      Used {when(r.paidAt)} · order {r.orderId} · created by {r.couponCreatedBy?.name || '—'} on {istDay(r.couponCreatedAt)}
                    </p>
                    {r.note && <p className="text-xs text-amber-800 mt-1">{r.note}</p>}
                  </li>
                ))}
              </ul>

              {uses.hasNextPage && (
                <div className="mt-4 text-center">
                  <button type="button" className="btn-secondary min-h-11" disabled={uses.isFetchingNextPage} onClick={() => uses.fetchNextPage()}>
                    {uses.isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />} Show older uses
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="coupon-usage">
          <h2 id="coupon-usage" className="text-sm font-semibold text-ink mb-3">Uses per coupon</h2>
          {coupons.isLoading ? <SkeletonCards count={2} /> : perCoupon.length === 0 ? (
            <div className="card p-6 text-center text-sm text-ink-muted">No coupons yet.</div>
          ) : (
            <ul className="card divide-y divide-hairline" aria-label="Uses per coupon">
              {perCoupon.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span className="min-w-0">
                    <span className="font-mono font-semibold text-ink">{c.code}</span>
                    <span className="text-ink-muted"> · {discountText(c)} · created by {c.createdBy?.name || '—'} on {istDay(c.createdAt)}</span>
                  </span>
                  <span className="shrink-0 text-ink">{c.usedCount} {c.usedCount === 1 ? 'use' : 'uses'}</span>
                </li>
              ))}
              {coupons.hasNextPage && (
                <li className="p-3 text-center">
                  <button type="button" className="btn-secondary min-h-11" disabled={coupons.isFetchingNextPage} onClick={() => coupons.fetchNextPage()}>More coupons</button>
                </li>
              )}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
