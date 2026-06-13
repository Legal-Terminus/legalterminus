import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight } from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import { useAuthStore } from '../../store/authStore';
import { getTasks } from '../../api/tasks';
import type { Task, TaskStatus } from '../../types/task';

/**
 * Unified tasks page for all roles. The URL is role-neutral (/tasks); the view
 * adapts to the current role. Lists tasks (backend already scopes them per role:
 * clients see their own, team members see assigned). Each row links to the task
 * detail page (steps).
 */
export default function TasksPage() {
  const role = useAuthStore((s) => s.role);

  const copy: Record<string, { title: string; body: string }> = {
    admin:       { title: 'All Tasks',   body: 'Every workflow task in the system.' },
    manager:     { title: 'Tasks',       body: 'Tasks visible to you and your team.' },
    team_member: { title: 'My Tasks',    body: 'Tasks assigned to you.' },
    client:      { title: 'My Services', body: 'Your active service tasks and their status.' },
  };
  const c = copy[role ?? ''] ?? { title: 'Tasks', body: '' };

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    staleTime: 30_000,
  });

  return (
    <PageShell title={c.title} subtitle={c.body}>
      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading tasks…</span>
        </div>
      ) : error ? (
        <div className="card p-12 text-center text-sm text-red-600">
          Failed to load tasks. {(error as Error).message}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <ClipboardList className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">No tasks yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
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
};

function TaskRow({ task }: { task: Task }) {
  const total = task.totalSteps ?? task.steps?.length ?? 0;
  return (
    <Link
      to={`/tasks/${task.id}`}
      className="group card p-4 flex items-center justify-between hover:shadow-card-hover hover:border-ink/15 transition-all"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-ink truncate">
            {task.serviceName || task.workflowType}
          </p>
          <span className={`badge ${STATUS_BADGE[task.status] ?? 'bg-surface-card text-ink-muted'}`}>
            {task.status}
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-0.5 truncate">
          {task.clientName ? `${task.clientName} · ` : ''}
          Step {task.currentStepNumber}{total ? ` of ${total}` : ''}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 transition-all shrink-0" />
    </Link>
  );
}
