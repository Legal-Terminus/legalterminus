/**
 * #210 / #217 — the worksheet engine's pure rules: column resolution, header
 * matching against the firm's Excel files, upload planning, the trademark
 * renewal milestones, KYC due dates and which reminder is due.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHEETS, BOOKS, MODULES } from '../config/worksheetDefinitions.js';
import {
  resolveSheet, bookFields, matchHeaders, normalizeHeader, normalizeDate, normalizeValue, recordKeyFor,
  addPeriod, computeValues, applyColumnEdit, cleanRecordValues, planImport, pickReminder, reminderText,
  daysBetween, indiaToday, encodeCursor, decodeCursor,
} from '../services/worksheetEngine.service.js';

const labels = (sheet) => sheet.columns.filter((c) => !c.hidden).map((c) => c.label.toUpperCase());

/* ── Definitions ────────────────────────────────────────────────────────── */

test('five trademark reports share one book; thirteen company worksheets each have their own', () => {
  assert.deepEqual(MODULES.trademark.sheets, ['tm_master', 'tm_register', 'tm_opposition_raised', 'tm_opposition_received', 'tm_assignment']);
  for (const s of MODULES.trademark.sheets) assert.equal(SHEETS[s].book, 'trademark');
  assert.equal(MODULES.company.sheets.length, 13);
  for (const s of MODULES.company.sheets) assert.equal(SHEETS[s].book, s);
  assert.deepEqual(BOOKS.trademark.recordKey, ['application_no']);
});

test('every sheet column names a field of its book, and every field key is unique', () => {
  for (const [key, sheet] of Object.entries(SHEETS)) {
    const fields = BOOKS[sheet.book].fields.map((f) => f.key);
    assert.equal(new Set(fields).size, fields.length, `${sheet.book} has duplicate field keys`);
    for (const col of sheet.columns) assert.ok(fields.includes(col.key), `${key}: ${col.key}`);
    for (const k of BOOKS[sheet.book].recordKey) assert.ok(fields.includes(k), `${key}: record key ${k}`);
  }
});

test('the columns the firm asked to remove on 29 Oct are not there', () => {
  const reg = labels(resolveSheet('tm_register'));
  const asg = labels(resolveSheet('tm_assignment'));
  for (const gone of ['COLUMN 1', 'COLUMN 2', '%']) assert.ok(!reg.includes(gone), `Register TM still has ${gone}`);
  for (const gone of ['COLUMN 1', 'COLUMN 2', 'NETSTAT SEI', '']) assert.ok(!asg.includes(gone), `TM Assignment still has "${gone}"`);
  assert.equal(reg[0], 'DATE OF FILING TM');
  assert.equal(asg[0], 'DATE OF FILING TMA');
  assert.ok(reg.includes('10 YEARS COMPLETED ON'));
});

test('one field carries each report\'s own heading', () => {
  const master = resolveSheet('tm_master').columns.find((c) => c.key === 'date_of_filing');
  const raised = resolveSheet('tm_opposition_raised').columns.find((c) => c.key === 'date_of_filing');
  assert.equal(master.label, 'Date of Filing');
  assert.equal(raised.label, 'Date of Filing TMA');
  // …and knows the others' headings, so an upload to either matches both.
  assert.ok(master.aliases.includes('Date of Filing TMA'));
  assert.ok(raised.aliases.includes('Date of Filing'));
});

test('the KYC sheet calculates the next due date and carries a reminder', () => {
  const kyc = resolveSheet('kyc');
  assert.equal(kyc.columns.find((c) => c.key === 'next_kyc_due').type, 'computed');
  assert.deepEqual(kyc.reminder, { field: 'next_kyc_due', milestones: [30, 7, 0] });
  assert.deepEqual(kyc.recordKey, ['din', 'financial_year']);
});

/* ── Column resolution with the firm's edits ────────────────────────────── */

test('stored edits rename, hide and add; a built-in missing from the stored list still appears', () => {
  const config = {
    customFields: [{ key: 'c_renewal_owner', label: 'Renewal Owner', type: 'text' }],
    sheets: { tm_master: { columns: [
      { key: 'trademark_name', label: 'Mark' },
      { key: 'application_no', label: 'Application No.' },
      { key: 'review', label: 'Review', hidden: true },
      { key: 'c_renewal_owner', label: 'Renewal Owner' },
    ] } },
  };
  const s = resolveSheet('tm_master', config);
  assert.equal(s.columns[0].label, 'Mark');
  assert.equal(s.columns.find((c) => c.key === 'review').hidden, true);
  assert.equal(s.columns.find((c) => c.key === 'c_renewal_owner').builtIn, false);
  // Not in the stored list → appended, visible: a code change never hides a column.
  assert.ok(s.columns.some((c) => c.key === 'date_of_filing' && !c.hidden));
  assert.equal(new Set(s.columns.map((c) => c.key)).size, s.columns.length);
});

test('linked services default from the book and can be overridden (even to none)', () => {
  assert.deepEqual(resolveSheet('tm_master').linkedServices, ['trademark-application']);
  assert.deepEqual(resolveSheet('tm_master', { sheets: { tm_master: { linkedServices: [] } } }).linkedServices, []);
  assert.deepEqual(resolveSheet('kyc').linkedServices, []);
  assert.ok(resolveSheet('auditor_master').linkedServices.includes('add-director'));
});

test('admin column edit: rename, add, hide; a built-in left out is kept hidden; a custom one leaves', () => {
  const s0 = resolveSheet('fssai');
  const cols = s0.columns.map((c) => ({ key: c.key, label: c.label }));
  cols[0].label = 'Client Name';
  const next = applyColumnEdit('fssai', {}, {
    columns: [...cols.filter((c) => c.key !== 'remarks'), { label: 'Inspection Date', type: 'date' }, { label: 'Zone', type: 'select', options: ['East', 'east', 'West'] }],
  });
  const s1 = resolveSheet('fssai', next);
  assert.equal(s1.columns[0].label, 'Client Name');
  assert.equal(s1.columns.find((c) => c.key === 'remarks').hidden, true, 'built-in left out → hidden, not dropped');
  const added = s1.columns.find((c) => c.label === 'Inspection Date');
  assert.equal(added.key, 'c_inspection_date');
  assert.equal(added.type, 'date');
  assert.deepEqual(s1.columns.find((c) => c.key === 'c_zone').options, ['East', 'West'], 'options de-duplicated');

  // Deleting the custom column takes it off the sheet but keeps the field
  // registered, so a new column of the same name gets a NEW key.
  const without = applyColumnEdit('fssai', next, { columns: s1.columns.filter((c) => c.key !== 'c_inspection_date').map((c) => ({ key: c.key, label: c.label, hidden: c.hidden })) });
  assert.ok(!resolveSheet('fssai', without).columns.some((c) => c.key === 'c_inspection_date'));
  const again = applyColumnEdit('fssai', without, { columns: [...resolveSheet('fssai', without).columns, { label: 'Inspection Date', type: 'date' }] });
  assert.ok(resolveSheet('fssai', again).columns.some((c) => c.key === 'c_inspection_date_2'));
});

test('admin column edit refuses nonsense', () => {
  const cols = resolveSheet('gst').columns.map((c) => ({ key: c.key, label: c.label }));
  assert.throws(() => applyColumnEdit('gst', {}, { columns: [] }), /between 1 and 80/);
  assert.throws(() => applyColumnEdit('gst', {}, { columns: [...cols, { label: '' }] }), /needs a name/);
  assert.throws(() => applyColumnEdit('gst', {}, { columns: [...cols, { key: 'nope', label: 'X' }] }), /Unknown column/);
  assert.throws(() => applyColumnEdit('gst', {}, { columns: [...cols, { label: 'X', type: 'computed' }] }), /cannot be of type/);
  assert.throws(() => applyColumnEdit('gst', {}, { columns: cols.map((c) => ({ ...c, hidden: true })) }), /stay visible/);
  assert.throws(() => applyColumnEdit('nope', {}, { columns: cols }), /Unknown worksheet/);
});

test('a field shown on another trademark report can be added to this one', () => {
  const cols = resolveSheet('tm_master').columns.map((c) => ({ key: c.key, label: c.label }));
  const next = applyColumnEdit('tm_master', {}, { columns: [...cols, { key: 'registration_date', label: 'Registration Date' }] });
  assert.ok(resolveSheet('tm_master', next).columns.some((c) => c.key === 'registration_date' && !c.hidden));
});

/* ── Header matching ────────────────────────────────────────────────────── */

test('headers match case-, space- and punctuation-insensitively', () => {
  assert.equal(normalizeHeader('  Date of filing (TM) '), 'DATEOFFILINGTM');
  const sheet = resolveSheet('tm_master');
  const m = matchHeaders(['application no', 'TRADEMARK  NAME', 'e-mail id', 'Mobile Number'], sheet.columns);
  assert.deepEqual(m.map((x) => x.key), ['application_no', 'trademark_name', 'email_id', 'mobile_no']);
  assert.ok(m.every((x) => x.status === 'matched'));
});

test('the firm\'s label variants all land on the same field', () => {
  const sheet = resolveSheet('tm_master');
  const others = bookFields('trademark');
  const variants = ['DATE OF FILING TMA', 'DATE OF FILING TM', 'DATE OF FILING', 'CONSTITUTION (COMPANY/PARTNERSHIP)',
    'CLIENT (WORK KISNE KIYA HAI?)', 'CLIENT (WORK KISNE DIYA HAI)', 'LOGO / WORD', 'EXAMINATION REPO', 'APPLICANT', 'REMARKS'];
  const m = matchHeaders(variants, sheet.columns, others);
  assert.deepEqual(m.map((x) => x.key), [
    'date_of_filing', 'date_of_filing', 'date_of_filing', 'constitution', 'client', 'client',
    'logo_word_mark', 'examination_report', 'application_filed_by', 'remark',
  ]);
  // The repeats of a field are flagged as duplicates, not written twice.
  assert.deepEqual(m.map((x) => x.status), ['matched', 'duplicate', 'duplicate', 'matched', 'matched', 'duplicate', 'matched', 'matched', 'matched', 'matched']);
});

test('a unique prefix matches; an ambiguous or unknown header is reported, never guessed', () => {
  const sheet = resolveSheet('tm_master');
  const m = matchHeaders(['NAME OF EXAMINER (IPO)', 'NETSTAT SEI', '%', 'DATE OF', '', 'Proprietor Name and Address'], sheet.columns, bookFields('trademark'));
  assert.equal(m[0].key, 'name_of_examiner');
  assert.equal(m[1].status, 'unknown');
  assert.equal(m[2].status, 'unknown');
  assert.equal(m[3].status, 'unknown', 'DATE OF fits several fields → ambiguous');
  assert.equal(m[4].status, 'blank');
  assert.equal(m[5].key, 'proprietor_name');
});

test('calculated columns in a file are recognised but not imported', () => {
  const sheet = resolveSheet('tm_register');
  const m = matchHeaders(['9 YEAR COMPLETED', '11 YEAR (9000 RESTORATION FEE)', '10.5 YEAR (4500 LATE FEE)'], sheet.columns);
  assert.deepEqual(m.map((x) => x.status), ['computed', 'computed', 'computed']);
  assert.deepEqual(m.map((x) => x.key), ['renewal_9y', 'renewal_11y', 'renewal_10_5y']);
});

/* ── Values ─────────────────────────────────────────────────────────────── */

test('dates: ISO, Indian day-first, month names, Excel serials; nonsense is null', () => {
  assert.equal(normalizeDate('2021-03-05'), '2021-03-05');
  assert.equal(normalizeDate('05/03/2021'), '2021-03-05');
  assert.equal(normalizeDate('5-3-21'), '2021-03-05');
  assert.equal(normalizeDate('05.03.2021'), '2021-03-05');
  assert.equal(normalizeDate('5 Mar 2021'), '2021-03-05');
  assert.equal(normalizeDate('05-March-2021'), '2021-03-05');
  assert.equal(normalizeDate('5th Sept, 2021'), '2021-09-05');
  assert.equal(normalizeDate(44260), '2021-03-05');
  assert.equal(normalizeDate('44260'), '2021-03-05');
  assert.equal(normalizeDate(new Date(Date.UTC(2020, 1, 29))), '2020-02-29');
  assert.equal(normalizeDate('29/02/2021'), null, 'not a leap year');
  assert.equal(normalizeDate('Proposed to be used'), null);
  assert.equal(normalizeDate(''), null);
});

test('values: numbers, dates and selects are tidied; untidy data is kept as text with a warning', () => {
  const num = { key: 'n', label: 'Fees', type: 'number' };
  assert.deepEqual(normalizeValue(num, '₹1,50,000'), { value: 150000 });
  assert.equal(normalizeValue(num, 'NIL').value, 'NIL');
  assert.match(normalizeValue(num, 'NIL').warning, /expects a number/);
  const date = { key: 'd', label: 'Filed', type: 'date' };
  assert.deepEqual(normalizeValue(date, '01/02/2020'), { value: '2020-02-01' });
  assert.equal(normalizeValue(date, 'Awaited').value, 'Awaited');
  const sel = { key: 's', label: 'Constitution', type: 'select', options: ['LLP', 'Company'] };
  assert.deepEqual(normalizeValue(sel, 'llp'), { value: 'LLP' });
  assert.deepEqual(normalizeValue(sel, 'Pvt Ltd'), { value: 'Pvt Ltd' });
  assert.deepEqual(normalizeValue({ type: 'text', label: 't' }, '  <b>Acme</b> '), { value: 'Acme' });
  assert.deepEqual(normalizeValue({ type: 'text', label: 't' }, '   '), { value: null });
  assert.deepEqual(normalizeValue({ type: 'text', label: 't' }, 12345), { value: '12345' });
  assert.equal(normalizeValue({ type: 'text', label: 't' }, 'x'.repeat(900)).value.length, 500);
});

test('a manual edit that does not fit its type is refused; calculated fields cannot be typed', () => {
  const fields = bookFields('trademark');
  assert.deepEqual(cleanRecordValues(fields, { trademark_name: 'ACME', class: null }), { trademark_name: 'ACME', class: null });
  assert.throws(() => cleanRecordValues(fields, { registration_date: 'soon' }), /expects a date/);
  assert.throws(() => cleanRecordValues(fields, { renewal_10y: '2030-01-01' }), /calculated/);
  assert.throws(() => cleanRecordValues(fields, { nope: 'x' }), /Unknown column/);
  assert.throws(() => cleanRecordValues(fields, { matter: 'bad id!' }), /matter/);
});

test('record keys are normalised and need every part', () => {
  assert.equal(recordKeyFor(['application_no'], { application_no: ' 12 34567 ' }), '1234567');
  assert.equal(recordKeyFor(['application_no'], { application_no: '' }), null);
  assert.equal(recordKeyFor(['din', 'financial_year'], { din: '0123', financial_year: '2024-25' }), '0123|2024-25');
  assert.equal(recordKeyFor(['din', 'financial_year'], { din: '0123' }), null);
  assert.equal(recordKeyFor([], { a: 1 }), null);
});

/* ── Computed dates ─────────────────────────────────────────────────────── */

test('addPeriod handles month ends and leap years', () => {
  assert.equal(addPeriod('2016-02-29', { years: 9 }), '2025-02-28');
  assert.equal(addPeriod('2016-02-29', { years: 8 }), '2024-02-29');
  assert.equal(addPeriod('2015-08-31', { years: 9, months: 6 }), '2025-02-28');
  assert.equal(addPeriod('2015-08-31', { years: 8, months: 6 }), '2024-02-29');
  assert.equal(addPeriod('2020-01-15', { years: 10, months: 6 }), '2030-07-15');
  assert.equal(addPeriod('2020-11-30', { months: 3 }), '2021-02-28');
  assert.equal(addPeriod('2024-03-01', { days: -1 }), '2024-02-29');
  assert.equal(addPeriod('2024-01-10', { days: 30 }), '2024-02-09');
  assert.equal(addPeriod('not a date', { years: 1 }), null);
});

test('renewal milestones run from the last renewal / first application date, else the registration date', () => {
  const cols = resolveSheet('tm_register').columns;
  const fromReg = computeValues(cols, { registration_date: '2016-02-29' });
  assert.deepEqual(fromReg, {
    renewal_9y: '2025-02-28', renewal_9_5y: '2025-08-29', renewal_10y: '2026-02-28',
    renewal_10_5y: '2026-08-29', renewal_11y: '2027-02-28',
  });
  const fromRenewal = computeValues(cols, { registration_date: '2010-05-01', last_renewal_date: '2020-05-01' });
  assert.equal(fromRenewal.renewal_10y, '2030-05-01');
  assert.equal(fromRenewal.renewal_11y, '2031-05-01');
  // An imported date in the firm's own format is still understood.
  assert.equal(computeValues(cols, { registration_date: '01/05/2010' }).renewal_9y, '2019-05-01');
  // Nothing to count from → blank, not a guess.
  assert.equal(computeValues(cols, {}).renewal_9y, null);
  assert.equal(computeValues(cols, { last_renewal_date: 'Awaited' }).renewal_9y, null);
});

test('KYC is due three years after filing; ADT-3 30 days after resignation; FSSAI renewal 30 days before expiry', () => {
  assert.equal(computeValues(resolveSheet('kyc').columns, { date_of_filing: '2024-02-29' }).next_kyc_due, '2027-02-28');
  assert.equal(computeValues(resolveSheet('kyc').columns, { date_of_filing: '2025-09-30' }).next_kyc_due, '2028-09-30');
  assert.equal(computeValues(resolveSheet('adt3').columns, { resignation_date: '2026-01-15' }).adt3_due, '2026-02-14');
  assert.equal(computeValues(resolveSheet('fssai').columns, { valid_till: '2027-03-31' }).renewal_due, '2027-03-01');
  assert.equal(computeValues(resolveSheet('startup_india').columns, { date_of_incorporation: '2020-02-29' }).recognition_valid_till, '2030-02-28');
});

/* ── Upload planning ────────────────────────────────────────────────────── */

test('an upload updates by key, adds new rows, reports unknown columns, and never blanks existing data', () => {
  const sheet = resolveSheet('tm_master');
  const fields = bookFields('trademark');
  const headers = ['APPLICATION NO.', 'TRADEMARK NAME', 'STATUS', 'NETSTAT SEI', 'DATE OF FILING TMA', '9 YEAR COMPLETED'];
  const rows = [
    ['1111111', 'ACME', '', 'x', '01/02/2020', ''],          // existing → update (STATUS blank: kept)
    ['2222222', 'BETA', 'Objected', '', 44000, ''],         // new
    ['', 'GAMMA', 'Filed', '', '', ''],                      // no key → added
    ['', '', '', '', '', ''],                                // empty → skipped
    ['2222222', '', 'Accepted', '', '', ''],                // same key again → merged
    ['3333333', 'SAME', '', '', '', ''],                     // existing, nothing new
  ];
  const existingByKey = new Map([
    ['1111111', { id: 'r1', values: { application_no: '1111111', trademark_name: 'OLD', status: 'Registered' }, sheets: ['tm_master'] }],
    ['3333333', { id: 'r3', values: { application_no: '3333333', trademark_name: 'SAME' }, sheets: ['tm_master'] }],
  ]);
  const plan = planImport({ sheet, fields, headers, rows, existingByKey });

  assert.deepEqual(plan.unknownColumns, ['NETSTAT SEI']);
  assert.deepEqual(plan.ignoredColumns, [{ header: '9 YEAR COMPLETED', reason: 'computed' }]);
  assert.deepEqual(plan.summary, { newRows: 2, updatedRows: 1, unchangedRows: 1, keylessRows: 1, duplicatesInFile: 1, emptyRows: 1 });

  const r1 = plan.updates.find((u) => u.id === 'r1');
  assert.deepEqual(r1.values, { application_no: '1111111', trademark_name: 'ACME', date_of_filing: '2020-02-01' });
  assert.ok(!('status' in r1.values), 'a blank cell never clears');
  const beta = plan.creates.find((c) => c.key === '2222222');
  assert.deepEqual(beta.values, { application_no: '2222222', trademark_name: 'BETA', status: 'Accepted', date_of_filing: '2020-06-18' });
  assert.deepEqual(plan.newKeys, ['2222222']);
});

test('an upload to another report adds the trademark to that report even when nothing else changed', () => {
  const sheet = resolveSheet('tm_register');
  const plan = planImport({
    sheet, fields: bookFields('trademark'), headers: ['Application No.', 'Trademark Name'], rows: [['1111111', 'ACME']],
    existingByKey: new Map([['1111111', { id: 'r1', values: { application_no: '1111111', trademark_name: 'ACME' }, sheets: ['tm_master'] }]]),
  });
  assert.equal(plan.updates[0].changed, false);
  assert.equal(plan.updates[0].addsSheet, true);
  assert.equal(plan.summary.updatedRows, 1);
});

test('an upload recognises a field shown only on another report, and warns about untidy cells', () => {
  const plan = planImport({
    sheet: resolveSheet('tm_master'), fields: bookFields('trademark'),
    headers: ['Application No.', 'REGISTRATION DATE', 'DATE OF USER'], rows: [['9', 'pending', 'Proposed to be used']], startRow: 5,
  });
  const reg = plan.columns.find((c) => c.header === 'REGISTRATION DATE');
  assert.equal(reg.key, 'registration_date');
  assert.equal(reg.notShown, true);
  assert.equal(plan.creates[0].values.registration_date, 'pending');
  assert.equal(plan.creates[0].values.date_of_user_affidavit, 'Proposed to be used');
  assert.deepEqual(plan.warnings, [{ row: 5, column: 'REGISTRATION DATE', message: '"Registration Date" expects a date' }]);
});

test('a company worksheet with a composite key upserts per DIN and year', () => {
  const sheet = resolveSheet('kyc');
  const plan = planImport({
    sheet, fields: bookFields('kyc'), headers: ['DIN', 'Financial Year', 'Director Name', 'Date of Filing'],
    rows: [['01234567', '2024-25', 'A Kumar', '30/09/2024'], ['01234567', '2025-26', 'A Kumar', '']],
    existingByKey: new Map([['01234567|2024-25', { id: 'k1', values: { din: '01234567', financial_year: '2024-25' }, sheets: ['kyc'] }]]),
  });
  assert.equal(plan.updates[0].id, 'k1');
  assert.equal(plan.creates.length, 1);
  assert.equal(plan.creates[0].key, '01234567|2025-26');
});

/* ── Reminders ──────────────────────────────────────────────────────────── */

test('reminders: 30 days, 7 days and on the day — the most urgent milestone reached, once', () => {
  const due = '2027-03-31';
  assert.equal(pickReminder({ due, today: '2027-02-28' }), null, '31 days out → nothing yet');
  assert.deepEqual(pickReminder({ due, today: '2027-03-01' }), { milestone: 30, daysLeft: 30, markKeys: [`${due}:30`] });
  assert.equal(pickReminder({ due, today: '2027-03-10', sent: { [`${due}:30`]: 'x' } }), null, 'between milestones, already told');
  assert.deepEqual(pickReminder({ due, today: '2027-03-24', sent: { [`${due}:30`]: 'x' } }).milestone, 7);
  const onTheDay = pickReminder({ due, today: due, sent: { [`${due}:30`]: 'x', [`${due}:7`]: 'x' } });
  assert.deepEqual(onTheDay, { milestone: 0, daysLeft: 0, markKeys: [`${due}:30`, `${due}:7`, `${due}:0`] });
  assert.equal(pickReminder({ due, today: due, sent: { [`${due}:0`]: 'x' } }), null);
});

test('reminders: a missed milestone is not sent late — only the current one, and it marks the earlier ones', () => {
  const due = '2027-03-31';
  const late = pickReminder({ due, today: '2027-03-26' });
  assert.equal(late.milestone, 7);
  assert.deepEqual(late.markKeys, [`${due}:30`, `${due}:7`]);
  // Overdue but within the grace: the on-the-day reminder still goes once.
  assert.equal(pickReminder({ due, today: '2027-04-10' }).milestone, 0);
  // Long overdue: silence (no flood when old data is first imported).
  assert.equal(pickReminder({ due, today: '2027-06-30' }), null);
  // A new due date (the record was refiled) starts a fresh set.
  assert.equal(pickReminder({ due: '2030-03-31', today: '2030-03-01', sent: { [`${due}:30`]: 'x' } }).milestone, 30);
});

test('reminder wording and the India date', () => {
  const t = reminderText({ subject: 'KYC', daysLeft: 7, due: '2027-03-31', describe: ['A Kumar', '01234567', null] });
  assert.equal(t.title, 'KYC due in 7 days');
  assert.match(t.message, /^A Kumar · 01234567 — KYC is due on 31 Mar 2027\.$/);
  assert.equal(reminderText({ subject: 'KYC', daysLeft: 0, due: '2027-03-31', describe: [] }).title, 'KYC due today');
  assert.equal(reminderText({ subject: 'KYC', daysLeft: -2, due: '2027-03-31', describe: [] }).title, 'KYC overdue');
  assert.equal(daysBetween('2024-02-28', '2024-03-01'), 2);
  // 20:00 UTC on 31 Dec is already 1 Jan in India.
  assert.equal(indiaToday(Date.UTC(2026, 11, 31, 20, 0)), '2027-01-01');
});

test('cursor round-trip; a forged cursor is rejected', () => {
  assert.deepEqual(decodeCursor(encodeCursor('2026-10-29T00:00:00.000Z', 'abc')), ['2026-10-29T00:00:00.000Z', 'abc']);
  assert.equal(decodeCursor('not-base64-json'), null);
  assert.equal(decodeCursor(Buffer.from(JSON.stringify({ a: 1 })).toString('base64url')), null);
});
