import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, Search, AlertTriangle, Trash2, Plus } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import CreateMatterModal from '../../components/tasks/CreateMatterModal';
import { useAuthStore } from '../../store/authStore';
import { getTasks, deleteTask } from '../../api/tasks';
import type { Task, TaskStatus, PaymentStatus } from '../../types/task';

/**
 * Unified tasks page for all roles. URL is role-neutral (/tasks); the view adapts
 * to role. Backend scopes tasks per role. Rows are designed to be scannable for an
 * admin juggling many clients: client is the anchor, with service, status, payment,
 * progress, and recency at a glance. Searchable by client / service.
 */
export default function TasksPage() {
  const role = useAuthStore((s) => s.role);
  const isClientView = role === 'client';
  const canDelete = role === 'admin';
  const canCreate = role === 'admin' || role === 'manager';
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (err: Error) => window.alert(err.message || 'Failed to delete matter.'),
  });

  // Vocabulary: a "Matter" is a client's running workflow instance (a case); its
  // steps are the "Tasks" staff perform. Clients see their Matter as a "Service".
  const copy: Record<string, { title: string; body: string }> = {
    admin:       { title: 'All Matters', body: 'Every client matter in the system.' },
    manager:     { title: 'Matters',     body: 'Matters visible to you and your team.' },
    team_member: { title: 'My Matters',  body: 'Matters with tasks assigned to you.' },
    client:      { title: 'My Services', body: 'Your active services and their status.' },
  };
  const c = copy[role ?? ''] ?? { title: 'Matters', body: '' };
  const nounPlural = isClientView ? 'services' : 'matters';

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    // Live-ish: poll so the list reflects actions taken by another role/window
    // without a manual refresh. Short staleTime so focus-refetch also fires.
    staleTime: 5_000,
    refetchInterval: 15_000,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? tasks.filter((t) =>
          (t.clientName ?? '').toLowerCase().includes(q) ||
          (t.serviceName ?? t.workflowType ?? '').toLowerCase().includes(q) ||
          (t.status ?? '').toLowerCase().includes(q))
      : tasks;
    // Urgent first, then most recently updated.
    return [...rows].sort((a, b) => {
      if (!!a.isUrgent !== !!b.isUrgent) return a.isUrgent ? -1 : 1;
      return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
    });
  }, [tasks, search]);

  return (
    <PageShell
      title={c.title}
      subtitle={c.body}
      action={canCreate ? (
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Matter</span><span className="sm:hidden">Create</span>
        </button>
      ) : undefined}
    >
      {showCreate && <CreateMatterModal onClose={() => setShowCreate(false)} />}
      {!isClientView && tasks.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search by client, matter, or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      )}

      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading {nounPlural}…</span>
        </div>
      ) : error ? (
        <div className="card p-12 text-center text-sm text-red-600">
          Failed to load {nounPlural}. {(error as Error).message}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <ClipboardList className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">
            {search.trim() ? `No ${nounPlural} match “${search.trim()}”.` : `No ${nounPlural} yet`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              clientView={isClientView}
              canDelete={canDelete}
              deleting={deleteMutation.isPending}
              onDelete={(id) => {
                if (window.confirm(`Delete this matter for ${t.clientName ?? 'client'}? This removes all its steps and history and cannot be undone.`)) {
                  deleteMutation.mutate(id);
                }
              }}
            />
          ))}
        </div>
      )}
    </PageShell>
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
};

// Human-friendly status labels (the raw enum is shown otherwise).
const STATUS_LABEL: Partial<Record<TaskStatus, string>> = {
  pending_admin_approval: 'Awaiting approval',
};

const PAYMENT: Record<PaymentStatus, { label: string; cls: string }> = {
  not_paid:   { label: 'Unpaid',     cls: 'bg-red-50 text-red-700' },
  part_paid:  { label: 'Part paid',  cls: 'bg-amber-50 text-amber-700' },
  fully_paid: { label: 'Paid',       cls: 'bg-emerald-50 text-emerald-700' },
};

function initials(name?: string) {
  const n = (name ?? '').trim();
  if (!n) return '?';
  return n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return '';
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function TaskRow({ task, clientView, canDelete, deleting, onDelete }: {
  task: Task;
  clientView: boolean;
  canDelete: boolean;
  deleting: boolean;
  onDelete: (id: string) => void;
}) {
  const total = task.totalSteps ?? task.steps?.length ?? 0;
  const isDone = task.status === 'completed';
  // Clamp the current step for display: a completed matter parks on the synthetic
  // final step (9999); show it as the last real step.
  const displayStep = isDone ? total : Math.min(task.currentStepNumber, total || task.currentStepNumber);
  const pct = isDone ? 100 : (total ? Math.round(((displayStep - 1) / total) * 100) : 0);
  const payment = PAYMENT[task.paymentStatus] ?? PAYMENT.not_paid;
  // Staff anchor on the CLIENT; clients anchor on the SERVICE (their own name is redundant).
  const primary = clientView ? (task.serviceName || task.workflowType) : (task.clientName || 'Unknown client');
  const secondary = clientView ? '' : (task.serviceName || task.workflowType);

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="group card p-4 hover:shadow-card-hover hover:border-ink/15 transition-all"
    >
      <div className="flex items-center gap-3">
        {!clientView && (
          <div className="w-9 h-9 rounded-full bg-surface-card flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-ink-muted">{initials(task.clientName)}</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-ink truncate">{primary}</p>
            {task.isUrgent && (
              <span className="badge bg-red-50 text-red-700 inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Urgent
              </span>
            )}
            <span className={`badge ${STATUS_BADGE[task.status] ?? 'bg-surface-card text-ink-muted'}`}>
              {STATUS_LABEL[task.status] ?? task.status}
            </span>
            <span className={`badge ${payment.cls}`}>{payment.label}</span>
          </div>

          {secondary && <p className="text-xs text-ink-muted mt-0.5 truncate">{secondary}</p>}

          {/* Progress */}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 flex-1 max-w-[220px] rounded-full bg-surface-card overflow-hidden">
              <div className="h-full bg-ink/70 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] text-ink-faint shrink-0">
              {isDone ? `Completed · ${total} of ${total}` : `Step ${displayStep} of ${total}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[11px] text-ink-faint">{timeAgo(task.updatedAt)}</span>
          <div className="flex items-center gap-1">
            {canDelete && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(task.id); }}
                disabled={deleting}
                title="Delete matter"
                className="p-1.5 rounded-lg text-ink-faint hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <ArrowRight className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
