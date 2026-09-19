import type { WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * Story 24.4 — the plain-language vocabulary the step editor speaks, extracted
 * verbatim from `pages/workflow/WorkflowEditorPage.tsx`. Constants and pure
 * functions only (no components), so both editor surfaces map the same friendly
 * labels onto the same engine model.
 */

// "Step kind" is a friendly grouping over the engine `type` + the transition events
// a step uses. We DERIVE kind from the step's shape, and changing kind rewires the
// step's default transitions appropriately.
export type StepKind = 'work' | 'client' | 'govt' | 'payment' | 'branch' | 'final';

export const KIND_LABEL: Record<StepKind, string> = {
  work: 'Work step (our team)',
  client: 'Client action (approve / sign / upload)',
  govt: 'Government / department wait',
  payment: 'Payment checkpoint',
  branch: 'Split into options',
  final: 'Final step (workflow ends)',
};

export const KIND_HINT: Record<StepKind, string> = {
  work: 'Your team does something, then the workflow moves on.',
  client: 'The client approves, signs, or uploads. They can usually Approve or Request changes.',
  govt: 'Waiting on a government department to approve or reject.',
  payment: 'Pause until payment is received before continuing.',
  branch: 'The step splits into named options, each going to a different next step.',
  final: 'The last step — the workflow is complete here.',
};

export function stepKindOf(s: WorkflowStepDef): StepKind {
  if (s.type === 'payment_gate') return 'payment';
  if (s.type === 'branch') return 'branch';
  if (s.type === 'final') return 'final';
  const events = new Set((s.transitions ?? []).map((t) => t.event));
  if (events.has('CLIENT_APPROVE')) return 'client';
  if (events.has('GOVT_APPROVE')) return 'govt';
  return 'work';
}

// Curated "automatic actions" (effects) with human labels. Unknown/legacy effects
// are preserved (shown read-only in Advanced) so nothing is silently dropped.
export const KNOWN_EFFECTS: { id: string; label: string; hint: string }[] = [
  { id: 'SEND_EMAIL', label: 'Email the client when this step starts', hint: 'Sends the client an email as soon as this step becomes active.' },
  { id: 'NOTIFY_CLIENT_RESUBMISSION', label: 'Notify the client of a resubmission requirement', hint: 'Alerts the client that the department asked for a resubmission (info/documents).' },
];

// Friendly outcome types ↔ engine events. A "Branch option" carries a free-text
// option name (the `branch` value); the rest are single fixed events.
export const OUTCOME_TYPES: { event: string; label: string; needsName?: boolean }[] = [
  { event: 'COMPLETE_STEP', label: 'When done / completed' },
  { event: 'CLIENT_APPROVE', label: 'Client approves' },
  { event: 'CLIENT_REJECT', label: 'Client requests changes' },
  { event: 'GOVT_APPROVE', label: 'Government approves' },
  { event: 'GOVT_REJECT', label: 'Government rejects' },
  { event: 'REWORK', label: 'Sent back for correction' },
  { event: 'BRANCH_DECISION', label: 'Option (you name it)', needsName: true },
];

/**
 * The shared input styling every step-editor field uses.
 *
 * Story 27.7 (S28f): this used to hardcode `border-gray-300` + an indigo focus
 * ring — a third accent hue on a screen whose save button was brand-blue, in an
 * app whose accent is the tenant's. Now on the hairline/ink tokens like every
 * other input, so focus reads the same everywhere.
 */
export const inputCls = 'w-full rounded-md border border-hairline px-2 py-1 text-sm text-ink bg-white placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent';
