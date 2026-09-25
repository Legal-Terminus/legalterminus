import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, advanceUntil, advanceSteps, getMatter } from './api';
import { env } from './helpers';

/**
 * #191 — the Matters list gains Current Step and Organisation columns so the team
 * can see where a matter has got to, and who it belongs to, without opening it.
 * The step NAME is resolved server-side from the matter's pinned definition (the
 * list itself stores only a step number).
 */
const ORG = `E2E Org ${Date.now()}`;

test('#191: the list API resolves the current step NAME, not just a number', async () => {
  const taskId = await createMatter({ organisation: ORG });
  try {
    await advanceSteps(taskId, 4);
    const admin = await apiAs('admin');
    const body = await (await admin.get('/api/tasks?limit=50')).json();
    const row = (body.data as Array<Record<string, unknown>>).find((r) => r.id === taskId);
    expect(row, 'matter is listed').toBeTruthy();

    // A real human-readable name, and it matches the matter's actual current step.
    expect(typeof row!.currentStepTitle, 'step name resolved').toBe('string');
    expect(String(row!.currentStepTitle).length).toBeGreaterThan(0);
    expect(String(row!.currentStepTitle)).not.toMatch(/^\d+$/);

    const full = await getMatter(taskId);
    const steps = (full.steps ?? []) as Array<{ stepNumber: number; title: string }>;
    const expected = steps.find((x) => x.stepNumber === full.currentStepNumber)?.title;
    if (expected) expect(row!.currentStepTitle).toBe(expected);

    expect(row!.organisation, 'organisation is carried').toBe(ORG);
    await admin.dispose();
  } finally { await deleteMatter(taskId); }
});

test('#191: both columns render and are searchable', async ({ adminPage }) => {
  const taskId = await createMatter({ organisation: ORG });
  try {
    await advanceSteps(taskId, 4);
    const full = await getMatter(taskId);
    const steps = (full.steps ?? []) as Array<{ stepNumber: number; title: string }>;
    const stepName = steps.find((x) => x.stepNumber === full.currentStepNumber)?.title ?? '';

    await adminPage.goto('tasks');
    await adminPage.waitForTimeout(2500);

    // Headers present.
    await expect(adminPage.getByText('Current Step', { exact: true })).toBeVisible();
    await expect(adminPage.getByText('Organisation', { exact: true })).toBeVisible();
    // Values rendered.
    await expect(adminPage.getByText(ORG).first()).toBeVisible();
    if (stepName) await expect(adminPage.getByText(stepName).first()).toBeVisible();

    // Searching by ORGANISATION finds the matter (search matches an explicit
    // field list, so a new column alone would not have been searchable).
    const search = adminPage.getByPlaceholder(/search/i).first();
    await search.fill(ORG);
    await adminPage.waitForTimeout(1200);
    await expect(adminPage.getByText(ORG).first()).toBeVisible();

    // And searching by STEP NAME also finds it.
    if (stepName) {
      await search.fill(stepName.slice(0, 14));
      await adminPage.waitForTimeout(1200);
      await expect(adminPage.getByText(ORG).first()).toBeVisible();
    }
  } finally { await deleteMatter(taskId); }
});

/* ── #201: the client's phone and email in the matters list ── */

const CLIENT_PHONE = '9990001201'; // seeded on the e2e client (seed-e2e.js)

test('#201: staff get the client\'s phone and email on each matter row', async () => {
  const taskId = await createMatter();
  try {
    for (const role of ['admin', 'team'] as const) {
      const api = await apiAs(role);
      const res = await api.get('/api/tasks?limit=100');
      const rows = res.ok() ? ((await res.json()).data as Array<Record<string, unknown>>) : [];
      await api.dispose();
      const row = rows.find((r) => r.id === taskId);
      if (!row) continue; // a team member sees only matters they are on
      expect(row.clientPhone, `${role}: phone from the client profile`).toBe(CLIENT_PHONE);
      expect(row.clientEmail, `${role}: email from the client profile`).toBe(env('E2E_CLIENT_EMAIL'));
    }
  } finally { await deleteMatter(taskId); }
});

test('#201: clients and professionals never receive client contact fields', async () => {
  const taskId = await createMatter();
  try {
    for (const role of ['client', 'pro'] as const) {
      const api = await apiAs(role);
      const res = await api.get('/api/tasks?limit=100');
      const rows = res.ok() ? ((await res.json()).data as Array<Record<string, unknown>>) : [];
      await api.dispose();
      for (const r of rows) {
        expect(r.clientPhone, `${role}: no clientPhone`).toBeUndefined();
        expect(r.clientEmail, `${role}: no clientEmail`).toBeUndefined();
      }
    }
  } finally { await deleteMatter(taskId); }
});

test('#201: the list shows the contact column and finds a matter by phone', async ({ adminPage }) => {
  const org = `Contact${Date.now()}`;
  const taskId = await createMatter({ organisation: org });
  try {
    await adminPage.goto('tasks');
    await expect(adminPage.getByText('Client Contact', { exact: true }).first()).toBeVisible({ timeout: 20_000 });
    const search = adminPage.getByPlaceholder(/Search by client/i);
    await search.fill(CLIENT_PHONE);
    await expect(adminPage.getByText(org).first(), 'found by the client phone').toBeVisible({ timeout: 15_000 });
    await expect(adminPage.getByRole('link', { name: CLIENT_PHONE }).first()).toHaveAttribute('href', `tel:${CLIENT_PHONE}`);
    await search.fill('0000000000');
    await expect(adminPage.getByText(org)).toHaveCount(0);
  } finally { await deleteMatter(taskId); }
});
