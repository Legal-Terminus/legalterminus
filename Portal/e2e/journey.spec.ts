import { test, expect } from './fixtures';
import {
  createMatter, deleteMatter, currentStep, assignStep, getMatter,
  getDefinitionForMatter, firstPlainStep, advanceUntil,
} from './api';
import { openMatter, openDocumentsTab, pdfFile } from './helpers';

/**
 * Flagship LIFECYCLE journey — one fresh matter traced across roles, then deleted.
 * Discovery-driven (no hardcoded steps): create → assign → client uploads doc →
 * staff approves doc → staff advances a real step → client view stays safe.
 */
let taskId: string;

test.beforeAll(async () => {
  taskId = await createMatter();
  const step = await currentStep(taskId);
  await assignStep(taskId, step, process.env.E2E_TEAM_UID!);
});
test.afterAll(async () => { await deleteMatter(taskId); });

test.describe.serial('matter lifecycle across roles', () => {
  test('1. admin sees the new matter with owner controls + progress', async ({ adminPage }) => {
    await openMatter(adminPage, taskId, 'Steps');
    await expect(adminPage.getByText('Matter owner')).toBeVisible();
    // E04-S08 progress: the detail shows a "Step N of M" / stage progress cue.
    await expect(adminPage.getByText(/step \d+ of \d+|stage/i).first()).toBeVisible();
  });

  test('2. client uploads a document on their service', async ({ clientPage }) => {
    await openDocumentsTab(clientPage, taskId);
    const file = pdfFile('journey');
    await clientPage.locator('input[type="file"]').first().setInputFiles(file);
    await expect(clientPage.getByText(/awaiting review|uploaded/i)).toBeVisible();
    await expect(clientPage.getByText('Pending review').first()).toBeVisible();
  });

  test('3. staff approves the uploaded document', async ({ adminPage }) => {
    await openDocumentsTab(adminPage, taskId);
    await adminPage.getByRole('button', { name: 'Approve' }).first().click();
    await expect(adminPage.getByText('Approved').first()).toBeVisible();
  });

  test('4. staff advances a real workflow step', async ({ adminPage }) => {
    // Drive to the first plain step generically, then Complete it via the UI.
    const def = await getDefinitionForMatter(taskId);
    const plain = firstPlainStep(def);
    test.skip(!plain, 'No plain step in this workflow.');
    await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
    const before = (await getMatter(taskId)).currentStepNumber as number;

    await openMatter(adminPage, taskId, 'Steps');
    const complete = adminPage.getByRole('button', { name: /complete step/i });
    await expect(complete).toBeVisible();
    await complete.click();
    await expect(async () => {
      expect((await getMatter(taskId)).currentStepNumber as number).toBeGreaterThan(before);
    }).toPass({ timeout: 15_000 });
  });

  test('5. client view stays client-safe (no internal staff names/controls)', async ({ clientPage }) => {
    await openMatter(clientPage, taskId, 'Steps');
    await expect(clientPage.getByText('Step owner')).toHaveCount(0);
    await expect(clientPage.getByText('E2E Admin')).toHaveCount(0);
    await expect(clientPage.getByText('E2E Team')).toHaveCount(0);
  });
});
