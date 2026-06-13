import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Inbox, ArrowRight, AlertTriangle, UserCheck, Users } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { getMySteps } from '../../api/tasks';
import type { MyStepRow } from '../../api/tasks';

/**
 * "My Tasks" — a consolidated, cross-matter worklist for staff. A Matter has many
 * steps; one is `active` at a time. This surfaces the active step of every open
 * matter the user is involved in, so they get one to-do inbox instead of opening
 * matters one by one. Rows are grouped: steps assigned to me first, then the
 * shared/unassigned pool they can pick up. Each row links into the matter.
 */
export default function MyTasksPage() {
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: ['my-steps'],
    queryFn: getMySteps,
    // Live-ish so the inbox reflects actions taken elsewhere without a refresh.
    staleTime: 5_000,
    refetchInterval: 15_000,
  });

  const { mine, pool } = useMemo(() => {
    const mine = rows.filter((r) => r.bucket === 'assigned');
    const pool = rows.filter((r) => r.bucket !== 'assigned');
    return { mine, pool };
  }, [rows]);

  return (
    <PageShell title="My Tasks" subtitle="Steps awaiting action across all your matters.">
      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading your tasks…</span>
        </div>
      ) : error ? (
        <div className="card p-12 text-center text-sm text-red-600">
          Failed to load your tasks. {(error as Error).message}
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Inbox className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">You're all caught up — no open steps.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <Section
            icon={<UserCheck className="w-4 h-4" />}
            title="Assigned to me"
            count={mine.length}
            rows={mine}
            emptyHint="No steps are assigned directly to you."
          />
          <Section
            icon={<Users className="w-4 h-4" />}
            title="Available to pick up"
            count={pool.length}
            rows={pool}
            emptyHint="Nothing in the shared pool."
          />
        </div>
      )}
    </PageShell>
  );
}

function Section({ icon, title, count, rows, emptyHint }: {
  icon: React.ReactNode;
  title: string;
  count: number;
  rows: MyStepRow[];
  emptyHint: string;
}) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
        {icon}
        {title}
        <span className="text-ink-faint font-normal normal-case">({count})</span>
      </h2>
      {rows.length === 0 ? (
        <p className="text-xs text-ink-faint px-1">{emptyHint}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => <StepRow key={`${r.taskId}:${r.stepNumber}`} row={r} />)}
        </div>
      )}
    </section>
  );
}

function timeAgo(iso?: string | null): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StepRow({ row }: { row: MyStepRow }) {
  return (
    <Link
      to={`/tasks/${row.taskId}`}
      className="group card p-4 hover:shadow-card-hover hover:border-ink/15 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-ink truncate">{row.stepTitle}</p>
            {row.isUrgent && (
              <span className="badge bg-red-50 text-red-700 inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Urgent
              </span>
            )}
            <span className="badge bg-brand-50 text-brand-700">Step {row.stepNumber}</span>
            {row.bucket === 'unassigned' && (
              <span className="badge bg-surface-card text-ink-muted">Unassigned</span>
            )}
            {row.bucket === 'other' && row.assignedTo && (
              <span className="badge bg-surface-card text-ink-muted">Assigned elsewhere</span>
            )}
          </div>
          <p className="text-xs text-ink-muted mt-0.5 truncate">
            {row.clientName || 'Unknown client'} · {row.serviceName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[11px] text-ink-faint">{timeAgo(row.updatedAt)}</span>
          <ArrowRight className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      </div>
    </Link>
  );
}
