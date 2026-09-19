import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import { getStatutoryCalendar, type CalendarRow } from '../../api/settings';
import { CockpitSection } from './CockpitStat';

/** `YYYY-MM` for a date, in local time. */
function monthKey(d: Date): string {
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

/**
 * Story 39.1 — the statutory dates falling this month (GSTR-1 on the 11th,
 * GSTR-3B on the 20th, …), from the workspace's own calendar (Story 35.3).
 * A CA firm's month is shaped by these; the dashboard is where they belong.
 */
export default function StatutoryDeadlines() {
  const now = new Date();
  // The calendar's `month` is the PERIOD being filed for, and a monthly filing
  // falls in the month after its period (GSTR-1 for August is due 11 September).
  // So "what is due this month" is the previous period's dates, filtered to
  // the dates that actually land in this month (fixed-date filings included).
  const period = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const { data } = useQuery({
    queryKey: ['statutory-calendar', period],
    queryFn: () => getStatutoryCalendar(period),
    staleTime: 5 * 60_000,
  });

  const rows = data ? deadlinesThisMonth(data.rows, now) : undefined;
  const label = now.toLocaleDateString('en-IN', { month: 'long' });

  return (
    <CockpitSection title={`Statutory deadlines · ${label}`} to="/settings/statutory-calendar" linkLabel="Calendar">
      <div className="card p-4" data-testid="cockpit-deadlines">
        {rows === undefined ? (
          <div className="h-5 w-40 rounded bg-surface-strong/70 animate-pulse" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-ink-muted">No dated filings this month.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-hairline">
            {rows.map((r) => {
              const past = r.days < 0;
              const today = r.days === 0;
              const when = past
                ? `${Math.abs(r.days)}d ago`
                : today ? 'Today' : `in ${r.days}d`;
              return (
                <li key={r.key} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                  <span className="flex items-center gap-2 min-w-0">
                    <CalendarClock className={`w-4 h-4 shrink-0 ${past ? 'text-ink-faint' : 'text-ink-muted'}`} />
                    <span className={`text-sm truncate ${past ? 'text-ink-muted' : 'text-ink'}`}>{r.label}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-ink-muted tabular-nums">
                      {new Date(r.resolved).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className={today || (r.days > 0 && r.days <= 3) ? 'badge-amber' : 'badge-gray'}>{when}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <Link to="/reports/sla" className="mt-3 inline-block text-xs text-ink-muted hover:text-ink hover:underline">
          Which matters are late against these →
        </Link>
      </div>
    </CockpitSection>
  );
}
