import { getIdToken } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { shareBlobNative } from '../lib/native';
import { apiFetch } from './client';

/**
 * #256, #257, #260 — coupon codes for the website checkout, and the Coupon &
 * Discount report. Admin and manager only (the API enforces it).
 */
export type DiscountType = 'percent' | 'fixed';
export type CouponScope = 'general' | 'services' | 'min_amount';
export type CouponValidity = 'one_time' | 'period';
/** Where a coupon stands now — worked out by the server. */
export type CouponState = 'active' | 'inactive' | 'scheduled' | 'expired' | 'in_checkout' | 'used';

export interface Coupon {
  code: string;
  description: string;
  discountType: DiscountType;
  /** Percent (1–100) or whole rupees. */
  discountValue: number;
  scope: CouponScope;
  /** `services` scope: the website products it applies to. */
  productKeys: string[];
  /** `min_amount` scope: the order's price before GST must reach this. */
  minAmount: number | null;
  validity: CouponValidity;
  /** `period` validity: the first and last moments it can be used (IST days). */
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  usedCount: number;
  consumedBy?: { orderId: string; uid: string; at: string } | null;
  createdBy?: { uid: string; name: string };
  createdAt: string;
  updatedAt?: string;
  state: CouponState;
}

/** What the form sends. Dates are IST calendar days, `YYYY-MM-DD`. */
export interface CouponInput {
  code?: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  scope: CouponScope;
  productKeys?: string[];
  minAmount?: number;
  validity: CouponValidity;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export interface CouponRedemption {
  id: string;
  orderId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  couponCreatedBy: { uid: string; name: string } | null;
  couponCreatedAt: string | null;
  clientName: string;
  clientEmail: string;
  services: { label: string; planName: string; listPrice: number; discount: number; price: number; gst: number; amount: number }[];
  /** Before the discount and before GST. originalAmount − discount + gst = amountCharged. */
  originalAmount: number;
  discount: number;
  gst: number;
  amountCharged: number;
  amountPaid: number;
  paidAt: string;
  note?: string;
}

export const COUPONS_KEY = ['coupons'] as const;
export const COUPON_REDEMPTIONS_KEY = ['coupon-redemptions'] as const;

export const getCoupons = (cursor?: string, limit = 25) =>
  apiFetch<{ data: Coupon[]; nextCursor: string | null }>(`/api/coupons?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);

export const getCoupon = (code: string) => apiFetch<Coupon>(`/api/coupons/${encodeURIComponent(code)}`);

export const createCoupon = (body: CouponInput) =>
  apiFetch<Coupon>('/api/coupons', { method: 'POST', body: JSON.stringify(body) });

export const updateCoupon = (code: string, body: CouponInput) =>
  apiFetch<Coupon>(`/api/coupons/${encodeURIComponent(code)}`, { method: 'PUT', body: JSON.stringify(body) });

export const setCouponActive = (code: string, active: boolean) =>
  apiFetch<Coupon>(`/api/coupons/${encodeURIComponent(code)}`, { method: 'PATCH', body: JSON.stringify({ active }) });

export const deleteCoupon = (code: string) =>
  apiFetch<{ deleted: true }>(`/api/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' });

export interface RedemptionFilters { from?: string; to?: string }

const query = (f: RedemptionFilters) => Object.entries(f).filter(([, v]) => v).map(([k, v]) => `&${k}=${encodeURIComponent(v as string)}`).join('');

export const getRedemptions = (filters: RedemptionFilters, cursor?: string) =>
  apiFetch<{ data: CouponRedemption[]; nextCursor: string | null }>(`/api/coupons/redemptions?limit=25${query(filters)}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);

/**
 * The report as CSV. Fetched with the sign-in token (a plain link cannot send
 * it), then handed over: the share sheet in the app, a download in a browser.
 */
export async function downloadRedemptionsCsv(filters: RedemptionFilters): Promise<void> {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const headers: Record<string, string> = {};
  if (auth.currentUser) headers.Authorization = `Bearer ${await getIdToken(auth.currentUser)}`;
  const res = await fetch(`${base}/api/coupons/redemptions?format=csv${query(filters)}`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Could not download the CSV.');
  }
  const blob = new Blob([await res.blob()], { type: 'text/csv' });
  const fileName = `coupon-report-${new Date().toISOString().slice(0, 10)}.csv`;
  if (await shareBlobNative(blob, fileName)) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/* ───────────────────────────── Words ───────────────────────────── */

export const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const discountText = (c: { discountType: DiscountType; discountValue: number }) =>
  (c.discountType === 'percent' ? `${c.discountValue}% off` : `${inr(c.discountValue)} off`);
export const SCOPE_LABEL: Record<CouponScope, string> = {
  general: 'General — every service',
  services: 'Specific services',
  min_amount: 'Minimum order amount',
};
export const istDay = (iso?: string | null) => (iso
  ? new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' })
  : '—');
/** The IST calendar date of an instant, `YYYY-MM-DD` — what a date input holds. */
export const istDate = (iso: string) => new Date(Date.parse(iso) + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
export const validityText = (c: Pick<Coupon, 'validity' | 'startsAt' | 'endsAt'>) =>
  (c.validity === 'one_time' ? 'One-time use' : `${istDay(c.startsAt)} – ${istDay(c.endsAt)}`);
