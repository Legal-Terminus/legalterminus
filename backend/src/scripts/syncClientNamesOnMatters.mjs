/**
 * #277 — refresh `clientName` on every matter from its client's profile.
 *
 * A matter's `clientName` is a copy of the client's name taken when the matter
 * was created. Until #277 nothing refreshed it, so a client renamed since then
 * still shows the old name on their matters. Renames now propagate as they
 * happen (services/clientName.service.js); this one-off pass repairs the
 * matters renamed before that, and any a failed sync left behind.
 *
 * DRY RUN BY DEFAULT — it only reports. Pass --apply to write.
 *
 *   FIRESTORE_DATABASE_ID=qa-data node src/scripts/syncClientNamesOnMatters.mjs
 *   FIRESTORE_DATABASE_ID=qa-data node src/scripts/syncClientNamesOnMatters.mjs --apply
 *
 * Without FIRESTORE_DATABASE_ID it reads the LIVE database. Idempotent: a second
 * --apply finds nothing to change. Only `clientName` is written — `updatedAt` is
 * left alone so the Matters list order does not change.
 */
import 'dotenv/config';
import { db } from '../config/firebase.js';
import { clientRealName } from '../services/clientName.service.js';

const APPLY = process.argv.includes('--apply');
const databaseId = (process.env.FIRESTORE_DATABASE_ID || '').trim() || '(default) — LIVE';
console.log(`Database: ${databaseId}   mode: ${APPLY ? 'APPLY' : 'dry run'}\n`);

const clients = await db.collection('users').where('role', '==', 'client').get();
const nameByUid = new Map(clients.docs.map((d) => [d.id, clientRealName(d.data())]));

const tasks = await db.collection('tasks').get();
let changed = 0;
let same = 0;
let noClient = 0;
let batch = db.batch();
let inBatch = 0;

for (const doc of tasks.docs) {
  const t = doc.data();
  const name = nameByUid.get(t.clientUid);
  // The client was deleted, is not a client any more, or their profile has no
  // real name (empty, or an email address that sign-in wrote over it before
  // #277): there is no name to take, so the matter keeps the one it has.
  if (!name) { noClient += 1; continue; }
  if ((t.clientName ?? '') === name) { same += 1; continue; }
  changed += 1;
  console.log(`${APPLY ? '' : '[dry] '}${doc.id}  ${JSON.stringify(t.clientName ?? null)} -> ${JSON.stringify(name)}`);
  if (APPLY) {
    batch.update(doc.ref, { clientName: name });
    inBatch += 1;
    if (inBatch === 400) { await batch.commit(); batch = db.batch(); inBatch = 0; }
  }
}
if (APPLY && inBatch) await batch.commit();

console.log(`\n${APPLY ? 'updated' : 'WOULD UPDATE'}: ${changed}   already right: ${same}   `
  + `no client name to take (left alone): ${noClient}   matters: ${tasks.size}`);
process.exit(0);
