import { apiFetch } from './client';
import type { RefundSummary } from './refunds';

/**
 * E24 — orders placed and paid for on the website. Staff view.
 * (A client's own "My Orders" page is api/profile.ts.)
 */
export type OrderStatus = 'created' | 'paid' | 'review' | 'failed' | 'abandoned' | 'refunded';

/**
 * #244: one service of a cart order. A cart order's own label/price/amount are
 * the totals; each line says what it cost and which matter it opened.
 */
export interface WebsiteOrderItem {
  productKey: string;
  productCode?: string;
  planId: string;
  label: string;
  planName: string;
  serviceKey: string | null;
  price: number;
  gst: number;
  gstPercent: number;
  amount: number;
  /** #256: when a coupon reduced this line — its catalogue price, and the discount before GST. */
  listPrice?: number;
  discount?: number;
  /** #221: the answer to the product's question (e.g. User type: Prior User) and what it added before GST. */
  optionId?: string;
  optionLabel?: string;
  optionName?: string;
  basePrice?: number;
  surcharge?: number;
  /**
   * #244: one UNIT of a line of several ("2 of 3 Trademark Registrations"):
   * the line's quantity and this unit's number. Absent on a line of one — and
   * on every order made before quantities, which is a quantity of 1.
   */
  quantity?: number;
  unitNo?: number;
  matter: { state: 'none' | 'awaiting_approval' | 'created' | 'failed' | 'not_applicable';
    taskId?: string; error?: string; reason?: string; deleted?: boolean };
}

export interface WebsiteOrder {
  /** #244: present only on an order of two or more services. */
  items?: WebsiteOrderItem[];
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
  /**
   * #256: the coupon code used, the discount it gave (before GST) and the
   * price before it. `price` and `amount` are AFTER the discount.
   */
  couponCode?: string;
  discount?: number;
  subtotalBeforeDiscount?: number;
  coupon?: { discountType: 'percent' | 'fixed'; discountValue: number };
  /**
   * #221: the answer to the product's question — e.g. User type: Prior User —
   * the plan's own price, and the extra charge the answer added (before GST).
   * `planName` already names the answer: "Supreme (Prior User)".
   */
  optionId?: string;
  optionLabel?: string;
  optionName?: string;
  basePrice?: number;
  surcharge?: number;
  amountPaid?: number;
  /**
   * #276 — Razorpay Customer Fee Bearer: the convenience fee the CLIENT paid on
   * top of the order (Razorpay's fee for the method they chose, GST included),
   * its GST, and what left their account (amount + fee). Staff only; absent
   * when no fee was paid. `amountPaid` stays the order's own amount.
   */
  convenienceFee?: number;
  convenienceFeeTax?: number | null;
  gatewayAmount?: number;
  gateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string | null;
  /** card, upi, netbanking, wallet… as the gateway reported it. */
  method?: string | null;
  /** How we learned it was paid: the customer's return, the gateway's own message, or a staff check. */
  settledBy?: 'return' | 'webhook' | 'reconcile';
  /** null on a cart order (#244): its services are in `items`. */
  productKey?: string | null;
  planId?: string | null;
  failureReason?: string | null;
  reviewReason?: string;
  /**
   * none → nothing attempted; awaiting_approval → paid, waiting for staff to
   * approve (#212); pending → being opened; created → `taskId`; failed →
   * `error`; not_applicable → `reason`.
   */
  /** #220: `matter_balance` is a client's Pay Now payment towards an existing matter. */
  kind?: 'matter_balance' | 'payment_request';
  taskId?: string;
  /** #222: the additional payment request a `payment_request` order pays. */
  requestId?: string;
  /**
   * #220 Pay Now orders: balance → waiting for payment; crediting → being added
   * to the matter; credited → in the matter's payment history; credit_failed →
   * paid, but not added (`error`) — staff retry.
   */
  matter: { state: 'none' | 'awaiting_approval' | 'pending' | 'created' | 'failed' | 'not_applicable'
      | 'balance' | 'request' | 'crediting' | 'credited' | 'credit_failed';
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
