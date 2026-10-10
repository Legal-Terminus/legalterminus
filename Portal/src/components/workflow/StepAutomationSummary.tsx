import type { WorkflowStepDef } from '../../api/workflowDefinitions';
import { automationRows, type AutomationRow } from './automationRows';

/**
 * Story 31.4 — what a step does on its own, said in plain language.
 *
 * The automation was always there — `effects`, client prompts, doc requests,
 * payment gates — but buried in collapsed sub-editors, so an author (or a
 * prospect watching a demo) could not see that the product does any of it. This
 * component is the one place that turns those fields into sentences.
 *
 * **Additive** (Epic 31): it READS step fields and renders. It changes no
 * schema, no engine behaviour, and no existing editor control.
 *
 * Copy is written for a CA, not an engineer: "Emails the client", never
 * "dispatches SEND_EMAIL effect". Vocabulary follows the house table — a step
 * inside a matter is a Task to users, but inside the workflow EDITOR the author
 * is building steps, so "step" is correct here.
 */

/**
 * Renders the rows. A step with no automation renders NOTHING — an empty
 * "no automations" panel on every plain step would be noise on a 40-step
 * workflow, and the audit's lesson (S8) is that the normal state stays quiet.
 */
export default function StepAutomationSummary({ step, stepTitleFor, onEdit, className = '' }: {
  step: WorkflowStepDef;
  stepTitleFor?: (n: number) => string;
  /** Opens the sub-editor for that field group (AC2). Omit for read-only use. */
  onEdit?: (field: AutomationRow['field']) => void;
  className?: string;
}) {
  const rows = automationRows(step, stepTitleFor);
  if (rows.length === 0) return null;

  return (
    <ul className={`flex flex-col gap-1 ${className}`}>
      {rows.map((r) => {
        const body = (
          <>
            <r.icon className="w-3.5 h-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
            <span className="min-w-0 truncate">{r.text}</span>
          </>
        );
        return (
          <li key={r.key}>
            {onEdit ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEdit(r.field); }}
                className="w-full inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink text-left rounded-sm px-1 -mx-1 py-0.5 hover:bg-surface-soft"
              >
                {body}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">{body}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
