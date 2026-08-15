/**
 * Seed E2E test fixtures for the Playwright suite.
 *
 *   node scripts/seed-e2e.js [--write-env]
 *
 * Creates/updates one user PER ROLE (admin, manager, team_member, client) with
 * KNOWN passwords, their Firestore user docs + roles + custom claims, plus the
 * fixtures the suite needs:
 *   • ACTIVE matter      — client-owned, assigned to team_member (docs/steps/ETA/reassign)
 *   • PENDING matter     — manager-created, status pending_admin_approval (approval flow)
 *   • a CONTACT LEAD     — unregistered (E08-S06 convert/inline-status)
 *
 * With --write-env it writes Portal/e2e/.env.e2e directly. Without it, prints the
 * values. Idempotent for users (reused by email); matters/leads are recreated
 * fresh each run and the prior run's e2e fixtures are cleaned up first.
 *
 * THROWAWAY accounts — safe only on dev/QA projects.
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { admin, getDb } from '../src/config/firebase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAG = 'e2e'; // marks fixtures we create so we can clean them up safely

const USERS = {
  admin:       { email: 'e2e-admin@legalterminus.test',   password: 'E2eAdmin!2026',   name: 'E2E Admin',   role: 'admin' },
  manager:     { email: 'e2e-manager@legalterminus.test', password: 'E2eManager!2026', name: 'E2E Manager', role: 'manager' },
  team_member: { email: 'e2e-team@legalterminus.test',    password: 'E2eTeam!2026',    name: 'E2E Team',    role: 'team_member' },
  client:      { email: 'e2e-client@legalterminus.test',  password: 'E2eClient!2026',  name: 'E2E Client',  role: 'client' },
  // #168: an external referring professional — view-only, and only on the
  // matters they are explicitly named on.
  professional: { email: 'e2e-pro@legalterminus.test',    password: 'E2ePro!2026',     name: 'E2E Professional', role: 'professional' },
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
    ...(role === 'client' ? { emailIds: [email] } : { designation: 'E2E' }),
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

    if (process.argv.includes('--write-env')) {
      const envPath = path.join(__dirname, '../../Portal/e2e/.env.e2e');
      writeFileSync(envPath, env);
      console.log(`✅ Wrote ${envPath}`);
    } else {
      console.log('\n✅ E2E fixtures ready. Portal/e2e/.env.e2e:\n');
      console.log(env);
    }
    console.log(`uids: ${JSON.stringify(uid)}`);
    process.exit(0);
  } catch (e) {
    console.error('❌ seed-e2e failed:', e.message, e.stack);
    process.exit(1);
  }
})();
