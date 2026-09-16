import { test, expect } from './fixtures';
import { apiAs, deleteMatter, resolveServiceKey } from './api';
import { env } from './helpers';

/**
 * #188 — someone added to a matter's "Additional client email addresses" now gets
 * PORTAL ACCESS to that matter, not just an email copy.
 *
 * Setup mirrors the reported case: a matter owned by a DIFFERENT client, with our
 * client's address listed as an additional contact. Before the fix the matter was
 * invisible to them (their list is scoped to clientUid == their own uid) while they
 * still received its emails — a confusing half-state.
 */
const CLIENT_EMAIL = env('E2E_CLIENT_EMAIL');
const OTHER_CLIENT_UID = env('E2E_ADMIN_UID'); // any uid that is NOT our client

async function makeMatter(ccEmails: string[]) {
  const api = await apiAs('admin');
  const res = await api.post('/api/tasks', {
    data: {
      clientUid: OTHER_CLIENT_UID,
      serviceKey: await resolveServiceKey(),
      paymentStatus: 'fully_paid', totalCost: 1000, amountReceived: 1000, paymentMode: 'E2E',
      ccEmails,
    },
  });
  if (!res.ok()) throw new Error(`create failed ${res.status()}: ${await res.text()}`);
  const id = (await res.json()).id as string;
  await api.dispose();
  return id;
}

test('#188: a cc-listed client SEES the matter in their list and can open it', async () => {
  const taskId = await makeMatter([CLIENT_EMAIL]);
  try {
    const client = await apiAs('client');

    // In the list…
    const list = await (await client.get('/api/tasks?limit=50')).json();
    const ids = (list.data as Array<{ id: string }>).map((t) => t.id);
    expect(ids, 'cc-listed matter appears in the client list').toContain(taskId);

    // …and openable.
    const one = await client.get(`/api/tasks/${taskId}`);
    expect(one.status(), 'client can open the matter').toBe(200);

    // Internal fields are still stripped for them (projectTaskForClient).
    const body = await one.json();
    expect(body).not.toHaveProperty('assignedTo');
    expect(body).not.toHaveProperty('ccEmails');

    await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#188: a cc-listed client can use the matter (events, documents)', async () => {
  const taskId = await makeMatter([CLIENT_EMAIL]);
  try {
    const client = await apiAs('client');
    expect((await client.get(`/api/tasks/${taskId}/events`)).status()).toBe(200);
    expect((await client.get(`/api/tasks/${taskId}/documents`)).status()).toBe(200);
    expect((await client.get(`/api/tasks/${taskId}/messages`)).status()).toBe(200);
    await client.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#188: matching is per-MATTER and case-insensitive; unrelated matters stay hidden', async () => {
  const ccUpper = await makeMatter([CLIENT_EMAIL.toUpperCase()]);
  const notCc = await makeMatter(['someone-else@example.com']);
  try {
    const client = await apiAs('client');
    // Case-insensitive match grants access…
    expect((await client.get(`/api/tasks/${ccUpper}`)).status()).toBe(200);
    // …but a matter they are NOT listed on stays forbidden.
    expect((await client.get(`/api/tasks/${notCc}`)).status()).toBe(403);
    const ids = ((await (await client.get('/api/tasks?limit=50')).json()).data as Array<{ id: string }>).map((t) => t.id);
    expect(ids).toContain(ccUpper);
    expect(ids, 'not cc-listed → not in the list').not.toContain(notCc);
    await client.dispose();
  } finally { await deleteMatter(ccUpper); await deleteMatter(notCc); }
});
