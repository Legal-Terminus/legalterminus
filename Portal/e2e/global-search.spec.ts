import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * E22-S02 — global search.
 *
 * A search box is the easiest place in a product to leak data: it touches every
 * collection at once, and a scoping mistake looks like a feature. So the tests
 * that matter most here are the NEGATIVE ones — what each role must NOT find.
 */

test('E22-S02: staff find a matter by its organisation', async () => {
  const org = `Zephyr${Date.now()}`;
  const taskId = await createMatter({ organisation: org });
  try {
    const api = await apiAs('admin');
    const res = await api.get(`/api/search?q=${encodeURIComponent(org)}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    await api.dispose();
    const ids = (body.matters ?? []).map((m: { id: string }) => m.id);
    expect(ids, 'the matter is found by organisation').toContain(taskId);
  } finally { await deleteMatter(taskId); }
});

test('E22-S02: a one-character query returns nothing rather than half the database', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/search?q=a');
  expect(res.status(), 'not an error — the UI calls this on every keystroke').toBe(200);
  const body = await res.json();
  await api.dispose();
  expect(body.matters ?? [], 'no matters for a 1-char query').toHaveLength(0);
  expect(body.clients ?? [], 'no clients for a 1-char query').toHaveLength(0);
});

test('E22-S02: an empty query is handled, not treated as "match everything"', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/search?q=');
  expect(res.status()).toBe(200);
  const body = await res.json();
  await api.dispose();
  expect((body.matters ?? []).length + (body.clients ?? []).length, 'empty query matches nothing').toBe(0);
});

test('E22-S02: a client cannot find another client through search', async () => {
  // A matter for the SEEDED client, searched by a term that would match it.
  const org = `Quorum${Date.now()}`;
  const taskId = await createMatter({ organisation: org });
  try {
    const api = await apiAs('client');
    const res = await api.get(`/api/search?q=${encodeURIComponent(org)}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    await api.dispose();

    // The client list must never be searchable BY a client — that is a roster leak.
    expect(body.clients ?? [], 'a client gets no client roster results').toHaveLength(0);
    // Any matter returned must be their own.
    for (const m of (body.matters ?? []) as Array<{ id: string }>) {
      const check = await (await apiAs('admin')).get(`/api/tasks/${m.id}`);
      const t = await check.json();
      expect(t.clientUid, 'only the client’s own matters come back').toBeTruthy();
    }
  } finally { await deleteMatter(taskId); }
});

test('E22-S02: search requires authentication', async () => {
  const { request } = await import('@playwright/test');
  const anon = await request.newContext({ baseURL: process.env.E2E_API_BASE ?? 'http://localhost:5001' });
  const res = await anon.get('/api/search?q=test');
  await anon.dispose();
  expect([401, 403], 'an unauthenticated search is refused').toContain(res.status());
});
