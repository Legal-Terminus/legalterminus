/**
 * LT #296 / #293 — matter events that carry PAYMENT FIGURES (amounts paid,
 * remaining, refunded, requested). One list for the Portal and the API.
 *
 * They are written onto the matter's CURRENT step, so without this rule they
 * surfaced in the Steps tab as that step's "From the previous step" note —
 * "Payment received: ₹1000 via UPI. ₹0 remaining of ₹2000." — including to
 * team members, who must never see a matter's figures (#148).
 *
 *  - The Steps tab never shows them as a step's note, for anyone (#296).
 *  - The API drops them from the activity feed for every role that may not see
 *    payments (team members and professionals); clients never received them.
 *    Admins and managers keep them in the activity history.
 *
 * Workflow transitions that merely PASS a payment gate (`RECORD_PAYMENT`,
 * `ADMIN_OVERRIDE_PAYMENT`) are step events, not ledger entries, and are not
 * listed here.
 */
export const PAYMENT_LEDGER_EVENT_TYPES = Object.freeze([
  'PAYMENT_RECORDED',
  'PAYMENT_UPDATED',
  'PAYMENT_DELETED',
  'PAYMENT_REQUESTED',
  'PAYMENT_REQUEST_CANCELLED',
  'REFUND_RECORDED',
  'REFUND_UPDATED',
]);

/** True for an event type that carries payment figures. */
export const isPaymentLedgerEvent = (type) => PAYMENT_LEDGER_EVENT_TYPES.includes(type);
