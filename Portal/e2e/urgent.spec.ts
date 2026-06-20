import { test, expect } from './fixtures';
import { createMatter, deleteMatter, currentStep, assignStep } from './api';

/**
 * E11-S03 / E11-S05 — Urgent priority. Admin flags a matter urgent (Flame toggle)
 * on the detail page; it then shows an "Urgent" badge on the Matters grid, and the
 * urgent step surfaces on the assignee's My Tasks. Fresh matter per run.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  const step = await currentStep(taskId);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!); // route to team for My Tasks
});
test.afterAll(async () => { await deleteMatter(taskId); });

test('admin marks a matter urgent; it shows the Urgent badge on Matters', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  // The matter-level urgent toggle (Flame) lives in the header; off by default.
  const toggle = adminPage.getByRole('button', { name: /mark matter urgent/i });
  await expect(toggle).toBeVisible();
  await toggle.click();
  // After toggling, the control flips to the "clear" state.
  await expect(adminPage.getByRole('button', { name: /urgent — click to clear/i })).toBeVisible();

  // The Matters grid now shows an Urgent badge for this matter.
  await adminPage.goto('tasks');
  await expect(adminPage.getByText('Urgent', { exact: true }).first()).toBeVisible();
});

test('urgent step appears (and is flagged) on the team member My Tasks', async ({ adminPage, teamPage }) => {
  // Ensure the matter is urgent (idempotent — set it if not already).
  await adminPage.goto(`tasks/${taskId}`);
  if (await adminPage.getByRole('button', { name: /mark matter urgent/i }).count()) {
    await adminPage.getByRole('button', { name: /mark matter urgent/i }).click();
  }

  await teamPage.goto('my-tasks');
  await expect(teamPage.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  // The Priority column / Urgent badge shows for the urgent row.
  await expect(async () => {
    await teamPage.reload();
    await expect(teamPage.getByText('Urgent', { exact: true }).first()).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 40_000 });
});
