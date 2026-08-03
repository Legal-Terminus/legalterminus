import { test, expect } from './fixtures';
import { apiAs, resolveServiceKey, createThrowawayDefinition, deleteDefinition } from './api';

/**
 * E10-S01 (write side) — Workflow Editor. An admin can open a service's workflow,
 * edit it structurally, and publish a new version; the change is validated by the
 * shared compiler check before saving, and saving bumps `version` (in-flight
 * matters are version-pinned, so unaffected). Non-admins cannot reach the editor.
 *
 * The save test is a NET-ZERO round-trip: it appends " (e2e)" to a step title,
 * saves, asserts the version bumped, then restores the original title via a second
 * save — so the suite stays idempotent (only the version counter advances).
 */

let serviceKey: string;     // real seeded service — used by the read-only UI tests
let throwawayId: string;    // dedicated, deletable definition for the MUTATING API tests

test.beforeAll(async () => {
  serviceKey = await resolveServiceKey();
  // Mutating tests edit THIS throwaway, never the shared seeded definition, so they
  // can't race other specs (eta/settings) that write the shared one.
  throwawayId = await createThrowawayDefinition();
});

test.afterAll(async () => { await deleteDefinition(throwawayId); });

test('admin sees an "Edit workflow" button on the service detail page', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('button', { name: /edit workflow/i })).toBeVisible();
});

test('non-admins (team member) do NOT see the edit entry and cannot reach the editor', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  // "Configured Workflow" is now a collapsible section toggle (button), not a heading.
  await expect(teamPage.getByRole('button', { name: /Configured Workflow/ })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /edit workflow/i })).toHaveCount(0);

  // Direct navigation is also blocked by ProtectedRoute (admin-only route).
  await teamPage.goto(`services/${serviceKey}/edit`);
  await expect(async () => {
    expect(/\/services\/.+\/edit(\?|$)/.test(new URL(teamPage.url()).pathname)).toBe(false);
  }).toPass({ timeout: 15_000 });
});

test('editor loads with steps, stages, and a live preview (plain-language UI)', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();
  // #68: Steps/Stages titles are now collapse toggles (buttons), not headings.
  await expect(adminPage.getByRole('button', { name: /^Steps/ })).toBeVisible();
  await expect(adminPage.getByRole('button', { name: /^Stages/ })).toBeVisible();
  // Live preview uses the resizable rail (its title is a span, with a Hide toggle).
  await expect(adminPage.getByText('Live preview')).toBeVisible();
  // Plain-language controls present (no raw "transitions/effects" jargon).
  await expect(adminPage.getByText('What kind of step?').first()).toBeVisible();
  await expect(adminPage.getByText('What happens next?').first()).toBeVisible();
  // A valid seeded workflow → Save is enabled (no validation errors).
  await expect(adminPage.getByRole('button', { name: /save & publish/i })).toBeEnabled();
});

test('#68: workflow sections collapse and stay collapsed on reload', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();

  // A step-detail control is visible while Steps is expanded (default).
  await expect(adminPage.getByText('What kind of step?').first()).toBeVisible();

  // Collapse the Steps section → its body (step-detail controls) disappears.
  await adminPage.getByRole('button', { name: /^Steps/ }).click();
  await expect(adminPage.getByText('What kind of step?')).toHaveCount(0);

  // Collapse persists across a reload (localStorage-backed).
  await adminPage.reload();
  await expect(adminPage.getByRole('button', { name: /^Steps/ })).toBeVisible();
  await expect(adminPage.getByText('What kind of step?')).toHaveCount(0);

  // Re-expand to leave the editor in its default state for other specs.
  await adminPage.getByRole('button', { name: /^Steps/ }).click();
  await expect(adminPage.getByText('What kind of step?').first()).toBeVisible();
});

test('#68: Live preview is drag-resizable and its width persists', async ({ adminPage }) => {
  // The preview rail + drag handle are xl-only; use a wide viewport.
  await adminPage.setViewportSize({ width: 1600, height: 900 });
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();

  const previewSection = adminPage.locator('section:has(button[title="Collapse"])').first();
  await expect(previewSection).toBeVisible();
  const before = (await previewSection.boundingBox())!.width;

  // Drag the preview resize handle left to WIDEN the rail (right-side rail grows on
  // leftward drag).
  const handle = adminPage.getByRole('separator', { name: /resize live preview/i });
  await expect(handle).toBeVisible();
  const box = (await handle.boundingBox())!;
  await adminPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await adminPage.mouse.down();
  await adminPage.mouse.move(box.x - 140, box.y + box.height / 2, { steps: 8 });
  await adminPage.mouse.up();

  const after = (await previewSection.boundingBox())!.width;
  expect(after).toBeGreaterThan(before + 40);

  // Persists across reload.
  await adminPage.reload();
  const persisted = (await adminPage.locator('section:has(button[title="Collapse"])').first().boundingBox())!.width;
  expect(persisted).toBeGreaterThan(before + 40);
});

test('#68: Live preview collapses to a vertical rail and re-expands', async ({ adminPage }) => {
  await adminPage.setViewportSize({ width: 1600, height: 900 });
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();

  // Hide → the diagram/body is gone; a slim vertical "Live preview" rail button
  // remains (its accessible name is the visible text "Live preview", and it
  // carries title="Show live preview").
  await adminPage.getByRole('button', { name: /^Hide/ }).click();
  const railButton = adminPage.getByRole('button', { name: 'Live preview' });
  await expect(railButton).toBeVisible();
  await expect(railButton).toHaveAttribute('title', /show live preview/i);

  // Re-expand.
  await railButton.click();
  await expect(adminPage.getByRole('button', { name: /^Hide/ })).toBeVisible();
});

test('invalid edit disables save and shows an inline error', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();

  // Clear the first step's title → required-field error → save disabled.
  const firstTitle = adminPage.getByLabel(/Step \d+ title/).first();
  await firstTitle.fill('');
  await expect(adminPage.getByText(/to fix before saving/i)).toBeVisible();
  await expect(adminPage.getByRole('button', { name: /save & publish/i })).toBeDisabled();
});

test('admin edits a step title and publishes a new version (isolated definition)', async () => {
  // Operates on the THROWAWAY definition (no other spec touches it), so the version
  // bump and round-trip are deterministic.
  const api = await apiAs('admin');
  const before = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const startVersion = before.version as number;
  const firstStep = [...before.steps].sort((a, b) => a.stepNumber - b.stepNumber)[0];
  const originalTitle = firstStep.title as string;

  // Edit the first step title via PATCH (the same endpoint the editor UI calls).
  const { id: _id, version: _v, createdAt: _c, updatedAt: _u, updatedBy: _b, ...body } = before;
  void _id; void _v; void _c; void _u; void _b;
  body.steps = body.steps.map((s: { stepNumber: number; title: string }) =>
    s.stepNumber === firstStep.stepNumber ? { ...s, title: `${originalTitle} (e2e)` } : s);
  const saved = await api.patch(`/api/workflow-definitions/${throwawayId}`, { data: body });
  expect(saved.ok()).toBeTruthy();

  // Verify persisted: version bumped exactly +1 (isolated), title changed.
  const after = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  expect(after.version).toBe(startVersion + 1);
  const editedStep = after.steps.find((s: { stepNumber: number }) => s.stepNumber === firstStep.stepNumber);
  expect(editedStep.title).toBe(`${originalTitle} (e2e)`);
  await api.dispose();
});

test('the editor UI loads + saves for a real service (smoke)', async ({ adminPage }) => {
  // UI smoke against the real service: open the editor and publish without changes.
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();
  await adminPage.getByRole('button', { name: /save & publish/i }).click();
  await expect(adminPage.getByText(/workflow saved/i)).toBeVisible();
});

test('API rejects a structurally invalid definition (422) and a client (403)', async () => {
  const api = await apiAs('admin');
  const current = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const { id: _id, version: _v, createdAt: _c, updatedAt: _u, updatedBy: _b, ...body } = current;
  void _id; void _v; void _c; void _u; void _b;

  // Point the first step's first transition at a non-existent step → dangling target.
  const broken = structuredClone(body);
  const s = broken.steps.find((x: { transitions?: unknown[] }) => (x.transitions ?? []).length > 0);
  if (s) s.transitions[0].to = 99999;
  const res = await api.patch(`/api/workflow-definitions/${throwawayId}`, { data: broken });
  expect(res.status()).toBe(422);
  const errBody = await res.json();
  expect(Array.isArray(errBody.errors)).toBeTruthy();
  await api.dispose();

  // A client cannot write definitions at all.
  const clientApi = await apiAs('client');
  const cRes = await clientApi.patch(`/api/workflow-definitions/${throwawayId}`, { data: body });
  expect(cRes.status()).toBe(403);
  await clientApi.dispose();
});

test('admin "New workflow" opens create mode requiring a service binding', async ({ adminPage }) => {
  await adminPage.goto('services');
  const newBtn = adminPage.getByRole('button', { name: /new workflow/i });
  await expect(newBtn).toBeVisible();
  await newBtn.click();

  // Create mode: blank workflow + the REQUIRED "Powers which service?" picker (#2).
  await expect(adminPage.getByRole('heading', { name: 'New Workflow' })).toBeVisible();
  await expect(adminPage.getByText(/Powers which service\?/i)).toBeVisible();
  // Without a name + service, Create is blocked (validation).
  await expect(adminPage.getByRole('button', { name: /create workflow/i })).toBeDisabled();
});

test('non-admin does not see "New workflow"', async ({ teamPage }) => {
  await teamPage.goto('services');
  await expect(teamPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /new workflow/i })).toHaveCount(0);
});

test('create-from-scratch via API: requires id+service, persists, deletes', async () => {
  // Deterministic create flow (the UI picker depends on a free service in the
  // catalog; the contract is asserted here). Uses a unique id + a throwaway
  // serviceKey so it never collides with the seeded incorporation workflow.
  const api = await apiAs('admin');
  const id = `e2e-new-${Date.now()}`;
  const body = {
    id,
    name: `E2E Created ${id}`,
    initialStep: 1,
    serviceKeys: [`e2e-svc-${Date.now()}`],
    steps: [
      { stepNumber: 1, title: 'Start', type: 'step', transitions: [{ event: 'COMPLETE_STEP', to: 2 }] },
      { stepNumber: 2, title: 'Done', type: 'final' },
    ],
  };
  const res = await api.post('/api/workflow-definitions', { data: body });
  expect(res.ok()).toBeTruthy();
  const created = await (await api.get(`/api/workflow-definitions/${id}`)).json();
  expect(created.name).toBe(body.name);
  expect(created.version).toBe(1);
  await api.dispose();
  await deleteDefinition(id);
});

test('#134: the editor exposes a per-step Checklist editor (add item)', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();
  // Every step card now has a Checklist editor with an "Add item" control.
  await expect(adminPage.getByText('Checklist', { exact: true }).first()).toBeVisible();
  const addItem = adminPage.getByRole('button', { name: /add item/i }).first();
  await expect(addItem).toBeVisible();
  await addItem.click();
  // A blank checklist-item input appears, editable.
  await expect(adminPage.getByLabel(/checklist item 1/i).first()).toBeVisible();
});

test('#134: checklist items add AND remove persist through save (isolated definition)', async () => {
  // API round-trip on the throwaway (the same body the editor UI PATCHes): add two
  // checklist items to step 1, save, then remove them, save — both persist.
  const api = await apiAs('admin');
  const before = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const { id: _i, version: _v, createdAt: _c, updatedAt: _u, updatedBy: _b, ...body } = before;
  void _i; void _v; void _c; void _u; void _b;

  // Add.
  body.steps = body.steps.map((s: { stepNumber: number }) =>
    s.stepNumber === 1 ? { ...s, checklistItems: ['First item', 'Second item'] } : s);
  expect((await api.patch(`/api/workflow-definitions/${throwawayId}`, { data: body })).ok()).toBeTruthy();
  let after = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  expect(after.steps.find((s: { stepNumber: number }) => s.stepNumber === 1).checklistItems).toEqual(['First item', 'Second item']);

  // Remove (empty list → the editor drops the field). Rebuild the body from `after`.
  const { id: _i2, version: _v2, createdAt: _c2, updatedAt: _u2, updatedBy: _b2, ...body2 } = after;
  void _i2; void _v2; void _c2; void _u2; void _b2;
  body2.steps = body2.steps.map((s: { stepNumber: number }) =>
    s.stepNumber === 1 ? { ...s, checklistItems: undefined } : s);
  expect((await api.patch(`/api/workflow-definitions/${throwawayId}`, { data: body2 })).ok()).toBeTruthy();
  after = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const s1 = after.steps.find((s: { stepNumber: number }) => s.stepNumber === 1);
  expect(s1.checklistItems ?? []).toEqual([]);
  await api.dispose();
});

test('#117: the editor exposes the part-payment chase toggle and it persists', async ({ adminPage }) => {
  // UI: every step card offers the checkbox.
  await adminPage.goto(`services/${serviceKey}/edit`);
  await expect(adminPage.getByRole('heading', { name: 'Edit Workflow' })).toBeVisible();
  await expect(adminPage.getByText(/chase part payment after this step/i).first()).toBeVisible();

  // API round-trip on the throwaway: setting/clearing REMIND_PART_PAYMENT persists.
  const api = await apiAs('admin');
  const before = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const { id: _i, version: _v, createdAt: _c, updatedAt: _u, updatedBy: _b, ...body } = before;
  void _i; void _v; void _c; void _u; void _b;
  body.steps = body.steps.map((s: { stepNumber: number }) =>
    s.stepNumber === 1 ? { ...s, effects: ['REMIND_PART_PAYMENT'] } : s);
  expect((await api.patch(`/api/workflow-definitions/${throwawayId}`, { data: body })).ok()).toBeTruthy();
  const after = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  expect(after.steps.find((s: { stepNumber: number }) => s.stepNumber === 1).effects).toEqual(['REMIND_PART_PAYMENT']);
  await api.dispose();
});

test('#130: create mode offers "Start from an existing workflow" (copy a proven flow)', async ({ adminPage }) => {
  await adminPage.goto('services');
  await adminPage.getByRole('button', { name: /new workflow/i }).click();
  await expect(adminPage.getByRole('heading', { name: 'New Workflow' })).toBeVisible();

  // The copy picker is present and lists existing workflows.
  const picker = adminPage.getByLabel('Start from an existing workflow');
  await expect(picker).toBeVisible();
  const options = await picker.locator('option').allInnerTexts();
  expect(options[0]).toMatch(/start from scratch/i);
  expect(options.length).toBeGreaterThan(1);

  // Copying pulls that workflow's steps into the draft (a blank one has 2 steps).
  const stepsToggle = adminPage.getByRole('button', { name: /^Steps \(\d+\)/ });
  const before = await stepsToggle.innerText();
  await picker.selectOption({ index: 1 });
  await expect(adminPage.getByText(/copied the steps from/i)).toBeVisible();
  await expect(async () => {
    expect(await stepsToggle.innerText()).not.toBe(before);
  }).toPass({ timeout: 10_000 });
});

test('admin can edit a step’s outcomes (add a second outcome) on the throwaway', async () => {
  // Outcome rows (#1) map 1:1 to transitions — adding an outcome adds a transition.
  const api = await apiAs('admin');
  const before = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const { id: _i, version: _v, createdAt: _c, updatedAt: _u, updatedBy: _b, ...body } = before;
  void _i; void _v; void _c; void _u; void _b;
  const s1 = body.steps.find((s: { stepNumber: number }) => s.stepNumber === 1);
  s1.transitions = [
    { event: 'COMPLETE_STEP', to: 2 },
    { event: 'CLIENT_REJECT', to: 1 },
  ];
  const res = await api.patch(`/api/workflow-definitions/${throwawayId}`, { data: body });
  expect(res.ok()).toBeTruthy();
  const after = await (await api.get(`/api/workflow-definitions/${throwawayId}`)).json();
  const a1 = after.steps.find((s: { stepNumber: number }) => s.stepNumber === 1);
  expect((a1.transitions ?? []).length).toBe(2);
  await api.dispose();
});
