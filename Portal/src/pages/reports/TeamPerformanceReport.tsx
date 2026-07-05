import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { getTeamPerformance, type TeamPerformanceRow } from '../../api/reports';
import DataGrid from '../../components/common/DataGrid';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';

const col = createColumnHelper<TeamPerformanceRow>();

// #84 report 4 — team productivity.
export default function TeamPerformanceReport() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['report-team-performance'],
    queryFn: getTeamPerformance,
    refetchInterval: 30_000,
  });

  const columns = useMemo(() => [
    col.accessor('name', { header: 'Team Member', size: 180, cell: (c) => <span className="text-sm font-medium text-ink truncate">{c.getValue()}</span> }),
    col.accessor('assigned', { header: 'Assigned', size: 100, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor('completed', { header: 'Completed', size: 100, cell: (c) => <span className="text-sm text-emerald-700">{c.getValue()}</span> }),
    col.accessor('pending', { header: 'Pending', size: 100, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor('delayed', { header: 'Delayed', size: 100, cell: (c) => <span className={`text-sm ${c.getValue() ? 'text-red-600' : 'text-ink-muted'}`}>{c.getValue()}</span> }),
    col.accessor('pendingApproval', { header: 'Pending Approval', size: 130, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor((r) => r.avgCompletionDays, { id: 'avg', header: 'Avg Completion', size: 130, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() == null ? '—' : `${c.getValue()} d`}</span> }),
  ] as ReturnType<typeof col.accessor>[], []);

  const onExport = async () => {
    const cols: ExportColumn<TeamPerformanceRow>[] = [
      { header: 'Team Member', value: (r) => r.name },
      { header: 'Assigned', value: (r) => r.assigned },
      { header: 'Completed', value: (r) => r.completed },
      { header: 'Pending', value: (r) => r.pending },
      { header: 'Delayed', value: (r) => r.delayed },
      { header: 'Pending Approval', value: (r) => r.pendingApproval },
      { header: 'Avg Completion (days)', value: (r) => r.avgCompletionDays ?? '' },
    ];
    await exportToXlsx(data, cols, 'team-performance', 'Team Performance');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink">Team Performance</h1>
        </div>
        <button onClick={onExport} className="btn-primary inline-flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>
      <DataGrid<TeamPerformanceRow>
          tableId="rpt-team-perf"
        data={data}
        columns={columns}
        getRowId={(r) => r.uid}
        searchPlaceholder="Search team member…"
        globalFilterFn={(row, _id, q) => row.original.name.toLowerCase().includes(q.toLowerCase())}
        isLoading={isLoading}
        error={error as Error | null}
        emptyLabel="No team data"
      />
    </div>
  );
}
