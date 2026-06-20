import { test, expect } from './fixtures';
import { createMatter, assignMatter, deleteMatter, createThrowawayStaff, deleteUser } from './api';

/**
 * E09-S04 — bulk reassign via the delete-blocked flow, fully self-contained:
 * create a THROWAWAY staff user + a fresh matter assigned to them, then delete
 * the user (blocked → Reassign modal) and reassign their work to the manager.
 * Cleans up the matter + user afterwards. Never touches shared seed users.
 */
let tempUid: string;
let tempName: string;
let taskId: string;

test.beforeAll(async () => {
  const u = await createThrowawayStaff();
  tempUid = u.uid; tempName = u.name;
  taskId = await createMatter();
  await assignMatter(taskId, tempUid); // the temp user now owns work → not deletable
});
test.afterAll(async () => {
  await deleteMatter(taskId);
  await deleteUser(tempUid); // now unblocked (work was reassigned, or matter deleted)
});

test('deleting a user who owns work opens the reassign modal, then reassigns', async ({ adminPage }) => {
  const managerUid = process.env.E2E_MANAGER_UID!;
  await adminPage.goto('users');
  await adminPage.getByPlaceholder(/search users/i).fill(tempName);

  // Delete the throwaway user (row icon button title="Delete").
  await adminPage.locator('button[title="Delete"]').first().click();

  // App confirm dialog → confirm. Scope to the dialog (row icon is also "Delete").
  await adminPage.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

  // Delete blocked (user owns work) → Reassign modal opens (heading is unique).
  await expect(adminPage.getByRole('heading', { name: /reassign .*work/i })).toBeVisible();

  // Reassign to the manager (by uid value) and confirm.
  await adminPage.locator(`select:has(option[value="${managerUid}"])`).selectOption(managerUid);
  await adminPage.getByRole('button', { name: /reassign work/i }).click();
  await expect(adminPage.getByText(/reassigned \d+ matter/i)).toBeVisible();
});
