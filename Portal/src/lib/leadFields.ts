/**
 * #196 — the Lead Dashboard's option lists. Mirrors backend/src/config/leadFields.js;
 * the server validates against its copy, so a stale list here can only ever
 * offer less, never store something the server rejects.
 */
export const LEAD_SOURCES = [
  'Google Ads Landing Page', 'Website Inquiry', 'Google Call', 'Meta Ads', 'Interakt',
  'SMA', 'MGGS', 'Cold Calling', 'Reference Others',
] as const;

export const LEAD_SERVICES = [
  'Company Registration', 'Trademark Registration', 'GST Registration', 'Trade License',
  'FSSAI License', 'ITR Filing', 'Others',
] as const;

export type LeadOutcome = '' | 'converted' | 'not_converted' | 'wrong_enquiry';

export const LEAD_OUTCOMES: { value: Exclude<LeadOutcome, ''>; label: string; badge: string }[] = [
  { value: 'converted', label: 'Converted', badge: 'badge-green' },
  { value: 'not_converted', label: 'Not Converted', badge: 'badge-gray' },
  { value: 'wrong_enquiry', label: 'Wrong Enquiry', badge: 'badge-gray' },
];

export const outcomeLabel = (o: string) => LEAD_OUTCOMES.find((x) => x.value === o)?.label ?? '';
export const outcomeNeedsRemarks = (o: string) => o === 'not_converted' || o === 'wrong_enquiry';
