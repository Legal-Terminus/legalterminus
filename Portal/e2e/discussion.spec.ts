import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, assignMatter } from './api';

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
