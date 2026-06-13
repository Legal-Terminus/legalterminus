/**
 * One-time backfill: remove the dead `type` field from every `users` doc.
 *
 * `type` was a legacy mirror of `role`. The unified user-management code made
 * `role` the single source of truth — no current code path reads or writes
 * `type` anymore (verified across backend + both frontends). It only lingers as
 * stale data in old docs, where it drifts from `role` and misleads anyone editing
 * the DB by hand (e.g. setting `type: 'admin'` while `role` stays 'manager').
 * This deletes the field so `role` is the only role field.
 *
 * Usage (from backend/):
 *   node scripts/backfill-remove-user-type.js --dry-run    # report only, no writes
 *   node scripts/backfill-remove-user-type.js              # apply deletions
 *
 * Safe to re-run (idempotent): docs without `type` are skipped.
 */
import admin from 'firebase-admin';
import { getDb } from '../src/config/firebase.js';

const DRY_RUN = process.argv.includes('--dry-run');

async function run() {
  const db = getDb();
  const snap = await db.collection('users').get();

  let scanned = 0, updated = 0, skipped = 0;
  const batchSize = 400;
  let batch = db.batch();
  let pending = 0;

  for (const doc of snap.docs) {
    scanned++;
    const data = doc.data();

    if (!('type' in data)) { skipped++; continue; }

    updated++;
    console.log(`${DRY_RUN ? '[dry]' : '[fix]'} ${doc.id}  delete type=${JSON.stringify(data.type)}  (role=${JSON.stringify(data.role)})`);

    if (!DRY_RUN) {
      batch.update(doc.ref, { type: admin.firestore.FieldValue.delete() });
      if (++pending >= batchSize) { await batch.commit(); batch = db.batch(); pending = 0; }
    }
  }

  if (!DRY_RUN && pending > 0) await batch.commit();

  console.log('\n──────── summary ────────');
  console.log(`scanned:        ${scanned}`);
  console.log(`updated:        ${updated}${DRY_RUN ? ' (dry-run — not written)' : ''} (type removed)`);
  console.log(`already clean:  ${skipped}`);
  process.exit(0);
}

run().catch((err) => { console.error('Backfill failed:', err); process.exit(1); });
