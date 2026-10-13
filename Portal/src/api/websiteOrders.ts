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
  /** #212: the plan's price before GST, and the GST added. Absent on orders made before GST was added. */
  price?: number;
  gst?: number;
  gstPercent?: number;
  /** The total charged: price + GST. */
  amount: number;
  amountPaid?: number;
  gateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string | null;
  /** card, upi, netbanking, wallet… as the gateway reported it. */
  method?: string | null;
  /** How we learned it was paid: the customer's return, the gateway's own message, or a staff check. */
  settledBy?: 'return' | 'webhook' | 'reconcile';
  productKey?: string;
  planId?: string;
  failureReason?: string | null;
  reviewReason?: string;
  /**
   * none → nothing attempted; awaiting_approval → paid, waiting for staff to
   * approve (#212); pending → being opened; created → `taskId`; failed →
   * `error`; not_applicable → `reason`.
   */
  matter: { state: 'none' | 'awaiting_approval' | 'pending' | 'created' | 'failed' | 'not_applicable'; taskId?: string; error?: string; reason?: string;
    /** Who approved the order, and when. */
    approvedBy?: string; approvedByName?: string; approvedAt?: string;
    /** The matter this order opened has since been deleted. */
    deleted?: boolean };
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
}

export const WEBSITE_ORDERS_KEY = ['website-orders'] as const;

export const getWebsiteOrders = (cursor?: string) =>
  apiFetch<{ data: WebsiteOrder[]; nextCursor: string | null }>(`/api/orders?limit=25${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);

/** Approve a paid order: its matter is opened (#212). */
export const approveOrder = (orderId: string) =>
  apiFetch<WebsiteOrder>(`/api/orders/${orderId}/approve`, { method: 'POST' });

/** Try again to open the matter of a paid order that has none. */
export const retryOrderMatter = (orderId: string) =>
  apiFetch<WebsiteOrder>(`/api/orders/${orderId}/retry-matter`, { method: 'POST' });

/** Ask the payment gateway what really happened to an order. */
export const reconcileOrder = (orderId: string) =>
  apiFetch<{ outcome: 'paid' | 'review' | 'noop' | 'not_paid'; order: WebsiteOrder }>(`/api/orders/${orderId}/reconcile`, { method: 'POST' });
