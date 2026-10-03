#!/usr/bin/env node
/**
 * E24-S01 — load the price catalogue into Firestore.
 *
 *   node src/scripts/seedPricing.js            # add what is missing; never overwrites a price
 *   node src/scripts/seedPricing.js --dry-run  # show what would change
 *   node src/scripts/seedPricing.js --force    # reset every product to the seed file
 *
 * Writes to whichever database FIRESTORE_DATABASE_ID names — the LIVE database
 * when it is unset. See docs/qa-environment.md.
 */
import { seedCatalog } from '../services/pricing.service.js';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

seedCatalog({ force: args.has('--force'), dryRun })
  .then(({ created, updated, unchanged }) => {
    console.log(`database: ${process.env.FIRESTORE_DATABASE_ID || '(default — LIVE)'}${dryRun ? '  [dry run, nothing written]' : ''}`);
    console.log(`created ${created.length}, updated ${updated.length}, unchanged ${unchanged.length}`);
    if (updated.length) console.log('updated:', updated.join(', '));
    process.exit(0);
  })
  .catch((err) => { console.error('Failed to seed pricing:', err?.message ?? err); process.exit(1); });
