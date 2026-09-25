import type { Task } from '../types/task';

/**
 * How far through its workflow is a matter?
 *
 * **`currentStepNumber` is a stable step ID, not a position.** New steps take
 * max+1 and numbers are never reused, so a real workspace matter sits at "step
 * 46" in a 21-step workflow whose step ids run 1–50 with gaps. Treating the id
 * as a position renders 214% progress; clamping it to the total is just as
 * wrong in the other direction — it claimed "21/21, 95% done" for a matter
 * actually at position 18 of 21.
 *
 * The only correct answer needs the matter's ordered step list, which is what
 * the matter detail already does (`orderedNums`). This helper does the same
 * when `steps` is available, and otherwise says nothing rather than guessing.
 *
 * #189 — POSITION IS NOT PROGRESS. Sitting on the 18th of 21 steps does not mean
 * 18 steps' worth of work is done: steps get skipped, and reopening one un-does
 * finished work while the position stays put. So when the server's authoritative
 * finished-step counter (`completedStepCount`) is present it wins, and position
 * is used only as a fallback for matters that predate it.
 */
export interface StepProgress {
  /** 1-based position, or null when it cannot be known honestly. */
  position: number | null;
  total: number;
  /** 0–100, or null when unknown. */
  pct: number | null;
  /** e.g. "18/21", or null. */
  label: string | null;
  /** #189: how many steps are actually FINISHED, when the server told us. */
  completed?: number | null;
}

export function stepProgress(task: {
  status?: string;
  currentStepNumber?: number;
  totalSteps?: number;
  completedStepCount?: number;
  steps?: Pick<Task, 'steps'>['steps'];
}): StepProgress {
  const ordered = (task.steps ?? [])
    .map((s) => s.stepNumber)
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => a - b);

  const total = ordered.length || task.totalSteps || 0;
  if (task.status === 'completed' && total > 0) {
    return { position: total, total, pct: 100, label: `${total}/${total}`, completed: total };
  }
  if (total === 0) return { position: null, total: 0, pct: null, label: null, completed: null };

  // #189: the server's finished-step count is authoritative — it counts completed
  // AND skipped steps and is recomputed on every step write, so it survives skips
  // and reopens that a position-based reading gets wrong.
  const counted = task.completedStepCount;
  if (typeof counted === 'number') {
    const done = Math.max(0, Math.min(counted, total));
    const idx = task.currentStepNumber == null ? -1 : ordered.indexOf(task.currentStepNumber);
    return {
      position: idx >= 0 ? idx + 1 : null,
      total,
      pct: Math.round((done / total) * 100),
      label: `${done}/${total}`,
      completed: done,
    };
  }

  // Best case: we hold the real step list, so the id maps to a true position.
  if (ordered.length > 0) {
    const idx = task.currentStepNumber == null ? -1 : ordered.indexOf(task.currentStepNumber);
    if (idx >= 0) {
      const position = idx + 1;
      return { position, total, pct: Math.round(((position - 1) / total) * 100), label: `${position}/${total}` };
    }
    // #139: a client may not be shown the current step at all — never leak a
    // number for a step they cannot see.
    return { position: null, total, pct: null, label: null };
  }

  // No step list. The id is only trustworthy as a position when it plausibly
  // IS one; otherwise report nothing rather than a confident wrong number.
  const n = task.currentStepNumber;
  if (typeof n === 'number' && n >= 1 && n <= total) {
    return { position: n, total, pct: Math.round(((n - 1) / total) * 100), label: `${n}/${total}` };
  }
  return { position: null, total, pct: null, label: null };
}
