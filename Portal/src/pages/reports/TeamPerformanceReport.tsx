import { useMemo, type ReactNode } from 'react';
import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download, Info } from 'lucide-react';
import {
  getTeamPerformance, getTeamPerformanceActivity,
  type PerfGranularity, type PerfHistoryRow, type PerfOverviewRow, type TeamPerformanceReport as Report,
} from '../../api/reports';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { PERF_PERIODS, localTzOffset, periodRange, toDayString, type PerfPeriod } from '../../lib/performancePeriod';

/**
 * LT #216 — Employee Performance. One person, or the whole team, over a period.
 *
 * Every number comes from the server, computed from each task's (step's) start,
 * finish and due dates and the matter activity log. The portal does NOT record
 * working hours, so "time on tasks" is elapsed time and says so.
 */

interface PerfFilters { uid?: string; period?: PerfPeriod; from?: string; to?: string; gran?: PerfGranularity }
const PERF_FILTER_KEYS = ['uid', 'period', 'from', 'to', 'gran'] as const;

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const fmtDate = (iso: string | null | undefined) => (iso ? dateFmt.format(new Date(iso)) : '—');
const fmtDateTime = (iso: string | null | undefined) => (iso ? dateTimeFmt.format(new Date(iso)) : '—');
const pctText = (n: number | null | undefined) => (n == null ? '—' : `${n}%`);
const daysText = (n: number | null | undefined) => (n == null ? '—' : `${n} ${n === 1 ? 'day' : 'days'}`);

/** 2 d 3 h · 5 h 10 m · 12 m — an elapsed span, never presented as hours worked. */
function fmtElapsed(ms: number | null | undefined): string {
  if (ms == null) return '—';
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins} m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ${mins % 60} m`;
  return `${Math.floor(hours / 24)} d ${hours % 24} h`;
}

const RETURN_LABEL: Record<string, string> = {
  REWORK: 'Sent back for correction',
  CLIENT_REJECT: 'Client asked for changes',
  GOVT_REJECT: 'Government rejected',
  STEP_REOPENED: 'Reopened',
};

export default function TeamPerformanceReport() {
  // #208: filters live in the URL so Back from a matter restores them.
  const [filters, setFilters] = useUrlFilters<PerfFilters>(PERF_FILTER_KEYS, { defaults: { period: 'month' } });
  const set = (patch: PerfFilters) => setFilters((f) => ({ ...f, ...patch }));
  const period = filters.period ?? 'month';

  const range = useMemo(() => periodRange(period, filters.from, filters.to), [period, filters.from, filters.to]);
  const query = useMemo(() => ({
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    uid: filters.uid,
    tz: localTzOffset(),
    granularity: filters.gran,
  }), [range, filters.uid, filters.gran]);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['report-team-performance', query],
    queryFn: () => getTeamPerformance(query),
    placeholderData: keepPreviousData,
    enabled: !range.error,
  });

  const person = data?.employee ?? null;
  const onExport = async () => {
    if (!data) return;
    if (!person) {
      const cols: ExportColumn<PerfOverviewRow>[] = [
        { header: 'Team member', value: (r) => r.name },
        { header: 'Assigned', value: (r) => r.assigned },
        { header: 'Completed', value: (r) => r.completed },
        { header: 'In progress', value: (r) => r.inProgress },
        { header: 'Overdue now', value: (r) => r.overdue },
        { header: 'Completed late', value: (r) => r.completedLate },
        { header: 'On-time %', value: (r) => r.onTimePct ?? '' },
        { header: 'Average delay (days, late tasks)', value: (r) => r.avgDelayDays ?? '' },
        { header: 'Returned for corrections', value: (r) => r.returned },
        { header: 'First-time right %', value: (r) => r.firstTimeRightPct ?? '' },
      ];
      await exportToXlsx(data.overview, cols, 'team-performance', 'Team');
    } else {
      const cols: ExportColumn<PerfHistoryRow>[] = [
        { header: 'Client', value: (r) => r.clientName },
        { header: 'Service', value: (r) => r.serviceName },
        { header: 'Task', value: (r) => r.title },
        { header: 'Status', value: (r) => historyStatus(r.status) },
        { header: 'Matter opened', value: (r) => r.matterCreatedAt ?? '' },
        { header: 'Assigned', value: (r) => r.assignedAt ?? '' },
        { header: 'Started', value: (r) => r.startedAt ?? '' },
        { header: 'Completed', value: (r) => r.completedAt ?? '' },
        { header: 'Due', value: (r) => r.dueAt ?? '' },
        { header: 'Last comment', value: (r) => r.lastComment ?? '' },
      ];
      await exportToXlsx(data.history.rows, cols, `performance-${person.name.replace(/\W+/g, '-').toLowerCase()}`, 'Tasks');
    }
  };
  const exportEmpty = !data || (person ? data.history.rows.length === 0 : data.overview.length === 0);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline shrink-0">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink truncate">Employee Performance</h1>
        </div>
        <button onClick={onExport} disabled={exportEmpty} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="card p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="perf-person" className="input-label">Team member</label>
          <select id="perf-person" className="input-field" value={filters.uid ?? ''} onChange={(e) => set({ uid: e.target.value })}>
            <option value="">All team</option>
            {(data?.staff ?? []).map((p) => <option key={p.uid} value={p.uid}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="perf-period" className="input-label">Period</label>
          <select
            id="perf-period"
            className="input-field"
            value={period}
            onChange={(e) => {
              const next = e.target.value as PerfPeriod;
              // Custom starts from the period on screen, so the dates are never blank.
              set(next === 'custom'
                ? { period: next, from: toDayString(range.from), to: toDayString(range.to) }
                : { period: next, from: '', to: '' });
            }}
          >
            {PERF_PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        {period === 'custom' && (
          <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-1">
            <div>
              <label htmlFor="perf-from" className="input-label">From</label>
              <input id="perf-from" type="date" className="input-field" value={filters.from ?? ''} onChange={(e) => set({ from: e.target.value })} />
            </div>
            <div>
              <label htmlFor="perf-to" className="input-label">To</label>
              <input id="perf-to" type="date" className="input-field" value={filters.to ?? ''} onChange={(e) => set({ to: e.target.value })} />
            </div>
          </div>
        )}
        <div>
          <label htmlFor="perf-gran" className="input-label">Trend by</label>
          <select id="perf-gran" className="input-field" value={filters.gran ?? 'auto'} onChange={(e) => set({ gran: e.target.value as PerfGranularity })}>
            <option value="auto">Automatic</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {range.error && <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700 mb-4" role="alert">{range.error}</p>}
      {isLoading && !range.error && <p className="text-sm text-ink-muted">Loading…</p>}
      {error && <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">{(error as Error).message}</p>}

      {data && !range.error && (
        <div className={`space-y-4 ${isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}`}>
          <p className="text-sm text-ink-muted">
            <span className="font-medium text-ink">{person ? person.name : 'Whole team'}</span>
            {' · '}{fmtDate(data.range.from)} – {fmtDate(data.range.to)}
            {' · compared with '}{fmtDate(data.range.previousFrom)} – {fmtDate(data.range.previousTo)}
          </p>
          {data.truncated && (
            <p className="rounded-lg border border-amber-100 bg-amber-50 p-3.5 text-sm text-amber-800" role="status">
              This period has more records than the report reads at once, so some figures may be low. Choose a shorter period or one team member.
            </p>
          )}

          {!person && <Overview rows={data.overview} onPick={(uid) => set({ uid })} />}
          <SummarySection data={data} />
          <TimeSection data={data} />
          <CompletionSection data={data} teamView={!person} />
          <HistorySection data={data} query={query} />
          <DeadlineSection data={data} />
          <TrendSection data={data} />
          <QualitySection data={data} />
        </div>
      )}
    </div>
  );
}

/* ── Building blocks ──────────────────────────────────────────────────────── */

function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="card p-4">
      <h2 id={id} className="text-base font-semibold text-ink">{title}</h2>
      {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** A figure. Colour marks the exception only: `tone` applies when the value is not zero. */
function Stat({ label, value, sub, tone }: { label: string; value: string | number; sub?: string; tone?: 'warning' | 'danger' }) {
  const isZero = value === 0 || value === '0' || value === '—';
  const cls = !isZero && tone === 'danger' ? 'text-red-700' : !isZero && tone === 'warning' ? 'text-amber-800' : 'text-ink';
  return (
    <div role="group" aria-label={label} className="card-flat p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${cls}`}>{value}</p>
      {sub && <p className="text-xs text-ink-muted mt-0.5">{sub}</p>}
    </div>
  );
}

const Stats = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">{children}</div>
);

const Empty = ({ children }: { children: ReactNode }) => <p className="text-sm text-ink-muted">{children}</p>;

function MatterLine({ r }: { r: { taskId: string; title: string; clientName: string; serviceName: string } }) {
  return (
    <>
      <Link to={`/tasks/${r.taskId}`} className="text-sm text-brand-600 hover:underline">{r.title}</Link>
      <p className="text-xs text-ink-muted">{[r.clientName, r.serviceName].filter(Boolean).join(' · ') || '—'}</p>
    </>
  );
}

function historyStatus(s: PerfHistoryRow['status']) {
  return s === 'completed' ? 'Completed' : s === 'in_progress' ? 'In progress' : 'Waiting';
}

/* ── Overview (whole team) ────────────────────────────────────────────────── */

function Overview({ rows, onPick }: { rows: PerfOverviewRow[]; onPick: (uid: string) => void }) {
  return (
    <Section id="perf-overview" title="Team overview" hint="Spot uneven workload. Select a name for that person's full report.">
      {rows.length === 0 ? <Empty>No team members found.</Empty> : (
        <>
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Performance per team member</caption>
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                  <th className="p-2 font-medium">Team member</th>
                  <th className="p-2 font-medium text-right">Assigned</th>
                  <th className="p-2 font-medium text-right">Completed</th>
                  <th className="p-2 font-medium text-right">In progress</th>
                  <th className="p-2 font-medium text-right">Overdue</th>
                  <th className="p-2 font-medium text-right">On time</th>
                  <th className="p-2 font-medium text-right">Avg delay</th>
                  <th className="p-2 font-medium text-right">Returned</th>
                  <th className="p-2 font-medium text-right">First-time right</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.uid} className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft">
                    <td className="p-2"><button type="button" className="text-brand-600 hover:underline text-left" onClick={() => onPick(r.uid)}>{r.name}</button></td>
                    <td className="p-2 text-right">{r.assigned}</td>
                    <td className="p-2 text-right">{r.completed}</td>
                    <td className="p-2 text-right">{r.inProgress}</td>
                    <td className="p-2 text-right">{r.overdue > 0 ? <span className="badge-red">{r.overdue}</span> : 0}</td>
                    <td className="p-2 text-right">{pctText(r.onTimePct)}</td>
                    <td className="p-2 text-right">{daysText(r.avgDelayDays)}</td>
                    <td className="p-2 text-right">{r.returned > 0 ? <span className="badge-amber">{r.returned}</span> : 0}</td>
                    <td className="p-2 text-right">{pctText(r.firstTimeRightPct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="md:hidden space-y-2">
            {rows.map((r) => (
              <li key={r.uid} className="card-flat p-3">
                <button type="button" className="text-sm font-semibold text-brand-600 min-h-[44px] text-left" onClick={() => onPick(r.uid)}>{r.name}</button>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span>Assigned {r.assigned}</span>
                  <span>Completed {r.completed}</span>
                  <span>In progress {r.inProgress}</span>
                  {r.overdue > 0 ? <span className="badge-red">Overdue {r.overdue}</span> : <span>Overdue 0</span>}
                  <span>On time {pctText(r.onTimePct)}</span>
                  {r.returned > 0 && <span className="badge-amber">Returned {r.returned}</span>}
                  <span>First-time right {pctText(r.firstTimeRightPct)}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

/* ── 1 · Daily work summary ───────────────────────────────────────────────── */

function SummarySection({ data }: { data: Report }) {
  const s = data.summary;
  return (
    <Section id="perf-summary" title="Work summary" hint="Tasks in the selected period. Carried forward: started before the period and still not done at its end.">
      <Stats>
        <Stat label="Assigned" value={s.assigned} />
        <Stat label="Completed" value={s.completed} />
        <Stat label="Pending" value={s.notStarted == null ? s.inProgress : s.pending} sub={s.notStarted == null ? 'in progress' : `${s.inProgress} in progress · ${s.notStarted} not started`} />
        <Stat label="Started in period" value={s.startedInRange} />
        <Stat label="Completed in period" value={s.completedInRange} />
        <Stat label="Carried forward" value={s.carriedForward} />
      </Stats>
    </Section>
  );
}

/* ── 2 · Time on tasks ────────────────────────────────────────────────────── */

function TimeSection({ data }: { data: Report }) {
  const t = data.time;
  return (
    <Section id="perf-time" title="Time on tasks" hint="Elapsed time from a task starting to it being completed.">
      <p className="flex gap-2 rounded-lg bg-surface-soft p-3 text-xs text-ink-soft mb-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>Elapsed time, not hours worked. The portal does not record when someone starts and stops working on a task, so working hours and work sessions cannot be shown. That needs a time-tracking feature.</span>
      </p>
      <Stats>
        <Stat label="Tasks timed" value={t.count} />
        <Stat label="Average elapsed" value={fmtElapsed(t.avgElapsedMs)} />
        <Stat label="Total elapsed" value={t.count ? fmtElapsed(t.totalElapsedMs) : '—'} />
      </Stats>
      {t.items.length > 0 && (
        <ul className="mt-3 divide-y divide-hairline">
          {t.items.map((i) => (
            <li key={`${i.taskId}-${i.stepNumber}`} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="min-w-0"><MatterLine r={i} /></div>
              <div className="text-xs text-ink-muted sm:text-right">
                <p>{fmtDateTime(i.startedAt)} → {fmtDateTime(i.completedAt)}</p>
                <p className="text-ink font-medium">{fmtElapsed(i.elapsedMs)} elapsed</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ── 3 · Completion & pending ─────────────────────────────────────────────── */

function CompletionSection({ data, teamView }: { data: Report; teamView: boolean }) {
  const s = data.summary;
  return (
    <Section id="perf-completion" title="Task completion & pending" hint={teamView ? 'Not-started tasks are counted per person — pick a team member to see them.' : undefined}>
      <Stats>
        <Stat label="Assigned" value={s.assigned} />
        <Stat label="Completed" value={s.completed} />
        <Stat label="In progress" value={s.inProgress} />
        <Stat label="Not started" value={s.notStarted ?? '—'} />
        <Stat label="Overdue" value={s.overdue} tone="danger" />
        <Stat label="Awaiting approval" value={s.awaitingApproval} />
        <Stat label="Completion" value={pctText(s.completionPct)} />
      </Stats>
    </Section>
  );
}

/* ── 4 · Activity & work history ──────────────────────────────────────────── */

function HistorySection({ data, query }: { data: Report; query: { from: string; to: string; uid?: string } }) {
  const rows = data.history.rows;
  return (
    <Section id="perf-history" title="Activity & work history" hint="When each task was assigned, started and completed, then every recorded action, newest first.">
      {rows.length === 0 ? <Empty>No task activity in this period.</Empty> : (
        <>
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">Tasks with activity in the period</caption>
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                  <th className="p-2 font-medium">Task</th>
                  <th className="p-2 font-medium">Status</th>
                  <th className="p-2 font-medium">Assigned</th>
                  <th className="p-2 font-medium">Started</th>
                  <th className="p-2 font-medium">Completed</th>
                  <th className="p-2 font-medium">Last comment</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.taskId}-${r.stepNumber}`} className="border-b border-hairline-soft last:border-0 align-top">
                    <td className="p-2"><MatterLine r={r} /></td>
                    <td className="p-2"><span className={r.status === 'in_progress' ? 'badge-blue' : 'badge-gray'}>{historyStatus(r.status)}</span></td>
                    <td className="p-2 text-xs text-ink-muted whitespace-nowrap" title={r.assignedVia === 'matter-opened' ? 'Assigned when the matter was opened' : 'Reassigned'}>{fmtDateTime(r.assignedAt)}</td>
                    <td className="p-2 text-xs text-ink-muted whitespace-nowrap">{fmtDateTime(r.startedAt)}</td>
                    <td className="p-2 text-xs text-ink-muted whitespace-nowrap">{fmtDateTime(r.completedAt)}</td>
                    <td className="p-2 text-xs text-ink-muted max-w-xs"><span className="line-clamp-2">{r.lastComment ?? '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="md:hidden space-y-2">
            {rows.map((r) => (
              <li key={`${r.taskId}-${r.stepNumber}`} className="card-flat p-3">
                <MatterLine r={r} />
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <span className={r.status === 'in_progress' ? 'badge-blue' : 'badge-gray'}>{historyStatus(r.status)}</span>
                  <span>Assigned {fmtDateTime(r.assignedAt)}</span>
                  <span>Started {fmtDateTime(r.startedAt)}</span>
                  {r.completedAt && <span>Completed {fmtDateTime(r.completedAt)}</span>}
                </div>
                {r.lastComment && <p className="mt-1 text-xs text-ink-soft line-clamp-3">{r.lastComment}</p>}
              </li>
            ))}
          </ul>
          {data.history.total > rows.length && <p className="text-xs text-ink-muted mt-2">Showing the latest {rows.length} of {data.history.total} tasks. Export or narrow the period for the rest.</p>}
        </>
      )}
      <ActivityFeed query={query} />
    </Section>
  );
}

function ActivityFeed({ query }: { query: { from: string; to: string; uid?: string } }) {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['report-team-performance-activity', query.from, query.to, query.uid ?? ''],
    queryFn: ({ pageParam }) => getTeamPerformanceActivity({ from: query.from, to: query.to, uid: query.uid, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
  const items = data?.pages.flatMap((p) => p.data) ?? [];
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-ink mb-2">Recorded activity</h3>
      {isLoading && <Empty>Loading…</Empty>}
      {error && <p className="text-sm text-red-700" role="alert">{(error as Error).message}</p>}
      {!isLoading && !error && items.length === 0 && <Empty>No activity recorded in this period.</Empty>}
      {items.length > 0 && (
        <ol className="divide-y divide-hairline" aria-label="Recorded activity">
          {items.map((a) => (
            <li key={a.id} className="py-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <p className="text-sm text-ink">
                  <span className="font-medium">{a.label}</span>
                  {a.toTitle && a.fromTitle && a.fromStep !== a.toStep ? ` · ${a.fromTitle} → ${a.toTitle}` : a.fromTitle ? ` · ${a.fromTitle}` : ''}
                </p>
                <p className="text-xs text-ink-muted whitespace-nowrap">{fmtDateTime(a.at)}</p>
              </div>
              <p className="text-xs text-ink-muted">
                {a.byName} · <Link to={`/tasks/${a.taskId}`} className="text-brand-600 hover:underline">{[a.clientName, a.serviceName].filter(Boolean).join(' · ') || 'Matter'}</Link>
              </p>
              {a.comment && <p className="mt-1 text-xs text-ink-soft whitespace-pre-line line-clamp-4">{a.comment}</p>}
            </li>
          ))}
        </ol>
      )}
      {hasNextPage && (
        <button type="button" className="btn-secondary mt-2 min-h-[44px]" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}

/* ── 5 · Deadline & delay ─────────────────────────────────────────────────── */

function DeadlineSection({ data }: { data: Report }) {
  const d = data.deadlines;
  return (
    <Section id="perf-deadlines" title="Deadlines & delay" hint="Average delay counts late tasks only.">
      <Stats>
        <Stat label="Completed on time" value={d.completedOnTime} />
        <Stat label="Completed late" value={d.completedLate} tone="warning" />
        <Stat label="No due date" value={d.completedWithoutDueDate} />
        <Stat label="Overdue now" value={d.overdueNow} tone="danger" />
        <Stat label="Average delay" value={daysText(d.avgDelayDays)} />
        <Stat label="On time" value={pctText(d.onTimePct)} />
      </Stats>
      {d.lateItems.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-ink mt-4">Completed late</h3>
          <p className="text-xs text-ink-muted">There is no separate “reason for delay” field. Shown is the comment recorded when the task was completed.</p>
          <ul className="mt-2 divide-y divide-hairline">
            {d.lateItems.map((i) => (
              <li key={`${i.taskId}-${i.stepNumber}`} className="py-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <div className="min-w-0"><MatterLine r={i} /></div>
                  <div className="text-xs text-ink-muted sm:text-right">
                    <span className="badge-amber">{daysText(i.delayDays)} late</span>
                    <p className="mt-1">Due {fmtDate(i.dueAt)} · done {fmtDate(i.completedAt)}</p>
                  </div>
                </div>
                <p className="mt-1 text-xs text-ink-soft">{i.completionComment ? `Comment at completion: ${i.completionComment}` : 'No comment recorded.'}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {d.overdueItems.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-ink mt-4">Overdue now</h3>
          <ul className="mt-2 divide-y divide-hairline">
            {d.overdueItems.map((i) => (
              <li key={`${i.taskId}-${i.stepNumber}`} className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                <div className="min-w-0"><MatterLine r={i} /></div>
                <div className="text-xs text-ink-muted sm:text-right">
                  <span className="badge-red">{daysText(i.daysOverdue)} overdue</span>
                  <p className="mt-1">Due {fmtDate(i.dueAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

/* ── 6 · Productivity trend ───────────────────────────────────────────────── */

const changeText = (n: number | null, unit = '') => (n == null ? '' : n === 0 ? 'no change' : `${n > 0 ? '+' : ''}${n}${unit} on previous period`);

function TrendSection({ data }: { data: Report }) {
  const t = data.trend;
  const max = Math.max(1, ...t.buckets.map((b) => b.completed));
  const by = t.granularity === 'day' ? 'day' : t.granularity === 'week' ? 'week' : 'month';
  return (
    <Section id="perf-trend" title="Productivity trend" hint={`Tasks completed per ${by}, and the share completed on time (tasks with a due date).`}>
      <Stats>
        <Stat label="Completed this period" value={t.current.completed} sub={changeText(t.completedChange)} />
        <Stat label="Completed previous period" value={t.previous?.completed ?? '—'} />
        <Stat label="On time this period" value={pctText(t.current.onTimePct)} sub={changeText(t.onTimePctChange, ' pts')} />
        <Stat label="On time previous period" value={pctText(t.previous?.onTimePct)} />
      </Stats>
      <ol className="mt-3 space-y-1" aria-label={`Completions per ${by}`}>
        {t.buckets.map((b) => (
          <li key={b.start} className="grid grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[8rem_1fr_9rem] items-center gap-2 text-xs">
            <span className="text-ink-muted truncate">{b.label}</span>
            <span className="h-3 rounded bg-surface-card overflow-hidden" aria-hidden="true">
              <span className="block h-full rounded bg-brand-500" style={{ width: `${(b.completed / max) * 100}%` }} />
            </span>
            <span className="text-ink text-right whitespace-nowrap">{b.completed} done{b.onTimePct != null ? ` · ${b.onTimePct}% on time` : ''}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ── 7 · Quality & approval ───────────────────────────────────────────────── */

function QualitySection({ data }: { data: Report }) {
  const q = data.quality;
  return (
    <Section id="perf-quality" title="Quality & approval" hint="First-time right: completed with no correction, client change request, rejection or reopening ever recorded on the task.">
      <Stats>
        <Stat label="First-time right" value={pctText(q.firstTimeRightPct)} sub={`${q.firstTimeRight} of ${q.completed} completed`} />
        <Stat label="Returned for corrections" value={q.returnedSteps} sub={q.returnCount ? `${q.returnCount} ${q.returnCount === 1 ? 'return' : 'returns'} in period` : undefined} tone="warning" />
        <Stat label="Awaiting approval" value={q.awaitingApproval} />
      </Stats>
      {q.returnedItems.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-ink mt-4">Returned in this period</h3>
          <ul className="mt-2 divide-y divide-hairline">
            {q.returnedItems.map((i) => (
              <li key={`${i.taskId}-${i.stepNumber}`} className="py-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <div className="min-w-0"><MatterLine r={i} /></div>
                  <div className="text-xs text-ink-muted sm:text-right">
                    <span className="badge-amber">{i.returns} {i.returns === 1 ? 'time' : 'times'}</span>
                    <p className="mt-1">{RETURN_LABEL[i.lastReturnType] ?? 'Returned'} · {fmtDateTime(i.lastReturnAt)}</p>
                  </div>
                </div>
                {i.lastComment && <p className="mt-1 text-xs text-ink-soft">{i.lastComment}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
      {q.awaitingItems.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-ink mt-4">Waiting for approval</h3>
          <ul className="mt-2 divide-y divide-hairline">
            {q.awaitingItems.map((i) => (
              <li key={`${i.kind}-${i.taskId}-${i.stepNumber ?? 'm'}`} className="py-2 flex flex-col sm:flex-row sm:justify-between gap-1">
                <div className="min-w-0"><MatterLine r={i} /></div>
                <div className="text-xs text-ink-muted sm:text-right">
                  <p>{i.waitingOn === 'client' ? 'Waiting for the client' : 'Waiting for an admin'} · {i.approvalTitle}</p>
                  <p>Since {fmtDateTime(i.since)}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
