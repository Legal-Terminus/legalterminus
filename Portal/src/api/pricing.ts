import { apiFetch } from './client';

/**
 * E24-S01 — the website's price catalogue. What a plan costs is decided here,
 * on the server; the website reads it and a payment is charged from it.
 */
export interface PricePlan {
  id: string;
  name: string;
  /** Whole rupees. */
  price: number;
  /** The crossed-out "was" price, or null for none. Always higher than `price`. */
  oldPrice: number | null;
  /** False = not on the website and cannot be bought. */
  active: boolean;
}

export interface PriceProduct {
  key: string;
  /** Permanent reference, e.g. SVC-014 — what staff and customers quote. */
  code: string;
  /** The title of the website page it is sold on. */
  label: string;
  /** Where on the website it is sold. */
  pages: { path: string; title: string }[];
  /** The portal service a paid order opens a matter on; null when there is none. */
  serviceKey: string | null;
  plans: PricePlan[];
}

export type PlanEdit = { id: string; price?: number; oldPrice?: number | null; active?: boolean };
export interface ProductEdit { serviceKey?: string | null; plans?: PlanEdit[] }

export const PRICING_QUERY_KEY = ['pricing'] as const;

export const getPricing = () =>
  apiFetch<{ products: PriceProduct[] }>('/api/pricing').then((r) => r.products);

export const updatePricing = (productKey: string, body: ProductEdit) =>
  apiFetch<{ product: PriceProduct }>(`/api/pricing/${encodeURIComponent(productKey)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }).then((r) => r.product);
