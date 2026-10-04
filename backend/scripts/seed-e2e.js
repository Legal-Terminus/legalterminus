/**
 * Seed the test accounts the Playwright suite — and people testing on QA — sign
 * in with.
 *
 *   FIRESTORE_DATABASE_ID=qa-data node scripts/seed-e2e.js
 *
 * Creates/updates one account PER ROLE (admin, manager, team member, client,
 * professional) in the QA database and writes their sign-in details to
 * Portal/e2e/.env.e2e, which is NOT committed.
 *
 * THE PASSWORDS ARE NOT IN THIS FILE, on purpose. They used to be: five
 * accounts with passwords committed to the repo, seeded into the LIVE project
 * with real roles — so anyone who could read the repo could sign in to the live
 * portal as an admin. Now a password is generated the first time an account is
 * seeded, kept in the uncommitted env file, and reused on later runs so people
 * testing on QA are not locked out by a re-seed.
 *
 * IT REFUSES TO RUN AGAINST THE LIVE DATABASE. It deletes every matter of the
 * test client and rewrites accounts; that belongs on QA only. See
 * docs/qa-environment.md.
 */
import crypto from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { admin, getDb } from '../src/config/firebase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAG = 'e2e'; // marks fixtures we create so we can clean them up safely
const E2E_CLIENT_PHONE = '9990001201';
const ENV_PATH = path.join(__dirname, '../../Portal/e2e/.env.e2e');

if (!(process.env.FIRESTORE_DATABASE_ID || '').trim()) {
  console.error([
    '❌ Refusing to seed test accounts into the LIVE database.',
    '   Set FIRESTORE_DATABASE_ID to the QA database:',
    '     FIRESTORE_DATABASE_ID=qa-data node scripts/seed-e2e.js',
    '   See docs/qa-environment.md.',
  ].join('\n'));
  process.exit(2);
}

/** What the last run wrote, so its passwords can be reused. */
function previousEnv() {
  if (!existsSync(ENV_PATH)) return {};
  return Object.fromEntries(readFileSync(ENV_PATH, 'utf8').split('\n')
    .map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2]]));
}
const PREVIOUS = previousEnv();

/**
 * A password for `email`: the one already in the env file if it belongs to this
 * same address, else an explicit E2E_<KEY>_PASSWORD from the environment (for a
 * pipeline), else a new random one.
 */
function passwordFor(envKey, email) {
  if (PREVIOUS[`E2E_${envKey}_EMAIL`] === email && PREVIOUS[`E2E_${envKey}_PASSWORD`]) {
    return PREVIOUS[`E2E_${envKey}_PASSWORD`];
  }
  return process.env[`E2E_${envKey}_PASSWORD`] || `Qa-${crypto.randomBytes(15).toString('base64url')}-7a`;
}

// Display names stay "E2E …": specs find these people by name on screen.
const account = (envKey, local, name, role) => {
  const email = `${local}@legalterminus.test`;
  return { email, password: passwordFor(envKey, email), name, role };
};
const USERS = {
  admin:       account('ADMIN', 'qa-admin', 'E2E Admin', 'admin'),
  manager:     account('MANAGER', 'qa-manager', 'E2E Manager', 'manager'),
  team_member: account('TEAM', 'qa-team', 'E2E Team', 'team_member'),
  client:      account('CLIENT', 'qa-client', 'E2E Client', 'client'),
  // #168: an external referring professional — view-only, and only on the
  // matters they are explicitly named on.
  professional: account('PRO', 'qa-pro', 'E2E Professional', 'professional'),
};

async function ensureAuthUser({ email, password, name, role }) {
  const auth = admin.auth();
  let rec;
  try {
    rec = await auth.getUserByEmail(email);
    await auth.updateUser(rec.uid, { password, displayName: name });
  } catch {
    rec = await auth.createUser({ email, password, displayName: name, emailVerified: true });
  }
  await auth.setCustomUserClaims(rec.uid, { role });

  const db = getDb();
  const now = new Date().toISOString();
  await db.collection('users').doc(rec.uid).set({
    name, email, role, e2e: true,
    createdAt: now, updatedAt: now,
    // #201: the client carries a phone so the matter list's contact column
    // has something to show.
    ...(role === 'client' ? { emailIds: [email], phone: E2E_CLIENT_PHONE } : { designation: 'E2E' }),
  }, { merge: true });
  return rec.uid;
}

// Sweep ORPHANS from prior runs (specs normally self-clean, but a crashed run can
// leave matters/leads/temp-users behind). Removes: every matter for the e2e client,
// e2e-tagged leads, any e2e-temp-* users, and e2e users' notifications.
async function cleanupPriorFixtures() {
  const db = getDb();

  // Resolve the e2e client uid → delete ALL its matters (+ subcollections).
  const clientSnap = await db.collection('users').where('email', '==', USERS.client.email).get().catch(() => ({ docs: [] }));
  for (const c of clientSnap.docs) {
    const tasks = await db.collection('tasks').where('clientUid', '==', c.id).get().catch(() => ({ docs: [] }));
    for (const d of tasks.docs) {
      for (const sub of ['steps', 'events', 'documents']) {
        const ss = await d.ref.collection(sub).get();
        const b = db.batch(); ss.forEach((x) => b.delete(x.ref)); if (ss.size) await b.commit();
      }
      await d.ref.delete();
    }
  }

  // e2e-tagged leads + any lead created by the helper (matched by email prefix).
  const leads = await db.collection('contactLeads').get().catch(() => ({ docs: [] }));
  {
    const b = db.batch(); let n = 0;
    leads.docs.forEach((d) => {
      const x = d.data();
      if (x.e2e === true || /^e2e-lead-/.test(String(x.email ?? ''))) { b.delete(d.ref); n++; }
    });
    if (n) await b.commit();
  }

  // Throwaway temp staff users (e2e-temp-*) from the reassign test.
  const temps = await db.collection('users').get().catch(() => ({ docs: [] }));
  for (const u of temps.docs) {
    if (/^e2e-temp-/.test(String(u.data().email ?? ''))) {
      try { await admin.auth().deleteUser(u.id); } catch { /* may not exist */ }
      await u.ref.delete();
    }
  }

  // Clear notifications for the stable e2e users so assertions are deterministic.
  for (const email of Object.values(USERS).map((u) => u.email)) {
    const userSnap = await db.collection('users').where('email', '==', email).get().catch(() => ({ docs: [] }));
    for (const u of userSnap.docs) {
      const ns = await db.collection('notifications').where('recipientUid', '==', u.id).get().catch(() => ({ docs: [] }));
      const b = db.batch(); ns.forEach((x) => b.delete(x.ref)); if (ns.docs.length) await b.commit();
    }
  }
}

(async () => {
  try {
    getDb();
    await cleanupPriorFixtures();

    const uid = {};
    for (const key of Object.keys(USERS)) uid[key] = await ensureAuthUser(USERS[key]);

    // NOTE: matters + leads are NO LONGER seeded here. Each spec provisions its OWN
    // fresh matter/lead per run via Portal/e2e/api.ts and deletes it after, so tests
    // never share mutable state. This seed only ensures the stable role USERS exist.
    const env = [
      `E2E_BASE_URL=http://localhost:5173/portal/`,
      `E2E_ADMIN_EMAIL=${USERS.admin.email}`,
      `E2E_ADMIN_PASSWORD=${USERS.admin.password}`,
      `E2E_MANAGER_EMAIL=${USERS.manager.email}`,
      `E2E_MANAGER_PASSWORD=${USERS.manager.password}`,
      `E2E_TEAM_EMAIL=${USERS.team_member.email}`,
      `E2E_TEAM_PASSWORD=${USERS.team_member.password}`,
      `E2E_CLIENT_EMAIL=${USERS.client.email}`,
      `E2E_CLIENT_PASSWORD=${USERS.client.password}`,
      `E2E_STAFF_EMAIL=${USERS.admin.email}`,
      `E2E_STAFF_PASSWORD=${USERS.admin.password}`,
      `E2E_ADMIN_UID=${uid.admin}`,
      `E2E_MANAGER_UID=${uid.manager}`,
      `E2E_TEAM_UID=${uid.team_member}`,
      `E2E_CLIENT_UID=${uid.client}`,
      `E2E_PRO_EMAIL=${USERS.professional.email}`,
      `E2E_PRO_PASSWORD=${USERS.professional.password}`,
      `E2E_PRO_UID=${uid.professional}`,
      // Web API key — lets Portal/e2e/api.ts mint ID tokens to create/delete a
      // fresh matter/lead per run via the backend (no shared mutable fixtures).
      `E2E_FIREBASE_API_KEY=${process.env.VITE_FIREBASE_API_KEY ?? process.env.FIREBASE_API_KEY ?? ''}`,
      `E2E_API_BASE=http://localhost:5001`,
      '',
    ].join('\n');

    // Always written, never printed: the file is the only place the passwords live.
    writeFileSync(ENV_PATH, env, { mode: 0o600 });
    console.log(`✅ Test accounts ready in database "${process.env.FIRESTORE_DATABASE_ID}".`);
    console.log(`   Sign-in details written to ${path.relative(process.cwd(), ENV_PATH)} (not committed).`);
    for (const u of Object.values(USERS)) console.log(`   ${u.role.padEnd(12)} ${u.email}`);
    console.log(`uids: ${JSON.stringify(uid)}`);
    process.exit(0);
  } catch (e) {
    console.error('❌ seed-e2e failed:', e.message, e.stack);
    process.exit(1);
  }
})();
