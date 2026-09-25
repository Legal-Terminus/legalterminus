import { useState } from 'react';
import StepConditionEditor from './StepConditionEditor';
import StepDueRuleEditor from './StepDueRuleEditor';
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronRight, Crosshair, AlertTriangle } from 'lucide-react';
import FieldLabel from '../common/FieldLabel';
import { useConfirm } from '../common/confirmContext';
import { LabeledField, StepNumberSelect, WhatHappensNext } from './stepEditorShared';
import {
  inputCls, KIND_HINT, KIND_LABEL, KNOWN_EFFECTS, stepKindOf, type StepKind,
} from './stepEditorVocab';
import { OutcomeRows, StepChecklistEditor, StepDescriptionsEditor } from './StepSubEditors';
import StepAutomationSummary, { automationRows } from './StepAutomationSummary';
import { ROLES } from '../../lib/roles';
import type { PhaseDef, WorkflowStepDef } from '../../api/workflowDefinitions';

/** Story 28.3: staff roles a step can be assigned to (never clients). */
const STAFF_ROLES = ROLES.filter((r) => r.staff);

/**
 * Story 24.4 — one step's editor card, extracted verbatim from
 * `pages/workflow/WorkflowEditorPage.tsx` so the workspace editor and the
 * platform library editor share it. Value + callbacks only: no fetching, no
 * saving, no route knowledge.
 *
 * `errors` (AC4) is the only addition: validation messages attributed to THIS
 * step, rendered at the top of the card. The workspace editor passes none, so
 * its behaviour is unchanged.
 */
export default function StepCard({ step, index, total, stages, allSteps, isActive, cardRef, errors, expanded = true, onToggleExpanded, onActivate, onLocate, onAddAfter, onPatch, onRemove, onMove }: {
  step: WorkflowStepDef;
  index: number;
  total: number;
  stages: PhaseDef[];
  allSteps: WorkflowStepDef[];
  isActive?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  /** Story 24.4 (AC4): validation messages that belong to this step. */
  errors?: string[];
  /**
   * Story 28.1 (S28a): cards render collapsed to a summary row by default.
   * A 40-step workflow used to mount every field of every step at once —
   * 41,455px of page and 675 controls, so editing step 30 meant scrolling
   * ~46 screens. Omitted (undefined) keeps the always-expanded behaviour for
   * any surface that has not adopted the accordion.
   */
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onActivate?: () => void;
  onLocate?: () => void;
  onAddAfter?: () => void;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const confirm = useConfirm();
  const handleRemove = async () => {
    const ok = await confirm({
      title: 'Delete this step?',
      message: `“${step.title || 'Untitled step'}” will be removed from the workflow. Other steps pointing to it will need their outcomes updated.`,
      tone: 'danger',
      confirmLabel: 'Delete step',
    });
    if (ok) onRemove();
  };
  const kind = stepKindOf(step);
  // Story 31.4: surfaced on the collapsed summary so a 40-step list shows which
  // steps actually DO something without opening each one.
  const automationCount = automationRows(step).length;
  const events = step.transitions ?? [];
  const firstTo = (event: string) => events.find((t) => t.event === event)?.to;
  // Default routing target = the NEXT step in the list (common case), else the
  // first other step. Avoids new outcomes jumping to the last/Done step.
  const nextStepNum = allSteps[index + 1]?.stepNumber
    ?? allSteps.find((s) => s.stepNumber !== step.stepNumber)?.stepNumber
    ?? step.stepNumber;
  const otherStepNum = nextStepNum;

  // Change step KIND → set engine `type` and PRE-FILL sensible default outcomes
  // (which the user can then freely edit/add/remove via OutcomeRows). Existing
  // matching outcomes are preserved so changing kind doesn't lose wiring.
  const setKind = (k: StepKind) => {
    const next = otherStepNum;
    if (k === 'final') { onPatch({ type: 'final', transitions: [], gate: undefined }); return; }
    if (k === 'payment') {
      onPatch({ type: 'payment_gate', transitions: [], gate: step.gate ?? { requires: 'fully_paid', onPass: next, onWait: step.stepNumber } });
      return;
    }
    if (k === 'branch') {
      const existing = events.filter((t) => t.event === 'BRANCH_DECISION');
      onPatch({ type: 'branch', gate: undefined, transitions: existing.length ? existing : [{ event: 'BRANCH_DECISION', to: next, branch: 'option_1' }] });
      return;
    }
    if (k === 'client') { onPatch({ type: 'step', gate: undefined, transitions: [{ event: 'CLIENT_APPROVE', to: firstTo('CLIENT_APPROVE') ?? next }, { event: 'CLIENT_REJECT', to: firstTo('CLIENT_REJECT') ?? step.stepNumber }] }); return; }
    if (k === 'govt') { onPatch({ type: 'step', gate: undefined, transitions: [{ event: 'GOVT_APPROVE', to: firstTo('GOVT_APPROVE') ?? next }, { event: 'GOVT_REJECT', to: firstTo('GOVT_REJECT') ?? step.stepNumber }] }); return; }
    onPatch({ type: 'step', gate: undefined, transitions: events.length ? events : [{ event: 'COMPLETE_STEP', to: firstTo('COMPLETE_STEP') ?? next }] }); // work
  };

  // Who-does-this select value.
  const whoValue = step.defaultAssigneeUid === '__CLIENT__' ? 'client' : (step.assignedRole ? 'role' : 'team');

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border bg-surface-soft/40 p-4 transition-shadow scroll-mt-4 ${
        errors?.length ? 'border-red-100 ring-1 ring-red-200'
          : isActive ? 'border-brand-400 ring-1 ring-brand-300' : 'border-hairline'
      }`}
      onFocusCapture={onActivate}
      onClick={onActivate}
    >
      {/* Story 24.4 (AC4): validation surfaced ON the offending step. */}
      {errors && errors.length > 0 && (
        <div className="mb-3 rounded-md border border-red-100 bg-red-50 p-2" role="alert">
          <p className="flex items-center gap-1.5 text-xs font-medium text-red-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Fix this step
          </p>
          <ul className="mt-1 list-disc list-inside text-[11px] text-red-700 space-y-0.5">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Story 28.2 (S28b): the badge shows the ENGINE stepNumber, not the list
          position. Transitions route by stepNumber and new steps take max+1
          without renumbering, so `index + 1` drifted from the number every
          "Go to step" select and the diagram actually use. */}
      {/* Story 28.4 (S9): the title row stacked four icon buttons beside the
          input, crushing it to ~90px on a phone. Stack below sm:. */}
      <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${expanded ? 'mb-3' : ''}`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onToggleExpanded && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleExpanded(); }}
              aria-expanded={expanded}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} step ${step.stepNumber}`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-ink hover:bg-surface-soft shrink-0"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          )}
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-brand-50 text-xs font-semibold text-brand-700 shrink-0">{step.stepNumber}</span>
          {expanded ? (
            <input className={`${inputCls} font-medium`} value={step.title} onChange={(e) => onPatch({ title: e.target.value })} aria-label={`Step ${step.stepNumber} title`} placeholder="Internal step name (our team)" />
          ) : (
            <button
              type="button"
              onClick={() => onToggleExpanded?.()}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block text-sm font-medium text-ink truncate">{step.title || 'Untitled step'}</span>
              <span className="block text-xs text-ink-muted truncate">
                {KIND_LABEL[kind]}
                {kind !== 'final' && ` · ${events.length} outcome${events.length === 1 ? '' : 's'}`}
                {automationCount > 0 && ` · ${automationCount} automation${automationCount === 1 ? '' : 's'}`}
                {errors?.length ? ` · ${errors.length} problem${errors.length === 1 ? '' : 's'}` : ''}
              </span>
            </button>
          )}
        </div>
        {/* #162: these were four bare 16px icons packed into ~70px with the
            destructive one in the middle. Each now has a ≥36px tap target, and
            delete is pushed away from the move controls by a divider. */}
        <div className="flex items-center gap-0.5 shrink-0 self-end sm:self-auto">
          {onLocate && (
            <button onClick={onLocate} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-brand-600 hover:bg-surface-soft" aria-label="Locate in chart" title="Locate in chart"><Crosshair className="w-4 h-4" /></button>
          )}
          <button onClick={() => onMove(-1)} disabled={index === 0} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-ink hover:bg-surface-soft disabled:opacity-30" aria-label="Move up"><ChevronUp className="w-4 h-4" /></button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-ink hover:bg-surface-soft disabled:opacity-30" aria-label="Move down"><ChevronDown className="w-4 h-4" /></button>
          <span aria-hidden="true" className="w-px h-5 bg-hairline mx-1" />
          <button onClick={handleRemove} className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-muted hover:text-red-700 hover:bg-red-50" aria-label="Remove step"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Everything below the header is the step's full editor — mounted only
          when expanded (Story 28.1). */}
      {expanded && (<>
      {/* Story 31.4: what this step does on its own, in plain language, before
          the fields that configure it. Renders nothing when there is nothing to
          say. */}
      <StepAutomationSummary
        step={step}
        stepTitleFor={(n) => allSteps.find((x) => x.stepNumber === n)?.title ?? ''}
        className="mb-3 pl-8"
      />

      {/* #103: separate client-facing step name. Blank → the client sees the
          internal name above. Lets the client see a friendlier label. */}
      <div className="mb-3 pl-8">
        <LabeledField label="Client step name" hint="What the CLIENT sees for this step. Leave blank to reuse the internal name above.">
          <input
            className={inputCls}
            value={step.clientTitle ?? ''}
            onChange={(e) => onPatch({ clientTitle: e.target.value || undefined })}
            aria-label={`Step ${step.stepNumber} client name`}
            placeholder={step.title ? `Defaults to “${step.title}”` : 'Client-facing name (optional)'}
          />
        </LabeledField>
      </div>

      {/* #106: editable email/notification the client receives when this step
          becomes their turn. Only meaningful for CLIENT-owned steps. */}
      {kind === 'client' && (
        <div className="mb-3 pl-8 grid grid-cols-1 gap-2">
          <LabeledField label="Client email — subject line" hint="The email/notification TITLE the client gets when it's their turn on this step. Blank → “Action needed on your service”.">
            <input
              className={inputCls}
              value={step.clientPromptTitle ?? ''}
              onChange={(e) => onPatch({ clientPromptTitle: e.target.value || undefined })}
              aria-label={`Step ${step.stepNumber} client email subject`}
              placeholder="Action needed on your service"
            />
          </LabeledField>
          <LabeledField label="Client email — message" hint="The email/notification BODY. Blank → an auto-generated line naming the service and step.">
            <textarea
              className={`${inputCls} resize-y`}
              rows={3}
              value={step.clientPromptMessage ?? ''}
              onChange={(e) => onPatch({ clientPromptMessage: e.target.value || undefined })}
              aria-label={`Step ${step.stepNumber} client email message`}
              placeholder="e.g. Dear Client, please review the proposed name & objects and approve or request changes."
            />
          </LabeledField>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">
        <LabeledField label="What kind of step?" hint={KIND_HINT[kind]}>
          <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as StepKind)}>
            {(Object.keys(KIND_LABEL) as StepKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
          </select>
        </LabeledField>

        {/* Story 28.3 (S28d): a payment checkpoint has no assignee — the matter
            waits for the client to pay — so asking "who does this?" invited a
            meaningless choice. Hidden for gates. */}
        {kind !== 'payment' && (
          <LabeledField label="Who does this?" hint="Who owns the step: your team (by role), or the client.">
            <select className={inputCls} value={whoValue} onChange={(e) => {
              const v = e.target.value;
              if (v === 'client') onPatch({ defaultAssigneeUid: '__CLIENT__', assignedRole: undefined });
              else if (v === 'role') onPatch({ defaultAssigneeUid: undefined, assignedRole: step.assignedRole || 'team_member' });
              else onPatch({ defaultAssigneeUid: undefined, assignedRole: undefined });
            }}>
              <option value="team">Our team (anyone)</option>
              <option value="role">Our team (specific role)</option>
              <option value="client">The client</option>
            </select>
          </LabeledField>
        )}

        {/* Story 28.3 (S28c): this was a free-text box asking for a code slug.
            A typo ("team-member") produced a step no role matched, silently.
            Roles come from the role service — never hardcoded strings. */}
        {whoValue === 'role' && (
          <LabeledField label="Which role?" hint="The team role that owns this step.">
            <select
              className={inputCls}
              value={step.assignedRole ?? ''}
              onChange={(e) => onPatch({ assignedRole: e.target.value || undefined })}
            >
              <option value="">— pick a role —</option>
              {STAFF_ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
              {/* Preserve an unrecognised legacy value rather than silently
                  rewriting the definition on open. */}
              {step.assignedRole && !STAFF_ROLES.some((r) => r.key === step.assignedRole) && (
                <option value={step.assignedRole}>{step.assignedRole} (unknown role)</option>
              )}
            </select>
          </LabeledField>
        )}

        <LabeledField label="Stage" hint="Which big-picture stage this step belongs to (for the client tracker).">
          <select className={inputCls} value={step.phaseId ?? ''} onChange={(e) => onPatch({ phaseId: e.target.value || undefined })}>
            <option value="">— none —</option>
            {stages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </LabeledField>

        <LabeledField label="Expected time (days)" hint="How long this step usually takes. Drives due dates and “running late”. Use 0 for same-day.">
          <input className={inputCls} type="number" min={0} value={step.typicalDurationDays ?? ''} onChange={(e) => onPatch({ typicalDurationDays: e.target.value === '' ? undefined : Number(e.target.value) })} />
        </LabeledField>

        <label className="flex items-center gap-2 self-end pb-1.5 cursor-pointer">
          <input type="checkbox" className="h-4 w-4" checked={step.clientVisible !== false} onChange={(e) => onPatch({ clientVisible: e.target.checked })} aria-label="Visible to client" />
          <FieldLabel label="Visible to the client" hint="If on, the client sees this step on their progress view. Turn off for internal-only steps." />
        </label>
      </div>

      {/* What happens next? — payment checkpoints are a gate (special); every other
          kind uses freely-editable OUTCOME ROWS so you can define any number of
          future states to any steps. */}
      {kind === 'payment' ? (
        <WhatHappensNext>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <LabeledField label="Continue when" hint="The payment level required before the workflow may continue.">
              <select className={inputCls} value={step.gate?.requires ?? 'fully_paid'} onChange={(e) => onPatch({ gate: { requires: e.target.value as 'fully_paid' | 'part_paid', onPass: step.gate?.onPass ?? otherStepNum, onWait: step.gate?.onWait ?? step.stepNumber } })}>
                <option value="fully_paid">Fully paid</option>
                <option value="part_paid">Part paid</option>
              </select>
            </LabeledField>
            <StepNumberSelect label="If paid → go to" hint="Where it goes once payment is satisfied."
              value={step.gate?.onPass} steps={allSteps} onChange={(n) => onPatch({ gate: { requires: step.gate?.requires ?? 'fully_paid', onPass: n, onWait: step.gate?.onWait ?? step.stepNumber } })} />
            <StepNumberSelect label="If not paid, wait at" hint="Usually this same step — the matter waits here until paid."
              value={step.gate?.onWait} steps={allSteps} onChange={(n) => onPatch({ gate: { requires: step.gate?.requires ?? 'fully_paid', onPass: step.gate?.onPass ?? otherStepNum, onWait: n } })} />
          </div>
        </WhatHappensNext>
      ) : kind !== 'final' ? (
        <WhatHappensNext>
          <OutcomeRows step={step} allSteps={allSteps} otherStepNum={otherStepNum} onPatch={onPatch} showColors={!!isActive} />
          {kind === 'client' && (
            <div className="mt-2">
              <LabeledField label="Button the client sees" hint="The label on the client’s action button, e.g. “Please Proceed”.">
                <input className={inputCls} value={step.clientActionLabel ?? ''} onChange={(e) => onPatch({ clientActionLabel: e.target.value || undefined })} placeholder="Approve" />
              </LabeledField>
            </div>
          )}
        </WhatHappensNext>
      ) : null}

      {/* Automatic actions */}
      {kind !== 'final' && (
        <div className="mt-3">
          <FieldLabel label="Automatic actions" hint="Things the system does on its own when this step runs." />
          <div className="flex flex-col gap-1.5 mt-1.5">
            {KNOWN_EFFECTS.map((eff) => {
              const on = (step.effects ?? []).includes(eff.id);
              return (
                <label key={eff.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4" checked={on} onChange={(e) => {
                    const set = new Set(step.effects ?? []);
                    if (e.target.checked) set.add(eff.id); else set.delete(eff.id);
                    onPatch({ effects: set.size ? [...set] : undefined });
                  }} />
                  <span className="text-xs text-ink-muted inline-flex items-center gap-1">{eff.label}
                    <FieldLabel label="" hint={eff.hint} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* #81: independent Internal vs Client status & notes. Fully separate —
          editing one never affects the other. */}
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-hairline p-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Internal view</p>
          <LabeledField label="Internal status">
            <input className={`${inputCls} mt-1`} value={step.internalStatus ?? ''} onChange={(e) => onPatch({ internalStatus: e.target.value || undefined })} placeholder="e.g. Drafting" />
          </LabeledField>
          <LabeledField label="Internal notes">
            <textarea className={`${inputCls} resize-y mt-1`} rows={2} value={step.internalNotes ?? ''} onChange={(e) => onPatch({ internalNotes: e.target.value || undefined })} placeholder="Only staff see this." />
          </LabeledField>
        </div>
        <div className="rounded-lg border border-hairline p-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Client view</p>
          <LabeledField label="Client status">
            <input className={`${inputCls} mt-1`} value={step.clientStatus ?? ''} onChange={(e) => onPatch({ clientStatus: e.target.value || undefined })} placeholder="e.g. In progress" />
          </LabeledField>
          <LabeledField label="Client note / description">
            <textarea className={`${inputCls} resize-y mt-1`} rows={2} value={step.clientNote ?? ''} onChange={(e) => onPatch({ clientNote: e.target.value || undefined })} placeholder="Shown to the client." />
          </LabeledField>
        </div>
      </div>

      {/* #82: multiple audience-tagged descriptions. */}
      <div className="mt-3">
        <StepDescriptionsEditor step={step} onPatch={onPatch} />
      </div>

      {/* #134: manage the step's verification checklist (add / edit / remove). */}
      <div className="mt-3">
        <StepChecklistEditor step={step} onPatch={onPatch} />
      </div>

      {/* #117: where the part-payment chase begins. Once THIS step completes, a
          part-paid matter starts showing the blinking balance-due alert (and the
          reminder email effect fires). Set it on e.g. "Name Approval Received". */}
      <label className="mt-3 flex items-start gap-2 text-xs text-ink-muted cursor-pointer">
        <input
          type="checkbox"
          className="h-3.5 w-3.5 mt-0.5"
          checked={(step.effects ?? []).includes('REMIND_PART_PAYMENT')}
          onChange={(e) => {
            const rest = (step.effects ?? []).filter((x) => x !== 'REMIND_PART_PAYMENT');
            const next = e.target.checked ? [...rest, 'REMIND_PART_PAYMENT'] : rest;
            onPatch({ effects: next.length ? next : undefined });
          }}
          aria-label={`Step ${step.stepNumber} starts the part-payment reminder`}
        />
        <span>
          <strong className="text-ink-soft">Chase part payment after this step.</strong>{' '}
          Once this step completes, part-paid matters show the blinking balance-due
          alert until the balance is recorded. Only one step should carry this.
        </span>
      </label>

      {/* Epics 34/35: when this step applies, and when it is due. Placed above
          Advanced because both are ordinary authoring decisions, not raw JSON. */}
      <div className="mt-3 pt-3 border-t border-hairline-soft space-y-2">
        <StepConditionEditor step={step} onPatch={onPatch} />
        <StepDueRuleEditor step={step} onPatch={onPatch} />
      </div>

      {/* Advanced (raw) — power users */}
      <div className="mt-3 pt-2 border-t border-hairline-soft" />
      <button onClick={() => setShowAdvanced((v) => !v)} className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink">
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} /> Advanced (raw)
      </button>
      {showAdvanced && (
        <div className="mt-1 rounded-md bg-surface-card p-2 text-[11px] text-ink-muted font-mono whitespace-pre-wrap break-all">
          {JSON.stringify({ stepNumber: step.stepNumber, type: step.type, transitions: step.transitions, gate: step.gate, effects: step.effects }, null, 2)}
        </div>
      )}
      </>)}

      {/* Quick "insert a step right after this one" — easier than scrolling to the
          bottom "Add step" when building a flow in order. Stays available on a
          collapsed card so you can build a flow without expanding anything. */}
      {onAddAfter && (
        <div className="mt-3 flex justify-center">
          <button onClick={onAddAfter} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add step below
          </button>
        </div>
      )}
    </div>
  );
}
