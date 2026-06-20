import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getMatter, currentStep, assignStep } from './api';

/**
 * GitHub #41 — Stop workflow for discontinued clients. Staff (admin/manager/
 * team_member) can stop an in-flight matter with a required reason; it goes
 * `cancelled` and shows the stopped banner. Fresh matter per test.
 */
let taskId: string;
test.beforeEach(async () => { taskId = await createMatter(); });
test.afterEach(async () => { await deleteMatter(taskId); });

test('admin stops an in-flight matter with a reason', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: /stop workflow/i }).click();
  await adminPage.getByPlaceholder(/reason for stopping/i).fill('Client discontinued the service.');
  // The confirm action inside the banner.
  await adminPage.getByRole('button', { name: /^stop workflow$/i }).last().click();

  await expect(adminPage.getByText(/this matter was stopped/i)).toBeVisible();
  await expect(async () => {
    expect((await getMatter(taskId)).status).toBe('cancelled');
  }).toPass({ timeout: 15_000 });
});

test('a team member assigned the active step can stop the matter (#41 + #44 perms)', async ({ teamPage }) => {
  const step = await currentStep(taskId);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

  await teamPage.goto(`tasks/${taskId}`);
  await teamPage.getByRole('button', { name: /stop workflow/i }).click();
  await teamPage.getByPlaceholder(/reason for stopping/i).fill('Client asked to stop.');
  await teamPage.getByRole('button', { name: /^stop workflow$/i }).last().click();

  await expect(async () => {
    expect((await getMatter(taskId)).status).toBe('cancelled');
  }).toPass({ timeout: 15_000 });
});

test('client never sees the Stop workflow control', async ({ clientPage }) => {
  await clientPage.goto(`tasks/${taskId}`);
  await expect(clientPage.getByRole('button', { name: 'Steps', exact: true })).toBeVisible();
  await expect(clientPage.getByRole('button', { name: /stop workflow/i })).toHaveCount(0);
});
