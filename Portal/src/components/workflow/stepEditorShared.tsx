import { cloneElement, isValidElement, useId } from 'react';
import FieldLabel from '../common/FieldLabel';
import { inputCls } from './stepEditorVocab';
import type { WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * Story 24.4 — shared step-editing field primitives, extracted verbatim from
 * `pages/workflow/WorkflowEditorPage.tsx` so BOTH the workspace workflow editor
 * and the platform library editor render the same structured UI.
 *
 * Components only (the vocabulary constants live in `stepEditorVocab.ts`).
 * Nothing here fetches, saves, or knows about routes — the pages own that.
 */

/**
 * Story 27.1 (G1): the label is ASSOCIATED with its control. Callers pass a bare
 * `<input>`/`<select>`/`<textarea>` as the only child and we inject the generated
 * id, so no caller can forget the wiring. An explicit `id` on the child wins.
 */
export function LabeledField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const generated = useId();
  const child = isValidElement<{ id?: string }>(children) ? children : null;
  const controlId = child?.props.id ?? generated;
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel label={label} hint={hint} htmlFor={controlId} />
      {child ? cloneElement(child, { id: controlId }) : children}
    </div>
  );
}

export function StepNumberSelect({ value, steps, onChange, label, hint }: {
  value: number | undefined; steps: WorkflowStepDef[]; onChange: (n: number) => void; label: string; hint?: string;
}) {
  return (
    <LabeledField label={label} hint={hint}>
      <select className={inputCls} value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))}>
        {steps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{stepOptionLabel(s)}</option>)}
      </select>
    </LabeledField>
  );
}

/**
 * Story 28.2 (S28b): step pickers show the ENGINE step number alongside the
 * title. Titles alone cannot disambiguate the near-duplicates real workflows
 * carry ("Resubmission — Approval" vs "Resubmission — Preparation of document"),
 * and the number shown here is the one transitions actually route to.
 */
export function stepOptionLabel(s: WorkflowStepDef) {
  return `${s.stepNumber} · ${s.title || 'Untitled step'}`;
}

export function WhatHappensNext({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md bg-surface-card p-3">
      <p className="text-xs font-semibold text-ink-muted mb-2 inline-flex items-center gap-1">
        What happens next?
        <FieldLabel label="" hint="The possible outcomes of this step and where each one goes. Add as many as you need." />
      </p>
      {children}
    </div>
  );
}
