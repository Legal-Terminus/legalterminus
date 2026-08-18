/**
 * #175 — per-page SEO metadata for every public route.
 *
 * HEAD-ONLY data: consumed by <SeoHead /> (Components/SeoHead), which emits
 * <title>, meta description, canonical and Open Graph tags via React 19's
 * native head hoisting. Nothing here touches page content or design.
 *
 * Titles follow the page names from the SEO sheet on #175. Descriptions are
 * first-pass copy — refine freely (or via the future CMS, #176); each is a plain
 * string swap with zero code impact.
 */

export const SITE_URL = 'https://legalterminus.com';
export const DEFAULT_TITLE = 'Legal Terminus | Professional Legal Services';
export const DEFAULT_DESCRIPTION =
  'Company registration, GST, trademarks, filings and compliance — handled end-to-end online by Legal Terminus, with expert CA/CS support and transparent pricing.';

// Reads naturally after both noun phrases ("GST registration") and imperatives
// ("Renew your trademark before it lapses").
const svc = (name, extra = '') =>
  `${name} — online, end to end, with transparent pricing and expert CA/CS support.${extra ? ' ' + extra : ''}`;

export const SEO_META = {
  '/': {
    title: 'Company, Trademark & GST Registration | Legal Terminus',
    description: DEFAULT_DESCRIPTION,
  },

  /* ── Setting up a business — profit-making ── */
  '/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india': {
    title: 'Private Limited Company Registration in India | Legal Terminus',
    description: svc('Register your Private Limited Company', 'Name approval, DSC, DIN and MOA/AOA included.'),
  },
  '/setting-up-a-business/profit-making-structures/incorporation-of-wholly-owned-subsidiary-in-india': {
    title: 'Wholly Owned Subsidiary Registration | Legal Terminus',
    description: svc('Set up a Wholly Owned Subsidiary in India', 'Build your global presence.'),
  },
  '/setting-up-a-business/profit-making-structures/public-limited-company-registration-in-india': {
    title: 'Public Limited Company Registration in India | Legal Terminus',
    description: svc('Register a Public Limited Company'),
  },
  '/setting-up-a-business/profit-making-structures/one-person-company-registration-in-india': {
    title: 'One Person Company (OPC) Registration | Legal Terminus',
    description: svc('Register a One Person Company'),
  },
  '/setting-up-a-business/profit-making-structures/limited-liability-partnership-registration-in-india': {
    title: 'LLP Registration in India | Legal Terminus',
    description: svc('Register a Limited Liability Partnership'),
  },
  '/setting-up-a-business/profit-making-structures/partnership-firm-registration-in-india': {
    title: 'Partnership Firm Registration | Legal Terminus',
    description: svc('Register a Partnership Firm'),
  },
  '/setting-up-a-business/profit-making-structures/proprietorship-firm-registration-in-india': {
    title: 'Proprietorship Firm Registration | Legal Terminus',
    description: svc('Register a Proprietorship Firm'),
  },

  /* ── Setting up a business — non-profit ── */
  '/setting-up-a-business/non-profit-making-structures/non-profit-company-sec-8-company-registration-in-india': {
    title: 'Section-8 Company Registration | Legal Terminus',
    description: svc('Register a Section-8 (non-profit) Company'),
  },
  '/setting-up-a-business/non-profit-making-structures/trust-registration-in-india': {
    title: 'Trust Registration Online | Legal Terminus',
    description: svc('Register a Trust'),
  },
  '/setting-up-a-business/non-profit-making-structures/society-registration-in-india': {
    title: 'Society Registration | Legal Terminus',
    description: svc('Register a Society'),
  },

  /* ── Registrations ── */
  '/registrations-returns/registrations/gst-registration-in-india': {
    title: 'GST Registration in India | Legal Terminus',
    description: svc('Get GST registration', 'GSTIN typically issued in days.'),
  },
  '/registrations-returns/registrations/udyam-registration-in-india': {
    title: 'Udyam (MSME) Registration | Legal Terminus',
    description: svc('Get Udyam / MSME registration'),
  },
  '/registrations-returns/registrations/epf-registration-in-india': {
    title: 'EPF Registration | Legal Terminus',
    description: svc('Get EPF registration for your establishment'),
  },
  '/registrations-returns/registrations/esic-registration-in-india': {
    title: 'ESIC Registration | Legal Terminus',
    description: svc('Get ESIC registration for your establishment'),
  },
  '/registrations-returns/registrations/professional-tax-registration': {
    title: 'Professional Tax Registration | Legal Terminus',
    description: svc('Get Professional Tax registration'),
  },
  '/registrations-returns/registrations/shop-commercial-establishments-registration-in-india': {
    title: 'Shop & Establishment Registration | Legal Terminus',
    description: svc('Register under the Shops & Commercial Establishments Act'),
  },
  '/registrations-returns/license-certifications/odisha-labour-welfare-fund-olwf-registration': {
    title: 'OLWF Registration in Odisha | Legal Terminus',
    description: svc('Get Odisha Labour Welfare Fund registration'),
  },
  '/registrations-returns/registrations/startup-india-registration': {
    title: 'Startup India Registration | Legal Terminus',
    description: svc('Get Startup India (DPIIT) recognition'),
  },
  '/registrations-returns/registrations/startup-odisha-registration': {
    title: 'Startup Odisha Registration | Legal Terminus',
    description: svc('Get Startup Odisha recognition'),
  },

  /* ── Licenses & certifications ── */
  '/registrations-returns/license-certifications/importer-exporter-code-registration': {
    title: 'IEC Registration in India | Legal Terminus',
    description: svc('Get your Importer Exporter Code'),
  },
  '/registrations-returns/license-certifications/food-license-and-registration': {
    title: 'FSSAI Food License & Registration | Legal Terminus',
    description: svc('Get your FSSAI food license'),
  },
  '/registrations-returns/license-certifications/trade-license-registration': {
    title: 'Trade License Registration | Legal Terminus',
    description: svc('Get a Trade License'),
  },
  '/registrations-returns/license-certifications/labour-license-registration': {
    title: 'Labour Licence Registration | Legal Terminus',
    description: svc('Get a Labour Licence'),
  },
  '/registrations-returns/license-certifications/bar-code-registration': {
    title: 'Bar Code Registration | Legal Terminus',
    description: svc('Register bar codes for your products'),
  },
  '/registrations-returns/license-certifications/iso-certification-in-india': {
    title: 'ISO Certification in India | Legal Terminus',
    description: svc('Get ISO certification'),
  },

  /* ── Return filing ── */
  '/registrations-returns/return-filing/gst-return-filing': {
    title: 'GST Return Filing | Legal Terminus',
    description: svc('File GST returns on time, every time'),
  },
  '/registrations-returns/return-filing/itr-filing-company': {
    title: 'ITR Filing for Businesses | Legal Terminus',
    description: svc('File your business income-tax return'),
  },
  '/registrations-returns/return-filing/itr-filing-individual': {
    title: 'ITR Filing for Individuals | Legal Terminus',
    description: svc('File your personal income-tax return'),
  },
  '/registrations-returns/return-filing/annual-filing-company': {
    title: 'Annual Filing for Companies | Legal Terminus',
    description: svc('Complete your company’s annual ROC filing'),
  },
  '/registrations-returns/return-filing/annual-filing-llp': {
    title: 'Annual Filing for LLPs | Legal Terminus',
    description: svc('Complete your LLP’s annual filing'),
  },
  '/registrations-returns/return-filing/epf-return-filing': {
    title: 'EPF Return Filing | Legal Terminus',
    description: svc('File EPF returns'),
  },
  '/registrations-returns/return-filing/esi-return-filing': {
    title: 'ESI Return Filing | Legal Terminus',
    description: svc('File ESI returns'),
  },
  '/registrations-returns/return-filing/professional-tax-return-filing': {
    title: 'Professional Tax Return Filing | Legal Terminus',
    description: svc('File Professional Tax returns'),
  },

  /* ── Conversions ── */
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-opc-private-limited-company': {
    title: 'Convert Proprietorship to OPC Private Limited | Legal Terminus',
    description: svc('Convert your Proprietorship into an OPC Private Limited Company'),
  },
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-private-limited-company': {
    title: 'Proprietorship to Private Limited | Legal Terminus',
    description: svc('Convert your Proprietorship into a Private Limited Company'),
  },
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-partnership-into-limited-liability-partnership': {
    title: 'Convert Partnership Firm to LLP | Legal Terminus',
    description: svc('Convert your Partnership Firm into an LLP'),
  },
  '/event-based-compliances/conversion-in-form-of-business/partnership-firm-to-private-limited-company': {
    title: 'Partnership to Private Limited | Legal Terminus',
    description: svc('Convert your Partnership Firm into a Private Limited Company'),
  },
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-llp-into-private-limited-company': {
    title: 'Convert LLP to Private Limited Company | Legal Terminus',
    description: svc('Convert your LLP into a Private Limited Company'),
  },
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-into-llp': {
    title: 'Private Limited Company to LLP | Legal Terminus',
    description: svc('Convert your Private Limited Company into an LLP'),
  },
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-to-public-limited-company': {
    title: 'Private Limited to Public Limited | Legal Terminus',
    description: svc('Convert your Private Limited Company into a Public Limited Company'),
  },
  '/event-based-compliances/conversion-in-form-of-business/conversion-of-public-limited-company-to-private-limited-company': {
    title: 'Public Limited to Private Limited | Legal Terminus',
    description: svc('Convert your Public Limited Company into a Private Limited Company'),
  },

  /* ── Event-based updations ── */
  '/event-based-compliances/name-change-process-in-india-for-llp': {
    title: 'Change of LLP Name | Legal Terminus',
    description: svc('Change your LLP’s name'),
  },
  '/event-based-compliances/change-in-registered-office-address': {
    title: 'Change Registered Office Address | Legal Terminus',
    description: svc('Change your company’s registered office address'),
  },
  '/event-based-compliances/change-in-object-clause-of-a-company': {
    title: 'Change in Object Clause of a Company | Legal Terminus',
    description: svc('Change your company’s object clause'),
  },
  '/event-based-compliances/increase-authorized-share-capital-company': {
    title: 'Increase Authorised Share Capital | Legal Terminus',
    description: svc('Increase your company’s authorised share capital'),
  },
  '/event-based-compliances/add-or-remove-a-director-company': {
    title: 'Add or Remove a Director | Legal Terminus',
    description: svc('Add or remove a company director'),
  },
  '/event-based-compliances/change-company-name': {
    title: 'Change of Company Name | Legal Terminus',
    description: svc('Change your company’s name'),
  },
  '/event-based-compliances/change-in-registered-office-address-for-llp': {
    title: 'Change of Registered Office Address (LLP) | Legal Terminus',
    description: svc('Change your LLP’s registered office address'),
  },
  '/event-based-compliances/changing-the-objects-of-llp': {
    title: 'Change in Objects of an LLP | Legal Terminus',
    description: svc('Change your LLP’s objects'),
  },
  '/updation/change-name-company-to-company': {
    title: 'Change of Company Name | Legal Terminus',
    description: svc('Change your company’s name'),
  },
  '/updation/change-name-llp-to-llp': {
    title: 'Change of LLP Name | Legal Terminus',
    description: svc('Change your LLP’s name'),
  },

  /* ── Wind-up ── */
  '/event-based-compliances/windup-services/process-of-winding-up-of-a-company': {
    title: 'Winding Up a Private Limited Company | Legal Terminus',
    description: svc('Dissolve a Private Limited Company'),
  },
  '/event-based-compliances/windup-services/process-of-winding-up-limited-liability-partnership': {
    title: 'Winding Up an LLP | Legal Terminus',
    description: svc('Dissolve a Limited Liability Partnership'),
  },
  '/event-based-compliances/windup-services/dissolution-of-partnership-firm': {
    title: 'Dissolving a Partnership Firm | Legal Terminus',
    description: svc('Dissolve a Partnership Firm'),
  },
  '/windup/wind-up-plc': {
    title: 'Winding Up a Public Limited Company | Legal Terminus',
    description: svc('Wind up a Public Limited Company'),
  },

  /* ── Trademark ── */
  '/trademark/registration-and-compliance-services/trademark-registration-in-india': {
    title: 'Trademark Registration in India | Legal Terminus',
    description: svc('Register your trademark', 'Search, application and filing handled for you.'),
  },
  '/trademark/registration-and-compliance-services/trademark-renewal-in-india': {
    title: 'Trademark Renewal in India | Legal Terminus',
    description: svc('Renew your trademark before it lapses'),
  },
  '/trademark/registration-and-compliance-services/reply-to-examination-report-trademark': {
    title: 'Reply to Trademark Examination Report | Legal Terminus',
    description: svc('File a reply to a trademark examination report'),
  },
  '/trademark/registration-and-compliance-services/trademark-opposition-in-india': {
    title: 'Trademark Opposition in India | Legal Terminus',
    description: svc('Oppose or defend a trademark application'),
  },
  '/trademark/registration-and-compliance-services/trademark-hearing-in-india': {
    title: 'Trademark Hearing in India | Legal Terminus',
    description: svc('Get representation for your trademark hearing'),
  },

  /* ── Landing pages ── */
  '/company-registration-consultancy-in-odisha': {
    title: 'Company Registration in Odisha | Legal Terminus',
    description: svc('Register your company in Odisha', 'Local expertise, fully online.'),
  },
  '/trademark-registration-in-odisha': {
    title: 'Trademark Registration in Odisha | Legal Terminus',
    description: svc('Register your trademark in Odisha'),
  },
  '/company-registration-odisha': {
    title: 'Company Registration in Odisha | Legal Terminus',
    description: svc('Register your company in Odisha'),
  },
  '/companyregistration-in-odisha': {
    title: 'Company Registration in Odisha | Legal Terminus',
    description: svc('Register your company in Odisha'),
  },

  /* ── Content & company ── */
  '/blog': {
    title: 'Blog | Legal Terminus',
    description: 'Guides and updates on company law, GST, trademarks and compliance in India from the Legal Terminus team.',
  },
  '/media': {
    title: 'Media | Legal Terminus',
    description: 'Legal Terminus in the news and media.',
  },
  '/about': {
    title: 'About Us | Legal Terminus',
    description: 'Who we are: the team, experience and values behind Legal Terminus.',
  },
  '/contact/us': {
    title: 'Contact Us | Legal Terminus',
    description: 'Talk to Legal Terminus about company registration, GST, trademarks and compliance.',
  },
  '/pdf-tools': {
    title: 'Free PDF Tools | Legal Terminus',
    description: 'Free online PDF utilities from Legal Terminus.',
  },

  /* ── Policies ── */
  '/policies/privacy': { title: 'Privacy Policy | Legal Terminus', description: 'How Legal Terminus collects, uses and protects your data.', canonicalPath: '/privacy-policy' },
  '/privacy-policy': { title: 'Privacy Policy | Legal Terminus', description: 'How Legal Terminus collects, uses and protects your data.' },
  '/policies/terms': { title: 'Terms & Conditions | Legal Terminus', description: 'The terms governing use of Legal Terminus services.', canonicalPath: '/terms-conditions' },
  '/terms-conditions': { title: 'Terms & Conditions | Legal Terminus', description: 'The terms governing use of Legal Terminus services.' },
  '/policies/refund': { title: 'Refund Policy | Legal Terminus', description: 'The Legal Terminus refund policy.', canonicalPath: '/refund-policy' },
  '/refund-policy': { title: 'Refund Policy | Legal Terminus', description: 'The Legal Terminus refund policy.' },
  '/policies/confidentiality': { title: 'Confidentiality Policy | Legal Terminus', description: 'How Legal Terminus keeps your information confidential.', canonicalPath: '/confidentiality-policy' },
  '/confidentiality-policy': { title: 'Confidentiality Policy | Legal Terminus', description: 'How Legal Terminus keeps your information confidential.' },

  /* ── Auth (kept out of search) ── */
  '/login': { title: 'Sign In | Legal Terminus', description: 'Sign in to your Legal Terminus account.', noindex: true },
  '/signup': { title: 'Sign Up | Legal Terminus', description: 'Create your Legal Terminus account.', noindex: true },
  '/forgot-password': { title: 'Reset Password | Legal Terminus', description: 'Reset your Legal Terminus password.', noindex: true },
  '/my-profile': { title: 'My Profile | Legal Terminus', description: 'Your Legal Terminus profile.', noindex: true },
  '/payment/result': { title: 'Payment | Legal Terminus', description: 'Payment status.', noindex: true },
};
