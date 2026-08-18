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
  `${name} — handled online, end to end, by Legal Terminus with transparent pricing and expert CA/CS support.${extra ? ' ' + extra : ''}`;

export const SEO_META = {
  '/': {
    title: 'Company, Trademark & GST Registration in India | Legal Terminus',
    description: DEFAULT_DESCRIPTION,
  },

  /* ── Setting up a business — profit-making ── */
  '/private-limited-company-registration-in-india': {
    title: 'Private Limited Company Registration in India | Legal Terminus',
    description: svc('Register your Private Limited Company', 'Name approval, DSC, DIN, MOA/AOA and incorporation certificate.'),
  },
  '/incorption-registration-in-india': {
    title: 'Incorporation of Wholly Owned Subsidiary in India | Legal Terminus',
    description: svc('Set up a Wholly Owned Subsidiary in India', 'Build your global presence with a fully online process.'),
  },
  '/public-limited-company-registration-in-india': {
    title: 'Public Limited Company Registration in India | Legal Terminus',
    description: svc('Register a Public Limited Company'),
  },
  '/one-person-company': {
    title: 'One Person Company (OPC) Registration | Legal Terminus',
    description: svc('Register a One Person Company'),
  },
  '/llp': {
    title: 'Limited Liability Partnership (LLP) Registration | Legal Terminus',
    description: svc('Register a Limited Liability Partnership'),
  },
  '/partnership': {
    title: 'Partnership Firm Registration | Legal Terminus',
    description: svc('Register a Partnership Firm'),
  },
  '/proprietorship': {
    title: 'Proprietorship Firm Registration | Legal Terminus',
    description: svc('Register a Proprietorship Firm'),
  },

  /* ── Setting up a business — non-profit ── */
  '/section-8': {
    title: 'Section-8 Company Registration | Legal Terminus',
    description: svc('Register a Section-8 (non-profit) Company'),
  },
  '/trust': {
    title: 'Trust Registration Online | Legal Terminus',
    description: svc('Register a Trust'),
  },
  '/society': {
    title: 'Society Registration | Legal Terminus',
    description: svc('Register a Society'),
  },

  /* ── Registrations ── */
  '/gst-registration': {
    title: 'GST Registration in India | Legal Terminus',
    description: svc('Get GST registration', 'GSTIN typically issued in days.'),
  },
  '/udyam': {
    title: 'Udyam (MSME) Registration | Legal Terminus',
    description: svc('Get Udyam / MSME registration'),
  },
  '/epf': {
    title: 'EPF Registration | Legal Terminus',
    description: svc('Get EPF registration for your establishment'),
  },
  '/esic': {
    title: 'ESIC Registration | Legal Terminus',
    description: svc('Get ESIC registration for your establishment'),
  },
  '/professional-tax': {
    title: 'Professional Tax Registration | Legal Terminus',
    description: svc('Get Professional Tax registration'),
  },
  '/shop-establishment': {
    title: 'Shop & Commercial Establishment Registration | Legal Terminus',
    description: svc('Register under the Shops & Commercial Establishments Act'),
  },
  '/olwf': {
    title: 'Odisha Labour Welfare Fund (OLWF) Registration | Legal Terminus',
    description: svc('Get Odisha Labour Welfare Fund registration'),
  },
  '/startup-india': {
    title: 'Startup India Registration | Legal Terminus',
    description: svc('Get Startup India (DPIIT) recognition'),
  },
  '/startup-odisha': {
    title: 'Startup Odisha Registration | Legal Terminus',
    description: svc('Get Startup Odisha recognition'),
  },

  /* ── Licenses & certifications ── */
  '/iec': {
    title: 'Importer Exporter Code (IEC) Registration | Legal Terminus',
    description: svc('Get your Importer Exporter Code'),
  },
  '/food-license': {
    title: 'FSSAI Food License & Registration | Legal Terminus',
    description: svc('Get your FSSAI food license'),
  },
  '/trade-license': {
    title: 'Trade License Registration | Legal Terminus',
    description: svc('Get a Trade License'),
  },
  '/labour-license': {
    title: 'Labour Licence Registration | Legal Terminus',
    description: svc('Get a Labour Licence'),
  },
  '/bar-code': {
    title: 'Bar Code Registration | Legal Terminus',
    description: svc('Register bar codes for your products'),
  },
  '/iso': {
    title: 'ISO Certification in India | Legal Terminus',
    description: svc('Get ISO certification'),
  },

  /* ── Return filing ── */
  '/gst-return-filing': {
    title: 'GST Return Filing | Legal Terminus',
    description: svc('File GST returns on time, every time'),
  },
  '/itr-business': {
    title: 'ITR Filing for Businesses | Legal Terminus',
    description: svc('File your business income-tax return'),
  },
  '/itr-individual': {
    title: 'ITR Filing for Individuals | Legal Terminus',
    description: svc('File your personal income-tax return'),
  },
  '/annual-filing-company': {
    title: 'Annual Filing for Companies | Legal Terminus',
    description: svc('Complete your company’s annual ROC filing'),
  },
  '/annual-filing-llp': {
    title: 'Annual Filing for LLPs | Legal Terminus',
    description: svc('Complete your LLP’s annual filing'),
  },
  '/epf-return': {
    title: 'EPF Return Filing | Legal Terminus',
    description: svc('File EPF returns'),
  },
  '/esi-return': {
    title: 'ESI Return Filing | Legal Terminus',
    description: svc('File ESI returns'),
  },
  '/professional-tax-return': {
    title: 'Professional Tax Return Filing | Legal Terminus',
    description: svc('File Professional Tax returns'),
  },

  /* ── Conversions ── */
  '/conversion/proprietorship-to-opc': {
    title: 'Convert Proprietorship to OPC Private Limited | Legal Terminus',
    description: svc('Convert your Proprietorship into an OPC Private Limited Company'),
  },
  '/conversion/proprietorship-to-private': {
    title: 'Convert Proprietorship to Private Limited Company | Legal Terminus',
    description: svc('Convert your Proprietorship into a Private Limited Company'),
  },
  '/conversion/partnership-to-llp': {
    title: 'Convert Partnership Firm to LLP | Legal Terminus',
    description: svc('Convert your Partnership Firm into an LLP'),
  },
  '/conversion/partnership-to-private': {
    title: 'Convert Partnership Firm to Private Limited Company | Legal Terminus',
    description: svc('Convert your Partnership Firm into a Private Limited Company'),
  },
  '/conversion/llp-to-private': {
    title: 'Convert LLP to Private Limited Company | Legal Terminus',
    description: svc('Convert your LLP into a Private Limited Company'),
  },
  '/conversion/private-to-llp': {
    title: 'Convert Private Limited Company to LLP | Legal Terminus',
    description: svc('Convert your Private Limited Company into an LLP'),
  },
  '/conversion/private-to-public': {
    title: 'Convert Private Limited to Public Limited Company | Legal Terminus',
    description: svc('Convert your Private Limited Company into a Public Limited Company'),
  },
  '/conversion/public-to-private': {
    title: 'Convert Public Limited to Private Limited Company | Legal Terminus',
    description: svc('Convert your Public Limited Company into a Private Limited Company'),
  },

  /* ── Event-based updations ── */
  '/updation/change-name-llp': {
    title: 'Change of LLP Name | Legal Terminus',
    description: svc('Change your LLP’s name'),
  },
  '/updation/change-address-company': {
    title: 'Change of Registered Office Address (Company) | Legal Terminus',
    description: svc('Change your company’s registered office address'),
  },
  '/updation/change-object-company': {
    title: 'Change in Object Clause of a Company | Legal Terminus',
    description: svc('Change your company’s object clause'),
  },
  '/updation/increase-authorised-capital': {
    title: 'Increase Authorised Share Capital | Legal Terminus',
    description: svc('Increase your company’s authorised share capital'),
  },
  '/updation/add-remove-director': {
    title: 'Add or Remove a Director | Legal Terminus',
    description: svc('Add or remove a company director'),
  },
  '/updation/change-name-company': {
    title: 'Change of Company Name | Legal Terminus',
    description: svc('Change your company’s name'),
  },
  '/updation/change-address-llp': {
    title: 'Change of Registered Office Address (LLP) | Legal Terminus',
    description: svc('Change your LLP’s registered office address'),
  },
  '/updation/change-object-llp': {
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
  '/windup/dissolve-private': {
    title: 'Winding Up a Private Limited Company | Legal Terminus',
    description: svc('Dissolve a Private Limited Company'),
  },
  '/windup/dissolve-llp': {
    title: 'Winding Up an LLP | Legal Terminus',
    description: svc('Dissolve a Limited Liability Partnership'),
  },
  '/windup/dissolve-partnership': {
    title: 'Dissolving a Partnership Firm | Legal Terminus',
    description: svc('Dissolve a Partnership Firm'),
  },
  '/windup/wind-up-plc': {
    title: 'Winding Up a Public Limited Company | Legal Terminus',
    description: svc('Wind up a Public Limited Company'),
  },

  /* ── Trademark ── */
  '/trademark/application': {
    title: 'Trademark Registration in India | Legal Terminus',
    description: svc('Register your trademark', 'Search, application and filing handled for you.'),
  },
  '/trademark/renewal': {
    title: 'Trademark Renewal in India | Legal Terminus',
    description: svc('Renew your trademark before it lapses'),
  },
  '/trademark/exam-reply': {
    title: 'Reply to Trademark Examination Report | Legal Terminus',
    description: svc('File a reply to a trademark examination report'),
  },
  '/trademark/opposition': {
    title: 'Trademark Opposition in India | Legal Terminus',
    description: svc('Oppose or defend a trademark application'),
  },
  '/trademark/hearing': {
    title: 'Trademark Hearing in India | Legal Terminus',
    description: svc('Get representation for your trademark hearing'),
  },

  /* ── Landing pages ── */
  '/company-registration-consultancy-in-odisha': {
    title: 'Company Registration Consultancy in Odisha | Legal Terminus',
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
  '/policies/privacy': { title: 'Privacy Policy | Legal Terminus', description: 'How Legal Terminus collects, uses and protects your data.' },
  '/privacy-policy': { title: 'Privacy Policy | Legal Terminus', description: 'How Legal Terminus collects, uses and protects your data.' },
  '/policies/terms': { title: 'Terms & Conditions | Legal Terminus', description: 'The terms governing use of Legal Terminus services.' },
  '/terms-conditions': { title: 'Terms & Conditions | Legal Terminus', description: 'The terms governing use of Legal Terminus services.' },
  '/policies/refund': { title: 'Refund Policy | Legal Terminus', description: 'The Legal Terminus refund policy.' },
  '/refund-policy': { title: 'Refund Policy | Legal Terminus', description: 'The Legal Terminus refund policy.' },
  '/policies/confidentiality': { title: 'Confidentiality Policy | Legal Terminus', description: 'How Legal Terminus keeps your information confidential.' },
  '/confidentiality-policy': { title: 'Confidentiality Policy | Legal Terminus', description: 'How Legal Terminus keeps your information confidential.' },

  /* ── Auth (kept out of search) ── */
  '/login': { title: 'Sign In | Legal Terminus', description: 'Sign in to your Legal Terminus account.', noindex: true },
  '/signup': { title: 'Sign Up | Legal Terminus', description: 'Create your Legal Terminus account.', noindex: true },
  '/forgot-password': { title: 'Reset Password | Legal Terminus', description: 'Reset your Legal Terminus password.', noindex: true },
  '/my-profile': { title: 'My Profile | Legal Terminus', description: 'Your Legal Terminus profile.', noindex: true },
  '/payment/result': { title: 'Payment | Legal Terminus', description: 'Payment status.', noindex: true },
};
