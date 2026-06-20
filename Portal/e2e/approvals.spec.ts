import { test, expect } from './fixtures';
import { createPendingMatter, deleteMatter } from './api';

/**
 * E03-S04 — manager-created matters wait for admin approval. Each test gets its
 * OWN fresh pending matter (created in beforeEach, deleted in afterEach) so the
 * destructive reject test never affects the others.
 */
let pendingId: string;

test.beforeEach(async () => { pendingId = await createPendingMatter(); });
test.afterEach(async () => { await deleteMatter(pendingId); });

test('non-admin sees a waiting banner, no approve controls', async ({ teamPage }) => {
  await teamPage.goto(`tasks/${pendingId}`);
  await expect(teamPage.getByText(/awaiting admin approval/i)).toBeVisible();
  await expect(teamPage.getByRole('button', { name: 'Approve' })).toHaveCount(0);
});

test('admin sees approve/reject controls on a pending matter', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${pendingId}`);
  await expect(adminPage.getByText(/awaiting your approval/i)).toBeVisible();
  await expect(adminPage.getByRole('button', { name: 'Approve' })).toBeVisible();
  await expect(adminPage.getByRole('button', { name: 'Reject' })).toBeVisible();
});

test('admin can approve a pending matter (it goes active)', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${pendingId}`);
  await adminPage.getByRole('button', { name: 'Approve' }).click();
  // Banner clears; the matter is now active (approval banner gone).
  await expect(adminPage.getByText(/awaiting your approval/i)).toBeHidden();
});

test('reject requires a reason then marks the matter rejected', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${pendingId}`);
  await adminPage.getByRole('button', { name: 'Reject' }).click();
  const reason = adminPage.getByPlaceholder(/reason for rejection/i);
  await expect(reason).toBeVisible();
  await reason.fill('E2E: out of scope.');
  await adminPage.getByRole('button', { name: /confirm rejection/i }).click();
  await expect(adminPage.getByText(/this matter was rejected/i)).toBeVisible();
});
