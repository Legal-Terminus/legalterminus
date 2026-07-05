import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTasksReport } from '../../api/reports';
import type { ReportFilters } from '../../api/reports';
import type { Task } from '../../types/task';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import DataGrid from '../../components/common/DataGrid';
import { taskReportColumns, taskReportGlobalFilter } from './reportColumns';

const STATUS_OPTIONS = ['', 'pending', 'active', 'completed', 'cancelled', 'on_hold', 'pending_admin_approval', 'rejected'];
const PAYMENT_OPTIONS = ['', 'not_paid', 'part_paid', 'fully_paid'];

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

      <ReportFiltersBar
        filters={filters}
        onChange={setFilters}
        extraFields={
          <>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-500">Status</label>
              <select
                value={filters.status ?? ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-500">Payment</label>
              <select
                value={filters.paymentStatus ?? ''}
                onChange={(e) => setFilters({ ...filters, paymentStatus: (e.target.value as ReportFilters['paymentStatus']) || undefined })}
                className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
          </>
        }
      />

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
