import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, advanceUntil, getMatter } from './api';

/**
 * #189 — the matters list reported progress as `min(currentStepNumber, totalSteps)`,
 * treating a step's IDENTITY number as a flow position (see #117/#55). A matter on
 * step 32 of a 20-step workflow clamped to 20 and showed "20/20 complete" with 9
 * steps actually done; others under-reported. Progress is now the COUNT of finished
 * steps, denormalised onto the task as `completedStepCount`.
 */
test('#189: completedStepCount tracks actual finished steps, not the step number', async () => {
  const taskId = await createMatter();
  try {
    const before = await getMatter(taskId);
    const total = (before.totalSteps ?? 0) as number;
    expect(total, 'matter has steps').toBeGreaterThan(0);
    expect(before.completedStepCount, 'starts at zero completed').toBe(0);

    // Advance a few steps, then compare the counter with the real statuses.
    await advanceUntil(taskId, (s) => s.stepNumber >= 6);
    const after = await getMatter(taskId);
    const steps = (after.steps ?? []) as Array<{ status: string }>;
    const reallyDone = steps.filter((s) => s.status === 'completed' || s.status === 'skipped').length;

    expect(after.completedStepCount, 'counter equals the real finished count').toBe(reallyDone);
    expect(after.completedStepCount as number, 'progress never exceeds the total').toBeLessThanOrEqual(total);

    // The regression: the current step's NUMBER must not drive progress.
    const cur = after.currentStepNumber as number;
    if (cur > reallyDone) {
      expect(after.completedStepCount, 'counter is not the step number').not.toBe(Math.min(cur, total));
    }
  } finally { await deleteMatter(taskId); }
});

test('#189: the matters list never shows a full bar before the work is done', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await advanceUntil(taskId, (s) => s.stepNumber >= 6);
    const m = await getMatter(taskId);
    const total = m.totalSteps as number;
    const done = m.completedStepCount as number;
    expect(done, 'this matter is mid-flow, not finished').toBeLessThan(total);

    await adminPage.goto('tasks');
    await adminPage.waitForTimeout(2500);
    const body = await adminPage.locator('body').innerText();
    // The truthful fraction is present, and no "n/n" full-completion claim is.
    expect(body).toContain(`${done}/${total}`);
    expect(body, 'no false 100% fraction').not.toContain(`${total}/${total}`);
  } finally { await deleteMatter(taskId); }
});
