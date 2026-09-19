import { useQuery } from '@tanstack/react-query';
import { GitBranch } from 'lucide-react';
import { getClientTags } from '../../api/clients';
import {
  CONDITION_FIELDS, OPERATORS_BY_KIND, describeSkipReason,
} from '../../../../shared/workflows/conditions.js';
import { ENTITY_TYPE_OPTIONS } from '../../lib/entityTypes';
import type { WorkflowStepDef } from '../../api/workflowDefinitions';

/**
 * Story 34.2 — authoring a step condition.
 *
 * The field list and the operators valid for each come from the SHARED
 * catalog, so the editor cannot offer a combination the server refuses:
 * `hasGst contains "x"` is nonsense, and letting an author save it produces a
 * condition that silently never matches.
 *
 * The sentence under the controls is the same `describeSkipReason` the matter
 * view shows staff when it offers the skip — an author sees exactly the words
 * their colleague will read.
 */

type Condition = NonNullable<WorkflowStepDef['condition']>;

/** Human labels for the operators, per field kind. */
const OP_LABEL: Record<string, string> = {
  is_true: 'is true',
  is_false: 'is not true',
  equals: 'is',
  not_equals: 'is not',
  in: 'is one of',
  contains: 'includes',
  not_contains: 'does not include',
};

const VALUELESS = new Set(['is_true', 'is_false']);

export default function StepConditionEditor({ step, onPatch }: {
  step: WorkflowStepDef;
  onPatch: (next: Partial<WorkflowStepDef>) => void;
}) {
  const condition = step.condition ?? null;

  // Fetched here rather than threaded down through StepListEditor: only this
  // component needs it, and only when a tag condition is actually being
  // authored — so the request costs nothing on every other step.
  const { data: tags } = useQuery({
    queryKey: ['client-tags'],
    queryFn: getClientTags,
    staleTime: 300_000,
    enabled: condition?.field === 'tags',
  });
  const tagOptions = tags?.all ?? [];
  const fieldDef = condition ? (CONDITION_FIELDS as Record<string, { kind: string; label: string }>)[condition.field] : null;
  const kind = fieldDef?.kind ?? null;
  const operators: string[] = kind ? (OPERATORS_BY_KIND as Record<string, string[]>)[kind] ?? [] : [];

  const setField = (field: string) => {
    const def = (CONDITION_FIELDS as Record<string, { kind: string }>)[field];
    // Changing the field almost always invalidates the operator, so reset to
    // the first one that fits rather than leaving an impossible pair on screen.
    const firstOp = (OPERATORS_BY_KIND as Record<string, string[]>)[def.kind]?.[0];
    onPatch({ condition: { field, op: firstOp } as Condition });
  };

  const setOp = (op: string) => {
    const next: Condition = { ...(condition as Condition), op } as Condition;
    // A valueless operator must not carry a stale value into the payload.
    if (VALUELESS.has(op)) delete (next as { value?: unknown }).value;
    onPatch({ condition: next });
  };

  const setValue = (value: string | string[]) => {
    onPatch({ condition: { ...(condition as Condition), value } as Condition });
  };

  if (!condition) {
    return (
      <button
        type="button"
        onClick={() => setField('hasGst')}
        className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:underline min-h-11"
      >
        <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
        Only run this step for some clients…
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-hairline p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Only run this step when
        </p>
        <button
          type="button"
          onClick={() => onPatch({ condition: undefined })}
          className="text-xs text-ink-muted hover:text-red-700 min-h-11"
        >
          Always run it
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          aria-label={`Step ${step.stepNumber} condition field`}
          className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
          value={condition.field}
          onChange={(e) => setField(e.target.value)}
        >
          {Object.entries(CONDITION_FIELDS as Record<string, { label: string }>).map(([key, def]) => (
            <option key={key} value={key}>{def.label}</option>
          ))}
        </select>

        <select
          aria-label={`Step ${step.stepNumber} condition operator`}
          className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
          value={condition.op}
          onChange={(e) => setOp(e.target.value)}
        >
          {operators.map((op) => <option key={op} value={op}>{OP_LABEL[op] ?? op}</option>)}
        </select>

        {/* Only shown when the operator takes one — "is true" needs no value. */}
        {!VALUELESS.has(condition.op) && (
          kind === 'enum' ? (
            <select
              aria-label={`Step ${step.stepNumber} condition value`}
              className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
              value={typeof condition.value === 'string' ? condition.value : ''}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">Choose…</option>
              {ENTITY_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : kind === 'set' && tagOptions.length > 0 ? (
            <select
              aria-label={`Step ${step.stepNumber} condition value`}
              className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
              value={typeof condition.value === 'string' ? condition.value : ''}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">Choose a tag…</option>
              {tagOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          ) : (
            <input
              type="text"
              aria-label={`Step ${step.stepNumber} condition value`}
              className="rounded-md border border-hairline px-2 py-1.5 text-sm min-h-11"
              value={typeof condition.value === 'string' ? condition.value : ''}
              onChange={(e) => setValue(e.target.value)}
              placeholder="value"
            />
          )
        )}
      </div>

      {/* The exact sentence a colleague sees on the matter when the step is
          skipped, so an author is never surprised by the wording. */}
      <p className="text-xs text-ink-muted">
        {describeSkipReason(condition) ?? ''} Otherwise your team is offered a skip — the
        step is never skipped automatically.
      </p>
    </div>
  );
}
