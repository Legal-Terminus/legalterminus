import { test, expect } from './fixtures';
import {
  createPartPaidMatter, createMatter, deleteMatter, getDefinitionForMatter,
  advanceUntil, getMatter, waitForNotification, getNotifications, apiAs,
} from './api';

/**
 * #76 — configurable part-payment reminder. A workflow step can carry the
 * REMIND_PART_PAYMENT effect; when that step completes AND the matter is still
 * only part-paid, the client is pushed an in-app "Payment reminder" (which also
 * emails via the shared notification transport). A fully-paid matter passing the
 * same step gets nothing.
 *
 * The incorporation definition attaches the effect to step 20 ("Name Approval
 * Letter Received"). We DISCOVER the trigger step from the live definition rather
 * than hardcoding 20, so re-timing the reminder in the editor can't break this.
 */

// Find the step number carrying REMIND_PART_PAYMENT in the matter's live def.
async function reminderStep(taskId: string): Promise<number | null> {
  const def = await getDefinitionForMatter(taskId);
  const s = def.steps.find((st) => (st as { effects?: string[] }).effects?.includes('REMIND_PART_PAYMENT'));
  return s ? s.stepNumber : null;
}

test('part-paid matter: completing the reminder step notifies the client', async () => {
  const taskId = await createPartPaidMatter();
  try {
    const trigger = await reminderStep(taskId);
    test.skip(trigger === null, 'no REMIND_PART_PAYMENT step in this workflow');

    // Land ON the trigger step, then complete it — the effect fires on THAT
    // step's completion. Advancing with `> trigger` can route around it (the
    // flow branches), leaving the effect never executed and the test red for a
    // reason unrelated to the feature.
    await advanceUntil(taskId, (s) => s.stepNumber === (trigger as number));
    const at = await getMatter(taskId);
    test.skip(at.currentStepNumber !== trigger,
      `could not land on the reminder step (at ${at.currentStepNumber})`);

    const api = await apiAs('admin');
    const fired = await api.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP' } },
    });
    await api.dispose();
    expect(fired.ok()).toBeTruthy();

    const m = await getMatter(taskId);
    expect(m.currentStepNumber).toBeGreaterThan(trigger as number);

    // Scoped to THIS matter: the client's feed is shared, so an unscoped wait
    // could pass on a reminder left by another test — a false green.
    const gotReminder = await waitForNotification('client', /payment reminder/i, 20_000, taskId);
    expect(gotReminder, 'client should receive a Payment reminder').toBe(true);
  } finally {
    await deleteMatter(taskId);
  }
});

test('fully-paid matter: the reminder step does NOT notify the client', async () => {
  const taskId = await createMatter(); // fully_paid
  try {
    const trigger = await reminderStep(taskId);
    test.skip(trigger === null, 'no REMIND_PART_PAYMENT step in this workflow');

    await advanceUntil(taskId, (s) => s.stepNumber > (trigger as number));
    const m = await getMatter(taskId);
    expect(m.currentStepNumber).toBeGreaterThan(trigger as number);

    // Give any async effect a moment, then assert NO payment-reminder reached the
    // client FOR THIS MATTER. Scoping by taskId is essential: the client's feed is
    // shared across matters, and the part-paid test above deliberately fires a
    // reminder — an unscoped check reads that one and fails this test.
    await new Promise((r) => setTimeout(r, 3000));
    const list = await getNotifications('client');
    const hasReminder = list.some((n) =>
      n.taskId === taskId
      && (/payment reminder/i.test(n.title) || /payment reminder/i.test(n.message)));
    expect(hasReminder, 'fully-paid matter must not trigger a payment reminder').toBe(false);
  } finally {
    await deleteMatter(taskId);
  }
});
