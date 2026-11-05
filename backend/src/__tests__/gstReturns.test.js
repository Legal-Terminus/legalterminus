/**
 * #219 — GST return reminders: which period is due, when, and what the email says.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  companyNameOf, duePeriod, indiaDate, longDate, shouldOpen,
} from '../../../shared/workflows/gstReturns.js';
import { resolveStatutoryDate } from '../../../shared/workflows/statutoryCalendar.js';
import { TEMPLATE_DEFS, fillTemplate } from '../services/emailTemplates.service.js';
import { updateUserSchema } from '../schemas/user.schema.js';

test('today is India’s date: 00:30 IST on the 1st is already the new month', () => {
  // 2026-09-30T19:00Z = 2026-10-01 00:30 IST
  assert.equal(indiaDate(new Date('2026-09-30T19:00:00Z')), '2026-10-01');
  assert.equal(indiaDate(new Date('2026-09-30T18:00:00Z')), '2026-09-30');
});

test('monthly: on 1 October the matter is for September', () => {
  const p = duePeriod('monthly', '2026-10-01');
  assert.deepEqual(
    { key: p.key, month: p.month, createdOn: p.createdOn, title: p.title, label: p.label },
    { key: '2026-09', month: '2026-09', createdOn: '2026-10-01', title: 'September 2026', label: 'SEPTEMBER 2026' },
  );
  // Later in the month it is still September's (a catch-up after a quiet 1st).
  assert.equal(duePeriod('monthly', '2026-10-17').key, '2026-09');
  // January's run is for December of the previous year.
  assert.equal(duePeriod('monthly', '2027-01-01').title, 'December 2026');
});

test('quarterly: financial-year quarters, opened on 1 Jul / 1 Oct / 1 Jan / 1 Apr', () => {
  const cases = {
    '2026-07-01': ['2026-27-Q1', 'Q1 2026-27', 'Q1 26-27 (April–June)', '2026-06', '2026-07-01'],
    '2026-10-01': ['2026-27-Q2', 'Q2 2026-27', 'Q2 26-27 (July–September)', '2026-09', '2026-10-01'],
    '2027-01-01': ['2026-27-Q3', 'Q3 2026-27', 'Q3 26-27 (October–December)', '2026-12', '2027-01-01'],
    '2027-04-01': ['2026-27-Q4', 'Q4 2026-27', 'Q4 26-27 (January–March)', '2027-03', '2027-04-01'],
    // Mid-quarter: still the quarter that last ended.
    '2026-11-04': ['2026-27-Q2', 'Q2 2026-27', 'Q2 26-27 (July–September)', '2026-09', '2026-10-01'],
  };
  for (const [today, [key, title, label, month, createdOn]] of Object.entries(cases)) {
    const p = duePeriod('quarterly', today);
    assert.deepEqual([p.key, p.title, p.label, p.month, p.createdOn], [key, title, label, month, createdOn], today);
  }
});

test('nothing back-dated: the first period opened is the one whose 1st is on or after the day it was chosen', () => {
  const oct = duePeriod('monthly', '2026-11-20'); // October, due 1 Nov
  assert.equal(shouldOpen(oct, '2026-11-10T09:00:00Z'), false); // chosen 10 Nov: not October
  assert.equal(shouldOpen(duePeriod('monthly', '2026-12-01'), '2026-11-10T09:00:00Z'), true); // November, on 1 Dec
  assert.equal(shouldOpen(oct, '2026-11-01T02:00:00Z'), true); // chosen on the 1st itself
  assert.equal(shouldOpen(oct, null), false);
  assert.equal(duePeriod('yearly', '2026-11-01'), null);
});

test('due dates: monthly 11th/20th, quarterly 13th/24th of the month after the period', () => {
  assert.equal(resolveStatutoryDate('gstr1', { month: '2026-09' }), '2026-10-11');
  assert.equal(resolveStatutoryDate('gstr3b', { month: '2026-09' }), '2026-10-20');
  assert.equal(resolveStatutoryDate('gstr1_qtr', { month: '2026-09' }), '2026-10-13');
  assert.equal(resolveStatutoryDate('gstr3b_qtr', { month: '2026-09' }), '2026-10-24');
  assert.equal(longDate('2026-10-11'), '11th October 2026');
  assert.equal(longDate('2026-10-01'), '1st October 2026');
  assert.equal(longDate('2026-10-22'), '22nd October 2026');
  assert.equal(longDate('2026-10-13'), '13th October 2026');
});

test('the subject follows the firm’s format for both frequencies', () => {
  for (const key of ['gst_return_monthly', 'gst_return_quarterly']) {
    assert.ok(TEMPLATE_DEFS[key], key);
    assert.equal(TEMPLATE_DEFS[key].audience, 'client');
  }
  assert.equal(fillTemplate(TEMPLATE_DEFS.gst_return_monthly.subject, { companyName: 'ABC PRIVATE LIMITED', periodTitle: 'September 2026' }),
    'ABC PRIVATE LIMITED - GST Return - September 2026');
  assert.equal(fillTemplate(TEMPLATE_DEFS.gst_return_quarterly.subject, { companyName: 'ABC PRIVATE LIMITED', periodTitle: 'Q2 2026-27' }),
    'ABC PRIVATE LIMITED - GST Return - Q2 2026-27');
  const body = fillTemplate(TEMPLATE_DEFS.gst_return_quarterly.body, {
    period: 'Q2 26-27 (July–September)', gstr1DueDate: '13th October 2026', gstr3bDueDate: '24th October 2026',
  });
  assert.match(body, /for the Q2 26-27 \(July–September\), we request/);
  assert.match(body, /GSTR 1 is 13th October 2026 and GSTR 3B is 24th October 2026/);
});

test('company name: organisation, then business name, then the client’s name', () => {
  assert.equal(companyNameOf({ organisation: 'ABC PVT LTD', businessName: 'X', name: 'Y' }), 'ABC PVT LTD');
  assert.equal(companyNameOf({ businessName: 'ABC Traders', name: 'Y' }), 'ABC Traders');
  assert.equal(companyNameOf({ name: 'Ravi' }), 'Ravi');
});

test('a client can be set to monthly, quarterly or not filed — nothing else', () => {
  for (const v of ['monthly', 'quarterly', '']) assert.equal(updateUserSchema.safeParse({ gstReturnFrequency: v }).success, true, v);
  assert.equal(updateUserSchema.safeParse({ gstReturnFrequency: 'yearly' }).success, false);
});

test('a Service step keeps its due rule when saved (it used to be stripped)', async () => {
  const { createDefinitionSchema, updateDefinitionSchema } = await import('../schemas/workflow.schema.js');
  const step = { stepNumber: 1, title: 'GSTR 1 filed', type: 'step', dueRule: { anchor: 'statutory', statutoryKey: 'gstr1', offsetDays: 0 } };
  const created = createDefinitionSchema.parse({ id: 'gst', name: 'GST', initialStep: 1, steps: [step] });
  assert.deepEqual(created.steps[0].dueRule, step.dueRule);
  const updated = updateDefinitionSchema.safeParse({ name: 'GST', initialStep: 1, steps: [step] });
  if (updated.success && updated.data.steps) assert.deepEqual(updated.data.steps[0].dueRule, step.dueRule);
  assert.equal(createDefinitionSchema.safeParse({ id: 'gst', name: 'GST', initialStep: 1,
    steps: [{ ...step, dueRule: { anchor: 'whenever' } }] }).success, false);
});
