import { test, expect } from './fixtures';
import { createMatter, assignStep, currentStep, deleteMatter, apiAs } from './api';

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
  // Wait for the query to settle (loading spinner gone) before deciding empty vs grid.
  await expect(adminPage.getByText(/loading your tasks/i)).toHaveCount(0, { timeout: 15_000 });
  // Two empty states exist: the page-level "all caught up" (no data at all) and the
  // work-grid's own "No open steps." (grid empty but approvals present). Skip the
  // column-header check in either case.
  const empty = adminPage.getByText(/all caught up|no open steps/i);
  if (!(await empty.count())) {
    // Grid rendered → the Priority column header is present (may sit next to a sort
    // icon in the same cell, so match by substring, not exact).
    await expect(adminPage.getByText(/^Priority/).first()).toBeVisible();
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

test('#50: a step assigned to someone else does NOT appear in admin My Tasks', async () => {
  // The active step is assigned to the team member (beforeAll). An ADMIN's my-steps
  // must not include it — My Tasks holds only mine + the unassigned pool.
  const stepNo = await currentStep(taskId);
  const api = await apiAs('admin');
  const res = await api.get('/api/tasks/my-steps');
  const body = await res.json();
  await api.dispose();
  const rows = body.data ?? body;
  const leaked = rows.find((r: { taskId: string; stepNumber: number }) => r.taskId === taskId && r.stepNumber === stepNo);
  expect(leaked).toBeFalsy();
});
