import { CheckCircle2, FileText } from 'lucide-react';
import {
  deriveOwnerType,
  phaseProgress,
  type WorkflowDefinition,
  type WorkflowStepDef,
  type OwnerType,
} from '../../api/workflowDefinitions';
import type { Task } from '../../types/task';

/**
 * Journey tracker — the "live train line" view of a task's progress. Collapses the
 * flat 41-step list into ~6 client-facing phase "stations" (a horizontal rail with
 * a you-are-here pulse), a single "next stop" hero card for the current step, and a
 * lightweight "who's driving" strip (client / team / registrar). All data-driven
 * from the workflow definition's `phases` + per-step `phaseId` — no hardcoding.
 *
 * Mobile-first: the rail scrolls horizontally, the owner strip is a 3-col grid.
 * Shown above the detailed step list on the Steps tab; the list stays the source
 * of truth for per-step actions.
 */

const OWNER_META: Record<OwnerType, { label: string; dot: string; clientLabel: string }> = {
  team:   { label: 'Our team', clientLabel: 'Our team', dot: 'bg-blue-500' },
  client: { label: 'Client',   clientLabel: 'You',      dot: 'bg-brand-600' },
  govt:   { label: 'Registrar', clientLabel: 'Registrar', dot: 'bg-purple-500' },
};

export default function TaskJourneyTracker({
  task,
  definition,
  currentDef,
  completed,
  isClient,
}: {
  task: Task;
  definition: WorkflowDefinition;
  currentDef?: WorkflowStepDef;
  completed: boolean;
  isClient: boolean;
}) {
  const phases = definition.phases ?? [];
  // No phases configured on this workflow → render nothing; the step list still shows.
  if (phases.length === 0) return null;

  // Runtime per-step status (from task.steps) drives both the phase rail and the
  // remaining-steps counts. Built once and shared.
  const stepStatuses = new Map((task.steps ?? []).map((s) => [s.stepNumber, s.status]));

  const { phases: stations, activeIndex, total } = phaseProgress(
    definition,
    task.currentStepNumber,
    stepStatuses,
  );
  const currentOwner = currentDef ? deriveOwnerType(currentDef) : 'team';
  const ownerCopy = (o: OwnerType) => (isClient ? OWNER_META[o].clientLabel : OWNER_META[o].label);

  // "Who's driving" counts the REMAINING (not-yet-completed) steps per owner, so
  // the strip shrinks as work is done. Runtime status comes from task.steps;
  // owner is derived from the matching definition step. Falls back to the static
  // definition when a task has no per-step status yet (freshly created task).
  const defByNumber = new Map(definition.steps.map((s) => [s.stepNumber, s]));
  const counts: Record<OwnerType, number> = { team: 0, client: 0, govt: 0 };
  const runtimeSteps = task.steps ?? [];
  if (runtimeSteps.length > 0) {
    for (const rs of runtimeSteps) {
      if (rs.status === 'completed' || rs.status === 'skipped') continue;
      const def = defByNumber.get(rs.stepNumber);
      if (!def || def.type === 'final') continue;
      counts[deriveOwnerType(def)]++;
    }
  } else {
    for (const s of definition.steps) {
      if (s.type === 'final') continue;
      counts[deriveOwnerType(s)]++;
    }
  }

  const stageLabel = completed
    ? `All ${total} stages complete`
    : activeIndex >= 0
      ? `Stage ${activeIndex + 1} of ${total}`
      : `${total} stages`;

  return (
    <div className="mb-5 space-y-4">
      {/* Smart progress label (replaces "41 of 41") */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-brand-700">{stageLabel}</span>
        {activeIndex >= 0 && !completed && (
          <>
            <span className="text-ink-faint">·</span>
            <span className="text-ink-muted">{stations[activeIndex]?.name}</span>
          </>
        )}
      </div>

      {/* ── Phase rail (the train line) ── */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-start gap-1.5 overflow-x-auto pb-1">
          {stations.map((p, i) => (
            <Station key={p.id} name={p.name} status={p.status} index={i} isLast={i === stations.length - 1} />
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-ink-faint mt-3">
          <Legend dot="bg-emerald-500" label="Done" />
          <Legend dot="bg-brand-600" label="Now" />
          <Legend dot="bg-hairline" label="Upcoming" />
        </div>
      </div>

      {/* ── Next-stop hero card (current step) ── */}
      {!completed && currentDef && (
        <div className="card p-4 sm:p-5 relative overflow-hidden">
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600" />
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 animate-pulse-ring">
              <FileText className="w-[18px] h-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                  Happening now · Step {currentDef.stepNumber}
                </p>
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${ownerBadgeCls(currentOwner)}`}>
                  Waiting on {ownerCopy(currentOwner).toLowerCase()}
                </span>
              </div>
              <p className="text-base font-semibold text-ink mt-0.5">{currentDef.title}</p>
              {currentDef.description && (
                <p className="text-sm text-ink-muted mt-0.5">{currentDef.description}</p>
              )}
              {currentDef.typicalDurationDays != null && (
                <p className="text-xs text-ink-faint mt-2">
                  Typically takes {currentDef.typicalDurationDays} day
                  {currentDef.typicalDurationDays === 1 ? '' : 's'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {completed && (
        <div className="card p-4 flex items-center gap-2.5 bg-emerald-50 border-emerald-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <p className="text-sm text-emerald-700 font-medium">This service is complete.</p>
        </div>
      )}

      {/* ── "Who's driving" strip (steps remaining per owner) ── */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint mb-1.5">Steps remaining</p>
        <div className="grid grid-cols-3 gap-2">
          {(['team', 'client', 'govt'] as OwnerType[]).map((o) => {
            const isActive = !completed && o === currentOwner;
            return (
              <div
                key={o}
                className={`card p-3 text-center ${isActive ? 'border-brand-600 ring-1 ring-brand-600/20' : ''}`}
              >
                <p className={`text-lg font-bold leading-none ${isActive ? 'text-brand-700' : 'text-ink'}`}>
                  {counts[o]}
                </p>
                <p className="text-[11px] text-ink-muted mt-1 flex items-center justify-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${OWNER_META[o].dot}`} />
                  {ownerCopy(o)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── pieces ─────────────────────────────────────────────────────────────────── */

type StationStatus = 'done' | 'now' | 'upcoming';

function Station({
  name, status, index, isLast,
}: { name: string; status: StationStatus; index: number; isLast: boolean }) {
  return (
    <>
      <div className="flex flex-col items-center shrink-0 w-16">
        {status === 'done' ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </span>
        ) : status === 'now' ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 ring-4 ring-brand-50 text-white text-xs font-bold animate-pulse-ring">
            ●
          </span>
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-hairline text-ink-faint text-xs font-semibold">
            {index + 1}
          </span>
        )}
        <span
          className={`text-[10px] leading-tight text-center mt-1.5 ${
            status === 'upcoming' ? 'text-ink-faint' : 'text-ink-soft font-medium'
          }`}
        >
          {name}
        </span>
      </div>
      {!isLast && (
        <span
          className={`h-0.5 w-5 shrink-0 mt-3.5 rounded-full ${
            status === 'done'
              ? 'bg-emerald-500'
              : status === 'now'
                ? 'bg-[length:2px_8px] bg-gradient-to-b from-brand-600 from-50% to-transparent to-50% animate-flow-dash'
                : 'bg-hairline'
          }`}
        />
      )}
    </>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function ownerBadgeCls(owner: OwnerType): string {
  if (owner === 'client') return 'bg-amber-50 text-amber-700';
  if (owner === 'govt') return 'bg-purple-50 text-purple-700';
  return 'bg-blue-50 text-blue-700';
}
