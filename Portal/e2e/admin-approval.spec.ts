import { test, expect } from './fixtures';
import {
  createAdminApprovalMatter, deleteMatter, deleteDefinition,
  getMatterAs, transitionStatusAs, getMatter,
} from './api';

/**
 * #90 — ADMIN-APPROVAL steps (a step whose active `assignedRole === 'admin'`) are
 * internal admin controls:
 *   1. Client-hidden — the step never appears in the client projection, and a
 *      client cannot approve/complete it (even via the API).
 *   2. Admin-only action — only an admin may approve/complete; a manager (or team
 *      member) is rejected (403) and is view-only in the UI.
 *
 * Each test provisions a dedicated throwaway workflow (step 1 = admin approval)
 * and a matter on it, then tears both down.
 */

let taskId: string;
let defId: string;
test.beforeEach(async () => { ({ taskId, defId } = await createAdminApprovalMatter()); });
test.afterEach(async () => { await deleteMatter(taskId); await deleteDefinition(defId); });

test('#90: the admin-approval step is HIDDEN from the client projection', async () => {
  const { body } = await getMatterAs('client', taskId);
  const steps = (body?.steps ?? []) as Array<{ stepNumber: number }>;
  // Step 1 (the admin-approval step) must not be present for the client.
  expect(steps.some((s) => s.stepNumber === 1)).toBe(false);
});

test('#90: a client CANNOT approve/complete an admin-approval step (API 403)', async () => {
  const status = await transitionStatusAs('client', taskId, { type: 'CLIENT_APPROVE' });
  expect([403, 400]).toContain(status); // forbidden (admin-approval gate) — never advances
  // Also the plain completion event is refused.
  expect(await transitionStatusAs('client', taskId, { type: 'COMPLETE_STEP' })).toBe(403);
  expect((await getMatter(taskId)).currentStepNumber).toBe(1); // did not advance
});

test('#90: a manager CANNOT complete an admin-approval step (API 403), only views', async ({ managerPage }) => {
  // API: a manager firing the completion is forbidden with the admin-approval code.
  expect(await transitionStatusAs('manager', taskId, { type: 'COMPLETE_STEP' })).toBe(403);
  expect((await getMatter(taskId)).currentStepNumber).toBe(1);

  // UI: a manager sees the step but no approve/complete control — just the note.
  await managerPage.goto(`tasks/${taskId}`);
  await managerPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(managerPage.getByText(/requires admin approval/i).first()).toBeVisible();
  await expect(managerPage.getByRole('button', { name: /^complete step$/i })).toHaveCount(0);
  await expect(managerPage.getByRole('button', { name: /^approve$/i })).toHaveCount(0);
});

test('#90: an ADMIN can approve/complete the admin-approval step', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  // The admin sees an Approve control and can advance the matter.
  await adminPage.getByRole('button', { name: /^approve$/i }).first().click();
  await expect(async () => {
    // Step 1 → 2 (final) → matter completes.
    const m = await getMatter(taskId);
    expect(m.status === 'completed' || (m.currentStepNumber as number) > 1).toBeTruthy();
  }).toPass({ timeout: 15_000 });
});
