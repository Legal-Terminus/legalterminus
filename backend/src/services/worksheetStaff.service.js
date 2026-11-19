import { STAFF_ROLES } from '../config/roles.js';

/**
 * #280 — the people a worksheet `staff` column (TDS Sheet: Assigned to,
 * Checker) lists: the portal's staff (admin, manager, team member). Clients and
 * professionals are never listed.
 *
 * Returned as [{ uid, name, email, active }]. Former staff (deactivated) are
 * kept with `active: false` so a row assigned to someone who has left still
 * shows their name; the pickers offer active staff only. The email stays on the
 * server — it is used to match an uploaded cell, and the page receives uid and
 * name only (worksheetEngine.staffChoices).
 *
 * One query bounded by the size of the team, cached for a minute: opening a
 * sheet and every batch of an Excel upload would otherwise re-read it. A person
 * added or deactivated shows up within that minute.
 */

const TTL_MS = 60_000;
let cache = null; // { at, list, includeTestAccounts }

/** Test runs sign in AS the seeded accounts, so they must be listed (same rule as @mentions). */
const isTestRun = () => String(process.env.EMAIL_DISABLED ?? '').toLowerCase() === 'true'
  || process.env.NODE_ENV === 'test';

/** A display name for a user document; never the full email address. */
export function staffName(u) {
  const name = u.displayName || u.name || u.fullName;
  if (name && String(name).trim()) return String(name).trim();
  const email = String(u.email || (Array.isArray(u.emailIds) && u.emailIds[0]) || '');
  return email ? email.split('@')[0] : 'Staff member';
}

/** Pure: user documents → the staff list. Seeded e2e accounts are dropped outside test runs. */
export function toStaffList(docs, { includeTestAccounts = false } = {}) {
  return docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((u) => STAFF_ROLES.includes(u.role))
    .filter((u) => includeTestAccounts || u.e2e !== true)
    .map((u) => ({
      uid: u.uid,
      name: staffName(u),
      email: String(u.email || (Array.isArray(u.emailIds) && u.emailIds[0]) || '').toLowerCase() || null,
      active: u.status !== 'deactivated',
    }));
}

export async function loadWorksheetStaff(db, { now = Date.now(), includeTestAccounts = isTestRun() } = {}) {
  if (cache && now - cache.at < TTL_MS && cache.includeTestAccounts === includeTestAccounts) return cache.list;
  const snap = await db.collection('users').where('role', 'in', STAFF_ROLES).get();
  const list = toStaffList(snap.docs, { includeTestAccounts });
  cache = { at: now, list, includeTestAccounts };
  return list;
}

/** Tests only. */
export const resetWorksheetStaffCache = () => { cache = null; };
