import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronsRight, Maximize2, X } from 'lucide-react';
import type { AnyStateMachine } from 'xstate';
import { clientTouchpointCount } from './StepAutomationSummary';
import type { WorkflowStepDef } from '../../api/workflowDefinitions';
import FieldLabel from '../common/FieldLabel';
import WorkflowDiagram from './WorkflowDiagram';
import { useRail } from '../../hooks/useResizablePanels';

/**
 * Story 24.4 — the drag-resizable, collapsible live-preview rail extracted from
 * `pages/workflow/WorkflowEditorPage.tsx` (#68). Takes an already-compiled
 * machine; it never compiles, fetches or saves anything itself.
 *
 * Mobile: below `xl` the rail stacks full-width and skips the drag handle; the
 * collapsed state is desktop-only, so a phone always sees the diagram.
 */
export default function WorkflowPreviewRail({
  machine, storageKey, highlightStepNumber, centerToken, onStepClick, displayNumbers, emptyMessage, steps,
}: {
  /** The compiled machine, or null when the definition is invalid. */
  machine: AnyStateMachine | null;
  /** localStorage key for the persisted width/collapsed state. */
  storageKey: string;
  highlightStepNumber?: number | null;
  centerToken?: { step: number; nonce: number } | null;
  onStepClick?: (stepNumber: number) => void;
  displayNumbers?: Record<number, number>;
  emptyMessage?: string;
  /** Story 31.4: the working steps, so the rail can count client touchpoints. */
  steps?: WorkflowStepDef[];
}) {
  const touchpoints = clientTouchpointCount(steps ?? []);
  const preview = useRail(storageKey, { initial: 320, min: 260, max: 900 });
  /**
   * True fullscreen for the diagram. React Flow's own Controls only offer
   * fit/zoom inside the rail, which is far too small to read a 40-step flow —
   * the rail is ~320px wide by design so the EDITOR leads. Escape closes.
   */
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);

  if (preview.collapsed) {
    return (
      <div className="hidden xl:flex xl:sticky xl:top-4 self-start">
        <button
          onClick={preview.toggle}
          className="card p-2 w-11 flex flex-col items-center gap-2 py-2 text-sm font-semibold text-ink hover:text-brand-600"
          title="Show live preview"
        >
          <ChevronsRight className="w-4 h-4 rotate-180 shrink-0" />
          <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap tracking-wide">Live preview</span>
        </button>
      </div>
    );
  }

  return (
    <div className="xl:sticky xl:top-4 self-start flex">
      {/* Drag handle (desktop only) — grabs the left edge to resize.
          The HIT AREA is 16px wide (the outer div); only a 2px bar inside is
          painted, with a grip that appears on hover. It used to be a 6px
          invisible strip that tinted on hover — reported as "hard to do" on
          the library editor, but it was the same strip in both editors: the
          target was simply too small to land on and gave no cue it existed. */}
      <div
        onPointerDown={preview.startDrag('right')}
        className="group hidden xl:flex w-4 mr-1 shrink-0 cursor-col-resize items-center justify-center self-stretch"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize live preview"
        title="Drag to resize"
      >
        <div className="h-full w-0.5 rounded bg-hairline group-hover:bg-brand-400 group-active:bg-brand-500 transition-colors relative">
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-1.5 rounded-full bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      {/* Fixed width applies at xl+ only; below that the CSS var is ignored
          and the section is full-width via w-full. */}
      <section
        className="card p-4 w-full xl:w-[var(--rail-w)]"
        style={{ ['--rail-w' as string]: `${preview.width}px` }}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
            Live preview
            <FieldLabel label="" hint="A diagram of the workflow as you’re building it. Boxes are steps; arrows are where it goes next." />
            {/* Story 31.4 (AC4): how much this workflow talks to the client, at
                a glance — an author should see the client's experience without
                opening every step. */}
            {touchpoints > 0 && (
              <span className="badge bg-amber-50 text-amber-800 font-normal" title="Steps that email the client or ask them for documents">
                {touchpoints} client touchpoint{touchpoints === 1 ? '' : 's'}
              </span>
            )}
          </span>
          <span className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(true)}
              disabled={!machine}
              className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-brand-600 disabled:opacity-40"
              title="Open the diagram full screen"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Full screen
            </button>
            <button
              onClick={preview.toggle}
              className="hidden xl:inline-flex items-center gap-1 text-xs text-ink-muted hover:text-brand-600"
              title="Collapse"
            >
              Hide <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
        <div className="mt-3">
          {machine ? (
            <div className="h-[520px] rounded-md border border-gray-100 overflow-hidden">
              <WorkflowDiagram
                machine={machine}
                highlightStepNumber={highlightStepNumber}
                centerToken={centerToken}
                onStepClick={onStepClick}
                displayNumbers={displayNumbers}
              />
            </div>
          ) : (
            <p className="text-xs text-ink-muted p-4">{emptyMessage ?? 'Fix the items above to see the updated diagram.'}</p>
          )}
        </div>
      </section>

      {/* Full-screen diagram. Portalled to <body>: the rail is `sticky` inside a
          grid column, so an overlay rendered here would be trapped by that
          stacking context and clipped to the rail's width. */}
      {expanded && machine && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Workflow diagram, full screen"
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-hairline shrink-0">
            <span className="text-sm font-semibold text-ink">Workflow diagram</span>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Close full screen"
              className="inline-flex items-center gap-1.5 btn-secondary !px-3 !py-1.5 text-xs"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <WorkflowDiagram
              machine={machine}
              highlightStepNumber={highlightStepNumber}
              centerToken={centerToken}
              onStepClick={onStepClick}
              displayNumbers={displayNumbers}
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
