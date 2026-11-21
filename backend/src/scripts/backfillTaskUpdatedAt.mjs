/**
 * #275 — give every matter a string `updatedAt`.
 *
 * The staff Matters list pages through `orderBy('updatedAt', 'desc')`, and
 * Firestore leaves OUT of an ordered query every document that lacks the field.
 * A matter with no `updatedAt` (one imported or written before the field was
 * kept) can therefore never appear in the list, whatever filter is chosen. A
 * Timestamp instead of an ISO string is listed, but sorts apart from the rest
 * and breaks the in-memory sorts of the team-member and client views.
 *
 * This pass sets `updatedAt` to the best date the matter has — its own
 * Timestamp converted to ISO, else `completedAt`, else `createdAt` — and to
 * nothing when it has none of those (reported, left for a human).
 *
 * DRY RUN BY DEFAULT — it only reports. Pass --apply to write.
 *
 *   FIRESTORE_DATABASE_ID=qa-data node src/scripts/backfillTaskUpdatedAt.mjs
 *   FIRESTORE_DATABASE_ID=qa-data node src/scripts/backfillTaskUpdatedAt.mjs --apply
 *
 * Without FIRESTORE_DATABASE_ID it reads the LIVE database. Idempotent.
 */
import 'dotenv/config';
import { db } from '../config/firebase.js';

const APPLY = process.argv.includes('--apply');
const databaseId = (process.env.FIRESTORE_DATABASE_ID || '').trim() || '(default) — LIVE';
console.log(`Database: ${databaseId}   mode: ${APPLY ? 'APPLY' : 'dry run'}\n`);

/** A Timestamp, Date or parseable string → ISO string, else null. */
function toIso(v) {
  if (!v) return null;
  if (typeof v?.toDate === 'function') return v.toDate().toISOString();
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString();
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

const tasks = await db.collection('tasks').get();
// What an ordered query can see — the gap is the matters the list cannot show.
const visible = (await db.collection('tasks').orderBy('updatedAt', 'desc').count().get()).data().count;
console.log(`matters: ${tasks.size}   reachable by orderBy(updatedAt): ${visible}\n`);

let changed = 0;
let fine = 0;
let undatable = 0;
for (const doc of tasks.docs) {
  const t = doc.data();
  if (typeof t.updatedAt === 'string' && t.updatedAt) { fine += 1; continue; }
  const iso = toIso(t.updatedAt) ?? toIso(t.completedAt) ?? toIso(t.createdAt);
  if (!iso) {
    undatable += 1;
    console.log(`[no date] ${doc.id}  status=${t.status}  — left alone`);
    continue;
  }
  changed += 1;
  console.log(`${APPLY ? '' : '[dry] '}${doc.id}  status=${t.status}  updatedAt ${JSON.stringify(t.updatedAt ?? null)} -> ${iso}`);
  if (APPLY) await doc.ref.update({ updatedAt: iso });
}

console.log(`\n${APPLY ? 'updated' : 'WOULD UPDATE'}: ${changed}   already fine: ${fine}   no date at all: ${undatable}`);
process.exit(0);
