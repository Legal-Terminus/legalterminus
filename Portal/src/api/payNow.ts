import { apiFetch } from './client';

/**
 * #220 Pay Now — a client pays what is due on their matter online.
 *
 * The Portal never sends an amount. It names the MATTER; the server reads the
 * amount due from it, creates the gateway order and says which gateway to open.
 * Confirmation goes through the same /api/orders endpoints as website orders, so
 * the payment is settled once, on a verified signal, whichever arrives first.
 */
export interface PayNowOrder {
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  planName: string;
  matterId: string | null;
  checkout: { gateway: 'razorpay' | 'simulated'; gatewayOrderId: string; keyId?: string };
}

export interface PaymentConfig { enabled: boolean; gateway: 'razorpay' | 'simulated' | null }

export const PAYMENT_CONFIG_KEY = ['payment-config'] as const;

/** Is online payment on, and through which gateway? Off when it cannot be read. */
export const getPaymentConfig = () =>
  apiFetch<PaymentConfig>('/api/orders/config').catch((): PaymentConfig => ({ enabled: false, gateway: null }));

export const startPayNow = (taskId: string) =>
  apiFetch<PayNowOrder>(`/api/tasks/${taskId}/pay-now`, { method: 'POST', body: JSON.stringify({}) });

export const confirmPayNow = (orderId: string, result: { gatewayPaymentId: string; signature: string }) =>
  apiFetch<{ status: string }>(`/api/orders/${orderId}/verify`, { method: 'POST', body: JSON.stringify(result) });

export const reportPayNowFailure = (orderId: string, reason?: string) =>
  apiFetch(`/api/orders/${orderId}/failed`, { method: 'POST', body: JSON.stringify(reason ? { reason: reason.slice(0, 300) } : {}) })
    .catch(() => null);

/** TEST ENVIRONMENTS ONLY — plays the client's part at the pretend gateway. */
export const simulatePayNow = (orderId: string, outcome: 'success' | 'failure') =>
  apiFetch<{ gatewayPaymentId?: string; signature?: string; error?: { reason: string } }>(
    `/api/orders/${orderId}/simulate`, { method: 'POST', body: JSON.stringify({ outcome }) },
  );

/** Thrown with a `code` the caller turns into the right message. */
export class PayNowError extends Error {
  code: 'CANCELLED' | 'DECLINED' | 'NETWORK';
  constructor(message: string, code: PayNowError['code']) { super(message); this.code = code; }
}

interface RazorpayResponse { razorpay_payment_id: string; razorpay_signature: string }
interface RazorpayInstance { open(): void; on(event: 'payment.failed', cb: (r: { error?: { description?: string } }) => void): void }
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;

let razorpayScript: Promise<void> | null = null;
function loadRazorpay(): Promise<void> {
  if ((window as unknown as { Razorpay?: RazorpayCtor }).Razorpay) return Promise.resolve();
  if (!razorpayScript) {
    razorpayScript = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve();
      s.onerror = () => { razorpayScript = null; reject(new PayNowError('The payment screen could not be loaded.', 'NETWORK')); };
      document.body.appendChild(s);
    });
  }
  return razorpayScript;
}

/**
 * Open Razorpay's checkout. Resolves with the signed result for confirmPayNow,
 * or rejects with CANCELLED / DECLINED. Same behaviour as the website's checkout:
 * a declined attempt keeps Razorpay's window open for another try, so a decline
 * is only remembered and the checkout ends when the client pays or closes it.
 */
export async function payWithRazorpay(order: PayNowOrder): Promise<{ gatewayPaymentId: string; signature: string }> {
  await loadRazorpay();
  const Razorpay = (window as unknown as { Razorpay: RazorpayCtor }).Razorpay;
  return new Promise((resolve, reject) => {
    let lastDecline: string | null = null;
    const rz = new Razorpay({
      key: order.checkout.keyId,
      order_id: order.checkout.gatewayOrderId,
      amount: Math.round(order.amount * 100),
      currency: order.currency || 'INR',
      name: 'Legal Terminus',
      description: order.planName,
      handler: (r: RazorpayResponse) => resolve({ gatewayPaymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
      modal: {
        ondismiss: () => reject(lastDecline
          ? new PayNowError(lastDecline, 'DECLINED')
          : new PayNowError('Payment was cancelled.', 'CANCELLED')),
      },
    });
    rz.on('payment.failed', (r) => { lastDecline = r?.error?.description || 'The payment was declined.'; });
    rz.open();
  });
}
