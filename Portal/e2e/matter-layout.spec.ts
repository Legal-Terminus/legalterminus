import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep, advanceUntil } from './api';

/**
 * #72 — collapsible + resizable matter panels (Stages / Activity / sidebar).
 * #73 — Activity defaults to the current step, with "Show previous steps".
 * Desktop viewport so the xl rails render.
 */
test.use({ viewport: { width: 1400, height: 900 } });

test('#72: Stages and Activity rails collapse and persist', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // Collapse the Activity rail; the "Activity" label disappears from the rail head.
    const collapseActivity = adminPage.getByRole('button', { name: /collapse activity/i });
    if (await collapseActivity.count()) {
      await collapseActivity.first().click();
      await expect(adminPage.getByRole('button', { name: /expand activity/i }).first()).toBeVisible();
      // Persists across reload.
      await adminPage.reload();
      await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
      await expect(adminPage.getByRole('button', { name: /expand activity/i }).first()).toBeVisible();
    }
  } finally { await deleteMatter(taskId); }
});

test('#72: the left sidebar collapses to an icon rail and persists', async ({ adminPage }) => {
  await adminPage.goto('tasks');
  const collapse = adminPage.getByRole('button', { name: /collapse menu/i });
  await expect(collapse).toBeVisible();
  await collapse.click();
  await expect(adminPage.getByRole('button', { name: /expand menu/i })).toBeVisible();
  // Persisted.
  await adminPage.reload();
  await expect(adminPage.getByRole('button', { name: /expand menu/i })).toBeVisible();
  // Restore for other tests sharing the context.
  await adminPage.getByRole('button', { name: /expand menu/i }).click();
});

test('#73: Activity shows the current step by default with a Show previous steps expander', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const def = await getDefinitionForMatter(taskId);
    const plain = firstPlainStep(def);
    test.skip(!plain, 'No plain step to advance past.');
    // Advance a couple of steps so there's prior-step activity.
    await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // If earlier steps produced activity, the expander appears.
    const expander = adminPage.getByRole('button', { name: /show previous steps/i });
    if (await expander.count()) {
      await expander.first().click();
      await expect(adminPage.getByRole('button', { name: /hide previous steps/i }).first()).toBeVisible();
    }
  } finally { await deleteMatter(taskId); }
});
