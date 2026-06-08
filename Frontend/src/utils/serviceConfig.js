/**
 * serviceConfig.js
 *
 * Canonical source-key → displayName/category map used across:
 *   - ConsultationForm (breadcrumb components)
 *   - CheckoutModal (pricing plan components)
 *
 * The authoritative copy lives in Firestore (`serviceCategories` collection)
 * structured as category-as-parent:
 *
 *   serviceCategories/{categoryId}
 *     - name: "Company Registration"
 *     - order: 1
 *     - services: {
 *         "private-limited": { key, displayName, active }
 *       }
 *
 * `displayName` is editable by the user/admin in Firestore without a deploy.
 * `key` is the internal code hardcoded in components — never changes.
 *
 * Usage:
 *   import { getServiceDisplayName, fetchServiceConfig } from '../../utils/serviceConfig';
 *
 *   // Sync lookup (from local fallback)
 *   const label = getServiceDisplayName('gst-registration');
 *   // → "GST Registration"
 *
 *   // Async lookup (from Firestore via API)
 *   const config = await fetchServiceConfig();
 *   const label  = config['gst-registration']?.displayName;
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

/**
 * Local fallback — mirrors seedServiceConfig.js.
 * Used when API is unavailable or before the first fetch resolves.
 */
export const SERVICE_CONFIG = {
  // Company Registration
  'private-limited':            { displayName: 'Private Limited Company Registration',    category: 'Company Registration' },
  'public-limited-company':     { displayName: 'Public Limited Company Registration',     category: 'Company Registration' },
  'opc-registration':           { displayName: 'One Person Company (OPC) Registration',   category: 'Company Registration' },
  'section8-company':           { displayName: 'Section 8 Company Registration',          category: 'Company Registration' },
  'society-registration':       { displayName: 'Society Registration',                    category: 'Company Registration' },
  'trust-registration':         { displayName: 'Trust Registration',                      category: 'Company Registration' },
  'incorporation':              { displayName: 'Company Incorporation',                   category: 'Company Registration' },

  // LLP
  'llp-registration':           { displayName: 'LLP Registration',                        category: 'LLP' },
  'llr-registration':           { displayName: 'LLP (Land/Property) Registration',        category: 'LLP' },

  // Startup
  'startup-india':              { displayName: 'Startup India (DPIIT) Registration',       category: 'Startup' },
  'startup-odisha':             { displayName: 'Startup Odisha Registration',              category: 'Startup' },

  // Proprietorship
  'proprietorship':             { displayName: 'Proprietorship Registration',             category: 'Proprietorship' },
  'udyam-registration':         { displayName: 'Udyam / MSME Registration',               category: 'Proprietorship' },

  // Conversions
  'company-to-llp':             { displayName: 'Convert Company to LLP',                  category: 'Conversions' },
  'llp-to-private':             { displayName: 'Convert LLP to Private Limited',          category: 'Conversions' },
  'private-to-llp':             { displayName: 'Convert Private Limited to LLP',          category: 'Conversions' },
  'private-to-public':          { displayName: 'Convert Private Limited to Public',       category: 'Conversions' },
  'public-to-private':          { displayName: 'Convert Public to Private Limited',       category: 'Conversions' },
  'partnership-to-llp':         { displayName: 'Convert Partnership to LLP',              category: 'Conversions' },
  'partnership-to-private':     { displayName: 'Convert Partnership to Private Limited',  category: 'Conversions' },
  'proprietorship-to-company':  { displayName: 'Convert Proprietorship to Company',       category: 'Conversions' },
  'proprietorship-to-opc':      { displayName: 'Convert Proprietorship to OPC',           category: 'Conversions' },
  'proprietorship-to-plc':      { displayName: 'Convert Proprietorship to Public Ltd',    category: 'Conversions' },
  'cic-registration':           { displayName: 'Community Interest Company Registration', category: 'Conversions' },
  'cio-registration':           { displayName: 'Charitable Incorporated Organisation',    category: 'Conversions' },
  'cir-registration':           { displayName: 'Company Interest Registration',           category: 'Conversions' },
  'bc-registration':            { displayName: 'Branch / Subsidiary Company Registration',category: 'Conversions' },

  // Amendments
  'add-director':               { displayName: 'Add Director',                            category: 'Amendments' },
  'director-partner':           { displayName: 'Add Director / Partner',                  category: 'Amendments' },
  'change-company-address':     { displayName: 'Change Company Address',                  category: 'Amendments' },
  'change-company-object':      { displayName: 'Change Company Object',                   category: 'Amendments' },
  'change-llp-name':            { displayName: 'Change LLP Name',                         category: 'Amendments' },
  'increase-capital':           { displayName: 'Increase Share Capital',                  category: 'Amendments' },

  // Dissolution
  'dissolve-llp':               { displayName: 'Dissolve LLP',                            category: 'Dissolution' },
  'dissolve-private-limited':   { displayName: 'Dissolve Private Limited Company',        category: 'Dissolution' },
  'windup-plc':                 { displayName: 'Wind Up Public Limited Company',          category: 'Dissolution' },

  // Tax & Compliance
  'gst-registration':           { displayName: 'GST Registration',                        category: 'Tax & Compliance' },
  'gst-returns':                { displayName: 'GST Return Filing',                       category: 'Tax & Compliance' },
  'epf-registration':           { displayName: 'EPF / PF Registration',                   category: 'Tax & Compliance' },
  'pf-registration':            { displayName: 'Provident Fund Registration',             category: 'Tax & Compliance' },
  'esic-registration':          { displayName: 'ESIC Registration',                       category: 'Tax & Compliance' },
  'professional-tax':           { displayName: 'Professional Tax Registration',           category: 'Tax & Compliance' },

  // Licenses
  'food-license-fssai':         { displayName: 'Food License / FSSAI Registration',       category: 'Licenses' },
  'trade-license':              { displayName: 'Trade License',                           category: 'Licenses' },
  'shop-establishment':         { displayName: 'Shop & Establishment Registration',       category: 'Licenses' },
  'iec-registration':           { displayName: 'Import Export Code (IEC)',                category: 'Licenses' },
  'iso-certification':          { displayName: 'ISO Certification',                       category: 'Licenses' },

  // Trademark
  'trademark-application':          { displayName: 'Trademark Application',              category: 'Trademark' },
  'trademark-renewal':              { displayName: 'Trademark Renewal',                  category: 'Trademark' },
  'trademark-examination-reply':    { displayName: 'Trademark Examination Reply',        category: 'Trademark' },
  'trademark-opposition':           { displayName: 'Trademark Opposition',               category: 'Trademark' },
  'trademark-hearing':              { displayName: 'Trademark Hearing',                  category: 'Trademark' },
};

/**
 * Returns the user-customisable display name for a source key.
 * Falls back to a capitalised form of the key if not found.
 */
export function getServiceDisplayName(key) {
  return SERVICE_CONFIG[key]?.displayName ?? key;
}

/**
 * Returns the category name for a source key.
 */
export function getServiceCategory(key) {
  return SERVICE_CONFIG[key]?.category ?? 'Other';
}

/**
 * Fetches the live service config from Firestore (via backend API).
 * Returns a flat map of { key: { key, displayName, category, categoryId } }.
 * Falls back to the local SERVICE_CONFIG on error.
 */
export async function fetchServiceConfig() {
  try {
    const res = await fetch(`${API_BASE}/api/service-config`);
    if (!res.ok) throw new Error('Non-OK response');
    const { services } = await res.json();
    return services;
  } catch {
    return SERVICE_CONFIG;
  }
}
