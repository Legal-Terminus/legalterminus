import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTasksReport } from '../../api/reports';
import type { ReportFilters } from '../../api/reports';
import type { Task } from '../../types/task';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import DataGrid from '../../components/common/DataGrid';
import { taskReportColumns, taskReportGlobalFilter } from './reportColumns';

export default function AllTasksReport() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['report-all-tasks', filters],
    queryFn: () => getAllTasksReport(filters),
  });
  const columns = useMemo(() => taskReportColumns(), []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">All Matters</h1>
      </div>

      {/* #91: Status / Service / Payment / date filters are built into the bar and
          combine with AND; the search box composes on top for client/assignee. */}
      <ReportFiltersBar filters={filters} onChange={setFilters} />

      <div className="mt-4">
        <DataGrid<Task>
          tableId="rpt-all-tasks"
          data={data}
          columns={columns}
          getRowId={(t) => t.id}
          onRowClick={(t) => navigate(`/tasks/${t.id}`)}
          searchPlaceholder="Search by client, service, or status…"
          globalFilterFn={taskReportGlobalFilter}
          isLoading={isLoading}
          error={error as Error | null}
          emptyLabel="No matters found"
        />
      </div>
    </div>
  );
}
