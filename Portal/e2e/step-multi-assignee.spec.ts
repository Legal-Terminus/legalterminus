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

// Reopened #192: the API accepted a secondary assignee, but the matter screen
// compared the viewer with the PRIMARY assignee only — so the secondary saw
// "Assigned to …" and no button. Asserted through the UI, as that person.
test('#192: a SECONDARY assignee gets the Complete Step button on the matter screen', async ({ teamPage }) => {
  const admin = await apiAs('admin');
  await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [MANAGER, TEAM] } } }, // manager primary
  });
  await admin.dispose();

  const taskId = await createMatter({ serviceKey });
  try {
    await teamPage.goto(`tasks/${taskId}`);
    await teamPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const button = teamPage.getByRole('button', { name: /complete step/i });
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(async () => (await getMatter(taskId)).currentStepNumber).not.toBe(1);
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

// ── Reopened 2026-11-18 ────────────────────────────────────────────────────
// The firm: "Step settings do not let us add more than one assignee" and "when a
// step has several assignees, they cannot complete it". Three causes, each
// asserted below the way the firm meets it:
//  1. saving the Service from the workflow editor stripped `defaultAssigneeUids`
//     (the save schema did not list it), so new matters got ONE assignee;
//  2. the Step Settings save response omitted the list, so the picker showed one
//     name straight after "Save step settings";
//  3. the matter screen's "Step owner" was a single dropdown — it could hold one
//     person, and using it on a shared step dropped everyone else.

/** Display name as the Portal shows it (name → fullName → email). */
async function nameOf(uid: string): Promise<string> {
  const admin = await apiAs('admin');
  const u = await (await admin.get(`/api/portal/users/${uid}`)).json();
  await admin.dispose();
  return (u.name?.trim() || u.fullName?.trim() || u.email) as string;
}

async function stepOneSettings(): Promise<{ assigneeUid: string | null; assigneeUids: string[] }> {
  const admin = await apiAs('admin');
  const got = await (await admin.get(`/api/workflow-definitions/${defId}/step-settings`)).json();
  await admin.dispose();
  return (got.steps as Array<{ stepNumber: number; assigneeUid: string | null; assigneeUids: string[] }>)
    .find((s) => s.stepNumber === 1)!;
}

async function setStepOne(assigneeUids: string[]) {
  const admin = await apiAs('admin');
  const res = await admin.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids } } },
  });
  expect(res.ok(), 'step settings saved').toBeTruthy();
  const body = await res.json();
  await admin.dispose();
  return body;
}

test('#192 reopened: the Step Settings save response carries the whole list', async () => {
  const body = await setStepOne([TEAM, MANAGER]);
  const step1 = (body.steps as Array<Record<string, unknown>>).find((s) => s.stepNumber === 1)!;
  expect(step1.assigneeUids, 'the page caches this response — it must not lose anyone').toEqual([TEAM, MANAGER]);
});

test('#192 reopened: saving the Service in the workflow editor keeps several assignees', async () => {
  await setStepOne([TEAM, MANAGER]);

  // Exactly what the editor's "Save & publish" sends: the definition read back.
  const admin = await apiAs('admin');
  const current = await (await admin.get(`/api/workflow-definitions/${defId}`)).json();
  const { id: _id, version: _v, createdAt: _c, updatedAt: _u, updatedBy: _b, ...body } = current;
  void _id; void _v; void _c; void _u; void _b;
  const saved = await admin.patch(`/api/workflow-definitions/${defId}`, { data: body });
  expect(saved.ok(), 'editor save accepted').toBeTruthy();
  await admin.dispose();

  expect((await stepOneSettings()).assigneeUids, 'both survive the save').toEqual([TEAM, MANAGER]);
  const taskId = await createMatter({ serviceKey });
  try {
    const step1 = ((await getMatter(taskId)).steps as Array<Record<string, unknown>>).find((s) => s.stepNumber === 1)!;
    expect(step1.assignedToUids, 'a matter opened after the save has both').toEqual([TEAM, MANAGER]);
  } finally { await deleteMatter(taskId); }
});

test('#192 reopened: the editor\'s "Who does this? → Specific people" saves several people', async ({ adminPage }) => {
  await setStepOne([]);
  const [teamName, managerName] = await Promise.all([nameOf(TEAM), nameOf(MANAGER)]);

  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();
  await adminPage.getByLabel('Who does this?', { exact: true }).filter({ visible: true }).first()
    .selectOption({ label: 'Specific people' });
  await adminPage.getByLabel('Step 1 people', { exact: true }).filter({ visible: true }).click();
  await adminPage.getByRole('checkbox', { name: teamName, exact: true }).filter({ visible: true }).check();
  await adminPage.getByRole('checkbox', { name: managerName, exact: true }).filter({ visible: true }).check();
  await adminPage.getByRole('button', { name: /save & publish/i }).click();
  await expect(adminPage.getByText(/workflow saved/i)).toBeVisible();

  await expect.poll(async () => (await stepOneSettings()).assigneeUids).toEqual([TEAM, MANAGER]);
});

test('#192 reopened: Step Settings still shows both people after saving', async ({ adminPage }) => {
  await setStepOne([]);
  const [teamName, managerName] = await Promise.all([nameOf(TEAM), nameOf(MANAGER)]);

  await adminPage.goto(`services/${serviceKey}`);
  const picker = adminPage.getByLabel('Step 1 assignees', { exact: true }).filter({ visible: true });
  await expect(picker).toBeVisible({ timeout: 15_000 });
  await picker.click();
  await adminPage.getByRole('checkbox', { name: teamName, exact: true }).filter({ visible: true }).check();
  await adminPage.getByRole('checkbox', { name: managerName, exact: true }).filter({ visible: true }).check();
  await adminPage.getByRole('button', { name: /save step settings/i }).click();
  await expect(adminPage.getByText(/step settings saved/i)).toBeVisible();

  // Straight after the save — no reload — the picker still names both.
  await expect(picker).toContainText(`${teamName} + 1`);
  expect((await stepOneSettings()).assigneeUids).toEqual([TEAM, MANAGER]);
});

test('#192 reopened: the step-owner API sets several owners, and only staff', async () => {
  await setStepOne([MANAGER]);
  const taskId = await createMatter({ serviceKey });
  try {
    const admin = await apiAs('admin');
    const both = await admin.patch(`/api/tasks/${taskId}/steps/1`, { data: { assignedToUids: [MANAGER, TEAM] } });
    expect(both.status(), 'several owners accepted').toBe(200);
    const step1 = ((await getMatter(taskId)).steps as Array<Record<string, unknown>>).find((s) => s.stepNumber === 1)!;
    expect(step1.assignedToUids).toEqual([MANAGER, TEAM]);
    expect(step1.assignedTo, 'primary is the first').toBe(MANAGER);

    const withClient = await admin.patch(`/api/tasks/${taskId}/steps/1`, {
      data: { assignedToUids: [MANAGER, env('E2E_CLIENT_UID')] },
    });
    expect(withClient.status(), 'a client is refused').toBe(400);
    await admin.dispose();

    // A team member cannot reassign a step at all.
    const team = await apiAs('team');
    const denied = await team.patch(`/api/tasks/${taskId}/steps/1`, { data: { assignedToUids: [TEAM] } });
    expect(denied.status()).toBe(403);
    await team.dispose();
  } finally { await deleteMatter(taskId); }
});

// The firm's flow end to end: a manager adds a second person on the matter
// screen, and that person completes the step from their own screen.
test('#192 reopened: add a second owner on the matter screen; they complete the step', async ({ adminPage, teamPage }) => {
  await setStepOne([MANAGER]);
  const teamName = await nameOf(TEAM);
  const taskId = await createMatter({ serviceKey });
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const owners = adminPage.getByLabel('Step owners', { exact: true }).filter({ visible: true });
    await expect(owners, 'the Service gave the step to the manager').toContainText(await nameOf(MANAGER));
    await owners.click();
    // click(), not check(): the box is driven by the matter's data, so it can
    // re-render between Playwright's click and its own state check.
    const teamBox = adminPage.getByRole('checkbox', { name: teamName, exact: true }).filter({ visible: true });
    await teamBox.click();
    await expect(teamBox).toBeChecked();
    await expect(owners).toContainText('+ 1');
    await expect.poll(async () => {
      const s = ((await getMatter(taskId)).steps as Array<Record<string, unknown>>).find((x) => x.stepNumber === 1)!;
      return s.assignedToUids;
    }, { message: 'the manager is kept, the team member added' }).toEqual([MANAGER, TEAM]);

    await teamPage.goto(`tasks/${taskId}`);
    await teamPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const button = teamPage.getByRole('button', { name: /complete step/i }).filter({ visible: true });
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(async () => (await getMatter(taskId)).currentStepNumber).not.toBe(1);
  } finally { await deleteMatter(taskId); }
});
