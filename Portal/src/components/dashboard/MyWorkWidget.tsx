import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Flame, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { getMySteps } from '../../api/tasks';
import { dueInfo } from '../../lib/dueDate';

/**
 * Staff dashboard widget: the things waiting on YOU right now — urgent assigned
 * steps and matters awaiting your approval. Reuses the My Tasks feed
 * (`/api/tasks/my-steps`) so counts match the worklist exactly. Renders nothing
 * when there's nothing pressing (keeps a clean dashboard for a quiet day).
 *
 * Powers E11-S03 (urgent visibility) and E11-S04 (approvals as worklist items).
 */
export default function MyWorkWidget() {
  const { data } = useQuery({
    queryKey: ['my-steps'],
    queryFn: getMySteps,
    staleTime: 5_000,
    refetchInterval: 30_000,
  });

  const approvals = data?.approvals ?? [];
  // Urgent items that are assigned to ME (the "waiting on me" framing).
  const urgentMine = (data?.data ?? []).filter((r) => r.isUrgent && r.bucket === 'assigned');
  // Overdue items assigned to ME (E13-S03) — past their step due date.
  const overdueMine = (data?.data ?? []).filter(
    (r) => r.bucket === 'assigned' && dueInfo(r.dueAt).tone === 'overdue',
  );

  if (approvals.length === 0 && urgentMine.length === 0 && overdueMine.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      {urgentMine.length > 0 && (
        <div className="card p-4 border-red-200 bg-red-50/40">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-red-600" fill="currentColor" />
            <h3 className="text-sm font-semibold text-red-800">
              Urgent — waiting on you ({urgentMine.length})
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {urgentMine.slice(0, 4).map((r) => (
              <li key={`${r.taskId}:${r.stepNumber}`}>
                <Link
                  to={`/tasks/${r.taskId}`}
                  className="group flex items-center justify-between gap-2 text-sm text-ink hover:text-red-700"
                >
                  <span className="truncate">
                    {r.stepTitle} · <span className="text-ink-muted">{r.clientName}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-faint opacity-0 group-hover:opacity-100 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          {urgentMine.length > 4 && (
            <Link to="/my-tasks" className="text-xs text-red-700 hover:underline mt-2 inline-block">
              View all {urgentMine.length} →
            </Link>
          )}
        </div>
      )}

      {overdueMine.length > 0 && (
        <div className="card p-4 border-red-200 bg-red-50/40">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-semibold text-red-800">
              Overdue — waiting on you ({overdueMine.length})
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {overdueMine.slice(0, 4).map((r) => (
              <li key={`${r.taskId}:${r.stepNumber}`}>
                <Link
                  to={`/tasks/${r.taskId}`}
                  className="group flex items-center justify-between gap-2 text-sm text-ink hover:text-red-700"
                >
                  <span className="truncate">
                    {r.stepTitle} · <span className="text-ink-muted">{r.clientName}</span>
                  </span>
                  <span className="text-xs text-red-600 shrink-0">{dueInfo(r.dueAt).label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {overdueMine.length > 4 && (
            <Link to="/my-tasks" className="text-xs text-red-700 hover:underline mt-2 inline-block">
              View all {overdueMine.length} →
            </Link>
          )}
        </div>
      )}

      {approvals.length > 0 && (
        <div className="card p-4 border-amber-200 bg-amber-50/40">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">
              Awaiting your approval ({approvals.length})
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {approvals.slice(0, 4).map((a) => (
              <li key={a.taskId}>
                <Link
                  to={`/tasks/${a.taskId}`}
                  className="group flex items-center justify-between gap-2 text-sm text-ink hover:text-amber-800"
                >
                  <span className="truncate">
                    {a.serviceName} · <span className="text-ink-muted">{a.clientName}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-faint opacity-0 group-hover:opacity-100 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          {approvals.length > 4 && (
            <Link to="/my-tasks" className="text-xs text-amber-800 hover:underline mt-2 inline-block">
              View all {approvals.length} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
