import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPendingTasksReport } from '../../api/reports';
import type { ReportFilters, PendingTask } from '../../api/reports';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UrgentBadge from '../../components/tasks/UrgentBadge';

const REASON_LABELS: Record<PendingTask['pendingReason'], string> = {
  payment: 'Payment Pending',
  document: 'Document Pending',
  client_action: 'Client Action Pending',
  government: 'Government Pending',
};

const REASON_COLOURS: Record<PendingTask['pendingReason'], string> = {
  payment: 'bg-red-100 text-red-700',
  document: 'bg-orange-100 text-orange-700',
  client_action: 'bg-yellow-100 text-yellow-700',
  government: 'bg-blue-100 text-blue-700',
};

export default function PendingTasksReport() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-pending', filters],
    queryFn: () => getPendingTasksReport(filters),
  });

  // Group by pending reason
  const groups = data
    ? (['payment', 'document', 'client_action', 'government'] as const).map((reason) => ({
        reason,
        tasks: data.filter((t) => t.pendingReason === reason),
      })).filter((g) => g.tasks.length > 0)
    : [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-indigo-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-gray-900">Pending Tasks</h1>
      </div>

      <ReportFiltersBar filters={filters} onChange={setFilters} />

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm">Failed to load report.</p>}

      {groups.length === 0 && !isLoading && (
        <p className="text-gray-400 text-sm mt-8 text-center">No pending tasks.</p>
      )}

      {groups.map(({ reason, tasks }) => (
        <section key={reason} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs ${REASON_COLOURS[reason]}`}>
              {REASON_LABELS[reason]}
            </span>
            <span className="text-gray-400">({tasks.length})</span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                <tr>
                  {['Task ID', 'Client', 'Service', 'Step', 'Assigned', ''].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs text-gray-500">{task.id.slice(0, 8)}…</td>
                    <td className="px-4 py-2">{task.clientUid}</td>
                    <td className="px-4 py-2">{task.workflowType}</td>
                    <td className="px-4 py-2">{task.currentStepNumber}</td>
                    <td className="px-4 py-2">{task.assignedTo ?? '—'}</td>
                    <td className="px-4 py-2">{task.isUrgent && <UrgentBadge compact />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
