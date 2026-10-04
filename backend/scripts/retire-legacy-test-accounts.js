/**
 * One-off (2026-10-04): retire the five `e2e-*@legalterminus.test` accounts.
 *
 * Their passwords were committed in scripts/seed-e2e.js and they were seeded
 * into the LIVE project with real roles — `e2e-admin` was a working admin on
 * the live portal for anyone who could read the repo. The tests now use
 * `qa-*` accounts on the QA database with passwords that are not in the repo.
 *
 *   node scripts/retire-legacy-test-accounts.js            # report only
 *   node scripts/retire-legacy-test-accounts.js --apply    # do it
 *
 * For each account, --apply:
 *   - disables sign-in, replaces the password with a random one nobody keeps,
 *     and revokes its sessions;
 *   - marks its record in the LIVE database deactivated (kept, not deleted:
 *     matters and history may name it);
 *   - removes its record from the QA database, where it is now only clutter.
 *
 * Safe to run twice.
 */
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import initializeFirebase, { admin } from '../src/config/firebase.js';

const EMAILS = ['admin', 'manager', 'team', 'client', 'pro'].map((r) => `e2e-${r}@legalterminus.test`);
const QA_DATABASE = 'qa-data';
const apply = process.argv.includes('--apply');

initializeFirebase();
const auth = admin.auth();
const live = getFirestore(admin.app());
const qa = getFirestore(admin.app(), QA_DATABASE);

const count = async (q) => (await q.count().get()).data().count;

console.log(apply ? 'APPLYING\n' : 'REPORT ONLY — nothing is changed. Re-run with --apply.\n');
for (const email of EMAILS) {
  let user;
  try { user = await auth.getUserByEmail(email); } catch { console.log(`${email}: no such account`); continue; }
  const { uid } = user;
  const liveDoc = await live.collection('users').doc(uid).get();
  const qaDoc = await qa.collection('users').doc(uid).get();
  const refs = {
    clientOf: await count(live.collection('tasks').where('clientUid', '==', uid)),
    ownerOf: await count(live.collection('tasks').where('assignedTo', '==', uid)),
  };
  console.log(`${email}`);
  console.log(`  sign-in: ${user.disabled ? 'already disabled' : 'ENABLED'} | live role: ${liveDoc.exists ? liveDoc.data().role : '(no live record)'}`
    + ` | live status: ${liveDoc.exists ? (liveDoc.data().status ?? 'active') : '-'} | QA record: ${qaDoc.exists ? 'yes' : 'no'}`);
  console.log(`  live matters as client: ${refs.clientOf}, as owner: ${refs.ownerOf}`);
  if (!apply) continue;
  await auth.updateUser(uid, { disabled: true, password: crypto.randomBytes(32).toString('base64url') });
  await auth.revokeRefreshTokens(uid);
  if (liveDoc.exists) {
    await liveDoc.ref.set({
      status: 'deactivated', deactivatedAt: new Date().toISOString(),
      deactivatedReason: 'Legacy test account retired — its password was in the repository.',
    }, { merge: true });
  }
  if (qaDoc.exists) await qaDoc.ref.delete();
  console.log('  → sign-in disabled, password replaced, sessions revoked, live record deactivated, QA record removed');
}
process.exit(0);
