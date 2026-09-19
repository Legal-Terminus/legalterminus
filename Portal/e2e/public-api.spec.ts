import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';
import { request } from '@playwright/test';

/**
 * E-21 — the public API, API keys and webhooks.
 *
 * The property this epic lives or dies on is CREDENTIAL SEPARATION: `/api/v1`
 * accepts only API keys and nothing else accepts them, enforced structurally by
 * separate middleware rather than a branch in shared auth. Most of these tests
 * are that boundary, from both directions.
 */

const API_BASE = process.env.E2E_API_BASE ?? 'http://localhost:5001';
const anon = () => request.newContext({ baseURL: API_BASE });
const withKey = (key: string) => request.newContext({
  baseURL: API_BASE,
  extraHTTPHeaders: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
});

/** Mint a key with the given scopes; returns [secret, revoke]. */
async function mintKey(scopes: string[]): Promise<[string, () => Promise<void>]> {
  const admin = await apiAs('admin');
  const res = await admin.post('/api/settings/api-tokens', {
    data: { name: `e2e-${Date.now()}`, scopes },
  });
  expect(res.status(), `mint: ${await res.text()}`).toBe(201);
  const body = await res.json();
  const id = body.token?.id ?? body.id;
  await admin.dispose();
  return [body.secret as string, async () => {
    const a = await apiAs('admin');
    await a.delete(`/api/settings/api-tokens/${id}`).catch(() => {});
    await a.dispose();
  }];
}

test('E21-S01: only an ADMIN can mint a key', async () => {
  for (const role of ['team', 'manager', 'client'] as const) {
    const api = await apiAs(role);
    const res = await api.post('/api/settings/api-tokens', { data: { name: 'nope', scopes: [] } });
    await api.dispose();
    expect([401, 403], `${role} cannot mint a key`).toContain(res.status());
  }
});

test('E21-S01: the secret is returned once and never listed again', async () => {
  const [secret, revoke] = await mintKey(['read:matters']);
  try {
    expect(secret.startsWith('akey_'), 'recognisable prefix').toBe(true);
    const admin = await apiAs('admin');
    const list = await (await admin.get('/api/settings/api-tokens')).json();
    await admin.dispose();
    // The listing must be enough to recognise and revoke a key, never to use one.
    expect(JSON.stringify(list.data ?? []), 'the secret is not in the listing').not.toContain(secret);
  } finally { await revoke(); }
});

test('E21-S02: /api/v1 refuses an unauthenticated request', async () => {
  const ctx = await anon();
  const res = await ctx.get('/api/v1/matters');
  await ctx.dispose();
  expect(res.status()).toBe(401);
});

test('E21-S02: a Firebase ID token is REFUSED on /api/v1', async () => {
  // The whole point of the structural split: a session credential, however
  // privileged, is not an API key.
  const admin = await apiAs('admin');
  const res = await admin.get('/api/v1/matters');
  await admin.dispose();
  expect(res.status(), 'an admin ID token cannot read the public API').toBe(401);
});

test('E21-S02: an API key is REFUSED on a session route', async () => {
  const [secret, revoke] = await mintKey(['read:matters']);
  try {
    const ctx = await withKey(secret);
    for (const path of ['/api/tasks', '/api/clients', '/api/settings/api-tokens']) {
      const res = await ctx.get(path);
      expect([401, 403], `a key cannot reach ${path}`).toContain(res.status());
    }
    await ctx.dispose();
  } finally { await revoke(); }
});

test('E21-S02: a key reads only what its scopes allow', async () => {
  const [secret, revoke] = await mintKey(['read:matters']);
  try {
    const ctx = await withKey(secret);
    const ok = await ctx.get('/api/v1/matters');
    expect(ok.status(), 'granted scope works').toBe(200);

    const denied = await ctx.get('/api/v1/clients');
    expect(denied.status(), 'ungranted scope is refused').toBe(403);
    const body = await denied.json();
    // A scope failure NAMES the missing scope: the caller has already proved who
    // they are, so telling them what they lack is help, not disclosure.
    expect(body.required).toBe('read:clients');
    await ctx.dispose();
  } finally { await revoke(); }
});

test('E21-S03: a read-only key cannot write', async () => {
  const [secret, revoke] = await mintKey(['read:matters', 'read:clients']);
  try {
    const ctx = await withKey(secret);
    const res = await ctx.post('/api/v1/matters', { data: {} });
    await ctx.dispose();
    expect(res.status(), 'the common case — a leaked read key creates nothing').toBe(403);
  } finally { await revoke(); }
});

test('E21-S01: a revoked key stops working immediately', async () => {
  const [secret, revoke] = await mintKey(['read:matters']);
  const before = await withKey(secret);
  expect((await before.get('/api/v1/matters')).status(), 'works before revocation').toBe(200);
  await before.dispose();

  await revoke();

  const after = await withKey(secret);
  const res = await after.get('/api/v1/matters');
  await after.dispose();
  expect(res.status(), 'revocation takes effect on the very next request').toBe(401);
});

test('E21-S01: a forged or malformed key is refused identically', async () => {
  // Every failure answers the same way, so nobody can enumerate valid ids.
  const bodies = new Set<string>();
  for (const bad of ['akey_deadbeef_nope', 'garbage', 'akey_' + 'a'.repeat(24) + '_' + 'b'.repeat(43)]) {
    const ctx = await withKey(bad);
    const res = await ctx.get('/api/v1/matters');
    expect(res.status()).toBe(401);
    bodies.add(JSON.stringify(await res.json()));
    await ctx.dispose();
  }
  expect(bodies.size, 'all failures are indistinguishable').toBe(1);
});

test('E21-S02: the public projection does not leak internal fields', async () => {
  const [secret, revoke] = await mintKey(['read:matters']);
  const taskId = await createMatter();
  try {
    const ctx = await withKey(secret);
    const body = await (await ctx.get('/api/v1/matters')).json();
    await ctx.dispose();
    const json = JSON.stringify(body);
    // Internal assignment and urgency are staff concerns, not an integration's.
    expect(json, 'no internal assignee uid').not.toMatch(/"assignedTo"/);
    expect(json, 'no step subcollection dump').not.toMatch(/"steps"\s*:/);
  } finally { await revoke(); await deleteMatter(taskId); }
});

test('E21-S04: only an admin can register a webhook, and the URL must be safe', async () => {
  const team = await apiAs('team');
  expect([401, 403]).toContain((await team.post('/api/settings/webhooks', {
    data: { url: 'https://example.com/hook', events: ['matter.created'] },
  })).status());
  await team.dispose();

  const admin = await apiAs('admin');
  // SSRF: a webhook makes the SERVER fetch a URL the admin names.
  for (const url of ['http://example.com/hook', 'https://127.0.0.1/hook', 'https://169.254.169.254/latest/meta-data']) {
    const res = await admin.post('/api/settings/webhooks', { data: { url, events: ['matter.created'] } });
    expect(res.status(), `${url} must be refused`).toBe(400);
  }
  await admin.dispose();
});

test('E21-S04: the events catalogue is exposed for the UI', async () => {
  const admin = await apiAs('admin');
  const body = await (await admin.get('/api/settings/webhooks')).json();
  await admin.dispose();
  expect(body.events, 'the UI needs the list to offer checkboxes').toEqual(
    expect.arrayContaining(['matter.created', 'matter.completed', 'payment.recorded']),
  );
});
