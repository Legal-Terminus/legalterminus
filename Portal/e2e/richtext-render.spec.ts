import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep, advanceUntil, transition, currentStep } from './api';

/**
 * #132 — a completed step's remark/comments may be RICH TEXT (stored as sanitised
 * HTML, e.g. "<p>Received</p>"). The expanded step row must RENDER that HTML, not
 * print the raw tags. Before the fix the row showed the literal "<p>Received</p>".
 */
test.use({ viewport: { width: 1400, height: 1000 } });

test('#132: a completed step renders a rich-text remark as text, not raw <p> tags', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const def = await getDefinitionForMatter(taskId);
    const plain = firstPlainStep(def);
    test.skip(!plain, 'No plain COMPLETE_STEP step to complete with a remark.');

    // Walk to a plain step and complete it with an HTML remark (the app stores the
    // comment/remark as sanitised HTML — the same shape that leaked raw tags).
    await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
    const at = await currentStep(taskId);
    test.skip(at !== plain!.stepNumber, `Did not land on the plain step (at ${at}).`);
    await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: '<p>REMARK-137-ONCE</p>' });

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // Reveal completed steps, then expand the one we just completed.
    const showCompleted = adminPage.getByRole('button', { name: /show completed \(\d+\)/i });
    if (await showCompleted.count()) await showCompleted.first().click();

    // The step list renders in multiple responsive containers (only one visible at
    // a time), so scope to the VISIBLE row.
    const row = adminPage.locator(`#step-row-${plain!.stepNumber}:visible`).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.getByRole('button').first().click(); // expand

    // The comment reads rendered (no raw tags) …
    await expect(row.getByText('REMARK-137-ONCE').first()).toBeVisible();
    // … the raw "<p>" markup is NOT present anywhere in the row …
    await expect(row).not.toContainText('<p>');
    // … and (#137) it appears exactly ONCE — only in the "Latest comment" section,
    // not duplicated by a separate remark box.
    await expect(row.getByText('REMARK-137-ONCE')).toHaveCount(1);
  } finally { await deleteMatter(taskId); }
});
