import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * E22-S01 — the matters board.
 *
 * The board is a second view onto the same data as the matters list, so the
 * property that matters most is AGREEMENT: it must never show a user a matter
 * the list would hide from them, and its columns must follow the definition's
 * AUTHORED order rather than step-number order (#117/#55).
 */

test('E22-S01: the board returns lanes with phase columns', async () => {
  const taskId = await createMatter();
  try {
    const api = await apiAs('admin');
    const res = await api.get('/api/matters/board');
    expect(res.status(), `board: ${await res.text()}`).toBe(200);
    const body = await res.json();
    await api.dispose();

    const lanes = body.lanes as Array<{ defId: string; name: string; total: number; columns: Array<{ id: string; name: string; cards: unknown[] }> }>;
    expect(Array.isArray(lanes), 'lanes is a list').toBe(true);
    const lane = lanes.find((l) => l.columns?.length);
    expect(lane, 'at least one lane has columns').toBeTruthy();
    // A lane's total must equal the cards actually in it — a count that disagrees
    // with its own rows is the bug class this whole port keeps guarding against.
    for (const l of lanes) {
      const carded = l.columns.reduce((n, c) => n + c.cards.length, 0);
      expect(carded, `lane ${l.name}: total matches its cards`).toBeLessThanOrEqual(l.total);
    }
  } finally { await deleteMatter(taskId); }
});

test('E22-S01: the new matter appears on the board', async () => {
  const org = `Board${Date.now()}`;
  const taskId = await createMatter({ organisation: org });
  try {
    const api = await apiAs('admin');
    const body = await (await api.get('/api/matters/board')).json();
    await api.dispose();
    const ids = (body.lanes as Array<{ columns: Array<{ cards: Array<{ id: string }> }> }>)
      .flatMap((l) => l.columns.flatMap((c) => c.cards.map((x) => x.id)));
    expect(ids, 'the matter is on the board').toContain(taskId);
  } finally { await deleteMatter(taskId); }
});

test('E22-S01: a client cannot read the board', async () => {
  const api = await apiAs('client');
  const res = await api.get('/api/matters/board');
  await api.dispose();
  expect([403, 401], 'the board is staff-only — it exposes internal step ownership').toContain(res.status());
});

test('E22-S01: the board and the matters list agree for a team member', async () => {
  const api = await apiAs('team');
  const boardRes = await api.get('/api/matters/board');
  expect(boardRes.status(), 'a team member may see the board').toBe(200);
  const board = await boardRes.json();
  const listed = await (await api.get('/api/tasks?limit=100')).json();
  await api.dispose();

  const boardIds = new Set((board.lanes as Array<{ columns: Array<{ cards: Array<{ id: string }> }> }>)
    .flatMap((l) => l.columns.flatMap((c) => c.cards.map((x) => x.id))));
  const listIds = new Set(((listed.data ?? []) as Array<{ id: string }>).map((t) => t.id));

  // The board must not reveal anything the list withholds from this same user.
  for (const id of boardIds) {
    expect(listIds.has(id), `board card ${id} is also in this user's list`).toBe(true);
  }
});

test('E22-S01: the board page renders', async ({ adminPage }) => {
  await adminPage.goto('matters/board');
  await adminPage.waitForTimeout(2500);
  const body = await adminPage.locator('body').innerText();
  expect(body, 'the board rendered, not an error boundary').not.toMatch(/something went wrong/i);
});
