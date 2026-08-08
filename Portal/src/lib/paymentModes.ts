/**
 * Payment modes offered wherever a payment is recorded (#78, #145).
 *
 * Single source of truth: the Payments tab editor (`TaskDetailPage`) and the
 * Create Matter form (`CreateMatterModal`) both render this list, so a mode
 * added here appears in both without drifting. Free text is still accepted by
 * the API — legacy matters may carry a value outside this list, so render sites
 * fall back to 'Other' rather than dropping an unrecognised mode.
 */
export const PAYMENT_MODES = [
  'UPI',
  'Bank Transfer',
  'Cash',
  'Credit Card',
  'Debit Card',
  'Cheque',
  'Other',
] as const;

export type PaymentModeOption = (typeof PAYMENT_MODES)[number];
