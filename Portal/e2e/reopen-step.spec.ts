import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter, advanceUntil } from './api';

/**
 * #116 — reopen a completed step (ADMIN ONLY, rewind semantics).
 * Reopening makes the target step current again; later steps revert to pending.
 */

test('#116: admin reopens a completed step; the workflow rewinds to it', async () => {
  const taskId = await createMatter();
  try {
    // Advance a few steps so there is at least one COMPLETED step behind the current.
    await advanceUntil(taskId, (s) => s.stepNumber >= 3);
    const m = await getMatter(taskId);
    // Step numbers are GAPPY (a payment gate can auto-pass 2-3), so pick a real
    // completed step from the matter rather than assuming current-1 exists.
    const completed = ((m.steps ?? []) as Array<{ stepNumber: number; status: string }>)
      .filter((s) => s.status === 'completed').map((s) => s.stepNumber);
    test.skip(completed.length === 0, 'No completed step to reopen yet.');
    const target = completed[completed.length - 1];

    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/steps/${target}/reopen`, { data: { reason: 'e2e' } });
    expect(res.ok()).toBeTruthy();

    // The matter is now back at the target step, active.
    await expect(async () => {
      const m = await getMatter(taskId);
      expect(m.currentStepNumber).toBe(target);
      expect(m.status).toBe('active');
    }).toPass({ timeout: 15_000 });
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#116: a manager cannot reopen a step (admin only)', async () => {
  const taskId = await createMatter();
  try {
    await advanceUntil(taskId, (s) => s.stepNumber >= 3);
    const m = await getMatter(taskId);
    const completed = ((m.steps ?? []) as Array<{ stepNumber: number; status: string }>)
      .filter((s) => s.status === 'completed').map((s) => s.stepNumber);
    test.skip(completed.length === 0, 'No completed step.');
    const manager = await apiAs('manager');
    // 403 fires on the role gate before any step lookup, so any step id proves it.
    const res = await manager.post(`/api/tasks/${taskId}/steps/${completed[0]}/reopen`, { data: {} });
    expect(res.status()).toBe(403);
    await manager.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#116: reopening the current/future step is refused', async () => {
  const taskId = await createMatter();
  try {
    const cur = (await getMatter(taskId)).currentStepNumber as number;
    const admin = await apiAs('admin');
    // The current step is not "before" current → rejected.
    const res = await admin.post(`/api/tasks/${taskId}/steps/${cur}/reopen`, { data: {} });
    expect([409, 404]).toContain(res.status());
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#116: a completed step shows a Reopen action for an admin', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await advanceUntil(taskId, (s) => s.stepNumber >= 3);
    const cur = (await getMatter(taskId)).currentStepNumber as number;
    test.skip(cur < 3, 'Not advanced.');

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // Reveal completed steps, then expand one and confirm the Reopen action.
    const showCompleted = adminPage.getByRole('button', { name: /show completed/i });
    if (await showCompleted.count()) await showCompleted.first().click();
    // Expand the first completed (Done) row.
    await adminPage.locator('button', { hasText: /Done/ }).first().click();
    await expect(adminPage.getByRole('button', { name: /reopen step/i }).first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});
