import type { CalendarRow } from '../../api/settings';

/** `YYYY-MM` for a date, in local time. */
export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const MS_PER_DAY = 86_400_000;

function daysFromToday(iso: string, now: Date): number {
  const d = new Date(iso);
  const d0 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((d1 - d0) / MS_PER_DAY);
}

/** Pure: keep this month's dated rows, soonest first. Exported for tests. */
export function deadlinesThisMonth(rows: CalendarRow[], now: Date): (CalendarRow & { resolved: string; days: number })[] {
  const key = monthKey(now);
  return rows
    .filter((r): r is CalendarRow & { resolved: string } => !!r.resolved && r.resolved.startsWith(key))
    .map((r) => ({ ...r, days: daysFromToday(r.resolved, now) }))
    .sort((a, b) => a.days - b.days);
}
