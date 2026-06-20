import { test, expect } from './fixtures';
import { createMatter, assignMatter, deleteMatter } from './api';

/**
 * E07-S01 — in-app notifications. The bell renders for staff; a workflow action
 * (admin reassigns the active step) notifies the recipient. Uses a FRESH matter.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  await assignMatter(taskId, process.env.E2E_TEAM_UID!);
});
test.afterAll(async () => { await deleteMatter(taskId); });

test('notification bell is present for staff', async ({ adminPage }) => {
  await adminPage.goto('dashboard');
  await expect(adminPage.getByRole('button', { name: 'Notifications' })).toBeVisible();
});

test('reassigning the active step notifies the new assignee', async ({ adminPage, managerPage }) => {
  const managerUid = process.env.E2E_MANAGER_UID!;
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

  // Reassign the current step's owner to the manager (Step-owner <select> in the
  // hero panel carries the manager uid as an option) → "Step assigned to you".
  const ownerSelect = adminPage.locator(`select:has(option[value="${managerUid}"])`).last();
  await ownerSelect.selectOption(managerUid);

  await managerPage.goto('dashboard');
  await expect(async () => {
    await managerPage.getByRole('button', { name: 'Notifications' }).click();
    await expect(
      managerPage.getByText(/(step|matter) assigned to you/i).first(),
    ).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 45_000 });
});
