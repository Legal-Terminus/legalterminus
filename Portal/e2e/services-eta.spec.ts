import { test, expect } from './fixtures';
import { resolveServiceKey } from './api';

/**
 * E13-S01 — per-step ETA config at the service level (+ E11-S02 phase assignments
 * live on the same page). The service key is resolved from the live workflow
 * definitions (not hardcoded — service catalog/workflows are editable).
 */
let serviceKey: string;
test.beforeAll(async () => { serviceKey = await resolveServiceKey(); });

test('admin opens a service and sees the Step ETAs editor', async ({ adminPage }) => {
  await adminPage.goto('services');
  await expect(adminPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();

  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();
  await expect(adminPage.getByRole('heading', { name: 'Phase Assignments' })).toBeVisible();
  await expect(adminPage.getByRole('heading', { name: 'Step Assignees' })).toBeVisible();
});

test('admin can set a per-step default assignee and save', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  const heading = adminPage.getByRole('heading', { name: 'Step Assignees' });
  await expect(heading).toBeVisible();

  const teamUid = process.env.E2E_TEAM_UID!;
  // Scope to the Step Assignees section (the .mt-8 block that contains its heading)
  // so we don't grab the phase-assignment selects above it.
  const section = adminPage.locator('div.mt-8', { has: heading });
  await section.locator('select').first().selectOption(teamUid);

  const save = adminPage.getByRole('button', { name: /save assignees/i });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(adminPage.getByText(/step assignees saved/i)).toBeVisible();
});

test('team member can view but not edit step assignees', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  await expect(teamPage.getByRole('heading', { name: 'Step Assignees' })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /save assignees/i })).toHaveCount(0);
});

test('admin can set and save a step ETA', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();

  // Change the first step's ETA to a NEW value so the edits-overlay enables Save.
  const firstEta = adminPage.locator('input[type="number"]').first();
  const current = await firstEta.inputValue();
  const next = current === '5' ? '6' : '5';
  await firstEta.fill(next);
  const save = adminPage.getByRole('button', { name: /save etas/i });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(adminPage.getByText(/step etas saved/i)).toBeVisible();
});

test('team member can view but not edit ETAs', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  await expect(teamPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /save etas/i })).toHaveCount(0);
});

test('E11-S02: admin sets a phase default assignee and saves', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Phase Assignments' })).toBeVisible();

  // The phase-assignment selects list staff; pick the team member for the first phase.
  const teamUid = process.env.E2E_TEAM_UID!;
  const phaseSelect = adminPage.locator(`select:has(option[value="${teamUid}"])`).first();
  await phaseSelect.selectOption(teamUid);
  await adminPage.getByRole('button', { name: /save assignments/i }).click();
  await expect(adminPage.getByText(/^Saved$/).or(adminPage.getByText(/saved/i)).first()).toBeVisible();
});

test('E10-S02: a healthy workflow shows no out-of-sync error banner', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Configured Workflow' })).toBeVisible();
  // The seeded incorporation workflow is valid → no hard "out of sync" error.
  await expect(adminPage.getByText(/out of sync — new matters are blocked/i)).toHaveCount(0);
});
