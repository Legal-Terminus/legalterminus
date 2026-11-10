import * as XLSX from 'xlsx';
import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import {
  apiAs, createWorksheetRecord, deleteWorksheetRecordsMatching, getWorksheetSheet, listWorksheet, restoreWorksheetColumns,
  restoreWorksheetOptions, type WsSheetLite,
} from './api';

/**
 * #217 — the company worksheets on the shared worksheet engine, and the TDS
 * Sheet with staff-editable dropdowns (#280).
 *
 * Runs against QA's data: records carry a per-run marker and are deleted
 * afterwards; the one sheet whose columns this spec edits (Startup Odisha) is
 * snapshotted first and put back exactly.
 */
test.describe.configure({ mode: 'serial' });

const RUN = `E2E${Date.now().toString(36).toUpperCase()}`;
const UDYAM_1 = `UDYAM-${RUN}-01`;
const UDYAM_2 = `UDYAM-${RUN}-02`;
const TAN = `TAN${RUN}`;
let odishaSnapshot: WsSheetLite;
let tdsSnapshot: WsSheetLite;

test.beforeAll(async () => {
  odishaSnapshot = await getWorksheetSheet('company', 'startup_odisha');
  tdsSnapshot = await getWorksheetSheet('company', 'tds');
});
test.afterAll(async () => {
  if (odishaSnapshot) await restoreWorksheetColumns(odishaSnapshot);
  // #280: the TDS dropdown this spec edits goes back exactly as it was.
  const assigned = tdsSnapshot?.columns.find((c) => c.key === 'assigned_to');
  if (assigned) await restoreWorksheetOptions('tds', 'assigned_to', assigned.options ?? []);
  await deleteWorksheetRecordsMatching('tds', 'tan', RUN);
  await deleteWorksheetRecordsMatching('udyam', 'udyam_no', RUN);
  await deleteWorksheetRecordsMatching('kyc', 'din', RUN);
  await deleteWorksheetRecordsMatching('startup_odisha', 'registration_no', RUN);
});

async function openSheet(page: Page, label: string) {
  await page.goto('worksheets');
  await expect(page.getByRole('heading', { name: 'Worksheets' })).toBeVisible();
  await page.getByLabel('Worksheet', { exact: true }).selectOption({ label });
  await page.getByLabel('Search this sheet').fill(RUN);
}
const row = (page: Page, text: string) => page.locator('tr', { hasText: text });

test('the dropdown lists all fourteen worksheets and team members see Worksheets in the menu', async ({ teamPage }) => {
  await teamPage.goto('dashboard');
  await expect(teamPage.getByRole('link', { name: 'Worksheets' }).first()).toBeVisible();
  await teamPage.goto('worksheets');
  // The options come from the API: wait for them before reading.
  const select = teamPage.getByLabel('Worksheet', { exact: true });
  await expect(select.locator('option')).toHaveCount(14, { timeout: 20_000 });
  const options = await select.locator('option').allInnerTexts();
  expect(options).toEqual([
    'Incorporation Sheet', 'Auditor Master Sheet', 'KYC Sheet', 'Annual Filing Sheet', 'ROC Register', 'Strike Off Sheet',
    'Auditor Registration (ADT-3)', 'Startup Odisha Sheet', 'Startup India Sheet', 'GST Sheet', 'TDS Sheet', 'Udyam Sheet',
    'Professional Tax Sheet', 'FSSAI Sheet',
  ]);
});

test('admin adds a Udyam record', async ({ adminPage }) => {
  await openSheet(adminPage, 'Udyam Sheet');
  await adminPage.getByRole('button', { name: 'Add record' }).click();
  await adminPage.getByLabel('Client', { exact: true }).fill(`${RUN} Client`);
  await adminPage.getByLabel('Enterprise Name', { exact: true }).fill(`${RUN} Foods`);
  await adminPage.getByLabel('Udyam Registration No.', { exact: true }).fill(UDYAM_1);
  await adminPage.getByLabel('Enterprise Category', { exact: true }).selectOption('Small');
  await adminPage.getByRole('button', { name: 'Add record' }).last().click();
  await expect(adminPage.getByText('Record added.')).toBeVisible();
  await adminPage.getByLabel('Search this sheet').fill(RUN);
  await expect(row(adminPage, `${RUN} Foods`)).toContainText('Small');
});

test('a team member edits a cell in place', async ({ teamPage }) => {
  await openSheet(teamPage, 'Udyam Sheet');
  await row(teamPage, `${RUN} Foods`).getByRole('button', { name: 'Edit Remarks' }).click();
  const editor = teamPage.getByLabel('Remarks value');
  await editor.fill('Certificate sent');
  await editor.press('Enter');
  // The editor closes only once the save has come back. (While it is open, a
  // textarea's own text is the typed value, so the row "contains" it already.)
  await expect(editor).toHaveCount(0, { timeout: 15_000 });
  await expect(row(teamPage, `${RUN} Foods`)).toContainText('Certificate sent');
  const [rec] = (await listWorksheet('team', 'udyam')).filter((r) => r.values.udyam_no === UDYAM_1);
  expect(rec.values.remarks).toBe('Certificate sent');
});

test('KYC: the next KYC falls due three years after filing (leap day)', async ({ managerPage }) => {
  const rec = await createWorksheetRecord('kyc', {
    director_name: `${RUN} Director`, din: `${RUN}DIN`, financial_year: '2023-24', date_of_filing: '2024-02-29',
  });
  expect(rec.values.next_kyc_due).toBe('2027-02-28');
  await openSheet(managerPage, 'KYC Sheet');
  await expect(row(managerPage, `${RUN} Director`)).toContainText('28 Feb 2027');
  // Reminders are the system's: only an admin may force a run.
  const team = await apiAs('team');
  expect((await team.post('/api/worksheets/reminders/run')).status()).toBe(403);
  await team.dispose();
});

test('Excel upload updates by Udyam No., adds new rows and reports unknown columns', async ({ adminPage }) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ['Udyam Registration No', 'ENTERPRISE NAME', 'category', 'Shoe Size'],
    [UDYAM_1, `${RUN} Foods`, 'micro', '9'],
    [UDYAM_2, `${RUN} Textiles`, 'Medium', ''],
  ]), 'Sheet1');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

  await openSheet(adminPage, 'Udyam Sheet');
  await adminPage.getByRole('button', { name: 'Upload Excel' }).click();
  await adminPage.getByLabel('Excel file').setInputFiles({
    name: `${RUN}.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer,
  });
  await expect(adminPage.getByLabel('Upload preview')).toContainText('“Shoe Size”');
  await adminPage.getByRole('button', { name: 'Apply: add 1, update 1' }).click();
  await expect(adminPage.getByText(/Upload applied/)).toBeVisible();

  const rows = (await listWorksheet('admin', 'udyam')).filter((r) => String(r.values.udyam_no).includes(RUN));
  expect(rows).toHaveLength(2);
  const first = rows.find((r) => r.values.udyam_no === UDYAM_1)!;
  expect(first.values.category).toBe('Micro');                 // matched to the choice, case-insensitively
  expect(first.values.remarks).toBe('Certificate sent');      // untouched by the upload
});

test('filter, sort and search on a worksheet', async ({ managerPage }) => {
  await openSheet(managerPage, 'Udyam Sheet');
  await expect(row(managerPage, `${RUN} Foods`)).toBeVisible();
  await expect(row(managerPage, `${RUN} Textiles`)).toBeVisible();

  await managerPage.getByRole('button', { name: 'Sort by Enterprise Name' }).click();
  const asc = await managerPage.locator('tbody tr').allInnerTexts();
  expect(asc.findIndex((t) => t.includes(`${RUN} Foods`))).toBeLessThan(asc.findIndex((t) => t.includes(`${RUN} Textiles`)));
  await managerPage.getByRole('button', { name: 'Sort by Enterprise Name' }).click();
  const desc = await managerPage.locator('tbody tr').allInnerTexts();
  expect(desc.findIndex((t) => t.includes(`${RUN} Textiles`))).toBeLessThan(desc.findIndex((t) => t.includes(`${RUN} Foods`)));

  await managerPage.getByRole('button', { name: 'Filter Enterprise Category' }).click();
  await managerPage.getByLabel('Search Enterprise Category values').fill('Medium');
  await managerPage.locator('label', { hasText: /^Medium$/ }).locator('input').check();
  await expect(row(managerPage, `${RUN} Textiles`)).toBeVisible();
  await expect(row(managerPage, `${RUN} Foods`)).toHaveCount(0);
});

test('admin adds a column and hides one; values are kept', async ({ adminPage }) => {
  const rec = await createWorksheetRecord('startup_odisha', { registration_no: `SO-${RUN}`, company_name: `${RUN} Startup`, sector: 'Agritech' });
  const newColumn = `Zone ${RUN}`;
  await openSheet(adminPage, 'Startup Odisha Sheet');
  await adminPage.getByRole('button', { name: 'Edit columns' }).click();
  await adminPage.getByLabel('New column name').fill(newColumn);
  await adminPage.getByRole('button', { name: 'Add column' }).click();
  await adminPage.getByRole('button', { name: 'Hide Sector' }).click();
  await adminPage.getByRole('button', { name: 'Save columns' }).click();
  await expect(adminPage.getByText('Columns saved.')).toBeVisible();

  await adminPage.getByLabel('Search this sheet').fill(RUN);
  await expect(adminPage.getByRole('button', { name: `Sort by ${newColumn}` })).toBeVisible();
  await expect(adminPage.getByRole('button', { name: 'Sort by Sector' })).toHaveCount(0);
  // Hidden, not lost.
  const [kept] = (await listWorksheet('admin', 'startup_odisha')).filter((r) => r.id === rec.id);
  expect(kept.values.sector).toBe('Agritech');
});

test('a team member cannot change columns or delete records', async ({ teamPage }) => {
  await openSheet(teamPage, 'Udyam Sheet');
  await expect(row(teamPage, `${RUN} Foods`)).toBeVisible();
  await expect(teamPage.getByRole('button', { name: 'Edit columns' })).toHaveCount(0);
  await expect(teamPage.getByRole('button', { name: 'Delete record' })).toHaveCount(0);
  const [rec] = (await listWorksheet('team', 'udyam')).filter((r) => r.values.udyam_no === UDYAM_1);
  const team = await apiAs('team');
  expect((await team.put('/api/worksheets/sheets/udyam/columns', { data: { columns: [{ key: 'client', label: 'X' }] } })).status()).toBe(403);
  expect((await team.delete(`/api/worksheets/sheets/udyam/records/${rec.id}`)).status()).toBe(403);
  await team.dispose();
});

test('clients cannot reach the worksheets', async ({ clientPage }) => {
  await clientPage.goto('worksheets');
  await expect(clientPage).not.toHaveURL(/\/worksheets/);
  const client = await apiAs('client');
  expect((await client.get('/api/worksheets/modules/company')).status()).toBe(403);
  expect((await client.post('/api/worksheets/sheets/udyam/records', { data: { values: { client: 'x' } } })).status()).toBe(403);
  await client.dispose();
});

/* ── #280 TDS Sheet ─────────────────────────────────────────────────────── */

test('#280 the TDS Sheet has the firm\'s columns in the firm\'s order, starting with Sl. No.', async ({ managerPage }) => {
  await openSheet(managerPage, 'TDS Sheet');
  const headers = (await managerPage.locator('thead th').allInnerTexts()).map((t) => t.trim()).filter((t) => t && t !== 'Actions');
  expect(headers.map((h) => h.toUpperCase())).toEqual([
    'SL. NO.', 'COMPANY NAME', 'ASSIGNED TO', 'CHECKER', 'CLIENT', 'TAN NO', 'USER ID', 'TRACES PASSWORD', 'IT PASSWORD',
    'TDS DATA RECEIVED', 'EXCEL PREPARED', 'FINAL EXCEL MAIL TO CLIENT', 'CHALLAN PAID BY CLIENT',
    'SALARY (FORM 138) FILING DATE', 'NON-SALARY (FORM 140) FILING DATE', 'SALARY (FORM 138) PR NO',
    'NON-SALARY (FORM 140) PR NO', 'STATEMENT STATUS 26Q (FORM 140)', 'STATEMENT STATUS 24Q (FORM 138)',
  ]);
  for (const name of ['Add record', 'Upload Excel', 'Edit dropdowns', 'Download Excel']) {
    await expect(managerPage.getByRole('button', { name })).toBeVisible();
  }
});

test('#280 a team member adds an "Assigned to" choice; it is offered at once when adding a TDS record', async ({ teamPage }) => {
  const person = `${RUN} Person`;
  await openSheet(teamPage, 'TDS Sheet');
  await teamPage.getByRole('button', { name: 'Edit dropdowns' }).click();
  await teamPage.getByLabel('Dropdown column').selectOption({ label: 'Assigned to' });
  await teamPage.getByLabel('New choice').fill(person);
  await teamPage.getByRole('button', { name: 'Add choice' }).click();
  await teamPage.getByRole('button', { name: 'Save choices' }).click();
  await expect(teamPage.getByText('Choices for Assigned to saved.')).toBeVisible();
  await teamPage.getByRole('button', { name: 'Back', exact: true }).click();

  await teamPage.getByRole('button', { name: 'Add record' }).click();
  await teamPage.getByLabel('Company Name', { exact: true }).fill(`${RUN} Lift Irrigation Ltd`);
  await teamPage.getByLabel('Assigned to', { exact: true }).selectOption(person);
  await teamPage.getByLabel('TAN NO', { exact: true }).fill(TAN);
  await teamPage.getByLabel('TDS Data Received', { exact: true }).selectOption('Yes');
  await teamPage.getByLabel('SALARY (Form 138) PR NO', { exact: true }).fill('752309600068224');
  await teamPage.getByRole('button', { name: 'Add record' }).last().click();
  await expect(teamPage.getByText('Record added.')).toBeVisible();
  await teamPage.getByLabel('Search this sheet').fill(RUN);
  const r = row(teamPage, `${RUN} Lift Irrigation Ltd`);
  await expect(r).toContainText(person);
  await expect(r).toContainText('752309600068224');
  await expect(r.locator('td').nth(1)).toHaveText('1'); // Sl. No.
});

test('#280 TDS upload from the firm\'s layout: Sl. No. is skipped, rows match by TAN', async ({ adminPage }) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ['Sl. No.', 'Company Name', 'Assigned to', 'Checker', 'Client', 'TAN NO', 'USER ID', 'TDS Data Received', 'Excel Prepared',
      'SALARY (Form 138) FILING DATE'],
    [1, `${RUN} Lift Irrigation Ltd`, '', 'Biswal', 'MGGS', TAN, 'OLICLBBSR', 'Yes', 'YES', '27-10-2026'],
    [2, `${RUN} Second Ltd`, '', '', '', `${TAN}2`, '', 'No', '', ''],
  ]), 'Sheet1');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

  await openSheet(adminPage, 'TDS Sheet');
  await adminPage.getByRole('button', { name: 'Upload Excel' }).click();
  await adminPage.getByLabel('Excel file').setInputFiles({
    name: `${RUN}-tds.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer,
  });
  await adminPage.getByRole('button', { name: 'Apply: add 1, update 1' }).click();
  await expect(adminPage.getByText(/Upload applied/)).toBeVisible();

  const rows = (await listWorksheet('admin', 'tds')).filter((x) => String(x.values.tan).includes(RUN));
  expect(rows).toHaveLength(2);
  const first = rows.find((x) => x.values.tan === TAN)!;
  expect(first.values.excel_prepared).toBe('Yes');
  expect(first.values.salary_filing_date).toBe('2026-10-27');
  expect(first.values.assigned_to).toBe(`${RUN} Person`); // a blank cell never clears
});

test('#280 dropdown choices: clients are refused; only a dropdown column has choices', async () => {
  const client = await apiAs('client');
  expect((await client.put('/api/worksheets/sheets/tds/options/assigned_to', { data: { options: ['x'] } })).status()).toBe(403);
  await client.dispose();
  const team = await apiAs('team');
  const notSelect = await team.put('/api/worksheets/sheets/tds/options/tan', { data: { options: ['x'] } });
  expect(notSelect.status()).toBe(400);
  expect((await notSelect.json()).message).toMatch(/not a dropdown/);
  expect((await team.put('/api/worksheets/sheets/tds/options/assigned_to', { data: { options: 'x' } })).status()).toBe(400);
  await team.dispose();
});
