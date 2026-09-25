import { test, expect } from './fixtures';
import { apiAs, deleteDefinition, createMatter, deleteMatter, getMatter } from './api';
import { env } from './helpers';

/**
 * #192 — a workflow step may have SEVERAL default assignees.
 *
 * Model (chosen for this feature): `assignedToUids` is the full list and
 * `assignedTo` stays its FIRST entry, so every existing consumer — My Tasks
 * routing, the matters filter, the steps/assignedTo collection-group index —
 * keeps working. ANY listed assignee may complete the step.
 */
const TEAM = env('E2E_TEAM_UID');
const MANAGER = env('E2E_MANAGER_UID');

let defId: string;
let serviceKey: string;

test.beforeAll(async () => {
  const api = await apiAs('admin');
  const ts = Date.now();
  defId = `e2e-multiassign-${ts}`;
  serviceKey = `e2e-multiassign-svc-${ts}`;
  const res = await api.post('/api/workflow-definitions', {
    data: {
      id: defId,
      name: `E2E Multi-assignee ${ts}`,
      initialStep: 1,
      serviceKeys: [serviceKey],
      steps: [
        { stepNumber: 1, title: 'Shared work', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
        { stepNumber: 2, title: 'Done', type: 'final' },
      ],
    },
  });
  if (!res.ok()) throw new Error(`def create failed ${res.status()}: ${await res.text()}`);
  await api.dispose();
});
test.afterAll(async () => { if (defId) await deleteDefinition(defId); });

test('#192: step settings accept and return several assignees', async () => {
  const admin = await apiAs('admin');
  const put = await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [TEAM, MANAGER] } } },
  });
  expect(put.ok(), 'multi-assignee save accepted').toBeTruthy();

  const got = await (await admin.get(`/api/workflow-definitions/${defId}/step-settings`)).json();
  const step1 = (got.steps as Array<Record<string, unknown>>).find((s) => s.stepNumber === 1)!;
  expect(step1.assigneeUids).toEqual([TEAM, MANAGER]);
  // The primary stays the first entry so single-assignee consumers still work.
  expect(step1.assigneeUid).toBe(TEAM);
  await admin.dispose();
});

test('#192: a client can never be a step assignee, even inside the list', async () => {
  const admin = await apiAs('admin');
  const res = await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [TEAM, env('E2E_CLIENT_UID')] } } },
  });
  expect(res.status(), 'a client in the list is refused').toBe(400);
  expect((await res.json()).message).toMatch(/client/i);
  await admin.dispose();
});

test('#192: a new matter materialises the whole list onto its step', async () => {
  const admin = await apiAs('admin');
  await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [TEAM, MANAGER] } } },
  });
  await admin.dispose();

  const taskId = await createMatter({ serviceKey });
  try {
    const m = await getMatter(taskId);
    const step1 = ((m.steps ?? []) as Array<Record<string, unknown>>).find((s) => s.stepNumber === 1)!;
    expect(step1.assignedToUids, 'both assignees stamped').toEqual([TEAM, MANAGER]);
    expect(step1.assignedTo, 'primary is the first entry').toBe(TEAM);
    // Every assignee's name is resolved for display, not just the primary's.
    expect((step1.assigneeNames as string[])?.length).toBe(2);
  } finally { await deleteMatter(taskId); }
});

test('#192: a SECONDARY assignee sees the step in My Tasks and may complete it', async () => {
  const admin = await apiAs('admin');
  await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [MANAGER, TEAM] } } }, // manager primary
  });
  await admin.dispose();

  const taskId = await createMatter({ serviceKey });
  try {
    // The TEAM member is the secondary assignee — the step must still be theirs.
    const team = await apiAs('team');
    const mine = await (await team.get('/api/tasks/my-steps')).json();
    const rows = (mine.data ?? mine) as Array<{ taskId: string }>;
    expect(rows.some((r) => r.taskId === taskId), 'secondary sees it in My Tasks').toBe(true);

    // …and may complete it (any one assignee moves the workflow on).
    const res = await team.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP' } },
    });
    expect(res.status(), 'secondary assignee may complete').toBe(200);
    await team.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#192: someone NOT on the list still cannot complete the step', async () => {
  const admin = await apiAs('admin');
  await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [MANAGER] } } }, // team NOT included
  });
  await admin.dispose();

  const taskId = await createMatter({ serviceKey });
  try {
    const team = await apiAs('team');
    const res = await team.post(`/api/tasks/${taskId}/transition`, {
      data: { event: { type: 'COMPLETE_STEP' } },
    });
    expect(res.status(), 'non-assignee is refused').toBe(403);
    // Refused by the matter/step authorisation gate — a team member on neither the
    // matter nor the step's assignee list never reaches the NOT_STEP_ASSIGNEE check.
    // What matters is that adding a list did not open a hole: still a hard 403.
    const body = await res.json();
    expect(body.code ?? 'FORBIDDEN', 'refused, not completed').not.toBe('OK');
    expect(String(body.message ?? '')).toMatch(/not allowed|assign/i);
    await team.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#192: the picker offers checkboxes for several members', async ({ adminPage }) => {
  const admin = await apiAs('admin');
  await admin.dispose();

  await adminPage.goto(`services/${serviceKey}`);
  await adminPage.waitForTimeout(2500);
  const picker = adminPage.getByLabel(/Step \d+ assignees/).first();
  await expect(picker).toBeVisible({ timeout: 15_000 });
  await picker.click();
  // Exclusive options plus per-member checkboxes.
  await expect(adminPage.getByRole('button', { name: /inherit from phase/i }).first()).toBeVisible();
  expect(await adminPage.locator('input[type="checkbox"]').count()).toBeGreaterThan(1);
});
