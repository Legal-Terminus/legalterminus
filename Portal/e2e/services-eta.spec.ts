import { test, expect } from './fixtures';
import { resolveServiceKey } from './api';

/**
 * E13-S01 — per-step ETA config at the service level, plus the merged Assignments
 * section (E11-S02 phase defaults + per-step overrides, nested under each phase).
 * The service key is resolved from the live workflow definitions (not hardcoded —
 * service catalog/workflows are editable).
 */
let serviceKey: string;
test.beforeAll(async () => { serviceKey = await resolveServiceKey(); });

test('admin opens a service and sees the ETAs and Assignments editors', async ({ adminPage }) => {
  await adminPage.goto('services');
  await expect(adminPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();

  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();
  await expect(adminPage.getByRole('heading', { name: 'Assignments' })).toBeVisible();
});

test('admin sets a phase default + a per-step override in one Assignments section', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  const heading = adminPage.getByRole('heading', { name: 'Assignments' });
  await expect(heading).toBeVisible();

  const teamUid = process.env.E2E_TEAM_UID!;
  const section = adminPage.locator('div.mt-8', { has: heading });

  // First select is the first phase's default; pick the team member.
  await section.locator('select').first().selectOption(teamUid);
  // A nested step override ("Inherit from phase" option present) → also assign it.
  const stepSelect = section.locator('select:has(option[value=""]:text-is("Inherit from phase"))').first();
  await stepSelect.selectOption(teamUid);

  const save = adminPage.getByRole('button', { name: /save assignments/i });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(adminPage.getByText(/assignments saved/i)).toBeVisible();
});

test('team member can view but not edit assignments', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  await expect(teamPage.getByRole('heading', { name: 'Assignments' })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /save assignments/i })).toHaveCount(0);
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

test('E10-S02: a healthy workflow shows no out-of-sync error banner', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Configured Workflow' })).toBeVisible();
  // The seeded incorporation workflow is valid → no hard "out of sync" error.
  await expect(adminPage.getByText(/out of sync — new matters are blocked/i)).toHaveCount(0);
});
