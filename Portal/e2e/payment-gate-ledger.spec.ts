import { test, expect } from './fixtures';
import { env } from './helpers';
import {
  apiAs, createPartPaidMatter, deleteMatter, getMatter, getDefinitionForMatter,
  firstPaymentGate, advanceUntil, assignMatter, assignStep, transitionStatusAs,
} from './api';

/**
 * SEC F-01 (ported from Ambyflow's October 2026 security audit, 2026-11-04).
 *
 * The payment checkpoint follows the payment history. A team member cannot
 * confirm a payment; an admin/manager's "Mark as Paid" passes the checkpoint
 * only once the money is in the ledger. Before this, any team member on the
 * matter could mark it fully paid with no payment recorded.
 *
 * Workflows are editable: the checkpoint is discovered from the live definition,
 * and the tests skip when the service has none.
 */

/** A part-paid matter (4000 of 10000) parked on its blocking payment checkpoint,
 *  or null when this workflow never parks on one. */
async function matterOnGate(): Promise<{ taskId: string; gateStep: number } | null> {
  const taskId = await createPartPaidMatter();
  const def = await getDefinitionForMatter(taskId);
  if (!firstPaymentGate(def)) { await deleteMatter(taskId); return null; }
  await advanceUntil(taskId, (s) => s.type === 'payment_gate');
  const gateStep = (await getMatter(taskId)).currentStepNumber as number;
  if (def.steps.find((s) => s.stepNumber === gateStep)?.type !== 'payment_gate') {
    await deleteMatter(taskId);
    return null;
  }
  return { taskId, gateStep };
}

test.describe('F-01: the payment checkpoint follows the payment history', () => {
  let taskId = '';
  let gateStep = 0;

  test.beforeAll(async () => {
    const parked = await matterOnGate();
    if (!parked) return;
    ({ taskId, gateStep } = parked);
    // The team member owns both the matter and the checkpoint step — the
    // strongest position the old hole could be used from.
    await assignMatter(taskId, env('E2E_TEAM_UID'));
    await assignStep(taskId, gateStep, env('E2E_TEAM_UID'));
  });
  test.afterAll(async () => { if (taskId) await deleteMatter(taskId); });

  test('a team member cannot mark the matter paid, and has no button to try', async ({ teamPage }) => {
    test.skip(!taskId, 'This workflow has no blocking payment checkpoint.');

    const status = await transitionStatusAs('team', taskId, { type: 'RECORD_PAYMENT', newStatus: 'fully_paid' });
    expect(status).toBe(403);
    const m = await getMatter(taskId);
    expect(m.currentStepNumber).toBe(gateStep);
    expect(m.paymentStatus).toBe('part_paid');

    await teamPage.goto(`tasks/${taskId}`);
    await teamPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(teamPage.getByText('Waiting for payment to be recorded.').first()).toBeVisible();
    await expect(teamPage.getByRole('button', { name: /mark as paid/i })).toHaveCount(0);
  });

  test('a typed status is ignored: without a ledger entry the checkpoint stays shut', async () => {
    test.skip(!taskId, 'This workflow has no blocking payment checkpoint.');

    const api = await apiAs('manager');
    const res = await api.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'RECORD_PAYMENT', newStatus: 'fully_paid' } },
    });
    expect(res.status()).toBe(409);
    expect((await res.json()).code).toBe('PAYMENT_NOT_RECORDED');
    await api.dispose();

    const m = await getMatter(taskId);
    expect(m.currentStepNumber).toBe(gateStep);
    expect(m.paymentStatus).toBe('part_paid');
  });

  test('a manager records the balance, then Mark as Paid passes the checkpoint', async ({ managerPage }) => {
    test.skip(!taskId, 'This workflow has no blocking payment checkpoint.');

    const api = await apiAs('manager');
    const paid = await api.post(`/api/tasks/${taskId}/payments`, { data: { amount: 6000, mode: 'E2E' } });
    expect(paid.status(), await paid.text()).toBe(201);
    const ledger = await (await api.get(`/api/tasks/${taskId}/payments`)).json();
    await api.dispose();
    expect(ledger.paymentStatus).toBe('fully_paid');
    // Recording the payment alone does not move the matter — the click does.
    expect((await getMatter(taskId)).currentStepNumber).toBe(gateStep);

    await managerPage.goto(`tasks/${taskId}`);
    await managerPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await managerPage.getByRole('button', { name: /mark as paid/i }).click();

    await expect(async () => {
      const m = await getMatter(taskId);
      expect(m.currentStepNumber).not.toBe(gateStep);
      expect(m.paymentStatus).toBe('fully_paid');
    }).toPass({ timeout: 15_000 });
  });
});
