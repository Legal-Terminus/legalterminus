/**
 * Paying for a plan (E24-S02).
 *
 * The page never sends an amount. It names the PRODUCT and the PLAN; the server
 * looks the price up, creates the order, and tells the page which gateway to
 * open. The result page then asks the server what happened — it never trusts
 * what the address bar says.
 */
import { getFirebaseAuth } from "./firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/** Thrown with a `code` the caller can turn into the right message. */
class CheckoutError extends Error {
  constructor(message, code, status) { super(message); this.code = code; this.status = status; }
}

async function call(path, { method = "GET", body } = {}) {
  const user = getFirebaseAuth().currentUser;
  const token = user ? await user.getIdToken() : null;
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new CheckoutError("No connection. Check your internet and try again.", "NETWORK");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new CheckoutError(data.message || "Something went wrong. Please try again.", data.code, res.status);
  return data;
}

/** Is online payment switched on for this site, and through which gateway? */
export const getPaymentConfig = () => call("/api/orders/config").catch(() => ({ enabled: false, gateway: null }));

/**
 * #256: the plans being bought, as the server takes them — never a price.
 * #221: with the answer to a product's question (`optionId`), where it asks one;
 * the server adds that answer's surcharge itself.
 */
const withOption = (line) => ({
  productKey: line.productKey, planId: line.planId, ...(line.optionId ? { optionId: line.optionId } : {}),
});
/**
 * #244: a cart line also says HOW MANY (a whole number; the server checks the
 * limits and prices every unit itself). Never a price.
 */
const cartLine = (line) => ({
  ...withOption(line), ...(Number.isInteger(line.quantity) && line.quantity > 1 ? { quantity: line.quantity } : {}),
});
const planBody = (lines) => (Array.isArray(lines) ? { items: lines.map(cartLine) } : withOption(lines));

export const startOrder = (productKey, planId, customer, couponCode, optionId) =>
  call("/api/orders", {
    method: "POST",
    body: { ...withOption({ productKey, planId, optionId }), ...(couponCode ? { couponCode } : {}), ...(customer ? { customer } : {}) },
  });

/**
 * #244: one order, one payment, for every service in the cart. Only the plans
 * are sent; the server prices each line and the total. #256: and the coupon
 * code, if one was applied — the server checks it and prices it again.
 */
export const startCartOrder = (lines, customer, couponCode) =>
  call("/api/orders", {
    method: "POST",
    body: { ...planBody(lines), ...(couponCode ? { couponCode } : {}), ...(customer ? { customer } : {}) },
  });

/**
 * #256: what the checkout will charge, with a coupon code. `lines` is the cart
 * (an array) or one { productKey, planId }. Resolves with the server's figures
 * (original price, discount, GST, total), or rejects with the reason the code
 * cannot be used, in words.
 */
export const quoteOrder = (lines, couponCode) =>
  call("/api/orders/quote", { method: "POST", body: { ...planBody(lines), couponCode } });

/** A refusal about the coupon, not about paying: the customer can still pay without it. */
export const isCouponError = (err) => typeof err?.code === "string" && err.code.startsWith("COUPON_");

export const confirmPayment =(orderId, result) =>
  call(`/api/orders/${orderId}/verify`, { method: "POST", body: result });

export const reportFailure = (orderId, reason) =>
  call(`/api/orders/${orderId}/failed`, { method: "POST", body: { reason } }).catch(() => null);

export const getOrder = (orderId) => call(`/api/orders/${orderId}`);

/** TEST ENVIRONMENTS ONLY — plays the customer's part at the pretend gateway. */
export const simulatePayment = (orderId, outcome) =>
  call(`/api/orders/${orderId}/simulate`, { method: "POST", body: { outcome } });

export const resultUrl = (orderId) => `/payment/result?order=${encodeURIComponent(orderId)}`;

let razorpayScript = null;
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  if (!razorpayScript) {
    razorpayScript = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = resolve;
      s.onerror = () => { razorpayScript = null; reject(new CheckoutError("The payment screen could not be loaded.", "NETWORK")); };
      document.body.appendChild(s);
    });
  }
  return razorpayScript;
}

/**
 * Open Razorpay's checkout for an order. Resolves with the signed result to
 * send to confirmPayment(), or rejects with code CANCELLED / DECLINED.
 * Exercised against Razorpay TEST mode on QA (2026-10-08): a net-banking
 * payment, and a declined one.
 */
export async function payWithRazorpay(order, customer) {
  await loadRazorpay();
  return new Promise((resolve, reject) => {
    // A declined attempt does NOT end the checkout: Razorpay keeps its window
    // open and lets the customer try another card or method. Rejecting here (as
    // this first did) put our "declined" screen on top of Razorpay's still-open
    // window. So a decline is only remembered, and the checkout ends when the
    // customer pays or closes Razorpay's window.
    let lastDecline = null;
    const rz = new window.Razorpay({
      key: order.checkout.keyId,
      order_id: order.checkout.gatewayOrderId,
      amount: Math.round(order.amount * 100),
      currency: order.currency || "INR",
      name: "Legal Terminus",
      // #244: a cart's planName lists every service; Razorpay keeps descriptions short.
      description: `${order.label} — ${order.planName}`.slice(0, 250),
      prefill: { name: customer?.name || "", email: customer?.email || "", contact: customer?.phone || "" },
      handler: (r) => resolve({ gatewayPaymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
      modal: {
        ondismiss: () => reject(lastDecline
          ? new CheckoutError(lastDecline, "DECLINED")
          : new CheckoutError("Payment was cancelled.", "CANCELLED")),
      },
    });
    rz.on("payment.failed", (r) => { lastDecline = r?.error?.description || "The payment was declined."; });
    rz.open();
  });
}
