import { test, expect } from './fixtures';
import { createMatter, assignMatter, deleteMatter } from './api';

/**
 * E12 — client vs internal view separation, on a FRESH matter (deleted after).
 * A client never sees internal staffing controls or staff identities; staff see
 * the full operational view of the same matter.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  await assignMatter(taskId, process.env.E2E_TEAM_UID!);
});
test.afterAll(async () => { await deleteMatter(taskId); });

test('client matter detail hides Step owner + Matter owner controls', async ({ clientPage }) => {
  await clientPage.goto(`tasks/${taskId}`);
  await expect(clientPage.getByRole('button', { name: 'Steps', exact: true })).toBeVisible();
  await expect(clientPage.getByText('Step owner')).toHaveCount(0);
  await expect(clientPage.getByText('Matter owner')).toHaveCount(0);
});

test('staff matter detail SHOWS the matter owner control', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await expect(adminPage.getByText('Matter owner')).toBeVisible();
});

test('client activity feed never names internal staff', async ({ adminPage, clientPage }) => {
  // Drive an internal action as admin so there's activity to (not) leak.
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  const complete = adminPage.getByRole('button', { name: /complete step/i });
  if (await complete.count()) {
    await complete.first().click();
    await adminPage.waitForTimeout(1500);
  }
  // As the client, the activity feed must not show staff names.
  await clientPage.goto(`tasks/${taskId}`);
  await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(clientPage.getByText('E2E Admin')).toHaveCount(0);
  await expect(clientPage.getByText('E2E Team')).toHaveCount(0);
});
