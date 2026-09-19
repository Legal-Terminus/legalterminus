import { logger } from '../config/logger.js';
import {
  DEFAULT_CALENDAR, resolveStatutoryDate, presentCalendar, validateCalendarEntry,
  calendarKeys,
} from '../../../shared/workflows/statutoryCalendar.js';

/**
 * The firm's statutory calendar, and its resolver.
 *
 * Overrides live at `settings/statutoryCalendar`, stored SEPARATELY from the
 * shipped defaults. That separation is the whole design: updating the defaults
 * in a release never touches the firm's edits, and the firm's edits do not have
 * to be re-applied afterwards.
 *
 * WHY A FIRM MUST BE ABLE TO EDIT IT. CBDT and GSTN extend due dates several
 * times a year at short notice. If the calendar were code-only, every extension
 * would need a deploy and the firm would work to a wrong date until it landed.
 *
 * Ported from Ambyflow (Story 35.3). The workspace-keyed cache collapses to a
 * single entry: there is one firm here, so there is one calendar.
 *
 * Reads are cached briefly because Story 35.1 resolves a date on every step
 * transition and every matter creation, and the table changes a handful of
 * times a year.
 */

const SETTINGS = 'settings';
const DOC = 'statutoryCalendar';
const CACHE_TTL_MS = 60_000;

let _cache = null; // { overrides, at }

export function invalidateCalendarCache() {
  _cache = null;
}

export async function getOverrides(db) {
  if (_cache && Date.now() - _cache.at < CACHE_TTL_MS) return _cache.overrides;
  let overrides = {};
  try {
    const snap = await db.collection(SETTINGS).doc(DOC).get();
    if (snap.exists) overrides = snap.data()?.overrides ?? {};
  } catch (err) {
    // A calendar read failure must degrade to the platform defaults, not break
    // matter creation.
    logger.warn({ err: err?.message }, 'statutory calendar read failed');
  }
  _cache = { overrides, at: Date.now() };
  return overrides;
}

/**
 * The resolver Story 35.1 calls. Returns a date string or null; null is safe
 * because `resolveDueDate` then falls back to the step's duration ETA.
 *
 * Bound to a matter, so `anchorDate` (for AGM-relative rules) and the filing
 * month both come from the matter rather than the caller.
 */
export function makeStatutoryResolver(overrides) {
  return (key, ctx = {}) => {
    try {
      return resolveStatutoryDate(key, {
        overrides,
        // The period being filed for. A matter carries its anchor date; the
        // month defaults to the current one, which is what a monthly filing
        // raised today is for.
        month: ctx.month ?? new Date().toISOString().slice(0, 7),
        periodKey: ctx.month ?? new Date().toISOString().slice(0, 7),
        anchorDate: ctx.anchorDate ?? null,
      });
    } catch {
      return null;
    }
  };
}

export async function readCalendar(db, { month = null } = {}) {
  const overrides = await getOverrides(db);
  return {
    rows: presentCalendar({ defaults: DEFAULT_CALENDAR, overrides, month }),
    month,
  };
}

/**
 * Save or clear ONE key's override.
 *
 * Passing `null` reverts to the platform default (AC1's "revert"), which is a
 * delete rather than a copy of the default — otherwise the firm would be pinned
 * to today's default and miss the next platform correction.
 */
export async function setOverride(db, key, entry, { periodKey = null, actorUid = null } = {}) {
  if (!calendarKeys({ defaults: DEFAULT_CALENDAR, overrides: await getOverrides(db) }).includes(key)
      && !entry) {
    throw new Error('Unknown calendar key.');
  }
  if (entry) {
    const err = validateCalendarEntry(entry);
    if (err) throw new Error(err);
  }

  const overrides = { ...(await getOverrides(db)) };
  const current = { ...(overrides[key] ?? {}) };

  if (periodKey) {
    const periods = { ...(current.periods ?? {}) };
    if (entry) periods[periodKey] = entry; else delete periods[periodKey];
    current.periods = periods;
  } else if (entry) {
    current.entry = entry;
  } else {
    delete current.entry;
  }

  // Drop the key entirely when nothing is left, so a reverted key reads as
  // 'platform' again rather than lingering as an empty override.
  if (!current.entry && Object.keys(current.periods ?? {}).length === 0) {
    delete overrides[key];
  } else {
    overrides[key] = current;
  }

  await db.collection(SETTINGS).doc(DOC).set({
    overrides,
    updatedAt: new Date().toISOString(),
    updatedBy: actorUid,
  }, { merge: true });
  invalidateCalendarCache();
  logger.info({ key, periodKey, cleared: !entry, by: actorUid }, 'statutory calendar updated');
  return overrides;
}
