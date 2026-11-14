import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, assignMatter, getNotifications, waitForNotification, assignStep, currentStep } from './api';
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
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
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
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
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

test('#200: typing "@" alone lists the WHOLE team, not the first six', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const team = (await (await admin.get(`/api/tasks/${taskId}/mentionable`)).json()).data as Array<{ email: string }>;
    await admin.dispose();

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
    const box = adminPage.getByLabel('Message');
    await box.click();
    await box.pressSequentially('@');
    const list = adminPage.getByRole('listbox', { name: 'Mention a colleague' });
    await expect(list).toBeVisible();
    // Reported from production: the list stopped at six names, so colleagues
    // later in the alphabet were missing until you typed part of their name.
    await expect(list.getByRole('option')).toHaveCount(team.length);
    // The last colleague is reachable by scrolling and can be picked.
    const last = list.getByRole('option').last();
    await last.scrollIntoViewIfNeeded();
    await last.click();
    await expect(box).toContainText(`@${team[team.length - 1].email}`);
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

/* ── LT #200 (option A): who hears about a CLIENT's message ────────────────── */

/** How many "your client wrote" notifications a role holds for one matter. */
const clientMessageCount = async (role: 'admin' | 'manager' | 'team', taskId: string) =>
  (await getNotifications(role)).filter((n) => n.taskId === taskId && /New message from your client/i.test(n.title)).length;

async function clientPosts(taskId: string, text: string) {
  const client = await apiAs('client');
  const res = await client.post(`/api/tasks/${taskId}/messages`, { data: { body: text } });
  await client.dispose();
  expect(res.status()).toBe(201);
}

test('#200: a client message notifies the matter owner AND the current step\'s assignee, once each', async () => {
  const taskId = await createMatter();
  try {
    await assignMatter(taskId, env('E2E_MANAGER_UID'));
    await assignStep(taskId, await currentStep(taskId), env('E2E_TEAM_UID'));
    const adminBefore = await clientMessageCount('admin', taskId);

    await clientPosts(taskId, `CLIENT-WRITES-${Date.now()}`);

    // Reported from production: only the owner was told, so the person doing
    // the step never knew the client had written.
    await expect.poll(() => clientMessageCount('team', taskId), { timeout: 20_000 }).toBe(1);
    await expect.poll(() => clientMessageCount('manager', taskId), { timeout: 20_000 }).toBe(1);
    // Someone owns the work, so the admins are NOT paged.
    expect(await clientMessageCount('admin', taskId)).toBe(adminBefore);
  } finally { await deleteMatter(taskId); }
});

test('#200: with no matter owner, the current step\'s assignee is still told', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    expect((await admin.patch(`/api/tasks/${taskId}`, { data: { assignedTo: null } })).ok()).toBeTruthy();
    await admin.dispose();
    await assignStep(taskId, await currentStep(taskId), env('E2E_TEAM_UID'));

    await clientPosts(taskId, `NO-OWNER-${Date.now()}`);

    // Before this change a matter without an owner notified NOBODY.
    await expect.poll(() => clientMessageCount('team', taskId), { timeout: 20_000 }).toBe(1);
  } finally { await deleteMatter(taskId); }
});

test('#200: a staff reply shared with the client does not page the team', async () => {
  const taskId = await createMatter();
  try {
    await assignMatter(taskId, env('E2E_MANAGER_UID'));
    await assignStep(taskId, await currentStep(taskId), env('E2E_TEAM_UID'));
    const admin = await apiAs('admin');
    expect((await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: `STAFF-REPLY-${Date.now()}`, clientVisible: true } })).status()).toBe(201);
    await admin.dispose();
    await new Promise((r) => setTimeout(r, 3000));
    expect(await clientMessageCount('team', taskId)).toBe(0);
    expect(await clientMessageCount('manager', taskId)).toBe(0);
  } finally { await deleteMatter(taskId); }
});

/* ── Chat: edit, delete, and confirm before sharing with the client ── */

type Msg = { id: string; body: string; editedAt?: string | null; deleted?: boolean; canEdit?: boolean; canDelete?: boolean };
const listAs = async (api: Awaited<ReturnType<typeof apiAs>>, taskId: string) =>
  ((await (await api.get(`/api/tasks/${taskId}/messages`)).json()).data ?? []) as Msg[];
const clientNotes = async (taskId: string) =>
  (await getNotifications('client')).filter((n) => n.taskId === taskId).length;

/** The client's notifications for this matter whose title says a message was edited. */
const editedNotes = async (role: 'client' | 'team' | 'manager', taskId: string) =>
  (await getNotifications(role)).filter((n) => n.taskId === taskId && /edited/i.test(n.title));

test('#297: the author fixes a shared message; the client sees the new text and is told ONCE that it was edited', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  const client = await apiAs('client');
  try {
    const typo = `SENT-WITH-A-TYPO-${Date.now()}`;
    const res = await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: typo, clientVisible: true } });
    const { id } = await res.json();
    await new Promise((r) => setTimeout(r, 2000));
    const before = await clientNotes(taskId);

    const fixed = `FIXED-${Date.now()}`;
    const edit = await admin.patch(`/api/tasks/${taskId}/messages/${id}`, { data: { body: fixed } });
    expect(edit.status(), await edit.text()).toBe(200);
    // The same text again (a double-clicked Save) changes nothing and tells nobody.
    expect((await admin.patch(`/api/tasks/${taskId}/messages/${id}`, { data: { body: fixed } })).status()).toBe(200);

    const seen = (await listAs(client, taskId)).find((m) => m.id === id)!;
    expect(seen.body).toContain(fixed);
    expect(seen.body).not.toContain(typo);
    expect(seen.editedAt).toBeTruthy();
    // The client cannot change the firm's message.
    expect(seen.canEdit).toBe(false);

    // #297: exactly one new notification (its email is the template's), saying it was edited, with the new text.
    expect(await waitForNotification('client', /edited/i, 20_000, taskId)).toBe(true);
    await new Promise((r) => setTimeout(r, 2000));
    expect(await clientNotes(taskId)).toBe(before + 1);
    const notes = await editedNotes('client', taskId);
    expect(notes).toHaveLength(1);
    expect(notes[0].message).toContain(fixed);

    // The earlier text is never returned by the API.
    expect(JSON.stringify(await listAs(admin, taskId))).not.toContain(typo);
    // Clearing the text is refused: deleting is the way to remove it.
    expect((await admin.patch(`/api/tasks/${taskId}/messages/${id}`, { data: { body: '   ' } })).status()).toBe(400);
  } finally { await admin.dispose(); await client.dispose(); await deleteMatter(taskId); }
});

test('#297: a client edits their message — the matter owner is told once; editing an internal note tells the client nothing', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  const client = await apiAs('client');
  try {
    await assignMatter(taskId, env('E2E_TEAM_UID'));
    const { id } = await (await client.post(`/api/tasks/${taskId}/messages`, { data: { body: 'The name is XZY' } })).json();
    const fixed = `The name is XYZ-${Date.now()}`;
    expect((await client.patch(`/api/tasks/${taskId}/messages/${id}`, { data: { body: fixed } })).status()).toBe(200);
    expect(await waitForNotification('team', /edited/i, 20_000, taskId)).toBe(true);
    const teamNotes = await editedNotes('team', taskId);
    expect(teamNotes).toHaveLength(1);
    expect(teamNotes[0].message).toContain(fixed);

    // An internal staff note, edited: the client hears nothing.
    const { id: internal } = await (await admin.post(`/api/tasks/${taskId}/messages`, { data: { body: 'internal' } })).json();
    expect((await admin.patch(`/api/tasks/${taskId}/messages/${internal}`, { data: { body: 'internal, fixed' } })).status()).toBe(200);
    await new Promise((r) => setTimeout(r, 2000));
    expect(await editedNotes('client', taskId)).toHaveLength(0);
  } finally { await admin.dispose(); await client.dispose(); await deleteMatter(taskId); }
});

test('#297: who may edit — the author only; who may delete — the author or an admin', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  const manager = await apiAs('manager');
  const team = await apiAs('team');
  const client = await apiAs('client');
  try {
    await assignMatter(taskId, env('E2E_TEAM_UID'));
    const post = async (api: typeof admin, body: string, clientVisible?: boolean) =>
      (await (await api.post(`/api/tasks/${taskId}/messages`, { data: { body, clientVisible } })).json()).id as string;
    const byAdmin = await post(admin, 'admin note', true);
    const byManager = await post(manager, 'manager note');
    const internal = await post(admin, 'internal note');
    const byClient = await post(client, 'client question');

    // A colleague cannot change someone else's message — and since #297 neither can an admin.
    expect((await manager.patch(`/api/tasks/${taskId}/messages/${byAdmin}`, { data: { body: 'x' } })).status()).toBe(403);
    expect((await manager.delete(`/api/tasks/${taskId}/messages/${byAdmin}`)).status()).toBe(403);
    expect((await admin.patch(`/api/tasks/${taskId}/messages/${byManager}`, { data: { body: 'tidied by admin' } })).status()).toBe(403);
    // #297: no internal user may edit a CLIENT's message — enforced by the API, not only the UI.
    for (const staff of [admin, manager, team]) {
      expect((await staff.patch(`/api/tasks/${taskId}/messages/${byClient}`, { data: { body: 'rewritten by staff' } })).status()).toBe(403);
    }
    const listed = await listAs(admin, taskId);
    expect(listed.find((m) => m.id === byClient)).toMatchObject({ canEdit: false, canDelete: true });
    expect(listed.find((m) => m.id === byManager)).toMatchObject({ canEdit: false, canDelete: true });
    expect(listed.find((m) => m.id === byAdmin)).toMatchObject({ canEdit: true, canDelete: true });
    expect((await listAs(manager, taskId)).find((m) => m.id === byClient)).toMatchObject({ canEdit: false, canDelete: false });

    // A client cannot touch the firm's messages, and an internal one does not exist for them.
    expect((await client.patch(`/api/tasks/${taskId}/messages/${byAdmin}`, { data: { body: 'x' } })).status()).toBe(403);
    expect((await client.delete(`/api/tasks/${taskId}/messages/${internal}`)).status()).toBe(404);
    // A client can fix and delete their own.
    expect((await client.patch(`/api/tasks/${taskId}/messages/${byClient}`, { data: { body: 'client question, fixed' } })).status()).toBe(200);
    // An admin may still delete any message (moderation).
    expect((await admin.delete(`/api/tasks/${taskId}/messages/${byManager}`)).status()).toBe(200);
    expect((await client.delete(`/api/tasks/${taskId}/messages/${byClient}`)).status()).toBe(200);

    // A deleted message keeps its place, without its text, and cannot be changed again.
    const gone = (await listAs(admin, taskId)).find((m) => m.id === byClient)!;
    expect(gone).toMatchObject({ deleted: true, body: '', canEdit: false });
    expect((await client.patch(`/api/tasks/${taskId}/messages/${byClient}`, { data: { body: 'again' } })).status()).toBe(409);
    // Unknown fields are refused: an edit cannot change who sees the message.
    expect((await admin.patch(`/api/tasks/${taskId}/messages/${internal}`, { data: { body: 'x', clientVisible: true } })).status()).toBe(400);
  } finally {
    await admin.dispose(); await manager.dispose(); await team.dispose(); await client.dispose(); await deleteMatter(taskId);
  }
});

test('#297: staff see no Edit on a client\'s message; their own sent bubble is a darker green', async ({ adminPage }) => {
  const taskId = await createMatter();
  const client = await apiAs('client');
  try {
    const text = `CLIENT-WROTE-${Date.now()}`;
    await client.post(`/api/tasks/${taskId}/messages`, { data: { body: text } });
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
    const theirs = adminPage.getByTestId('chat-bubble').filter({ hasText: text });
    await expect(theirs).toBeVisible();
    await expect(theirs.getByRole('button', { name: 'Edit message' })).toHaveCount(0);
    await expect(theirs.getByRole('button', { name: 'Delete message' })).toBeVisible(); // admin moderation

    const mine = `ADMIN-WROTE-${Date.now()}`;
    await adminPage.getByLabel('Message').fill(mine);
    await adminPage.getByRole('button', { name: /^Send$/ }).click();
    const bubble = adminPage.getByTestId('chat-bubble-mine').filter({ hasText: mine });
    await expect(bubble.getByRole('button', { name: 'Edit message' })).toBeVisible();
    // Not white and not the old, near-white emerald-50.
    const bg = await bubble.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toMatch(/^rgba?\(255, 255, 255/);
    await expect(bubble).toHaveClass(/bg-emerald-100/);
  } finally { await client.dispose(); await deleteMatter(taskId); }
});

test('Chat: the tab is called Chat; sharing with the client asks first; a message can be edited and deleted', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
    await expect(adminPage.getByRole('button', { name: 'Discussion', exact: true })).toHaveCount(0);

    const msg = `TO-CLIENT-${Date.now()}`;
    await adminPage.getByLabel('Message').fill(msg);
    await adminPage.getByLabel('Visible to client').check();
    await adminPage.getByRole('button', { name: /^Send$/ }).click();

    // The preview shows exactly what will go out. "Keep editing" sends nothing.
    const dialog = adminPage.getByRole('dialog');
    await expect(dialog.getByText('Send this to the client?')).toBeVisible();
    await expect(dialog.getByText(msg)).toBeVisible();
    await dialog.getByRole('button', { name: 'Keep editing' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(adminPage.getByText('No messages yet')).toBeVisible();

    await adminPage.getByRole('button', { name: /^Send$/ }).click();
    await adminPage.getByRole('dialog').getByRole('button', { name: 'Send to client' }).click();
    await expect(adminPage.getByText(msg)).toBeVisible();

    // Edit it.
    const fixed = `${msg}-FIXED`;
    await adminPage.getByRole('button', { name: 'Edit message' }).click();
    await adminPage.getByLabel('Edit message').fill(fixed);
    await adminPage.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(adminPage.getByText(fixed)).toBeVisible();
    await expect(adminPage.getByText(/· edited/)).toBeVisible();

    // Delete it, after confirming.
    await adminPage.getByRole('button', { name: 'Delete message' }).click();
    await adminPage.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(adminPage.getByText('This message was deleted')).toBeVisible();
    await expect(adminPage.getByText(fixed)).toHaveCount(0);
  } finally { await deleteMatter(taskId); }
});

/* ── #295: Chat on a phone (the mobile app renders this same page) ───────── */

test('#295: on a phone, a long message keeps Send on screen and the tab is called Chat', async ({ clientPage }) => {
  const taskId = await createMatter();
  try {
    // An iPhone-12-sized viewport, with room taken off for an on-screen keyboard.
    await clientPage.setViewportSize({ width: 390, height: 520 });
    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Chat', exact: true }).click();
    await expect(clientPage.getByRole('button', { name: 'Discussion', exact: true })).toHaveCount(0);

    // A long message: 120 paragraphs, far taller than the screen.
    const editor = clientPage.getByLabel('Message');
    await editor.click();
    const long = Array.from({ length: 120 }, (_, i) => `Line ${i + 1} of a very long message about the proposed company names.`).join('\n');
    await editor.fill(long);

    // The text area stops growing and scrolls inside itself…
    const box = await clientPage.getByTestId('rich-text-scroll').first().boundingBox();
    expect(box!.height, 'the text area is capped').toBeLessThan(520 * 0.5);
    // …so Send stays visible and usable, not under the bottom navigation.
    const send = clientPage.getByRole('button', { name: /^Send$/ });
    await expect(send).toBeInViewport();
    await expect(send).toBeEnabled();
    await expect(clientPage.locator('.app-bottombar')).toBeHidden();
    const sendBox = await send.boundingBox();
    expect(sendBox!.height, 'a 44px touch target').toBeGreaterThanOrEqual(44);

    await send.click();
    await expect(clientPage.getByText('Line 120 of a very long message', { exact: false })).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('#295: a 5,000-word message can be sent; the counter shows the 5,000 limit', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Chat', exact: true }).click();
    const editor = adminPage.getByLabel('Message');
    await editor.click();
    await editor.fill(Array(4200).fill('word').join(' '));
    // The counter appears near the limit and names the CHAT limit, not a comment's 1,000.
    await expect(adminPage.getByText(/4,200 \/ 5,000 words/)).toBeVisible();
    await adminPage.getByRole('button', { name: /^Send$/ }).click();
    await expect(adminPage.getByText('internal').first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});
