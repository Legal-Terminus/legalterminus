/**
 * Derive an ordered, display-friendly step list from a workflow machine. Used by:
 *  - the backend to build a task's initial per-step instance state on creation, and
 *  - the Portal to show step titles on the task detail page.
 *
 * Only "real" numbered steps are returned (the `awaiting_payment_*` waiting states
 * and the final `completed` state are excluded — they are machine plumbing, not
 * checklist steps). Titles match the visualizer's labeling.
 */

function titleCase(snake) {
  return snake
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** 'step_2_work_assigning' -> { stepNumber: 2, title: 'Work Assigning' } (null if not a step). */
export function parseStepKey(stateKey) {
  const m = stateKey.match(/^step_(\d+)[a-z]?_(.+)$/);
  if (!m) return null;
  return { stepNumber: Number(m[1]), title: titleCase(m[2]) };
}

/**
 * Returns [{ stepNumber, key, title }] ordered by stepNumber. Deduplicates by
 * stepNumber (a few states share a number via branches) keeping the first.
 */
export function getStepList(machine) {
  const states = (machine.config && machine.config.states) || {};
  const byNumber = new Map();
  for (const key of Object.keys(states)) {
    const parsed = parseStepKey(key);
    if (!parsed) continue;
    if (!byNumber.has(parsed.stepNumber)) {
      byNumber.set(parsed.stepNumber, { stepNumber: parsed.stepNumber, key, title: parsed.title });
    }
  }
  return Array.from(byNumber.values()).sort((a, b) => a.stepNumber - b.stepNumber);
}
