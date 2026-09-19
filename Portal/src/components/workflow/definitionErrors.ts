/**
 * Story 24.4 (AC4) — map `validateDefinition` error strings onto the step they
 * belong to, so the editor can show each one on the offending step card instead
 * of only in a page-level list.
 *
 * The shared validator (shared/workflows/definitionSchema.js) is dependency-free
 * and returns plain strings, so attribution is by convention: every step-scoped
 * message names its step as `step <n>` (or `duplicate stepNumber <n>`, or
 * `payment_gate step <n>`). Anything unattributable stays a definition-level
 * error — never dropped.
 */

export interface AttributedErrors {
  /** stepNumber → messages that belong to that step. */
  byStep: Record<number, string[]>;
  /** Messages that belong to the definition as a whole. */
  general: string[];
  /** Every message, in the validator's original order. */
  all: string[];
}

/** Matches the step number in the messages `validateDefinition` produces. */
const STEP_PATTERNS: RegExp[] = [
  /^duplicate stepNumber (\d+)/,
  /^payment_gate step (\d+)/,
  /^step (\d+)\b/,
];

/**
 * Story 28.3 (S28e) — editor-level lint for rules the shared validator does not
 * express.
 *
 * `REMIND_PART_PAYMENT` decides where the balance-due chase begins. The step
 * card has always SAID "only one step should carry this", but nothing enforced
 * it: ticking it on five steps saved cleanly and the chase fired from whichever
 * step happened to complete first. Returns validator-shaped strings so the
 * existing attribution puts each on its own card.
 */
export function lintDefinition(steps: { stepNumber: number; effects?: string[] }[]): string[] {
  const chasers = steps.filter((s) => (s.effects ?? []).includes('REMIND_PART_PAYMENT'));
  if (chasers.length <= 1) return [];
  const numbers = chasers.map((s) => s.stepNumber).join(', ');
  return chasers.map((s) =>
    `step ${s.stepNumber}: only one step may chase part payment — it is also set on steps ${numbers}.`);
}

export function attributeDefinitionErrors(errors: string[]): AttributedErrors {
  const byStep: Record<number, string[]> = {};
  const general: string[] = [];

  for (const message of errors) {
    let stepNumber: number | null = null;
    for (const pattern of STEP_PATTERNS) {
      const m = pattern.exec(message);
      if (m) { stepNumber = Number(m[1]); break; }
    }
    if (stepNumber == null || Number.isNaN(stepNumber)) {
      general.push(message);
      continue;
    }
    (byStep[stepNumber] ??= []).push(message);
  }

  return { byStep, general, all: errors };
}
