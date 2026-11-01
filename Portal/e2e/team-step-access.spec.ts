import { test, expect } from './fixtures';
import {
  advanceUntil, apiAs, assignMatter, assignStep, createMatter, createPartPaidMatter, deleteDefinition, deleteMatter,
  firstPaymentGate, getDefinitionForMatter, getMatter, transition, transitionStatusAs,
} from './api';
import { env } from './helpers';

/**
 * A team member may advance a step only if they own the matter or the step. The
 * page used to offer them the button anyway, and pressing it failed with 403.
 * Who may complete a step has not changed; only what the page offers has.
 */
const TEAM = env('E2E_TEAM_UID');

let defId: string;
let serviceKey: string;
let taskId: string;

test.beforeAll(async () => {
  const api = await apiAs('admin');
  const ts = Date.now();
  defId = `e2e-teamaccess-${ts}`;
  serviceKey = `e2e-teamaccess-svc-${ts}`;
  const res = await api.post('/api/workflow-definitions', {
    data: {
      id: defId,
      name: `E2E Team access ${ts}`,
      initialStep: 1,
      serviceKeys: [serviceKey],
      steps: [
        { stepNumber: 1, title: 'Unowned work', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
        { stepNumber: 2, title: 'Next work', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 3 }] },
        { stepNumber: 3, title: 'Done', type: 'final' },
      ],
    },
  });
  if (!res.ok()) throw new Error(`def create failed ${res.status()}: ${await res.text()}`);
  await api.dispose();
});
test.afterAll(async () => { if (defId) await deleteDefinition(defId); });
test.beforeEach(async () => { taskId = await createMatter({ serviceKey }); });
test.afterEach(async () => { await deleteMatter(taskId); });

const open = async (page: import('@playwright/test').Page, id: string) => {
  await page.goto(`tasks/${id}`);
  await page.getByRole('button', { name: 'Steps', exact: true }).click();
};
const complete = (page: import('@playwright/test').Page) => page.getByRole('button', { name: /^complete step$/i });

test('an unassigned step offers a team member no button; a manager keeps it', async ({ teamPage, managerPage }) => {
  await open(teamPage, taskId);
  await expect(teamPage.getByText(/isn.t assigned to anyone yet/i).locator('visible=true')).toHaveCount(1);
  await expect(complete(teamPage)).toHaveCount(0);
  expect(await transitionStatusAs('team', taskId, { type: 'COMPLETE_STEP' }), 'the backend rule is unchanged').toBe(403);

  await open(managerPage, taskId);
  await expect(complete(managerPage)).toBeVisible();
});

test('the team member assigned to the step gets the button, and it works', async ({ teamPage }) => {
  await assignStep(taskId, 1, TEAM);
  await open(teamPage, taskId);
  await complete(teamPage).click();
  await expect.poll(async () => (await getMatter(taskId)).currentStepNumber).toBe(2);
});

test('the team member who owns the matter gets the button', async ({ teamPage }) => {
  await assignMatter(taskId, TEAM);
  await open(teamPage, taskId);
  await expect(complete(teamPage)).toBeVisible();
});

const myRow = async (id: string) => {
  const api = await apiAs('team');
  const body = await (await api.get('/api/tasks/my-steps')).json();
  await api.dispose();
  return ((body.data ?? body) as { taskId: string; bucket: string }[]).find((r) => r.taskId === id);
};

test('My Tasks: an unassigned step the team member cannot complete is not listed', async () => {
  // Assigned step 1, so the matter is in their reach; step 2 then has no owner.
  await assignStep(taskId, 1, TEAM);
  expect((await myRow(taskId))?.bucket).toBe('assigned');
  await transition('admin', taskId, { type: 'COMPLETE_STEP' });
  expect(await transitionStatusAs('team', taskId, { type: 'COMPLETE_STEP' }), 'they cannot complete it').toBe(403);
  expect(await myRow(taskId), 'so it is not offered').toBeFalsy();
});

test('My Tasks: the step on a matter they own stays listed', async () => {
  await assignMatter(taskId, TEAM);
  await transition('admin', taskId, { type: 'COMPLETE_STEP' });
  expect(await myRow(taskId)).toBeTruthy();
});

test('a payment step offers a team member who owns nothing no button', async ({ teamPage }) => {
  // Only a part-paid matter parks on a payment step; see step-execution.spec.ts.
  const paymentMatter = await createPartPaidMatter();
  try {
    const gate = firstPaymentGate(await getDefinitionForMatter(paymentMatter));
    test.skip(!gate, 'No payment step in this workflow.');
    await advanceUntil(paymentMatter, (s) => s.type === 'payment_gate');
    const at = (await getMatter(paymentMatter)).currentStepNumber as number;
    const def = await getDefinitionForMatter(paymentMatter);
    test.skip(def.steps.find((s) => s.stepNumber === at)?.type !== 'payment_gate', 'Did not park on a payment step.');
    await open(teamPage, paymentMatter);
    await expect(teamPage.getByRole('button', { name: /mark as paid/i })).toHaveCount(0);
  } finally { await deleteMatter(paymentMatter); }
});
