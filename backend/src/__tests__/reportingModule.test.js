/**
 * #196 / #197 — the Reporting module's pure rules: who may do what, and every
 * number the sheets show.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelFor } from '../services/reportingAccess.service.js';
import {
  resolveSheet, totalsFor, sheetView, fyStart, daysOfMonth, reportingRow, monthsBetween, cleanColumns,
} from '../services/marketingSheets.service.js';
import { outcomeNeedsRemarks } from '../config/leadFields.js';

const grants = { leads: { u1: 'edit', u2: 'view' }, reporting: { u1: 'edit' }, dm_cost: {}, dm_income: {}, cold_calling: {} };

test('admins always edit; others get only what was granted', () => {
  assert.equal(levelFor({ uid: 'a', role: 'admin' }, 'dm_cost', grants), 'edit');
  assert.equal(levelFor({ uid: 'u1', role: 'team_member' }, 'leads', grants), 'edit');
  assert.equal(levelFor({ uid: 'u2', role: 'manager' }, 'leads', grants), 'view');
  assert.equal(levelFor({ uid: 'u3', role: 'team_member' }, 'leads', grants), null, 'not listed → no access');
});

test('clients, professionals and computed sections are never editable', () => {
  assert.equal(levelFor({ uid: 'u1', role: 'client' }, 'leads', grants), null);
  assert.equal(levelFor({ uid: 'u1', role: 'professional' }, 'leads', grants), null);
  assert.equal(levelFor({ uid: 'u1', role: 'team_member' }, 'reporting', grants), 'view');
  assert.equal(levelFor({ uid: 'a', role: 'admin' }, 'nope', grants), null);
});

test('money is summed per group; Convert counts clients and is never money', () => {
  const sheet = resolveSheet('dm_income');
  const t = totalsFor(sheet, { google: { trademark: 5000, gst: 2000, convert: 2 }, fb: { fssai: 1000, convert: 1 } });
  assert.deepEqual(t.groupTotals, { google: 7000, fb: 1000 });
  assert.deepEqual(t.groupCounts, { google: 2, fb: 1 });
  assert.equal(t.total, 8000);
  assert.equal(t.count, 3);
});

test('a hidden column leaves the totals but keeps its value', () => {
  const sheet = resolveSheet('dm_cost', { groups: { google: { columns: [
    { key: 'trademark', label: 'Trademark' }, { key: 'gst', label: 'GST', hidden: true },
  ] } } });
  assert.equal(totalsFor(sheet, { google: { trademark: 100, gst: 50 } }).total, 100);
});

test('the financial year runs from 1 April', () => {
  assert.equal(fyStart('2026-09-20'), '2026-04-01');
  assert.equal(fyStart('2026-02-10'), '2025-04-01');
  assert.equal(fyStart('2026-04-01'), '2026-04-01');
  assert.equal(daysOfMonth('2026-02').length, 28);
  assert.equal(daysOfMonth('2024-02').length, 29);
});

test('month total and FY cumulative (from 1 April to month end)', () => {
  const sheet = resolveSheet('dm_cost');
  const entries = {
    '2026-03-31': { google: { trademark: 999 } }, // previous FY — excluded
    '2026-04-15': { google: { trademark: 100 } },
    '2026-09-01': { google: { trademark: 10 }, fb: { gst: 5 } },
    '2026-09-30': { google: { trademark: 20 } },
  };
  const v = sheetView(sheet, entries, '2026-09');
  assert.equal(v.rows.length, 30);
  assert.equal(v.monthTotal.total, 35);
  assert.equal(v.monthTotal.groupTotals.google, 30);
  assert.equal(v.cumulative.from, '2026-04-01');
  assert.equal(v.cumulative.total, 135);
  assert.equal(v.cumulative.values.google.trademark, 130);
});

test('reporting: spend, income, clients, CAC and revenue-to-cost', () => {
  const r = reportingRow('2026-09', {
    cost: { groupTotals: { google: 20000, fb: 10000 } },
    income: { groupTotals: { google: 60000, fb: 15000 }, groupCounts: { google: 4, fb: 2 } },
    cold: { total: 8000, count: 1 },
    convertedLeads: 5,
  });
  assert.equal(r.spentBoth, 30000);
  assert.equal(r.incomeBoth, 75000);
  assert.equal(r.clientsTotal, 6);
  assert.equal(r.cac, 5000);
  assert.equal(r.revenueToCost, 2.5);
  assert.equal(r.coldCallingIncome, 8000);
  assert.equal(r.convertedLeads, 5);
});

test('no spend or no clients: CAC and ratio are blank, not Infinity', () => {
  const r = reportingRow('2026-09', { cost: {}, income: {}, cold: {} });
  assert.equal(r.cac, null);
  assert.equal(r.revenueToCost, null);
});

test('months between two months, across a year', () => {
  assert.deepEqual(monthsBetween('2025-11', '2026-02'), ['2025-11', '2025-12', '2026-01', '2026-02']);
});

test('column edits: names required, keys derived and made unique', () => {
  const cols = cleanColumns([{ label: 'Brand Search' }, { label: 'Brand Search' }, { key: 'convert', label: 'Convert', kind: 'count' }]);
  assert.deepEqual(cols.map((c) => c.key), ['brand_search', 'brand_search_2', 'convert']);
  assert.throws(() => cleanColumns([{ label: '  ' }]), /needs a name/);
  assert.throws(() => cleanColumns([]), /between 1 and 40/);
});

test('#196: remarks only for a lead that did not convert', () => {
  assert.equal(outcomeNeedsRemarks('not_converted'), true);
  assert.equal(outcomeNeedsRemarks('wrong_enquiry'), true);
  assert.equal(outcomeNeedsRemarks('converted'), false);
  assert.equal(outcomeNeedsRemarks(''), false);
});
