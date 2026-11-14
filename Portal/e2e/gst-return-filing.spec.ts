import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import {
  apiAs, createMatter, deleteDefinition, deleteMatter, deleteWorksheetRecordsMatching, getWorksheetSheet, listWorksheet,
  restoreWorksheetColumns, restoreWorksheetOptions, transition, type WsSheetLite,
} from './api';
import { env } from './helpers';

/**
 * #279 — GST Return Filing under Reports: a Monthly / Quarterly dropdown over
 * one register whose two sheets never share a record; rows of GST return
 * matters fill in and follow the workflow; staff add rows and edit dropdowns.
 *
 * Runs against QA's data. The spec makes its own GST-like service (task names
 * the sheet recognises), links it to the sheet for the run, opens one matter on
 * it, and afterwards deletes the matter, the rows it made (all marked with RUN),
 * the service, and puts the sheet's columns and Constitution choices back.
 */
test.describe.configure({ mode: 'serial' });

const RUN = `E2E${Date.now().toString(36).toUpperCase()}`;
const ORG = `${RUN} Traders`;
const MANUAL = `${RUN} Manual LLP`;
const SERVICE = `e2e-gstret-${Date.now()}`;
let defId = '';
let matterId = '';
let monthlySnapshot: WsSheetLite;
let constitutionBefore: string[] = [];
let matterSheet = 'gst_return_monthly';
let matterSheetLabel = 'Monthly';

/** The period a matter opened today is for: the month (or FY quarter) just ended, in India. */
function expectedPeriod(frequency: 'monthly' | 'quarterly'): string {
  const ist = new Date(Date.now() + 330 * 60_000);
  const y = ist.getUTCFullYear();
  const m = ist.getUTCMonth() + 1;
  if (frequency === 'monthly') {
    const pm = m === 1 ? 12 : m - 1;
    const py = m === 1 ? y - 1 : y;
    return `${new Date(Date.UTC(py, pm - 1, 1)).toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })} ${py}`;
  }
  const currentQ = m >= 4 ? Math.floor((m - 4) / 3) + 1 : 4;
  const fy = m >= 4 ? y : y - 1;
  const q = currentQ === 1 ? 4 : currentQ - 1;
  const start = currentQ === 1 ? fy - 1 : fy;
  return `Q${q} ${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

test.beforeAll(async () => {
  const admin = await apiAs('admin');
  try {
    defId = `e2e-gstret-${Date.now()}`;
    const res = await admin.post('/api/workflow-definitions', { data: {
      id: defId, name: `E2E GST Return ${RUN}`, initialStep: 1, serviceKeys: [SERVICE],
      steps: [
        { stepNumber: 1, title: 'Data received from client', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
        { stepNumber: 2, title: 'GSTR-1 filed', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 3 }] },
        // #294: the issue's own name for the GSTR-3B filing task.
        { stepNumber: 3, title: 'Proceed Towards GSTR-3B Filing', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 4 }] },
        { stepNumber: 4, title: 'Done', type: 'final' },
      ],
    } });
    expect(res.ok(), await res.text()).toBeTruthy();

    // The client's own GST setting decides Monthly or Quarterly for a matter opened by hand.
    const u = await (await admin.get(`/api/portal/users/${env('E2E_CLIENT_UID')}`)).json();
    if ((u.user ?? u).gstReturnFrequency === 'quarterly') { matterSheet = 'gst_return_quarterly'; matterSheetLabel = 'Quarterly'; }
  } finally { await admin.dispose(); }

  monthlySnapshot = await getWorksheetSheet('gst_return', 'gst_return_monthly');
  constitutionBefore = monthlySnapshot.columns.find((c) => c.key === 'constitution')?.options ?? [];
  // Link the run's service to the sheet (both views share columns and services).
  await restoreWorksheetColumns({ ...monthlySnapshot, linkedServices: [...monthlySnapshot.linkedServices, SERVICE] });
  matterId = await createMatter({ serviceKey: SERVICE, organisation: ORG });
});

test.afterAll(async () => {
  if (matterId) await deleteMatter(matterId);
  if (monthlySnapshot) {
    await restoreWorksheetColumns(monthlySnapshot).catch(() => {});
    await restoreWorksheetOptions('gst_return_monthly', 'constitution', constitutionBefore).catch(() => {});
  }
  for (const sheet of ['gst_return_monthly', 'gst_return_quarterly']) {
    await deleteWorksheetRecordsMatching(sheet, 'client_name', RUN).catch(() => {});
  }
  if (defId) await deleteDefinition(defId);
});

async function openView(page: Page, label: string) {
  await page.goto('reports/gst-returns');
  await expect(page.getByRole('heading', { name: 'GST Return Filing' })).toBeVisible();
  await page.getByLabel('Return filing', { exact: true }).selectOption({ label });
  await page.getByLabel('Search this sheet').fill(RUN);
}
const row = (page: Page, text: string) => page.locator('tr', { hasText: text });

test('team members open it from the dashboard: a Monthly / Quarterly dropdown over the firm\'s columns', async ({ teamPage }) => {
  await teamPage.goto('dashboard');
  await expect(teamPage.getByRole('link', { name: /GST Return Filing/ }).first()).toBeVisible();
  await teamPage.goto('reports/gst-returns');
  const select = teamPage.getByLabel('Return filing', { exact: true });
  await expect(select.locator('option')).toHaveCount(2, { timeout: 20_000 });
  expect(await select.locator('option').allInnerTexts()).toEqual(['Monthly', 'Quarterly']);
  // The grid renders once the first page of rows has loaded.
  await expect(teamPage.getByRole('button', { name: 'Sort by GST Return Clients' })).toBeVisible({ timeout: 20_000 });
  const headers = (await teamPage.locator('thead th').allInnerTexts()).map((t) => t.trim().toUpperCase()).filter((t) => t && t !== 'ACTIONS');
  expect(headers).toEqual([
    'SL. NO.', 'GST RETURN CLIENTS', 'CONSTITUTION', 'GSTN NO', 'MAIL ID FOR DATA COLLECTION', 'GST USER ID', 'GST PSWD',
    'CONTACT NO.', 'ASSIGN PERSON', 'CURRENT STATUS', 'DATA RECEIVED', 'TALLY/ EXCEL PREPARED', 'DATE OF GSTR-1 FILING',
    'GSTR-1 FILED MAIL', 'GSTR_2B RECO MAIL TO CLIENT', 'ADDITIONAL DATA OR CONFIRMATION RECEIVED FROM CLIENT',
    'CHALLAN MAIL TO THE CLIENT', 'CHALLAN PAID BY CLIENT', 'ANNUAL WORKING SHEET UPDATE', 'DATE OF GSTR-3B FILING',
    'COMPLETION CHECK', 'REMARKS', 'RETURN PERIOD', 'MATTER',
  ]);
  for (const name of ['Add record', 'Upload Excel', 'Edit dropdowns', 'Download Excel']) {
    await expect(teamPage.getByRole('button', { name })).toBeVisible();
  }
});

test('a GST return matter appears as a row and follows its workflow; a typed cell yields to the next workflow change', async ({ adminPage }) => {
  const frequency = matterSheet === 'gst_return_quarterly' ? 'quarterly' : 'monthly';
  await openView(adminPage, matterSheetLabel);
  const r = row(adminPage, ORG);
  await expect(r).toContainText('Data received from client', { timeout: 20_000 }); // Current Status = the current task
  await expect(r).toContainText(expectedPeriod(frequency));
  await expect(r.getByRole('link')).toHaveAttribute('href', new RegExp(`/tasks/${matterId}$`));

  // Staff type over Current Status…
  await r.getByRole('button', { name: 'Edit Current Status' }).click();
  const editor = adminPage.getByLabel('Current Status value');
  await editor.fill(`${RUN} waiting on client`);
  await editor.press('Enter');
  await expect(editor).toHaveCount(0, { timeout: 15_000 });

  // …then the data arrives and the task is completed in the matter.
  await transition('admin', matterId, { type: 'COMPLETE_STEP' });
  await expect(async () => {
    const [rec] = (await listWorksheet('admin', matterSheet)).filter((x) => x.values.matter === matterId);
    expect(rec.values.data_received).toBe('Yes');
    expect(rec.values.current_status).toBe('GSTR-1 filed'); // the workflow changed it: latest wins
  }).toPass({ timeout: 45_000, intervals: [2_000, 5_000, 8_000] });

  await transition('admin', matterId, { type: 'COMPLETE_STEP' });
  await expect(async () => {
    const [rec] = (await listWorksheet('admin', matterSheet)).filter((x) => x.values.matter === matterId);
    expect(rec.values.gstr1_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }).toPass({ timeout: 45_000, intervals: [2_000, 5_000, 8_000] });

  await openView(adminPage, matterSheetLabel);
  await expect(row(adminPage, ORG)).toContainText('Yes');
  // Never in the other view.
  await openView(adminPage, matterSheetLabel === 'Monthly' ? 'Quarterly' : 'Monthly');
  await expect(row(adminPage, ORG)).toHaveCount(0);
});

/** Today in India as the tag writes it: "11 November 2026". */
function todayLong(): string {
  const ist = new Date(Date.now() + 330 * 60_000);
  return `${ist.getUTCDate()} ${ist.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })} ${ist.getUTCFullYear()}`;
}

test('#292 / #294 the matter shows its Filing Month, and "Filed on" for GSTR-1 and then GSTR-3B — to staff and the client', async ({ adminPage, clientPage }) => {
  const frequency = matterSheet === 'gst_return_quarterly' ? 'quarterly' : 'monthly';
  const period = expectedPeriod(frequency);
  // The previous test completed "GSTR-1 filed"; GSTR-3B is the current task.
  await adminPage.goto(`tasks/${matterId}`);
  await expect(adminPage.getByTestId('gst-filing-period')).toContainText(period, { timeout: 20_000 });
  await expect(adminPage.getByText(`GSTR-1 filed on: ${todayLong()}`)).toBeVisible();
  await expect(adminPage.getByText(/GSTR-3B filed on/)).toHaveCount(0);

  await transition('admin', matterId, { type: 'COMPLETE_STEP' });
  await adminPage.reload();
  await expect(adminPage.getByText(`GSTR-3B filed on: ${todayLong()}`)).toBeVisible({ timeout: 20_000 });
  // Next to each task's name, separately, once completed tasks are shown.
  await adminPage.getByRole('button', { name: /Show completed/ }).click();
  await expect(adminPage.locator('#step-row-2')).toContainText(`Filed on: ${todayLong()}`);
  await expect(adminPage.locator('#step-row-3')).toContainText(`Filed on: ${todayLong()}`);
  await expect(adminPage.locator('#step-row-1').getByText(/Filed on/)).toHaveCount(0);

  // The All Matters list carries the month.
  await adminPage.goto('tasks');
  await adminPage.getByPlaceholder(/Search by client/).fill(ORG);
  await expect(adminPage.getByTestId('gst-filing-period').first()).toContainText(period, { timeout: 20_000 });

  // The client sees the same tags on their matter and in their list.
  await clientPage.goto(`tasks/${matterId}`);
  await expect(clientPage.getByTestId('gst-filing-period')).toContainText(period, { timeout: 20_000 });
  await expect(clientPage.getByText(`GSTR-1 filed on: ${todayLong()}`)).toBeVisible();
  await expect(clientPage.getByText(`GSTR-3B filed on: ${todayLong()}`)).toBeVisible();
});

/** 'YYYY-MM-DD' → '11 November 2026'. */
function longOf(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })} ${y}`;
}

test('#294 staff correct the GSTR-1 filing date; the matter, its history and the sheet all show it — clients cannot', async ({ adminPage, clientPage }) => {
  const admin = await apiAs('admin');
  const task = await (await admin.get(`/api/tasks/${matterId}`)).json();
  const bounds = task.gstFilingDateBounds as { min: string; max: string };
  const gstr1 = (task.gstFilings as { stepNumber: number; form: string }[]).find((f) => f.form === 'GSTR-1')!;
  // The matter is for the period that just ended, so its earliest filing day is the 1st of this month.
  test.skip(bounds.min >= bounds.max, 'Today is the first possible filing day — nothing earlier to correct to.');
  const url = `/api/tasks/${matterId}/steps/${gstr1.stepNumber}/filed-on`;

  // Guards: clients (and professionals) are refused; the range is enforced.
  const client = await apiAs('client');
  expect((await client.put(url, { data: { date: bounds.min } })).status()).toBe(403);
  await client.dispose();
  try {
    const pro = await apiAs('pro');
    expect((await pro.put(url, { data: { date: bounds.min } })).status()).toBe(403);
    await pro.dispose();
  } catch { /* no professional test account on this database */ }
  expect((await admin.put(url, { data: { date: '2999-01-01' } })).status()).toBe(400);
  expect((await admin.put(url, { data: { date: '2000-01-01' } })).status()).toBe(400);
  expect((await admin.put(url, { data: { date: '2026-02-30' } })).status()).toBe(400);
  await admin.dispose();

  // An admin corrects it from the header.
  await adminPage.goto(`tasks/${matterId}`);
  await adminPage.getByRole('button', { name: 'Correct GSTR-1 filing date' }).click();
  await adminPage.getByLabel('GSTR-1 filed on').fill(bounds.min);
  await adminPage.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(adminPage.getByText(`GSTR-1 filed on: ${longOf(bounds.min)}`)).toBeVisible({ timeout: 20_000 });
  await expect(adminPage.getByText(`GSTR-3B filed on: ${todayLong()}`)).toBeVisible(); // its own date is untouched
  await adminPage.getByRole('button', { name: /Show completed/ }).click();
  await expect(adminPage.locator(`#step-row-${gstr1.stepNumber}`)).toContainText(`Filed on: ${longOf(bounds.min)}`);
  // Recorded in the history: who, from what, to what.
  await expect(adminPage.getByText(`GSTR-1 filing date corrected from ${todayLong()} to ${longOf(bounds.min)}.`).first()).toBeVisible();

  // The sheet's Date of GSTR-1 Filing follows, and is corrected on the matter, not typed over.
  let recId = '';
  await expect(async () => {
    const [rec] = (await listWorksheet('admin', matterSheet)).filter((x) => x.values.matter === matterId);
    expect(rec.values.gstr1_date).toBe(bounds.min);
    recId = rec.id;
  }).toPass({ timeout: 45_000, intervals: [2_000, 5_000, 8_000] });
  const team = await apiAs('team');
  const typed = await team.patch(`/api/worksheets/sheets/${matterSheet}/records/${recId}`, { data: { values: { gstr1_date: bounds.max } } });
  expect(typed.status()).toBe(409);
  await team.dispose();

  // The client sees the corrected date, not the history entry.
  await clientPage.goto(`tasks/${matterId}`);
  await expect(clientPage.getByText(`GSTR-1 filed on: ${longOf(bounds.min)}`)).toBeVisible({ timeout: 20_000 });
  await expect(clientPage.getByRole('button', { name: 'Correct GSTR-1 filing date' })).toHaveCount(0);
  await expect(clientPage.getByText(/filing date corrected/)).toHaveCount(0);
});

test('#292 a matter of any other service has no Filing Month', async ({ adminPage }) => {
  // Any workflow-backed service the GST sheet is NOT linked to (workflows are editable — discover one).
  const admin0 = await apiAs('admin');
  const defs = await (await admin0.get('/api/workflow-definitions')).json() as { serviceKeys?: string[] }[];
  await admin0.dispose();
  const linked = new Set([...monthlySnapshot.linkedServices, SERVICE, 'gst-returns', 'gst-returns-quarterly']);
  const serviceKey = defs.flatMap((d) => d.serviceKeys ?? []).find((k) => !linked.has(k));
  test.skip(!serviceKey, 'No service outside the GST sheet to compare with.');
  const other = await createMatter({ serviceKey, organisation: `${RUN} Not GST` });
  try {
    await adminPage.goto(`tasks/${other}`);
    await expect(adminPage.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20_000 });
    await expect(adminPage.getByTestId('gst-filing-period')).toHaveCount(0);
    const admin = await apiAs('admin');
    const body = await (await admin.get(`/api/tasks/${other}`)).json();
    await admin.dispose();
    expect(body.gstFilingPeriodLabel).toBeUndefined();
  } finally {
    await deleteMatter(other);
  }
});

test('a manager adds a row by hand in Quarterly; Monthly does not show it, and cannot reach it', async ({ managerPage }) => {
  await openView(managerPage, 'Quarterly');
  await managerPage.getByRole('button', { name: 'Add record' }).click();
  await managerPage.getByLabel('GST Return Clients', { exact: true }).fill(MANUAL);
  await managerPage.getByLabel('CONSTITUTION', { exact: true }).selectOption('LLP');
  await managerPage.getByLabel('GSTN No', { exact: true }).fill(`21${RUN}Z5`);
  await managerPage.getByLabel('Return Period', { exact: true }).fill('Q2 2026-27');
  await managerPage.getByRole('button', { name: 'Add record' }).last().click();
  await expect(managerPage.getByText('Record added.')).toBeVisible();
  await managerPage.getByLabel('Search this sheet').fill(RUN);
  await expect(row(managerPage, MANUAL)).toContainText('LLP');

  await openView(managerPage, 'Monthly');
  await expect(row(managerPage, MANUAL)).toHaveCount(0);
  const [rec] = (await listWorksheet('manager', 'gst_return_quarterly')).filter((x) => x.values.client_name === MANUAL);
  const manager = await apiAs('manager');
  expect((await manager.patch(`/api/worksheets/sheets/gst_return_monthly/records/${rec.id}`, { data: { values: { remarks: 'x' } } })).status()).toBe(404);
  await manager.dispose();
});

test('Constitution choices: a team member adds one and it is offered when adding a record', async ({ teamPage }) => {
  const extra = `Trust ${RUN}`;
  await openView(teamPage, 'Monthly');
  await teamPage.getByRole('button', { name: 'Edit dropdowns' }).click();
  await teamPage.getByLabel('Dropdown column').selectOption({ label: 'CONSTITUTION' });
  await teamPage.getByLabel('New choice').fill(extra);
  await teamPage.getByRole('button', { name: 'Add choice' }).click();
  await teamPage.getByRole('button', { name: 'Save choices' }).click();
  await expect(teamPage.getByText('Choices for CONSTITUTION saved.')).toBeVisible();
  await teamPage.getByRole('button', { name: 'Back', exact: true }).click();
  // Shared by both views.
  await teamPage.getByLabel('Return filing', { exact: true }).selectOption({ label: 'Quarterly' });
  await teamPage.getByRole('button', { name: 'Add record' }).click();
  await expect(teamPage.getByLabel('CONSTITUTION', { exact: true }).locator('option', { hasText: extra })).toHaveCount(1);
});

test('guards: clients are kept out; only an admin changes columns; a write is validated', async ({ clientPage }) => {
  await clientPage.goto('reports/gst-returns');
  await expect(clientPage).not.toHaveURL(/\/reports\/gst-returns/);
  const client = await apiAs('client');
  expect((await client.get('/api/worksheets/modules/gst_return')).status()).toBe(403);
  expect((await client.get('/api/worksheets/sheets/gst_return_monthly/records')).status()).toBe(403);
  await client.dispose();

  const team = await apiAs('team');
  expect((await team.put('/api/worksheets/sheets/gst_return_monthly/columns', { data: { columns: [{ key: 'client_name', label: 'X' }] } })).status()).toBe(403);
  const bad = await team.post('/api/worksheets/sheets/gst_return_monthly/records', { data: { values: { nope: 'x' } } });
  expect(bad.status()).toBe(400);
  const badDate = await team.post('/api/worksheets/sheets/gst_return_monthly/records', { data: { values: { client_name: `${RUN} Bad`, gstr1_date: 'soon' } } });
  expect(badDate.status()).toBe(400);
  await team.dispose();
});
