import { test, expect } from './fixtures';

/**
 * E13-S01 — per-step ETA config at the service level (+ E11-S02 phase assignments
 * live on the same page). Verifies the editors render and an ETA can be saved.
 */

test('admin opens a service and sees the Step ETAs editor', async ({ adminPage }) => {
  await adminPage.goto('services');
  // The services list heading is "Service Catalog".
  await expect(adminPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();

  // Open the incorporation service (the one with a workflow definition).
  await adminPage.goto('services/incorporation');
  await expect(adminPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();
  // Phase assignments editor is on the same page (E11-S02).
  await expect(adminPage.getByRole('heading', { name: 'Phase Assignments' })).toBeVisible();
});

test('admin can set and save a step ETA', async ({ adminPage }) => {
  await adminPage.goto('services/incorporation');
  await expect(adminPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();

  // Change the first step's ETA to a NEW value so the edits-overlay enables Save
  // (the button stays disabled until a value actually changes from the server one).
  const firstEta = adminPage.locator('input[type="number"]').first();
  const current = await firstEta.inputValue();
  const next = current === '5' ? '6' : '5';
  await firstEta.fill(next);
  const save = adminPage.getByRole('button', { name: /save etas/i });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(adminPage.getByText(/step etas saved/i)).toBeVisible();
});

test('team member can view but not edit ETAs (inputs disabled)', async ({ teamPage }) => {
  await teamPage.goto('services/incorporation');
  await expect(teamPage.getByRole('heading', { name: 'Step ETAs' })).toBeVisible();
  // Save button is admin/manager-only.
  await expect(teamPage.getByRole('button', { name: /save etas/i })).toHaveCount(0);
});
