import PageShell from '../../components/common/PageShell';
import { useAuthStore } from '../../store/authStore';

/**
 * Unified tasks page for all roles. The URL is role-neutral (/tasks); the view
 * adapts to the current role. Replace the per-role bodies with real task UIs as
 * they are built (admin/manager: full table; team: assigned-step queue;
 * client: own service tasks).
 */
export default function TasksPage() {
  const role = useAuthStore((s) => s.role);

  const copy: Record<string, { title: string; body: string }> = {
    admin:       { title: 'All Tasks',  body: 'Task management table for all workflow tasks.' },
    manager:     { title: 'Tasks',      body: 'Tasks visible to you and your team.' },
    team_member: { title: 'My Tasks',   body: 'Steps assigned to you across all tasks.' },
    client:      { title: 'My Services',body: 'Your active service tasks and their current status.' },
  };

  const c = copy[role ?? ''] ?? { title: 'Tasks', body: '' };

  return (
    <PageShell title={c.title}>
      <p className="text-sm text-ink-muted">{c.body}</p>
    </PageShell>
  );
}
