import { test, expect } from './fixtures';
import {
  createMatter, deleteMatter, currentStep, assignStep,
  countDocuments, matterExists, archiveMatterAs, deleteMatterAs,
  waitForTaskNotification, countNotificationsForTask,
} from './api';
import { openDocumentsTab, pdfFile } from './helpers';

/**
 * Matter lifecycle admin ops:
 *  • E05-S05 full delete cleanup — deleting a matter removes its documents (and
 *    Storage files; verified indirectly via the documents list being gone) AND
 *    its top-level notifications (no dangling bell entries linking to a 404).
 *  • E11-S09 archive — staff (incl. team member) can archive; only admin deletes.
 */

test('E05-S05: deleting a matter purges its documents and notifications', async ({ adminPage, clientPage }) => {
  const taskId = await createMatter();
  let deleted = false;
  try {
    // Assigning the current step to the team member fires a notification to them,
    // so there's a matter-linked notification to clean up.
    const step = await currentStep(taskId);
    await assignStep(taskId, step, process.env.E2E_TEAM_UID!);
    expect(await waitForTaskNotification('team', taskId)).toBeGreaterThan(0);

    // Client uploads a document so there's a doc + Storage file to clean up.
    await openDocumentsTab(clientPage, taskId);
    await clientPage.locator('input[type="file"]').first().setInputFiles(pdfFile('cleanup'));
    await expect(clientPage.getByText(/awaiting review|uploaded/i)).toBeVisible();
    expect(await countDocuments(taskId)).toBeGreaterThan(0);

    // Admin deletes via the Matters grid (styled confirm dialog).
    await adminPage.goto(`tasks/${taskId}`);
    // Delete is a grid/row action; use the API path the UI calls to assert cleanup
    // deterministically (the UI delete is covered in interactions.spec).
    expect(await deleteMatterAs('admin', taskId)).toBe(200);
    deleted = true;

    // Matter is gone, its documents no longer resolve (subcollection purged), and
    // its notifications are swept (top-level collection — not a subcollection).
    expect(await matterExists(taskId)).toBe(false);
    expect(await countDocuments(taskId)).toBeLessThanOrEqual(0);
    expect(await countNotificationsForTask('team', taskId)).toBe(0);
  } finally {
    if (!deleted) await deleteMatter(taskId);
  }
});

test('E11-S09: a team member can archive; only admin can delete', async ({ teamPage }) => {
  const taskId = await createMatter();
  let removed = false;
  try {
    const step = await currentStep(taskId);
    await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

    // Team member can NOT delete (admin-only) …
    expect(await deleteMatterAs('team', taskId)).toBe(403);

    // … but CAN archive, via the UI.
    await teamPage.goto(`tasks/${taskId}`);
    await teamPage.getByRole('button', { name: 'Archive', exact: true }).click();
    await teamPage.getByRole('dialog').getByRole('button', { name: 'Archive' }).click();
    await expect(teamPage.getByText(/this matter is archived/i)).toBeVisible();

    // Re-archiving is a no-op conflict.
    expect(await archiveMatterAs('admin', taskId)).toBe(409);
  } finally {
    await deleteMatter(taskId).then(() => { removed = true; }).catch(() => {});
    void removed;
  }
});
