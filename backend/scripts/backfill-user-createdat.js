/**
 * One-time backfill: ensure every `users` doc has a `createdAt` field.
 *
 * Legacy/Google-created user docs were written without `createdAt`. The Users
 * listing (`listUsers`) used to order by `createdAt`, and Firestore's orderBy
 * SILENTLY DROPS docs that lack the ordered field — so those users never showed
 * up in the portal ("0 of N" with role-tab counts that didn't sum). The list
 * query has since been made tolerant (orders by document id), but we still
 * backfill `createdAt` so ordering is meaningful and legacy docs sort sensibly.
 *
 * Value precedence for a missing `createdAt`:
 *   1. the Firebase Auth user's creationTime (most accurate), else
 *   2. the doc's existing `updatedAt`, else
 *   3. now (ISO string) as a last resort.
 *
 * Usage (from backend/):
 *   node scripts/backfill-user-createdat.js --dry-run    # report only, no writes
 *   node scripts/backfill-user-createdat.js              # apply changes
 *
 * Safe to re-run (idempotent): docs that already have createdAt are skipped.
 */
import { getDb, getAuth } from '../src/config/firebase.js';

const DRY_RUN = process.argv.includes('--dry-run');

async function resolveCreatedAt(uid, data) {
  // 1. Firebase Auth creation time
  try {
    const userRecord = await getAuth().getUser(uid);
    const ct = userRecord?.metadata?.creationTime;
    if (ct) return { value: new Date(ct).toISOString(), source: 'auth.creationTime' };
  } catch {
    // user may not exist in Auth (e.g. seed/imported doc) — fall through
  }
  // 2. existing updatedAt on the doc
  if (data.updatedAt) return { value: data.updatedAt, source: 'doc.updatedAt' };
  // 3. now
  return { value: new Date().toISOString(), source: 'now' };
}

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

    if (data.createdAt) { skipped++; continue; }

    const { value, source } = await resolveCreatedAt(doc.id, data);
    updated++;
    console.log(`${DRY_RUN ? '[dry]' : '[fix]'} ${doc.id}  createdAt <- ${value}  (${source})`);

    if (!DRY_RUN) {
      batch.set(doc.ref, { createdAt: value }, { merge: true });
      if (++pending >= batchSize) { await batch.commit(); batch = db.batch(); pending = 0; }
    }
  }

  if (!DRY_RUN && pending > 0) await batch.commit();

  console.log('\n──────── summary ────────');
  console.log(`scanned:        ${scanned}`);
  console.log(`updated:        ${updated}${DRY_RUN ? ' (dry-run — not written)' : ''}`);
  console.log(`already ok:     ${skipped}`);
  process.exit(0);
}

run().catch((err) => { console.error('Backfill failed:', err); process.exit(1); });
