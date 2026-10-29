import * as XLSX from 'xlsx';
import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import { apiAs, createWorksheetRecord, deleteWorksheetRecordsMatching, listWorksheet } from './api';

/**
 * #210 — Trademark Reports: five reports in one dropdown over ONE record per
 * trademark (firm, 29 Oct 2026).
 *
 * Runs against QA's data: every record this spec makes carries a per-run marker
 * in its Application No. and trademark name, and is deleted afterwards.
 */
test.describe.configure({ mode: 'serial' });

const RUN = `E2E${Date.now().toString(36).toUpperCase()}`;
const NAME = `${RUN} Mark`;
const APP_NO = `${RUN}-1`;
const NEW_APP_NO = `${RUN}-2`;
const NEW_NAME = `${RUN} Uploaded`;

test.afterAll(async () => {
  for (const sheet of ['tm_master', 'tm_register']) await deleteWorksheetRecordsMatching(sheet, 'application_no', RUN);
});

async function openReport(page: Page, label: string) {
  await page.goto('reports/trademark');
  await expect(page.getByRole('heading', { name: 'Trademark Reports' })).toBeVisible();
  await page.getByLabel('Report', { exact: true }).selectOption({ label });
  await page.getByLabel('Search this sheet').fill(RUN);
}
const row = (page: Page, text: string) => page.locator('tr', { hasText: text });

test('admin adds a trademark that appears in two reports', async ({ adminPage }) => {
  await openReport(adminPage, 'TM Master');
  await adminPage.getByRole('button', { name: 'Add record' }).click();
  await adminPage.getByLabel('Trademark Name', { exact: true }).fill(NAME);
  await adminPage.getByLabel('Application No.', { exact: true }).fill(APP_NO);
  await adminPage.getByLabel('Client', { exact: true }).fill('Client One');
  await adminPage.getByLabel('Register TM').check();
  await adminPage.getByRole('button', { name: 'Add record' }).last().click();
  await expect(adminPage.getByText('Record added.')).toBeVisible();

  await adminPage.getByLabel('Search this sheet').fill(RUN);
  await expect(row(adminPage, NAME)).toBeVisible();
  await adminPage.getByLabel('Report', { exact: true }).selectOption({ label: 'Register TM' });
  await adminPage.getByLabel('Search this sheet').fill(RUN);
  await expect(row(adminPage, NAME)).toBeVisible();
});

test('a team member edits a common field in one report and it shows in the other', async ({ teamPage }) => {
  await openReport(teamPage, 'Register TM');
  await row(teamPage, NAME).getByRole('button', { name: 'Edit Client (Work Kisne Kiya Hai?)' }).click();
  const editor = teamPage.getByLabel('Client (Work Kisne Kiya Hai?) value');
  await editor.fill('Client Two');
  await editor.press('Enter');
  await expect(row(teamPage, NAME)).toContainText('Client Two');

  await teamPage.getByLabel('Report', { exact: true }).selectOption({ label: 'TM Master' });
  await teamPage.getByLabel('Search this sheet').fill(RUN);
  await expect(row(teamPage, NAME)).toContainText('Client Two');
});

test('renewal milestones are calculated from the registration date (leap day)', async () => {
  const [rec] = (await listWorksheet('admin', 'tm_register')).filter((r) => r.values.application_no === APP_NO);
  const api = await apiAs('admin');
  const res = await api.patch(`/api/worksheets/sheets/tm_register/records/${rec.id}`, { data: { values: { registration_date: '2016-02-29' } } });
  expect(res.status()).toBe(200);
  const saved = await res.json();
  expect(saved.values.renewal_9y).toBe('2025-02-28');
  expect(saved.values.renewal_9_5y).toBe('2025-08-29');
  expect(saved.values.renewal_10y).toBe('2026-02-28');
  expect(saved.values.renewal_11y).toBe('2027-02-28');
  // Calculated columns cannot be typed.
  expect((await api.patch(`/api/worksheets/sheets/tm_register/records/${rec.id}`, { data: { values: { renewal_10y: '2030-01-01' } } })).status()).toBe(400);
  await api.dispose();
});

test('Excel upload: dry run, then update by Application No., add new, report unknown columns', async ({ adminPage }) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ['APPLICATION NO.', 'TRADEMARK NAME', 'STATUS', 'NETSTAT SEI', 'DATE OF FILING TMA'],
    [APP_NO, NAME, 'Objected', 'x', '01/02/2020'],
    [NEW_APP_NO, NEW_NAME, 'Filed', '', ''],
  ]), 'TM MASTER');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

  await openReport(adminPage, 'TM Master');
  await adminPage.getByRole('button', { name: 'Upload Excel' }).click();
  await expect(adminPage.getByText('Logos pasted inside the Excel file are not imported.')).toBeVisible();
  await adminPage.getByLabel('Excel file').setInputFiles({
    name: `${RUN}.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer,
  });
  const preview = adminPage.getByLabel('Upload preview');
  await expect(preview).toBeVisible();
  await expect(preview).toContainText('“NETSTAT SEI”');
  await expect(adminPage.getByRole('button', { name: 'Apply: add 1, update 1' })).toBeVisible();

  // Nothing is written by the dry run.
  expect((await listWorksheet('admin', 'tm_master')).some((r) => r.values.application_no === NEW_APP_NO)).toBe(false);

  await adminPage.getByRole('button', { name: 'Apply: add 1, update 1' }).click();
  await expect(adminPage.getByText(/Upload applied/)).toBeVisible();
  await adminPage.getByLabel('Search this sheet').fill(RUN);
  await expect(row(adminPage, NEW_NAME)).toBeVisible();

  const rows = await listWorksheet('admin', 'tm_master');
  const updated = rows.find((r) => r.values.application_no === APP_NO)!;
  expect(updated.values.status).toBe('Objected');
  expect(updated.values.date_of_filing).toBe('2020-02-01');
  // The blank cells in the file did not clear what was there.
  expect(updated.values.client).toBe('Client Two');
  expect(rows.filter((r) => r.values.application_no === APP_NO)).toHaveLength(1);
});

test('filter, sort and search', async ({ managerPage }) => {
  await openReport(managerPage, 'TM Master');
  await expect(managerPage.getByText(/\d+ matches for/)).toBeVisible();
  await expect(row(managerPage, NAME)).toBeVisible();
  await expect(row(managerPage, NEW_NAME)).toBeVisible();
  // The search term is highlighted in the cells.
  await expect(row(managerPage, NAME).locator('mark').first()).toHaveText(RUN, { ignoreCase: true });

  // Sort by trademark name, descending: "… Uploaded" before "… Mark".
  await managerPage.getByRole('button', { name: 'Sort by Trademark Name' }).click();
  await managerPage.getByRole('button', { name: 'Sort by Trademark Name' }).click();
  const names = await managerPage.locator('tbody tr').allInnerTexts();
  expect(names.findIndex((t) => t.includes(NEW_NAME))).toBeLessThan(names.findIndex((t) => t.includes(NAME)));

  // Filter the Status column to "Filed": only the uploaded mark is left.
  await managerPage.getByRole('button', { name: 'Filter Status' }).click();
  await managerPage.getByLabel('Search Status values').fill('Filed');
  await managerPage.locator('label', { hasText: /^Filed$/ }).locator('input').check();
  await expect(row(managerPage, NEW_NAME)).toBeVisible();
  await expect(row(managerPage, NAME)).toHaveCount(0);
});

test('a team member can edit but cannot change columns or delete a record', async ({ teamPage }) => {
  await openReport(teamPage, 'TM Master');
  await expect(row(teamPage, NAME)).toBeVisible();
  await expect(teamPage.getByRole('button', { name: 'Edit columns' })).toHaveCount(0);
  await expect(teamPage.getByRole('button', { name: 'Delete record' })).toHaveCount(0);

  const [rec] = (await listWorksheet('team', 'tm_master')).filter((r) => r.values.application_no === APP_NO);
  const team = await apiAs('team');
  expect((await team.put('/api/worksheets/sheets/tm_master/columns', { data: { columns: [{ key: 'trademark_name', label: 'X' }] } })).status()).toBe(403);
  expect((await team.delete(`/api/worksheets/sheets/tm_master/records/${rec.id}`)).status()).toBe(403);
  expect((await team.patch(`/api/worksheets/sheets/tm_master/records/${rec.id}`, { data: { values: { review: 'checked' } } })).status()).toBe(200);
  await team.dispose();
});

test('the same Application No. cannot be recorded twice', async () => {
  const api = await apiAs('admin');
  const res = await api.post('/api/worksheets/sheets/tm_assignment/records', { data: { values: { application_no: APP_NO.toLowerCase() } } });
  expect(res.status()).toBe(409);
  expect((await res.json()).code).toBe('DUPLICATE_KEY');
  // …and a record made directly in another report is matched the same way.
  await createWorksheetRecord('tm_register', { application_no: `${RUN}-3`, trademark_name: `${RUN} Third` });
  const again = await api.post('/api/worksheets/sheets/tm_master/records', { data: { values: { application_no: ` ${RUN}-3 ` } } });
  expect(again.status()).toBe(409);
  expect((await again.json()).existingSheets).toEqual(['tm_register']);
  await api.dispose();
});

test('clients cannot reach the trademark reports', async ({ clientPage }) => {
  await clientPage.goto('reports/trademark');
  await expect(clientPage).not.toHaveURL(/\/reports\/trademark/);
  const client = await apiAs('client');
  expect((await client.get('/api/worksheets/modules/trademark')).status()).toBe(403);
  expect((await client.get('/api/worksheets/sheets/tm_master/records')).status()).toBe(403);
  await client.dispose();
});
