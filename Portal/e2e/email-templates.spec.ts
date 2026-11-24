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
  // #198/#200 added the internal step reminder and the @mention email;
  // #297 the two "message edited" emails.
  for (const key of ['client_welcome', 'matter_created', 'approval_needed', 'step_assigned', 'internal_step_reminder', 'matter_mention', 'matter_message_team', 'matter_message_edited', 'matter_message_team_edited', 'documents_submitted_team']) {
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
    // The Welcome card's own Reset: since #310 the "Explore more services" card
    // above it has a Reset too, and `.first()` hit that one.
    // (Template cards' Reset is titled "…built-in default", the block's "…built-in text".)
    adminPage.getByTitle('Reset to the built-in default').first().click(),
  ]);
});

// ─── #310: the "Explore more services" block on the completion email ─────────
// Admins AND managers edit it; everyone else is refused. Each test puts back
// the block it found, so the run leaves the firm's text as it was.

const MARKETING = '/api/settings/completion-marketing';

test('#310 completion block: admin and manager can read it; team member and client cannot', async () => {
  for (const role of ['admin', 'manager'] as const) {
    const api = await apiAs(role);
    const res = await api.get(MARKETING);
    expect(res.ok(), `${role} reads the block`).toBeTruthy();
    const body = await res.json();
    expect(typeof body.settings.enabled).toBe('boolean');
    expect(body.default.heading).toBe('Explore More Services with Us');
    expect(body.default.body).toContain('https://legalterminus.com/');
    await api.dispose();
  }
  for (const role of ['team', 'client'] as const) {
    const api = await apiAs(role);
    expect((await api.get(MARKETING)).status(), `${role} GET`).toBe(403);
    expect((await api.put(MARKETING, { data: { enabled: false, heading: '', body: '' } })).status(), `${role} PUT`).toBe(403);
    await api.dispose();
  }
});

test('#310 completion block: a manager\'s edit round-trips, tags are stripped, bad input is refused', async () => {
  const manager = await apiAs('manager');
  const original = (await (await manager.get(MARKETING)).json()).settings;
  try {
    const heading = `E2E heading ${Date.now()}`;
    const put = await manager.put(MARKETING, {
      data: { enabled: false, heading: `<b>${heading}</b>`, body: 'Line one\n- A bullet' },
    });
    expect(put.ok()).toBeTruthy();
    const after = (await (await manager.get(MARKETING)).json()).settings;
    expect(after).toEqual({ enabled: false, heading, body: 'Line one\n- A bullet' });

    // Unknown fields and a missing switch are refused.
    expect((await manager.put(MARKETING, { data: { enabled: true, heading: '', body: '', extra: 1 } })).status()).toBe(400);
    expect((await manager.put(MARKETING, { data: { heading: '', body: '' } })).status()).toBe(400);
  } finally {
    await manager.put(MARKETING, { data: original });
    await manager.dispose();
  }
});

test('#310 completion block: a manager sees only the block on the Email Templates page, and editing it saves', async ({ managerPage }) => {
  const api = await apiAs('manager');
  const original = (await (await api.get(MARKETING)).json()).settings;
  try {
    await managerPage.goto('settings/email-templates');
    await expect(managerPage.getByRole('heading', { name: 'Email Templates' })).toBeVisible();
    await expect(managerPage.getByText(/Service completed: Explore more services/)).toBeVisible();
    // The templates themselves stay admin-only.
    await expect(managerPage.getByText('Internal team emails')).toHaveCount(0);
    await expect(managerPage.getByRole('button', { name: /Welcome email/i })).toHaveCount(0);

    const heading = managerPage.getByLabel('Heading', { exact: true });
    // The section opens by default; open it if a previous run collapsed it.
    if (!(await heading.isVisible())) {
      await managerPage.getByText(/Service completed: Explore more services/).click();
    }
    const value = `E2E block ${Date.now()}`;
    const [putReq] = await Promise.all([
      managerPage.waitForRequest((r) => r.url().includes(MARKETING) && r.method() === 'PUT', { timeout: 15_000 }),
      heading.fill(value),
    ]);
    expect(JSON.parse(putReq.postData() || '{}').heading).toBe(value);

    // The on/off switch saves too.
    const toggle = managerPage.getByRole('switch', { name: /Add this block to the completion email/i });
    const wasOn = (await toggle.getAttribute('aria-checked')) === 'true';
    const [switchReq] = await Promise.all([
      managerPage.waitForRequest((r) => r.url().includes(MARKETING) && r.method() === 'PUT', { timeout: 15_000 }),
      toggle.click(),
    ]);
    expect(JSON.parse(switchReq.postData() || '{}').enabled).toBe(!wasOn);
  } finally {
    await api.put(MARKETING, { data: original });
    await api.dispose();
  }
});

test('#310 completion block: an admin sees it among the client emails', async ({ adminPage }) => {
  await adminPage.goto('settings/email-templates');
  await expect(adminPage.getByText('Client emails')).toBeVisible();
  await expect(adminPage.getByText(/Service completed: Explore more services/)).toBeVisible();
  await expect(adminPage.getByRole('button', { name: /Welcome email/i })).toBeVisible();
});

test('a client cannot reach the Settings page', async ({ clientPage }) => {
  await clientPage.goto('settings/email-templates');
  await expect(async () => {
    expect(/\/settings\//.test(new URL(clientPage.url()).pathname)).toBe(false);
  }).toPass({ timeout: 15_000 });
});
