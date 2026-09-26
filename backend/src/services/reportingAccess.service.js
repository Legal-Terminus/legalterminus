import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { STAFF_ROLES } from '../config/roles.js';

/**
 * #196 / #197 — who may see and who may edit each section of the Reporting
 * module (Leads, DM Cost, DM Income, Cold Calling, Reporting).
 *
 * The module is the ADMIN's: an admin always has full access and decides, per
 * section, which team members may EDIT (enter and change data) and which may
 * only VIEW. Anyone not listed has no access at all — the safe default, so a new
 * team member sees nothing until an admin grants it.
 *
 * Stored as one settings document so the whole grant table is read in a single
 * round trip and cached briefly; every write clears the cache.
 */

export const SECTIONS = [
  { key: 'leads',        label: 'Leads',               editable: true },
  { key: 'dm_cost',      label: 'DM Cost',             editable: true },
  { key: 'dm_income',    label: 'DM Income',           editable: true },
  { key: 'cold_calling', label: 'Cold Calling Income', editable: true },
  // Computed from the other sections — nothing to enter, so view only.
  { key: 'reporting',    label: 'Reporting',           editable: false },
];
export const SECTION_KEYS = SECTIONS.map((s) => s.key);
export const LEVELS = ['view', 'edit'];

const DOC = { collection: 'settings', id: 'reportingAccess' };
const CACHE_TTL_MS = 30 * 1000;
let cache = null; // { grants, at }

/** `{ [section]: { [uid]: 'view'|'edit' } }` — always every section, possibly empty. */
export async function getGrants() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.grants;
  const snap = await getDb().collection(DOC.collection).doc(DOC.id).get();
  const stored = snap.exists ? (snap.data().sections ?? {}) : {};
  const grants = {};
  for (const key of SECTION_KEYS) grants[key] = { ...(stored[key] ?? {}) };
  cache = { grants, at: Date.now() };
  return grants;
}

/** Pure: the level a user has on a section, given the grant table. */
export function levelFor(user, section, grants) {
  if (!user || !SECTION_KEYS.includes(section)) return null;
  if (user.role === 'admin') return 'edit';
  if (!STAFF_ROLES.includes(user.role)) return null; // clients/professionals: never
  const level = grants?.[section]?.[user.uid] ?? null;
  const def = SECTIONS.find((s) => s.key === section);
  // A computed section can never be edited, whatever was stored.
  if (level === 'edit' && !def.editable) return 'view';
  return LEVELS.includes(level) ? level : null;
}

/** The caller's level on every section — what the Portal uses to shape the UI. */
export async function levelsForUser(user) {
  const grants = await getGrants();
  return Object.fromEntries(SECTION_KEYS.map((k) => [k, levelFor(user, k, grants)]));
}

/**
 * Replace the grant table. Only STAFF uids are kept (a client or professional
 * can never be granted a section), levels are validated, and `edit` on a
 * computed section is stored as `view`.
 */
export async function saveGrants(sections, { staffUids, actorUid }) {
  const allowed = new Set(staffUids);
  const clean = {};
  for (const def of SECTIONS) {
    const out = {};
    for (const [uid, level] of Object.entries(sections?.[def.key] ?? {})) {
      if (!allowed.has(uid) || !LEVELS.includes(level)) continue;
      out[uid] = level === 'edit' && !def.editable ? 'view' : level;
    }
    clean[def.key] = out;
  }
  await getDb().collection(DOC.collection).doc(DOC.id).set({
    sections: clean,
    updatedAt: new Date().toISOString(),
    updatedBy: actorUid ?? null,
  });
  cache = null;
  logger.info({ actorUid }, 'Reporting access updated');
  return clean;
}

/**
 * Route guard: `requireSection('dm_cost', 'edit')`. Must run after verifyToken.
 * `view` is satisfied by either level; `edit` needs edit.
 */
export const requireSection = (section, need = 'view') => async (req, res, next) => {
  try {
    const level = levelFor(req.user, section, await getGrants());
    const ok = need === 'view' ? !!level : level === 'edit';
    if (!ok) {
      return res.status(403).json({
        message: need === 'edit'
          ? 'You can view this section but not change it. Ask an admin for edit access.'
          : 'You do not have access to this section. Ask an admin to grant it.',
        code: 'SECTION_ACCESS_DENIED',
      });
    }
    req.sectionLevel = level;
    next();
  } catch (err) {
    logger.error({ err, section }, 'requireSection failed');
    res.status(500).json({ message: 'Internal server error' });
  }
};

/** Tests only. */
export const __resetReportingAccessCache = () => { cache = null; };
