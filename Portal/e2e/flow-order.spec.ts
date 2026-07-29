import { test, expect } from './fixtures';
import { apiAs, deleteMatter, deleteDefinition, transition, currentStep, getMatter } from './api';
import { env } from './helpers';

/**
 * #117 + #55 + #105 — proven on a definition whose AUTHORED order differs from
 * the numeric stepNumber order (steps added later keep high identity numbers):
 *
 *   authored flow:  1 (Alpha) → 6 (Bravo) → 2 (Charlie, payment gate) → 3 (Delta,
 *                   client approval) → 4 (final)
 *
 *  • #117: completing Alpha jumps 1 → 6. The OLD numeric sweep marked everything
 *    in 2..5 as bypassed — wrongly auto-completing the payment gate (2) and
 *    skipping Delta (3). Now nothing between them in AUTHORED order → both stay
 *    pending. The gate completes only when the flow actually reaches it (6 → 2 →
 *    cascades to 3 on a fully-paid matter).
 *  • #55: the timeline renders in authored order (Alpha, Bravo, Charlie, Delta)
 *    numbered 1..4 — not numerically re-sorted to Alpha, Charlie, Delta, Bravo.
 *  • #105: Delta is a client-approval step the matter LANDS on (no incoming
 *    comment). Staff post a "Note to client" without advancing; the client's
 *    events carry it (their info box source), masked as "Our team".
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
      { stepNumber: 6, title: 'Bravo', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
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

test('#117: a forward jump sweeps only AUTHORED-order-between steps — the payment gate stays pending', async () => {
  // Complete Alpha (1 → 6). Numerically 2..5 sit "between", but authored order has
  // nothing between them — so the gate (2) and Delta (3) must stay pending.
  await transition('admin', taskId, { type: 'COMPLETE_STEP' });
  expect(await currentStep(taskId)).toBe(6);
  let steps = (await getMatter(taskId)).steps as Array<{ stepNumber: number; status: string }>;
  expect(steps.find((s) => s.stepNumber === 2)?.status).toBe('pending'); // the gate — was wrongly 'completed'
  expect(steps.find((s) => s.stepNumber === 3)?.status).toBe('pending'); // was wrongly 'skipped'

  // Complete Bravo (6 → gate 2 → cascades onPass to Delta 3 on a fully-paid
  // matter). ONLY NOW does the gate complete — it was actually passed through.
  await transition('admin', taskId, { type: 'COMPLETE_STEP' });
  expect(await currentStep(taskId)).toBe(3);
  steps = (await getMatter(taskId)).steps as Array<{ stepNumber: number; status: string }>;
  expect(steps.find((s) => s.stepNumber === 2)?.status).toBe('completed');
  expect(steps.find((s) => s.stepNumber === 3)?.status).toBe('active');
});

test('#55: the timeline renders in AUTHORED order, numbered 1..N', async ({ adminPage }) => {
  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

  const titles = adminPage.locator('div[title$=" step"] > button > div > p.text-sm').filter({ hasText: /^\d+\.\s/ });
  await expect(titles.first()).toBeVisible({ timeout: 15_000 });
  const texts = (await titles.allInnerTexts()).map((t) => t.trim());
  // Dedupe responsive duplicates while preserving order.
  const seq = [...new Set(texts)];
  expect(seq).toEqual(['1. Alpha', '2. Bravo', '3. Charlie', '4. Delta']);
});

test('#105: staff post a Note to client on the waiting approval step; the client receives it', async ({ clientPage }) => {
  // The matter is WAITING on Delta (client approval) — landed on it, no incoming
  // comment. Staff share the review info without advancing the step.
  const admin = await apiAs('admin');
  const res = await admin.post(`/api/tasks/${taskId}/steps/3/note`, {
    data: { note: '<p>Proposed name: NOTE-105-ABC Pvt Ltd</p>' },
  });
  expect(res.status()).toBe(201);
  await admin.dispose();

  // Still on Delta — the note did NOT advance the step.
  expect(await currentStep(taskId)).toBe(3);

  // The client's event feed carries the note (this is what fills the info box),
  // masked as team ("Our team"), never a staff name.
  const client = await apiAs('client');
  const events = (await (await client.get(`/api/tasks/${taskId}/events`)).json()).data as
    Array<{ type: string; comment: string | null; byName: string }>;
  const note = events.find((e) => e.type === 'STEP_NOTE');
  expect(note?.comment).toContain('NOTE-105-ABC');
  expect(note?.byName).toBe('Our team');
  await client.dispose();

  // And the client UI shows it in the read-only info box above Approve.
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
