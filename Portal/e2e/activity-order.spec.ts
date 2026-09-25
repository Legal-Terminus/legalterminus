import { test, expect } from './fixtures';
import { apiAs, assignStep, createMatter, deleteMatter, deleteDefinition, transition } from './api';

/**
 * #199 — Activity history must show the LATEST action first, and
 * "Show previous steps" may only add older activity, never hide the newest.
 *
 * Before: events ran oldest→newest, groups were ordered by step number, and the
 * default view was "current step + the step before it in the definition". So
 * reassigning an EARLIER step (or a rework, reopen or branch jump) put the most
 * recent action behind the expander.
 */

const SERVICE_KEY = `e2e-activity-order-${Date.now()}`;
let defId = '';

test.beforeAll(async () => {
  const api = await apiAs('admin');
  defId = `e2e-activity-order-def-${Date.now()}`;
  const res = await api.post('/api/workflow-definitions', {
    data: {
      id: defId, name: `E2E Activity Order ${defId}`, initialStep: 1, serviceKeys: [SERVICE_KEY],
      steps: [
        { stepNumber: 1, title: 'First', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
        { stepNumber: 2, title: 'Second', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 3 }] },
        { stepNumber: 3, title: 'Third', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 4 }] },
        { stepNumber: 4, title: 'Done', type: 'final' },
      ],
    },
  });
  expect(res.ok(), `create definition: ${res.status()} ${await res.text()}`).toBe(true);
  await api.dispose();
});

test.afterAll(async () => { if (defId) await deleteDefinition(defId); });

test('#199: the newest action leads the feed, even on an earlier step', async ({ adminPage }) => {
  const taskId = await createMatter({ serviceKey: SERVICE_KEY });
  try {
    await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: 'E2E-199 first step done' });
    await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: 'E2E-199 second step done' });
    // The newest action happens on step 1 — neither current (3) nor the one before it.
    await assignStep(taskId, 1, process.env.E2E_TEAM_UID!);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    const rows = adminPage.getByTestId('activity-row');
    await expect(rows.first()).toContainText('reassigned the step');
    // Within that step, newest first: the reassignment, then the completion.
    await expect(rows.nth(1)).toContainText('E2E-199 first step done');
  } finally { await deleteMatter(taskId); }
});

test('#199: a matter reassignment is recorded in the activity history', async ({ adminPage }) => {
  const taskId = await createMatter({ serviceKey: SERVICE_KEY });
  try {
    const api = await apiAs('admin');
    const res = await api.patch(`/api/tasks/${taskId}`, { data: { assignedTo: process.env.E2E_TEAM_UID } });
    expect(res.ok(), `reassign: ${res.status()}`).toBe(true);
    await api.dispose();

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(adminPage.getByTestId('activity-row').first()).toContainText('reassigned the matter');
  } finally { await deleteMatter(taskId); }
});
