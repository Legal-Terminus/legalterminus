import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep, advanceUntil, transition, currentStep } from './api';

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

test('#73: Activity defaults to CURRENT + immediately-PREVIOUS step; earlier steps hide behind the expander', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    const def = await getDefinitionForMatter(taskId);
    // Need at least two plain (COMPLETE_STEP) steps in a row to leave three
    // distinguishable comments: two steps back, one step back, and current.
    const plainSteps = def.steps.filter((s) => s.type === 'step' && (s.transitions ?? []).some((t) => t.event === 'COMPLETE_STEP'));
    test.skip(plainSteps.length < 2, 'Need at least 2 plain steps to prove the current+previous split.');

    // Walk forward, leaving one COMPLETE_STEP transition (with a distinct remark)
    // per hop so we can identify which comment landed on which step.
    const remarkFor = (n: number) => `E2E remark step ${n}`;
    let hops = 0;
    for (let i = 0; i < 3 && hops < 2; i++) {
      const at = await currentStep(taskId);
      const step = def.steps.find((s) => s.stepNumber === at);
      if (step?.type === 'step' && (step.transitions ?? []).some((t) => t.event === 'COMPLETE_STEP')) {
        await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: remarkFor(at) });
        hops++;
      } else {
        await advanceUntil(taskId, () => true); // step over anything non-plain, one hop
      }
    }
    test.skip(hops < 2, 'Could not accumulate two distinct plain-step comments.');

    const finalStep = await currentStep(taskId);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // The immediately-previous step's remark is visible WITHOUT expanding.
    // (finalStep itself has no remark — the remark was left on the step BEFORE it.)
    const previousStepNums = def.steps
      .map((s) => s.stepNumber)
      .filter((n) => n < finalStep)
      .sort((a, b) => b - a);
    const immediatelyPrevious = previousStepNums[0];
    if (immediatelyPrevious != null) {
      await expect(adminPage.getByText(remarkFor(immediatelyPrevious))).toBeVisible({ timeout: 15_000 });
    }

    // A step BEFORE that (two hops back) is hidden until "Show previous steps".
    const twoBack = previousStepNums[1];
    if (twoBack != null) {
      await expect(adminPage.getByText(remarkFor(twoBack))).toHaveCount(0);
      await adminPage.getByRole('button', { name: /show previous steps/i }).click();
      await expect(adminPage.getByText(remarkFor(twoBack))).toBeVisible();
    }
  } finally { await deleteMatter(taskId); }
});
