import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import {
  apiAs, createMatter, deleteDefinition, deleteMatter, deleteWorksheetRecordsMatching, getMatter, getWorksheetSheet, listWorksheet,
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

/**
 * The matter page renders its step list once per screen-size layout and hides all
 * but one with CSS, so an id matches several rows. Only the visible one counts.
 */
const visibleRow = (page: Page, selector: string) => page.locator(selector).filter({ visible: true });

async function openView(page: Page, label: string) {
  await page.goto('reports/gst-returns');
  await expect(page.getByRole('heading', { name: 'GST Return Filing' })).toBeVisible();
  await page.getByLabel('Return filing', { exact: true }).selectOption({ label });
  // #279: the sheet opens on the period being filed now; these tests look across all periods.
  await page.getByLabel('Return period', { exact: true }).selectOption({ label: 'All periods' });
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

  // #294: completing the GSTR-1 filing task without saving a date sets NO date.
  await transition('admin', matterId, { type: 'COMPLETE_STEP' });
  await expect(async () => {
    const [rec] = (await listWorksheet('admin', matterSheet)).filter((x) => x.values.matter === matterId);
    expect(rec.values.current_status).toBe('Proceed Towards GSTR-3B Filing');
    expect(rec.values.gstr1_date ?? null).toBeNull();
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

/** 'YYYY-MM-DD' → '11 November 2026'. */
function longOf(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })} ${y}`;
}

async function matterRecord() {
  const [rec] = (await listWorksheet('admin', matterSheet)).filter((x) => x.values.matter === matterId);
  return rec;
}

test('#292 / #294 "Add Filing Date" beside the current filing task: the saved date shows, completing sets none — staff and client', async ({ adminPage, clientPage }) => {
  const frequency = matterSheet === 'gst_return_quarterly' ? 'quarterly' : 'monthly';
  const period = expectedPeriod(frequency);
  const admin = await apiAs('admin');
  const today = ((await (await admin.get(`/api/tasks/${matterId}`)).json()).gstFilingDateBounds as { max: string }).max;
  await admin.dispose();
  // The previous test completed "GSTR-1 filed" without a date; GSTR-3B is the current task.
  await adminPage.goto(`tasks/${matterId}`);
  await expect(adminPage.getByTestId('gst-filing-period')).toContainText(period, { timeout: 20_000 });
  await expect(adminPage.getByText(/GSTR-1 filed on/)).toHaveCount(0); // completion set no date
  await expect(adminPage.getByRole('button', { name: 'Add GSTR-1 filing date' }).first()).toBeVisible();

  // Beside the current task: Add Filing Date, pick the date, save — then complete the task.
  const slot = adminPage.getByTestId('gst-filing-slot').filter({ visible: true });
  await slot.getByRole('button', { name: 'Add GSTR-3B filing date' }).click();
  await adminPage.getByLabel('GSTR-3B filed on').filter({ visible: true }).fill(today);
  await adminPage.getByRole('button', { name: 'Save', exact: true }).filter({ visible: true }).click();
  await expect(adminPage.getByText(`GSTR-3B filed on: ${longOf(today)}`).first()).toBeVisible({ timeout: 20_000 });

  await transition('admin', matterId, { type: 'COMPLETE_STEP' });
  await adminPage.reload();
  await expect(adminPage.getByText(`GSTR-3B filed on: ${longOf(today)}`).first()).toBeVisible({ timeout: 20_000 });
  // Next to each task's name, once completed tasks are shown. A fully completed
  // matter already lists them ("Hide completed"); only expand when offered.
  const showCompleted = adminPage.getByRole('button', { name: /Show completed/ });
  if (await showCompleted.isVisible().catch(() => false)) await showCompleted.click();
  await expect(visibleRow(adminPage, '#step-row-3')).toContainText(`Filed on: ${longOf(today)}`);
  await expect(visibleRow(adminPage, '#step-row-2').getByText(/Filed on/)).toHaveCount(0);
  await expect(visibleRow(adminPage, '#step-row-1').getByText(/Filed on/)).toHaveCount(0);

  // The sheet follows the matter: GSTR-3B's saved date, no GSTR-1 date (none saved).
  await expect(async () => {
    const rec = await matterRecord();
    expect(rec.values.gstr3b_date).toBe(today);
    expect(rec.values.gstr1_date ?? null).toBeNull();
  }).toPass({ timeout: 45_000, intervals: [2_000, 5_000, 8_000] });

  // The All Matters list carries the month.
  await adminPage.goto('tasks');
  await adminPage.getByPlaceholder(/Search by client/).fill(ORG);
  await expect(adminPage.getByTestId('gst-filing-period').first()).toContainText(period, { timeout: 20_000 });

  // The client sees the saved date, never the Add / Change controls.
  await clientPage.goto(`tasks/${matterId}`);
  await expect(clientPage.getByTestId('gst-filing-period')).toContainText(period, { timeout: 20_000 });
  await expect(clientPage.getByText(`GSTR-3B filed on: ${longOf(today)}`).first()).toBeVisible();
  await expect(clientPage.getByText(/GSTR-1 filed on/)).toHaveCount(0);
  await expect(clientPage.getByRole('button', { name: /Add GSTR-1 filing date|Change GSTR-3B filing date/ })).toHaveCount(0);
});

test('#294 staff add the GSTR-1 date afterwards and change it; the history and the sheet follow — the sheet cannot change it, clients cannot', async ({ adminPage, clientPage }) => {
  const admin = await apiAs('admin');
  const task = await (await admin.get(`/api/tasks/${matterId}`)).json();
  const bounds = task.gstFilingDateBounds as { min: string; max: string };
  const gstr1 = (task.gstFilings as { stepNumber: number; form: string }[]).find((f) => f.form === 'GSTR-1')!;
  const url = `/api/tasks/${matterId}/steps/${gstr1.stepNumber}/filed-on`;

  // Guards: clients (and professionals) are refused; the range is enforced.
  const client = await apiAs('client');
  expect((await client.put(url, { data: { date: bounds.max } })).status()).toBe(403);
  await client.dispose();
  try {
    const pro = await apiAs('pro');
    expect((await pro.put(url, { data: { date: bounds.max } })).status()).toBe(403);
    await pro.dispose();
  } catch { /* no professional test account on this database */ }
  expect((await admin.put(url, { data: { date: '2999-01-01' } })).status()).toBe(400);
  expect((await admin.put(url, { data: { date: '2000-01-01' } })).status()).toBe(400);
  expect((await admin.put(url, { data: { date: '2026-02-30' } })).status()).toBe(400);
  await admin.dispose();

  // Added from the header (the task is completed, so it is folded away in the list).
  await adminPage.goto(`tasks/${matterId}`);
  await adminPage.getByRole('button', { name: 'Add GSTR-1 filing date' }).first().click();
  await adminPage.getByLabel('GSTR-1 filed on').filter({ visible: true }).fill(bounds.max);
  await adminPage.getByRole('button', { name: 'Save', exact: true }).filter({ visible: true }).click();
  await expect(adminPage.getByText(`GSTR-1 filed on: ${longOf(bounds.max)}`).first()).toBeVisible({ timeout: 20_000 });
  await expect(adminPage.getByText(`GSTR-1 filing date set to ${longOf(bounds.max)}.`).first()).toBeVisible();
  let finalDate = bounds.max;

  // Changed: the history says from what to what. (Not possible on the first day a return can be filed.)
  if (bounds.min && bounds.min < bounds.max) {
    await adminPage.getByRole('button', { name: 'Change GSTR-1 filing date' }).first().click();
    await adminPage.getByLabel('GSTR-1 filed on').filter({ visible: true }).fill(bounds.min);
    await adminPage.getByRole('button', { name: 'Save', exact: true }).filter({ visible: true }).click();
    await expect(adminPage.getByText(`GSTR-1 filed on: ${longOf(bounds.min)}`).first()).toBeVisible({ timeout: 20_000 });
    await expect(adminPage.getByText(`GSTR-1 filing date changed from ${longOf(bounds.max)} to ${longOf(bounds.min)}.`).first()).toBeVisible();
    finalDate = bounds.min;
  }
  await expect(adminPage.getByText(`GSTR-3B filed on: ${todayLong()}`).first()).toBeVisible(); // its own date is untouched

  // The sheet's Date of GSTR-1 Filing follows; it is changed on the matter, not typed over.
  let recId = '';
  await expect(async () => {
    const rec = await matterRecord();
    expect(rec.values.gstr1_date).toBe(finalDate);
    recId = rec.id;
  }).toPass({ timeout: 45_000, intervals: [2_000, 5_000, 8_000] });
  const team = await apiAs('team');
  const typed = await team.patch(`/api/worksheets/sheets/${matterSheet}/records/${recId}`, { data: { values: { gstr1_date: bounds.max === finalDate ? bounds.min : bounds.max } } });
  expect(typed.status()).toBe(409);
  await team.dispose();

  // The client sees the date, not the history entry or the controls.
  await clientPage.goto(`tasks/${matterId}`);
  await expect(clientPage.getByText(`GSTR-1 filed on: ${longOf(finalDate)}`).first()).toBeVisible({ timeout: 20_000 });
  await expect(clientPage.getByRole('button', { name: /GSTR-1 filing date/ })).toHaveCount(0);
  await expect(clientPage.getByText(/filing date (set|changed)/)).toHaveCount(0);
});

test('#294 a matter writes only to its own row: the Matter cell cannot tie it to another client\'s row, or to a second row', async () => {
  const frequency = matterSheet === 'gst_return_quarterly' ? 'quarterly' : 'monthly';
  const team = await apiAs('team');
  try {
    const other = await team.post(`/api/worksheets/sheets/${matterSheet}/records`, { data: { values: {
      client_name: `${RUN} Other Client`, gstin: `21${RUN}W1`, period: expectedPeriod(frequency),
    } } });
    expect(other.status(), await other.text()).toBe(201);
    const otherId = (await other.json()).id as string;
    // Another client's row: refused, and the row is not linked.
    const link = await team.patch(`/api/worksheets/sheets/${matterSheet}/records/${otherId}`, { data: { values: { matter: matterId } } });
    expect(link.status()).toBe(409);
    expect((await link.json()).message).toMatch(/not this row's client and return period/);
    // A second, blank row for the same matter: refused — the matter already has its row.
    const second = await team.post(`/api/worksheets/sheets/${matterSheet}/records`, { data: { values: { remarks: `${RUN} second`, matter: matterId } } });
    expect(second.status()).toBe(409);
    expect((await second.json()).message).toMatch(/already has its own row/);
  } finally { await team.dispose(); }
  // The matter's own row is untouched, and the other row still has its own client.
  const rows = await listWorksheet('admin', matterSheet);
  expect(rows.filter((x) => x.values.matter === matterId).map((x) => x.values.client_name)).toEqual([ORG]);
  expect(rows.find((x) => x.values.client_name === `${RUN} Other Client`)?.values.matter ?? null).toBeNull();
});

test('#219 a matter created with "Repeats: Quarterly" is quarterly everywhere: tag, sheet row, email subject — and so is its copy', async ({ adminPage }) => {
  const QORG = `${RUN} Quarterly Pvt Ltd`;
  const quarter = expectedPeriod('quarterly');
  const admin = await apiAs('admin');
  let qId = '';
  let copyId = '';
  try {
    // What Create Matter sends when "Repeats" is set to Quarterly.
    const res = await admin.post('/api/tasks', { data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey: SERVICE, organisation: QORG, recurrence: 'quarterly',
      paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
    } });
    expect(res.ok(), await res.text()).toBeTruthy();
    qId = (await res.json()).id as string;

    // The matter: quarterly, the quarter as its period, and the subject every email of it carries.
    const body = await (await admin.get(`/api/tasks/${qId}`)).json();
    expect(body.gstFrequency).toBe('quarterly');
    expect(body.gstFilingPeriodLabel).toBe(quarter);
    expect(body.gstEmailSubject).toBe(`${QORG} - GST Return - ${quarter}`);

    // (a) The tag on the matter page (it renders once per screen-size layout).
    await adminPage.goto(`tasks/${qId}`);
    const tag = adminPage.getByTestId('gst-filing-period').filter({ visible: true });
    await expect(tag).toContainText(quarter, { timeout: 20_000 });
    await expect(tag).toHaveAttribute('title', 'Filing quarter');

    // (c) The sheet: a row in Quarterly with the quarter, never in Monthly.
    await openView(adminPage, 'Quarterly');
    await expect(row(adminPage, QORG)).toContainText(quarter, { timeout: 30_000 });
    await openView(adminPage, 'Monthly');
    await expect(row(adminPage, QORG)).toHaveCount(0);

    // A copy is not recurring, yet it stays quarterly.
    const dup = await admin.post(`/api/tasks/${qId}/duplicate`);
    expect(dup.status(), await dup.text()).toBe(201);
    copyId = (await dup.json()).id as string;
    const copy = await (await admin.get(`/api/tasks/${copyId}`)).json();
    expect(copy.recurrence ?? null).toBeNull();
    expect(copy.gstFrequency).toBe('quarterly');
    expect(copy.gstEmailSubject).toBe(`${QORG} - GST Return - ${quarter}`);
  } finally {
    await admin.dispose();
    if (copyId) await deleteMatter(copyId);
    if (qId) await deleteMatter(qId);
  }
});

test('#219 the run\'s matter (no "Repeats"): its email subject names its own period', async () => {
  const period = expectedPeriod(matterSheet === 'gst_return_quarterly' ? 'quarterly' : 'monthly');
  const body = await getMatter(matterId);
  expect(body.gstEmailSubject).toBe(`${ORG} - GST Return - ${period}`);
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
    expect(body.gstEmailSubject).toBeUndefined(); // #219: its emails keep the standard subject
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

test('#279 Completion Check is a dropdown (Done / Pending) with editable choices', async ({ teamPage }) => {
  await openView(teamPage, 'Monthly');
  await teamPage.getByRole('button', { name: 'Add record' }).click();
  const field = teamPage.getByLabel('Completion Check', { exact: true });
  await expect(field.locator('option', { hasText: 'Done' })).toHaveCount(1);
  await expect(field.locator('option', { hasText: 'Pending' })).toHaveCount(1);
  await teamPage.getByRole('button', { name: 'Cancel', exact: true }).click();
  await teamPage.getByRole('button', { name: 'Edit dropdowns' }).click();
  await expect(teamPage.getByLabel('Dropdown column').locator('option', { hasText: 'Completion Check' })).toHaveCount(1);
});

test('#279 Return Period filter: options follow Monthly / Quarterly, default is the period being filed now', async ({ adminPage }) => {
  await adminPage.goto('reports/gst-returns');
  const picker = adminPage.getByLabel('Return filing', { exact: true });
  const period = adminPage.getByLabel('Return period', { exact: true });
  await picker.selectOption({ label: 'Monthly' });
  await expect(period).toHaveValue(expectedPeriod('monthly'), { timeout: 20_000 });
  const monthly = await period.locator('option').allInnerTexts();
  expect(monthly[0]).toBe('All periods');
  expect(monthly[1]).toBe(expectedPeriod('monthly'));
  expect(monthly.slice(1, 25).every((t) => /^[A-Z][a-z]+ \d{4}$/.test(t))).toBeTruthy();

  await picker.selectOption({ label: 'Quarterly' });
  await expect(period).toHaveValue(expectedPeriod('quarterly'));
  const quarterly = await period.locator('option').allInnerTexts();
  expect(quarterly[1]).toMatch(/^Q[1-4] \d{2}-\d{2} \([A-Z][a-z]+–[A-Z][a-z]+\)$/);

  // The run's matter shows under its period in its own view, and not under an older one.
  await picker.selectOption({ label: matterSheetLabel });
  await adminPage.getByLabel('Search this sheet').fill(ORG);
  await expect(adminPage.locator('tr', { hasText: ORG })).toHaveCount(1, { timeout: 20_000 });
  await period.selectOption({ index: 2 }); // the period before
  await expect(adminPage.locator('tr', { hasText: ORG })).toHaveCount(0);
});

test('#279 GST Pswd: never in a list, given to staff only, masked; a click copies it and opens the GST portal', async ({ teamPage }) => {
  const secret = `Pw<${RUN}>&1`;
  const team = await apiAs('team');
  const created = await team.post('/api/worksheets/sheets/gst_return_monthly/records', { data: { values: {
    client_name: `${RUN} Secret Pvt Ltd`, gstin: `21${RUN}Q9`, period: expectedPeriod('monthly'), gst_user_id: `user${RUN}`, gst_password: secret,
  } } });
  expect(created.status(), await created.text()).toBe(201);
  const rec = await created.json();
  expect(JSON.stringify(rec)).not.toContain(secret);
  expect(rec.secretsSet).toEqual({ gst_password: true });
  // The list never carries it.
  const list = await team.get('/api/worksheets/sheets/gst_return_monthly/records?limit=500');
  expect(await list.text()).not.toContain(secret);
  // Staff fetch one row on demand.
  const url = `/api/worksheets/sheets/gst_return_monthly/records/${rec.id}/secrets/gst_password/reveal`;
  const shown = await team.post(url);
  expect(shown.status()).toBe(200);
  expect(await shown.json()).toMatchObject({ value: secret, userId: `user${RUN}`, loginUrl: 'https://services.gst.gov.in/services/login' });
  await team.dispose();
  // Clients (and professionals) never.
  const client = await apiAs('client');
  expect((await client.post(url)).status()).toBe(403);
  await client.dispose();
  try {
    const pro = await apiAs('pro');
    expect((await pro.post(url)).status()).toBe(403);
    await pro.dispose();
  } catch { /* no professional test account on this database */ }

  // In the sheet: masked; clicking it copies the password and opens the GST portal.
  await teamPage.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await openView(teamPage, 'Monthly');
  const r = row(teamPage, `${RUN} Secret`);
  await expect(r).toContainText('••••••••', { timeout: 20_000 });
  await expect(r).not.toContainText(secret);
  const [portal] = await Promise.all([
    teamPage.context().waitForEvent('page'),
    r.getByRole('button', { name: 'Log in to the GST portal' }).click(),
  ]);
  await expect.poll(() => portal.url()).toContain('services.gst.gov.in');
  await portal.close();
  expect(await teamPage.evaluate(() => navigator.clipboard.readText())).toBe(secret);
  await expect(r).not.toContainText(secret);
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
