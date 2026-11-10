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
} from '../services/gstReturnSheet.service.js';

const FIRM_COLUMNS = [
  'GST Return Clients', 'CONSTITUTION', 'GSTN No', 'Mail ID for data collection', 'GST User ID', 'GST Pswd', 'Contact No.',
  'Assign Person', 'Current Status', 'Data Received', 'Tally/ Excel Prepared', 'Date of GSTR-1 Filing', 'GSTR-1 Filed Mail',
  'GSTR_2B Reco Mail to Client', 'Additional Data or Confirmation Received from Client', 'Challan Mail to the client',
  'Challan paid by client', 'Annual Working Sheet Update', 'Date of GSTR-3B Filing', 'Completion Check', 'Remarks',
];
const YELLOW = [
  'CONSTITUTION', 'Assign Person', 'Data Received', 'Tally/ Excel Prepared', 'GSTR-1 Filed Mail', 'GSTR_2B Reco Mail to Client',
  'Additional Data or Confirmation Received from Client', 'Challan Mail to the client', 'Challan paid by client', 'Annual Working Sheet Update',
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
