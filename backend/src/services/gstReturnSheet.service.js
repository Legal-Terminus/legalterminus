/**
 * #279 — GST Return Filing sheet: how a GST return MATTER becomes a ROW. Pure:
 * no Firestore here (the sync in gstReturnSheetSync.service.js reads and
 * writes); every rule below is unit-tested in __tests__/gstReturnSheet.test.js.
 *
 * A row is one client's GST return for one period (a month, or a financial-year
 * quarter). A matter of a linked GST service ("GST Return Filing (Monthly)" and
 * its quarterly twin by default) gives one row, in the Monthly or the Quarterly
 * sheet. What the row takes from the workflow:
 *
 *   GST Return Clients   the matter's organisation, else the client's business name / name
 *   CONSTITUTION         the client's entity type (Private/Public Limited → Company)
 *   GSTN No              the client's GST number
 *   Mail ID / Contact    the client's email and mobile
 *   Assign Person        the name of whoever holds the matter's current task, else its professional
 *   Current Status       the current task's name, or Awaiting approval / Completed / Stopped …
 *   step columns         "Yes" (or the date, for the two filing dates) once the task whose
 *                        name says so is completed — see STEP_RULES
 *   Completion Check     "Done" when the matter is completed
 *   Return Period        the matter's GST period ("October 2026", "Q2 2026-27")
 *   Matter               a link to the matter
 *
 * GST User ID, GST Pswd and Remarks are never derived: only people type them.
 *
 * LAST CHANGE WINS. Staff may type over any cell. The sync remembers what the
 * workflow last said for each derived column (`derived`) and writes a cell only
 * when the WORKFLOW's value changes — so a person's correction stays until the
 * workflow moves on, and a workflow update always shows.
 */
import { duePeriod, indiaDate, companyNameOf, GST_SERVICE_KEYS, GST_TEMPLATE_KEYS } from '../../../shared/workflows/gstReturns.js';

/** The client profile's entity types (clientProfile.service.js) as the firm's Constitution choices. */
const CONSTITUTION = {
  proprietorship: 'Proprietorship', partnership: 'Partnership', llp: 'LLP',
  pvt_ltd: 'Company', public: 'Company', trust: 'Trust', society: 'Society', individual: 'Individual',
};

/** "GSTR-1 Filed" → "gstr1filed": the form steps are matched on. */
export const normalizeTitle = (t) => String(t ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Which task of the workflow fills which column. Services are editable and the
 * firm names its own tasks, so a column is filled from the FIRST task (in step
 * order) whose name contains every word of one of `any`, and none of `none`
 * (matched on the name lower-cased with spaces and punctuation removed, so
 * "GSTR 1 filed", "GSTR-1 Filed" and "gstr1 filing" are the same). A workflow
 * with no such task simply leaves the column to be typed.
 */
/** Words that make a task NOT the filing itself (the mail after it, the data or preparation before it). */
const FILING_NONE = ['mail', 'data', 'receiv', 'collect', 'prepar', 'reminder'];

/**
 * The GST forms a (normalised) task name names, in the order it names them:
 * "GSTR-1 filed, proceed towards GSTR-3B filing" → ['gstr1', 'gstr3b'];
 * "GSTR 1 & 3B filing" ("gstr13bfiling") → ['gstr1', 'gstr3b']; "GSTR-3B filed" → ['gstr3b'].
 */
export function formsNamed(norm) {
  const out = [];
  const add = (f) => { if (!out.includes(f)) out.push(f); };
  const re = /gstr(?:(1)(3b)?(?![0-9])|(3b))|(3b)/g;
  let m;
  while ((m = re.exec(norm))) {
    if (m[1]) { add('gstr1'); if (m[2]) add('gstr3b'); } else add('gstr3b');
  }
  return out;
}

export const STEP_RULES = [
  { field: 'data_received', kind: 'yes', any: [['data', 'receiv'], ['data', 'collect']], none: ['additional', 'confirmation'] },
  { field: 'tally_prepared', kind: 'yes', any: [['tally'], ['excel', 'prepar']], none: ['annual'] },
  // #279 (firm, 11 Nov): a GSTR-1 date showed under GSTR-3B. The two date rules
  // now also need the task to name THEIR form first (`form`, see formsNamed), never
  // take a data / preparation / reminder task, and prefer a task that says "filed".
  { field: 'gstr1_date', kind: 'date', form: 'gstr1', any: [['gstr1', 'fil']], none: FILING_NONE },
  { field: 'gstr1_mail', kind: 'yes', any: [['gstr1', 'mail']] },
  { field: 'gstr2b_mail', kind: 'yes', any: [['2b', 'reco'], ['2b', 'mail']] },
  { field: 'additional_data', kind: 'yes', any: [['additional'], ['confirmation']] },
  { field: 'challan_mail', kind: 'yes', any: [['challan', 'mail'], ['challan', 'sent'], ['challan', 'shar']] },
  { field: 'challan_paid', kind: 'yes', any: [['challan', 'paid'], ['challan', 'payment']], none: ['mail', 'sent', 'shar'] },
  { field: 'annual_sheet', kind: 'yes', any: [['annual', 'sheet'], ['annual', 'working']] },
  { field: 'gstr3b_date', kind: 'date', form: 'gstr3b', any: [['gstr3b', 'fil']], none: FILING_NONE },
];

/** Every column the workflow fills. The rest (user id, password, remarks) are people's. */
export const DERIVED_FIELDS = [
  'client_name', 'constitution', 'gstin', 'data_email', 'contact_no', 'assign_person', 'current_status',
  ...STEP_RULES.map((r) => r.field), 'completion_check', 'period', 'matter',
];

const ruleMatches = (rule, norm) => rule.any.some((words) => words.every((w) => norm.includes(w)))
  && !(rule.none ?? []).some((w) => norm.includes(w))
  // A filing-date rule takes only a task whose name names ITS form first: a task
  // about GSTR-1 never fills the GSTR-3B date, whatever else its name mentions.
  && (!rule.form || formsNamed(norm)[0] === rule.form);

/**
 * Flow order: a step's `position` in the service's AUTHORED order when the
 * caller supplied it (`withAuthoredOrder`), else its step number. Step numbers
 * are identity, not flow (#55): a task added later in the editor keeps a high
 * number wherever it sits.
 */
const flowOrder = (a, b) => (a.position ?? Infinity) - (b.position ?? Infinity) || (a.stepNumber ?? 0) - (b.stepNumber ?? 0);

/**
 * The step a rule picks: the first in flow order whose title matches. For the
 * two filing dates, a task that says "filed" wins over one that only says
 * "filing" ("Proceed towards GSTR-1 filing" before "GSTR-1 filed").
 */
export function stepForRule(rule, steps) {
  const hits = [...(steps ?? [])].sort(flowOrder).filter((s) => ruleMatches(rule, normalizeTitle(s.title)));
  if (rule.kind === 'date') return hits.find((s) => normalizeTitle(s.title).includes('filed')) ?? hits[0] ?? null;
  return hits[0] ?? null;
}

/** Steps with `position` = their index in the service's authored step list (missing ones keep none). */
export function withAuthoredOrder(steps, definitionSteps) {
  if (!Array.isArray(definitionSteps) || !definitionSteps.length) return steps ?? [];
  const pos = new Map(definitionSteps.map((d, i) => [d.stepNumber, i]));
  return (steps ?? []).map((s) => (pos.has(s.stepNumber) ? { ...s, position: pos.get(s.stepNumber) } : s));
}

/** Monthly or quarterly: the GST period the sweep stamped, else the service, else the client's setting. */
export function frequencyOf(task, client) {
  const f = task?.filingPeriod?.frequency;
  if (f === 'monthly' || f === 'quarterly') return f;
  if (task?.serviceKey === GST_SERVICE_KEYS.quarterly) return 'quarterly';
  return client?.gstReturnFrequency === 'quarterly' ? 'quarterly' : 'monthly';
}

/**
 * The period a matter is for. A matter opened by the GST sweep (#219) carries it.
 * One opened by hand does not: it is taken to be for the period that had just
 * ended when it was opened (a return is filed after its period), the same rule
 * the sweep uses — a matter opened on 15 Nov is October's (or Q2's).
 */
export function periodOf(task, frequency) {
  return periodObjectOf(task, frequency)?.title ?? null;
}

/**
 * The whole period object ({ frequency, key, month, title, label } — `duePeriod`'s
 * shape): the sweep's `filingPeriod`, else the period that had ended when the
 * matter was opened. The one rule behind the Return Period, the Filing Month tag,
 * the correction bounds and the first email's subject.
 */
export function periodObjectOf(task, frequency) {
  if (task?.filingPeriod?.title) return { frequency, ...task.filingPeriod };
  const at = task?.createdAt ? new Date(task.createdAt) : null;
  if (!at || Number.isNaN(at.getTime())) return null;
  return duePeriod(frequency, indiaDate(at));
}

/**
 * #219 (firm, 11 Nov) — the FIRST email of a GST return matter opened by hand
 * (or as a copy) is the GST data-request email, with the subject
 * "<Company Name> - GST Return - <period>", exactly as the sweep sends it.
 * Returns null for any other matter (it keeps the "matter created" email), or
 * { templateKey, period, client } — `client` with the matter's organisation
 * first, so `companyNameOf` (the sweep's rule) names the company the matter is for.
 */
export function gstFirstEmail({ task, client, linkedServices = [] }) {
  if (!isGstReturnMatter(task, linkedServices)) return null;
  const frequency = frequencyOf(task, client);
  const period = periodObjectOf(task, frequency);
  if (!period) return null;
  const forName = { ...(client ?? {}), organisation: task.organisation || client?.organisation || '' };
  if (!companyNameOf(forName)) return null;
  return { templateKey: GST_TEMPLATE_KEYS[period.frequency] ?? GST_TEMPLATE_KEYS[frequency], period, client: forName };
}

const STATUS_TEXT = {
  pending_admin_approval: 'Awaiting approval',
  completed: 'Completed',
  cancelled: 'Stopped',
  rejected: 'Rejected',
  archived: 'Archived',
};

const isDone = (s) => s?.status === 'completed';

/**
 * The derived values of one matter's row.
 *   task:  the matter document (with its id)
 *   client: the client's user document, or null
 *   steps: the matter's step documents ({ stepNumber, title, status, completedAt, assignedTo })
 *   names: Map uid → display name, for the current task's assignee
 * Returns { frequency, values } — `values` has every DERIVED_FIELDS key (null = blank).
 */
export function deriveRow({ task, client, steps = [], names = new Map() }) {
  const frequency = frequencyOf(task, client);
  const current = steps.find((s) => s.stepNumber === task.currentStepNumber) ?? null;
  const assignee = current?.assignedTo ? names.get(current.assignedTo) ?? null : null;
  const live = task.status === 'active' || task.status === 'pending';
  const values = {
    client_name: str(task.organisation) || str(client?.businessName) || str(client?.organisation) || str(task.clientName) || str(client?.name),
    constitution: CONSTITUTION[client?.entityType] ?? null,
    gstin: str(client?.gstNumber)?.toUpperCase() ?? null,
    data_email: str(client?.email),
    contact_no: str(client?.mobile) || str(client?.phone),
    assign_person: (live ? assignee : null) || str(task.professionalName),
    current_status: STATUS_TEXT[task.status] ?? (live ? str(current?.title) || 'In progress' : str(task.status)),
    completion_check: task.status === 'completed' ? 'Done' : null,
    period: periodOf(task, frequency),
    matter: task.id ?? null,
  };
  for (const rule of STEP_RULES) {
    const step = stepForRule(rule, steps);
    values[rule.field] = !isDone(step) ? null
      : rule.kind === 'date' ? filedOnDateOf(step)
      : 'Yes';
  }
  for (const k of DERIVED_FIELDS) if (values[k] === undefined || values[k] === '') values[k] = null;
  return { frequency, values };
}

/**
 * #294 — the two filing tasks whose completion date is shown on the matter
 * ("Filed on: 11 November 2026"). The SAME rules that fill the sheet's "Date of
 * GSTR-1 Filing" / "Date of GSTR-3B Filing" columns, so the matter and the sheet
 * can never disagree about which task is the filing.
 */
export const FILING_DATE_FIELDS = { gstr1_date: 'GSTR-1', gstr3b_date: 'GSTR-3B' };

/** Is this matter a GST return matter? Opened by the GST sweep (#219), or of a service linked to the sheet (#279). */
export function isGstReturnMatter(task, linkedServices = []) {
  return !!task?.filingPeriod?.title || (!!task?.serviceKey && linkedServices.includes(task.serviceKey));
}

/**
 * #292 / #294 — what a GST return matter shows: its filing period (#292,
 * "September 2026" or "Q2 2026-27"), and for each of the two filing tasks that
 * is completed, its India completion date (#294). Pure; `steps` must carry the
 * INTERNAL task names (match before the client's projection renames them).
 * Returns null for any other matter.
 * The date is `filedOnDateOf` — a staff correction, else the completion date.
 *   → { period, frequency, filedOn: [{ stepNumber, form, date, completedOn, corrected }] }
 */
export function gstMatterTags({ task, steps = [], client = null, linkedServices = [] }) {
  if (!isGstReturnMatter(task, linkedServices)) return null;
  const filedOn = [];
  for (const rule of STEP_RULES) {
    const form = FILING_DATE_FIELDS[rule.field];
    if (!form) continue;
    const step = stepForRule(rule, steps);
    const date = filedOnDateOf(step);
    if (date) {
      filedOn.push({
        stepNumber: step.stepNumber, form, date,
        completedOn: dateOnly(step.completedAt), corrected: !!activeCorrection(step),
      });
    }
  }
  const frequency = frequencyOf(task, client);
  return { period: periodOf(task, frequency), frequency, filedOn };
}

/* ── #294 follow-up: correcting a filing date ─────────────────────────────
 *
 * Staff tick a filing task when they get to it, not always the day the return
 * was filed. A correction is stored ON THE STEP as `filedOnCorrection`
 * { date, forCompletedAt, byUid, at, previous } and `completedAt` is never
 * touched. It belongs to ONE completion: `forCompletedAt` is the completedAt it
 * corrected, so a reopened and re-completed task (new completedAt) shows its new
 * completion date and the old correction is simply no longer read.
 */

const activeCorrection = (step) => {
  const c = step?.filedOnCorrection;
  return isDone(step) && c?.date && c.forCompletedAt && c.forCompletedAt === step.completedAt ? c : null;
};

/**
 * THE filing date of a filing task — the one function the matter's "Filed on"
 * tag AND the sheet's "Date of GSTR-1/3B Filing" cells read: the staff
 * correction for this completion, else the India date of completion; null
 * while the task is not completed.
 */
export function filedOnDateOf(step) {
  if (!isDone(step)) return null;
  return activeCorrection(step)?.date ?? dateOnly(step.completedAt);
}

/** The two filing tasks of a workflow: [{ field, form, step }] — only those the workflow has. */
export function filingSteps(steps) {
  return STEP_RULES.filter((r) => FILING_DATE_FIELDS[r.field])
    .map((r) => ({ field: r.field, form: FILING_DATE_FIELDS[r.field], step: stepForRule(r, steps) }))
    .filter((x) => x.step);
}

const pad2 = (n) => String(n).padStart(2, '0');

/** Last month of the matter's GST period, 'YYYY-MM' (the sweep's, else the period that had ended when it was opened). */
export function periodEndMonthOf(task, frequency) {
  const m = periodObjectOf(task, frequency)?.month;
  return /^\d{4}-\d{2}$/.test(m ?? '') ? m : null;
}

/**
 * The dates a filing date may be corrected to (inclusive, 'YYYY-MM-DD'):
 *   min  the 1st of the month after the GST period ends — a return is filed
 *        after its period (September's from 1 October); if the period cannot be
 *        told, the day the matter was opened
 *   max  today in India — never a date in the future
 */
export function filedOnBounds(task, frequency, now = new Date()) {
  const max = indiaDate(now);
  const end = periodEndMonthOf(task, frequency);
  let min = null;
  if (end) {
    const [y, m] = end.split('-').map(Number);
    min = m === 12 ? `${y + 1}-01-01` : `${y}-${pad2(m + 1)}-01`;
  } else if (task?.createdAt && !Number.isNaN(new Date(task.createdAt).getTime())) {
    min = indiaDate(new Date(task.createdAt));
  }
  return { min, max };
}

/**
 * Who may correct a filing date: internal staff who work the matter. Admin and
 * manager on any matter (they see every matter); a team member on a matter they
 * own or hold a task of — the same matters their list shows them. Never a
 * client or a professional.
 */
export function canCorrectFiledOn(user, task, steps = []) {
  const role = user?.role;
  if (role === 'admin' || role === 'manager') return true;
  if (role !== 'team_member' || !user?.uid) return false;
  if (task?.assignedTo === user.uid) return true;
  return steps.some((s) => {
    const owners = Array.isArray(s.assignedToUids) && s.assignedToUids.length ? s.assignedToUids : (s.assignedTo ? [s.assignedTo] : []);
    return owners.includes(user.uid);
  });
}

/** A real calendar date 'YYYY-MM-DD' (2026-02-30 is not). */
export function isCalendarDate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v ?? ''));
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
}

/**
 * Check a correction against the matter. `date` null = go back to the
 * completion date. Returns { ok: true, step, form, from, to } or
 * { ok: false, status, message } (messages are shown to staff as they are).
 */
export function checkFiledOnCorrection({ task, steps, stepNumber, date, frequency, linkedServices, now = new Date() }) {
  if (!isGstReturnMatter(task, linkedServices)) {
    return { ok: false, status: 400, message: 'Filing dates are kept only on GST return matters.' };
  }
  const hit = filingSteps(steps).find((x) => x.step.stepNumber === stepNumber);
  if (!hit) return { ok: false, status: 400, message: 'Only the GSTR-1 and GSTR-3B filing tasks have a filing date.' };
  if (!isDone(hit.step)) return { ok: false, status: 409, message: `Complete the ${hit.form} filing task first.` };
  const from = filedOnDateOf(hit.step);
  if (date != null) {
    if (!isCalendarDate(date)) return { ok: false, status: 400, message: 'Enter a valid date.' };
    const { min, max } = filedOnBounds(task, frequency, now);
    if (date > max) return { ok: false, status: 400, message: 'The filing date cannot be in the future.' };
    if (min && date < min) return { ok: false, status: 400, message: `The filing date cannot be before ${longDay(min)}, when this return's period ended.` };
  }
  return { ok: true, step: hit.step, form: hit.form, from, to: date ?? dateOnly(hit.step.completedAt) };
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
/** '2026-11-11' → '11 November 2026'. */
export function longDay(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
  return m ? `${Number(m[3])} ${MONTH_NAMES[Number(m[2]) - 1]} ${m[1]}` : String(iso ?? '');
}

/**
 * The sheet side of the one-source rule. On a row synced from a matter, a
 * filing-date cell the WORKFLOW fills (its `derived` value is set — the matter
 * has that task and it is completed) is the matter's: it is corrected on the
 * matter, not typed in the sheet, so the two can never disagree. Returns the
 * fields of `patch` that must be refused (typed edit) or dropped (upload).
 * A row with no matter, or a matter whose workflow has no such task yet, keeps
 * the cell typable as before.
 */
export function matterOwnedDateFields(record, patch) {
  if (!record?.sourceMatterId) return [];
  return Object.keys(FILING_DATE_FIELDS).filter((f) => Object.hasOwn(patch ?? {}, f)
    && record.derived?.[f] != null && (patch[f] ?? null) !== (record.values?.[f] ?? null));
}

function str(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s || null;
}

/** A completion time as the firm's (India) calendar date. */
function dateOnly(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : indiaDate(d);
}

/**
 * Last change wins. Given what a record holds (`values`) and what the workflow
 * said last time (`derived`, absent for a record never synced), and what the
 * workflow says now (`next`), return the cells to write and the new `derived`.
 * A cell is written only where the workflow's value CHANGED; a person's edit to
 * a cell the workflow has not changed since is kept.
 */
export function mergeDerived({ values = {}, derived } = {}, next) {
  const before = derived ?? {};
  const set = {};
  const nextDerived = {};
  for (const k of DERIVED_FIELDS) {
    const now = next[k] ?? null;
    nextDerived[k] = now;
    const was = Object.hasOwn(before, k) ? before[k] ?? null : null;
    // First sync of a record: what the workflow knows fills it in, but it
    // never blanks a cell a person filled (the workflow knows nothing there yet).
    if (now !== was && !(now == null && !derived)) set[k] = now;
  }
  const merged = { ...values };
  for (const [k, v] of Object.entries(set)) {
    if (v == null) delete merged[k]; else merged[k] = v;
  }
  const changed = Object.keys(set).some((k) => (values[k] ?? null) !== (set[k] ?? null))
    || DERIVED_FIELDS.some((k) => (before[k] ?? null) !== nextDerived[k]) || !derived;
  return { set, values: merged, derived: nextDerived, changed };
}
