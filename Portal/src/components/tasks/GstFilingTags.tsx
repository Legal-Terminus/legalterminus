import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, CalendarCheck, CalendarPlus, Pencil } from 'lucide-react';
import { saveFilingDate } from '../../api/tasks';
import { useToast } from '../common/toastContext';
import type { GstFiling } from '../../types/task';

/**
 * #292 / #294 — the GST return tags. The period is worked out by the server
 * (the GST Return Filing sheet's rules); the filing date is the one staff SAVE
 * on the GSTR-1 / GSTR-3B filing task (#294, firm 17 Nov) — completing the task
 * never sets it. Neutral and success badges: the period is an identifier, a
 * filed return is done.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

type Bounds = { min: string | null; max: string };

/** '2026-11-11' → '11 November 2026'. Read as a calendar date, never through a time zone. */
function longFilingDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** #292: "September 2026" (or "Q2 2026-27") on a GST return matter. */
export function FilingPeriodTag({ label }: { label?: string | null }) {
  if (!label) return null;
  // #219 (16 Nov): a quarterly matter's tag is a quarter ("Q2 2026-27"), and says so.
  const what = /^Q[1-4] /.test(label) ? 'Filing quarter' : 'Filing month';
  return (
    <span className="badge-gray shrink-0" title={what} data-testid="gst-filing-period">
      <CalendarDays className="w-3 h-3" aria-hidden="true" />
      <span className="sr-only">{what}: </span>{label}
    </span>
  );
}

/**
 * #294: "Filed on: 11 November 2026" next to a GSTR-1 / GSTR-3B filing task
 * whose date has been saved; with `form`, "GSTR-1 filed on: …" for the header.
 */
export function FiledOnTag({ date, form }: { date?: string | null; form?: string }) {
  if (!date) return null;
  return (
    <span className="badge-green shrink-0" data-testid="gst-filed-on">
      <CalendarCheck className="w-3 h-3" aria-hidden="true" />
      {form ? `${form} filed on` : 'Filed on'}: {longFilingDate(date)}
    </span>
  );
}

/**
 * #294: one filing task's date, with the staff control beside it — "Add
 * Filing Date" while none is saved, a pencil to change it once it is. Clients
 * (`canEdit` false) see only a saved date. Used in the matter's header and
 * beside the current task.
 */
export function FilingDateControl({ taskId, filing, bounds, canEdit = false }: {
  taskId: string;
  filing: GstFiling;
  bounds?: Bounds;
  canEdit?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  if (!filing.date && !canEdit) return null;
  return (
    <>
      <span className="inline-flex items-center gap-0.5 shrink-0">
        {filing.date ? <FiledOnTag form={filing.form} date={filing.date} /> : null}
        {canEdit && !editing && (filing.date ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Change ${filing.form} filing date`}
            title={`Change ${filing.form} filing date`}
            className="inline-flex items-center justify-center w-11 h-11 sm:w-7 sm:h-7 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-soft"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Add ${filing.form} filing date`}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-hairline px-2.5 text-xs font-medium text-ink-soft hover:bg-surface-soft min-h-11 sm:min-h-7"
          >
            <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
            Add Filing Date <span className="sr-only">for {filing.form}</span>
          </button>
        ))}
      </span>
      {editing && <FilingDateEditor taskId={taskId} filing={filing} bounds={bounds} onDone={() => setEditing(false)} />}
    </>
  );
}

/**
 * The matter header's GST tags: Filing Month, then each filing task the matter
 * has reached — its saved date, or (staff) "Add Filing Date".
 */
export function GstMatterTags({ taskId, period, filings = [], canCorrect = false, bounds }: {
  taskId: string;
  period?: string | null;
  filings?: GstFiling[];
  canCorrect?: boolean;
  bounds?: Bounds;
}) {
  const shown = filings.filter((f) => f.date || canCorrect);
  if (!period && !shown.length) return null;
  return (
    <>
      <FilingPeriodTag label={period} />
      {shown.map((f) => (
        <FilingDateControl key={f.stepNumber} taskId={taskId} filing={f} bounds={bounds} canEdit={canCorrect} />
      ))}
    </>
  );
}

/** #294: the date form — a date picker on its own row (full width on a phone). */
function FilingDateEditor({ taskId, filing, bounds, onDone }: {
  taskId: string;
  filing: GstFiling;
  bounds?: Bounds;
  onDone: () => void;
}) {
  const [value, setValue] = useState(filing.date ?? '');
  const queryClient = useQueryClient();
  const toast = useToast();
  const save = useMutation({
    mutationFn: (date: string | null) => saveFilingDate(taskId, filing.stepNumber, date),
    onSuccess: (r) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (r.changed) toast.success(r.date ? `${filing.form} filing date saved.` : `${filing.form} filing date removed.`);
      onDone();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not save the filing date.'),
  });
  const id = `filed-on-${filing.stepNumber}`;
  return (
    <form
      className="basis-full flex flex-wrap items-end gap-2 mt-1"
      onSubmit={(e) => { e.preventDefault(); if (value) save.mutate(value); }}
    >
      <label htmlFor={id} className="flex flex-col gap-0.5 text-xs text-ink-muted w-full sm:w-auto">
        {filing.form} filed on
        <input
          id={id}
          type="date"
          className="input-field px-3 py-2 text-sm w-full sm:w-auto"
          value={value}
          min={bounds?.min ?? undefined}
          max={bounds?.max}
          required
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button type="submit" disabled={save.isPending || !value} className="btn-primary min-h-11 sm:min-h-0">Save</button>
      {filing.date && (
        <button type="button" disabled={save.isPending} onClick={() => save.mutate(null)}
          className="rounded-lg border border-hairline px-3 py-2 text-sm text-ink-soft hover:bg-surface-soft min-h-11 sm:min-h-0">
          Remove date
        </button>
      )}
      <button type="button" onClick={onDone} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-soft min-h-11 sm:min-h-0">Cancel</button>
    </form>
  );
}
