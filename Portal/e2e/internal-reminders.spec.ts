import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, deleteDefinition, waitForNotification } from './api';
import { env } from './helpers';

/**
 * #198 — "Send internal reminder" on a step. Emails + notifies
 * EVERY team member assigned to the step (#192 multi-assignee), never the client,
 * and keeps its own history separate from client reminders.
 */

const SERVICE_KEY = `e2e-intrem-${Date.now()}`;
let defId = '';

test.beforeAll(async () => {
  const api = await apiAs('admin');
  defId = `e2e-intrem-def-${Date.now()}`;
  const res = await api.post('/api/workflow-definitions', {
    data: {
      id: defId, name: `E2E Internal Reminder ${defId}`, initialStep: 1, serviceKeys: [SERVICE_KEY],
      steps: [
        { stepNumber: 1, title: 'Draft the MoA', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
        { stepNumber: 2, title: 'Done', type: 'final' },
      ],
    },
  });
  expect(res.ok(), `create definition: ${res.status()} ${await res.text()}`).toBe(true);
  // Two team members own step 1.
  const set = await api.put(`/api/workflow-definitions/${defId}/step-settings`, {
    data: { settings: { 1: { assigneeUids: [env('E2E_TEAM_UID'), env('E2E_MANAGER_UID')] } } },
  });
  expect(set.ok(), `set assignees: ${set.status()} ${await set.text()}`).toBe(true);
  await api.dispose();
});

test.afterAll(async () => { if (defId) await deleteDefinition(defId); });

test('#198: every assignee is reminded, and the send is recorded', async () => {
  const taskId = await createMatter({ serviceKey: SERVICE_KEY });
  const admin = await apiAs('admin');
  try {
    const note = `Please finish the draft ${Date.now()}`;
    const res = await admin.post(`/api/tasks/${taskId}/internal-reminders`, { data: { stepNumber: 1, note } });
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    expect(body.recipients).toHaveLength(2);

    // Both assignees get it in-app.
    expect(await waitForNotification('team', /reminder/i, 20_000, taskId)).toBe(true);
    expect(await waitForNotification('manager', /reminder/i, 20_000, taskId)).toBe(true);

    // History lists who was reminded; the client-reminder history is untouched.
    const hist = await (await admin.get(`/api/tasks/${taskId}/internal-reminders`)).json();
    expect(hist.data).toHaveLength(1);
    expect(hist.data[0].recipients).toHaveLength(2);
    expect(hist.data[0].note).toBe(note);
    const clientHist = await (await admin.get(`/api/tasks/${taskId}/reminders`)).json();
    expect(clientHist.data).toHaveLength(0);

    // An immediate repeat is held back (double-click guard).
    expect((await admin.post(`/api/tasks/${taskId}/internal-reminders`, { data: { stepNumber: 1 } })).status()).toBe(429);
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#198: the client can neither send one nor see it in their activity', async () => {
  const taskId = await createMatter({ serviceKey: SERVICE_KEY });
  const admin = await apiAs('admin');
  const client = await apiAs('client');
  try {
    expect((await admin.post(`/api/tasks/${taskId}/internal-reminders`, { data: { stepNumber: 1 } })).ok()).toBe(true);
    expect((await client.post(`/api/tasks/${taskId}/internal-reminders`, { data: { stepNumber: 1 } })).status()).toBe(403);
    expect((await client.get(`/api/tasks/${taskId}/internal-reminders`)).status()).toBe(403);
    const events = await (await client.get(`/api/tasks/${taskId}/events`)).json();
    const types = ((events.data ?? []) as Array<{ type: string }>).map((e) => e.type);
    expect(types).not.toContain('INTERNAL_REMINDER_SENT');
  } finally {
    await admin.dispose();
    await client.dispose();
    await deleteMatter(taskId);
  }
});

test('#198: a step with nobody else to remind is refused clearly', async () => {
  const taskId = await createMatter({ serviceKey: SERVICE_KEY });
  const admin = await apiAs('admin');
  try {
    // Reassign step 1 to the admin alone — the sender is never their own recipient.
    const p = await admin.patch(`/api/tasks/${taskId}/steps/1`, { data: { assignedTo: env('E2E_ADMIN_UID') } });
    expect(p.ok(), await p.text()).toBe(true);
    const res = await admin.post(`/api/tasks/${taskId}/internal-reminders`, { data: { stepNumber: 1 } });
    expect(res.status()).toBe(409);
    expect((await res.json()).code).toBe('NO_STAFF_ASSIGNEE');
  } finally {
    await admin.dispose();
    await deleteMatter(taskId);
  }
});

test('#198: the step panel offers "Send internal reminder" and names the recipients', async ({ adminPage }) => {
  const taskId = await createMatter({ serviceKey: SERVICE_KEY });
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await adminPage.getByRole('button', { name: 'Send internal reminder' }).first().click();
    const dialog = adminPage.getByRole('dialog', { name: 'Send internal reminder' });
    await expect(dialog).toContainText('E2E Team');
    await dialog.getByLabel('Reminder note').fill('UI reminder');
    await dialog.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(adminPage.getByText(/Reminder sent to/)).toBeVisible();
  } finally { await deleteMatter(taskId); }
});
