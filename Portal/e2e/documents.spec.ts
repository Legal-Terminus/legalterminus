import { test, expect } from './fixtures';
import { openDocumentsTab, pdfFile } from './helpers';
import { createMatter, assignMatter, deleteMatter } from './api';

/**
 * E-05 Document Cycle — on a FRESH matter created for this run (deleted after).
 *   1. Client uploads a document → it lands as a DRAFT (#113) and is submitted.
 *   2. Staff (admin) rejects it with a remark.
 *   3. Client sees the remark and re-uploads (draft → submit again).
 *   4. Staff approves; the reviewed old version is archived.
 *
 * #113 — uploads are drafts until Submit; drafts are deletable.
 * #112 — uploading does NOT archive documents that were never reviewed.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  await assignMatter(taskId, process.env.E2E_TEAM_UID!); // staff owner can review
});
test.afterAll(async () => { await deleteMatter(taskId); });

test.describe.serial('E-05 document cycle', () => {
  test('#113: a client upload lands as a DRAFT, then Submit sends it for review', async ({ clientPage }) => {
    await openDocumentsTab(clientPage, taskId);
    const file = pdfFile('upload');
    await clientPage.locator('input[type="file"]').first().setInputFiles(file);

    // Draft first — NOT yet pending review.
    await expect(clientPage.getByText(file.name)).toBeVisible();
    await expect(clientPage.getByText('Draft').first()).toBeVisible();
    await expect(clientPage.getByText(/Drafts \(\d+\)/)).toBeVisible();

    // Submit makes it reviewable.
    await clientPage.getByRole('button', { name: /^Submit/ }).click();
    await expect(clientPage.getByText('Pending review').first()).toBeVisible();
  });

  test('staff rejects with a remark', async ({ adminPage }) => {
    await openDocumentsTab(adminPage, taskId);
    await adminPage.getByRole('button', { name: 'Reject' }).first().click();
    const remark = 'E2E: please re-upload a clearer copy.';
    await adminPage.getByPlaceholder(/reason for rejection/i).fill(remark);
    await adminPage.getByRole('button', { name: 'Confirm rejection' }).click();
    await expect(adminPage.getByText('Rejected').first()).toBeVisible();
    await expect(adminPage.getByText(remark)).toBeVisible();
  });

  test('client sees the remark and re-uploads (draft → submit)', async ({ clientPage }) => {
    await openDocumentsTab(clientPage, taskId);
    await expect(clientPage.getByText(/please re-upload a clearer copy/i)).toBeVisible();
    const file = pdfFile('reupload');
    await clientPage.locator('input[type="file"]').first().setInputFiles(file);
    await expect(clientPage.getByText(file.name)).toBeVisible();
    await clientPage.getByRole('button', { name: /^Submit/ }).click();
    await expect(clientPage.getByText('Pending review').first()).toBeVisible();
  });

  test('staff approves; the reviewed old version is archived', async ({ adminPage }) => {
    await openDocumentsTab(adminPage, taskId);
    await adminPage.getByRole('button', { name: 'Approve' }).first().click();
    await expect(adminPage.getByText('Approved').first()).toBeVisible();
    const history = adminPage.getByText(/version history/i);
    await expect(history).toBeVisible();
    await history.click();
    await expect(adminPage.getByText('Archived').first()).toBeVisible();
  });
});

test('#112: multiple submitted documents ALL stay pending review (none auto-archived)', async ({ clientPage, adminPage }) => {
  const t = await createMatter();
  try {
    await assignMatter(t, process.env.E2E_TEAM_UID!);
    await openDocumentsTab(clientPage, t);

    // Upload two documents, then submit them together.
    const a = pdfFile('first');
    const b = pdfFile('second');
    await clientPage.locator('input[type="file"]').first().setInputFiles(a);
    await expect(clientPage.getByText(a.name)).toBeVisible();
    await clientPage.locator('input[type="file"]').first().setInputFiles(b);
    await expect(clientPage.getByText(b.name)).toBeVisible();
    await clientPage.getByRole('button', { name: /^Submit/ }).click();

    // BOTH remain pending review — the earlier one is not buried in history.
    await openDocumentsTab(adminPage, t);
    await expect(adminPage.getByText(a.name)).toBeVisible();
    await expect(adminPage.getByText(b.name)).toBeVisible();
    await expect(adminPage.getByText('Pending review')).toHaveCount(2);
  } finally { await deleteMatter(t); }
});

test('#113: a draft can be deleted before submission', async ({ clientPage }) => {
  const t = await createMatter();
  try {
    await openDocumentsTab(clientPage, t);
    const file = pdfFile('mistake');
    await clientPage.locator('input[type="file"]').first().setInputFiles(file);
    await expect(clientPage.getByText(file.name)).toBeVisible();

    // Delete it (confirm dialog) — it disappears.
    await clientPage.getByRole('button', { name: new RegExp(`Delete ${file.name}`, 'i') }).click();
    const dialog = clientPage.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Delete' }).click();
    await expect(clientPage.getByText(file.name)).toHaveCount(0);
  } finally { await deleteMatter(t); }
});
