/**
 * seedServiceConfig.js
 *
 * Seeds the `serviceCategories` Firestore collection.
 * Structure:
 *   serviceCategories/{categoryId}
 *     - name        {string}  Human-readable category name
 *     - order       {number}  Display order in admin UI
 *     - services    {object}  Map of serviceKey → { key, displayName, active }
 *
 * `displayName` is user-customisable via the admin panel.
 * `key` is the internal code used in CheckoutModal / ConsultationForm source props
 * and is NEVER changed once set (it appears in payment/lead records in the DB).
 *
 * Run once (or re-run to upsert):
 *   node backend/src/scripts/seedServiceConfig.js
 */

import { getDb } from '../config/firebase.js';
import { logger } from "../config/logger.js";

const CATEGORIES = [
  {
    id: 'company-registration',
    name: 'Company Registration',
    order: 1,
    services: [
      { key: 'private-limited',        displayName: 'Private Limited Company Registration' },
      { key: 'public-limited-company', displayName: 'Public Limited Company Registration' },
      { key: 'opc-registration',       displayName: 'One Person Company (OPC) Registration' },
      { key: 'section8-company',       displayName: 'Section 8 Company Registration' },
      { key: 'society-registration',   displayName: 'Society Registration' },
      { key: 'trust-registration',     displayName: 'Trust Registration' },
      { key: 'incorporation',          displayName: 'Company Incorporation' },
    ],
  },
  {
    id: 'llp',
    name: 'LLP',
    order: 2,
    services: [
      { key: 'llp-registration',  displayName: 'LLP Registration' },
      { key: 'llr-registration',  displayName: 'LLP (Land/Property) Registration' },
    ],
  },
  {
    id: 'proprietorship',
    name: 'Proprietorship',
    order: 3,
    services: [
      { key: 'proprietorship',      displayName: 'Proprietorship Registration' },
      { key: 'udyam-registration',  displayName: 'Udyam / MSME Registration' },
    ],
  },
  {
    id: 'conversions',
    name: 'Conversions',
    order: 4,
    services: [
      { key: 'company-to-llp',              displayName: 'Convert Company to LLP' },
      { key: 'llp-to-private',              displayName: 'Convert LLP to Private Limited' },
      { key: 'private-to-llp',              displayName: 'Convert Private Limited to LLP' },
      { key: 'private-to-public',           displayName: 'Convert Private Limited to Public' },
      { key: 'public-to-private',           displayName: 'Convert Public to Private Limited' },
      { key: 'partnership-to-llp',          displayName: 'Convert Partnership to LLP' },
      { key: 'partnership-to-private',      displayName: 'Convert Partnership to Private Limited' },
      { key: 'proprietorship-to-company',   displayName: 'Convert Proprietorship to Company' },
      { key: 'proprietorship-to-opc',       displayName: 'Convert Proprietorship to OPC' },
      { key: 'proprietorship-to-plc',       displayName: 'Convert Proprietorship to Public Ltd' },
      { key: 'cic-registration',            displayName: 'Community Interest Company Registration' },
      { key: 'cio-registration',            displayName: 'Charitable Incorporated Organisation' },
      { key: 'cir-registration',            displayName: 'Company Interest Registration' },
      { key: 'bc-registration',             displayName: 'Branch / Subsidiary Company Registration' },
    ],
  },
  {
    id: 'amendments',
    name: 'Amendments',
    order: 5,
    services: [
      { key: 'add-director',            displayName: 'Add Director' },
      { key: 'director-partner',        displayName: 'Add Director / Partner' },
      { key: 'change-company-address',  displayName: 'Change Company Address' },
      { key: 'change-company-object',   displayName: 'Change Company Object' },
      { key: 'change-llp-name',         displayName: 'Change LLP Name' },
      { key: 'increase-capital',        displayName: 'Increase Share Capital' },
    ],
  },
  {
    id: 'dissolution',
    name: 'Dissolution',
    order: 6,
    services: [
      { key: 'dissolve-llp',              displayName: 'Dissolve LLP' },
      { key: 'dissolve-private-limited',  displayName: 'Dissolve Private Limited Company' },
      { key: 'windup-plc',               displayName: 'Wind Up Public Limited Company' },
    ],
  },
  {
    id: 'tax-compliance',
    name: 'Tax & Compliance',
    order: 7,
    services: [
      { key: 'gst-registration',  displayName: 'GST Registration' },
      { key: 'gst-returns',       displayName: 'GST Return Filing' },
      { key: 'epf-registration',  displayName: 'EPF / PF Registration' },
      { key: 'pf-registration',   displayName: 'Provident Fund Registration' },
      { key: 'esic-registration', displayName: 'ESIC Registration' },
      { key: 'professional-tax',  displayName: 'Professional Tax Registration' },
    ],
  },
  {
    id: 'licenses',
    name: 'Licenses',
    order: 8,
    services: [
      { key: 'food-license-fssai',  displayName: 'Food License / FSSAI Registration' },
      { key: 'trade-license',       displayName: 'Trade License' },
      { key: 'shop-establishment',  displayName: 'Shop & Establishment Registration' },
      { key: 'iec-registration',    displayName: 'Import Export Code (IEC) Registration' },
      { key: 'iso-certification',   displayName: 'ISO Certification' },
    ],
  },
  {
    id: 'trademark',
    name: 'Trademark',
    order: 9,
    services: [
      { key: 'trademark-application',        displayName: 'Trademark Application' },
      { key: 'trademark-renewal',            displayName: 'Trademark Renewal' },
      { key: 'trademark-examination-reply',  displayName: 'Trademark Examination Reply' },
      { key: 'trademark-opposition',         displayName: 'Trademark Opposition' },
      { key: 'trademark-hearing',            displayName: 'Trademark Hearing' },
    ],
  },
];

async function seed() {
  const db = getDb();
  const batch = db.batch();
  let totalServices = 0;

  for (const cat of CATEGORIES) {
    const ref = db.collection('serviceCategories').doc(cat.id);

    // Build the services map: { "private-limited": { key, displayName, active } }
    const servicesMap = {};
    for (const svc of cat.services) {
      servicesMap[svc.key] = {
        key:         svc.key,
        displayName: svc.displayName,
        active:      true,
      };
      totalServices++;
    }

    batch.set(ref, {
      id:        cat.id,
      name:      cat.name,
      order:     cat.order,
      services:  servicesMap,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  }

  await batch.commit();
  logger.info(`✅ Seeded ${CATEGORIES.length} categories with ${totalServices} services into Firestore serviceCategories.`);
}

seed().catch((err) => {
  logger.error({ err: err }, '❌ Seed failed:');
  process.exit(1);
});

