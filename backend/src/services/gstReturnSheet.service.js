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
 *   step columns         "Yes" once the task whose name says so is completed — see STEP_RULES;
 *                        the two filing dates are the date staff SAVED on that filing task
 *                        (#294, "Add Filing Date"), never its completion day
 *
 * MATTER → SHEET ONLY. Values flow from the matter to its row; nothing typed in
 * the sheet is ever written back to a matter. Which row is a matter's: see
 * `rowFitsMatter` / `pickMatterRow` (#294, the wrong-record fix).
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

const isFrequency = (f) => f === 'monthly' || f === 'quarterly';

/**
 * Monthly or quarterly, for one GST return matter. In order:
 *   1. the period the GST sweep stamped (`filingPeriod.frequency`);
 *   2. the frequency frozen on the matter when it was created (`gstFrequency`,
 *      #219 follow-up of 16 Nov): what the person chose, so changing the
 *      client's setting or the matter's "Repeats" later never turns a quarter
 *      into a month (a copy carries its source's);
 *   3. the matter's "Repeats" (`recurrence`), the Monthly / Quarterly a person
 *      picks in Create Matter: read for matters opened before (2) existed;
 *   4. a quarterly service (its key, or its key or name says "quarter");
 *   5. the client's own GST setting.
 *
 * ROOT CAUSE of "a quarterly matter shows as monthly" (firm, 16 Nov): the only
 * Monthly / Quarterly a person picks when creating a matter is "Repeats", and
 * this rule never read it. A matter on the GST Return Filing service for a
 * client without the Quarterly setting fell through to 'monthly', so its tag,
 * its emails and its sheet row all named a month.
 */
export function frequencyOf(task, client) {
  return frequencyOfMatter(task) ?? (client?.gstReturnFrequency === 'quarterly' ? 'quarterly' : 'monthly');
}

/** Steps 1–4 of `frequencyOf`: the frequency the matter itself says, or null (then the client's setting decides). */
export function frequencyOfMatter(task) {
  const f = task?.filingPeriod?.frequency;
  if (isFrequency(f)) return f;
  if (isFrequency(task?.gstFrequency)) return task.gstFrequency;
  if (isFrequency(task?.recurrence)) return task.recurrence;
  if (task?.serviceKey === GST_SERVICE_KEYS.quarterly
    || /quarter/i.test(`${task?.serviceKey ?? ''} ${task?.serviceName ?? ''}`)) return 'quarterly';
  return null;
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

/**
 * #219 (firm, 16 Nov) — the subject of EVERY email about a GST return matter,
 * to the client and to staff alike: the subject its first email carries,
 * "<Company Name> - GST Return - <Month Year | Qn YYYY-YY>" — the firm's own
 * GST template subject (Settings → Email templates), filled for this matter
 * exactly as for the first email (gstMatterTags.service.js, `gstEmailSubjectFor`).
 * This is the built-in format, used when that template cannot be rendered.
 * `first` is `gstFirstEmail`'s result.
 */
export function gstSubjectFallback(first) {
  return first ? `${companyNameOf(first.client)} - GST Return - ${first.period.title}` : null;
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
 * Who and which return a matter's row is for — the three cells that identify a
 * row (with the sheet, from `frequency`). The same values `deriveRow` writes.
 *   → { frequency, client_name, gstin, period }
 */
export function matterIdentityOf({ task, client }) {
  const frequency = frequencyOf(task, client);
  return {
    frequency,
    client_name: str(task?.organisation) || str(client?.businessName) || str(client?.organisation) || str(task?.clientName) || str(client?.name),
    gstin: str(client?.gstNumber)?.toUpperCase() ?? null,
    period: periodOf(task, frequency),
  };
}

/* ── #294 (firm, 17 Nov): which row is a matter's ────────────────────────
 *
 * ROOT CAUSE of "the sheet updates the wrong record for a matter". A row was
 * tied to a matter (`sourceMatterId`) in two ways: by the sync itself, and by a
 * PERSON picking a matter in the row's Matter cell (or a row's Matter cell being
 * changed). The second had no check at all: any GST matter could be picked on
 * any row — another client's, another month's or quarter's — and a matter that
 * already had its own row could be picked on a second one. The sync then took
 * whichever linked row Firestore listed first and, because a person-linked row
 * had never been synced, wrote EVERY cell the workflow knows over it (client
 * name, GSTIN, period, statuses, dates): the matter's data landed on another
 * client's or another period's row (and a matter with two linked rows wrote to
 * whichever the query happened to return first). Adoption (a typed row taken
 * over for the same GSTIN + period) could likewise take a row typed for a
 * different company: GSTIN comes from the client's profile, and one client
 * login can hold matters for several organisations.
 *
 * THE RULE NOW. A matter only ever writes to a row that is its own:
 *   - a row the sync has already written FROM THIS matter (`derived.matter`) —
 *     even if a person has since typed over a cell (last change wins);
 *   - otherwise a row whose GSTIN, Return Period and client name are each blank
 *     or the matter's own (`rowFitsMatter`): a row a person linked through the
 *     Matter cell, or a typed / uploaded row the sync adopts.
 * Linking is checked when a person sets the Matter cell (worksheets.controller,
 * `checkMatterLink`) and again on every sync, which RELEASES a wrong link
 * instead of writing to it (`pickMatterRow`).
 */

const idNorm = (v) => String(v ?? '').toUpperCase().replace(/\s+/g, '');
const NAME_NOISE = /\b(m\s*\/\s*s|messrs|the|private|pvt|limited|ltd|llp|opc|co|company|and)\b/g;
const nameNorm = (v) => String(v ?? '').toLowerCase().replace(/&/g, ' ').replace(NAME_NOISE, ' ').replace(/[^a-z0-9]+/g, '');

/** Two client names name the same business (spelling of "Pvt Ltd", "M/s", case and spaces aside). Blank agrees with anything. */
export function namesAgree(a, b) {
  const x = nameNorm(a);
  const y = nameNorm(b);
  if (!x || !y) return true;
  return x === y || x.includes(y) || y.includes(x);
}

/**
 * Is this row (its `values`) for the matter whose identity is `want`
 * (`matterIdentityOf`, or `deriveRow`'s values)? Each of GSTIN, Return Period
 * and client name is blank in the row or the matter's own.
 */
export function rowFitsMatter(row, want) {
  const values = row?.values ?? {};
  const fits = (field, same) => {
    const have = values[field];
    if (have == null || String(have).trim() === '') return true;
    return want?.[field] != null && same(have, want[field]);
  };
  return fits('gstin', (a, b) => idNorm(a) === idNorm(b))
    && fits('period', (a, b) => idNorm(a) === idNorm(b))
    && fits('client_name', namesAgree);
}

/**
 * Of the rows linked to one matter (`[{ id, data }]`), the one the sync writes
 * to, and the ones whose link is released. A row the sync has written before
 * from this matter stays the matter's even if a person has since typed over its
 * period or GSTIN — that is their correction, last change wins. A row linked
 * but never synced (a person picked the matter in its Matter cell) is kept only
 * if it fits the matter (`rowFitsMatter`). Of several, the sync's own row
 * first, then one synced before, then the oldest — deterministic, so the same
 * row is chosen on every run.
 *   → { keep: row | null, release: row[] }
 */
export function pickMatterRow(rows, want) {
  // "Synced before" means synced FROM THIS matter (`derived.matter`): a row
  // whose Matter cell was switched from another matter is checked like a new link.
  const syncedHere = (r) => !!r.data?.derived && want?.matter != null && r.data.derived.matter === want.matter;
  const rank = (r) => [r.data?.source === 'matter' ? 0 : 1, syncedHere(r) ? 0 : 1, r.data?.createdAt ?? '', r.id ?? ''];
  const cmp = (a, b) => {
    const x = rank(a); const y = rank(b);
    for (let i = 0; i < x.length; i += 1) {
      if (x[i] < y[i]) return -1;
      if (x[i] > y[i]) return 1;
    }
    return 0;
  };
  const keep = (rows ?? []).filter((r) => syncedHere(r) || rowFitsMatter(r.data, want)).sort(cmp)[0] ?? null;
  return { keep, release: (rows ?? []).filter((r) => r !== keep) };
}

/**
 * A person sets a row's Matter cell (create or edit). Allowed only when the
 * matter is a return of this sheet's kind, the row is for the matter's client
 * and period (`rowFitsMatter`), and the matter has no other row. `otherRowIds`
 * are rows already linked to that matter. Returns null, or { status, message }.
 */
export function checkMatterLink({ sheetFrequency, row, identity, otherRowIds = [] }) {
  if (sheetFrequency && identity.frequency && sheetFrequency !== identity.frequency) {
    return { status: 400, message: `That matter is a ${identity.frequency} return. Link it from the ${identity.frequency === 'quarterly' ? 'Quarterly' : 'Monthly'} sheet.` };
  }
  if (!rowFitsMatter(row, identity)) {
    const what = [identity.client_name, identity.period].filter(Boolean).join(' — ') || 'another client or period';
    return { status: 409, message: `That matter is for ${what}, not this row's client and return period. Pick the matter of this row's client and period.` };
  }
  if (otherRowIds.length) return { status: 409, message: 'That matter already has its own row in this sheet.' };
  return null;
}

/**
 * The derived values of one matter's row.
 *   task:  the matter document (with its id)
 *   client: the client's user document, or null
 *   steps: the matter's step documents ({ stepNumber, title, status, completedAt, assignedTo })
 *   names: Map uid → display name, for the current task's assignee
 * Returns { frequency, values } — `values` has every DERIVED_FIELDS key (null = blank).
 */
export function deriveRow({ task, client, steps = [], names = new Map(), manualFrom = null }) {
  const { frequency, ...identity } = matterIdentityOf({ task, client });
  const current = steps.find((s) => s.stepNumber === task.currentStepNumber) ?? null;
  const assignee = current?.assignedTo ? names.get(current.assignedTo) ?? null : null;
  const live = task.status === 'active' || task.status === 'pending';
  const values = {
    client_name: identity.client_name,
    constitution: CONSTITUTION[client?.entityType] ?? null,
    gstin: identity.gstin,
    data_email: str(client?.email),
    contact_no: str(client?.mobile) || str(client?.phone),
    assign_person: (live ? assignee : null) || str(task.professionalName),
    current_status: STATUS_TEXT[task.status] ?? (live ? str(current?.title) || 'In progress' : str(task.status)),
    completion_check: task.status === 'completed' ? 'Done' : null,
    period: identity.period,
    matter: task.id ?? null,
  };
  for (const rule of STEP_RULES) {
    const step = stepForRule(rule, steps);
    // #294 (firm, 17 Nov): a filing date is the date staff SAVED on the filing
    // task ("Add Filing Date"), shown as soon as it is saved — never the day the
    // task was ticked. The "Yes" columns still follow completion.
    values[rule.field] = rule.kind === 'date' ? filedOnDateOf(step, { manualFrom })
      : isDone(step) ? 'Yes' : null;
  }
  for (const k of DERIVED_FIELDS) if (values[k] === undefined || values[k] === '') values[k] = null;
  return { frequency, values };
}

/**
 * #294 — the two filing tasks that carry a filing date ("Filed on: 11 November
 * 2026"). The SAME rules that fill the sheet's "Date of GSTR-1 Filing" /
 * "Date of GSTR-3B Filing" columns, so the matter and the sheet can never
 * disagree about which task is the filing.
 */
export const FILING_DATE_FIELDS = { gstr1_date: 'GSTR-1', gstr3b_date: 'GSTR-3B' };

/** Is this matter a GST return matter? Opened by the GST sweep (#219), or of a service linked to the sheet (#279). */
export function isGstReturnMatter(task, linkedServices = []) {
  return !!task?.filingPeriod?.title || (!!task?.serviceKey && linkedServices.includes(task.serviceKey));
}

/**
 * #292 / #294 — what a GST return matter shows: its filing period (#292,
 * "September 2026" or "Q2 2026-27"), and each filing task the matter has
 * REACHED (or that has a saved date), with its saved filing date or null (#294:
 * the matter offers "Add Filing Date" for those). Pure; `steps` must carry the
 * INTERNAL task names (match before the client's projection renames them).
 * Returns null for any other matter.
 *   → { period, frequency, filings: [{ stepNumber, form, date, status }],
 *       filedOn: the filings that have a date }
 */
export function gstMatterTags({ task, steps = [], client = null, linkedServices = [], manualFrom = null }) {
  if (!isGstReturnMatter(task, linkedServices)) return null;
  const filings = [];
  for (const { form, step } of filingSteps(steps)) {
    const date = filedOnDateOf(step, { manualFrom });
    if (date || isReached(step)) filings.push({ stepNumber: step.stepNumber, form, date, status: step.status ?? null });
  }
  const frequency = frequencyOf(task, client);
  return { period: periodOf(task, frequency), frequency, filings, filedOn: filings.filter((f) => f.date) };
}

/* ── #294 (firm, 17 Nov): the filing date is ENTERED, never derived ───────
 *
 * When the matter reaches the GSTR-1 or GSTR-3B filing task, staff save the
 * date the return was actually filed ("Add Filing Date"), then complete the
 * task. The date is stored ON THE STEP as `filingDate`
 * { date: 'YYYY-MM-DD' | null, previous, byUid, byRole, at } and is the only
 * date shown — completing the task never sets one, and completing without one
 * is allowed (the matter simply shows no date until one is added). Once the
 * field exists it is authoritative: `date: null` means staff removed it.
 *
 * EXISTING MATTERS. Before this rule, the date was the day the task was
 * completed (or a staff correction of it, `filedOnCorrection`). A filing task
 * completed BEFORE the rule went live (`manualFrom`, recorded once in
 * `system/gstFilingDates` — gstMatterTags.service.js) and never given a
 * `filingDate` keeps that date, read exactly as before, so nothing anyone has
 * seen disappears; saving a date replaces it. A task completed after the rule
 * went live has no date until one is saved.
 */

/** A task the matter has got to: in progress, waiting, or done (not one still ahead, nor one skipped). */
export const isReached = (s) => !!s && ['active', 'blocked', 'completed'].includes(s.status);

const activeCorrection = (step) => {
  const c = step?.filedOnCorrection;
  return isDone(step) && c?.date && c.forCompletedAt && c.forCompletedAt === step.completedAt ? c : null;
};

/** The pre-rule date of a filing task completed before `manualFrom`: its correction, else its completion day. Null otherwise. */
export function legacyFiledOnOf(step, manualFrom) {
  if (!isDone(step) || !step.completedAt || !manualFrom) return null;
  const done = new Date(step.completedAt).getTime();
  const from = new Date(manualFrom).getTime();
  if (Number.isNaN(done) || Number.isNaN(from) || done >= from) return null;
  return activeCorrection(step)?.date ?? dateOnly(step.completedAt);
}

const hasSavedDate = (step) => !!step?.filingDate && typeof step.filingDate === 'object';

/**
 * THE filing date of a filing task — the one function the matter's "Filed on"
 * tag AND the sheet's "Date of GSTR-1/3B Filing" cells read: the date staff
 * saved, else (a task completed before the rule, see above) the date it showed
 * before; otherwise null.
 */
export function filedOnDateOf(step, { manualFrom = null } = {}) {
  if (!step) return null;
  if (hasSavedDate(step)) return isCalendarDate(step.filingDate.date) ? step.filingDate.date : null;
  return legacyFiledOnOf(step, manualFrom);
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
 * Who may save a filing date: internal staff who work the matter. Admin and
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
 * #294 — check a filing date staff save on a filing task. `date` null = remove
 * the saved date. Allowed once the matter has reached the task (in progress or
 * completed), within `filedOnBounds`. Returns { ok: true, step, form, from, to }
 * or { ok: false, status, message } (messages are shown to staff as they are).
 */
export function checkFilingDate({ task, steps, stepNumber, date, frequency, linkedServices, manualFrom = null, now = new Date() }) {
  if (!isGstReturnMatter(task, linkedServices)) {
    return { ok: false, status: 400, message: 'Filing dates are kept only on GST return matters.' };
  }
  const hit = filingSteps(steps).find((x) => x.step.stepNumber === stepNumber);
  if (!hit) return { ok: false, status: 400, message: 'Only the GSTR-1 and GSTR-3B filing tasks have a filing date.' };
  if (!isReached(hit.step)) return { ok: false, status: 409, message: `The matter has not reached the ${hit.form} filing task yet.` };
  const from = filedOnDateOf(hit.step, { manualFrom });
  if (date != null) {
    if (!isCalendarDate(date)) return { ok: false, status: 400, message: 'Enter a valid date.' };
    const { min, max } = filedOnBounds(task, frequency, now);
    if (date > max) return { ok: false, status: 400, message: 'The filing date cannot be in the future.' };
    if (min && date < min) return { ok: false, status: 400, message: `The filing date cannot be before ${longDay(min)}, when this return's period ended.` };
  }
  return { ok: true, step: hit.step, form: hit.form, from, to: date ?? null };
}

/** The history line for a saved filing date. */
export function filingDateComment(form, from, to) {
  if (!to) return `${form} filing date removed (was ${longDay(from)}).`;
  if (!from) return `${form} filing date set to ${longDay(to)}.`;
  return `${form} filing date changed from ${longDay(from)} to ${longDay(to)}.`;
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
