import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter } from './api';

/**
 * #104/#107/#108/#109 — editable email templates + per-matter organisation.
 *
 * Email sending is force-disabled during e2e (no real sends), so these tests
 * assert the CONFIG + DATA that drive the emails rather than delivery:
 *   #104 — a matter stores the organisation entered at creation.
 *   #107/#108/#109 — the template store is admin-only, editable, and round-trips.
 */

test('#104: a matter created with an organisation stores it on the matter', async () => {
  const org = `E2E Org ${Date.now()}`;
  const taskId = await createMatter({ organisation: org });
  try {
    const m = await getMatter(taskId);
    expect(m.organisation).toBe(org);
  } finally { await deleteMatter(taskId); }
});

test('email templates: admin can read the templates + defs; a client cannot', async () => {
  const admin = await apiAs('admin');
  const res = await admin.get('/api/settings/email-templates');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  // The four expected templates are present with defs (labels + placeholders).
  for (const key of ['client_welcome', 'matter_created', 'approval_needed', 'step_assigned']) {
    expect(body.templates[key]?.subject, `${key} subject`).toBeTruthy();
    expect(Array.isArray(body.defs[key]?.placeholders)).toBeTruthy();
  }
  await admin.dispose();

  // Non-admins are forbidden.
  const client = await apiAs('client');
  const cRes = await client.get('/api/settings/email-templates');
  expect(cRes.status()).toBe(403);
  await client.dispose();
});

test('email templates: admin edits persist and round-trip; reset restores default', async () => {
  const admin = await apiAs('admin');
  const original = await (await admin.get('/api/settings/email-templates')).json();
  const defaultSubject = original.defs.client_welcome.default.subject;

  const custom = `E2E Custom Welcome ${Date.now()}`;
  const putRes = await admin.put('/api/settings/email-templates', {
    data: { templates: { client_welcome: { subject: custom, body: 'Hi {{clientName}}, custom body.' } } },
  });
  expect(putRes.ok()).toBeTruthy();

  // Re-read: the override is returned.
  const after = await (await admin.get('/api/settings/email-templates')).json();
  expect(after.templates.client_welcome.subject).toBe(custom);

  // "Reset" = write back the default subject/body → the store returns the default.
  await admin.put('/api/settings/email-templates', {
    data: { templates: { client_welcome: { subject: defaultSubject, body: original.defs.client_welcome.default.body } } },
  });
  const restored = await (await admin.get('/api/settings/email-templates')).json();
  expect(restored.templates.client_welcome.subject).toBe(defaultSubject);
  await admin.dispose();
});

test('Settings > Email Templates page loads for an admin and lists the templates', async ({ adminPage }) => {
  await adminPage.goto('settings/email-templates');
  await expect(adminPage.getByRole('heading', { name: 'Email Templates' })).toBeVisible();
  // Both audience groups + at least one known template label (collapsible cards).
  await expect(adminPage.getByText('Client emails')).toBeVisible();
  await expect(adminPage.getByText('Internal team emails')).toBeVisible();
  await expect(adminPage.getByRole('button', { name: /Welcome email/i })).toBeVisible();
});

test('email templates auto-save: editing fires a save automatically (no Save button)', async ({ adminPage }) => {
  await adminPage.goto('settings/email-templates');
  // There is NO Save button — saving is automatic.
  await expect(adminPage.getByRole('button', { name: /^Save changes$/i })).toHaveCount(0);

  // Expand the Welcome email card (collapsed by default) and edit the subject.
  await adminPage.getByRole('button', { name: /Welcome email/i }).click();
  const value = `Auto-saved subject ${Date.now()}`;

  // Editing auto-fires a PUT carrying the new value (debounced) — no button click.
  // Capture the request body to assert the edit was actually persisted.
  const [putReq] = await Promise.all([
    adminPage.waitForRequest((r) =>
      r.url().includes('/api/settings/email-templates') && r.method() === 'PUT',
      { timeout: 15_000 }),
    adminPage.getByLabel(/Welcome email subject/i).fill(value),
  ]);
  const sent = JSON.parse(putReq.postData() || '{}');
  expect(sent.templates?.client_welcome?.subject).toBe(value);
  // The "Saving…/Saved" auto-save status is shown (not a manual Save button).
  await expect(adminPage.getByText(/Changes save automatically|Saving|Saved/i).first()).toBeVisible();

  // Restore the default (also auto-saves) so the run stays idempotent.
  await Promise.all([
    adminPage.waitForRequest((r) =>
      r.url().includes('/api/settings/email-templates') && r.method() === 'PUT',
      { timeout: 15_000 }),
    adminPage.getByRole('button', { name: /^Reset$/i }).first().click(),
  ]);
});

test('a client cannot reach the Settings page', async ({ clientPage }) => {
  await clientPage.goto('settings/email-templates');
  await expect(async () => {
    expect(/\/settings\//.test(new URL(clientPage.url()).pathname)).toBe(false);
  }).toPass({ timeout: 15_000 });
});
