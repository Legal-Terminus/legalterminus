import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';
import { env } from './helpers';

/**
 * E-19 — Client 360.
 *
 * The data model is matter-centric; this aggregates it per CLIENT so staff can
 * answer "what is going on with this client?" without opening matters one by one.
 *
 * Two properties are load-bearing and get the most attention here:
 *   • Access. The roster is a management view — a client must never reach it,
 *     and the detail route must never return a STAFF record dressed as a client.
 *   • Honesty. No figure may be derived from `currentStepNumber` as a position
 *     (#117/#55/#189): step numbers are identity, not order.
 */

test('E19-S02: the roster returns clients with their rollups', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/clients');
  expect(res.status(), `roster: ${await res.text()}`).toBe(200);
  const body = await res.json();
  await api.dispose();

  const rows = (body.data ?? body.clients ?? body) as Array<Record<string, unknown>>;
  expect(Array.isArray(rows), 'the roster is a list').toBe(true);
  if (rows.length) {
    const r = rows[0];
    // Zeroes, not nulls or missing keys — a client with no matters still counts.
    for (const k of ['activeMatters', 'overdue', 'outstanding']) {
      expect(typeof r[k], `${k} is a number`).toBe('number');
    }
  }
});

test('E19-S02: a client cannot read the roster', async () => {
  const api = await apiAs('client');
  const res = await api.get('/api/clients');
  await api.dispose();
  expect([403, 401], 'the client book is management-only').toContain(res.status());
});

test('E19-S02: a team member cannot read the roster', async () => {
  const api = await apiAs('team');
  const res = await api.get('/api/clients');
  await api.dispose();
  expect([403, 401], 'monitoring the client book is admin/manager only').toContain(res.status());
});

test('E19-S03: the detail screen returns the client, their matters and the rollup', async () => {
  const org = `Rollup${Date.now()}`;
  const taskId = await createMatter({ organisation: org });
  try {
    const api = await apiAs('admin');
    const res = await api.get(`/api/clients/${env('E2E_CLIENT_UID')}`);
    expect(res.status(), `detail: ${await res.text()}`).toBe(200);
    const body = await res.json();
    await api.dispose();

    expect(body.client ?? body, 'the client is returned').toBeTruthy();
    const matters = (body.matters ?? []) as Array<{ id: string }>;
    expect(matters.some((m) => m.id === taskId), 'their new matter is listed').toBe(true);

    // The count and the rows must agree — that is the whole point of the screen.
    const rollup = body.rollup ?? body;
    if (typeof rollup.activeMatters === 'number') {
      const live = matters.filter((m) => ['active', 'pending'].includes((m as Record<string, unknown>).status as string));
      expect(rollup.activeMatters, 'the count matches the rows it counts').toBe(live.length);
    }
  } finally { await deleteMatter(taskId); }
});

test('E19-S03: a STAFF uid is not found through the client route', async () => {
  const api = await apiAs('admin');
  // The role check is the only thing standing between this route and a staff
  // record — single-tenant has no second layer behind it.
  const res = await api.get(`/api/clients/${env('E2E_TEAM_UID')}`);
  await api.dispose();
  expect(res.status(), 'a team member is not a client').toBe(404);
});

test('E19-S03: an unknown uid is 404, not a 500', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/clients/definitely-not-a-real-uid-000');
  await api.dispose();
  expect(res.status()).toBe(404);
});

test('E19-S01: rollup figures are not derived from the step number', async () => {
  // A matter sits on a step whose ID is far larger than the step count; if any
  // figure used the id as a position, it would exceed the matter count.
  const taskId = await createMatter();
  try {
    const api = await apiAs('admin');
    const body = await (await api.get(`/api/clients/${env('E2E_CLIENT_UID')}`)).json();
    await api.dispose();
    const rollup = body.rollup ?? body;
    const matters = (body.matters ?? []) as unknown[];
    if (typeof rollup.activeMatters === 'number') {
      expect(rollup.activeMatters, 'active matters cannot exceed total matters').toBeLessThanOrEqual(matters.length);
    }
    if (typeof rollup.overdue === 'number') {
      expect(rollup.overdue, 'overdue cannot exceed total matters').toBeLessThanOrEqual(matters.length);
    }
  } finally { await deleteMatter(taskId); }
});

test('E-19: the managed tag list is readable and admin-gated', async () => {
  const admin = await apiAs('admin');
  const ok = await admin.get('/api/clients/tags');
  expect(ok.status(), 'tags resolves BEFORE /:uid — not captured as a client id').toBe(200);
  await admin.dispose();

  const client = await apiAs('client');
  const denied = await client.get('/api/clients/tags');
  await client.dispose();
  expect([403, 401]).toContain(denied.status());
});
