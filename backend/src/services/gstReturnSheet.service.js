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
import { duePeriod, indiaDate, GST_SERVICE_KEYS } from '../../../shared/workflows/gstReturns.js';

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
export const STEP_RULES = [
  { field: 'data_received', kind: 'yes', any: [['data', 'receiv'], ['data', 'collect']], none: ['additional', 'confirmation'] },
  { field: 'tally_prepared', kind: 'yes', any: [['tally'], ['excel', 'prepar']], none: ['annual'] },
  { field: 'gstr1_date', kind: 'date', any: [['gstr1', 'fil']], none: ['mail'] },
  { field: 'gstr1_mail', kind: 'yes', any: [['gstr1', 'mail']] },
  { field: 'gstr2b_mail', kind: 'yes', any: [['2b', 'reco'], ['2b', 'mail']] },
  { field: 'additional_data', kind: 'yes', any: [['additional'], ['confirmation']] },
  { field: 'challan_mail', kind: 'yes', any: [['challan', 'mail'], ['challan', 'sent'], ['challan', 'shar']] },
  { field: 'challan_paid', kind: 'yes', any: [['challan', 'paid'], ['challan', 'payment']], none: ['mail', 'sent', 'shar'] },
  { field: 'annual_sheet', kind: 'yes', any: [['annual', 'sheet'], ['annual', 'working']] },
  { field: 'gstr3b_date', kind: 'date', any: [['gstr3b', 'fil']], none: ['mail'] },
];

/** Every column the workflow fills. The rest (user id, password, remarks) are people's. */
export const DERIVED_FIELDS = [
  'client_name', 'constitution', 'gstin', 'data_email', 'contact_no', 'assign_person', 'current_status',
  ...STEP_RULES.map((r) => r.field), 'completion_check', 'period', 'matter',
];

const ruleMatches = (rule, norm) => rule.any.some((words) => words.every((w) => norm.includes(w)))
  && !(rule.none ?? []).some((w) => norm.includes(w));

/** The step a rule picks: the first, by step number, whose title matches. */
export function stepForRule(rule, steps) {
  return [...(steps ?? [])].sort((a, b) => (a.stepNumber ?? 0) - (b.stepNumber ?? 0))
    .find((s) => ruleMatches(rule, normalizeTitle(s.title))) ?? null;
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
  if (task?.filingPeriod?.title) return task.filingPeriod.title;
  const at = task?.createdAt ? new Date(task.createdAt) : null;
  if (!at || Number.isNaN(at.getTime())) return null;
  return duePeriod(frequency, indiaDate(at))?.title ?? null;
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
      : rule.kind === 'date' ? dateOnly(step.completedAt)
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
 *   → { period: string|null, filedOn: [{ stepNumber, form, date: 'YYYY-MM-DD' }] }
 */
export function gstMatterTags({ task, steps = [], client = null, linkedServices = [] }) {
  if (!isGstReturnMatter(task, linkedServices)) return null;
  const filedOn = [];
  for (const rule of STEP_RULES) {
    const form = FILING_DATE_FIELDS[rule.field];
    if (!form) continue;
    const step = stepForRule(rule, steps);
    const date = isDone(step) ? dateOnly(step.completedAt) : null;
    if (date) filedOn.push({ stepNumber: step.stepNumber, form, date });
  }
  return { period: periodOf(task, frequencyOf(task, client)), filedOn };
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
