import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Loader2, Search } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { SkeletonCards } from '../../components/common/Skeleton';
import { useToast } from '../../components/common/toastContext';
import { useAuthStore } from '../../store/authStore';
import { getServiceCatalog } from '../../api/services';
import { getWorkflowDefinitions } from '../../api/workflowDefinitions';
import {
  getPricing, updatePricing, PRICING_QUERY_KEY,
  type PlanEdit, type PricePlan, type PriceProduct, type ProductEdit,
} from '../../api/pricing';

/**
 * E24-S01 — Website prices.
 *
 * The one place a price on the website is changed. The website reads these
 * prices, and a payment is charged from them, so what a customer sees and what
 * they pay cannot differ. A change shows on the website within a couple of
 * minutes — no release needed.
 *
 * Admins edit; managers can look. Plans cannot be added or removed here: each
 * plan is a card on a website page, and a plan with no card (or a card with no
 * plan) would be a broken page. A plan can be taken off sale instead.
 */

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** What is being typed for one plan. Strings, so a half-typed number is allowed. */
interface Draft { price: string; oldPrice: string; active: boolean }
const toDraft = (p: PricePlan): Draft => ({ price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '', active: p.active });
const whole = (s: string) => (/^\d+$/.test(s.trim()) ? Number(s.trim()) : NaN);

/** The first thing wrong with a product's drafts, in words — or null. */
function problem(plans: PricePlan[], drafts: Record<string, Draft>): string | null {
  for (const p of plans) {
    const d = drafts[p.id];
    const price = whole(d.price);
    if (!Number.isFinite(price) || price < 1) return `${p.name}: enter the price in whole rupees.`;
    if (d.oldPrice.trim()) {
      const old = whole(d.oldPrice);
      if (!Number.isFinite(old)) return `${p.name}: enter the crossed-out price in whole rupees, or leave it empty.`;
      if (old <= price) return `${p.name}: the crossed-out price must be higher than the price.`;
    }
  }
  if (!plans.some((p) => drafts[p.id].active)) return 'Keep at least one plan on sale.';
  return null;
}

/** Only what actually changed — so one admin's edit cannot undo another's. */
function changes(product: PriceProduct, drafts: Record<string, Draft>, serviceKey: string | null): ProductEdit {
  const plans: PlanEdit[] = [];
  for (const p of product.plans) {
    const d = drafts[p.id];
    const edit: PlanEdit = { id: p.id };
    if (whole(d.price) !== p.price) edit.price = whole(d.price);
    const old = d.oldPrice.trim() ? whole(d.oldPrice) : null;
    if (old !== p.oldPrice) edit.oldPrice = old;
    if (d.active !== p.active) edit.active = d.active;
    if (Object.keys(edit).length > 1) plans.push(edit);
  }
  return {
    ...(plans.length ? { plans } : {}),
    ...(serviceKey !== product.serviceKey ? { serviceKey } : {}),
  };
}

export default function WebsitePricesPage() {
  const role = useAuthStore((s) => s.role);
  const canEdit = role === 'admin';
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const { data: products, isLoading, isError } = useQuery({ queryKey: PRICING_QUERY_KEY, queryFn: getPricing });
  const { data: catalog } = useQuery({ queryKey: ['service-catalog'], queryFn: getServiceCatalog, staleTime: 60_000 });
  const { data: workflows } = useQuery({ queryKey: ['workflow-definitions'], queryFn: getWorkflowDefinitions, staleTime: 60_000 });

  const services = useMemo(
    () => Object.values(catalog?.services ?? {}).sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [catalog],
  );
  /** Portal services that have a workflow — only these can open a matter by themselves. */
  const withWorkflow = useMemo(
    () => new Set((workflows ?? []).flatMap((w) => w.serviceKeys ?? [])),
    [workflows],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products ?? []).filter((p) => !q || p.label.toLowerCase().includes(q) || p.key.includes(q));
  }, [products, query]);

  return (
    <PageShell
      title="Website prices"
      subtitle="What each plan costs on the website. A change appears there within a couple of minutes."
    >
      {isLoading ? <SkeletonCards count={4} /> : isError || !products ? (
        <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">The prices could not be loaded.</div>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-muted">
          No prices have been loaded yet. Ask your developer to run the price setup.
        </div>
      ) : (
        <div className="max-w-3xl space-y-3">
          {!canEdit && (
            <p className="text-sm text-ink-muted">You can view prices. Only an admin can change them.</p>
          )}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search services"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              className="input-field pl-10"
            />
          </div>

          {shown.length === 0 && <p className="text-sm text-ink-muted py-6 text-center">No service matches “{query}”.</p>}

          {shown.map((p) => (
            <ProductCard
              key={p.key}
              product={p}
              isOpen={open === p.key}
              onToggle={() => setOpen(open === p.key ? null : p.key)}
              canEdit={canEdit}
              services={services}
              opensMatter={!!p.serviceKey && withWorkflow.has(p.serviceKey)}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function ProductCard({ product, isOpen, onToggle, canEdit, services, opensMatter }: {
  product: PriceProduct;
  isOpen: boolean;
  onToggle: () => void;
  canEdit: boolean;
  services: { key: string; displayName: string }[];
  opensMatter: boolean;
}) {
  const qc = useQueryClient();
  const toast = useToast();
  const initial = () => Object.fromEntries(product.plans.map((p) => [p.id, toDraft(p)]));
  const [drafts, setDrafts] = useState<Record<string, Draft>>(initial);
  const [serviceKey, setServiceKey] = useState<string | null>(product.serviceKey);

  const edit = changes(product, drafts, serviceKey);
  const dirty = Object.keys(edit).length > 0;
  const error = problem(product.plans, drafts);
  const reset = () => { setDrafts(initial()); setServiceKey(product.serviceKey); };

  const save = useMutation({
    mutationFn: () => updatePricing(product.key, edit),
    onSuccess: (saved) => {
      qc.setQueryData<PriceProduct[]>(PRICING_QUERY_KEY, (all) => all?.map((x) => (x.key === saved.key ? saved : x)));
      setDrafts(Object.fromEntries(saved.plans.map((p) => [p.id, toDraft(p)])));
      setServiceKey(saved.serviceKey);
      toast.success(`${saved.label}: prices saved. The website updates within a couple of minutes.`);
    },
    onError: (e: Error) => toast.error(e.message || 'Could not save the prices.'),
  });

  const onSale = product.plans.filter((p) => p.active);
  const range = onSale.length
    ? [Math.min(...onSale.map((p) => p.price)), Math.max(...onSale.map((p) => p.price))]
    : null;
  const set = (id: string, patch: Partial<Draft>) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  const panelId = `prices-${product.key}`;

  return (
    <section className="card overflow-hidden" aria-label={product.label}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full min-h-11 flex items-center gap-3 p-4 text-left hover:bg-surface-soft"
      >
        {isOpen ? <ChevronDown className="w-4 h-4 text-ink-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />}
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink truncate">{product.label}</span>
          <span className="block text-xs text-ink-muted">
            {product.plans.length} {product.plans.length === 1 ? 'plan' : 'plans'}
            {range && ` · ${range[0] === range[1] ? inr(range[0]) : `${inr(range[0])} – ${inr(range[1])}`}`}
            {onSale.length < product.plans.length && ` · ${product.plans.length - onSale.length} off sale`}
          </span>
        </span>
        {/* Neutral unless something will happen: opening a matter is the exception worth marking. */}
        <span className={opensMatter ? 'badge-blue shrink-0' : 'badge-gray shrink-0'}>
          {opensMatter ? 'Opens a matter' : 'No matter opened'}
        </span>
      </button>

      {isOpen && (
        <div id={panelId} className="border-t border-hairline p-4 space-y-4">
          <div className="space-y-3">
            {product.plans.map((p) => {
              const d = drafts[p.id];
              return (
                <fieldset key={p.id} className="rounded-lg border border-hairline p-3" disabled={!canEdit || save.isPending}>
                  <legend className="px-1 text-sm font-medium text-ink">{p.name}</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div>
                      <label htmlFor={`${product.key}-${p.id}-price`} className="input-label">Price (₹)</label>
                      <input
                        id={`${product.key}-${p.id}-price`}
                        inputMode="numeric"
                        value={d.price}
                        onChange={(e) => set(p.id, { price: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${product.key}-${p.id}-old`} className="input-label">Crossed-out price (₹)</label>
                      <input
                        id={`${product.key}-${p.id}-old`}
                        inputMode="numeric"
                        value={d.oldPrice}
                        onChange={(e) => set(p.id, { oldPrice: e.target.value })}
                        placeholder="None"
                        className="input-field"
                      />
                    </div>
                    <label className="flex items-center gap-2 min-h-11 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={d.active}
                        onChange={(e) => set(p.id, { active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      On sale
                    </label>
                  </div>
                </fieldset>
              );
            })}
          </div>

          <div>
            <label htmlFor={`${product.key}-service`} className="input-label">Portal service</label>
            <select
              id={`${product.key}-service`}
              value={serviceKey ?? ''}
              onChange={(e) => setServiceKey(e.target.value || null)}
              disabled={!canEdit || save.isPending}
              className="input-field"
            >
              <option value="">None</option>
              {/* Keep a link to a service that has since been removed visible, so it can be cleared. */}
              {serviceKey && !services.some((s) => s.key === serviceKey) && <option value={serviceKey}>{serviceKey}</option>}
              {services.map((s) => <option key={s.key} value={s.key}>{s.displayName}</option>)}
            </select>
            <p className="text-xs text-ink-muted mt-1">
              {opensMatter
                ? 'When someone pays for this on the website, a matter is opened for them on this service.'
                : 'When someone pays for this on the website, no matter is opened by itself — your team is told. Link it to a service that has a workflow to open one.'}
            </p>
          </div>

          {canEdit && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                type="button"
                onClick={() => save.mutate()}
                disabled={!dirty || !!error || save.isPending}
                className="btn-primary justify-center disabled:opacity-50"
              >
                {save.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save prices
              </button>
              <button type="button" onClick={reset} disabled={!dirty || save.isPending} className="btn-secondary justify-center disabled:opacity-50">
                Undo changes
              </button>
              {dirty && error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
