/**
 * LT #366 — the filters above a report apply together, the same way everywhere.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reportFiltersOf, matchesReportFilters, indiaDayOf, hasAmountDue } from '../services/reportFilters.service.js';

const m = {
  status: 'active', serviceKey: 'gst-returns', workflowType: 'gst_return_def', paymentStatus: 'part_paid',
  assignedTo: 'u1', assignedToUids: ['u1', 'u2'], createdAt: '2026-11-28T17:00:00.000Z', // 28 Nov 22:30 in India
  updatedAt: '2026-11-20T05:00:00.000Z',
};

test('each filter alone', () => {
  assert.equal(matchesReportFilters(m, { status: 'active' }), true);
  assert.equal(matchesReportFilters(m, { status: 'completed' }), false);
  // Service: the dropdown sends the service key; the workflow id is still accepted.
  assert.equal(matchesReportFilters(m, { serviceType: 'gst-returns' }), true);
  assert.equal(matchesReportFilters(m, { serviceType: 'gst_return_def' }), true);
  assert.equal(matchesReportFilters(m, { serviceType: 'trademark' }), false);
  assert.equal(matchesReportFilters(m, { paymentStatus: 'part_paid' }), true);
  assert.equal(matchesReportFilters(m, { paymentStatus: 'fully_paid' }), false);
  assert.equal(matchesReportFilters({ ...m, paymentStatus: undefined }, { paymentStatus: 'not_paid' }), true);
  assert.equal(matchesReportFilters(m, { teamMember: 'u2' }), true);
});

test('dates are whole India days, inclusive — a matter from the To day is kept', () => {
  assert.equal(indiaDayOf(m.createdAt), '2026-11-28');
  assert.equal(matchesReportFilters(m, { endDate: '2026-11-28' }), true);
  assert.equal(matchesReportFilters(m, { startDate: '2026-11-28', endDate: '2026-11-28' }), true);
  assert.equal(matchesReportFilters(m, { endDate: '2026-11-27' }), false);
  assert.equal(matchesReportFilters(m, { startDate: '2026-11-29' }), false);
  // Completed applies the range to the completion (last update) day.
  assert.equal(matchesReportFilters(m, { endDate: '2026-11-20' }, { dateField: 'updatedAt' }), true);
  assert.equal(matchesReportFilters({ ...m, createdAt: undefined }, { startDate: '2026-01-01' }), false);
});

test('filters combine (AND); changing one never drops the others', () => {
  const f = reportFiltersOf({ status: 'active', serviceType: 'gst-returns', paymentStatus: 'part_paid', startDate: '2026-11-01', endDate: '2026-11-30' });
  assert.equal(matchesReportFilters(m, f), true);
  assert.equal(matchesReportFilters(m, { ...f, paymentStatus: 'fully_paid' }), false);
  assert.equal(matchesReportFilters({ ...m, status: 'completed' }, f), false);
});

test('a request\'s filters: blanks and malformed dates are ignored', () => {
  assert.deepEqual(reportFiltersOf({ status: ' ', startDate: '28/11/2026', endDate: '2026-11-30', paymentStatus: 'not_paid' }),
    { status: undefined, serviceType: undefined, teamMember: undefined, paymentStatus: 'not_paid', startDate: undefined, endDate: '2026-11-30' });
});

test('every task report with the filter bar uses the shared filter (source check)', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(path.join(here, '../controllers/reports.controller.js'), 'utf8');
  for (const fn of ['getAllTasks', 'getCompletedTasks', 'getPendingTasks', 'getMasterSheet']) {
    const body = src.slice(src.indexOf(`export async function ${fn}(`)).split('\nexport async function ')[0];
    assert.match(body, /matchesReportFilters\(/, `${fn} applies the report filters`);
    assert.doesNotMatch(body, /where\('workflowType'/, `${fn} no longer matches Service against workflowType`);
  }
});

test('LT #370 / #365: "Has amount due" and "Any payment received"', () => {
  assert.equal(matchesReportFilters({ amountDue: 500, status: 'active' }, { paymentStatus: 'due' }), true);
  // A completed matter with a balance is still owed.
  assert.equal(matchesReportFilters({ amountDue: 500, status: 'completed' }, { paymentStatus: 'due' }), true);
  // Stopped, rejected or archived: no longer expected; nothing due: not listed.
  assert.equal(matchesReportFilters({ amountDue: 500, status: 'cancelled' }, { paymentStatus: 'due' }), false);
  assert.equal(matchesReportFilters({ amountDue: 0, status: 'active' }, { paymentStatus: 'due' }), false);
  assert.equal(matchesReportFilters({ amountPaid: 1, status: 'cancelled' }, { paymentStatus: 'received' }), true);
  assert.equal(matchesReportFilters({ amountPaid: 0 }, { paymentStatus: 'received' }), false);
  assert.equal(hasAmountDue({ amountDue: '250', status: 'active' }), true);
});
