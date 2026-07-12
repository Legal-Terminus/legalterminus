import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { getUnassignedReport } from '../../api/reports';
import type { UnassignedRow } from '../../api/reports';
import DataGrid from '../../components/common/DataGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UrgentBadge from '../../components/tasks/UrgentBadge';
import { dueInfo, DUE_BADGE_CLASS } from '../../lib/dueDate';

/**
 * Unassigned Tasks report. Active steps with no assignee across all matters — the
 * shared pickup pool, for admin/manager to triage and assign. Companion to #50
 * (these also appear as "Available" in each staff member's My Tasks).
 */
const col = createColumnHelper<UnassignedRow>();

function columns(): ColumnDef<UnassignedRow, unknown>[] {
  return [
    col.accessor((r) => r.clientName, { id: 'client', header: 'Client', size: 170,
      cell: (c) => (
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink truncate">{c.getValue() as string}</span>
          {c.row.original.isUrgent && <UrgentBadge compact />}
        </span>
      ) }),
    col.accessor((r) => r.serviceName, { id: 'service', header: 'Service', size: 180,
      cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue() as string}</span> }),
    col.accessor((r) => r.stepTitle, { id: 'step', header: 'Active step', size: 200,
      cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue() as string}</span> }),
    col.accessor((r) => r.assignedRole ?? '—', { id: 'role', header: 'Role', size: 130,
      cell: (c) => <span className="text-sm text-ink-muted">{(c.getValue() as string).replace(/_/g, ' ')}</span> }),
    col.accessor((r) => r.dueAt ?? '', { id: 'due', header: 'Due', size: 120, meta: { disableColumnFilter: true },
      cell: (c) => {
        const info = dueInfo(c.getValue() as string);
        return info.tone === 'none' ? <span className="text-xs text-ink-faint">—</span>
          : <span className={`badge ${DUE_BADGE_CLASS[info.tone]}`}>{info.label}</span>;
      } }),
  ];
}

export default function UnassignedTasksReport() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-unassigned'],
    queryFn: getUnassignedReport,
  });
  const cols = useMemo(() => columns(), []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">Unassigned Tasks</h1>
      </div>
      <p className="text-sm text-ink-muted mb-4">
        Active steps with no assignee — the shared pickup pool. Open a matter to assign an owner.
      </p>

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm mt-4">Failed to load report.</p>}

      {data && (data.length === 0 ? (
        <p className="text-gray-400 text-sm mt-8 text-center">No unassigned tasks. 🎉</p>
      ) : (
        <DataGrid<UnassignedRow>
          tableId="rpt-unassigned"
          data={data}
          columns={cols}
          getRowId={(r) => `${r.taskId}-${r.stepNumber}`}
          onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
          searchable
          pageSize={15}
          emptyLabel="None"
        />
      ))}
    </div>
  );
}
