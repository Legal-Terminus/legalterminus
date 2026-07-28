import { test, expect } from './fixtures';
import { createMatter, assignMatter, deleteMatter, advanceUntil } from './api';

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

test('#132: client Activity shows only client-visible history; staff names never leak', async ({ adminPage, clientPage }) => {
  // Generate real activity via API (advances off the gate through plain steps,
  // recording events), so the feed exists for staff regardless of current step.
  await advanceUntil(taskId);

  // Staff see the Activity section (it may sit in a sticky sidebar → assert attached).
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(adminPage.getByText('Activity').first()).toBeAttached();

  // #132: the client now HAS an Activity history (the step detail shows only the
  // latest comment; older ones live here). But it is the client-safe feed —
  // internal staff identities are still masked to "Our team", never leaked.
  await clientPage.goto(`tasks/${taskId}`);
  await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(clientPage.getByText('Activity').first()).toBeAttached();
  await expect(clientPage.getByText('E2E Admin')).toHaveCount(0);
  await expect(clientPage.getByText('E2E Team')).toHaveCount(0);
});
