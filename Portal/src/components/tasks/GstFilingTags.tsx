import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, CalendarCheck, Pencil } from 'lucide-react';
import { correctFiledOn } from '../../api/tasks';
import { useToast } from '../common/toastContext';
import type { GstFiling } from '../../types/task';

/**
 * #292 / #294 — the GST return tags. Both values are worked out by the server
 * (the GST Return Filing sheet's rules), so this only renders them. Neutral and
 * success badges: the period is an identifier, a filed return is done.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

/** '2026-11-11' → '11 November 2026'. Read as a calendar date, never through a time zone. */
function longFilingDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

/** #292: "September 2026" (or "Q2 2026-27") on a GST return matter. */
export function FilingPeriodTag({ label }: { label?: string | null }) {
  if (!label) return null;
  return (
    <span className="badge-gray shrink-0" title="Filing month" data-testid="gst-filing-period">
      <CalendarDays className="w-3 h-3" aria-hidden="true" />
      <span className="sr-only">Filing month: </span>{label}
    </span>
  );
}

/**
 * #294: "Filed on: 11 November 2026" next to a completed GSTR-1 / GSTR-3B filing
 * task; with `form`, "GSTR-1 filed on: …" for the matter's header.
 */
export function FiledOnTag({ date, form }: { date?: string; form?: string }) {
  if (!date) return null;
  return (
    <span className="badge-green shrink-0" data-testid="gst-filed-on">
      <CalendarCheck className="w-3 h-3" aria-hidden="true" />
      {form ? `${form} filed on` : 'Filed on'}: {longFilingDate(date)}
    </span>
  );
}

/**
 * The matter header's GST tags: Filing Month, then each completed filing.
 * #294: staff (`canCorrect`) get a pencil beside each filing to correct its
 * date, within `bounds`; the server checks the range and who may again.
 */
export function GstMatterTags({ taskId, period, filings = [], canCorrect = false, bounds }: {
  taskId: string;
  period?: string | null;
  filings?: GstFiling[];
  canCorrect?: boolean;
  bounds?: { min: string | null; max: string };
}) {
  const [editing, setEditing] = useState<GstFiling | null>(null);
  if (!period && !filings.length) return null;
  return (
    <>
      <FilingPeriodTag label={period} />
      {filings.map((f) => (
        <span key={f.stepNumber} className="inline-flex items-center gap-0.5 shrink-0">
          <span title={canCorrect && f.corrected && f.completedOn ? `Corrected — the task was completed on ${longFilingDate(f.completedOn)}` : undefined}>
            <FiledOnTag form={f.form} date={f.date} />
          </span>
          {canCorrect && (
            <button
              type="button"
              onClick={() => setEditing(f)}
              aria-label={`Correct ${f.form} filing date`}
              title={`Correct ${f.form} filing date`}
              className="inline-flex items-center justify-center w-11 h-11 sm:w-7 sm:h-7 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-soft"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </span>
      ))}
      {editing && (
        <FiledOnEditor key={editing.stepNumber} taskId={taskId} filing={editing} bounds={bounds} onDone={() => setEditing(null)} />
      )}
    </>
  );
}

/** #294: the correction form — a date picker on its own row (full width on a phone). */
function FiledOnEditor({ taskId, filing, bounds, onDone }: {
  taskId: string;
  filing: GstFiling;
  bounds?: { min: string | null; max: string };
  onDone: () => void;
}) {
  const [value, setValue] = useState(filing.date);
  const queryClient = useQueryClient();
  const toast = useToast();
  const save = useMutation({
    mutationFn: (date: string | null) => correctFiledOn(taskId, filing.stepNumber, date),
    onSuccess: (r) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-events', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (r.changed) toast.success(`${filing.form} filing date saved.`);
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
      {filing.corrected && filing.completedOn && (
        <button type="button" disabled={save.isPending} onClick={() => save.mutate(null)}
          className="rounded-lg border border-hairline px-3 py-2 text-sm text-ink-soft hover:bg-surface-soft min-h-11 sm:min-h-0">
          Use completion date ({longFilingDate(filing.completedOn)})
        </button>
      )}
      <button type="button" onClick={onDone} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-soft min-h-11 sm:min-h-0">Cancel</button>
    </form>
  );
}
