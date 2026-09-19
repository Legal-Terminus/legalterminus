import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * #195 — which steps are "already done" when a matter is created.
 *
 * `createTask` marks steps the creation-time gate AUTO-PASSED as completed (#94)
 * — e.g. a step-1 payment gate on an already-paid matter — so the matter opens
 * cleanly on the step the machine actually settled on.
 *
 * The rule for "auto-passed" must be AUTHORED ORDER, never step number. Step
 * numbers are identity: a step added later keeps a high id, and a re-ordered
 * workflow can legitimately start at step 45 with steps 6, 8 and 23 still ahead
 * of it. Comparing numbers marked eleven future steps — Payment among them —
 * completed the instant a Trademark matter was created.
 *
 * The logic under test is a pure function of (stepDefs, resolvedFirstStep), so
 * it is reproduced here exactly as `createTask` computes it. The shape of the
 * fixture is the point: every other fixture in this repo has initialStep =
 * lowest number and would pass even with the bug present.
 */

/** Mirrors createTask's status rule (tasks.controller.js). */
function statusesAtCreation(stepDefs, resolvedFirstStep, needsApproval = false) {
  const authoredPos = new Map(stepDefs.map((s, i) => [s.stepNumber, i]));
  const firstPos = authoredPos.get(resolvedFirstStep) ?? 0;
  const isAutoPassed = (n) => {
    const pos = authoredPos.get(n);
    return pos != null && pos < firstPos;
  };
  const statusForStep = (n) => {
    if (needsApproval) return 'pending';
    if (isAutoPassed(n)) return 'completed';
    if (n === resolvedFirstStep) return 'active';
    return 'pending';
  };
  return new Map(stepDefs.map((s) => [s.stepNumber, statusForStep(s.stepNumber)]));
}

/** The real Trademark shape: starts at 45, with lower-numbered steps AFTER it. */
const TRADEMARK = [45, 46, 6, 8, 23, 49, 28, 30, 32, 50, 33, 34, 36, 37, 39, 51, 52]
  .map((stepNumber) => ({ stepNumber }));

test('#195: a workflow starting at its highest-numbered step completes nothing', () => {
  const st = statusesAtCreation(TRADEMARK, 45);
  const completed = [...st].filter(([, v]) => v === 'completed').map(([n]) => n);
  assert.deepEqual(completed, [], 'step 45 is authored FIRST — nothing precedes it');
  assert.equal(st.get(45), 'active');
  // The steps the bug wrongly completed, named explicitly so a regression is obvious.
  for (const n of [6, 8, 23, 28, 30, 32, 33, 34, 36, 37, 39]) {
    assert.equal(st.get(n), 'pending', `step ${n} is future work, not done`);
  }
});

test('#195: Payment is never marked paid-for at creation', () => {
  // The most consequential instance: step 37 is "Payment" on the Trademark flow.
  assert.equal(statusesAtCreation(TRADEMARK, 45).get(37), 'pending');
});

test('#94 still holds: a gate the machine really passed IS completed', () => {
  // The behaviour this rule exists for — the matter settles past an auto-passing
  // payment gate, so the steps genuinely behind it open as done.
  const defs = [1, 2, 3, 4].map((stepNumber) => ({ stepNumber }));
  const st = statusesAtCreation(defs, 3);
  assert.equal(st.get(1), 'completed', 'authored before the resolved step');
  assert.equal(st.get(2), 'completed');
  assert.equal(st.get(3), 'active');
  assert.equal(st.get(4), 'pending');
});

test('#195: auto-pass follows authored order even when numbers run backwards', () => {
  // Authored 20 → 5 → 40 → 1, settling on 40. Only 20 and 5 truly precede it;
  // step 1 has the LOWEST number but comes last in the flow.
  const defs = [20, 5, 40, 1].map((stepNumber) => ({ stepNumber }));
  const st = statusesAtCreation(defs, 40);
  assert.equal(st.get(20), 'completed');
  assert.equal(st.get(5), 'completed');
  assert.equal(st.get(40), 'active');
  assert.equal(st.get(1), 'pending', 'lowest number, but authored LAST');
});

test('a matter pending approval starts every step pending', () => {
  const st = statusesAtCreation(TRADEMARK, 45, true);
  assert.ok([...st.values()].every((v) => v === 'pending'), 'no work starts before approval');
});

test('an unknown resolved step does not mass-complete the workflow', () => {
  // Defensive: if the machine settles on a step not in the definition, falling
  // back to position 0 means nothing is "before" it — far safer than completing
  // everything with a lower number.
  const st = statusesAtCreation(TRADEMARK, 9999);
  assert.equal([...st.values()].filter((v) => v === 'completed').length, 0);
});
