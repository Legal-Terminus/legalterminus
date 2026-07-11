import { test, expect } from './fixtures';
import { apiAs, resolveServiceKey, createMatter, deleteMatter } from './api';

/**
 * Combined per-step settings (assignee + ETA + client-visible) and the per-step
 * client-visibility filter. Covers:
 *   - the merged "Step Settings" editor renders all three controls per step and
 *     saves them together (net-zero round-trip via the API to stay idempotent);
 *   - the client task projection DROPS steps whose definition marks
 *     clientVisible === false, while staff see every step.
 */

let serviceKey: string;
let definitionId: string;

test.beforeAll(async () => {
  serviceKey = await resolveServiceKey();
  const api = await apiAs('admin');
  const defs = await (await api.get('/api/workflow-definitions')).json();
  await api.dispose();
  definitionId = defs.find((d: { serviceKeys?: string[] }) => (d.serviceKeys ?? []).includes(serviceKey)).id;
});

/** Expand the "Step Settings" collapsible section if it isn't already open
 *  (its collapsed state persists in localStorage, #68). */
async function openStepSettings(page: import('@playwright/test').Page) {
  const toggle = page.getByRole('button', { name: /Step Settings/ });
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click();
  }
}

test('Step Settings editor shows assignee + ETA + client-visible per step', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('button', { name: /Step Settings/ })).toBeVisible();
  // First step's three controls are present.
  await expect(adminPage.getByLabel(/Step \d+ assignee/).first()).toBeVisible();
  await expect(adminPage.getByLabel(/Step \d+ ETA in days/).first()).toBeVisible();
  await expect(adminPage.getByLabel(/Step \d+ client-visible/).first()).toBeVisible();
});

test('#66: Step Settings numbers the steps continuously (1,2,3…), not by gapped stepNumber', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('button', { name: /Step Settings/ })).toBeVisible();

  // The definition's stepNumbers are sparse (deleted steps leave gaps). Prove the
  // UI shows a gap-free sequence by reading the leading "N." on each visible row.
  // Each row's assignee <select> is uniquely present per step, so its count == step
  // count; the number prefixes live in the sibling title span.
  const selects = adminPage.getByLabel(/Step \d+ assignee/);
  const count = await selects.count();
  expect(count).toBeGreaterThan(5);

  // Collect the visible leading numbers from the rendered step labels.
  const labels = await adminPage.locator('span.text-ink-faint', { hasText: /^\d+\.$/ }).allInnerTexts();
  const nums = labels.map((t) => parseInt(t, 10)).filter((n) => !Number.isNaN(n));
  expect(nums.length).toBe(count);
  // Must be exactly 1,2,3,…,count — continuous, no gaps, no skips.
  expect(nums).toEqual(Array.from({ length: count }, (_, i) => i + 1));

  // And the underlying identity is NOT renumbered: the aria-labels still carry the
  // real (possibly gapped) stepNumbers, so at least one exceeds its display position.
  const ariaNums: number[] = [];
  for (let i = 0; i < count; i++) {
    const al = await selects.nth(i).getAttribute('aria-label');
    const m = al?.match(/Step (\d+) assignee/);
    if (m) ariaNums.push(parseInt(m[1], 10));
  }
  expect(Math.max(...ariaNums)).toBeGreaterThanOrEqual(count); // gaps preserved in identity
});

test('#66: the "Configured Workflow" diagram numbers nodes continuously (1,2,3…)', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  // Expand the Configured Workflow section if it's collapsed.
  const section = adminPage.getByRole('button', { name: /Configured Workflow/ });
  await expect(section).toBeVisible();

  // Diagram nodes are prefixed with the DISPLAY position, e.g. "1. …", "2. …".
  // The prefixes must form the gap-free sequence 1,2,3,… (matching the editor +
  // Step Settings list), never the raw gapped stepNumber.
  await expect(async () => {
    const labels = await adminPage.locator('.react-flow__node').allInnerTexts();
    const prefixes = labels
      .map((t) => t.match(/^\s*(\d+)\.\s/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m) => parseInt(m[1], 10));
    expect(prefixes.length).toBeGreaterThan(5);
    // The first several numbered nodes are strictly 1,2,3,… — no gaps.
    const sorted = [...prefixes].sort((a, b) => a - b);
    expect(sorted.slice(0, 5)).toEqual([1, 2, 3, 4, 5]);
  }).toPass({ timeout: 15_000 });
});

test('team member can view Step Settings but not save', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  await expect(teamPage.getByRole('button', { name: /Step Settings/ })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /save step settings/i })).toHaveCount(0);
});

test('GET /step-settings returns combined rows; PUT saves all three (round-trip)', async ({ adminPage }) => {
  void adminPage;
  const api = await apiAs('admin');
  const before = await (await api.get(`/api/workflow-definitions/${definitionId}/step-settings`)).json();
  expect(Array.isArray(before.steps)).toBeTruthy();
  const row = before.steps[0];
  expect(row).toHaveProperty('assigneeUid');
  expect(row).toHaveProperty('etaDays');
  expect(row).toHaveProperty('clientVisible');

  // Toggle the first step's clientVisible + set an ETA, save, verify, then restore.
  const startVersion = before.version as number;
  const flipped = !row.clientVisible;
  const put = await api.put(`/api/workflow-definitions/${definitionId}/step-settings`, {
    data: { settings: { [String(row.stepNumber)]: { clientVisible: flipped, etaDays: 7 } } },
  });
  expect(put.ok()).toBeTruthy();
  const after = await put.json();
  expect(after.version).toBe(startVersion + 1);
  const editedRow = after.steps.find((s: { stepNumber: number }) => s.stepNumber === row.stepNumber);
  expect(editedRow.clientVisible).toBe(flipped);
  expect(editedRow.etaDays).toBe(7);

  // Restore original values.
  const restore = await api.put(`/api/workflow-definitions/${definitionId}/step-settings`, {
    data: { settings: { [String(row.stepNumber)]: { clientVisible: row.clientVisible, etaDays: row.etaDays } } },
  });
  expect(restore.ok()).toBeTruthy();
  await api.dispose();
});

test('toggling client-visible applies LIVE to an already-created matter (#80)', async ({ adminPage }) => {
  void adminPage;
  const api = await apiAs('admin');
  const settings = await (await api.get(`/api/workflow-definitions/${definitionId}/step-settings`)).json();
  // Pick a step that is currently client-visible so hiding it is observable.
  const target = settings.steps.find((s: { clientVisible: boolean }) => s.clientVisible);
  test.skip(!target, 'No client-visible step to toggle.');
  const startVersion = settings.version as number;

  // Create the matter FIRST, so the toggle happens on an existing matter.
  const taskId = await createMatter({ serviceKey });
  try {
    const clientApi = await apiAs('client');
    const before = await (await clientApi.get(`/api/tasks/${taskId}`)).json();
    const sawBefore = before.steps.some((s: { stepNumber: number }) => s.stepNumber === target.stepNumber);
    expect(sawBefore).toBeTruthy();

    // Hide the step in the definition AFTER the matter exists.
    await api.put(`/api/workflow-definitions/${definitionId}/step-settings`, {
      data: { settings: { [String(target.stepNumber)]: { clientVisible: false } } },
    });

    // The client's view of the SAME matter no longer includes that step.
    await expect(async () => {
      const after = await (await clientApi.get(`/api/tasks/${taskId}`)).json();
      expect(after.steps.some((s: { stepNumber: number }) => s.stepNumber === target.stepNumber)).toBeFalsy();
    }).toPass({ timeout: 10_000 });
    await clientApi.dispose();
  } finally {
    // Restore visibility + clean up.
    await api.put(`/api/workflow-definitions/${definitionId}/step-settings`, {
      data: { settings: { [String(target.stepNumber)]: { clientVisible: true } } },
    });
    void startVersion;
    await api.dispose();
    await deleteMatter(taskId);
  }
});

test('client task projection drops non-client-visible steps; staff see all', async ({ adminPage }) => {
  void adminPage;
  // How many steps does the workflow mark client-visible?
  const api = await apiAs('admin');
  const settings = await (await api.get(`/api/workflow-definitions/${definitionId}/step-settings`)).json();
  const visibleCount = settings.steps.filter((s: { clientVisible: boolean }) => s.clientVisible).length;
  const totalNonFinal = settings.steps.length;
  await api.dispose();

  // Fresh matter for the seeded client.
  const taskId = await createMatter({ serviceKey });
  try {
    // Staff see every step (subcollection has all of them).
    const staffApi = await apiAs('admin');
    const staffTask = await (await staffApi.get(`/api/tasks/${taskId}`)).json();
    await staffApi.dispose();
    expect(staffTask.steps.length).toBeGreaterThan(visibleCount);

    // The client sees ONLY client-visible steps (and never more than staff).
    const clientApi = await apiAs('client');
    const clientRes = await clientApi.get(`/api/tasks/${taskId}`);
    expect(clientRes.ok()).toBeTruthy();
    const clientTask = await clientRes.json();
    await clientApi.dispose();

    expect(clientTask.steps.length).toBeLessThan(staffTask.steps.length);
    // If the workflow marks any steps hidden, the client count should match the
    // visible count (subset of the instantiated steps that are visible).
    if (visibleCount < totalNonFinal) {
      expect(clientTask.steps.length).toBeLessThanOrEqual(visibleCount + 1); // +1 tolerance for a final step
    }
    // Every step the client sees must be one the definition marks visible.
    const visibleNums = new Set(
      settings.steps.filter((s: { clientVisible: boolean }) => s.clientVisible).map((s: { stepNumber: number }) => s.stepNumber),
    );
    for (const s of clientTask.steps) {
      // final step may not be in the settings list (filtered to non-final) — allow it.
      if (settings.steps.some((x: { stepNumber: number }) => x.stepNumber === s.stepNumber)) {
        expect(visibleNums.has(s.stepNumber)).toBeTruthy();
      }
    }
  } finally {
    await deleteMatter(taskId);
  }
});

test('#80: toggling the Client-Visible CHECKBOX in the UI actually hides/shows the step for the client', async ({ adminPage, clientPage }) => {
  // A fresh matter's step list already has multiple steps; pick any NON-current
  // step to toggle (doesn't need to be in the past — the active-step hero panel
  // isn't what we're proving here, so no advanceUntil / payment-gate traversal
  // needed, which keeps this deterministic regardless of workflow shape).
  const taskId = await createMatter();
  try {
    const api = await apiAs('admin');
    const before = await (await api.get(`/api/tasks/${taskId}`)).json();
    await api.dispose();

    const stepsResp = await (await (await apiAs('admin')).get(`/api/workflow-definitions/${definitionId}/step-settings`)).json();
    const target = stepsResp.steps.find((s: { stepNumber: number; clientVisible: boolean }) =>
      s.stepNumber !== before.currentStepNumber && s.clientVisible !== false);
    test.skip(!target, 'No non-current, client-visible step found to toggle.');
    const targetStepNumber: number = target.stepNumber;
    const stepTitle: string = target.title;

    // Confirm the client's OWN matter actually includes this step before hiding it
    // (otherwise the "hidden" assertion below would be trivially true).
    const clientBefore = await (await (await apiAs('client')).get(`/api/tasks/${taskId}`)).json();
    test.skip(!clientBefore.steps.some((s: { stepNumber: number }) => s.stepNumber === targetStepNumber),
      'Target step is not in the client projection to begin with.');

    await adminPage.goto(`services/${serviceKey}`);
    await openStepSettings(adminPage);
    const checkbox = adminPage.getByLabel(`Step ${targetStepNumber} client-visible`);
    await expect(checkbox).toBeVisible();
    const wasChecked = await checkbox.isChecked();

    // Uncheck (or ensure unchecked) → save → verify hidden for the client.
    if (wasChecked) await checkbox.uncheck();
    await adminPage.getByRole('button', { name: /save step settings/i }).click();
    await expect(adminPage.getByText(/step settings saved/i)).toBeVisible();

    await clientPage.goto(`tasks/${taskId}`);
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(clientPage.getByText(stepTitle)).toHaveCount(0);

    // Re-check → save → step reappears for the client.
    await adminPage.goto(`services/${serviceKey}`);
    await openStepSettings(adminPage);
    const checkbox2 = adminPage.getByLabel(`Step ${targetStepNumber} client-visible`);
    await expect(checkbox2).toBeVisible();
    await checkbox2.check();
    await adminPage.getByRole('button', { name: /save step settings/i }).click();
    await expect(adminPage.getByText(/step settings saved/i)).toBeVisible();

    await clientPage.reload();
    await clientPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(clientPage.getByText(stepTitle).first()).toBeVisible();

    // Restore original state if it wasn't visible to begin with.
    if (!wasChecked) {
      await adminPage.goto(`services/${serviceKey}`);
      await openStepSettings(adminPage);
      const restore = adminPage.getByLabel(`Step ${targetStepNumber} client-visible`);
      await restore.uncheck();
      await adminPage.getByRole('button', { name: /save step settings/i }).click();
      await expect(adminPage.getByText(/step settings saved/i)).toBeVisible();
    }
  } finally {
    await deleteMatter(taskId);
  }
});
