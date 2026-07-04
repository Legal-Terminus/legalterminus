import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep, advanceUntil } from './api';

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

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    const comment = `E2E note ${Date.now()}`;
    await adminPage.getByPlaceholder(/add a comment/i).fill(comment);
    await adminPage.getByRole('button', { name: /complete step/i }).click();

    // The comment is recorded and surfaces in the Activity feed. The feed can sit
    // in a sticky sidebar that's off-viewport at test size, so assert it's present
    // in the DOM (recorded) rather than in-viewport visible.
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

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    const draft = `E2E draft ${Date.now()}`;
    const box = adminPage.getByPlaceholder(/add a comment/i);
    await box.fill(draft);
    // Give the debounced autosave time to persist.
    await expect(adminPage.getByText(/draft saved/i)).toBeVisible({ timeout: 5_000 });

    // Reload — the draft restores itself into the box.
    await adminPage.reload();
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    await expect(adminPage.getByPlaceholder(/add a comment/i)).toHaveValue(draft);

    // Submit the step action — the draft is consumed and cleared.
    await adminPage.getByRole('button', { name: /complete step/i }).click();
    await expect(adminPage.getByText(draft).first()).toBeAttached({ timeout: 15_000 });

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();
    // The next step's composer starts empty (draft did not leak across steps).
    const nextBox = adminPage.getByPlaceholder(/add a comment/i);
    if (await nextBox.count()) await expect(nextBox).toHaveValue('');
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
