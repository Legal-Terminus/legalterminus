/**
 * #175 — SEO URL migration map: short React route -> canonical WordPress URL.
 *
 * WHY: the WordPress URLs are what currently RANK on Google, and they carry the
 * keywords ("/setting-up-a-business/non-profit-making-structures/society-
 * registration-in-india" vs "/society"). A 301 passes most authority but not
 * all, so the safest way to preserve rankings is to ADOPT the URLs rather than
 * redirect away from them.
 *
 * This file is the single source of truth for that rename. It drives:
 *   - the route paths in App.jsx
 *   - the keys in data/seoMeta.js
 *   - the prerender route list and sitemap.xml
 *   - the legacy 301s in firebase.json (old short URL -> new canonical URL), so
 *     any link, bookmark or QA doc using a short path still works.
 *
 * KEEP IT: if a route is ever renamed again, add it here rather than editing
 * paths ad hoc, so the legacy redirects stay generated and nothing 404s.
 *
 * Two deliberate exceptions:
 *   - /conversion/private-to-public adopts the CORRECTED spelling; WordPress has
 *     a truncated slug ("...public-limited-compan") which is still redirected in.
 *   - /trademark-registration-in-odisha is NOT renamed: the only deep WP URL is a
 *     Bhubaneswar page, which is a different city and a different page.
 */
export const URL_MAP = {
  '/annual-filing-company': '/registrations-returns/return-filing/annual-filing-company',
  '/annual-filing-llp': '/registrations-returns/return-filing/annual-filing-llp',
  '/bar-code': '/registrations-returns/license-certifications/bar-code-registration',
  '/conversion/llp-to-private': '/event-based-compliances/conversion-in-form-of-business/conversion-of-llp-into-private-limited-company',
  '/conversion/partnership-to-llp': '/event-based-compliances/conversion-in-form-of-business/conversion-of-partnership-into-limited-liability-partnership',
  '/conversion/partnership-to-private': '/event-based-compliances/conversion-in-form-of-business/partnership-firm-to-private-limited-company',
  '/conversion/private-to-llp': '/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-into-llp',
  '/conversion/private-to-public': '/event-based-compliances/conversion-in-form-of-business/conversion-of-private-limited-company-to-public-limited-company',
  '/conversion/proprietorship-to-opc': '/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-opc-private-limited-company',
  '/conversion/proprietorship-to-private': '/event-based-compliances/conversion-in-form-of-business/conversion-of-proprietorship-into-private-limited-company',
  '/conversion/public-to-private': '/event-based-compliances/conversion-in-form-of-business/conversion-of-public-limited-company-to-private-limited-company',
  '/epf': '/registrations-returns/registrations/epf-registration-in-india',
  '/epf-return': '/registrations-returns/return-filing/epf-return-filing',
  '/esi-return': '/registrations-returns/return-filing/esi-return-filing',
  '/esic': '/registrations-returns/registrations/esic-registration-in-india',
  '/food-license': '/registrations-returns/license-certifications/food-license-and-registration',
  '/gst-registration': '/registrations-returns/registrations/gst-registration-in-india',
  '/gst-return-filing': '/registrations-returns/return-filing/gst-return-filing',
  '/iec': '/registrations-returns/license-certifications/importer-exporter-code-registration',
  '/incorption-registration-in-india': '/setting-up-a-business/profit-making-structures/incorporation-of-wholly-owned-subsidiary-in-india',
  '/iso': '/registrations-returns/license-certifications/iso-certification-in-india',
  '/itr-business': '/registrations-returns/return-filing/itr-filing-company',
  '/itr-individual': '/registrations-returns/return-filing/itr-filing-individual',
  '/labour-license': '/registrations-returns/license-certifications/labour-license-registration',
  '/llp': '/setting-up-a-business/profit-making-structures/limited-liability-partnership-registration-in-india',
  '/olwf': '/registrations-returns/license-certifications/odisha-labour-welfare-fund-olwf-registration',
  '/one-person-company': '/setting-up-a-business/profit-making-structures/one-person-company-registration-in-india',
  '/partnership': '/setting-up-a-business/profit-making-structures/partnership-firm-registration-in-india',
  '/private-limited-company-registration-in-india': '/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india',
  '/professional-tax': '/registrations-returns/registrations/professional-tax-registration',
  '/professional-tax-return': '/registrations-returns/return-filing/professional-tax-return-filing',
  '/proprietorship': '/setting-up-a-business/profit-making-structures/proprietorship-firm-registration-in-india',
  '/public-limited-company-registration-in-india': '/setting-up-a-business/profit-making-structures/public-limited-company-registration-in-india',
  '/section-8': '/setting-up-a-business/non-profit-making-structures/non-profit-company-sec-8-company-registration-in-india',
  '/shop-establishment': '/registrations-returns/registrations/shop-commercial-establishments-registration-in-india',
  '/society': '/setting-up-a-business/non-profit-making-structures/society-registration-in-india',
  '/startup-india': '/registrations-returns/registrations/startup-india-registration',
  '/startup-odisha': '/registrations-returns/registrations/startup-odisha-registration',
  '/trade-license': '/registrations-returns/license-certifications/trade-license-registration',
  '/trademark/application': '/trademark/registration-and-compliance-services/trademark-registration-in-india',
  '/trademark/exam-reply': '/trademark/registration-and-compliance-services/reply-to-examination-report-trademark',
  '/trademark/hearing': '/trademark/registration-and-compliance-services/trademark-hearing-in-india',
  '/trademark/opposition': '/trademark/registration-and-compliance-services/trademark-opposition-in-india',
  '/trademark/renewal': '/trademark/registration-and-compliance-services/trademark-renewal-in-india',
  '/trust': '/setting-up-a-business/non-profit-making-structures/trust-registration-in-india',
  '/udyam': '/registrations-returns/registrations/udyam-registration-in-india',
  '/updation/add-remove-director': '/event-based-compliances/add-or-remove-a-director-company',
  '/updation/change-address-company': '/event-based-compliances/change-in-registered-office-address',
  '/updation/change-address-llp': '/event-based-compliances/change-in-registered-office-address-for-llp',
  '/updation/change-name-company': '/event-based-compliances/change-company-name',
  '/updation/change-name-llp': '/event-based-compliances/name-change-process-in-india-for-llp',
  '/updation/change-object-company': '/event-based-compliances/change-in-object-clause-of-a-company',
  '/updation/change-object-llp': '/event-based-compliances/changing-the-objects-of-llp',
  '/updation/increase-authorised-capital': '/event-based-compliances/increase-authorized-share-capital-company',
  '/windup/dissolve-llp': '/event-based-compliances/windup-services/process-of-winding-up-limited-liability-partnership',
  '/windup/dissolve-partnership': '/event-based-compliances/windup-services/dissolution-of-partnership-firm',
  '/windup/dissolve-private': '/event-based-compliances/windup-services/process-of-winding-up-of-a-company',
};

/** Reverse lookup: canonical URL -> the old short path (for legacy redirects). */
export const LEGACY_OF = Object.fromEntries(
  Object.entries(URL_MAP).map(([oldPath, newPath]) => [newPath, oldPath]),
);
