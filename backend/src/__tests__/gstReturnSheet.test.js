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
  gstMatterTags, isGstReturnMatter, filedOnDateOf, filedOnBounds, canCorrectFiledOn, checkFiledOnCorrection,
  matterOwnedDateFields, isCalendarDate, formsNamed, withAuthoredOrder,
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

test('a GST return matter becomes a row: client details, period, status, assignee, and each step done so far', () => {
  const { frequency, values } = deriveRow({ task, client, steps, names: new Map([['u-ajay', 'Ajay Sir']]) });
  assert.equal(frequency, 'monthly');
  assert.deepEqual(values, {
    client_name: 'Dearlife Empower India Pvt Ltd', constitution: 'Company', gstin: '29AAGCD6082L1Z4',
    data_email: 'accounts@dearlife.co.in', contact_no: '7077725657', assign_person: 'Ajay Sir',
    current_status: 'GSTR-1 filed mail to client', completion_check: null, period: 'October 2026', matter: 'm1',
    data_received: 'Yes', tally_prepared: 'Yes',
    // Completed at 20:00 UTC on 10 Nov — already 11 Nov in India.
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

test('#294 "Filed on": the GSTR-1 and GSTR-3B filing tasks, each with its own India completion date', () => {
  // The names in the issue, around the mail tasks that must not be confused with them.
  const flow = [
    { stepNumber: 5, title: 'Tally / Excel prepared', status: 'completed', completedAt: '2026-11-05T05:00:00Z' },
    { stepNumber: 6, title: 'GSTR-1 Filed', status: 'completed', completedAt: '2026-11-10T20:00:00Z' },
    { stepNumber: 7, title: 'GSTR-1 Filed Mail', status: 'completed', completedAt: '2026-11-12T05:00:00Z' },
    { stepNumber: 13, title: 'Proceed Towards GSTR-3B Filing', status: 'completed', completedAt: '2026-11-20T06:00:00Z' },
    { stepNumber: 14, title: 'GSTR-3B filed mail to client', status: 'active' },
  ];
  assert.deepEqual(gstMatterTags({ task, steps: flow, linkedServices: LINKED }).filedOn, [
    // 20:00 UTC on 10 Nov is 11 Nov in India
    { stepNumber: 6, form: 'GSTR-1', date: '2026-11-11', completedOn: '2026-11-11', corrected: false },
    { stepNumber: 13, form: 'GSTR-3B', date: '2026-11-20', completedOn: '2026-11-20', corrected: false },
  ]);
  // Not completed yet, or reopened (its completion cleared): no date.
  const open = flow.map((s) => (s.stepNumber === 13 ? { ...s, status: 'active', completedAt: null } : s));
  assert.deepEqual(gstMatterTags({ task, steps: open, linkedServices: LINKED }).filedOn.map((f) => f.form), ['GSTR-1']);
  // Same task the sheet's "Date of GSTR-1 Filing" column reads.
  assert.equal(deriveRow({ task, client, steps: flow }).values.gstr1_date, '2026-11-11');
  assert.equal(deriveRow({ task, client, steps: flow }).values.gstr3b_date, '2026-11-20');
});

/* ── #294 follow-up: correcting a filing date ───────────────────────────── */

const filed = { stepNumber: 6, title: 'GSTR-1 Filed', status: 'completed', completedAt: '2026-11-12T05:00:00Z' };
const filed3b = { stepNumber: 13, title: 'Proceed Towards GSTR-3B Filing', status: 'completed', completedAt: '2026-11-20T06:00:00Z' };
const correction = { date: '2026-11-11', forCompletedAt: filed.completedAt, previous: '2026-11-12', byUid: 'u-ajay', at: '2026-11-14T06:00:00Z' };
const NOW = new Date('2026-11-14T06:00:00Z');

test('#294 one source: the tag and the sheet read the same corrected date, and a re-completion drops the old correction', () => {
  const corrected = { ...filed, filedOnCorrection: correction };
  assert.equal(filedOnDateOf(filed), '2026-11-12');
  assert.equal(filedOnDateOf(corrected), '2026-11-11');
  const steps2 = [corrected, filed3b];
  const tag = gstMatterTags({ task, steps: steps2, linkedServices: LINKED }).filedOn.find((f) => f.form === 'GSTR-1');
  const cell = deriveRow({ task, client, steps: steps2 }).values.gstr1_date;
  assert.equal(tag.date, '2026-11-11');
  assert.equal(cell, tag.date); // the sheet never disagrees with the matter
  assert.equal(tag.corrected, true);
  assert.equal(tag.completedOn, '2026-11-12');
  // GSTR-3B keeps its own date.
  assert.equal(deriveRow({ task, client, steps: steps2 }).values.gstr3b_date, '2026-11-20');
  // Reopened: no date at all; re-completed later: the new completion date, not the old correction.
  assert.equal(filedOnDateOf({ ...corrected, status: 'active', completedAt: null }), null);
  const again = { ...corrected, completedAt: '2026-11-25T05:00:00Z' };
  assert.equal(filedOnDateOf(again), '2026-11-25');
  assert.equal(deriveRow({ task, client, steps: [again] }).values.gstr1_date, '2026-11-25');
});

test('#294 who may correct: admin, manager, and a team member working the matter — never a client or professional', () => {
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
  assert.match(routes, /router\.put\('\/:taskId\/steps\/:stepNumber\/filed-on', requireRole\('admin', 'manager', 'team_member'\), validate\(filedOnCorrectionSchema\), correctFiledOn\)/);
  const guard = requireRole('admin', 'manager', 'team_member');
  for (const [role, expected] of [['client', 403], ['professional', 403], ['team_member', 'next'], ['admin', 'next']]) {
    let status = 'next';
    guard({ user: { role } }, { status(c) { status = c; return this; }, json() { return this; } }, () => {});
    assert.equal(status, expected, role);
  }
});

test('#294 validation: a real date, not in the future, not before the period ended; only a completed filing task', () => {
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

  const base = { task, steps: [filed, filed3b, { stepNumber: 7, title: 'GSTR-1 Filed Mail', status: 'completed', completedAt: filed.completedAt }],
    frequency: 'monthly', linkedServices: LINKED, now: NOW };
  const ok = checkFiledOnCorrection({ ...base, stepNumber: 6, date: '2026-11-11' });
  assert.deepEqual([ok.ok, ok.form, ok.from, ok.to], [true, 'GSTR-1', '2026-11-12', '2026-11-11']);
  assert.equal(checkFiledOnCorrection({ ...base, stepNumber: 6, date: '2026-11-15' }).message, 'The filing date cannot be in the future.');
  assert.match(checkFiledOnCorrection({ ...base, stepNumber: 6, date: '2026-10-31' }).message, /before 1 November 2026/);
  assert.equal(checkFiledOnCorrection({ ...base, stepNumber: 7, date: '2026-11-11' }).status, 400); // the mail task has no filing date
  const pending = { ...base, steps: [{ ...filed, status: 'active', completedAt: null }] };
  assert.equal(checkFiledOnCorrection({ ...pending, stepNumber: 6, date: '2026-11-11' }).status, 409);
  assert.equal(checkFiledOnCorrection({ ...base, task: { serviceKey: 'trademark-application' }, stepNumber: 6, date: '2026-11-11' }).status, 400);
  // null = back to the completion date.
  const reset = checkFiledOnCorrection({ ...base, steps: [{ ...filed, filedOnCorrection: correction }], stepNumber: 6, date: null });
  assert.deepEqual([reset.from, reset.to], ['2026-11-11', '2026-11-12']);
});

test('#294 the history entry: who changed which return\'s date, from what to what — staff only', () => {
  const src = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../controllers/gstFiling.controller.js'), 'utf8');
  assert.match(src, /type: 'FILED_ON_CORRECTED'/);
  assert.match(src, /filedOn: \{ form: check\.form, from: check\.from, to: check\.to \}/);
  assert.match(src, /byUid: req\.user\.uid/);
  assert.match(src, /commentClientVisible: false/);
  // The matter's updatedAt moves, which is what the sheet's sync watches.
  assert.match(src, /tx\.update\(taskRef, \{ updatedAt: now \}\)/);
  // completedAt is never written by the correction.
  assert.doesNotMatch(src, /completedAt:/);
});

test('#294 the sheet: a matter-fed filing date is corrected on the matter, a typed-only one stays typable', () => {
  const linked = { sourceMatterId: 'm1', values: { gstr1_date: '2026-11-11' }, derived: { gstr1_date: '2026-11-11', gstr3b_date: null } };
  assert.deepEqual(matterOwnedDateFields(linked, { gstr1_date: '2026-11-09' }), ['gstr1_date']);
  assert.deepEqual(matterOwnedDateFields(linked, { gstr1_date: '2026-11-11', remarks: 'x' }), []); // unchanged value
  assert.deepEqual(matterOwnedDateFields(linked, { gstr3b_date: '2026-11-20' }), []); // the workflow has not filled it
  assert.deepEqual(matterOwnedDateFields({ values: {}, derived: null }, { gstr1_date: '2026-11-09' }), []); // no matter
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
    done(21, 'GSTR-1 Filed – proceed towards GSTR-3B filing', '2026-11-11T05:00:00Z'), // added later: number 21, 6th in the flow
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
  const later = steps2.map((x) => (x.stepNumber === 13 ? { ...x, status: 'completed', completedAt: '2026-11-20T06:00:00Z' } : x));
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
