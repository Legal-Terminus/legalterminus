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
 * THE PERIOD is computed on read: the matter's `filingPeriod`, or — for a
 * matter opened by hand — the period that had ended when it was opened.
 *
 * THE FILING DATE (#294, firm 17 Nov) is the date staff save on the filing task
 * (`filingDate` on the step, PUT …/filed-on), never the day it was completed.
 * Tasks completed before that rule went live keep the date they showed — see
 * `manualFilingDatesFrom` and gstReturnSheet.service.js.
 */
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { SHEETS } from '../config/worksheetDefinitions.js';
import { resolveSheet } from './worksheetEngine.service.js';
import {
  gstMatterTags, isGstReturnMatter, frequencyOf, frequencyOfMatter, filedOnBounds, withAuthoredOrder, gstFirstEmail,
  gstSubjectFallback,
} from './gstReturnSheet.service.js';
import { renderTemplate } from './emailTemplates.service.js';
import { emailVars } from './gstReturns.service.js';

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

/**
 * #294 — when "the filing date is entered, not derived" went live: an ISO time,
 * recorded ONCE in `system/gstFilingDates` by the first instance that needs it
 * (create-if-absent, so every instance agrees) and cached for the process's
 * life — it never changes. A filing task completed before it, with no saved
 * date, keeps the date it showed (its completion day or correction). Throws if
 * it cannot be read: a caller that writes (the sheet sync) must not mistake a
 * failed read for "no dates".
 */
let manualFrom = null;
export async function manualFilingDatesFrom() {
  if (manualFrom) return manualFrom;
  const ref = getDb().collection('system').doc('gstFilingDates');
  const snap = await ref.get();
  let at = snap.exists ? snap.data()?.manualFrom ?? null : null;
  if (!at) {
    const now = new Date().toISOString();
    try {
      await ref.create({ manualFrom: now, why: '#294: filing dates are entered on the filing task from this time; tasks completed before keep their completion date' });
      at = now;
      logger.info({ manualFrom: now }, '#294 manual GST filing dates start now');
    } catch (err) {
      if (err?.code !== 6) throw err; // ALREADY_EXISTS: another instance recorded it first
      at = (await ref.get()).data()?.manualFrom ?? null;
    }
  }
  if (!at) throw new Error('gstFilingDates.manualFrom missing');
  manualFrom = at;
  return at;
}

/** Called when the sheet's columns (and with them its linked services) are saved. */
export function invalidateGstReturnServiceKeys() {
  cached = null;
}

/** Only a matter that does not say its own frequency (`frequencyOfMatter`) needs the client's setting to tell monthly from quarterly. */
const needsClient = (t) => !frequencyOfMatter(t);

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
 * `gstFilingPeriodLabel`, `gstFilings` ([{ stepNumber, form, date | null,
 * status }] — the filing tasks the matter has reached, or that have a date) and
 * `gstFilingDateBounds` ({ min, max }) on the matter, and on the GSTR-1 /
 * GSTR-3B filing tasks `gstFilingForm` and, once saved, `filedOn`. Call
 * before the client's projection. `definitionSteps` (the service's authored list)
 * gives the flow order the tasks are matched in.
 * Never throws.
 */
export async function annotateGstMatter(full, { definitionSteps = null } = {}) {
  try {
    const linked = await gstReturnServiceKeys();
    if (!isGstReturnMatter(full, linked)) return full;
    // The client is read when it decides the frequency, or names the company (no organisation on the matter).
    const clients = needsClient(full) || !full.organisation ? await readClients([full.clientUid]) : new Map();
    const tags = gstMatterTags({
      task: full, steps: withAuthoredOrder(full.steps ?? [], definitionSteps), client: clients.get(full.clientUid) ?? null,
      linkedServices: linked,
      // Display only: if it cannot be read, older tasks show no date this once.
      manualFrom: await manualFilingDatesFrom().catch((err) => {
        logger.warn({ err, taskId: full?.id }, '#294 could not read when manual filing dates began');
        return null;
      }),
    });
    if (!tags) return full;
    full.gstFilingPeriodLabel = tags.period;
    // #219 (16 Nov): monthly or quarterly, and the subject every email of the matter carries.
    full.gstFrequency = tags.frequency;
    full.gstEmailSubject = await gstEmailSubjectFor(full, clients.get(full.clientUid) ?? null);
    // The filings, for the matter's header (the step list hides completed tasks
    // until "Show completed" is pressed): dated ones, and reached ones staff
    // still have to add a date to.
    full.gstFilings = tags.filings;
    // #294: the range a filing date may be saved in (the date picker's min / max).
    full.gstFilingDateBounds = filedOnBounds(full, tags.frequency);
    const byStep = new Map(tags.filings.map((f) => [f.stepNumber, f]));
    if (byStep.size && Array.isArray(full.steps)) {
      full.steps = full.steps.map((s) => {
        const f = byStep.get(s.stepNumber);
        if (!f) return s;
        return { ...s, gstFilingForm: f.form, ...(f.date ? { filedOn: f.date } : {}) };
      });
    }
  } catch (err) {
    logger.warn({ err, taskId: full?.id }, '#292 could not work out the GST tags of a matter');
  }
  return full;
}

/** Monthly or quarterly for one matter, by the sheet's rule (reads the client only when it decides). */
export async function gstFrequencyOf(task) {
  const clients = needsClient(task) ? await readClients([task.clientUid]) : new Map();
  return frequencyOf(task, clients.get(task.clientUid) ?? null);
}

/** #219: the GST first email for a newly created matter, or null (see `gstFirstEmail`). */
export async function gstFirstEmailFor(task, client) {
  return gstFirstEmail({ task, client, linkedServices: await gstReturnServiceKeys() });
}

/**
 * #219 (firm, 16 Nov) — the subject every email about this GST return matter
 * carries, to the client and to staff: its first email's subject, rendered from
 * the firm's GST template for the matter's own frequency and period
 * ("ABC PRIVATE LIMITED - GST Return - Q1 2026-27"). Null for any other matter.
 * `client` is the client's user document (or null).
 */
export async function gstEmailSubjectFor(task, client) {
  const first = gstFirstEmail({ task, client, linkedServices: await gstReturnServiceKeys() });
  if (!first) return null;
  try {
    const rendered = await renderTemplate(first.templateKey, await emailVars(first.client, first.period));
    const subject = rendered?.subject?.trim();
    if (subject) return subject;
  } catch (err) {
    logger.warn({ err, taskId: task?.id }, '#219 could not render the GST subject — using the built-in format');
  }
  return gstSubjectFallback(first);
}

const SUBJECT_TTL_MS = 60 * 1000;
const subjects = new Map(); // taskId → { at, subject }

/**
 * The same, by matter id — for the email service, which knows only the matter's
 * id. Cached per matter for a minute (a matter's period never changes, and its
 * organisation rarely), so a burst of emails reads the matter once. Never throws:
 * an email without the GST subject is better than no email.
 */
export async function gstEmailSubjectForMatter(taskId, now = Date.now()) {
  if (!taskId) return null;
  const hit = subjects.get(taskId);
  if (hit && now - hit.at < SUBJECT_TTL_MS) return hit.subject;
  let subject = null;
  try {
    const snap = await getDb().collection('tasks').doc(taskId).get();
    if (snap.exists) {
      const task = { id: snap.id, ...snap.data() };
      if (isGstReturnMatter(task, await gstReturnServiceKeys())) {
        const clients = task.clientUid ? await readClients([task.clientUid]) : new Map();
        subject = await gstEmailSubjectFor(task, clients.get(task.clientUid) ?? null);
      }
    }
  } catch (err) {
    logger.warn({ err, taskId }, '#219 could not work out the GST subject of a matter email');
    return null; // not cached: the next email tries again
  }
  if (subjects.size > 500) subjects.clear();
  subjects.set(taskId, { at: now, subject });
  return subject;
}
