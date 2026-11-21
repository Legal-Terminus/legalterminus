/**
 * #279 — GST Return Filing sheet under Reports: its columns, the Monthly /
 * Quarterly split, and how a GST return matter becomes a row (and stays one as
 * the workflow moves on, without losing what staff typed).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODULES, SHEETS, BOOKS } from '../config/worksheetDefinitions.js';
import {
  resolveSheet, bookFields, planImport, sheetRecordKey, applyColumnEdit, applyOptionsEdit,
} from '../services/worksheetEngine.service.js';
import {
  deriveRow, mergeDerived, frequencyOf, periodOf, stepForRule, STEP_RULES, DERIVED_FIELDS, normalizeTitle,
  gstMatterTags, isGstReturnMatter, filedOnDateOf, filedOnBounds, canCorrectFiledOn, checkFilingDate, filingDateComment,
  matterOwnedDateFields, isCalendarDate, formsNamed, withAuthoredOrder,
  rowFitsMatter, pickMatterRow, checkMatterLink, matterIdentityOf, namesAgree,
} from '../services/gstReturnSheet.service.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { filedOnCorrectionSchema } from '../schemas/task.schema.js';
import { requireRole } from '../middleware/auth.middleware.js';

const FIRM_COLUMNS = [
  'GST Return Clients', 'CONSTITUTION', 'GSTN No', 'Mail ID for data collection', 'GST User ID', 'GST Pswd', 'Contact No.',
  'Assign Person', 'Current Status', 'Data Received', 'Tally/ Excel Prepared', 'Date of GSTR-1 Filing', 'GSTR-1 Filed Mail',
  'GSTR_2B Reco Mail to Client', 'Additional Data or Confirmation Received from Client', 'Challan Mail to the client',
  'Challan paid by client', 'Annual Working Sheet Update', 'Date of GSTR-3B Filing', 'Completion Check', 'Remarks',
];
const YELLOW = [
  'CONSTITUTION', 'Assign Person', 'Data Received', 'Tally/ Excel Prepared', 'GSTR-1 Filed Mail', 'GSTR_2B Reco Mail to Client',
  'Additional Data or Confirmation Received from Client', 'Challan Mail to the client', 'Challan paid by client', 'Annual Working Sheet Update',
  // #279 (firm, 11 Nov): Completion Check is a dropdown too.
  'Completion Check',
];

const rule = (field) => STEP_RULES.find((r) => r.field === field);

/* ── Definitions ────────────────────────────────────────────────────────── */

test('one module, Monthly then Quarterly, on one exclusive book', () => {
  assert.deepEqual(MODULES.gst_return.sheets, ['gst_return_monthly', 'gst_return_quarterly']);
  assert.deepEqual(MODULES.gst_return.sheets.map((k) => SHEETS[k].label), ['Monthly', 'Quarterly']);
  assert.equal(BOOKS.gst_return.exclusive, true);
  assert.equal(BOOKS.gst_return.sync, 'gst_matters');
  const m = resolveSheet('gst_return_monthly');
  // A record is in its own sheet only: the two views never mix.
  assert.deepEqual(m.memberships.map((x) => x.key), ['gst_return_monthly']);
  assert.equal(m.serial, true);
  assert.deepEqual(m.source, { kind: 'gst_matters' });
  assert.deepEqual(m.linkedServices, ['gst-returns', 'gst-returns-quarterly']);
});

test('the firm\'s columns in its order; Return Period and Matter added at the end; yellow = dropdown', () => {
  for (const key of MODULES.gst_return.sheets) {
    const s = resolveSheet(key);
    assert.deepEqual(s.columns.map((c) => c.label), [...FIRM_COLUMNS, 'Return Period', 'Matter']);
    assert.deepEqual(s.columns.filter((c) => c.type === 'select').map((c) => c.label), YELLOW);
    assert.deepEqual(s.columns.filter((c) => c.type === 'date').map((c) => c.label), ['Date of GSTR-1 Filing', 'Date of GSTR-3B Filing']);
  }
  const constitution = resolveSheet('gst_return_monthly').columns.find((c) => c.key === 'constitution');
  assert.deepEqual(constitution.options, ['Company', 'Partnership', 'Proprietorship', 'OPC', 'LLP', 'Section 8']);
});

test('Constitution and Assign Person choices are editable, and shared by Monthly and Quarterly', () => {
  const { optionOverrides } = applyOptionsEdit('gst_return_monthly', {}, 'constitution',
    ['Company', 'OPC', 'LLP', 'Partnership', 'Proprietorship', 'Section 8', 'Trust']);
  assert.ok(resolveSheet('gst_return_quarterly', { optionOverrides }).columns.find((c) => c.key === 'constitution').options.includes('Trust'));
  const people = applyOptionsEdit('gst_return_quarterly', {}, 'assign_person', ['Ajay Sir', 'Rina']).optionOverrides;
  assert.deepEqual(resolveSheet('gst_return_monthly', { optionOverrides: people }).columns.find((c) => c.key === 'assign_person').options, ['Ajay Sir', 'Rina']);
});

test('a column edit applies to both views', () => {
  const cols = resolveSheet('gst_return_monthly').columns.map((c) => ({ key: c.key, label: c.label, hidden: c.key === 'gst_password' }));
  const next = applyColumnEdit('gst_return_monthly', {}, { columns: [...cols, { label: 'ARN', type: 'text' }] });
  const q = resolveSheet('gst_return_quarterly', next);
  assert.ok(q.columns.some((c) => c.label === 'ARN' && !c.hidden));
  assert.equal(q.columns.find((c) => c.key === 'gst_password').hidden, true);
});

test('keys are scoped to the sheet: the same GSTIN and period in Monthly and Quarterly are two rows', () => {
  const m = resolveSheet('gst_return_monthly');
  const q = resolveSheet('gst_return_quarterly');
  const v = { gstin: '29aagcd6082l1z4', period: 'October 2026' };
  assert.equal(sheetRecordKey(m, v), 'gst_return_monthly:29AAGCD6082L1Z4|OCTOBER2026');
  assert.equal(sheetRecordKey(q, v), 'gst_return_quarterly:29AAGCD6082L1Z4|OCTOBER2026');
  assert.equal(sheetRecordKey(m, { gstin: 'X' }), null);
  // Non-exclusive books are unchanged.
  assert.equal(sheetRecordKey(resolveSheet('tds'), { tan: 'abc' }), 'ABC');
});

test('the firm\'s headings upload cleanly; Sl. No. skipped; an upload matches only rows of its own sheet', () => {
  const sheet = resolveSheet('gst_return_monthly');
  const headers = ['Sl. No.', 'GST Return Clients', 'CONSTITUTION', 'GSTN No', 'Mail ID for data collection', 'GST User ID', 'GST Pswd',
    'Contact No.', 'Assign Person', 'Current Status', 'Data Received', 'Tally/ Excel Prepared', 'Date of GSTR-1 Filing',
    'GSTR-1 Filed Mail', 'GSTR_2B Reco Mail to Client', 'Additional Data or Confirmation Received from Client',
    'Challan Mail to the client', 'Challan paid by client', 'Annual Working Sheet Update', 'Date of GSTR-3B Filing',
    'Completion Check', 'Remarks', 'Period'];
  const row = [1, 'DEARLIFE EMPOWER INDIA PRIVATE LIMITED-KARNATAKA', 'Company', '29AAGCD6082L1Z4', 'accounts@dearlife.co.in', 'dearlife_kat',
    'x', '7077725657', 'Ajay Sir', '', 'YES', 'YES', '11/11/2026', 'Yes', 'Yes', 'Yes', 'Yes', 'YES', 'Yes', '20/11/2026', 'Done', '', 'October 2026'];
  const key = 'gst_return_monthly:29AAGCD6082L1Z4|OCTOBER2026';
  const plan = planImport({
    sheet, fields: bookFields('gst_return'), headers, rows: [row],
    existingByKey: new Map([[key, { id: 'r1', values: {}, sheets: ['gst_return_monthly'] }]]),
  });
  assert.deepEqual(plan.unknownColumns, []);
  assert.deepEqual(plan.ignoredColumns, [{ header: 'Sl. No.', reason: 'serial' }]);
  assert.equal(plan.updates[0].id, 'r1');
  assert.equal(plan.updates[0].values.gstr1_date, '2026-11-11');
  assert.equal(plan.updates[0].values.challan_paid, 'Yes');
  // The same row uploaded to Quarterly does not touch the Monthly record.
  const qPlan = planImport({
    sheet: resolveSheet('gst_return_quarterly'), fields: bookFields('gst_return'), headers, rows: [row],
    existingByKey: new Map([[key, { id: 'r1', values: {}, sheets: ['gst_return_monthly'] }]]),
  });
  assert.equal(qPlan.updates.length, 0);
  assert.equal(qPlan.creates.length, 1);
});

/* ── From a matter to a row ─────────────────────────────────────────────── */

const client = {
  businessName: 'Dearlife Empower India Pvt Ltd', name: 'Ravi', entityType: 'pvt_ltd', gstNumber: '29aagcd6082l1z4',
  email: 'accounts@dearlife.co.in', mobile: '7077725657', gstReturnFrequency: 'monthly',
};
const steps = [
  { stepNumber: 1, title: 'Data received from client', status: 'completed', completedAt: '2026-11-03T05:00:00Z' },
  { stepNumber: 2, title: 'Tally / Excel prepared', status: 'completed', completedAt: '2026-11-05T05:00:00Z' },
  { stepNumber: 3, title: 'GSTR-1 Filing', status: 'completed', completedAt: '2026-11-10T20:00:00Z' },
  { stepNumber: 4, title: 'GSTR-1 filed mail to client', status: 'active', assignedTo: 'u-ajay' },
  { stepNumber: 5, title: 'GSTR-2B reconciliation mail', status: 'pending' },
  { stepNumber: 6, title: 'Additional data / confirmation from client', status: 'pending' },
  { stepNumber: 7, title: 'Challan mail to client', status: 'pending' },
  { stepNumber: 8, title: 'Challan paid by client', status: 'pending' },
  { stepNumber: 9, title: 'Annual working sheet updated', status: 'pending' },
  { stepNumber: 10, title: 'GSTR 3B filed', status: 'pending' },
];
const task = {
  id: 'm1', serviceKey: 'gst-returns', status: 'active', currentStepNumber: 4, organisation: null, clientName: 'Ravi',
  filingPeriod: { frequency: 'monthly', key: '2026-10', month: '2026-10', title: 'October 2026' }, createdAt: '2026-11-01T03:30:00Z',
};

/** #294: when manual filing dates began — the fixtures' tasks were completed before it (legacy dates). */
const RULE_FROM = '2026-12-01T00:00:00Z';

test('a GST return matter becomes a row: client details, period, status, assignee, and each step done so far', () => {
  const { frequency, values } = deriveRow({ task, client, steps, names: new Map([['u-ajay', 'Ajay Sir']]), manualFrom: RULE_FROM });
  assert.equal(frequency, 'monthly');
  assert.deepEqual(values, {
    client_name: 'Dearlife Empower India Pvt Ltd', constitution: 'Company', gstin: '29AAGCD6082L1Z4',
    data_email: 'accounts@dearlife.co.in', contact_no: '7077725657', assign_person: 'Ajay Sir',
    current_status: 'GSTR-1 filed mail to client', completion_check: null, period: 'October 2026', matter: 'm1',
    data_received: 'Yes', tally_prepared: 'Yes',
    // Completed (before manual dates began) at 20:00 UTC on 10 Nov — already 11 Nov in India.
    gstr1_date: '2026-11-11',
    gstr1_mail: null, gstr2b_mail: null, additional_data: null, challan_mail: null, challan_paid: null, annual_sheet: null, gstr3b_date: null,
  });
  assert.deepEqual(Object.keys(values).sort(), [...DERIVED_FIELDS].sort());
});

test('step names are matched loosely but never confused with their neighbours', () => {
  const pick = (field, titles) => stepForRule(rule(field), titles.map((title, i) => ({ stepNumber: i + 1, title })))?.title ?? null;
  assert.equal(normalizeTitle('GSTR - 1  Filed!'), 'gstr1filed');
  assert.equal(pick('gstr1_date', ['GSTR-1 filed mail', 'GSTR 1 Filing']), 'GSTR 1 Filing');
  assert.equal(pick('gstr1_mail', ['GSTR 1 Filing', 'GSTR1 filed mail']), 'GSTR1 filed mail');
  assert.equal(pick('data_received', ['Additional data received', 'Data collection from client']), 'Data collection from client');
  assert.equal(pick('additional_data', ['Data received', 'Confirmation received from client']), 'Confirmation received from client');
  assert.equal(pick('challan_paid', ['Challan mail sent', 'Challan payment by client']), 'Challan payment by client');
  assert.equal(pick('challan_mail', ['Challan payment by client', 'Challan shared on mail']), 'Challan shared on mail');
  assert.equal(pick('gstr3b_date', ['GSTR-1 filed', 'GSTR-3B filing']), 'GSTR-3B filing');
  assert.equal(pick('tally_prepared', ['Annual working sheet', 'Tally entries']), 'Tally entries');
  // A workflow without such a task leaves the column to people.
  assert.equal(pick('gstr2b_mail', ['Data received', 'GSTR-1 filed']), null);
});

test('status text: approval, completed (Done), stopped; the professional when nobody holds the task', () => {
  const pending = deriveRow({ task: { ...task, status: 'pending_admin_approval', professionalName: 'CA Mehta' }, client, steps: [] }).values;
  assert.equal(pending.current_status, 'Awaiting approval');
  assert.equal(pending.assign_person, 'CA Mehta');
  const done = deriveRow({ task: { ...task, status: 'completed' }, client, steps }).values;
  assert.equal(done.current_status, 'Completed');
  assert.equal(done.completion_check, 'Done');
  assert.equal(deriveRow({ task: { ...task, status: 'cancelled' }, client, steps }).values.current_status, 'Stopped');
  // The organisation entered on the matter wins over the client's business name.
  assert.equal(deriveRow({ task: { ...task, organisation: 'Dearlife Karnataka' }, client, steps }).values.client_name, 'Dearlife Karnataka');
});

test('monthly or quarterly; the period of a matter opened by hand', () => {
  assert.equal(frequencyOf({ filingPeriod: { frequency: 'quarterly' } }, client), 'quarterly');
  assert.equal(frequencyOf({ serviceKey: 'gst-returns-quarterly' }, null), 'quarterly');
  assert.equal(frequencyOf({ serviceKey: 'gst-returns' }, { gstReturnFrequency: 'quarterly' }), 'quarterly');
  assert.equal(frequencyOf({ serviceKey: 'gst-returns' }, null), 'monthly');
  // Opened by hand on 15 Nov 2026 (India): October's return, or Q2 2026-27.
  assert.equal(periodOf({ createdAt: '2026-11-15T06:00:00Z' }, 'monthly'), 'October 2026');
  assert.equal(periodOf({ createdAt: '2026-11-15T06:00:00Z' }, 'quarterly'), 'Q2 2026-27');
  // 31 Oct 20:00 UTC is 1 Nov in India.
  assert.equal(periodOf({ createdAt: '2026-10-31T20:00:00Z' }, 'monthly'), 'October 2026');
  assert.equal(periodOf({ filingPeriod: { title: 'Q3 2026-27' } }, 'quarterly'), 'Q3 2026-27');
  assert.equal(periodOf({}, 'monthly'), null);
});

/* ── Last change wins ───────────────────────────────────────────────────── */

const blank = Object.fromEntries(DERIVED_FIELDS.map((k) => [k, null]));

test('first sync fills what the workflow knows and never blanks what a person typed', () => {
  const r = mergeDerived({ values: { gst_user_id: 'dearlife_kat', challan_paid: 'Yes' } }, { ...blank, gstin: 'X1', data_received: 'Yes' });
  assert.deepEqual(r.values, { gst_user_id: 'dearlife_kat', challan_paid: 'Yes', gstin: 'X1', data_received: 'Yes' });
  assert.equal(r.changed, true);
});

test('a person\'s correction stays until the workflow changes that cell; then the workflow shows', () => {
  const synced = mergeDerived({}, { ...blank, assign_person: 'Ajay Sir', current_status: 'Data received' });
  // Staff correct Assign Person by hand.
  const edited = { values: { ...synced.values, assign_person: 'Biswal' }, derived: synced.derived };
  // The workflow moves on to another task; the assignee it reports is unchanged.
  const next1 = mergeDerived(edited, { ...blank, assign_person: 'Ajay Sir', current_status: 'GSTR-1 filing' });
  assert.equal(next1.values.assign_person, 'Biswal');
  assert.equal(next1.values.current_status, 'GSTR-1 filing');
  // Later the workflow assigns someone else: that is the latest change, so it shows.
  const next2 = mergeDerived(next1, { ...blank, assign_person: 'Rina', current_status: 'GSTR-1 filing' });
  assert.equal(next2.values.assign_person, 'Rina');
  // Nothing changed in the workflow: nothing to write.
  const same = mergeDerived(next2, { ...blank, assign_person: 'Rina', current_status: 'GSTR-1 filing' });
  assert.deepEqual(same.set, {});
  assert.equal(same.changed, false);
});

test('a step reopened in the workflow clears the cell it had filled', () => {
  const a = mergeDerived({}, { ...blank, data_received: 'Yes' });
  const b = mergeDerived(a, { ...blank, data_received: null });
  assert.equal(Object.hasOwn(b.values, 'data_received'), false);
  assert.deepEqual(b.set, { data_received: null });
});

/* ── #292 / #294: the tags on the matter itself ─────────────────────────── */

const LINKED = ['gst-returns', 'gst-returns-quarterly'];

test('#292 only a GST return matter is tagged: opened by the sweep, or of a service linked to the sheet', () => {
  assert.equal(isGstReturnMatter({ serviceKey: 'trademark-application' }, LINKED), false);
  assert.equal(gstMatterTags({ task: { serviceKey: 'trademark-application', createdAt: '2026-11-03T05:00:00Z' }, linkedServices: LINKED }), null);
  // The sweep's period wins, whatever the service.
  assert.equal(gstMatterTags({ task: { ...task, serviceKey: 'something-else' }, linkedServices: LINKED }).period, 'October 2026');
  // Opened by hand on a linked service: the period that had ended when it was opened (India date).
  const byHand = { serviceKey: 'gst-returns', createdAt: '2026-09-30T19:00:00Z' }; // 1 Oct 00:30 in India
  assert.equal(gstMatterTags({ task: byHand, client, linkedServices: LINKED }).period, 'September 2026');
  assert.equal(gstMatterTags({ task: byHand, client: { gstReturnFrequency: 'quarterly' }, linkedServices: LINKED }).period, 'Q2 2026-27');
  assert.equal(gstMatterTags({ task: { ...byHand, serviceKey: 'gst-returns-quarterly' }, linkedServices: LINKED }).period, 'Q2 2026-27');
  // A service the admin unlinked from the sheet is not tagged.
  assert.equal(gstMatterTags({ task: byHand, client, linkedServices: ['gst-returns-quarterly'] }), null);
});

/* ── #294 (firm, 17 Nov): the filing date is ENTERED on the filing task ─── */

// The issue's own names: "Step 6 – GSTR-1 Filed", "Step 13 – Proceed Towards GSTR-3B Filing".
const filed = { stepNumber: 6, title: 'GSTR-1 Filed', status: 'completed', completedAt: '2026-11-12T05:00:00Z' };
const filed3b = { stepNumber: 13, title: 'Proceed Towards GSTR-3B Filing', status: 'completed', completedAt: '2026-11-20T06:00:00Z' };
const mail = { stepNumber: 7, title: 'GSTR-1 Filed Mail', status: 'completed', completedAt: '2026-11-12T06:00:00Z' };
const saved = (date) => ({ date, previous: null, byUid: 'u-staff', byRole: 'team_member', at: '2026-11-14T06:00:00Z' });
const NOW = new Date('2026-11-14T06:00:00Z');
/** The rule went live before every completion in these fixtures: nothing is a legacy date. */
const LIVE_SINCE = '2026-11-01T00:00:00Z';

test('#294 completing a filing task sets no date; the saved date shows — before or after completion', () => {
  // Completed after the rule went live, nothing saved: no date anywhere.
  assert.equal(filedOnDateOf(filed, { manualFrom: LIVE_SINCE }), null);
  const tags = gstMatterTags({ task, steps: [filed, mail, filed3b], linkedServices: LINKED, manualFrom: LIVE_SINCE });
  assert.deepEqual(tags.filedOn, []);
  // …but both filing tasks are offered for a date ("Add Filing Date"); the mail task never is.
  assert.deepEqual(tags.filings.map((f) => [f.form, f.stepNumber, f.date]), [['GSTR-1', 6, null], ['GSTR-3B', 13, null]]);
  const row = deriveRow({ task, client, steps: [filed, mail, filed3b], manualFrom: LIVE_SINCE }).values;
  assert.deepEqual([row.gstr1_date, row.gstr3b_date, row.gstr1_mail], [null, null, 'Yes']);

  // Saved while the task is still in progress: shown at once, in the matter and the sheet.
  const current = { ...filed, status: 'active', completedAt: null, filingDate: saved('2026-11-11') };
  assert.equal(filedOnDateOf(current), '2026-11-11');
  assert.equal(deriveRow({ task, client, steps: [current] }).values.gstr1_date, '2026-11-11');
  const t2 = gstMatterTags({ task, steps: [current, { ...filed3b, status: 'pending', completedAt: null }], linkedServices: LINKED });
  assert.deepEqual(t2.filings, [{ stepNumber: 6, form: 'GSTR-1', date: '2026-11-11', status: 'active' }]); // 3B not reached
  // Completing it later keeps the SAVED date, not the completion day.
  const done = { ...current, status: 'completed', completedAt: '2026-11-13T05:00:00Z' };
  assert.equal(filedOnDateOf(done, { manualFrom: LIVE_SINCE }), '2026-11-11');
  assert.equal(deriveRow({ task, client, steps: [done], manualFrom: LIVE_SINCE }).values.gstr1_date, '2026-11-11');
  // Removed by staff (date: null): no date, and never the completion day either.
  assert.equal(filedOnDateOf({ ...done, filingDate: { ...saved(null) } }, { manualFrom: '2026-12-01T00:00:00Z' }), null);
  // A task not reached yet is not offered.
  const ahead = gstMatterTags({ task, steps: [{ ...filed, status: 'pending', completedAt: null }], linkedServices: LINKED });
  assert.deepEqual(ahead.filings, []);
});

test('#294 existing matters: a filing task completed before the rule keeps the date it showed', () => {
  const before = '2026-12-01T00:00:00Z'; // the rule went live after these completions
  assert.equal(filedOnDateOf(filed, { manualFrom: before }), '2026-11-12');
  // …including a correction made under the old rule, for that completion.
  const corrected = { ...filed, filedOnCorrection: { date: '2026-11-11', forCompletedAt: filed.completedAt } };
  assert.equal(filedOnDateOf(corrected, { manualFrom: before }), '2026-11-11');
  assert.equal(deriveRow({ task, client, steps: [corrected, filed3b], manualFrom: before }).values.gstr1_date, '2026-11-11');
  assert.equal(deriveRow({ task, client, steps: [corrected, filed3b], manualFrom: before }).values.gstr3b_date, '2026-11-20');
  // A saved date replaces it.
  assert.equal(filedOnDateOf({ ...corrected, filingDate: saved('2026-11-10') }, { manualFrom: before }), '2026-11-10');
  // Unknown start (could not be read): no legacy date is invented.
  assert.equal(filedOnDateOf(filed), null);
  // Reopened, so no longer completed: the legacy date goes, as before.
  assert.equal(filedOnDateOf({ ...filed, status: 'active', completedAt: null }, { manualFrom: before }), null);
});

test('#294 who may save: admin, manager, and a team member working the matter — never a client or professional', () => {
  const m = { assignedTo: 'u-owner' };
  const steps2 = [{ ...filed, assignedToUids: ['u-a', 'u-b'] }];
  assert.equal(canCorrectFiledOn({ role: 'admin', uid: 'x' }, m, steps2), true);
  assert.equal(canCorrectFiledOn({ role: 'manager', uid: 'x' }, m, steps2), true);
  assert.equal(canCorrectFiledOn({ role: 'team_member', uid: 'u-owner' }, m, steps2), true);
  assert.equal(canCorrectFiledOn({ role: 'team_member', uid: 'u-b' }, m, steps2), true);
  assert.equal(canCorrectFiledOn({ role: 'team_member', uid: 'u-stranger' }, m, steps2), false);
  assert.equal(canCorrectFiledOn({ role: 'client', uid: 'u-owner' }, m, steps2), false);
  assert.equal(canCorrectFiledOn({ role: 'professional', uid: 'u-a' }, m, steps2), false);

  // The route refuses clients and professionals before the handler runs.
  const here = path.dirname(fileURLToPath(import.meta.url));
  const routes = fs.readFileSync(path.join(here, '../routes/tasks.routes.js'), 'utf8');
  assert.match(routes, /router\.put\('\/:taskId\/steps\/:stepNumber\/filed-on', requireRole\('admin', 'manager', 'team_member'\), validate\(filedOnCorrectionSchema\), saveFilingDate\)/);
  const guard = requireRole('admin', 'manager', 'team_member');
  for (const [role, expected] of [['client', 403], ['professional', 403], ['team_member', 'next'], ['admin', 'next']]) {
    let status = 'next';
    guard({ user: { role } }, { status(c) { status = c; return this; }, json() { return this; } }, () => {});
    assert.equal(status, expected, role);
  }
});

test('#294 validation: a real date, not in the future, not before the period ended; only a reached filing task', () => {
  // The request body.
  assert.equal(filedOnCorrectionSchema.safeParse({ date: '2026-11-11' }).success, true);
  assert.equal(filedOnCorrectionSchema.safeParse({ date: null }).success, true);
  assert.equal(filedOnCorrectionSchema.safeParse({ date: '2026-02-30' }).success, false);
  assert.equal(filedOnCorrectionSchema.safeParse({ date: '11/11/2026' }).success, false);
  assert.equal(filedOnCorrectionSchema.safeParse({ date: '2026-11-11', by: 'x' }).success, false); // strict
  assert.equal(isCalendarDate('2028-02-29'), true);

  // Bounds: October's return (sweep period 2026-10) is filed from 1 November to today.
  assert.deepEqual(filedOnBounds(task, 'monthly', NOW), { min: '2026-11-01', max: '2026-11-14' });
  // Hand-opened on 3 Dec by a quarterly client: for Q2 (Jul–Sep), so from 1 October.
  assert.deepEqual(filedOnBounds({ createdAt: '2026-12-03T05:00:00Z' }, 'quarterly', new Date('2027-01-20T05:00:00Z')),
    { min: '2026-10-01', max: '2027-01-20' });

  const base = { task, steps: [filed, filed3b, mail], frequency: 'monthly', linkedServices: LINKED, manualFrom: LIVE_SINCE, now: NOW };
  // First save on a completed task: from nothing to the date.
  const ok = checkFilingDate({ ...base, stepNumber: 6, date: '2026-11-11' });
  assert.deepEqual([ok.ok, ok.form, ok.from, ok.to], [true, 'GSTR-1', null, '2026-11-11']);
  // The current (in-progress) task may be given its date before it is completed.
  const inProgress = { ...base, steps: [{ ...filed, status: 'active', completedAt: null }] };
  assert.equal(checkFilingDate({ ...inProgress, stepNumber: 6, date: '2026-11-11' }).ok, true);
  // A change: from the saved date to the new one; null removes it.
  const withDate = { ...base, steps: [{ ...filed, filingDate: saved('2026-11-11') }] };
  const change = checkFilingDate({ ...withDate, stepNumber: 6, date: '2026-11-10' });
  assert.deepEqual([change.from, change.to], ['2026-11-11', '2026-11-10']);
  const removed = checkFilingDate({ ...withDate, stepNumber: 6, date: null });
  assert.deepEqual([removed.ok, removed.from, removed.to], [true, '2026-11-11', null]);
  // The range.
  assert.equal(checkFilingDate({ ...base, stepNumber: 6, date: '2026-11-15' }).message, 'The filing date cannot be in the future.');
  assert.match(checkFilingDate({ ...base, stepNumber: 6, date: '2026-10-31' }).message, /before 1 November 2026/);
  // Not a filing task, a task not reached yet, another kind of matter.
  assert.equal(checkFilingDate({ ...base, stepNumber: 7, date: '2026-11-11' }).status, 400); // the mail task has no filing date
  const ahead = { ...base, steps: [{ ...filed, status: 'pending', completedAt: null }] };
  assert.equal(checkFilingDate({ ...ahead, stepNumber: 6, date: '2026-11-11' }).status, 409);
  assert.equal(checkFilingDate({ ...base, task: { serviceKey: 'trademark-application' }, stepNumber: 6, date: '2026-11-11' }).status, 400);
});

test('#294 the history entry: who saved which return\'s date, from what to what — staff only', () => {
  assert.equal(filingDateComment('GSTR-1', null, '2026-11-11'), 'GSTR-1 filing date set to 11 November 2026.');
  assert.equal(filingDateComment('GSTR-3B', '2026-11-20', '2026-11-19'), 'GSTR-3B filing date changed from 20 November 2026 to 19 November 2026.');
  assert.equal(filingDateComment('GSTR-1', '2026-11-11', null), 'GSTR-1 filing date removed (was 11 November 2026).');
  const src = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../controllers/gstFiling.controller.js'), 'utf8');
  assert.match(src, /type: 'FILING_DATE_SET'/);
  assert.match(src, /filedOn: \{ form: check\.form, from: check\.from \?\? null, to: check\.to \}/);
  assert.match(src, /byUid: req\.user\.uid/);
  assert.match(src, /commentClientVisible: false/);
  // The matter's updatedAt moves, which is what the sheet's sync watches.
  assert.match(src, /tx\.update\(taskRef, \{ updatedAt: now \}\)/);
  // completedAt is never written; nothing is written to the sheet from here (matter → sheet via the sync only).
  assert.doesNotMatch(src, /completedAt:/);
  assert.doesNotMatch(src, /worksheetRecords/);
});

test('#294 the sheet: a matter-fed filing date is changed on the matter, a typed-only one stays typable', () => {
  const linked = { sourceMatterId: 'm1', values: { gstr1_date: '2026-11-11' }, derived: { gstr1_date: '2026-11-11', gstr3b_date: null } };
  assert.deepEqual(matterOwnedDateFields(linked, { gstr1_date: '2026-11-09' }), ['gstr1_date']);
  assert.deepEqual(matterOwnedDateFields(linked, { gstr1_date: '2026-11-11', remarks: 'x' }), []); // unchanged value
  assert.deepEqual(matterOwnedDateFields(linked, { gstr3b_date: '2026-11-20' }), []); // the matter has no date for it
  assert.deepEqual(matterOwnedDateFields({ values: {}, derived: null }, { gstr1_date: '2026-11-09' }), []); // no matter
  // An edit on the matter follows into the row (last change wins: the workflow's value changed).
  const synced = mergeDerived({}, { ...blank, gstr1_date: '2026-11-11' });
  const next = mergeDerived(synced, { ...blank, gstr1_date: '2026-11-10' });
  assert.equal(next.values.gstr1_date, '2026-11-10');
});

/* ── #294 (firm, 17 Nov): a matter writes only to ITS row ───────────────── */

// Made-up businesses; never a real client of the firm.
const ACME = { client_name: 'Acme Widgets Pvt Ltd', gstin: '21AAAAA0000A1Z5', period: 'October 2026', matter: 'mA' };
const want = { ...blank, ...ACME };

test('#294 rowFitsMatter: GSTIN, period and client name blank or the matter\'s own', () => {
  assert.equal(rowFitsMatter({ values: {} }, want), true); // nothing typed yet
  assert.equal(rowFitsMatter({ values: { gstin: '21aaaaa0000a1z5', period: 'october  2026', client_name: 'M/s ACME WIDGETS PRIVATE LIMITED' } }, want), true);
  assert.equal(rowFitsMatter({ values: { gstin: '21BBBBB1111B1Z5' } }, want), false);          // another client
  assert.equal(rowFitsMatter({ values: { gstin: ACME.gstin, period: 'September 2026' } }, want), false); // another month
  assert.equal(rowFitsMatter({ values: { gstin: ACME.gstin, period: 'Q2 2026-27' } }, want), false);     // a quarter
  assert.equal(rowFitsMatter({ values: { client_name: 'Zenith Traders' } }, want), false);   // another company, no GSTIN typed
  // The matter knows no GSTIN (the client has none): a row with one typed is not provably its.
  assert.equal(rowFitsMatter({ values: { gstin: ACME.gstin } }, { ...want, gstin: null }), false);
  assert.equal(namesAgree('Acme Widgets', 'Acme Widgets Pvt. Ltd.'), true);
  assert.equal(namesAgree('Acme Widgets', 'Zenith Traders'), false);
});

test('#294 the bug: a row linked to a matter by its Matter cell, for another client, is released — not overwritten', () => {
  // The matter's own row (made by the sync), and another client's row a person linked to it.
  const own = { id: 'r-own', data: { source: 'matter', sourceMatterId: 'mA', values: { ...ACME }, derived: { ...want }, createdAt: '2026-11-01T00:00:00Z' } };
  const other = { id: 'r-other', data: { source: 'excel', sourceMatterId: 'mA', values: { client_name: 'Zenith Traders', gstin: '21ZZZZZ9999Z1Z5', period: 'October 2026', matter: 'mA' }, createdAt: '2026-10-01T00:00:00Z' } };
  // The query lists the other row first (older id) — before the fix, that was the row written to.
  const pick = pickMatterRow([other, own], want);
  assert.equal(pick.keep.id, 'r-own');
  assert.deepEqual(pick.release.map((r) => r.id), ['r-other']);
  // Only the wrong row is linked: it is released and a row of the matter's own will be made.
  const alone = pickMatterRow([other], want);
  assert.equal(alone.keep, null);
  assert.deepEqual(alone.release.map((r) => r.id), ['r-other']);
  // A row switched from another matter (its `derived` is that matter's) is checked like a new link.
  const switched = { id: 'r-sw', data: { sourceMatterId: 'mA', values: { client_name: 'Zenith Traders', gstin: '21ZZZZZ9999Z1Z5', period: 'October 2026' }, derived: { ...blank, matter: 'mZ' } } };
  assert.equal(pickMatterRow([switched], want).keep, null);
});

test('#294 the matter\'s own row stays its own — even after a person typed over its period — and the choice is stable', () => {
  const own = { id: 'r1', data: { source: 'matter', sourceMatterId: 'mA', values: { ...ACME, period: 'Oct-26' }, derived: { ...want } } };
  assert.equal(pickMatterRow([own], want).keep.id, 'r1');
  // A typed row the person linked, for the right client and period, is kept when it is the only one.
  const typed = { id: 'r2', data: { source: 'excel', sourceMatterId: 'mA', values: { client_name: 'ACME WIDGETS', gstin: ACME.gstin, period: 'October 2026' } } };
  assert.equal(pickMatterRow([typed], want).keep.id, 'r2');
  // Two rows that both fit: the sync's own wins, whatever the order they arrive in.
  assert.equal(pickMatterRow([typed, own], want).keep.id, 'r1');
  assert.equal(pickMatterRow([own, typed], want).keep.id, 'r1');
  assert.deepEqual(pickMatterRow([own, typed], want).release.map((r) => r.id), ['r2']);
});

test('#294 linking by the Matter cell: the matter must be this sheet\'s kind, this row\'s client and period, and have no row yet', () => {
  const identity = { frequency: 'monthly', client_name: ACME.client_name, gstin: ACME.gstin, period: ACME.period };
  assert.equal(checkMatterLink({ sheetFrequency: 'monthly', row: { values: { gstin: ACME.gstin } }, identity }), null);
  assert.equal(checkMatterLink({ sheetFrequency: 'monthly', row: { values: {} }, identity }), null);
  const wrongClient = checkMatterLink({ sheetFrequency: 'monthly', row: { values: { gstin: '21ZZZZZ9999Z1Z5' } }, identity });
  assert.equal(wrongClient.status, 409);
  assert.match(wrongClient.message, /That matter is for Acme Widgets Pvt Ltd — October 2026/);
  assert.equal(checkMatterLink({ sheetFrequency: 'monthly', row: { values: { period: 'November 2026' } }, identity }).status, 409);
  assert.match(checkMatterLink({ sheetFrequency: 'quarterly', row: { values: {} }, identity }).message, /monthly return\. Link it from the Monthly sheet/);
  assert.match(checkMatterLink({ sheetFrequency: 'monthly', row: { values: {} }, identity, otherRowIds: ['r-own'] }).message, /already has its own row/);
  // The identity is the one the sync writes.
  const id = matterIdentityOf({ task, client });
  const row = deriveRow({ task, client, steps: [] }).values;
  assert.deepEqual([id.client_name, id.gstin, id.period, id.frequency], [row.client_name, row.gstin, row.period, 'monthly']);
});

test('#294 the sync and the controller use the guards (source check)', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const sync = fs.readFileSync(path.join(here, '../services/gstReturnSheetSync.service.js'), 'utf8');
  assert.doesNotMatch(sync, /linkedRows\.get\(task\.id\)\?\.\[0\]/); // the old "first linked row"
  assert.match(sync, /pickMatterRow\(linked, values\)/);
  assert.match(sync, /rowFitsMatter\(d\.data\(\), p\.next\)/); // adoption
  assert.match(sync, /deriveRow\(\{ task, client: clients\.get\(task\.clientUid\) \?\? null, steps: ordered, names, manualFrom \}\)/);
  const ctl = fs.readFileSync(path.join(here, '../controllers/worksheets.controller.js'), 'utf8');
  assert.match(ctl, /await guardMatterLink\(db, sheet, values\.matter, values\);/);
  assert.match(ctl, /await guardMatterLink\(db, sheet, patch\.matter,/);
});

/* ── #279 (firm, 11 Nov): a GSTR-1 date under "Date of GSTR-3B Filing" ──── */

test('#279 forms named in a task name, in order', () => {
  assert.deepEqual(formsNamed(normalizeTitle('GSTR-1 Filed')), ['gstr1']);
  assert.deepEqual(formsNamed(normalizeTitle('Proceed Towards GSTR-3B Filing')), ['gstr3b']);
  assert.deepEqual(formsNamed(normalizeTitle('GSTR-1 filed, proceed towards GSTR-3B filing')), ['gstr1', 'gstr3b']);
  assert.deepEqual(formsNamed(normalizeTitle('GSTR 1 & 3B filing')), ['gstr1', 'gstr3b']);
  assert.deepEqual(formsNamed(normalizeTitle('GSTR-10 filing')), []);
});

test('#279 the GSTR-1 and GSTR-3B dates land in their own columns and tags', () => {
  // The firm's names (#294: "Step 6 – GSTR-1 Filed", "Step 13 – Proceed Towards GSTR-3B
  // Filing") with the wordings that used to cross the columns over: a GSTR-1 task that
  // also mentions GSTR-3B, a data task naming both forms, and step NUMBERS that do not
  // follow the flow (a task added later keeps a high number).
  const done = (n, title, at) => ({ stepNumber: n, title, status: 'completed', completedAt: at });
  const flow = [
    done(2, 'Data received for GSTR-1 & GSTR-3B filing', '2026-11-03T05:00:00Z'),
    done(5, 'Proceed Towards GSTR-1 Filing', '2026-11-08T05:00:00Z'),
    // added later: number 21, 6th in the flow. #294: its date is the one staff saved.
    { ...done(21, 'GSTR-1 Filed – proceed towards GSTR-3B filing', '2026-11-12T05:00:00Z'), filingDate: { date: '2026-11-11' } },
    { stepNumber: 7, title: 'GSTR-1 Filed Mail', status: 'active' },
    { stepNumber: 13, title: 'Proceed Towards GSTR-3B Filing', status: 'pending' },
  ];
  const authored = [1, 2, 3, 4, 5, 21, 7, 8, 9, 10, 11, 12, 13].map((stepNumber) => ({ stepNumber }));
  const steps2 = withAuthoredOrder(flow, authored);
  const row = deriveRow({ task, client, steps: steps2 }).values;
  assert.equal(row.gstr1_date, '2026-11-11'); // the "filed" task, not the data or "proceed" task
  assert.equal(row.gstr3b_date, null);        // GSTR-3B not filed yet — never GSTR-1's date
  assert.equal(row.data_received, 'Yes');
  const tags = gstMatterTags({ task, steps: steps2, linkedServices: LINKED }).filedOn;
  assert.deepEqual(tags.map((f) => [f.form, f.stepNumber, f.date]), [['GSTR-1', 21, '2026-11-11']]);

  // Once GSTR-3B is filed, each column has its own date.
  const later = steps2.map((x) => (x.stepNumber === 13 ? { ...x, status: 'completed', completedAt: '2026-11-21T06:00:00Z', filingDate: { date: '2026-11-20' } } : x));
  const row2 = deriveRow({ task, client, steps: later }).values;
  assert.deepEqual([row2.gstr1_date, row2.gstr3b_date], ['2026-11-11', '2026-11-20']);
});

test('#279 Completion Check is a dropdown: Done / Pending, editable, and the workflow\'s "Done" is a choice', () => {
  const col = resolveSheet('gst_return_monthly').columns.find((c) => c.key === 'completion_check');
  assert.equal(col.type, 'select');
  assert.deepEqual(col.options, ['Done', 'Pending']);
  const done = deriveRow({ task: { ...task, status: 'completed' }, client, steps }).values.completion_check;
  assert.ok(col.options.includes(done));
  const { optionOverrides } = applyOptionsEdit('gst_return_monthly', {}, 'completion_check', ['Done', 'Pending', 'On hold']);
  assert.deepEqual(resolveSheet('gst_return_quarterly', { optionOverrides }).columns.find((c) => c.key === 'completion_check').options, ['Done', 'Pending', 'On hold']);
});
