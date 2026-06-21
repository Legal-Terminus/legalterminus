import { test, expect } from './fixtures';
import { resolveServiceKey } from './api';

/**
 * Service-level workflow config: the merged per-step "Step Settings" block
 * (assignee + ETA + client-visible, E10-S01) and the phase-level default-assignee
 * editor (E11-S02). The service key is resolved from the live workflow definitions
 * (not hardcoded — catalog/workflows are editable).
 */
let serviceKey: string;
test.beforeAll(async () => { serviceKey = await resolveServiceKey(); });

test('admin opens a service and sees Step Settings + Phase Assignments editors', async ({ adminPage }) => {
  await adminPage.goto('services');
  await expect(adminPage.getByRole('heading', { name: 'Service Catalog' })).toBeVisible();

  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Step Settings' })).toBeVisible();
  await expect(adminPage.getByRole('heading', { name: 'Phase Assignments' })).toBeVisible();
});

test('admin sets a phase default assignee and saves', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  const heading = adminPage.getByRole('heading', { name: 'Phase Assignments' });
  await expect(heading).toBeVisible();

  const teamUid = process.env.E2E_TEAM_UID!;
  // First phase's default-assignee select (labelled "<phase> default assignee").
  const phaseSelect = adminPage.getByLabel(/default assignee/i).first();
  await expect(phaseSelect).toBeVisible();

  // Ensure the value actually CHANGES (so the edit overlay enables Save) regardless
  // of prior state: clear to Unassigned first, then set the team member.
  await phaseSelect.selectOption('');
  await phaseSelect.selectOption(teamUid);

  const save = adminPage.getByRole('button', { name: /save assignments/i });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(adminPage.getByText(/assignments saved/i)).toBeVisible();
});

test('team member can view but not edit assignments', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  await expect(teamPage.getByRole('heading', { name: 'Phase Assignments' })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /save assignments/i })).toHaveCount(0);
});

test('admin can set and save a step ETA in the Step Settings block', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Step Settings' })).toBeVisible();

  // Change the first step's ETA to a NEW value so the edits-overlay enables Save.
  const firstEta = adminPage.getByLabel(/Step \d+ ETA in days/).first();
  const current = await firstEta.inputValue();
  const nextVal = current === '5' ? '6' : '5';
  await firstEta.fill(nextVal);
  const save = adminPage.getByRole('button', { name: /save step settings/i });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(adminPage.getByText(/step settings saved/i)).toBeVisible();
});

test('team member can view but not edit Step Settings', async ({ teamPage }) => {
  await teamPage.goto(`services/${serviceKey}`);
  await expect(teamPage.getByRole('heading', { name: 'Step Settings' })).toBeVisible();
  await expect(teamPage.getByRole('button', { name: /save step settings/i })).toHaveCount(0);
});

test('E10-S02: a healthy workflow shows no out-of-sync error banner', async ({ adminPage }) => {
  await adminPage.goto(`services/${serviceKey}`);
  await expect(adminPage.getByRole('heading', { name: 'Configured Workflow' })).toBeVisible();
  // The seeded incorporation workflow is valid → no hard "out of sync" error.
  await expect(adminPage.getByText(/out of sync — new matters are blocked/i)).toHaveCount(0);
});
