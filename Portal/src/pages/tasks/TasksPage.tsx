import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { ArrowRight, Flame, Trash2, Plus } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import DataGrid from '../../components/common/DataGrid';
import { useConfirm } from '../../components/common/confirmContext';
import { useToast } from '../../components/common/toastContext';
import { dueInfo, DUE_BADGE_CLASS } from '../../lib/dueDate';
import CreateMatterModal from '../../components/tasks/CreateMatterModal';
import { useAuthStore } from '../../store/authStore';
import { getTasks, deleteTask } from '../../api/tasks';
import type { Task, TaskStatus, PaymentStatus } from '../../types/task';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'pending_admin_approval', label: 'Pending admin approval' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Stopped' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
];
const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'fully_paid', label: 'Fully paid' },
  { value: 'part_paid', label: 'Part paid' },
  { value: 'not_paid', label: 'Not paid' },
];

/**
 * Unified Matters page for all roles, rendered as a sortable/searchable/paginated
 * grid (shared DataGrid — same UX as Users). Backend scopes rows per role. Staff
 * anchor on the client; clients see their Matter framed as a "Service".
 */
export default function TasksPage() {
  const role = useAuthStore((s) => s.role);
  const isClientView = role === 'client';
  const canDelete = role === 'admin';
  const canCreate = role === 'admin' || role === 'manager';
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (err: Error) => toast.error(err.message || 'Failed to delete matter.'),
  });

  const copy: Record<string, { title: string; body: string }> = {
    admin:       { title: 'All Matters', body: 'Every client matter in the system.' },
    manager:     { title: 'Matters',     body: 'Matters visible to you and your team.' },
    team_member: { title: 'My Matters',  body: 'Matters with tasks assigned to you.' },
    client:      { title: 'My Services', body: 'Your active services and their status.' },
  };
  const c = copy[role ?? ''] ?? { title: 'Matters', body: '' };

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    staleTime: 5_000,
    refetchInterval: 15_000,
  });

  // #91: structured multi-criteria filters (Status + Service), AND-combined,
  // composing with the free-text search box below. All client-side — the grid
  // already has the full role-scoped row set from getTasks().
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  // Service options are derived from the tasks THEMSELVES (serviceName), not the
  // full catalog — `workflowType` is a definition id, not the catalog's serviceKey,
  // so filtering against catalog keys wouldn't match. Deriving from actual rows
  // also naturally excludes services with no matters.
  const serviceNames = useMemo(
    () => [...new Set(tasks.map((t) => t.serviceName ?? t.workflowType).filter((v): v is string => !!v))].sort(),
    [tasks],
  );

  // Urgent-first default ordering (DataGrid sorting can override per-column),
  // then the structured filters (AND).
  const rows = useMemo(
    () => [...tasks]
      .filter((t) => !statusFilter || t.status === statusFilter)
      .filter((t) => !serviceFilter || (t.serviceName ?? t.workflowType) === serviceFilter)
      .filter((t) => !paymentFilter || t.paymentStatus === paymentFilter)
      .sort((a, b) => {
        if (!!a.isUrgent !== !!b.isUrgent) return a.isUrgent ? -1 : 1;
        return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
      }),
    [tasks, statusFilter, serviceFilter, paymentFilter],
  );
  const hasAnyFilter = !!(statusFilter || serviceFilter || paymentFilter);

  const onDelete = async (task: Task) => {
    const ok = await confirm({
      title: 'Delete matter?',
      message: `This removes the matter for ${task.clientName ?? 'this client'}, including all its steps and history. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (ok) deleteMutation.mutate(task.id);
  };

  const columns = useMemo(() => buildColumns({ isClientView, canDelete, onDelete, deleting: deleteMutation.isPending, navigate }), [isClientView, canDelete, deleteMutation.isPending]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageShell
      title={c.title}
      subtitle={c.body}
      action={canCreate ? (
        <button onClick={() => setShowCreate(true)} className="btn-primary inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Matter</span><span className="sm:hidden">Create</span>
        </button>
      ) : undefined}
    >
      {showCreate && <CreateMatterModal onClose={() => setShowCreate(false)} />}
      <DataGrid<Task>
          tableId="tasks"
        data={rows}
        columns={columns}
        getRowId={(t) => t.id}
        onRowClick={(t) => navigate(`/tasks/${t.id}`)}
        toolbar={
          // #91: structured multi-criteria filters — Status / Service / Payment,
          // AND-combined; the search box above composes on top for free text.
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-500">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Filter by status">
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {serviceNames.length > 1 && (
              <div className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-500">Service</label>
                <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Filter by service">
                  <option value="">All services</option>
                  {serviceNames.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {!isClientView && (
              <div className="flex flex-col gap-0.5">
                <label className="text-xs text-gray-500">Payment</label>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Filter by payment">
                  <option value="">Any payment</option>
                  {PAYMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}
            <button
              onClick={() => { setStatusFilter(''); setServiceFilter(''); setPaymentFilter(''); }}
              disabled={!hasAnyFilter}
              className="self-end rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        }
        searchPlaceholder={isClientView ? 'Search by service or status…' : 'Search by client, service, professional, or status…'}
        globalFilterFn={(row, _id, q) => {
          const t = row.original;
          const s = q.toLowerCase();
          return (
            (t.clientName ?? '').toLowerCase().includes(s) ||
            (t.serviceName ?? t.workflowType ?? '').toLowerCase().includes(s) ||
            (t.professionalName ?? '').toLowerCase().includes(s) || // #85
            (t.status ?? '').toLowerCase().includes(s)
          );
        }}
        isLoading={isLoading}
        error={error as Error | null}
        emptyLabel={isClientView ? 'No services yet' : 'No matters yet'}
        loadingLabel={`Loading ${isClientView ? 'services' : 'matters'}…`}
        renderMobileCard={(t) => <MatterCard task={t} isClientView={isClientView} canDelete={canDelete} deleting={deleteMutation.isPending} onDelete={onDelete} />}
      />
    </PageShell>
  );
}

const col = createColumnHelper<Task>();

function buildColumns({ isClientView, canDelete, onDelete, deleting, navigate }: {
  isClientView: boolean;
  canDelete: boolean;
  onDelete: (t: Task) => void;
  deleting: boolean;
  navigate: (to: string) => void;
}) {
  return [
    col.accessor((t) => (isClientView ? (t.serviceName || t.workflowType) : (t.clientName || 'Unknown client')), {
      id: 'primary',
      header: isClientView ? 'Service' : 'Client',
      size: 240,
      cell: (ctx) => {
        const t = ctx.row.original;
        const secondary = isClientView ? '' : (t.serviceName || t.workflowType);
        return (
          <button onClick={() => navigate(`/tasks/${t.id}`)} className="text-left min-w-0 group">
            <span className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink truncate group-hover:text-brand-700">{ctx.getValue() as string}</span>
              {t.isUrgent && (
                <span className="badge bg-red-50 text-red-600 inline-flex items-center gap-1 shrink-0">
                  <Flame className="w-3 h-3" fill="currentColor" /> Urgent
                </span>
              )}
            </span>
            {secondary && <span className="block text-xs text-ink-muted truncate">{secondary}</span>}
          </button>
        );
      },
    }),
    col.accessor('status', {
      header: 'Status',
      size: 150,
      cell: (ctx) => (
        <span className={`badge ${STATUS_BADGE[ctx.getValue()] ?? 'bg-surface-card text-ink-muted'}`}>
          {STATUS_LABEL[ctx.getValue()] ?? ctx.getValue()}
        </span>
      ),
    }),
    col.accessor('paymentStatus', {
      header: 'Payment',
      size: 120,
      cell: (ctx) => {
        const p = PAYMENT[ctx.getValue()] ?? PAYMENT.not_paid;
        return <span className={`badge ${p.cls}`}>{p.label}</span>;
      },
    }),
    // Professional (#85) — staff view only.
    ...(isClientView ? [] : [
      col.accessor((t) => t.professionalName ?? '', {
        id: 'professional',
        header: 'Professional',
        size: 150,
        cell: (ctx) => {
          const v = ctx.getValue() as string;
          return v ? <span className="text-sm text-ink truncate">{v}</span> : <span className="text-xs text-ink-faint">—</span>;
        },
      }),
    ]),
    col.accessor((t) => t.currentStepNumber, {
      id: 'progress',
      header: 'Progress',
      size: 180,
      cell: (ctx) => {
        const t = ctx.row.original;
        const total = t.totalSteps ?? t.steps?.length ?? 0;
        const isDone = t.status === 'completed';
        const displayStep = isDone ? total : Math.min(t.currentStepNumber, total || t.currentStepNumber);
        const pct = isDone ? 100 : (total ? Math.round(((displayStep - 1) / total) * 100) : 0);
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-surface-card overflow-hidden">
              <div className="h-full bg-ink/70 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] text-ink-faint shrink-0">
              {isDone ? `${total}/${total}` : `${displayStep}/${total}`}
            </span>
          </div>
        );
      },
    }),
    // Due / lateness (E13-S03) — staff only; clients don't see an internal SLA.
    // Sort key = days-to-due so overdue sorts first ascending; untracked sorts last.
    ...(isClientView ? [] : [
      col.accessor((t) => {
        const d = dueInfo(t.matterDueAt).days;
        return d == null ? Number.POSITIVE_INFINITY : d;
      }, {
        id: 'due',
        header: 'Due',
        size: 120,
        // #91: a value picker over raw day-counts is meaningless — opt out.
        meta: { disableColumnFilter: true },
        cell: (ctx) => {
          const info = dueInfo(ctx.row.original.matterDueAt);
          if (info.tone === 'none') return <span className="text-xs text-ink-faint">—</span>;
          return <span className={`badge ${DUE_BADGE_CLASS[info.tone]}`}>{info.label}</span>;
        },
      }),
    ]),
    col.accessor((t) => t.updatedAt ?? '', {
      id: 'updatedAt',
      header: 'Updated',
      size: 120,
      // #91: every timestamp is unique — a distinct-value picker is useless here.
      meta: { disableColumnFilter: true },
      cell: (ctx) => <span className="block truncate text-xs text-ink-muted">{timeAgo(ctx.getValue() as string)}</span>,
    }),
    col.display({
      id: 'actions',
      header: () => <span className="block text-right">Actions</span>,
      size: 110,
      cell: (ctx) => {
        const t = ctx.row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${t.id}`); }} className="p-2 rounded-xl text-ink-faint hover:text-ink hover:bg-surface-soft transition-colors" title="Open">
              <ArrowRight className="w-4 h-4" />
            </button>
            {canDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(t); }} disabled={deleting} className="p-2 rounded-xl text-ink-faint hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40" title="Delete matter">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    }),
  ] as ReturnType<typeof col.accessor>[];
}

function MatterCard({ task, isClientView, canDelete, deleting, onDelete }: {
  task: Task; isClientView: boolean; canDelete: boolean; deleting: boolean; onDelete: (t: Task) => void;
}) {
  const total = task.totalSteps ?? task.steps?.length ?? 0;
  const isDone = task.status === 'completed';
  const displayStep = isDone ? total : Math.min(task.currentStepNumber, total || task.currentStepNumber);
  const pct = isDone ? 100 : (total ? Math.round(((displayStep - 1) / total) * 100) : 0);
  const payment = PAYMENT[task.paymentStatus] ?? PAYMENT.not_paid;
  const primary = isClientView ? (task.serviceName || task.workflowType) : (task.clientName || 'Unknown client');
  const secondary = isClientView ? '' : (task.serviceName || task.workflowType);

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-ink truncate">{primary}</p>
            {task.isUrgent && <span className="badge bg-red-50 text-red-600 inline-flex items-center gap-1"><Flame className="w-3 h-3" fill="currentColor" /> Urgent</span>}
          </div>
          {secondary && <p className="text-xs text-ink-muted mt-0.5 truncate">{secondary}</p>}
        </div>
        {canDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(task); }} disabled={deleting} className="p-1.5 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50 disabled:opacity-40 shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`badge ${STATUS_BADGE[task.status] ?? 'bg-surface-card text-ink-muted'}`}>{STATUS_LABEL[task.status] ?? task.status}</span>
        <span className={`badge ${payment.cls}`}>{payment.label}</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div className="h-1.5 flex-1 rounded-full bg-surface-card overflow-hidden">
          <div className="h-full bg-ink/70 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] text-ink-faint shrink-0">{isDone ? `${total}/${total}` : `${displayStep}/${total}`}</span>
      </div>
    </div>
  );
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  pending: 'bg-surface-card text-ink-muted',
  active: 'bg-brand-50 text-brand-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
  on_hold: 'bg-amber-50 text-amber-700',
  pending_admin_approval: 'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-700',
  archived: 'bg-surface-card text-ink-faint',
};

const STATUS_LABEL: Partial<Record<TaskStatus, string>> = {
  pending_admin_approval: 'Awaiting approval',
  cancelled: 'Stopped',
  archived: 'Archived',
};

const PAYMENT: Record<PaymentStatus, { label: string; cls: string }> = {
  not_paid:   { label: 'Unpaid',     cls: 'bg-red-50 text-red-700' },
  part_paid:  { label: 'Part paid',  cls: 'bg-amber-50 text-amber-700' },
  fully_paid: { label: 'Paid',       cls: 'bg-emerald-50 text-emerald-700' },
};

function timeAgo(iso?: string): string {
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
