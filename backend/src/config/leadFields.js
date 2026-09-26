/**
 * #196 — the Lead Dashboard's fixed option lists, matching the firm's lead
 * sheet. One definition shared by the schemas and the controller; mirrored in
 * Portal/src/lib/leadFields.ts for the form.
 */
export const LEAD_SOURCES = [
  'Google Ads Landing Page', 'Website Inquiry', 'Google Call', 'Meta Ads', 'Interakt',
  'SMA', 'MGGS', 'Cold Calling', 'Reference Others',
];

export const LEAD_SERVICES = [
  'Company Registration', 'Trademark Registration', 'GST Registration', 'Trade License',
  'FSSAI License', 'ITR Filing', 'Others',
];

export const LEAD_OUTCOMES = ['converted', 'not_converted', 'wrong_enquiry'];

/** Remarks only mean something when the lead did NOT convert. */
export const outcomeNeedsRemarks = (outcome) => outcome === 'not_converted' || outcome === 'wrong_enquiry';
