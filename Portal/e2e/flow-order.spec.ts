import { test, expect } from './fixtures';
import { apiAs, deleteMatter, deleteDefinition, transition, currentStep, getMatter } from './api';
import { env } from './helpers';

/**
 * #117 + #55 + #105 + #138 + #139 + #140 — proven on a definition whose AUTHORED
 * order differs from the numeric stepNumber order (steps added later keep high
 * identity numbers):
 *
 *   authored flow:  1 (Alpha) → 6 (Bravo) → 5 (Hidden, clientVisible:false) →
 *                   2 (Charlie, payment gate) → 3 (Delta, client approval) → 4 (final)
 *
 *  • #117: completing Alpha jumps 1 → 6; nothing sits between them in AUTHORED
 *    order, so the gate (2) and later steps stay pending. The gate completes only
 *    when the flow actually reaches it.
 *  • #140: Bravo(6) → Hidden(5) and Hidden(5) → Delta(3) are AUTHORED-forward but
 *    NUMERICALLY backward — the old code misread them as REWORK and reset the
 *    completed step to 'pending'. Each departed step must be 'completed'.
 *  • #55: the timeline renders in authored order, numbered 1..N.
 *  • #138: a completing comment belongs to the completed step's row only — never
 *    echoed on the next in-progress step.
 *  • #139: the client must never see the Hidden step — not in the definition, not
 *    in the step list, not as the "current step" while the matter sits on it.
 *  • #105: staff post a "Note to client" onto the waiting approval step.
 */

let defId: string;
let serviceKey: string;
let taskId: string;

test.beforeAll(async () => {
  const api = await apiAs('admin');
  const ts = Date.now();
  defId = `e2e-flow-${ts}`;
  serviceKey = `e2e-flow-svc-${ts}`;
  const def = {
    id: defId,
    name: `E2E Flow Order ${ts}`,
    initialStep: 1,
    serviceKeys: [serviceKey],
    steps: [
      { stepNumber: 1, title: 'Alpha', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 6 }] },
      { stepNumber: 6, title: 'Bravo', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 5 }] },
      { stepNumber: 5, title: 'HiddenInternal', type: 'step', clientVisible: false, transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
      { stepNumber: 2, title: 'Charlie', type: 'payment_gate', gate: { requires: 'fully_paid', onPass: 3, onWait: 2 } },
      { stepNumber: 3, title: 'Delta', type: 'step', defaultAssigneeUid: '__CLIENT__', transitions: [{ event: 'CLIENT_APPROVE', to: 4 }] },
      { stepNumber: 4, title: 'Omega', type: 'final' },
    ],
  };
  const res = await api.post('/api/workflow-definitions', { data: def });
  if (!res.ok()) throw new Error(`def create failed: ${res.status()} ${await res.text()}`);
  const created = await api.post('/api/tasks', {
    data: {
      clientUid: env('E2E_CLIENT_UID'), serviceKey,
      paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
    },
  });
  if (!created.ok()) throw new Error(`matter create failed: ${created.status()} ${await created.text()}`);
  taskId = (await created.json()).id;
  await api.dispose();
});

test.afterAll(async () => {
  if (taskId) await deleteMatter(taskId);
  if (defId) await deleteDefinition(defId);
});

const stepStatus = async (n: number) => {
  const steps = (await getMatter(taskId)).steps as Array<{ stepNumber: number; status: string }>;
  return steps.find((s) => s.stepNumber === n)?.status;
};

test.describe.serial('flow-order lifecycle', () => {
  test('#117: a forward jump sweeps only AUTHORED-order-between steps — the gate stays pending', async () => {
    // Complete Alpha (1 → 6) with a comment (used by the #138 check below).
    await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: '<p>COMMENT-138-X</p>' });
    expect(await currentStep(taskId)).toBe(6);
    expect(await stepStatus(1)).toBe('completed');
    expect(await stepStatus(5)).toBe('pending');
    expect(await stepStatus(2)).toBe('pending'); // the gate — was wrongly 'completed'
    expect(await stepStatus(3)).toBe('pending'); // was wrongly 'skipped'
  });

  test('#138: the completing comment shows on the COMPLETED step row, not the current one', async ({ adminPage }) => {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // Completed Alpha (row 1) carries the comment…
    const alpha = adminPage.locator('#step-row-1:visible').first();
    await expect(alpha).toBeVisible({ timeout: 15_000 });
    await alpha.getByRole('button').first().click(); // expand
    await expect(alpha.getByText('COMMENT-138-X').first()).toBeVisible();
    // …and the current in-progress Bravo (row 6) does NOT echo it.
    const bravo = adminPage.locator('#step-row-6:visible').first();
    await expect(bravo).toBeVisible();
    await expect(bravo).not.toContainText('COMMENT-138-X');
  });

  test('#140: an authored-forward but numerically-backward move COMPLETES the departed step', async () => {
    // Bravo (6) → Hidden (5): authored-forward, numerically backward. The old
    // numeric direction check misread this as REWORK and reset 6 to 'pending'.
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    expect(await currentStep(taskId)).toBe(5);
    expect(await stepStatus(6)).toBe('completed'); // was wrongly 'pending' (#140)
    expect(await stepStatus(5)).toBe('active');
  });

  test('#139: on a hidden step, the client sees the LAST visible step as current (no trace of the hidden one)', async ({ clientPage }) => {
    // The matter now SITS on the hidden step (5). The client must not see it —
    // instead they keep seeing the last visible step (Bravo, 6) as in progress.
    const client = await apiAs('client');
    const def = await (await client.get(`/api/workflow-definitions/${defId}`)).json();
    expect((def.steps ?? []).some((s: { stepNumber: number }) => s.stepNumber === 5)).toBe(false);
    const t = await (await client.get(`/api/tasks/${taskId}`)).json();
    expect((t.steps ?? []).some((s: { stepNumber: number }) => s.stepNumber === 5)).toBe(false);
    // Server-side fallback: current step = Bravo (6), flagged, shown in-progress.
    expect(t.currentStepNumber).toBe(6);
    expect(t.currentStepFallback).toBe(true);
    expect((t.steps as Array<{ stepNumber: number; status: string }>).find((s) => s.stepNumber === 6)?.status).toBe('active');
    await client.dispose();

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // No hidden-step title anywhere; Bravo presented as the current step with a
    // calm note and no action buttons.
    await expect(clientPage.getByText('HiddenInternal')).toHaveCount(0);
    await expect(clientPage.getByText('Bravo').first()).toBeVisible({ timeout: 15_000 });
    await expect(clientPage.getByText(/no action is needed from you right now/i).first()).toBeVisible();
  });

  test('#117/#140: the gate completes only when reached; the hidden step completes on departure', async () => {
    // Hidden (5) → gate (2, fully paid, cascades) → Delta (3). Again numerically
    // backward but authored-forward.
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    expect(await currentStep(taskId)).toBe(3);
    expect(await stepStatus(5)).toBe('completed');
    expect(await stepStatus(2)).toBe('completed'); // passed through NOW
    expect(await stepStatus(3)).toBe('active');
  });

  test('#55: the staff timeline renders in AUTHORED order, numbered 1..N', async ({ adminPage }) => {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const titles = adminPage.locator('div[title$=" step"] > button > div > p.text-sm').filter({ hasText: /^\d+\.\s/ });
    await expect(titles.first()).toBeVisible({ timeout: 15_000 });
    const seq = [...new Set((await titles.allInnerTexts()).map((t) => t.trim()))];
    expect(seq).toEqual(['1. Alpha', '2. Bravo', '3. HiddenInternal', '4. Charlie', '5. Delta']);
  });

  test('#105: staff post a Note to client on the waiting approval step; the client receives it', async ({ clientPage }) => {
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/steps/3/note`, {
      data: { note: '<p>Proposed name: NOTE-105-ABC Pvt Ltd</p>' },
    });
    expect(res.status()).toBe(201);
    await admin.dispose();

    // Still on Delta — the note did NOT advance the step.
    expect(await currentStep(taskId)).toBe(3);

    const client = await apiAs('client');
    const events = (await (await client.get(`/api/tasks/${taskId}/events`)).json()).data as
      Array<{ type: string; comment: string | null; byName: string }>;
    const note = events.find((e) => e.type === 'STEP_NOTE');
    expect(note?.comment).toContain('NOTE-105-ABC');
    expect(note?.byName).toBe('Our team');
    await client.dispose();

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(clientPage.getByText('Shared by our team').first()).toBeVisible({ timeout: 15_000 });
    await expect(clientPage.getByText('NOTE-105-ABC Pvt Ltd').first()).toBeVisible();
  });

  test('#105: a client cannot post step notes (staff only)', async () => {
    const client = await apiAs('client');
    const res = await client.post(`/api/tasks/${taskId}/steps/3/note`, { data: { note: 'nope' } });
    expect(res.status()).toBe(403);
    await client.dispose();
  });
});
