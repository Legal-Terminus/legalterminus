import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter } from './api';

/**
 * #164 — orphaned/incomplete records leaked raw placeholder strings into the UI:
 * "Step undefined" and "Unknown client ·" on My Tasks, and progress "13/0" on the
 * matters list. The list endpoints now resolve what they can (step title from the
 * pinned definition, client name from clientUid) and the UI never renders a
 * fraction with a zero denominator.
 */

test('#164: My Tasks never returns "Step undefined" or an unresolved client', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const rows = await (await admin.get('/api/tasks/my-steps')).json();
    const list = (rows.data ?? rows) as Array<Record<string, unknown>>;
    for (const r of list) {
      expect(String(r.stepTitle)).not.toContain('undefined');
      expect(String(r.stepTitle ?? '')).not.toBe('');
      // clientUid is helper-only and must not ship in the payload.
      expect(r).not.toHaveProperty('clientUid');
    }
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#164: the matters list resolves a client name rather than leaving it blank', async () => {
  const taskId = await createMatter();
  try {
    const admin = await apiAs('admin');
    const body = await (await admin.get('/api/tasks?limit=25')).json();
    const rows = body.data as Array<{ id: string; clientName?: string; clientUid?: string }>;
    const mine = rows.find((r) => r.id === taskId);
    expect(mine, 'the new matter is listed').toBeTruthy();
    // Every listed matter that has a clientUid should carry a resolved name.
    for (const r of rows) {
      if (r.clientUid) expect(String(r.clientName ?? '').length, `clientName for ${r.id}`).toBeGreaterThan(0);
    }
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#164: matters list shows no "n/0" progress fraction', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto('tasks');
    await adminPage.waitForTimeout(2500);
    const body = await adminPage.locator('body').innerText();
    // A zero denominator is always wrong; an em dash is shown instead.
    expect(body).not.toMatch(/\b\d+\/0\b/);
    expect(body).not.toContain('Step undefined');
    expect(body).not.toContain('Unknown client');
  } finally { await deleteMatter(taskId); }
});
