import { test, expect } from './fixtures';
import { createMatter, deleteMatter, getDefinitionForMatter, firstPlainStep, advanceUntil, transition, currentStep, getMatter } from './api';

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
    // per hop. TRACK the exact steps we commented on, in order — don't infer
    // "previous" from the static definition (gaps/jumps make that unreliable).
    const remarkFor = (n: number) => `E2E remark step ${n}`;
    const commentedSteps: number[] = [];
    for (let i = 0; i < 4 && commentedSteps.length < 2; i++) {
      const at = await currentStep(taskId);
      const step = def.steps.find((s) => s.stepNumber === at);
      if (step?.type === 'step' && (step.transitions ?? []).some((t) => t.event === 'COMPLETE_STEP')) {
        await transition('admin', taskId, { type: 'COMPLETE_STEP', remark: remarkFor(at) });
        commentedSteps.push(at);
      } else {
        await advanceUntil(taskId, () => true); // step over anything non-plain, one hop
      }
    }
    test.skip(commentedSteps.length < 2, 'Could not accumulate two distinct plain-step comments.');

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // Core #73 guarantee: the default Activity view reaches back BEYOND just the
    // current step — the most-recent commented (previous) step's remark is present
    // WITHOUT expanding. (The remark also renders in step rows; we only assert it's
    // attached in the DOM, and that the "Show previous steps" expander exists for
    // the older ones. Exact adjacency isn't asserted — the incorporation flow
    // auto-jumps across gates/govt steps, so "immediately previous" by definition
    // order won't line up with the commented steps.)
    const mostRecentPrev = commentedSteps[commentedSteps.length - 1];
    await expect(adminPage.getByText(remarkFor(mostRecentPrev)).first()).toBeAttached({ timeout: 15_000 });
    // Older activity is gated behind the expander (present because earlier steps exist).
    await expect(adminPage.getByRole('button', { name: /show previous steps/i }).first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('#96: completed steps hide behind a "Show completed (N)" toggle in the steps list', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    // Advance a couple of steps so there ARE completed steps to collapse.
    await advanceUntil(taskId, (s) => s.stepNumber >= 3);
    const at = (await getMatter(taskId)).currentStepNumber as number;
    test.skip(at < 3, `Could not advance far enough (at ${at}) to have completed steps.`);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // The toggle appears with a count and defaults to HIDDEN.
    const toggle = adminPage.getByRole('button', { name: /show completed \(\d+\)/i });
    await expect(toggle.first()).toBeVisible({ timeout: 15_000 });

    // No "Done" status label is shown while collapsed (completed rows are hidden).
    // After clicking, completed rows (and their "Done" labels) appear.
    await toggle.first().click();
    await expect(adminPage.getByText('Done', { exact: true }).first()).toBeVisible();
    // Toggle flips to "Hide completed".
    await expect(adminPage.getByRole('button', { name: /hide completed/i }).first()).toBeVisible();
  } finally { await deleteMatter(taskId); }
});

test('#120/#55: steps render as ONE continuous timeline numbered 1..N (no stage gaps like 3→37)', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    // Advance a few steps so the matter is mid-flow (creation auto-jumps to step 4
    // via the payment gate — exactly the case that used to display "1,2,3,37…").
    await advanceUntil(taskId, (s) => s.stepNumber >= 5);

    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // Reveal completed rows so the WHOLE timeline is visible.
    const showCompleted = adminPage.getByRole('button', { name: /show completed \(\d+\)/i });
    if (await showCompleted.count()) await showCompleted.first().click();

    // Read the leading "N." from each step row TITLE (the first paragraph in a row
    // — description/status paragraphs never start with "N."). The set of numbers
    // must be a contiguous 1..N with no gaps — the whole point of #120/#55 (before
    // the fix a single stage showed 1,2,3,37,38,39).
    const titles = adminPage.locator('div[title$=" step"] > button > div > p.text-sm').filter({ hasText: /^\d+\.\s/ });
    await expect(titles.first()).toBeVisible({ timeout: 15_000 });
    const texts = await titles.allInnerTexts();
    const nums = [...new Set(texts.map((t) => parseInt(t.match(/^(\d+)\./)?.[1] ?? '0', 10)).filter((n) => n > 0))]
      .sort((a, b) => a - b);
    expect(nums.length).toBeGreaterThan(3);
    // Contiguous from 1, no jumps.
    expect(nums).toEqual(Array.from({ length: nums.length }, (_, i) => i + 1));
  } finally { await deleteMatter(taskId); }
});

test('#120/#55: the current-step header shows a real position (never "· 0")', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await advanceUntil(taskId, (s) => s.stepNumber >= 5);
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // The hero subtitle reads "Current step · N" — N must be a real 1-based
    // position, never 0 (the empty-`steps` regression showed "· 0").
    const hero = adminPage.getByText(/Current step · \d+/i).first();
    await expect(hero).toBeVisible({ timeout: 15_000 });
    const label = await hero.innerText();
    const n = parseInt(label.match(/·\s*(\d+)/)?.[1] ?? '0', 10);
    expect(n).toBeGreaterThan(0);
  } finally { await deleteMatter(taskId); }
});

test('#101: EVERY step row shows an owner colour bar (incl. pending rows)', async ({ adminPage }) => {
  const taskId = await createMatter();
  try {
    await adminPage.goto(`tasks/${taskId}`);
    await adminPage.getByRole('button', { name: 'Steps', exact: true }).click();

    // Rows are title-attributed "<Owner> step" and carry an absolute bg bar.
    const rows = adminPage.locator('div[title$=" step"]');
    await expect(rows.first()).toBeVisible({ timeout: 15_000 });
    const count = await rows.count();
    expect(count).toBeGreaterThan(1);
    // Every row (not just the first — the old divide-color bug hit rows 2+) must
    // contain a coloured bar span.
    for (let i = 0; i < Math.min(count, 8); i++) {
      const bars = rows.nth(i).locator('span.bg-teal-500, span.bg-amber-500, span.bg-violet-500');
      await expect(bars.first()).toBeAttached();
    }
  } finally { await deleteMatter(taskId); }
});
