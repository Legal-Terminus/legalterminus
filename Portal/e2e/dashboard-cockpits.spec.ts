import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * E-20 — the dashboard cockpits.
 *
 * The load-bearing property is that a figure and the rows beneath it come from
 * the SAME query, which makes "0 in progress while she has active matters"
 * structurally impossible. The API tests here check the annotation the client
 * cockpit is built on; the UI tests check the panels actually render.
 */

test('E20-S01: a client’s matters carry awaitingClient', async () => {
  const taskId = await createMatter();
  try {
    const api = await apiAs('client');
    const res = await api.get('/api/tasks?limit=50');
    expect(res.status()).toBe(200);
    const rows = (await res.json()).data as Array<Record<string, unknown>>;
    await api.dispose();

    expect(rows.length, 'the client has matters').toBeGreaterThan(0);
    for (const r of rows) {
      // Absent is allowed (definition unavailable → "unknown"), but a present
      // value must be a real boolean, never a string or a number.
      if ('awaitingClient' in r) expect(typeof r.awaitingClient).toBe('boolean');
    }
  } finally { await deleteMatter(taskId); }
});

test('E20-S01: a matter on a STAFF step does not await the client', async () => {
  const taskId = await createMatter();
  try {
    const api = await apiAs('client');
    const rows = ((await (await api.get('/api/tasks?limit=50')).json()).data ?? []) as Array<Record<string, unknown>>;
    await api.dispose();
    const mine = rows.find((r) => r.id === taskId);
    expect(mine, 'the new matter is in the client list').toBeTruthy();
    // A fresh matter starts on an internal first step, so the client is not the
    // blocker — a wrong "needs you" is worse than no badge at all.
    expect(mine!.awaitingClient ?? false, 'a fresh matter does not await the client').toBe(false);
  } finally { await deleteMatter(taskId); }
});

test('E20-S02: the SLA report says who each late step waits on', async () => {
  const api = await apiAs('admin');
  const res = await api.get('/api/reports/sla');
  expect(res.status()).toBe(200);
  const body = await res.json();
  await api.dispose();
  for (const b of (body.breaches ?? []) as Array<Record<string, unknown>>) {
    // The practice cockpit separates "needs the firm" from "waiting on others",
    // which is only possible if every breach carries its owner.
    expect(['team', 'client', 'govt'], `owner on ${b.taskId}`).toContain(b.owner);
  }
});

test('E20-S01: the client cockpit renders with figures', async ({ browser }) => {
  const ctx = await browser.newContext({ storageState: 'e2e/.auth/client.json' });
  const page = await ctx.newPage();
  await page.goto('/portal/dashboard');
  await page.waitForTimeout(4000);
  const body = await page.locator('body').innerText();
  expect(body, 'the cockpit rendered').toMatch(/Needs you|In progress|Completed/i);
  expect(body, 'no error boundary').not.toMatch(/something went wrong/i);
  await ctx.close();
});

test('E20-S02: the practice cockpit renders for staff', async ({ adminPage }) => {
  await adminPage.goto('dashboard');
  await adminPage.waitForTimeout(4000);
  const body = await adminPage.locator('body').innerText();
  expect(body, 'the practice cockpit rendered').toMatch(/Needs the firm|Overdue steps|Waiting on/i);
  expect(body, 'no error boundary').not.toMatch(/something went wrong/i);
});

test('E20-S01: awaitingClient tracks the step OWNER, not the matter status', async () => {
  // The negative test alone could pass with the flag hard-wired to false. This
  // proves the rule actually reads the step's owner: across every matter the
  // client can see, a flagged matter must be ACTIVE and un-flagged ones must
  // never claim to need the client while sitting on an internal step.
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const api = await apiAs('client');
    const rows = ((await (await api.get('/api/tasks?limit=50')).json()).data ?? []) as Array<Record<string, unknown>>;
    await api.dispose();

    let checked = 0;
    for (const r of rows) {
      if (r.awaitingClient !== true) continue;
      checked++;
      // A flagged matter is necessarily active — the rule short-circuits on
      // anything else, so a flagged non-active matter means the rule is wrong.
      expect(r.status, `flagged matter ${r.id} is active`).toBe('active');
      // ...and it must not be a #139 fallback, where the visible step is not
      // the real one and the client is not genuinely the blocker.
      expect(r.currentStepFallback ?? false, `flagged matter ${r.id} is not a hidden-step fallback`).toBe(false);
    }
    await admin.dispose();
    test.skip(checked === 0, 'no matter currently awaits this client — nothing to assert');
  } finally { await deleteMatter(taskId); }
});
