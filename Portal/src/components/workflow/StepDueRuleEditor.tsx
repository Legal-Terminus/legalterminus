import { useQuery } from '@tanstack/react-query';
import { CalendarClock } from 'lucide-react';
import { describeDueRule } from '../../../../shared/workflows/dueRules.js';
import { getStatutoryCalendar } from '../../api/settings';
import type { WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * Story 35.1 — authoring a step's deadline.
 *
 * A step's due date is either a DURATION from when it starts (the default,
 * unchanged) or a rule anchored to a real date. The two are mutually exclusive
 * and rendered that way, because showing both would state two different
 * deadlines for one step.
 *
 * Negative offsets are the point: "client sign-off 5 days BEFORE filing" is
 * what a compliance practice works to, and no accounting tool observed offers
 * it. The control says "before" and "after" rather than asking an author to
 * type a minus sign.
 */

type DueRule = NonNullable<WorkflowStepDef['dueRule']>;

const ANCHOR_LABEL: Record<string, string> = {
  matter_start: 'the matter starts',
  step_start: 'this step starts',
  anchor_date: "the matter's key date",
  statutory: 'a statutory date',
};

export default function StepDueRuleEditor({ step, onPatch }: {
  step: WorkflowStepDef;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
}) {
  const rule = step.dueRule ?? null;

  // The statutory keys this workspace actually has, so an author picks a real
  // filing rather than typing a key that resolves to nothing.
  const { data: calendar } = useQuery({
    queryKey: ['statutory-calendar', null],
    queryFn: () => getStatutoryCalendar(),
    staleTime: 300_000,
    enabled: rule?.anchor === 'statutory',
  });

  const patchRule = (next: Partial<DueRule>) => {
    onPatch({ dueRule: { ...(rule as DueRule), ...next } as DueRule });
  };

  if (!rule) {
    return (
      <button
        type="button"
        onClick={() => onPatch({ dueRule: { anchor: 'anchor_date', offsetDays: 0 } })}
        className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:underline min-h-11"
      >
        <CalendarClock className="w-3.5 h-3.5" aria-hidden="true" />
        Set a deadline from a real date…
      </button>
    );
  }

  const offset = rule.offsetDays ?? 0;
  const direction = offset < 0 ? 'before' : 'after';
  const magnitude = Math.abs(offset);

  return (
    <div className="rounded-lg border border-hairline p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Deadline</p>
        <button
          type="button"
          onClick={() => onPatch({ dueRule: undefined })}
          className="text-xs text-ink-muted hover:text-red-700 min-h-11"
        >
          Use the usual estimate
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min={0}
          max={365}
          aria-label={`Step ${step.stepNumber} deadline offset days`}
          className="w-20 rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
          value={magnitude}
          onChange={(e) => {
            const n = Math.abs(Number(e.target.value) || 0);
            patchRule({ offsetDays: direction === 'before' ? -n : n });
          }}
        />
        <span className="text-sm text-ink-muted">days</span>

        {/* "before"/"after" rather than a minus sign — backward scheduling is
            the feature, and it should read like the thing an author means. */}
        <select
          aria-label={`Step ${step.stepNumber} deadline direction`}
          className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
          value={direction}
          onChange={(e) => patchRule({ offsetDays: e.target.value === 'before' ? -magnitude : magnitude })}
        >
          <option value="after">after</option>
          <option value="before">before</option>
        </select>

        <select
          aria-label={`Step ${step.stepNumber} deadline anchor`}
          className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
          value={rule.anchor}
          onChange={(e) => patchRule({ anchor: e.target.value as DueRule['anchor'] })}
        >
          {Object.entries(ANCHOR_LABEL).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>

        {rule.anchor === 'statutory' && (
          <select
            aria-label={`Step ${step.stepNumber} statutory date`}
            className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
            value={rule.statutoryKey ?? ''}
            onChange={(e) => patchRule({ statutoryKey: e.target.value })}
          >
            <option value="">Choose a filing…</option>
            {(calendar?.rows ?? []).map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        )}
      </div>

      <p className="text-xs text-ink-muted">
        {describeDueRule(rule) ?? ''}
        {rule.anchor === 'anchor_date' && (
          <> · Matters using this service will ask for that date when they are created.</>
        )}
        {rule.anchor === 'statutory' && !rule.statutoryKey && (
          <> · Choose a filing, or this step falls back to its usual estimate.</>
        )}
      </p>
    </div>
  );
}
