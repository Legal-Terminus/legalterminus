import { test, expect } from './fixtures';
import {
  createPartPaidMatter, createMatter, deleteMatter, getDefinitionForMatter,
  advanceUntil, getMatter, waitForNotification, getNotifications,
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

    // Advance PAST the trigger step so its completion effect fires.
    await advanceUntil(taskId, (s) => s.stepNumber > (trigger as number));
    const m = await getMatter(taskId);
    expect(m.currentStepNumber).toBeGreaterThan(trigger as number);

    const gotReminder = await waitForNotification('client', /payment reminder/i);
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

    // Give any async effect a moment, then assert NO payment-reminder reached the client.
    await new Promise((r) => setTimeout(r, 3000));
    const list = await getNotifications('client');
    const hasReminder = list.some((n) => /payment reminder/i.test(n.title) || /payment reminder/i.test(n.message));
    expect(hasReminder, 'fully-paid matter must not trigger a payment reminder').toBe(false);
  } finally {
    await deleteMatter(taskId);
  }
});
