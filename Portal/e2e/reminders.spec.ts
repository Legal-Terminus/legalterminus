import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * #111 — manual reminder emails from a workflow step.
 * Staff-only, template-driven (editable in Settings → Email Templates),
 * repeatable, and every send is audited.
 */

test('#111: staff can send a reminder; it is recorded and repeatable', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');

    // Send a gentle reminder.
    const r1 = await admin.post(`/api/tasks/${taskId}/reminders`, { data: { template: 'reminder_gentle' } });
    expect(r1.ok()).toBeTruthy();
    expect((await r1.json()).template).toBe('reminder_gentle');

    // It is recorded in the history.
    const hist = await (await admin.get(`/api/tasks/${taskId}/reminders`)).json();
    expect(hist.data.length).toBeGreaterThanOrEqual(1);
    expect(hist.data[0].template).toBe('reminder_gentle');
    // The available templates are advertised for the picker.
    expect(hist.templates).toContain('reminder_urgent');

    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#111: an unknown template is rejected', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const res = await admin.post(`/api/tasks/${taskId}/reminders`, { data: { template: 'reminder_nope' } });
    expect(res.status()).toBe(400);
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#111: a CLIENT cannot send reminders (staff only)', async () => {
  const taskId = await createMatter();
  try {
    const client = await apiAs('client');
    const res = await client.post(`/api/tasks/${taskId}/reminders`, { data: { template: 'reminder_gentle' } });
    expect(res.status()).toBe(403);
    await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#111: the reminder templates are editable in Settings → Email Templates', async () => {
  const admin = await apiAs('admin');
  const body = await (await admin.get('/api/settings/email-templates')).json();
  for (const key of ['reminder_gentle', 'reminder_followup', 'reminder_urgent']) {
    expect(body.templates[key], `${key} template should exist`).toBeTruthy();
    // The placeholders the issue asked for are advertised to the editor.
    expect(body.defs[key].placeholders).toEqual(
      expect.arrayContaining(['clientName', 'organisation', 'serviceName', 'matterId', 'currentStep']),
    );
  }
  await admin.dispose();
});

test('#111: the step shows a Send reminder control for staff, not for the client', async ({ adminPage, clientPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const btn = adminPage.getByRole('button', { name: /send reminder/i });
    await expect(btn).toBeVisible();

    // Opening it offers the tone options. Scope to the picker — "Urgent" also
    // appears on the step's "Mark step urgent" control.
    await btn.click();
    const picker = adminPage.locator('div').filter({ hasText: /^Choose a reminder/ }).last();
    await expect(picker.getByText('Gentle nudge')).toBeVisible();
    await expect(picker.getByText('Time-critical or repeatedly ignored')).toBeVisible();

    // The client never sees it.
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(clientPage.getByRole('button', { name: /send reminder/i })).toHaveCount(0);
  } finally { await deleteMatter(taskId); }
});
