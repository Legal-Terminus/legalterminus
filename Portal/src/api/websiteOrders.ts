import { apiFetch } from './client';
import type { RefundSummary } from './refunds';

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
  /** #220: `matter_balance` is a client's Pay Now payment towards an existing matter. */
  kind?: 'matter_balance';
  taskId?: string;
  /**
   * #220 Pay Now orders: balance → waiting for payment; crediting → being added
   * to the matter; credited → in the matter's payment history; credit_failed →
   * paid, but not added (`error`) — staff retry.
   */
  matter: { state: 'none' | 'awaiting_approval' | 'pending' | 'created' | 'failed' | 'not_applicable'
      | 'balance' | 'crediting' | 'credited' | 'credit_failed';
    taskId?: string; error?: string; reason?: string;
    /** Who approved the order, and when. */
    approvedBy?: string; approvedByName?: string; approvedAt?: string;
    /** The matter this order opened has since been deleted. */
    deleted?: boolean };
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
  /** #240: rollup of refunds recorded against this order before approval. */
  refundSummary?: RefundSummary;
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

/* ─────────────── The client's own service requests (#242) ─────────────── */

/**
 * Where a client's website order stands. Payment and approval are separate:
 * a paid order waits for the firm to approve it before any matter is opened.
 */
export type ServiceRequestStage = 'awaiting_approval' | 'under_review' | 'refund_in_progress' | 'refunded' | 'approved';

export interface ServiceRequest {
  orderId: string;
  status: OrderStatus;
  label: string;
  planName: string;
  amount: number;
  amountPaid: number;
  createdAt: string;
  paidAt: string | null;
  paymentReference: string | null;
  /** Set once the matter is open. */
  matterId: string | null;
  stage: ServiceRequestStage;
  refund: RefundSummary | null;
}

export const MY_SERVICE_REQUESTS_KEY = ['my-service-requests'] as const;

/** The signed-in client's own paid website orders — whose comes from the sign-in, never the page. */
export const getMyServiceRequests = () =>
  apiFetch<{ data: ServiceRequest[] }>('/api/orders/mine');

/** Ask the payment gateway what really happened to an order. */
export const reconcileOrder = (orderId: string) =>
  apiFetch<{ outcome: 'paid' | 'review' | 'noop' | 'not_paid'; order: WebsiteOrder }>(`/api/orders/${orderId}/reconcile`, { method: 'POST' });
