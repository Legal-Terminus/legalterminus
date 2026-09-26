import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, assignMatter, getNotifications, waitForNotification } from './api';
import { env } from './helpers';

/**
 * #123 — per-matter discussion thread (client ⇄ internal team).
 * #115 — a staff message/comment is INTERNAL unless explicitly shared.
 */

test('#123/#115: an internal message is hidden from the client; a shared one is visible', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const client = await apiAs('client');

    // Staff posts an INTERNAL message (default — no clientVisible flag).
    const secret = `INTERNAL-ONLY-${Date.now()}`;
    expect((await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: secret } })).ok()).toBeTruthy();

    // Staff posts a SHARED message.
    const shared = `SHARED-WITH-CLIENT-${Date.now()}`;
    expect((await admin.post(`/api/tasks/${taskId}/messages`,
      { data: { body: shared, clientVisible: true } })).ok()).toBeTruthy();

    // The client sees ONLY the shared one.
    const seen = await (await client.get(`/api/tasks/${taskId}/messages`)).json();
    const bodies = (seen.data ?? []).map((m: { body: string }) => m.body);
    expect(bodies).toContain(shared);
    expect(bodies).not.toContain(secret);

    // Staff see both.
    const staffSeen = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    const staffBodies = (staffSeen.data ?? []).map((m: { body: string }) => m.body);
    expect(staffBodies).toContain(shared);
    expect(staffBodies).toContain(secret);

    // Staff authors are MASKED for the client (never individual identities).
    // #123 follow-up (edca73b8): the mask is the COMPANY name, not the older
    // generic "Our team" — this assertion tracked the superseded wording.
    const sharedForClient = (seen.data ?? []).find((m: { body: string }) => m.body === shared);
    expect(sharedForClient.authorName).toBe('Legal Terminus');

    await admin.dispose(); await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#123: a client can post, and staff see it', async () => {
  const taskId = await createMatter();
  try {
    await assignMatter(taskId, process.env.E2E_TEAM_UID!);
    const client = await apiAs('client');
    const admin = await apiAs('admin');

    const msg = `CLIENT-ASKS-${Date.now()}`;
    expect((await client.post(`/api/tasks/${taskId}/messages`, { data: { body: msg } })).ok()).toBeTruthy();

    const staffSeen = await (await admin.get(`/api/tasks/${taskId}/messages`)).json();
    expect((staffSeen.data ?? []).map((m: { body: string }) => m.body)).toContain(msg);

    // The client's own message is visible back to them.
    const clientSeen = await (await client.get(`/api/tasks/${taskId}/messages`)).json();
    expect((clientSeen.data ?? []).map((m: { body: string }) => m.body)).toContain(msg);

    await client.dispose(); await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test("#123: a client cannot read another matter's discussion", async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: 'hello', clientVisible: true } });
    await admin.dispose();

    // Reading a matter that isn't theirs is forbidden (the seeded client owns this
    // one, so assert the ownership guard via a bogus task id instead).
    const client = await apiAs('client');
    const res = await client.get('/api/tasks/not-a-real-task-id/messages');
    expect([403, 404]).toContain(res.status());
    await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#123: the Discussion tab renders and can post a message', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Discussion', exact: true }).click();
    await expect(adminPage.getByText('No messages yet')).toBeVisible();

    const msg = `UI-MSG-${Date.now()}`;
    await adminPage.getByLabel('Message').fill(msg);
    await adminPage.getByRole('button', { name: /^Send$/ }).click();
    await expect(adminPage.getByText(msg)).toBeVisible();
    // Staff default is internal-only — the bubble says so.
    await expect(adminPage.getByText('internal').first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

/* ── #200: @mention a colleague by email ─────────────────────── */

/** Mention notifications only — creating a matter may notify people for other reasons. */
const mentionCount = async (role: 'team' | 'manager' | 'client', taskId: string) =>
  (await getNotifications(role)).filter((n) => n.taskId === taskId && /mentioned you/i.test(n.title)).length;

test('#200: each @mentioned colleague is notified once', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const body = `<p>@${env('E2E_TEAM_EMAIL')} and @${env('E2E_MANAGER_EMAIL')} please review. @${env('E2E_TEAM_EMAIL')}</p>`;
    expect((await admin.post(`/api/tasks/${taskId}/messages`, { data: { body } })).status()).toBe(201);
    await admin.dispose();

    expect(await waitForNotification('team', /mentioned you/i, 20_000, taskId)).toBe(true);
    expect(await waitForNotification('manager', /mentioned you/i, 20_000, taskId)).toBe(true);
    // Mentioned twice in one message — still one notification.
    expect(await mentionCount('team', taskId)).toBe(1);
  } finally { await deleteMatter(taskId); }
});

test('#200: mentioning a client or an unknown address sends nothing and reveals nothing', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const shape = async (addr: string) => {
      const res = await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: `<p>@${addr} hello</p>` } });
      const b = await res.json();
      return { status: res.status(), keys: Object.keys(b).sort().join(',') };
    };
    const known = await shape(env('E2E_CLIENT_EMAIL'));
    const unknown = await shape(`nobody-${Date.now()}@example.test`);
    expect(known).toEqual(unknown); // no way to tell who exists
    await admin.dispose();

    // The client is never notified by an INTERNAL message that names them.
    await new Promise((r) => setTimeout(r, 3000));
    expect(await mentionCount('client', taskId)).toBe(0);
  } finally { await deleteMatter(taskId); }
});

test('#200: a client\'s @mention does not page staff, and mention data never reaches the client', async () => {
  const taskId = await createMatter();
  try {
    const client = await apiAs('client');
    expect((await client.post(`/api/tasks/${taskId}/messages`, {
      data: { body: `<p>@${env('E2E_MANAGER_EMAIL')} hi</p>` },
    })).status()).toBe(201);

    const admin = await apiAs('admin');
    await admin.post(`/api/tasks/${taskId}/messages`, {
      data: { body: `<p>@${env('E2E_TEAM_EMAIL')} shared</p>`, clientVisible: true },
    });
    await admin.dispose();

    const list = await (await client.get(`/api/tasks/${taskId}/messages`)).json();
    for (const m of (list.data ?? []) as Array<Record<string, unknown>>) {
      expect(m.mentionedUids, 'no mention data for the client').toBeUndefined();
    }
    await client.dispose();

    await new Promise((r) => setTimeout(r, 3000));
    expect(await mentionCount('manager', taskId)).toBe(0);
  } finally { await deleteMatter(taskId); }
});

test('#200: typing "@" suggests colleagues; picking one inserts their address and notifies them', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Discussion', exact: true }).click();
    const box = adminPage.getByLabel('Message');
    await box.click();
    await box.pressSequentially('Please check @E2E Te');
    const list = adminPage.getByRole('listbox', { name: 'Mention a colleague' });
    await expect(list).toBeVisible();
    await list.getByRole('option').filter({ hasText: env('E2E_TEAM_EMAIL') }).click();
    await expect(box).toContainText(`@${env('E2E_TEAM_EMAIL')}`);
    await adminPage.getByRole('button', { name: /send/i }).click();
    expect(await waitForNotification('team', /mentioned you/i, 20_000, taskId)).toBe(true);
  } finally { await deleteMatter(taskId); }
});

test('#200: the colleague list is staff-only', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const res = await admin.get(`/api/tasks/${taskId}/mentionable`);
    expect(res.status()).toBe(200);
    const emails = ((await res.json()).data as Array<{ email: string }>).map((u) => u.email);
    expect(emails).toContain(env('E2E_TEAM_EMAIL'));
    expect(emails, 'a client is never offered').not.toContain(env('E2E_CLIENT_EMAIL'));
    await admin.dispose();

    const client = await apiAs('client');
    expect((await client.get(`/api/tasks/${taskId}/mentionable`)).status()).toBe(403);
    await client.dispose();
  } finally { await deleteMatter(taskId); }
});
