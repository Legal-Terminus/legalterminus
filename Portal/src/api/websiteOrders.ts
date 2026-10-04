import { apiFetch } from './client';

/**
 * E24 — orders placed and paid for on the website. Staff view.
 * (A client's own "My Orders" page is api/profile.ts.)
 */
export type OrderStatus = 'created' | 'paid' | 'review' | 'failed' | 'abandoned' | 'refunded';

export interface WebsiteOrder {
  orderId: string;
  status: OrderStatus;
  uid: string;
  customer: { name?: string; email?: string; phone?: string };
  /** e.g. SVC-014 — the same code shown under Website Prices. */
  productCode?: string;
  label: string;
  planName: string;
  serviceKey: string | null;
  amount: number;
  amountPaid?: number;
  gateway: string;
  gatewayPaymentId?: string | null;
  failureReason?: string | null;
  reviewReason?: string;
  /** none → nothing attempted; created → `taskId`; failed → `error`; not_applicable → `reason`. */
  matter: { state: 'none' | 'pending' | 'created' | 'failed' | 'not_applicable'; taskId?: string; error?: string; reason?: string };
  createdAt: string;
  paidAt?: string;
}

export const WEBSITE_ORDERS_KEY = ['website-orders'] as const;

export const getWebsiteOrders = (cursor?: string) =>
  apiFetch<{ data: WebsiteOrder[]; nextCursor: string | null }>(`/api/orders?limit=25${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);

/** Try again to open the matter of a paid order that has none. */
export const retryOrderMatter = (orderId: string) =>
  apiFetch<WebsiteOrder>(`/api/orders/${orderId}/retry-matter`, { method: 'POST' });

/** Ask the payment gateway what really happened to an order. */
export const reconcileOrder = (orderId: string) =>
  apiFetch<{ outcome: 'paid' | 'review' | 'noop' | 'not_paid'; order: WebsiteOrder }>(`/api/orders/${orderId}/reconcile`, { method: 'POST' });
