import { useEffect, useRef, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import CollapsibleSection from '../common/CollapsibleSection';
import StepCard from './StepCard';
import { inputCls } from './stepEditorVocab';
import type { PhaseDef, WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * Story 24.4 — the Steps section: a reorderable list of {@link StepCard}s plus
 * add/insert/remove, extracted from `pages/workflow/WorkflowEditorPage.tsx`.
 *
 * Value + onChange only. The mutators below are the SAME ones the workspace page
 * used to hold inline (addStep / insertStepAfter / removeStep / moveStep /
 * patchStep) — they operate purely on the steps array handed in.
 */

/** Highest stepNumber + 1 — new steps never reuse a number. */
const nextNumber = (steps: WorkflowStepDef[]) => steps.reduce((m, s) => Math.max(m, s.stepNumber), 0) + 1;

/** stepNumber → that step's card element, so a caller can scroll it into view. */
export type StepCardRegistry = Record<number, HTMLDivElement | null>;

export default function StepListEditor({
  steps, stages, activeStepNumber, onActivate, onLocate, onChange, errorsByStep, sectionId = 'steps', cardRegistry,
}: {
  steps: WorkflowStepDef[];
  stages: PhaseDef[];
  /** The step highlighted in the live preview (colour only). */
  activeStepNumber?: number | null;
  onActivate?: (stepNumber: number) => void;
  /** Omit to hide the "locate in chart" button (no preview on this surface). */
  onLocate?: (stepNumber: number) => void;
  onChange: (steps: WorkflowStepDef[]) => void;
  /** Story 24.4 (AC4): stepNumber → validation messages for that step. */
  errorsByStep?: Record<number, string[]>;
  sectionId?: string;
  /** Optional caller-owned registry of step-card elements (see the type above). */
  cardRegistry?: StepCardRegistry;
}) {
  // Refs to each step card so clicking a node in the preview can scroll its editor
  // into view (reverse of "locate in chart"). When the page supplies `cardRegistry`
  // it owns the record and can reveal a card itself; otherwise we keep a local one.
  const localRefs = useRef<StepCardRegistry>({});
  const cardRefs = cardRegistry ?? localRefs.current;

  /**
   * Story 28.1 (S28a) — accordion + filter.
   *
   * One expanded step at a time. A new/inserted step opens automatically (you
   * just asked for it), and any step carrying a validation error is force-opened
   * so "Fix this step" is never hidden behind a collapsed summary.
   */
  // Opens on the FIRST step rather than all-collapsed. Ambyflow starts closed,
  // but this editor replaced one that showed every step expanded — landing on a
  // wall of collapsed summaries reads as an empty page, and a workflow's first
  // step is what an author looks at anyway. The accordion is unchanged: opening
  // another still closes this one.
  const [expandedStep, setExpandedStep] = useState<number | null>(
    () => steps[0]?.stepNumber ?? null,
  );
  const [filter, setFilter] = useState('');

  // Open a newly added step. Steps never reuse a number, so a max that grew
  // means an append/insert just happened.
  const maxNumber = steps.reduce((m, s) => Math.max(m, s.stepNumber), 0);
  const prevMax = useRef(maxNumber);
  useEffect(() => {
    if (maxNumber > prevMax.current) setExpandedStep(maxNumber);
    prevMax.current = maxNumber;
  }, [maxNumber]);

  const q = filter.trim().toLowerCase();
  const visible = q
    ? steps.filter((s) => `${s.stepNumber} ${s.title ?? ''}`.toLowerCase().includes(q))
    : steps;

  const patchStep = (stepNumber: number, next: Partial<WorkflowStepDef>) =>
    onChange(steps.map((s) => (s.stepNumber === stepNumber ? { ...s, ...next } : s)));

  const addStep = () => {
    const nextNum = nextNumber(steps);
    const step: WorkflowStepDef = { stepNumber: nextNum, title: `Step ${nextNum}`, type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: nextNum }] };
    onChange([...steps, step]);
  };

  // Insert a new step right AFTER `index` (the "add next step" button on a card),
  // and point it at the step the inserted-after one currently leads to.
  const insertStepAfter = (index: number) => {
    const newNum = nextNumber(steps);
    const after = steps[index];
    const leadsTo = after?.transitions?.find((t) => t.event === 'COMPLETE_STEP')?.to
      ?? steps[index + 1]?.stepNumber ?? newNum;
    const step: WorkflowStepDef = { stepNumber: newNum, title: 'New step', type: 'step', clientVisible: true, transitions: [{ event: 'COMPLETE_STEP', to: leadsTo }] };
    const next = [...steps];
    next.splice(index + 1, 0, step);
    onChange(next);
  };

  const removeStep = (stepNumber: number) => onChange(steps.filter((s) => s.stepNumber !== stepNumber));

  const moveStep = (index: number, dir: -1 | 1) => {
    const next = [...steps];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  };

  return (
    <CollapsibleSection id={sectionId} title={`Steps (${steps.length})`}>
      {/* Story 28.1: with 40 steps, finding one meant scrolling the whole form. */}
      {steps.length > 6 && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search aria-hidden="true" className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={`Find a step by name or number (${steps.length} steps)…`}
              aria-label="Find a step"
              className={`${inputCls} pl-8`}
            />
          </div>
          {expandedStep !== null && (
            <button type="button" onClick={() => setExpandedStep(null)} className="btn-secondary !px-3 !py-1.5 text-xs shrink-0">
              Collapse all
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-xs text-ink-muted py-2">No step matches “{filter.trim()}”.</p>
        )}
        {visible.map((s) => {
          // Index in the FULL list — move/insert operate on real positions, not
          // filtered ones, or reordering while filtered would corrupt the flow.
          const i = steps.indexOf(s);
          const stepErrors = errorsByStep?.[s.stepNumber];
          return (
            <StepCard
              key={s.stepNumber}
              step={s}
              index={i}
              total={steps.length}
              stages={stages}
              allSteps={steps}
              cardRef={(el) => { cardRefs[s.stepNumber] = el; }}
              isActive={activeStepNumber === s.stepNumber}
              errors={stepErrors}
              // A step with a problem is always open: a collapsed summary must
              // never hide the reason a save was refused.
              expanded={expandedStep === s.stepNumber || Boolean(stepErrors?.length)}
              onToggleExpanded={() => setExpandedStep((cur) => (cur === s.stepNumber ? null : s.stepNumber))}
              onActivate={onActivate ? () => onActivate(s.stepNumber) : undefined}
              onLocate={onLocate ? () => onLocate(s.stepNumber) : undefined}
              onAddAfter={() => insertStepAfter(i)}
              onPatch={(next) => patchStep(s.stepNumber, next)}
              onRemove={() => removeStep(s.stepNumber)}
              onMove={(dir) => moveStep(i, dir)}
            />
          );
        })}
      </div>
      {/* Add step lives at the BOTTOM — you append the next step after the list. */}
      <div className="flex justify-end mt-3">
        <button onClick={addStep} className="btn-secondary inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add step
        </button>
      </div>
    </CollapsibleSection>
  );
}
