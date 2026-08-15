import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Loader2, Copy } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { getRecurringDue, duplicateTask, type RecurringDueRow } from '../../api/tasks';

/**
 * #167 — the reminder half of recurring matters.
 *
 * There is no scheduler, so nothing appears on its own: this lists the recurring
 * matters whose next occurrence has fallen due, and gives each a one-click
 * Duplicate that creates the next one and rolls the schedule forward. It doubles
 * as the safety net — a missed notification still leaves the renewal visible
 * here rather than silently lapsing.
 *
 * Renders nothing when nothing is due, so it stays out of the way.
 */
export default function RecurringDueBanner() {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: due = [] } = useQuery({
    queryKey: ['recurring-due'],
    queryFn: getRecurringDue,
    staleTime: 60_000,
  });

  const duplicate = useMutation({
    mutationFn: (taskId: string) => duplicateTask(taskId),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-due'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Next matter created.');
      if (created?.id) navigate(`/tasks/${created.id}`);
    },
    onError: (err: Error) => toast.error(err.message || 'Could not create the next matter.'),
  });

  if (due.length === 0) return null;

  const overdueLabel = (row: RecurringDueRow) => {
    const days = Math.floor((Date.now() - new Date(row.recurrenceNextDueAt).getTime()) / 86_400_000);
    if (days <= 0) return 'due today';
    return `${days} day${days === 1 ? '' : 's'} overdue`;
  };

  return (
    <div className="card p-4 mb-4 border-amber-200 bg-amber-50/60">
      <div className="flex items-start gap-2.5">
        <RefreshCw className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-900">
            {due.length} recurring {due.length === 1 ? 'matter is' : 'matters are'} due
          </p>
          <p className="text-xs text-amber-800 mt-0.5">
            Duplicating creates the next one and moves the reminder on a period.
          </p>

          <div className="mt-3 space-y-2">
            {due.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-3 bg-white/70 rounded-lg px-3 py-2"
              >
                <button
                  onClick={() => navigate(`/tasks/${row.id}`)}
                  className="min-w-0 text-left"
                >
                  <span className="block text-sm text-ink truncate">
                    {row.serviceName} · {row.clientName}
                    {row.organisation ? ` · ${row.organisation}` : ''}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {row.recurrence === 'monthly' ? 'Monthly' : 'Quarterly'} · {overdueLabel(row)}
                  </span>
                </button>
                <button
                  onClick={() => duplicate.mutate(row.id)}
                  disabled={duplicate.isPending}
                  className="btn-secondary shrink-0 inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {duplicate.isPending && duplicate.variables === row.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Copy className="w-3.5 h-3.5" />}
                  Duplicate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
