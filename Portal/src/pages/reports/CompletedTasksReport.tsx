import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCompletedTasksReport } from '../../api/reports';
import type { ReportFilters } from '../../api/reports';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CompletedTasksReport() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-completed', filters],
    queryFn: () => getCompletedTasksReport(filters),
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/admin/reports" className="text-sm text-indigo-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-gray-900">Completed Tasks</h1>
      </div>

      <ReportFiltersBar filters={filters} onChange={setFilters} />

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm">Failed to load report.</p>}
      {data && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                {['Task ID', 'Client', 'Service', 'Assigned To', 'Payment', 'Completed At'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No completed tasks.</td></tr>
              )}
              {data.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{task.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">{task.clientUid}</td>
                  <td className="px-4 py-3">{task.workflowType}</td>
                  <td className="px-4 py-3">{task.assignedTo ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      task.paymentStatus === 'fully_paid' ? 'bg-green-100 text-green-700' :
                      task.paymentStatus === 'part_paid'  ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                    }`}>{task.paymentStatus ?? 'not_paid'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
