import { test, expect } from './fixtures';
import { createMatter, assignStep, currentStep, deleteMatter } from './api';

/**
 * E11 (My Tasks worklist) + E13-S03 (Due column). Staff see a cross-matter step
 * worklist; clients have no My Tasks page. Uses a FRESH matter for the assigned
 * case so the team member always has at least one step to see.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  // Assign the ACTIVE step (not just the matter) to the team member — the active
  // step may be pre-owned by a phase-default assignee (E11-S02), so step-level
  // assignment is what reliably routes it into the team member's My Tasks.
  const step = await currentStep(taskId);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);
});
test.afterAll(async () => { await deleteMatter(taskId); });

test('staff My Tasks renders the work grid', async ({ adminPage }) => {
  await adminPage.goto('my-tasks');
  await expect(adminPage.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  const empty = adminPage.getByText(/all caught up/i);
  if (!(await empty.count())) {
    await expect(adminPage.getByText('Priority', { exact: true }).first()).toBeVisible();
  }
});

test('team member sees their assigned matter in My Tasks', async ({ teamPage }) => {
  await teamPage.goto('my-tasks');
  await expect(teamPage.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  // The my-steps worklist is collection-group-backed and polled — reload-poll until
  // the freshly-assigned matter's step row appears (service name is the stable text).
  await expect(async () => {
    await teamPage.reload();
    await expect(teamPage.getByText(/Company Incorporation/i).first()).toBeVisible({ timeout: 3_000 });
  }).toPass({ timeout: 40_000 });
});

test('client cannot access My Tasks', async ({ clientPage }) => {
  await clientPage.goto('my-tasks');
  await expect(clientPage).not.toHaveURL(/my-tasks/);
});
