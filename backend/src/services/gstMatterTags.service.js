/**
 * #292 / #294 — the GST return tags on a matter: its Filing Month (#292) and,
 * on the GSTR-1 / GSTR-3B filing tasks, "Filed on" (#294). The rules are the
 * GST Return Filing sheet's (#279), in gstReturnSheet.service.js
 * (`gstMatterTags`); this file only reads what they need.
 *
 * WHICH MATTERS. A matter opened by the GST sweep (#219, it carries
 * `filingPeriod`) or of a service linked to the sheet (default GST Return Filing
 * monthly and quarterly; an admin changes them under Edit columns). The linked
 * services are read from `worksheetConfig/gst_return`, cached for a minute and
 * dropped at once when this instance saves the sheet's columns.
 *
 * NOTHING STORED. The period is the matter's `filingPeriod`, or — for a matter
 * opened by hand — the period that had ended when it was opened; the filing date
 * is the task's `completedAt`. Both are computed on read, so there is no second
 * copy to keep in step. A reopened task loses its date until it is completed again.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { SHEETS } from '../config/worksheetDefinitions.js';
import { resolveSheet } from './worksheetEngine.service.js';
import { gstMatterTags, isGstReturnMatter } from './gstReturnSheet.service.js';
import { GST_SERVICE_KEYS } from '../../../shared/workflows/gstReturns.js';

const BOOK = 'gst_return';
const TTL_MS = 60 * 1000;
let cached = null; // { at, keys }

/** The services whose matters are GST return matters — the sheet's linked services. */
export async function gstReturnServiceKeys(now = Date.now()) {
  if (cached && now - cached.at < TTL_MS) return cached.keys;
  let config = {};
  try {
    const snap = await getDb().collection('worksheetConfig').doc(BOOK).get();
    config = snap.exists ? snap.data() : {};
  } catch (err) {
    // Display data only: fall back to the defaults rather than fail the page.
    logger.warn({ err }, '#292 could not read the GST sheet\'s linked services — using the defaults');
  }
  const keys = [...new Set(Object.values(SHEETS).filter((s) => s.book === BOOK)
    .flatMap((s) => resolveSheet(s.key, config)?.linkedServices ?? []))];
  cached = { at: now, keys };
  return keys;
}

/** Called when the sheet's columns (and with them its linked services) are saved. */
export function invalidateGstReturnServiceKeys() {
  cached = null;
}

/** Only a hand-opened matter on the monthly service needs the client's own setting to tell monthly from quarterly. */
const needsClient = (t) => !t?.filingPeriod?.frequency && t?.serviceKey !== GST_SERVICE_KEYS.quarterly;

async function readClients(uids) {
  const out = new Map();
  const ids = [...new Set(uids.filter(Boolean))];
  const db = getDb();
  for (let i = 0; i < ids.length; i += 100) {
    const snaps = await db.getAll(...ids.slice(i, i + 100).map((uid) => db.collection('users').doc(uid)));
    for (const s of snaps) if (s.exists) out.set(s.id, s.data());
  }
  return out;
}

/**
 * #292 — the matters list: `gstFilingPeriodLabel` on every GST return matter.
 * No steps are read. One batched client read, only for hand-opened monthly-service
 * matters. Never throws: a list without the tag is better than no list.
 */
export async function attachGstFilingPeriods(rows) {
  try {
    const linked = await gstReturnServiceKeys();
    const gst = rows.filter((t) => isGstReturnMatter(t, linked));
    if (!gst.length) return rows;
    const clients = await readClients(gst.filter(needsClient).map((t) => t.clientUid));
    for (const t of gst) {
      t.gstFilingPeriodLabel = gstMatterTags({ task: t, client: clients.get(t.clientUid) ?? null, linkedServices: linked })?.period ?? null;
    }
  } catch (err) {
    logger.warn({ err }, '#292 could not attach GST filing periods to the matters list');
  }
  return rows;
}

/**
 * #292 / #294 — one matter (with its steps, INTERNAL names): sets
 * `gstFilingPeriodLabel` and `gstFilings` ([{ stepNumber, form, date }]) on the
 * matter and `filedOn` ('YYYY-MM-DD') on the completed GSTR-1 / GSTR-3B filing tasks. Call before the client's projection.
 * Never throws.
 */
export async function annotateGstMatter(full) {
  try {
    const linked = await gstReturnServiceKeys();
    if (!isGstReturnMatter(full, linked)) return full;
    const clients = needsClient(full) ? await readClients([full.clientUid]) : new Map();
    const tags = gstMatterTags({ task: full, steps: full.steps ?? [], client: clients.get(full.clientUid) ?? null, linkedServices: linked });
    if (!tags) return full;
    full.gstFilingPeriodLabel = tags.period;
    // The completed filings, for the matter's header: the step list hides
    // completed tasks until "Show completed" is pressed.
    full.gstFilings = tags.filedOn;
    const byStep = new Map(tags.filedOn.map((f) => [f.stepNumber, f.date]));
    if (byStep.size && Array.isArray(full.steps)) {
      full.steps = full.steps.map((s) => (byStep.has(s.stepNumber) ? { ...s, filedOn: byStep.get(s.stepNumber) } : s));
    }
  } catch (err) {
    logger.warn({ err, taskId: full?.id }, '#292 could not work out the GST tags of a matter');
  }
  return full;
}
