import { test, expect } from './fixtures';
import {
  createMatter, deleteMatter, getMatter, getDefinitionForMatter,
  firstPaymentGate, firstPlainStep, firstClientStep, advanceUntil,
  currentStep, assignStep, apiAs, transition,
} from './api';

/**
 * E02/E03/E06 — workflow STEP EXECUTION (core engine) through the UI.
 *
 * Workflows are EDITABLE, so nothing here hardcodes step numbers/types — each test
 * fetches the live definition and discovers the relevant step (first payment gate,
 * first plain step, first client-approval step), advances to it generically, then
 * drives the real transition through the UI and asserts the engine advanced.
 */

let taskId: string;
test.beforeEach(async () => { taskId = await createMatter(); });
test.afterEach(async () => { await deleteMatter(taskId); });

test('payment gate blocks until override, then advances', async ({ adminPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const gate = firstPaymentGate(def);
  test.skip(!gate, 'This workflow has no payment gate.');

  // Advance to the gate (no-op if it is the first step).
  await advanceUntil(taskId, (s) => s.type === 'payment_gate');
  expect((await getMatter(taskId)).currentStepNumber).toBe(gate!.stepNumber);

  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(adminPage.getByRole('button', { name: /admin override/i })).toBeVisible();
  await adminPage.getByRole('button', { name: /admin override/i }).click();

  await expect(async () => {
    expect((await getMatter(taskId)).currentStepNumber as number).toBeGreaterThan(gate!.stepNumber);
  }).toPass({ timeout: 15_000 });
});

test('payment gate: Mark as Paid sets paid status and advances', async ({ adminPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const gate = firstPaymentGate(def);
  test.skip(!gate, 'This workflow has no payment gate.');
  await advanceUntil(taskId, (s) => s.type === 'payment_gate');

  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await adminPage.getByRole('button', { name: /mark as paid/i }).click();

  await expect(async () => {
    const m = await getMatter(taskId);
    expect(m.currentStepNumber as number).toBeGreaterThan(gate!.stepNumber);
    expect(m.paymentStatus).toBe('fully_paid');
  }).toPass({ timeout: 15_000 });
});

test('plain step: Complete Step advances the workflow', async ({ adminPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const plain = firstPlainStep(def);
  test.skip(!plain, 'This workflow has no plain COMPLETE_STEP step.');

  // Advance to the first plain step.
  await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
  const before = (await getMatter(taskId)).currentStepNumber as number;
  test.skip(before !== plain!.stepNumber, `Could not reach the plain step (at ${before}).`);

  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await adminPage.getByRole('button', { name: /complete step/i }).click();

  await expect(async () => {
    expect((await getMatter(taskId)).currentStepNumber as number).toBeGreaterThan(before);
  }).toPass({ timeout: 15_000 });
});

test('client-action step: client approves and the matter advances', async ({ clientPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const clientStep = firstClientStep(def);
  test.skip(!clientStep, 'This workflow has no client-approval step.');

  const reached = await advanceUntil(taskId, (s) => s.stepNumber === clientStep!.stepNumber);
  test.skip(reached !== clientStep!.stepNumber, `Could not reach client step (at ${reached}).`);

  await clientPage.goto(`tasks/${taskId}`);
  await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(clientPage.getByRole('button', { name: 'Approve', exact: true })).toBeVisible();
  await clientPage.getByRole('button', { name: 'Approve', exact: true }).click();

  await expect(async () => {
    expect((await getMatter(taskId)).currentStepNumber as number).not.toBe(clientStep!.stepNumber);
  }).toPass({ timeout: 15_000 });
});

test('#49: a non-assignee cannot complete a step assigned to someone else (API 403)', async () => {
  // Assign the active plain step to the team member; a MANAGER (not the assignee)
  // must be refused completion — their power is limited to reassign.
  const def = await getDefinitionForMatter(taskId);
  const plain = firstPlainStep(def);
  test.skip(!plain, 'No plain step.');
  await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
  const step = await currentStep(taskId);
  test.skip(step !== plain!.stepNumber, `Could not reach the plain step (at ${step}).`);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

  const mgr = await apiAs('manager');
  const res = await mgr.post(`/api/tasks/${taskId}/transition`, { data: { event: { type: 'COMPLETE_STEP' } } });
  expect(res.status()).toBe(403);
  const body = await res.json();
  expect(body.code).toBe('NOT_STEP_ASSIGNEE');
  await mgr.dispose();
  // The matter did not advance.
  expect(await currentStep(taskId)).toBe(step);
});

test('#49: an admin CAN override-complete another user’s step (API)', async () => {
  const def = await getDefinitionForMatter(taskId);
  const plain = firstPlainStep(def);
  test.skip(!plain, 'No plain step.');
  await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
  const step = await currentStep(taskId);
  test.skip(step !== plain!.stepNumber, `Could not reach the plain step (at ${step}).`);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

  // Admin is not the assignee, but keeps an audited override.
  await transition('admin', taskId, { type: 'COMPLETE_STEP' });
  expect((await getMatter(taskId)).currentStepNumber as number).toBeGreaterThan(step);
});

test('#49: the assignee sees Complete; a non-assignee manager sees the reassign note', async ({ teamPage, managerPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const plain = firstPlainStep(def);
  test.skip(!plain, 'No plain step.');
  await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
  const step = await currentStep(taskId);
  test.skip(step !== plain!.stepNumber, `Could not reach the plain step (at ${step}).`);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

  // Assignee (team) sees the Complete button.
  await teamPage.goto(`tasks/${taskId}`);
  await teamPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(teamPage.getByRole('button', { name: /complete step/i })).toBeVisible();

  // Non-assignee manager sees NO complete button — only the reassign note (#48 name shown too).
  await managerPage.goto(`tasks/${taskId}`);
  await managerPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await expect(managerPage.getByRole('button', { name: /complete step/i })).toHaveCount(0);
  await expect(managerPage.getByText(/only the assignee can complete this step/i)).toBeVisible();
});

test('#44: a team member assigned only the active step can complete it', async ({ teamPage }) => {
  // Advance to the first plain step and assign THAT STEP (not the matter) to the
  // team member. They must be able to complete it even without being matter owner
  // (covers Govt/Name approval steps routed to a team member). GitHub #44.
  const def = await getDefinitionForMatter(taskId);
  const plain = firstPlainStep(def);
  test.skip(!plain, 'No plain step.');
  await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
  const step = await currentStep(taskId);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);

  await teamPage.goto(`tasks/${taskId}`);
  await teamPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await teamPage.getByRole('button', { name: /complete step/i }).click();

  await expect(async () => {
    expect((await getMatter(taskId)).currentStepNumber as number).toBeGreaterThan(step);
  }).toPass({ timeout: 15_000 });
});

test('client-action step: staff do NOT get the client Approve CTA, but admin gets an override', async ({ adminPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const clientStep = firstClientStep(def);
  test.skip(!clientStep, 'This workflow has no client-approval step.');

  const reached = await advanceUntil(taskId, (s) => s.stepNumber === clientStep!.stepNumber);
  test.skip(reached !== clientStep!.stepNumber, `Could not reach client step (at ${reached}).`);

  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  // Staff must NOT get the client's own Approve CTA (exact label).
  await expect(adminPage.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
  // …but admin/manager DO get an override action to advance on the client's behalf.
  await expect(adminPage.getByRole('button', { name: /approve for client/i })).toBeVisible();
});

test('admin overrides a client step on the client’s behalf and the matter advances', async ({ adminPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const clientStep = firstClientStep(def);
  test.skip(!clientStep, 'This workflow has no client-approval step.');

  const reached = await advanceUntil(taskId, (s) => s.stepNumber === clientStep!.stepNumber);
  test.skip(reached !== clientStep!.stepNumber, `Could not reach client step (at ${reached}).`);

  await adminPage.goto(`tasks/${taskId}`);
  await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
  await adminPage.getByRole('button', { name: /approve for client/i }).click();

  await expect(async () => {
    expect((await getMatter(taskId)).currentStepNumber as number).not.toBe(clientStep!.stepNumber);
  }).toPass({ timeout: 15_000 });
});

test('team member CANNOT override a client step (admin/manager only)', async ({ teamPage }) => {
  const def = await getDefinitionForMatter(taskId);
  const clientStep = firstClientStep(def);
  test.skip(!clientStep, 'This workflow has no client-approval step.');

  const reached = await advanceUntil(taskId, (s) => s.stepNumber === clientStep!.stepNumber);
  test.skip(reached !== clientStep!.stepNumber, `Could not reach client step (at ${reached}).`);

  await teamPage.goto(`tasks/${taskId}`);
  await teamPage.getByRole('button', { name: 'Steps', exact: true }).click();
  // A team member sees neither the client CTA nor the admin/manager override.
  await expect(teamPage.getByRole('button', { name: /approve for client/i })).toHaveCount(0);
  await expect(teamPage.getByRole('button', { name: 'Approve', exact: true })).toHaveCount(0);
});
