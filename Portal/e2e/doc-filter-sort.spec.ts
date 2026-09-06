import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, advanceUntil } from './api';
import type { APIRequestContext, Page } from '@playwright/test';

/**
 * #186 — every document shows its upload date AND time, and the list sorts by
 * upload time (newest/oldest).
 * #187 — the list filters by uploader (Legal Terminus / Client) and sorts by
 * uploader.
 */
async function upload(api: APIRequestContext, taskId: string, fileName: string) {
  const su = await api.post(`/api/tasks/${taskId}/documents/signed-upload-url`, {
    data: { fileName, contentType: 'application/pdf', docType: fileName.replace('.pdf', ''), stepNumber: 4 },
  });
  const { docId, signedUrl } = await su.json();
  await api.put(signedUrl, { headers: { 'Content-Type': 'application/pdf' }, data: Buffer.from('%PDF-1.4') });
  await api.post(`/api/tasks/${taskId}/documents/${docId}/confirm`, { data: { uploaded: true } });
  await api.post(`/api/tasks/${taskId}/documents/submit`, { data: {} });
}

/** Doc-type titles in the rendered order of the main list. Scoped to document
 *  CARDS — the uploader panel has a heading with the same typography classes. */
const listOrder = async (page: Page) => {
  const titles = await page.locator('p.text-sm.font-medium.text-ink').allInnerTexts();
  return titles.filter((t) => /^(Staff|Client)(Alpha|Bravo|Charlie)/.test(t.trim()));
};

let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  await advanceUntil(taskId, (s) => s.stepNumber >= 6);
  const admin = await apiAs('admin');
  await upload(admin, taskId, 'StaffAlpha.pdf');          // 1st (oldest)
  await admin.dispose();
  const client = await apiAs('client');
  await upload(client, taskId, 'ClientBravo.pdf');        // 2nd
  await client.dispose();
  const admin2 = await apiAs('admin');
  await upload(admin2, taskId, 'StaffCharlie.pdf');       // 3rd (newest)
  await admin2.dispose();
});

test.afterAll(async () => { if (taskId) await deleteMatter(taskId); });

test('#186: each document shows its upload date and time', async ({ adminPage: p }) => {
  await p.goto(`tasks/${taskId}`);
  await p.getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(p.getByText('StaffCharlie').first()).toBeVisible({ timeout: 15_000 });
  // "Uploaded 6 Sep 2026, 4:32 pm" — date AND a time component.
  const stamps = await p.getByText(/^Uploaded \d+ \w+ \d{4},/).allInnerTexts();
  expect(stamps.length).toBeGreaterThanOrEqual(3);
  for (const s of stamps) expect(s, 'includes a time').toMatch(/\d{1,2}:\d{2}/);
});

test('#186: sorts newest-first by default and can flip to oldest-first', async ({ adminPage: p }) => {
  await p.goto(`tasks/${taskId}`);
  await p.getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(p.getByText('StaffCharlie').first()).toBeVisible({ timeout: 15_000 });

  const newest = await listOrder(p);
  expect(newest[0], 'newest upload first by default').toContain('StaffCharlie');

  await p.getByLabel('Sort documents').selectOption('oldest');
  await p.waitForTimeout(600);
  const oldest = await listOrder(p);
  expect(oldest[0], 'oldest upload first').toContain('StaffAlpha');
  expect(oldest).toEqual([...newest].reverse());
});

test('#187: filters the list by uploader', async ({ adminPage: p }) => {
  await p.goto(`tasks/${taskId}`);
  await p.getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(p.getByText('StaffCharlie').first()).toBeVisible({ timeout: 15_000 });

  await p.getByLabel('Filter by uploader').selectOption('client');
  await p.waitForTimeout(600);
  let shown = await listOrder(p);
  expect(shown.join('|')).toContain('ClientBravo');
  expect(shown.join('|')).not.toContain('StaffAlpha');

  await p.getByLabel('Filter by uploader').selectOption('staff');
  await p.waitForTimeout(600);
  shown = await listOrder(p);
  expect(shown.join('|')).toContain('StaffAlpha');
  expect(shown.join('|')).not.toContain('ClientBravo');

  await p.getByLabel('Filter by uploader').selectOption('all');
  await p.waitForTimeout(600);
  expect((await listOrder(p)).length).toBeGreaterThanOrEqual(3);
});

test('#187: sorts by uploader, ascending and descending', async ({ adminPage: p }) => {
  await p.goto(`tasks/${taskId}`);
  await p.getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(p.getByText('StaffCharlie').first()).toBeVisible({ timeout: 15_000 });

  // Client sorts before Legal Terminus alphabetically.
  await p.getByLabel('Sort documents').selectOption('uploader-asc');
  await p.waitForTimeout(600);
  expect((await listOrder(p))[0]).toContain('ClientBravo');

  await p.getByLabel('Sort documents').selectOption('uploader-desc');
  await p.waitForTimeout(600);
  expect((await listOrder(p))[0]).not.toContain('ClientBravo');
});
