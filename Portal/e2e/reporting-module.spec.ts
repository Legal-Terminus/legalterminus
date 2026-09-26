import { test, expect } from './fixtures';
import { request } from '@playwright/test';
import {
  apiAs, idToken, getReportingGrants, setReportingGrants, withGrant, deleteLead, type SectionGrants,
} from './api';
import { env } from './helpers';

/**
 * #196 / #197 — the Reporting module.
 *
 * This suite runs against the firm's LIVE project, so it never touches real
 * figures: sheet entries are written to May 2001 and cleared afterwards, and the
 * grant table is snapshotted and restored.
 */

// Serial: the tests share the grant table and the May-2001 sheet days.
test.describe.configure({ mode: 'serial' });

const TEAM = () => env('E2E_TEAM_UID');
const MONTH = '2001-05';
const DAYS = ['2001-05-10', '2001-05-11'];
let original: SectionGrants;

test.beforeAll(async () => { original = await getReportingGrants(); });
test.afterAll(async () => {
  if (original) await setReportingGrants(original);
  const admin = await apiAs('admin');
  for (const sheet of ['dm_cost', 'dm_income', 'cold_calling']) {
    for (const d of [...DAYS, '2001-04-02']) await admin.delete(`/api/marketing/sheets/${sheet}/days/${d}`);
  }
  await admin.dispose();
});

async function asTeam() {
  return request.newContext({
    baseURL: process.env.E2E_API_BASE ?? 'http://localhost:5001',
    extraHTTPHeaders: { Authorization: `Bearer ${await idToken('team')}`, 'Content-Type': 'application/json' },
  });
}

/* ── Access ───────────────────────────────────────────────────────────── */

test('access: none → 403; view → read only; edit → can write', async () => {
  await setReportingGrants(withGrant(original, TEAM(), { leads: null, dm_cost: null }));
  let team = await asTeam();
  expect((await team.get('/api/leads')).status()).toBe(403);
  expect((await team.get(`/api/marketing/sheets/dm_cost?month=${MONTH}`)).status()).toBe(403);
  await team.dispose();

  await setReportingGrants(withGrant(original, TEAM(), { leads: 'view', dm_cost: 'view' }));
  team = await asTeam();
  expect((await team.get('/api/leads')).status()).toBe(200);
  expect((await team.post('/api/leads', { data: { fullName: 'Nope', phone: '9990001234' } })).status()).toBe(403);
  const view = await team.get(`/api/marketing/sheets/dm_cost?month=${MONTH}`);
  expect(view.status()).toBe(200);
  expect((await view.json()).canEdit).toBe(false);
  expect((await team.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { google: { gst: 1 } } } })).status()).toBe(403);
  await team.dispose();

  await setReportingGrants(withGrant(original, TEAM(), { dm_cost: 'edit' }));
  team = await asTeam();
  expect((await team.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { google: { gst: 1 } } } })).status()).toBe(200);
  // The grant table itself is admin-only.
  expect((await team.get('/api/marketing/access')).status()).toBe(403);
  await team.dispose();
});

test('access: Reporting is view-only even when "edit" is requested; clients are never granted', async () => {
  const saved = await (async () => {
    await setReportingGrants(withGrant(withGrant(original, TEAM(), { reporting: 'edit' }), env('E2E_CLIENT_UID'), { leads: 'edit' }));
    return getReportingGrants();
  })();
  expect(saved.reporting[TEAM()]).toBe('view');
  expect(saved.leads[env('E2E_CLIENT_UID')]).toBeUndefined();
});

test('a team member with no grant sees a clear no-access page', async ({ teamPage }) => {
  await setReportingGrants(withGrant(original, TEAM(), { leads: null, dm_cost: null, dm_income: null, cold_calling: null, reporting: null }));
  await teamPage.goto('reports/leads');
  await expect(teamPage.getByText("You don't have access to leads")).toBeVisible();
  await teamPage.goto('reports/marketing');
  await expect(teamPage.getByText("You don't have access to any marketing report")).toBeVisible();
});

/* ── #196 lead fields ─────────────────────────────────────────────────── */

test('#196: a lead carries the sheet fields and a sequential Ref No.', async () => {
  const admin = await apiAs('admin');
  const ids: string[] = [];
  try {
    const make = async (extra: Record<string, unknown>) => {
      const res = await admin.post('/api/leads', { data: { fullName: `E2E Sheet ${Date.now()}`, phone: '9990001122', ...extra } });
      expect(res.status(), await res.text()).toBe(201);
      const b = await res.json(); ids.push(b.id); return b;
    };
    const a = await make({
      leadDate: '2026-09-01', leadSource: 'Meta Ads', company: 'Acme Pvt Ltd', organisationObjects: 'Manufacturing widgets',
      serviceRequired: 'GST Registration', proposalSentOn: '2026-09-02', lastFollowUp: '2026-09-05', notes: 'Called twice',
      outcome: 'not_converted', outcomeRemarks: 'Price too high',
    });
    const b = await make({});
    expect(a.refId).toMatch(/^LD-\d{4,}$/);
    expect(Number(b.refId.slice(3))).toBe(Number(a.refId.slice(3)) + 1);

    const list = await (await admin.get('/api/leads')).json() as Array<Record<string, unknown>>;
    const row = list.find((l) => l.id === a.id)!;
    expect(row).toMatchObject({
      leadDate: '2026-09-01', leadSource: 'Meta Ads', organisationObjects: 'Manufacturing widgets',
      serviceRequired: 'GST Registration', proposalSentOn: '2026-09-02', lastFollowUp: '2026-09-05',
      outcome: 'not_converted', outcomeRemarks: 'Price too high',
    });

    // Converting clears the remark: remarks belong to a lead that did NOT convert.
    const upd = await (await admin.patch(`/api/leads/${a.id}`, { data: { outcome: 'converted' } })).json();
    expect(upd.outcome).toBe('converted');
    expect(upd.outcomeRemarks).toBe('');

    // Off-list values are refused.
    expect((await admin.post('/api/leads', { data: { fullName: 'X', phone: '9990001122', leadSource: 'Carrier pigeon' } })).status()).toBe(400);
  } finally {
    await admin.dispose();
    for (const id of ids) await deleteLead(id);
  }
});

test('#196: the form shows Remarks only for Not Converted / Wrong Enquiry', async ({ adminPage }) => {
  await adminPage.goto('reports/leads');
  await adminPage.getByRole('button', { name: 'Add Lead' }).click();
  const drawer = adminPage.getByRole('dialog', { name: 'Add Lead' });
  await expect(drawer.getByLabel('Lead Source')).toBeVisible();
  const outcome = drawer.getByLabel('Converted / Not Converted / Wrong Enquiry');
  await expect(drawer.getByLabel(/^Remarks/)).toHaveCount(0);
  await outcome.selectOption('wrong_enquiry');
  await expect(drawer.getByLabel(/^Remarks/)).toBeVisible();
  await outcome.selectOption('converted');
  await expect(drawer.getByLabel(/^Remarks/)).toHaveCount(0);
});

/* ── #197 sheets and reporting ────────────────────────────────────────── */

test('#197: totals, month total and FY cumulative are calculated', async () => {
  const admin = await apiAs('admin');
  try {
    await admin.put('/api/marketing/sheets/dm_cost/days/2001-04-02', { data: { values: { google: { trademark: 100 } } } });
    await admin.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { google: { trademark: 1000, gst: 500 }, fb: { fssai: 300 } } } });
    const saved = await (await admin.put(`/api/marketing/sheets/dm_cost/days/${DAYS[1]}`, { data: { values: { fb: { gst: 200 } } } })).json();
    expect(saved.total).toBe(200);

    const v = await (await admin.get(`/api/marketing/sheets/dm_cost?month=${MONTH}`)).json();
    const day = v.rows.find((r: { date: string }) => r.date === DAYS[0]);
    expect(day.groupTotals).toEqual({ google: 1500, fb: 300 });
    expect(day.total).toBe(1800);
    expect(v.monthTotal.total).toBe(2000);
    expect(v.cumulative.from).toBe('2001-04-01');
    expect(v.cumulative.total).toBe(2100); // includes 2 April
    // A save of one group keeps the other group's figures.
    await admin.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { fb: { fssai: 400 } } } });
    const again = await (await admin.get(`/api/marketing/sheets/dm_cost?month=${MONTH}`)).json();
    expect(again.rows.find((r: { date: string }) => r.date === DAYS[0]).total).toBe(1900);

    // Unknown columns, negative amounts, fractional client counts and future dates are refused.
    expect((await admin.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { google: { nope: 1 } } } })).status()).toBe(400);
    expect((await admin.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { google: { gst: -5 } } } })).status()).toBe(400);
    expect((await admin.put(`/api/marketing/sheets/dm_income/days/${DAYS[0]}`, { data: { values: { google: { convert: 1.5 } } } })).status()).toBe(400);
    expect((await admin.put('/api/marketing/sheets/dm_cost/days/2099-01-01', { data: { values: { google: { gst: 1 } } } })).status()).toBe(400);
  } finally { await admin.dispose(); }
});

test('#197: Reporting rolls up spend, income, clients, CAC and revenue-to-cost', async () => {
  const admin = await apiAs('admin');
  try {
    // Start from empty days: saves MERGE per column, so figures left by the
    // previous test would otherwise count here too.
    for (const sheet of ['dm_cost', 'dm_income', 'cold_calling']) {
      for (const d of [...DAYS, '2001-04-02']) await admin.delete(`/api/marketing/sheets/${sheet}/days/${d}`);
    }
    await admin.put(`/api/marketing/sheets/dm_cost/days/${DAYS[0]}`, { data: { values: { google: { trademark: 3000 }, fb: { gst: 1000 } } } });
    await admin.put(`/api/marketing/sheets/dm_income/days/${DAYS[0]}`, { data: { values: { google: { trademark: 9000, convert: 3 }, fb: { gst: 1000, convert: 1 } } } });
    await admin.put(`/api/marketing/sheets/cold_calling/days/${DAYS[0]}`, { data: { values: { cold: { itr: 2500, convert: 1 } } } });

    const r = await (await admin.get(`/api/marketing/reporting?from=${MONTH}&to=${MONTH}`)).json();
    const row = r.rows[0];
    expect(row.month).toBe(MONTH);
    expect(row).toMatchObject({
      spentGoogle: 3000, spentFb: 1000, spentBoth: 4000,
      incomeGoogle: 9000, incomeFb: 1000, incomeBoth: 10000,
      clientsGoogle: 3, clientsFb: 1, clientsTotal: 4,
      cac: 1000, revenueToCost: 2.5, coldCallingIncome: 2500,
    });
  } finally { await admin.dispose(); }
});

test('#197: the page offers the sections, and an admin can enter a figure', async ({ adminPage }) => {
  await adminPage.goto('reports/marketing');
  const report = adminPage.getByLabel('Report', { exact: true });
  await expect(report).toBeVisible();
  await expect(report.locator('option')).toHaveText(['DM Cost', 'DM Income', 'Cold Calling Income', 'Reporting']);
  await adminPage.getByLabel('Month', { exact: true }).fill(MONTH);
  const cell = adminPage.getByLabel(`GST (DM Google Ads) on ${DAYS[1]}`);
  await cell.fill('750');
  await cell.press('Enter');
  await expect.poll(async () => {
    const admin = await apiAs('admin');
    const v = await (await admin.get(`/api/marketing/sheets/dm_cost?month=${MONTH}`)).json();
    await admin.dispose();
    return v.rows.find((r: { date: string }) => r.date === DAYS[1]).values?.google?.gst;
  }).toBe(750);

  await report.selectOption('reporting');
  await expect(adminPage.getByText('CAC', { exact: true }).first()).toBeVisible();
});
