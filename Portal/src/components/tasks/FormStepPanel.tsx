import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Check } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { getFormStep, saveFormStep, type FormField } from '../../api/tasks';

/**
 * Story 34.3 — the form a step asks.
 *
 * Rendered for whoever is looking: a client fills it in, staff read the answers
 * back. The server decides what each audience receives (internal notes and the
 * profile mapping never reach a client), so this component renders whatever it
 * is given rather than filtering by role itself — one source of truth for that
 * decision, on the server.
 *
 * Submitting does NOT advance the matter. It completes the client's part and
 * tells staff, who review and advance — the 2026-09-06 stance, same as 34.2.
 */

function Field({ field, value, onChange, disabled }: {
  field: FormField;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
  const id = `form-${field.key}`;
  const common = 'w-full rounded-md border border-hairline px-3 py-2 text-sm min-h-11';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">
        {field.label}
        {field.required && <span className="text-red-700 ml-0.5" aria-hidden="true">*</span>}
      </label>
      {field.help && <p className="text-xs text-ink-muted mb-1.5">{field.help}</p>}

      {field.type === 'longtext' ? (
        <textarea id={id} className={common} rows={4} disabled={disabled}
          value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'select' ? (
        <select id={id} className={common} disabled={disabled}
          value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {(field.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : field.type === 'yesno' ? (
        <select id={id} className={common} disabled={disabled}
          value={value === true ? 'yes' : value === false ? 'no' : ''}
          onChange={(e) => onChange(e.target.value === 'yes')}>
          <option value="">Choose…</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      ) : (
        <input
          id={id}
          className={common}
          disabled={disabled}
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {/* Staff-only guidance. Present only because the SERVER chose to send it. */}
      {field.internalNote && (
        <p className="text-xs text-ink-muted mt-1 italic">Internal: {field.internalNote}</p>
      )}
    </div>
  );
}

export default function FormStepPanel({ taskId, stepNumber, canFill }: {
  taskId: string;
  stepNumber: number;
  canFill: boolean;
}) {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['form-step', taskId, stepNumber],
    queryFn: () => getFormStep(taskId, stepNumber),
  });

  const [edits, setEdits] = useState<Record<string, unknown> | null>(null);
  const answers = edits ?? data?.answers ?? {};

  const save = useMutation({
    mutationFn: (submit: boolean) => saveFormStep(taskId, stepNumber, answers, submit),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['form-step', taskId, stepNumber] });
      qc.invalidateQueries({ queryKey: ['task', taskId] });
      setEdits(null);
      toast.success(res.status === 'submitted' ? 'Answers submitted' : 'Saved — you can finish later');
    },
    onError: (e: Error) => toast.error(e.message || 'Could not save your answers'),
  });

  if (isLoading) return <p className="text-sm text-ink-muted">Loading questions…</p>;
  if (isError || !data) return null;

  const submitted = data.status === 'submitted';
  const disabled = !canFill || save.isPending;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start gap-2">
        <ClipboardList className="w-4 h-4 text-ink-muted mt-0.5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{data.form.title ?? 'Questions'}</p>
          {data.form.description && (
            <p className="text-sm text-ink-muted mt-0.5">{data.form.description}</p>
          )}
        </div>
      </div>

      {submitted && (
        <div className="alert-success flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            Submitted. {canFill ? 'You can update your answers if something has changed.' : ''}
          </span>
        </div>
      )}

      <div className="space-y-4">
        {data.form.fields.map((f) => (
          <Field
            key={f.key}
            field={f}
            value={answers[f.key]}
            disabled={disabled}
            onChange={(v) => setEdits({ ...answers, [f.key]: v })}
          />
        ))}
      </div>

      {canFill && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary min-h-11"
            disabled={save.isPending}
            onClick={() => save.mutate(true)}
          >
            {save.isPending ? 'Saving…' : submitted ? 'Update answers' : 'Submit answers'}
          </button>
          <button
            type="button"
            className="rounded-md border border-hairline px-3 py-2 text-sm min-h-11 bg-white"
            disabled={save.isPending}
            onClick={() => save.mutate(false)}
          >
            Save and finish later
          </button>
        </div>
      )}
    </div>
  );
}
