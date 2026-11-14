import { CalendarDays, CalendarCheck } from 'lucide-react';

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

/** The matter header's GST tags: Filing Month, then each completed filing. */
export function GstMatterTags({ period, filings = [] }: {
  period?: string | null;
  filings?: { stepNumber: number; form: string; date: string }[];
}) {
  if (!period && !filings.length) return null;
  return (
    <>
      <FilingPeriodTag label={period} />
      {filings.map((f) => <FiledOnTag key={f.stepNumber} form={f.form} date={f.date} />)}
    </>
  );
}
