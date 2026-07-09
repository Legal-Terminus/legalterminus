import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getPendingTasksReport } from '../../api/reports';
import type { ReportFilters, PendingTask } from '../../api/reports';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import type { ColumnDef } from '@tanstack/react-table';
import DataGrid from '../../components/common/DataGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { taskReportColumns, taskReportGlobalFilter } from './reportColumns';

const REASON_LABELS: Record<PendingTask['pendingReason'], string> = {
  approval: 'Awaiting Approval',
  payment: 'Payment Pending',
  document: 'Document Pending',
  client_action: 'Client Action Pending',
  government: 'Government Pending',
};

const REASON_COLOURS: Record<PendingTask['pendingReason'], string> = {
  approval: 'bg-amber-100 text-amber-800',
  payment: 'bg-red-100 text-red-700',
  document: 'bg-orange-100 text-orange-700',
  client_action: 'bg-yellow-100 text-yellow-700',
  government: 'bg-blue-100 text-blue-700',
};

const REASON_ORDER = ['approval', 'payment', 'document', 'client_action', 'government'] as const;

export default function PendingTasksReport() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-pending', filters],
    queryFn: () => getPendingTasksReport(filters),
  });
  // Columns are defined for Task; PendingTask extends Task so they apply directly.
  const columns = useMemo(() => taskReportColumns() as unknown as ColumnDef<PendingTask, unknown>[], []);

  const groups = data
    ? REASON_ORDER.map((reason) => ({ reason, tasks: data.filter((t) => t.pendingReason === reason) }))
        .filter((g) => g.tasks.length > 0)
    : [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">Pending Matters</h1>
      </div>

      <ReportFiltersBar filters={filters} onChange={setFilters} criteria={{ status: false }} />

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm mt-4">Failed to load report.</p>}

      {groups.length === 0 && !isLoading && (
        <p className="text-gray-400 text-sm mt-8 text-center">No pending matters.</p>
      )}

      <div className="mt-4 flex flex-col gap-8">
        {groups.map(({ reason, tasks }) => (
          <section key={reason}>
            <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${REASON_COLOURS[reason]}`}>
                {REASON_LABELS[reason]}
              </span>
              <span className="text-gray-400">({tasks.length})</span>
            </h2>
            <DataGrid<PendingTask>
          tableId="rpt-pending"
              data={tasks}
              columns={columns}
              getRowId={(t) => t.id}
              onRowClick={(t) => navigate(`/tasks/${t.id}`)}
              searchable={false}
              pageSize={10}
              globalFilterFn={taskReportGlobalFilter}
              emptyLabel="None"
            />
          </section>
        ))}
      </div>
    </div>
  );
}
