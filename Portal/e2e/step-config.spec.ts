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
