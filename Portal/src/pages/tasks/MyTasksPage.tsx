import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Inbox, Flame, ShieldCheck, ListChecks } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import DataGrid from '../../components/common/DataGrid';
import { getMySteps } from '../../api/tasks';
import type { MyStepRow, MyApprovalRow } from '../../api/tasks';
import { dueInfo, DUE_BADGE_CLASS } from '../../lib/dueDate';

/**
 * "My Tasks" — consolidated cross-matter worklist for staff, as grids (shared
 * DataGrid: sort/search/paginate). Two grids: (1) matters awaiting my approval,
 * (2) my work — steps assigned to me + the shared pool I can pick up, with a
 * "Queue" column distinguishing them. Urgent items sort to the top of the work grid.
 */
export default function MyTasksPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-steps'],
    queryFn: getMySteps,
    staleTime: 5_000,
    refetchInterval: 15_000,
  });
  const approvals = useMemo(() => data?.approvals ?? [], [data]);

  // Work grid: assigned-to-me first, urgent first within that, then the pool.
  const work = useMemo(() => {
    const rows = data?.data ?? [];
    const rank = (r: MyStepRow) => (r.bucket === 'assigned' ? 0 : 1);
    return [...rows].sort((a, b) => {
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      if (!!a.isUrgent !== !!b.isUrgent) return a.isUrgent ? -1 : 1;
      return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
    });
  }, [data]);

  const isEmpty = work.length === 0 && approvals.length === 0;

  const approvalCols = useMemo(() => buildApprovalColumns(navigate), [navigate]);
  const workCols = useMemo(() => buildWorkColumns(navigate), [navigate]);

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
      ) : isEmpty ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Inbox className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">You're all caught up — no open steps.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Approvals grid (E11-S04) — only when the user can approve something. */}
          {approvals.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-700 mb-3">
                <ShieldCheck className="w-4 h-4" />
                Awaiting your approval
                <span className="text-ink-faint font-normal">({approvals.length})</span>
              </h2>
              <DataGrid<MyApprovalRow>
          tableId="my-tasks"
                data={approvals}
                columns={approvalCols}
                getRowId={(r) => r.taskId}
                onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
                searchable={false}
                pageSize={10}
                renderMobileCard={(r) => <ApprovalCard row={r} navigate={navigate} />}
              />
            </section>
          )}

          {/* Work grid — assigned + pool combined, Queue column distinguishes. */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink mb-3">
              <ListChecks className="w-4 h-4" />
              My work
              <span className="text-ink-faint font-normal">({work.length})</span>
            </h2>
            <DataGrid<MyStepRow>
              data={work}
              columns={workCols}
              getRowId={(r) => `${r.taskId}:${r.stepNumber}`}
              onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
              searchPlaceholder="Search steps by title, client, or service…"
              globalFilterFn={(row, _id, q) => {
                const r = row.original;
                const s = q.toLowerCase();
                return (
                  r.stepTitle.toLowerCase().includes(s) ||
                  (r.clientName ?? '').toLowerCase().includes(s) ||
                  (r.serviceName ?? '').toLowerCase().includes(s) ||
                  (r.isUrgent && 'urgent'.includes(s))
                );
              }}
              emptyLabel="No open steps."
              renderMobileCard={(r) => <StepCard row={r} navigate={navigate} />}
            />
          </section>
        </div>
      )}
    </PageShell>
  );
}

/* ── Columns ──────────────────────────────────────────────────────────────── */

const wc = createColumnHelper<MyStepRow>();
function buildWorkColumns(navigate: (to: string) => void) {
  return [
    // Priority column — sortable (urgent first) and filterable. Urgent rows sort
    // above normal ones because `true` > `false` (desc puts urgent on top).
    wc.accessor((r) => (r.isUrgent ? 1 : 0), {
      id: 'priority',
      header: 'Priority',
      size: 110,
      sortDescFirst: true,
      cell: (ctx) => (
        ctx.row.original.isUrgent
          ? <span className="badge bg-red-50 text-red-600 inline-flex items-center gap-1"><Flame className="w-3 h-3" fill="currentColor" /> Urgent</span>
          : <span className="text-xs text-ink-faint">Normal</span>
      ),
    }),
    wc.accessor('stepTitle', {
      header: 'Step',
      size: 260,
      cell: (ctx) => {
        const r = ctx.row.original;
        return (
          <button onClick={() => navigate(`/tasks/${r.taskId}`)} className="text-left min-w-0 group">
            <span className="text-sm font-semibold text-ink truncate group-hover:text-brand-700 block">{r.stepTitle}</span>
            <span className="block text-xs text-ink-muted truncate">{r.clientName || 'Unknown client'} · {r.serviceName}</span>
          </button>
        );
      },
    }),
    // Due / lateness (E13-S03) — sortable. Sort key is days-until-due so overdue
    // (most negative) sorts to the top ascending; steps with no ETA sort last.
    wc.accessor((r) => {
      const d = dueInfo(r.dueAt).days;
      return d == null ? Number.POSITIVE_INFINITY : d;
    }, {
      id: 'due',
      header: 'Due',
      size: 120,
      cell: (ctx) => {
        const info = dueInfo(ctx.row.original.dueAt);
        if (info.tone === 'none') return <span className="text-xs text-ink-faint">—</span>;
        return <span className={`badge ${DUE_BADGE_CLASS[info.tone]}`}>{info.label}</span>;
      },
    }),
    wc.accessor('stepNumber', { header: 'Step #', size: 90, cell: (ctx) => <span className="badge bg-brand-50 text-brand-700">#{ctx.getValue()}</span> }),
    wc.accessor('bucket', {
      header: 'Queue',
      size: 150,
      cell: (ctx) => {
        const b = ctx.getValue();
        if (b === 'assigned') return <span className="badge bg-emerald-50 text-emerald-700">Assigned to me</span>;
        return <span className="badge bg-surface-card text-ink-muted">Available</span>;
      },
    }),
    wc.accessor((r) => r.updatedAt ?? '', { id: 'updatedAt', header: 'Updated', size: 120, cell: (ctx) => <span className="block truncate text-xs text-ink-muted">{timeAgo(ctx.getValue() as string)}</span> }),
  ] as ReturnType<typeof wc.accessor>[];
}

const ac = createColumnHelper<MyApprovalRow>();
function buildApprovalColumns(navigate: (to: string) => void) {
  return [
    ac.accessor('serviceName', {
      header: 'Service',
      size: 260,
      cell: (ctx) => {
        const r = ctx.row.original;
        return (
          <button onClick={() => navigate(`/tasks/${r.taskId}`)} className="text-left min-w-0 group">
            <span className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink truncate group-hover:text-brand-700">{r.serviceName}</span>
              {r.isUrgent && <span className="badge bg-red-50 text-red-600 inline-flex items-center gap-1 shrink-0"><Flame className="w-3 h-3" fill="currentColor" /> Urgent</span>}
            </span>
            <span className="block text-xs text-ink-muted truncate">{r.clientName || 'Unknown client'}</span>
          </button>
        );
      },
    }),
    ac.accessor('createdByName', { header: 'Created by', size: 160, cell: (ctx) => <span className="block truncate text-sm text-ink-muted">{ctx.getValue()}</span> }),
    ac.display({ id: 'status', header: 'Status', size: 150, cell: () => <span className="badge bg-amber-100 text-amber-800">Needs approval</span> }),
    ac.accessor((r) => r.createdAt ?? '', { id: 'createdAt', header: 'Created', size: 120, cell: (ctx) => <span className="block truncate text-xs text-ink-muted">{timeAgo(ctx.getValue() as string)}</span> }),
  ] as ReturnType<typeof ac.accessor>[];
}

/* ── Mobile cards ─────────────────────────────────────────────────────────── */

function StepCard({ row, navigate }: { row: MyStepRow; navigate: (to: string) => void }) {
  return (
    <div className="card p-4" onClick={() => navigate(`/tasks/${row.taskId}`)}>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-semibold text-ink truncate">{row.stepTitle}</p>
        {row.isUrgent && <span className="badge bg-red-50 text-red-600 inline-flex items-center gap-1"><Flame className="w-3 h-3" fill="currentColor" /> Urgent</span>}
        {(() => { const info = dueInfo(row.dueAt); return info.tone !== 'none' && (info.tone === 'overdue' || info.tone === 'today' || info.tone === 'soon') ? <span className={`badge ${DUE_BADGE_CLASS[info.tone]}`}>{info.label}</span> : null; })()}
        <span className="badge bg-brand-50 text-brand-700">#{row.stepNumber}</span>
        {row.bucket === 'assigned'
          ? <span className="badge bg-emerald-50 text-emerald-700">Mine</span>
          : <span className="badge bg-surface-card text-ink-muted">Available</span>}
      </div>
      <p className="text-xs text-ink-muted mt-1 truncate">{row.clientName || 'Unknown client'} · {row.serviceName}</p>
    </div>
  );
}

function ApprovalCard({ row, navigate }: { row: MyApprovalRow; navigate: (to: string) => void }) {
  return (
    <div className="card p-4 border-amber-200 bg-amber-50/40" onClick={() => navigate(`/tasks/${row.taskId}`)}>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-semibold text-ink truncate">{row.serviceName}</p>
        {row.isUrgent && <span className="badge bg-red-50 text-red-600 inline-flex items-center gap-1"><Flame className="w-3 h-3" fill="currentColor" /> Urgent</span>}
        <span className="badge bg-amber-100 text-amber-800">Needs approval</span>
      </div>
      <p className="text-xs text-ink-muted mt-1 truncate">{row.clientName || 'Unknown client'} · created by {row.createdByName}</p>
    </div>
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
