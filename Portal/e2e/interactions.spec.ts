import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep, advanceUntil, getMatter } from './api';

/**
 * E03-S06 (comment on a step action) + E11-S07 (styled confirm dialog, not native
 * window.confirm). Both on fresh state.
 */

test('E03-S06: a comment on Complete Step appears in the activity feed', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const def = await getDefinitionForMatter(taskId);
    const plain = firstPlainStep(def);
    test.skip(!plain, 'No plain step.');
    await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
    // Only proceed if we actually landed on the staff "Complete Step" step; some
    // workflows gate the first plain step behind a client/govt turn (same guard as
    // step-execution.spec.ts).
    const at = (await getMatter(taskId)).currentStepNumber as number;
    test.skip(at !== plain!.stepNumber, `Could not reach the plain step (at ${at}).`);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const completeBtn = adminPage.getByRole('button', { name: /^complete step$/i });
    test.skip(!(await completeBtn.count()), 'Current step is not a staff Complete-Step turn.');

    // The Steps tab renders a comment composer PER step; the current step's is
    // FIRST in DOM order. #122 made this a TipTap rich-text editor — a
    // contenteditable, not an <input> — so `getByPlaceholder(...).fill()` hangs
    // forever. Address it by its textbox role and type into it.
    const comment = `E2E note ${Date.now()}`;
    await adminPage.getByRole('textbox', { name: 'Add a comment' }).first()
      .pressSequentially(comment);
    await completeBtn.first().click();

    // Completing advances the matter and the comment lands in the activity feed.
    // The feed already shows the just-completed step's entry, so "Show previous
    // steps" is often absent — expand it only when present, and assert on the
    // COMMENT itself rather than on the disclosure control (which was the real
    // reason this test failed: it required a button the page no longer needs).
    const showPrev = adminPage.getByRole('button', { name: /show previous steps/i });
    if (await showPrev.count()) await showPrev.first().click();

    // The comment is recorded and surfaces in the activity history (feed can sit in
    // an off-viewport sticky rail, so assert it's attached to the DOM).
    await expect(adminPage.getByText(comment).first()).toBeAttached({ timeout: 15_000 });
  } finally { await deleteMatter(taskId); }
});

test('#83: a comment draft autosaves, restores on reload, and clears after submit', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const def = await getDefinitionForMatter(taskId);
    const plain = firstPlainStep(def);
    test.skip(!plain, 'No plain step.');
    await advanceUntil(taskId, (s) => s.stepNumber === plain!.stepNumber);
    const at = (await getMatter(taskId)).currentStepNumber as number;
    test.skip(at !== plain!.stepNumber, `Could not reach the plain step (at ${at}).`);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    const completeBtn = adminPage.getByRole('button', { name: /^complete step$/i });
    test.skip(!(await completeBtn.count()), 'Current step is not a staff Complete-Step turn.');

    // The current step's composer is FIRST in DOM order (Steps tab has one per step).
    // #122 made it a TipTap contenteditable, so address it by role and TYPE —
    // `fill()` on a contenteditable hangs, and it has no value to assert on.
    const draft = `E2E draft ${Date.now()}`;
    const box = adminPage.getByRole('textbox', { name: 'Add a comment' }).first();
    await box.pressSequentially(draft);
    // Give the debounced autosave time to persist.
    await expect(adminPage.getByText(/draft saved/i)).toBeVisible({ timeout: 5_000 });

    // Reload — the draft restores itself into the box.
    await adminPage.reload();
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(adminPage.getByRole('textbox', { name: 'Add a comment' }).first())
      .toContainText(draft);

    // Submit the step action — the draft is consumed and cleared.
    await adminPage.getByRole('button', { name: /^complete step$/i }).first().click();
    await expect(adminPage.getByText(draft).first()).toBeAttached({ timeout: 15_000 });

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // The next step's composer starts empty (draft did not leak across steps).
    const nextBox = adminPage.getByRole('textbox', { name: 'Add a comment' }).first();
    if (await nextBox.count()) await expect(nextBox).toHaveText('');
  } finally { await deleteMatter(taskId); }
});

test('Attach document on a step opens the Documents tab (E-05 wired, no "soon")', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // The stub is gone — a real "Attach document" action exists and opens Documents.
    await expect(adminPage.getByText('soon')).toHaveCount(0);
    await adminPage.getByRole('button', { name: /attach document/i }).first().click();
    await expect(adminPage.getByText('Upload a document', { exact: true })).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('E11-S07: deleting a matter uses the styled confirm dialog (not native)', async ({ adminPage }) => {
  const taskId = await createMatter();
  let deletedViaUi = false;
  try {
    await adminPage.goto('tasks');
    // Open the matter detail is not needed — delete from the grid row action.
    // Find this matter's row by navigating to it and using the row delete on the grid
    // is fiddly; instead assert the dialog appears for ANY delete and cancel it.
    const del = adminPage.locator('button[title="Delete matter"]').first();
    await expect(del).toBeVisible();
    await del.click();

    // Our styled dialog (role=dialog) appears — NOT a native confirm (which Playwright
    // would auto-dismiss and which has no DOM). Title + Cancel/Delete buttons present.
    const dialog = adminPage.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/delete matter\?/i)).toBeVisible();
    // Cancel leaves everything intact.
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
    deletedViaUi = false;
  } finally {
    if (!deletedViaUi) await deleteMatter(taskId);
  }
});

test('#69: a completed step renders its title with a strikethrough', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    // Advance at least one step so there is a completed step to inspect.
    await advanceUntil(taskId, (s) => s.stepNumber >= 2);
    const at = (await getMatter(taskId)).currentStepNumber as number;
    test.skip(at < 2, `Could not advance past step 1 (at ${at}) — no completed step to check.`);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // The step list marks each completed step with a "Done" badge; its sibling title
    // paragraph must carry line-through (#69). Find a Done row and assert on its title.
    const doneBadge = adminPage.locator('span', { hasText: /^Done$/ }).first();
    await expect(doneBadge).toBeVisible({ timeout: 15_000 });
    // The title <p> is the first text line in the same row; it should be struck through.
    const struckTitle = adminPage.locator('p.line-through').first();
    await expect(struckTitle).toBeVisible();
  } finally { await deleteMatter(taskId); }
});
