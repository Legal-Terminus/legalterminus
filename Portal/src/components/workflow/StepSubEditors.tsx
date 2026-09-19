import { Plus, Trash2 } from 'lucide-react';
import CollapsibleSection from '../common/CollapsibleSection';
import { outcomeColor } from '../../workflows/machineToGraph';
import { stepOptionLabel } from './stepEditorShared';
import { inputCls, OUTCOME_TYPES } from './stepEditorVocab';
import type { PhaseDef, StepDescription, WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * Story 24.4 — the per-step sub-editors, extracted verbatim from
 * `pages/workflow/WorkflowEditorPage.tsx`. Pure value + onChange components,
 * shared by the workspace and platform-library editors.
 */

export function StagesEditor({ stages, onChange }: { stages: PhaseDef[]; onChange: (p: PhaseDef[]) => void }) {
  const add = () => onChange([...stages, { id: `stage-${Date.now()}`, name: `Stage ${stages.length + 1}`, order: stages.length + 1 }]);
  const patch = (idx: number, next: Partial<PhaseDef>) => onChange(stages.map((p, i) => (i === idx ? { ...p, ...next } : p)));
  const remove = (idx: number) => onChange(stages.filter((_, i) => i !== idx));
  return (
    <CollapsibleSection
      id="stages"
      title="Stages"
      hint="Big-picture groupings shown on the client’s progress tracker, e.g. “Name Reservation”, “Filing”. Optional."
      actions={
        <button onClick={add} className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          <Plus className="w-4 h-4" /> Add stage
        </button>
      }
    >
      {stages.length === 0 ? (
        <p className="text-xs text-ink-muted">No stages yet — steps won’t group on the client’s progress tracker.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {stages.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputCls} value={p.name} onChange={(e) => patch(i, { name: e.target.value })} placeholder="Stage name" aria-label="Stage name" />
              <button onClick={() => remove(i)} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-red-700 hover:bg-red-50 shrink-0" aria-label="Remove stage"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

/**
 * #82: multiple audience-tagged descriptions per step. Admin can add unlimited
 * descriptions, edit, delete, and tag each Internal or Client. Migrates a legacy
 * single `description` into the list on first edit (kept until first save).
 */
export function StepDescriptionsEditor({ step, onPatch }: {
  step: WorkflowStepDef;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
}) {
  // Seed from `descriptions`, else from a legacy single `description`.
  const list: StepDescription[] = step.descriptions
    ?? (step.description ? [{ id: 'legacy', audience: 'client', text: step.description }] : []);

  const commit = (next: StepDescription[]) =>
    onPatch({ descriptions: next, description: undefined }); // drop legacy field once managed here

  const add = () => commit([...list, { id: `d${Date.now()}`, audience: 'client', text: '' }]);
  const update = (i: number, patch: Partial<StepDescription>) =>
    commit(list.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const remove = (i: number) => commit(list.filter((_, j) => j !== i));

  return (
    <div className="rounded-lg border border-hairline p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Descriptions</p>
        <button onClick={add} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add description
        </button>
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-ink-muted">No descriptions. Add one for the internal team or the client.</p>
      ) : (
        <div className="space-y-2">
          {list.map((d, i) => (
            /* #162: the textarea was squeezed to ~90px beside the audience select
               on a phone; stack them below sm. */
            <div key={d.id ?? i} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
              <select
                className={`w-full sm:w-28 sm:shrink-0 ${inputCls}`}
                value={d.audience ?? 'client'}
                onChange={(e) => update(i, { audience: e.target.value as 'internal' | 'client' })}
                aria-label="Description audience"
              >
                <option value="client">Client</option>
                <option value="internal">Internal</option>
              </select>
              <textarea
                className={`flex-1 min-w-0 resize-y ${inputCls}`}
                rows={2}
                value={d.text}
                onChange={(e) => update(i, { text: e.target.value })}
                placeholder="Description text…"
              />
              <button onClick={() => remove(i)} className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-red-700 hover:bg-red-50" title="Delete description" aria-label="Delete description">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * #134: manage a step's verification checklist. The internal team tracks these on
 * the step (client sees them read-only, #95). Admin can add, edit and remove items;
 * an empty list removes the checklist from the step entirely. Maps 1:1 to the
 * engine's `checklistItems[]`.
 */
export function StepChecklistEditor({ step, onPatch }: {
  step: WorkflowStepDef;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
}) {
  const list = step.checklistItems ?? [];
  // Persist: an empty list drops the field so no checklist renders on the step.
  const commit = (next: string[]) => onPatch({ checklistItems: next.length ? next : undefined });
  const add = () => commit([...list, '']);
  const update = (i: number, text: string) => commit(list.map((t, j) => (j === i ? text : t)));
  const remove = (i: number) => commit(list.filter((_, j) => j !== i));

  return (
    <div className="rounded-lg border border-hairline p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Checklist</p>
        <button onClick={add} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add item
        </button>
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-ink-muted">No checklist items. Add one to track sub-tasks for this step.</p>
      ) : (
        <div className="space-y-2">
          {list.map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`flex-1 min-w-0 ${inputCls}`}
                value={text}
                onChange={(e) => update(i, e.target.value)}
                placeholder="Checklist item…"
                aria-label={`Checklist item ${i + 1}`}
              />
              <button onClick={() => remove(i)} className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-red-700 hover:bg-red-50" title="Remove item" aria-label="Remove checklist item">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Freely-editable list of step OUTCOMES — each row is "[outcome] → [go to step]".
 * Replaces the old hardcoded per-kind routing so any step can define any number of
 * future states to any steps. Maps 1:1 to the engine's `transitions[]`.
 */
export function OutcomeRows({ step, allSteps, otherStepNum, onPatch, showColors }: {
  step: WorkflowStepDef;
  allSteps: WorkflowStepDef[];
  otherStepNum: number;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
  showColors?: boolean;
}) {
  const rows = step.transitions ?? [];
  // Persist transitions AND keep the engine `type` consistent: a step that has any
  // "Option (you name it)" (BRANCH_DECISION) outcome must be a branch, otherwise a
  // plain step — so a named option always compiles + renders correctly (auto-switch).
  const commit = (transitions: { event: string; to: number; branch?: string }[]) => {
    const hasBranch = transitions.some((t) => t.event === 'BRANCH_DECISION');
    const patch: Partial<WorkflowStepDef> = { transitions };
    if (step.type !== 'final' && step.type !== 'payment_gate') {
      patch.type = hasBranch ? 'branch' : 'step';
    }
    onPatch(patch);
  };
  const setRow = (i: number, next: Partial<{ event: string; to: number; branch?: string }>) =>
    commit(rows.map((t, idx) => (idx === i ? { ...t, ...next } : t)));
  const addRow = () => commit([...rows, { event: 'COMPLETE_STEP', to: otherStepNum }]);
  const removeRow = (i: number) => commit(rows.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {rows.map((t, i) => {
        const isBranch = t.event === 'BRANCH_DECISION';
        // Colour dot matching this outcome's arrow in the live chart (only while
        // this step is focused, so the editor row and its arrow line up visually).
        const dot = showColors ? outcomeColor(t.event, t.branch, t.to) : null;
        return (
          <div key={i} className="rounded-md border border-hairline bg-white p-2">
            {/* #162: on a phone two side-by-side selects left ~40% of 390px each, so
                the values truncated to "When done∨ → Awaiting P∨" and you couldn't
                read where an outcome routed. Stack below sm; the arrow turns into a
                downward cue. */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              {dot && <span className="w-2.5 h-2.5 rounded-full shrink-0 mb-2.5 hidden sm:block" style={{ backgroundColor: dot }} title="Matches this arrow's colour in the chart" />}
              <div className="flex-1 min-w-0 w-full">
                <span className="block text-[11px] text-ink-muted mb-0.5">Outcome</span>
                <select
                  className={inputCls}
                  value={OUTCOME_TYPES.some((o) => o.event === t.event) ? t.event : 'COMPLETE_STEP'}
                  onChange={(e) => {
                    const ev = e.target.value;
                    const needsName = OUTCOME_TYPES.find((o) => o.event === ev)?.needsName;
                    setRow(i, { event: ev, branch: needsName ? (t.branch || `option_${i + 1}`) : undefined });
                  }}
                  aria-label="Outcome"
                >
                  {OUTCOME_TYPES.map((o) => <option key={o.event} value={o.event}>{o.label}</option>)}
                </select>
              </div>
              <span className="text-ink-muted shrink-0 pb-1.5 hidden sm:inline">→</span>
              <div className="flex-1 min-w-0 w-full">
                <span className="block text-[11px] text-ink-muted mb-0.5">Go to step</span>
                <select className={inputCls} value={t.to} onChange={(e) => setRow(i, { to: Number(e.target.value) })} aria-label="Go to step">
                  {allSteps.map((s) => <option key={s.stepNumber} value={s.stepNumber}>{stepOptionLabel(s)}</option>)}
                </select>
              </div>
              <button
                onClick={() => removeRow(i)}
                className="text-ink-muted hover:text-red-700 shrink-0 sm:pb-1.5 inline-flex items-center justify-center gap-1.5 w-full sm:w-auto min-h-[40px] sm:min-h-0 rounded-md border border-hairline sm:border-0 text-xs sm:text-sm"
                aria-label="Remove outcome"
              >
                <Trash2 className="w-4 h-4" /><span className="sm:hidden">Remove outcome</span>
              </button>
            </div>
            {isBranch && (
              <div className="mt-2">
                <span className="block text-[11px] text-ink-muted mb-0.5">Option name (shown to the team)</span>
                <input className={inputCls} value={t.branch ?? ''} onChange={(e) => setRow(i, { branch: e.target.value })} placeholder="e.g. New name required" aria-label="Option name" />
              </div>
            )}
          </div>
        );
      })}
      {rows.length === 0 && <p className="text-xs text-amber-800">No outcomes yet — this step can’t advance. Add one below.</p>}
      <button onClick={addRow} className="self-start inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
        <Plus className="w-3.5 h-3.5" /> Add outcome
      </button>
    </div>
  );
}
