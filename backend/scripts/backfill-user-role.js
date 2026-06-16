/**
 * One-time backfill: ensure every `users` doc has a valid `role`.
 *
 * Legacy docs written by the old frontend client-SDK path (signup/login/checkout)
 * never set a `role` field. Those users are invisible to the role-tab counts and
 * caused the portal Users page to misbehave ("0 of N", tabs not summing). Every
 * self-signup is a client, so a missing/invalid role is backfilled to 'client'
 * — the same default the unified `upsertUser` / `POST /api/auth/register` path
 * now applies on every write.
 *
 * Usage (from backend/):
 *   node scripts/backfill-user-role.js --dry-run    # report only, no writes
 *   node scripts/backfill-user-role.js              # apply changes
 *
 * Safe to re-run (idempotent): docs with a valid role are skipped.
 */
import { getDb } from '../src/config/firebase.js';
import { VALID_ROLES } from '../src/config/roles.js';

const DRY_RUN = process.argv.includes('--dry-run');
const DEFAULT_ROLE = 'client';

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
    const role = data.role;

    if (role && VALID_ROLES.includes(role)) { skipped++; continue; }

    updated++;
    console.log(`${DRY_RUN ? '[dry]' : '[fix]'} ${doc.id}  role ${JSON.stringify(role)} -> '${DEFAULT_ROLE}'  (${data.name || data.fullName || data.email || '—'})`);

    if (!DRY_RUN) {
      batch.set(doc.ref, { role: DEFAULT_ROLE, updatedAt: new Date().toISOString() }, { merge: true });
      if (++pending >= batchSize) { await batch.commit(); batch = db.batch(); pending = 0; }
    }
  }

  if (!DRY_RUN && pending > 0) await batch.commit();

  console.log('\n──────── summary ────────');
  console.log(`scanned:        ${scanned}`);
  console.log(`updated:        ${updated}${DRY_RUN ? ' (dry-run — not written)' : ''} -> role '${DEFAULT_ROLE}'`);
  console.log(`already ok:     ${skipped}`);
  process.exit(0);
}

run().catch((err) => { console.error('Backfill failed:', err); process.exit(1); });
