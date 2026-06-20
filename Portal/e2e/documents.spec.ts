import { test, expect } from './fixtures';
import { openDocumentsTab, pdfFile } from './helpers';
import { createMatter, assignMatter, deleteMatter } from './api';

/**
 * E-05 Document Cycle — on a FRESH matter created for this run (deleted after).
 *   1. Client uploads a document (signed-URL PUT + confirm).
 *   2. Staff (admin) rejects it with a remark.
 *   3. Client sees the remark and re-uploads.
 *   4. Staff approves; the old version is archived.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  await assignMatter(taskId, process.env.E2E_TEAM_UID!); // staff owner can review
});
test.afterAll(async () => { await deleteMatter(taskId); });

test.describe.serial('E-05 document cycle', () => {
  test('client uploads a document', async ({ clientPage }) => {
    await openDocumentsTab(clientPage, taskId);
    const file = pdfFile('upload');
    await clientPage.locator('input[type="file"]').first().setInputFiles(file);
    await expect(clientPage.getByText(/awaiting review|uploaded/i)).toBeVisible();
    await expect(clientPage.getByText(file.name)).toBeVisible();
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

  test('client sees the remark and re-uploads', async ({ clientPage }) => {
    await openDocumentsTab(clientPage, taskId);
    await expect(clientPage.getByText(/please re-upload a clearer copy/i)).toBeVisible();
    await expect(clientPage.getByRole('button', { name: 'Re-upload' })).toBeVisible();
    const file = pdfFile('reupload');
    await clientPage.locator('input[type="file"]').last().setInputFiles(file);
    await expect(clientPage.getByText(/awaiting review|uploaded/i)).toBeVisible();
    await expect(clientPage.getByText(file.name)).toBeVisible();
  });

  test('staff approves; old version archived', async ({ adminPage }) => {
    await openDocumentsTab(adminPage, taskId);
    await adminPage.getByRole('button', { name: 'Approve' }).first().click();
    await expect(adminPage.getByText('Approved').first()).toBeVisible();
    const history = adminPage.getByText(/version history/i);
    await expect(history).toBeVisible();
    await history.click();
    await expect(adminPage.getByText('Archived').first()).toBeVisible();
  });
});
