import { test, expect } from './fixtures';
import { apiAs, resolveServiceKey } from './api';

/**
 * #81 — independent internal vs client status/notes per step (admin-only).
 * #82 — multiple audience-tagged descriptions per step.
 * The client-facing definition projection strips internal fields + internal
 * descriptions. Round-trip via the full-definition write path; restored after.
 */
let serviceKey: string;
let definitionId: string;

test.beforeAll(async () => {
  serviceKey = await resolveServiceKey();
  const api = await apiAs('admin');
  const defs = await (await api.get('/api/workflow-definitions')).json();
  definitionId = defs.find((d: { serviceKeys?: string[] }) => (d.serviceKeys ?? []).includes(serviceKey)).id;
  await api.dispose();
});

test('#81/#82: internal fields + internal descriptions are hidden from clients', async () => {
  const api = await apiAs('admin');
  const original = await (await api.get(`/api/workflow-definitions/${definitionId}`)).json();
  // Work on a deep copy; set fields on the first non-final step.
  const def = JSON.parse(JSON.stringify(original));
  const target = def.steps.find((s: { type: string }) => s.type !== 'final');
  test.skip(!target, 'No non-final step.');
  target.internalStatus = 'INTERNAL_ONLY_STATUS';
  target.internalNotes = 'INTERNAL_ONLY_NOTE';
  target.clientStatus = 'CLIENT_STATUS';
  target.clientNote = 'CLIENT_NOTE';
  target.descriptions = [
    { audience: 'internal', text: 'STAFF_DESC' },
    { audience: 'client', text: 'CLIENT_DESC' },
  ];

  const body = { name: def.name, initialStep: def.initialStep, serviceKeys: def.serviceKeys, steps: def.steps, phases: def.phases };
  const put = await api.patch(`/api/workflow-definitions/${definitionId}`, { data: body });
  expect(put.ok(), await put.text()).toBeTruthy();

  try {
    // Staff GET keeps everything.
    const staff = await (await api.get(`/api/workflow-definitions/${definitionId}`)).json();
    const staffStep = staff.steps.find((s: { stepNumber: number }) => s.stepNumber === target.stepNumber);
    expect(staffStep.internalStatus).toBe('INTERNAL_ONLY_STATUS');
    expect(staffStep.descriptions.some((d: { text: string }) => d.text === 'STAFF_DESC')).toBeTruthy();

    // Client GET strips internal status/notes and internal descriptions.
    const clientApi = await apiAs('client');
    const client = await (await clientApi.get(`/api/workflow-definitions/${definitionId}`)).json();
    await clientApi.dispose();
    const clientStep = client.steps.find((s: { stepNumber: number }) => s.stepNumber === target.stepNumber);
    expect(clientStep.internalStatus).toBeUndefined();
    expect(clientStep.internalNotes).toBeUndefined();
    expect(clientStep.clientStatus).toBe('CLIENT_STATUS'); // client fields kept
    const clientDescTexts = (clientStep.descriptions ?? []).map((d: { text: string }) => d.text);
    expect(clientDescTexts).toContain('CLIENT_DESC');
    expect(clientDescTexts).not.toContain('STAFF_DESC');
  } finally {
    // Restore the original definition.
    const restore = { name: original.name, initialStep: original.initialStep, serviceKeys: original.serviceKeys, steps: original.steps, phases: original.phases };
    await api.patch(`/api/workflow-definitions/${definitionId}`, { data: restore });
    await api.dispose();
  }
});

test('#81: a team member cannot write step config (admin-only)', async () => {
  const team = await apiAs('team');
  const def = await (await team.get(`/api/workflow-definitions/${definitionId}`)).json();
  const body = { name: def.name, initialStep: def.initialStep, serviceKeys: def.serviceKeys, steps: def.steps, phases: def.phases };
  const put = await team.patch(`/api/workflow-definitions/${definitionId}`, { data: body });
  expect(put.status()).toBe(403);
  await team.dispose();
});

/* ── #103 / #105 / #106 — client step names, approval info box, custom prompt ── */

import {
  createClientTitleMatter, deleteMatter, deleteDefinition, getMatterAs,
  transition, getNotifications,
} from './api';

test('#103: the client sees the CLIENT step name; staff see the internal name', async ({ adminPage, clientPage }) => {
  const { taskId, defId } = await createClientTitleMatter();
  try {
    // Staff view shows the internal title (step 2 in the list).
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(adminPage.getByText('INTERNAL-ONLY-NAME').first()).toBeVisible();

    // Client view shows the client-facing title — and never the internal one.
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(clientPage.getByText('CLIENT-FRIENDLY-NAME').first()).toBeVisible();
    await expect(clientPage.getByText('INTERNAL-ONLY-NAME')).toHaveCount(0);

    // API-level: the client projection swaps title and drops clientTitle.
    const { body } = await getMatterAs('client', taskId);
    const s2 = (body?.steps as Array<{ stepNumber: number; title: string; clientTitle?: string }> | undefined)
      ?.find((s) => s.stepNumber === 2);
    expect(s2?.title).toBe('CLIENT-FRIENDLY-NAME');
    expect(s2?.clientTitle).toBeUndefined();
  } finally { await deleteMatter(taskId); await deleteDefinition(defId); }
});

test('#105: the client sees the team\'s hand-off comment in an info box above Approve', async ({ clientPage }) => {
  const { taskId, defId } = await createClientTitleMatter();
  try {
    // Staff complete the prep step WITH a comment — the hand-off note the client
    // must review (e.g. the proposed names). The matter lands on the approval step.
    const note = `Proposed: ABC Technologies Private Limited ${Date.now()}`;
    await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: note });

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // The info box surfaces the staff comment (author masked as "Our team").
    await expect(clientPage.getByText('Shared by our team').first()).toBeVisible();
    await expect(clientPage.getByText(note).first()).toBeVisible();
    // And the Approve control renders below it.
    await expect(clientPage.getByRole('button', { name: /^approve$/i })).toBeVisible();
  } finally { await deleteMatter(taskId); await deleteDefinition(defId); }
});

test('#106: the client\'s "your turn" notification uses the step\'s custom prompt', async () => {
  const { taskId, defId } = await createClientTitleMatter();
  try {
    // Advancing to the client-approval step fires the client notify with the
    // step's CUSTOM prompt instead of the generic "Action needed" copy.
    await transition('admin', taskId, { type: 'COMPLETE_STEP' });
    const notes = await getNotifications('client');
    const hit = notes.find((n) => n.title === 'Please review your business names');
    expect(hit, `expected the custom-prompt notification; got: ${notes.slice(0, 5).map((n) => n.title).join(' | ')}`).toBeTruthy();
    expect(hit?.message).toContain('Kindly review the proposed names');
  } finally { await deleteMatter(taskId); await deleteDefinition(defId); }
});
