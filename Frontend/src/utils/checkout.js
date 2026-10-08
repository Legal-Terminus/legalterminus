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

export const startOrder = (productKey, planId, customer) =>
  call("/api/orders", { method: "POST", body: { productKey, planId, ...(customer ? { customer } : {}) } });

export const confirmPayment = (orderId, result) =>
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
      description: `${order.label} — ${order.planName}`,
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
