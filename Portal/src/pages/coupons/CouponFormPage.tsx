import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import type { ApiError } from '../../api/client';
import { getPricing, PRICING_QUERY_KEY } from '../../api/pricing';
import {
  COUPONS_KEY, createCoupon, getCoupon, inr, istDate, updateCoupon,
  type Coupon, type CouponInput, type CouponScope, type CouponValidity, type DiscountType,
} from '../../api/coupons';

/**
 * #256, #257, #260 — create or edit a coupon. A full page (not a modal) so it
 * works on a phone: /settings/coupons/new and /settings/coupons/edit/:code.
 *
 * The code cannot be changed once created — it is the coupon's identity, and
 * the report is kept by it. Every other term can be; uses already made keep
 * the figures they were made at.
 */

type Preset = '7' | '30' | 'custom';

/** Today in India, `YYYY-MM-DD`. */
const todayIst = () => istDate(new Date().toISOString());
/** A `YYYY-MM-DD` day plus n days. */
const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

interface Draft {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  scope: CouponScope;
  productKeys: string[];
  minAmount: string;
  validity: CouponValidity;
  preset: Preset;
  startDate: string;
  endDate: string;
  active: boolean;
}

const fromCoupon = (c: Coupon): Draft => ({
  code: c.code,
  description: c.description ?? '',
  discountType: c.discountType,
  discountValue: String(c.discountValue),
  scope: c.scope,
  productKeys: c.productKeys ?? [],
  minAmount: c.minAmount ? String(c.minAmount) : '',
  validity: c.validity,
  preset: 'custom',
  startDate: c.startsAt ? istDate(c.startsAt) : todayIst(),
  endDate: c.endsAt ? istDate(c.endsAt) : addDays(todayIst(), 6),
  active: c.active,
});

const blank = (): Draft => ({
  code: '', description: '', discountType: 'percent', discountValue: '', scope: 'general', productKeys: [],
  minAmount: '', validity: 'period', preset: '7', startDate: todayIst(), endDate: addDays(todayIst(), 6), active: true,
});

const whole = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : NaN);

/** The last day of the period: chosen, or worked out from a preset (the first day counts). */
const lastDay = (d: Draft) => (d.preset === 'custom' ? d.endDate : addDays(d.startDate, Number(d.preset) - 1));

/** The first thing wrong with the form, in words — or null. */
function problem(d: Draft, isNew: boolean): string | null {
  if (isNew && !/^[A-Z0-9-]{3,30}$/.test(d.code.trim().toUpperCase())) return 'Enter a code of 3 to 30 letters, numbers or hyphens.';
  const v = whole(d.discountValue);
  if (!Number.isFinite(v) || v < 1) return d.discountType === 'percent' ? 'Enter the discount as a whole percentage.' : 'Enter the discount in whole rupees.';
  if (d.discountType === 'percent' && v > 100) return 'A percentage discount can be at most 100%.';
  if (d.scope === 'services' && d.productKeys.length === 0) return 'Choose at least one service this code applies to.';
  if (d.scope === 'min_amount') {
    const m = whole(d.minAmount);
    if (!Number.isFinite(m) || m < 1) return 'Enter the minimum order amount in whole rupees.';
  }
  if (d.validity === 'period') {
    if (!d.startDate) return 'Choose the first day the code can be used.';
    if (!lastDay(d)) return 'Choose the last day the code can be used.';
    if (lastDay(d) < d.startDate) return 'The last day cannot be before the first day.';
  }
  return null;
}

function toInput(d: Draft, isNew: boolean): CouponInput {
  return {
    ...(isNew ? { code: d.code.trim().toUpperCase() } : {}),
    ...(d.description.trim() ? { description: d.description.trim() } : {}),
    discountType: d.discountType,
    discountValue: whole(d.discountValue),
    scope: d.scope,
    ...(d.scope === 'services' ? { productKeys: d.productKeys } : {}),
    ...(d.scope === 'min_amount' ? { minAmount: whole(d.minAmount) } : {}),
    validity: d.validity,
    ...(d.validity === 'period' ? { startDate: d.startDate, endDate: lastDay(d) } : {}),
    active: d.active,
  };
}

/** A server refusal in words: the first field message, else the message. */
const messageOf = (e: ApiError) => {
  const errors = (e.body as { errors?: { message: string }[] } | undefined)?.errors;
  return errors?.[0]?.message || e.message || 'Could not save the coupon.';
};

export default function CouponFormPage() {
  const { code } = useParams<{ code?: string }>();
  const isNew = !code;
  const { data: existing, isLoading, isError } = useQuery({
    queryKey: [...COUPONS_KEY, code],
    queryFn: () => getCoupon(code!),
    enabled: !isNew,
  });
  if (!isNew && isLoading) return <PageShell title="Edit coupon"><SkeletonCards count={2} /></PageShell>;
  if (!isNew && (isError || !existing)) {
    return (
      <PageShell title="Edit coupon">
        <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">This coupon could not be loaded.</div>
      </PageShell>
    );
  }
  return <CouponForm key={code ?? 'new'} existing={existing ?? null} />;
}

function CouponForm({ existing }: { existing: Coupon | null }) {
  const isNew = !existing;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const [d, setD] = useState<Draft>(() => (existing ? fromCoupon(existing) : blank()));
  const [touched, setTouched] = useState(false);
  const [search, setSearch] = useState('');
  const set = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }));
  const { data: products } = useQuery({ queryKey: PRICING_QUERY_KEY, queryFn: getPricing, staleTime: 60_000 });
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? []).filter((p) => !q || p.label.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  }, [products, search]);

  const error = problem(d, isNew);
  const used = existing?.validity === 'one_time' && existing.state === 'used';
  const save = useMutation({
    mutationFn: () => (isNew ? createCoupon(toInput(d, true)) : updateCoupon(existing!.code, toInput(d, false))),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: COUPONS_KEY });
      toast.success(isNew ? `Coupon ${c.code} created.` : `Coupon ${c.code} saved.`);
      navigate('/settings/coupons');
    },
    onError: (e: ApiError) => toast.error(messageOf(e)),
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!error) save.mutate();
  };
  const toggleProduct = (key: string) => set({
    productKeys: d.productKeys.includes(key) ? d.productKeys.filter((k) => k !== key) : [...d.productKeys, key],
  });

  const radio = 'flex items-start gap-3 min-h-11 rounded-lg border border-hairline p-3 cursor-pointer has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50';

  return (
    <PageShell
      title={isNew ? 'New coupon' : `Edit ${existing!.code}`}
      subtitle="Customers type the code at checkout on the website. The discount comes off the price before GST."
      back={(
        <button type="button" onClick={() => navigate('/settings/coupons')} className="btn-secondary min-h-11 px-3" aria-label="Back to coupons">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    >
      <form onSubmit={submit} noValidate className="max-w-2xl space-y-5">
        {used && (
          <p className="rounded-lg border border-hairline bg-surface-soft p-3 text-sm text-ink-muted">
            This one-time code has been used, so it stays switched off. Changes here do not alter the use already made.
          </p>
        )}

        <div className="card p-4 space-y-4">
          <div>
            <label htmlFor="coupon-code" className="input-label">Code</label>
            <input
              id="coupon-code" value={d.code} disabled={!isNew} autoCapitalize="characters" autoComplete="off" spellCheck={false}
              onChange={(e) => set({ code: e.target.value.toUpperCase().replace(/\s/g, '') })}
              placeholder="e.g. DIWALI25" className="input-field font-mono text-base"
            />
            <p className="text-xs text-ink-muted mt-1">
              {isNew ? '3 to 30 letters, numbers or hyphens. Each code is unique and cannot be changed later.' : 'A code cannot be changed. Create a new coupon for a different code.'}
            </p>
          </div>
          <div>
            <label htmlFor="coupon-description" className="input-label">Description <span className="text-ink-muted font-normal">(optional, for staff)</span></label>
            <input id="coupon-description" value={d.description} maxLength={200} onChange={(e) => set({ description: e.target.value })}
              placeholder="e.g. Diwali offer for newsletter readers" className="input-field text-base" />
          </div>
        </div>

        <fieldset className="card p-4 space-y-3">
          <legend className="px-1 text-sm font-semibold text-ink">Discount</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className={radio}>
              <input type="radio" name="discountType" className="mt-1 w-4 h-4" checked={d.discountType === 'percent'} onChange={() => set({ discountType: 'percent' })} />
              <span><span className="block text-sm font-medium text-ink">Percentage</span><span className="block text-xs text-ink-muted">e.g. 10% off</span></span>
            </label>
            <label className={radio}>
              <input type="radio" name="discountType" className="mt-1 w-4 h-4" checked={d.discountType === 'fixed'} onChange={() => set({ discountType: 'fixed' })} />
              <span><span className="block text-sm font-medium text-ink">Fixed amount</span><span className="block text-xs text-ink-muted">e.g. ₹500 off</span></span>
            </label>
          </div>
          <div>
            <label htmlFor="coupon-value" className="input-label">{d.discountType === 'percent' ? 'Discount (%)' : 'Discount (₹)'}</label>
            <input id="coupon-value" inputMode="numeric" value={d.discountValue} onChange={(e) => set({ discountValue: e.target.value })}
              className="input-field text-base" />
            {d.discountType === 'fixed' && (
              <p className="text-xs text-ink-muted mt-1">Never more than the services it applies to cost. Shared across them in proportion to their price.</p>
            )}
          </div>
        </fieldset>

        <fieldset className="card p-4 space-y-3">
          <legend className="px-1 text-sm font-semibold text-ink">Coupon type</legend>
          <div className="grid grid-cols-1 gap-2">
            <label className={radio}>
              <input type="radio" name="scope" className="mt-1 w-4 h-4" checked={d.scope === 'general'} onChange={() => set({ scope: 'general' })} />
              <span><span className="block text-sm font-medium text-ink">General</span><span className="block text-xs text-ink-muted">Any service; the whole cart.</span></span>
            </label>
            <label className={radio}>
              <input type="radio" name="scope" className="mt-1 w-4 h-4" checked={d.scope === 'services'} onChange={() => set({ scope: 'services' })} />
              <span><span className="block text-sm font-medium text-ink">Specific services</span><span className="block text-xs text-ink-muted">Only the services you choose; other services in the cart pay full price.</span></span>
            </label>
            <label className={radio}>
              <input type="radio" name="scope" className="mt-1 w-4 h-4" checked={d.scope === 'min_amount'} onChange={() => set({ scope: 'min_amount' })} />
              <span><span className="block text-sm font-medium text-ink">Minimum order amount</span><span className="block text-xs text-ink-muted">The whole cart, once its price before GST reaches an amount.</span></span>
            </label>
          </div>

          {d.scope === 'services' && (
            <div>
              <p className="input-label">Services ({d.productKeys.length} chosen)</p>
              <div className="relative mb-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" aria-hidden="true" />
                <input type="search" aria-label="Search services" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search services…" className="input-field pl-10 text-base" />
              </div>
              <ul className="max-h-72 overflow-y-auto rounded-lg border border-hairline divide-y divide-hairline" aria-label="Services this code applies to">
                {shown.map((p) => (
                  <li key={p.key}>
                    <label className="flex items-center gap-3 min-h-11 px-3 py-2 cursor-pointer hover:bg-surface-soft">
                      <input type="checkbox" className="w-4 h-4 shrink-0" checked={d.productKeys.includes(p.key)} onChange={() => toggleProduct(p.key)} />
                      <span className="min-w-0 text-sm text-ink">
                        <span className="font-mono text-xs text-ink-muted mr-2">{p.code}</span>{p.label}
                      </span>
                    </label>
                  </li>
                ))}
                {products && shown.length === 0 && <li className="p-3 text-sm text-ink-muted">No service matches “{search}”.</li>}
              </ul>
            </div>
          )}
          {d.scope === 'min_amount' && (
            <div>
              <label htmlFor="coupon-min" className="input-label">Minimum order, before GST (₹)</label>
              <input id="coupon-min" inputMode="numeric" value={d.minAmount} onChange={(e) => set({ minAmount: e.target.value })} className="input-field text-base" />
            </div>
          )}
        </fieldset>

        <fieldset className="card p-4 space-y-3">
          <legend className="px-1 text-sm font-semibold text-ink">Validity</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className={radio}>
              <input type="radio" name="validity" className="mt-1 w-4 h-4" checked={d.validity === 'one_time'} onChange={() => set({ validity: 'one_time' })} />
              <span><span className="block text-sm font-medium text-ink">One-time use</span><span className="block text-xs text-ink-muted">One customer, one payment. Then it switches off for everyone.</span></span>
            </label>
            <label className={radio}>
              <input type="radio" name="validity" className="mt-1 w-4 h-4" checked={d.validity === 'period'} onChange={() => set({ validity: 'period' })} />
              <span><span className="block text-sm font-medium text-ink">Time period</span><span className="block text-xs text-ink-muted">Any number of customers, between two dates.</span></span>
            </label>
          </div>
          {d.validity === 'period' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="coupon-preset" className="input-label">Valid for</label>
                <select id="coupon-preset" value={d.preset} onChange={(e) => set({ preset: e.target.value as Preset, endDate: lastDay(d) })} className="input-field text-base">
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="custom">Choose the dates</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="coupon-start" className="input-label">First day</label>
                  <input id="coupon-start" type="date" value={d.startDate} onChange={(e) => set({ startDate: e.target.value })} className="input-field text-base" />
                </div>
                <div>
                  <label htmlFor="coupon-end" className="input-label">Last day</label>
                  <input id="coupon-end" type="date" value={lastDay(d)} disabled={d.preset !== 'custom'}
                    onChange={(e) => set({ endDate: e.target.value })} className="input-field text-base" />
                </div>
              </div>
              <p className="text-xs text-ink-muted">India time: from the start of the first day to the end of the last. After that the code no longer works.</p>
            </div>
          )}
        </fieldset>

        <label className="flex items-center gap-3 min-h-11 text-sm text-ink">
          <input type="checkbox" className="w-4 h-4" checked={d.active} disabled={used} onChange={(e) => set({ active: e.target.checked })} />
          Switched on — customers can use it
        </label>

        {touched && error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {!error && d.scope === 'min_amount' && whole(d.minAmount) > 0 && (
          <p className="text-sm text-ink-muted">Customers with less than {inr(whole(d.minAmount))} before GST are told how much more to add.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button type="submit" className="btn-primary min-h-11 justify-center disabled:opacity-50" disabled={save.isPending}>
            {save.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? 'Create coupon' : 'Save coupon'}
          </button>
          <button type="button" className="btn-secondary min-h-11 justify-center" onClick={() => navigate('/settings/coupons')}>Cancel</button>
        </div>
      </form>
    </PageShell>
  );
}
