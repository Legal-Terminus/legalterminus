import { test, expect } from './fixtures';
import { apiAs, createMatter, deleteMatter, advanceUntil, advanceSteps, getMatter } from './api';

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
