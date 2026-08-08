import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, getMatter, resolveServiceKey } from './api';
import { env } from './helpers';

/**
 * #149 — multiple email addresses per matter. The client's own address stays the
 * To recipient; every additional address is CC'd on every automated email for
 * that matter.
 *
 * E2E runs with EMAIL_DISABLED=true (see email-health.spec.ts), so these tests
 * pin the CONTRACT that drives the send — how the list is stored, normalised and
 * edited — rather than intercepting SMTP. The send path itself reads
 * `task.ccEmails` in one place per caller.
 */

test('#149: additional emails can be set at creation', async () => {
  const serviceKey = await resolveServiceKey();
  const api = await apiAs('admin');
  let taskId = '';
  try {
    const res = await api.post('/api/tasks', {
      data: {
        clientUid: env('E2E_CLIENT_UID'), serviceKey,
        organisation: 'E2E CC Org',
        ccEmails: ['Accounts@Example.com', 'cfo@example.com'],
        paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
      },
    });
    expect(res.ok()).toBeTruthy();
    taskId = (await res.json()).id;

    // Stored lowercased, in order, as an array.
    const task = await getMatter(taskId);
    expect(task.ccEmails).toEqual(['accounts@example.com', 'cfo@example.com']);
  } finally {
    await api.dispose();
    if (taskId) await deleteMatter(taskId);
  }
});

test('#149: recipients can be added, edited and removed at any time', async () => {
  const taskId = await createMatter();
  const api = await apiAs('admin');
  try {
    // A matter created without any starts with an empty list, not undefined.
    expect((await getMatter(taskId)).ccEmails).toEqual([]);

    // Add.
    let res = await api.patch(`/api/tasks/${taskId}`, {
      data: { ccEmails: ['one@example.com', 'two@example.com'] },
    });
    expect(res.ok()).toBeTruthy();
    expect((await getMatter(taskId)).ccEmails).toEqual(['one@example.com', 'two@example.com']);

    // Edit — the list is replaced wholesale, so removing one is just a shorter list.
    res = await api.patch(`/api/tasks/${taskId}`, { data: { ccEmails: ['three@example.com'] } });
    expect(res.ok()).toBeTruthy();
    expect((await getMatter(taskId)).ccEmails).toEqual(['three@example.com']);

    // Remove them all.
    res = await api.patch(`/api/tasks/${taskId}`, { data: { ccEmails: [] } });
    expect(res.ok()).toBeTruthy();
    expect((await getMatter(taskId)).ccEmails).toEqual([]);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#149: duplicates and the client’s own address are stripped', async () => {
  const taskId = await createMatter();
  const api = await apiAs('admin');
  try {
    const clientEmail = env('E2E_CLIENT_EMAIL');
    const res = await api.patch(`/api/tasks/${taskId}`, {
      data: {
        ccEmails: [
          'dup@example.com',
          'DUP@example.com',      // same address, different case
          clientEmail,            // the To recipient — must not also be CC
          'other@example.com',
        ],
      },
    });
    expect(res.ok()).toBeTruthy();

    const stored = (await getMatter(taskId)).ccEmails as string[];
    // De-duplicated case-insensitively …
    expect(stored).toEqual(['dup@example.com', 'other@example.com']);
    // … and the client is never both To and CC.
    expect(stored).not.toContain(clientEmail.toLowerCase());
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#149: an invalid address is rejected and nothing is stored', async () => {
  const taskId = await createMatter();
  const api = await apiAs('admin');
  try {
    const res = await api.patch(`/api/tasks/${taskId}`, {
      data: { ccEmails: ['fine@example.com', 'not-an-email'] },
    });
    expect(res.status()).toBe(400);
    // The whole patch is refused — no partial write.
    expect((await getMatter(taskId)).ccEmails).toEqual([]);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#149: a client cannot change the matter’s recipients', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  const client = await apiAs('client');
  try {
    await admin.patch(`/api/tasks/${taskId}`, { data: { ccEmails: ['staff@example.com'] } });

    const res = await client.patch(`/api/tasks/${taskId}`, {
      data: { ccEmails: ['attacker@example.com'] },
    });
    expect(res.status()).toBe(403);
    expect((await getMatter(taskId)).ccEmails).toEqual(['staff@example.com']);
  } finally {
    await admin.dispose();
    await client.dispose();
    await deleteMatter(taskId);
  }
});

test('#149: the recipient list is not exposed to the client', async () => {
  const taskId = await createMatter();
  const admin = await apiAs('admin');
  const client = await apiAs('client');
  try {
    await admin.patch(`/api/tasks/${taskId}`, {
      data: { ccEmails: ['internal-cc@example.com'] },
    });

    // The client may read their own matter, but who staff copy on its mail is
    // staff configuration — it must not come back in the client's projection.
    const res = await client.get(`/api/tasks/${taskId}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ccEmails).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain('internal-cc@example.com');
  } finally {
    await admin.dispose();
    await client.dispose();
    await deleteMatter(taskId);
  }
});

/* ── UI ─────────────────────────────────────────────────────────────────────── */

test('#149: the Create Matter form offers additional email addresses', async ({ adminPage }) => {
  await adminPage.goto('tasks');
  await adminPage.getByRole('button', { name: /create matter/i }).first().click();
  const field = adminPage.getByLabel('Additional email addresses');
  await expect(field).toBeVisible();
  await expect(adminPage.getByText(/copied \(CC\) on every email/i)).toBeVisible();
});

test('#149: staff can edit the recipients from the matter screen', async ({ adminPage }) => {
  const taskId = await createMatter();
  const api = await apiAs('admin');
  try {
    await api.patch(`/api/tasks/${taskId}`, { data: { ccEmails: ['existing@example.com'] } });

    await adminPage.goto(`tasks/${taskId}`);
    const field = adminPage.getByLabel('Additional email addresses');
    await expect(field).toHaveValue('existing@example.com');

    // Editing commits on blur and persists.
    await field.fill('a@example.com, b@example.com');
    await field.blur();
    await expect(adminPage.getByText('Email recipients updated.')).toBeVisible();
    await expect
      .poll(async () => (await getMatter(taskId)).ccEmails)
      .toEqual(['a@example.com', 'b@example.com']);
  } finally {
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('#149: a client gets no recipients editor', async ({ clientPage }) => {
  const taskId = await createMatter();
  try {
    await clientPage.goto(`tasks/${taskId}`);
    await expect(clientPage.getByLabel('Additional email addresses')).toHaveCount(0);
  } finally {
    await deleteMatter(taskId);
  }
});
