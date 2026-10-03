/**
 * LT #206 — the client / group work-and-fee fold, and LT #205's contact fields.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildClientGroupReport, distinctGroups, financialYearOf, financialYearRange,
  recentFinancialYears, clientLabel, INDIVIDUAL,
} from '../services/clientGroupFees.service.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';
import { clientGroupFeesQuerySchema } from '../schemas/report.schema.js';

test('financialYearOf runs April to March, in India time', () => {
  assert.equal(financialYearOf('2026-04-01T06:00:00.000Z'), '2026-27');
  assert.equal(financialYearOf('2027-03-31T10:00:00.000Z'), '2026-27');
  assert.equal(financialYearOf('2026-03-15T10:00:00.000Z'), '2025-26');
  // 00:10 IST on 1 April is still 31 March in UTC — it belongs to the NEW year.
  assert.equal(financialYearOf('2026-03-31T18:40:00.000Z'), '2026-27');
  assert.equal(financialYearOf('2026-03-31T18:20:00.000Z'), '2025-26');
  assert.equal(financialYearOf('1999-12-01T00:00:00.000Z'), '1999-00');
  assert.equal(financialYearOf('not a date'), null);
});

test('financialYearRange is the half-open IST year, and rejects nonsense', () => {
  assert.deepEqual(financialYearRange('2026-27'), { from: '2026-03-31T18:30:00.000Z', to: '2027-03-31T18:30:00.000Z' });
  assert.equal(financialYearRange('2026-28'), null, 'the two halves must be consecutive');
  assert.equal(financialYearRange('2026'), null);
  const r = financialYearRange('2026-27');
  assert.equal(financialYearOf(r.from), '2026-27');
  assert.equal(financialYearOf(new Date(new Date(r.to).getTime() - 1).toISOString()), '2026-27');
  assert.equal(financialYearOf(r.to), '2027-28');
});

test('recentFinancialYears lists the current year first', () => {
  assert.deepEqual(recentFinancialYears(Date.parse('2026-10-03T00:00:00Z'), 3), ['2026-27', '2025-26', '2024-25']);
  assert.deepEqual(recentFinancialYears(Date.parse('2026-02-03T00:00:00Z'), 2), ['2025-26', '2024-25']);
});

const CLIENTS = [
  { uid: 'c1', name: 'Asha Rao', organisation: 'Mehta Steel', groupCompany: 'Mehta Group' },
  { uid: 'c2', name: 'Ravi', businessName: 'Mehta Foods', groupCompany: 'mehta group ' },
  { uid: 'c3', name: 'Solo Person', groupCompany: '' },
  { uid: 'c4', name: 'Other', organisation: 'Zen Ltd', groupCompany: 'Zen' },
];
const TASKS = [
  { id: 't1', clientUid: 'c1', serviceKey: 'gst', serviceName: 'GST Registration', createdAt: '2026-05-01T00:00:00Z', status: 'completed', totalCost: 1000, amountPaid: 1000, amountDue: 0 },
  { id: 't2', clientUid: 'c2', serviceKey: 'inc', serviceName: 'Incorporation', createdAt: '2026-06-01T00:00:00Z', status: 'active', totalCost: 5000, amountPaid: 2000, amountDue: 3000 },
  { id: 't3', clientUid: 'c3', serviceKey: 'gst', serviceName: 'GST Registration', createdAt: '2026-07-01T00:00:00Z', status: 'active', totalCost: 800, amountPaid: 0 },
  { id: 't4', clientUid: 'c4', serviceKey: 'tm', serviceName: 'Trademark', createdAt: '2026-08-01T00:00:00Z', status: 'active' },
  { id: 't5', clientUid: 'gone', organisation: 'Old Co', serviceKey: 'gst', serviceName: 'GST Registration', createdAt: '2026-09-01T00:00:00Z', status: 'completed', totalCost: 300, amountPaid: 300, amountDue: 0 },
];

test('no filter: every matter, with totals of works, charged, received and balance', () => {
  const r = buildClientGroupReport(TASKS, CLIENTS);
  assert.equal(r.rows.length, 5);
  assert.deepEqual(r.totals, { works: 5, charged: 7100, received: 3300, balance: 3800 });
  assert.equal(r.rows.find((x) => x.taskId === 't1').clientName, 'Mehta Steel', 'the company, not the contact person');
  assert.equal(r.rows.find((x) => x.taskId === 't4').priced, false, 'an unpriced matter is a work with no fee');
  assert.equal(r.rows.find((x) => x.taskId === 't5').clientName, 'Old Co', 'a removed client keeps its name on the matter');
});

test('a group filter gathers every client in it, whatever the spelling', () => {
  const r = buildClientGroupReport(TASKS, CLIENTS, { group: 'MEHTA GROUP' });
  assert.deepEqual(r.rows.map((x) => x.taskId).sort(), ['t1', 't2']);
  assert.deepEqual(r.totals, { works: 2, charged: 6000, received: 3000, balance: 3000 });
  assert.equal(r.byGroup.length, 1);
  assert.equal(r.byGroup[0].clients, 2);
});

test('individual clients are those with no group, and are filterable on their own', () => {
  const r = buildClientGroupReport(TASKS, CLIENTS, { group: INDIVIDUAL });
  assert.deepEqual(r.rows.map((x) => x.taskId).sort(), ['t3', 't5']);
  assert.equal(r.byGroup[0].group, '');
});

test('client and service filters combine; service options are not narrowed by the service filter', () => {
  const r = buildClientGroupReport(TASKS, CLIENTS, { clientUid: 'c1', serviceKey: 'gst' });
  assert.deepEqual(r.rows.map((x) => x.taskId), ['t1']);
  assert.deepEqual(r.services.map((s) => s.key), ['gst', 'inc', 'tm']);
  assert.equal(buildClientGroupReport(TASKS, CLIENTS, { clientUid: 'c1', serviceKey: 'tm' }).totals.works, 0);
});

test('byGroup lists groups by fee, individual clients last', () => {
  const r = buildClientGroupReport(TASKS, CLIENTS);
  assert.deepEqual(r.byGroup.map((g) => g.group), ['Mehta Group', 'Zen', '']);
  assert.equal(r.byGroup[0].works, 2);
});

test('distinctGroups merges spellings and drops blanks', () => {
  assert.deepEqual(distinctGroups(CLIENTS), ['Mehta Group', 'Zen']);
  assert.equal(clientLabel({ name: 'Only A Person' }), 'Only A Person');
});

test('#205: contact designation is a fixed list; the alternative number is validated; both can be cleared', () => {
  const base = { name: 'A', email: 'a@b.test', phone: '9876543210', role: 'client', professionalName: 'Ref' };
  assert.equal(createUserSchema.safeParse({ ...base, contactDesignation: 'Director', altPhone: '9123456780' }).success, true);
  assert.equal(createUserSchema.safeParse({ ...base, contactDesignation: 'Chief Wizard' }).success, false);
  assert.equal(createUserSchema.safeParse({ ...base, altPhone: 'call me' }).success, false);
  assert.equal(updateUserSchema.safeParse({ contactDesignation: '', altPhone: '' }).success, true);
});

test('#206: the report query accepts only a well-formed year and strips unknown keys', () => {
  assert.equal(clientGroupFeesQuerySchema.safeParse({ fy: '2026-27', group: 'X' }).success, true);
  assert.equal(clientGroupFeesQuerySchema.safeParse({ fy: '26-27' }).success, false);
  assert.deepEqual(clientGroupFeesQuerySchema.parse({ workspaceId: 'other' }), {});
});
