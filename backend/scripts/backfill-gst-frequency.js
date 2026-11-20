/**
 * Optional one-off for #219 (firm, 16 Nov) — freeze the frequency of GST return
 * matters opened by hand BEFORE the fix.
 *
 * Background. A matter created with "Repeats: Quarterly" showed as monthly: the
 * frequency rule never read `recurrence`. The rule now does, and new GST return
 * matters store the frequency they were created with (`gstFrequency`). Existing
 * matters need NOTHING to show correctly today — the frequency is computed on
 * read, and their `recurrence` still says Quarterly — and their sheet rows move
 * to Quarterly on the next sheet sync (the sync's rules version moved on).
 *
 * What it guards against. An older matter has no `gstFrequency`, so its period
 * would flip back to a month if, later, its "Repeats" is changed or its one-year
 * series ends (both clear `recurrence`), or the client's GST setting changes.
 * This script stamps `gstFrequency` with what the matter shows NOW. It does not
 * touch `updatedAt` or anything else.
 *
 * Caveat. A matter whose series has ALREADY ended, or whose "Repeats" was already
 * cleared, no longer says it was quarterly; it is stamped as what it shows now
 * (the client's setting). The report lists every matter with its frequency and
 * why, so those can be checked by hand.
 *
 * Usage (from backend/), report first, then apply:
 *   FIRESTORE_DATABASE_ID=qa-data node scripts/backfill-gst-frequency.js           # report only
 *   FIRESTORE_DATABASE_ID=qa-data node scripts/backfill-gst-frequency.js --write   # apply
 * The database must be named: with no FIRESTORE_DATABASE_ID it refuses to run,
 * unless `--default-database` is passed on purpose.
 *
 * Idempotent: a matter that already has `gstFrequency` (or a sweep period) is skipped.
 */
import { getDb } from '../src/config/firebase.js';
import { gstReturnServiceKeys, gstFrequencyOf } from '../src/services/gstMatterTags.service.js';
import { frequencyOfMatter } from '../src/services/gstReturnSheet.service.js';

const WRITE = process.argv.includes('--write');

async function main() {
  if (!process.env.FIRESTORE_DATABASE_ID && !process.argv.includes('--default-database')) {
    console.error('Refusing to run against the default database. Set FIRESTORE_DATABASE_ID, or pass --default-database on purpose.');
    process.exit(2);
  }
  const db = getDb();
  const keys = await gstReturnServiceKeys();
  console.log(`Database: ${process.env.FIRESTORE_DATABASE_ID || '(default)'} · services: ${keys.join(', ')} · ${WRITE ? 'WRITING' : 'report only'}`);
  let seen = 0;
  let stamped = 0;
  for (let i = 0; i < keys.length; i += 30) {
    const snap = await db.collection('tasks').where('serviceKey', 'in', keys.slice(i, i + 30)).get();
    let batch = db.batch();
    let ops = 0;
    for (const doc of snap.docs) {
      const t = doc.data();
      seen += 1;
      if (t.filingPeriod?.frequency || t.gstFrequency) continue;
      const frequency = await gstFrequencyOf(t);
      const why = frequencyOfMatter(t) ? (t.recurrence ? `Repeats: ${t.recurrence}` : 'service') : 'client setting';
      console.log(`${doc.id}\t${t.serviceKey}\t${t.createdAt ?? ''}\t${frequency}\t(${why})`);
      if (WRITE) {
        batch.update(doc.ref, { gstFrequency: frequency });
        ops += 1;
        if (ops >= 400) { await batch.commit(); batch = db.batch(); ops = 0; }
      }
      stamped += 1;
    }
    if (WRITE && ops) await batch.commit();
  }
  console.log(`${seen} GST return matters · ${stamped} ${WRITE ? 'stamped' : 'would be stamped'}`);
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
