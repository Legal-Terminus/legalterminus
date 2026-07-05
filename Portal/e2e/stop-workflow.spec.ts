import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getMatter, currentStep, assignStep, advanceUntil, archiveMatterAs } from './api';

/**
 * GitHub #41 — Stop workflow for discontinued clients. An admin can stop an
 * in-flight matter with a required reason; it goes `cancelled` and shows the
 * stopped banner. Fresh matter per test.
 *
 * GitHub #70 — Stop Workflow & Archive are admin-only. Managers and team
 * members no longer see the control.
 *
 * GitHub #71 — An admin can restart a stopped matter; it resumes from the same
 * step and returns to `active`. The control is admin-only.
 *
 * #72 — Stop workflow now lives inside the header ⋮ actions menu, so admin flows
 * open that menu first via `openStop`.
 */
let taskId: string;
test.beforeEach(async () => { taskId = await createMatter(); });
test.afterEach(async () => { await deleteMatter(taskId); });

/** Open the header ⋮ menu and click "Stop workflow" (admin-only). */
async function openStop(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /more actions/i }).click();
  await page.getByRole('button', { name: /stop workflow/i }).click();
}

test('admin stops an in-flight matter with a reason', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await openStop(adminPage);
  await adminPage.getByPlaceholder(/reason for stopping/i).fill('Client discontinued the service.');
  // The confirm action inside the banner.
  await adminPage.getByRole('button', { name: /^stop workflow$/i }).last().click();

  await expect(adminPage.getByText(/this matter was stopped/i)).toBeVisible();
  await expect(async () => {
    expect((await getMatter(taskId)).status).toBe('cancelled');
  }).toPass({ timeout: 15_000 });
});

test('a team member never sees the Stop workflow control, even when assigned the active step (#70)', async ({ teamPage }) => {
  const step = await currentStep(taskId);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

  await teamPage.goto(`tasks/${taskId}`);
  await expect(teamPage.getByRole('button', { name: 'Steps', exact: true })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /stop workflow/i })).toHaveCount(0);
});

test('client never sees the Stop workflow control', async ({ clientPage }) => {
  await clientPage.goto(`tasks/${taskId}`);
  await expect(clientPage.getByRole('button', { name: 'Steps', exact: true })).toBeVisible();
  await expect(clientPage.getByRole('button', { name: /stop workflow/i })).toHaveCount(0);
});

test('admin restarts a stopped matter; it resumes from the same step (#71)', async ({ adminPage }) => {
  const stepBefore = await currentStep(taskId);

  await adminPage.goto(`tasks/${taskId}`);
  // Stop it first.
  await openStop(adminPage);
  await adminPage.getByPlaceholder(/reason for stopping/i).fill('Temporary hold.');
  await adminPage.getByRole('button', { name: /^stop workflow$/i }).last().click();
  await expect(adminPage.getByText(/this matter was stopped/i)).toBeVisible();

  // Restart via the banner action → styled confirm dialog.
  await adminPage.getByRole('button', { name: /restart workflow/i }).click();
  const dialog = adminPage.getByRole('dialog');
  await expect(dialog.getByText(/restart this matter\?/i)).toBeVisible();
  await dialog.getByRole('button', { name: 'Restart' }).click();

  await expect(async () => {
    const m = await getMatter(taskId);
    expect(m.status).toBe('active');
    expect(m.currentStepNumber).toBe(stepBefore);
  }).toPass({ timeout: 15_000 });
});

test('a team member never sees the Restart workflow control on a stopped matter (#71)', async ({ adminPage, teamPage }) => {
  // Admin stops it.
  await adminPage.goto(`tasks/${taskId}`);
  await openStop(adminPage);
  await adminPage.getByPlaceholder(/reason for stopping/i).fill('Held.');
  await adminPage.getByRole('button', { name: /^stop workflow$/i }).last().click();
  await expect(adminPage.getByText(/this matter was stopped/i)).toBeVisible();

  await teamPage.goto(`tasks/${taskId}`);
  await expect(teamPage.getByText(/this matter was stopped/i)).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /restart workflow/i })).toHaveCount(0);
});

test('#72: admin ⋮ menu on an active matter offers both Archive and Stop workflow', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: /more actions/i }).click();
  await expect(adminPage.getByRole('button', { name: /archive matter/i })).toBeVisible();
  await expect(adminPage.getByRole('button', { name: /stop workflow/i })).toBeVisible();
});

test('completed matter can be archived; the ⋮ menu offers Archive but not Stop', async ({ adminPage }) => {
  // Drive the matter to completion (advanceUntil runs until status === completed
  // or it hits a step needing a special event).
  await advanceUntil(taskId);
  const m = await getMatter(taskId);
  test.skip(m.status !== 'completed', 'Workflow needs a special event to complete; not reachable via COMPLETE_STEP alone.');

  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: /more actions/i }).click();
  await expect(adminPage.getByRole('button', { name: /archive matter/i })).toBeVisible();
  // Stop workflow does not apply to a finished workflow.
  await expect(adminPage.getByRole('button', { name: /stop workflow/i })).toHaveCount(0);

  // And the backend accepts the archive (200).
  expect(await archiveMatterAs('admin', taskId)).toBe(200);
  await expect(async () => {
    expect((await getMatter(taskId)).status).toBe('archived');
  }).toPass({ timeout: 15_000 });
});
