/**
 * One-time backfill: normalize name/phone fields across the `users` collection.
 *
 * Historically `users` docs were written with either `name`/`fullName` and
 * `phone`/`mobile` depending on the entry path. This script makes `name` and
 * `phone` canonical and mirrors the legacy aliases, matching `normalizeUserProfile`
 * in src/services/userService.js (the same logic now applied on every write).
 *
 * Usage (from backend/):
 *   node scripts/backfill-user-names.js --dry-run    # report only, no writes
 *   node scripts/backfill-user-names.js              # apply changes
 *
 * Safe to re-run (idempotent): docs already consistent are skipped.
 */
import { getDb } from '../src/config/firebase.js';
import { normalizeUserProfile } from '../src/services/userService.js';

const DRY_RUN = process.argv.includes('--dry-run');

const pick = (d) => ({ name: d.name, fullName: d.fullName, phone: d.phone, mobile: d.mobile });

const needsUpdate = (before, after) =>
  before.name !== after.name ||
  before.fullName !== after.fullName ||
  before.phone !== after.phone ||
  before.mobile !== after.mobile;

async function run() {
  const db = getDb();
  const snap = await db.collection('users').get();

  let scanned = 0, updated = 0, skipped = 0, noName = 0;
  const batchSize = 400;
  let batch = db.batch();
  let pending = 0;

  for (const doc of snap.docs) {
    scanned++;
    const data = doc.data();
    const before = pick(data);
    const norm = normalizeUserProfile(before);
    const after = pick(norm);

    if (!after.name && !after.phone) noName++;

    if (!needsUpdate(before, after)) { skipped++; continue; }

    const patch = {};
    if (after.name !== undefined && after.name !== before.name) patch.name = after.name;
    if (after.fullName !== undefined && after.fullName !== before.fullName) patch.fullName = after.fullName;
    if (after.phone !== undefined && after.phone !== before.phone) patch.phone = after.phone;
    if (after.mobile !== undefined && after.mobile !== before.mobile) patch.mobile = after.mobile;

    updated++;
    console.log(`${DRY_RUN ? '[dry]' : '[fix]'} ${doc.id}  ${JSON.stringify(before)} -> ${JSON.stringify(patch)}`);

    if (!DRY_RUN) {
      batch.set(doc.ref, patch, { merge: true });
      if (++pending >= batchSize) { await batch.commit(); batch = db.batch(); pending = 0; }
    }
  }

  if (!DRY_RUN && pending > 0) await batch.commit();

  console.log('\n──────── summary ────────');
  console.log(`scanned:        ${scanned}`);
  console.log(`updated:        ${updated}${DRY_RUN ? ' (dry-run — not written)' : ''}`);
  console.log(`already ok:     ${skipped}`);
  console.log(`no name/phone:  ${noName} (left as-is — nothing to backfill)`);
  process.exit(0);
}

run().catch((err) => { console.error('Backfill failed:', err); process.exit(1); });
