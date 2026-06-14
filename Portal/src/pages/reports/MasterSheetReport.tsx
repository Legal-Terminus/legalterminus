import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { getMasterSheet, downloadMasterSheetCSV } from '../../api/reports';
import type { ReportFilters, MasterSheetRow } from '../../api/reports';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import DataGrid from '../../components/common/DataGrid';

const col = createColumnHelper<MasterSheetRow>();

const PAYMENT_CLS: Record<string, string> = {
  fully_paid: 'bg-green-100 text-green-700',
  part_paid: 'bg-yellow-100 text-yellow-700',
  not_paid: 'bg-red-100 text-red-700',
};

export default function MasterSheetReport() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['report-master-sheet', filters],
    queryFn: () => getMasterSheet(filters),
  });

  const columns = useMemo(() => [
    col.accessor('clientName', { header: 'Client', size: 170, cell: (c) => <span className="text-sm font-medium text-ink truncate">{c.getValue()}</span> }),
    col.accessor('serviceType', { header: 'Service', size: 180, cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue()}</span> }),
    col.accessor((r) => `${r.currentStep}/${r.totalSteps}`, { id: 'step', header: 'Step', size: 90, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() as string}</span> }),
    col.accessor('assignedTo', { header: 'Assigned To', size: 150, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() || '—'}</span> }),
    col.accessor('paymentStatus', { header: 'Payment', size: 110, cell: (c) => <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_CLS[c.getValue()] ?? PAYMENT_CLS.not_paid}`}>{c.getValue()}</span> }),
    col.accessor('amountPaid', { header: 'Paid (₹)', size: 110, cell: (c) => <span className="text-sm text-ink-muted">₹{(c.getValue() ?? 0).toLocaleString('en-IN')}</span> }),
    col.accessor('amountDue', { header: 'Due (₹)', size: 110, cell: (c) => <span className="text-sm text-ink-muted">₹{(c.getValue() ?? 0).toLocaleString('en-IN')}</span> }),
    col.accessor('taskStatus', { header: 'Status', size: 120, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor((r) => r.lastUpdated ?? '', { id: 'lastUpdated', header: 'Last Updated', size: 130, cell: (c) => <span className="text-xs text-ink-faint">{formatDate(c.getValue() as string)}</span> }),
  ] as ReturnType<typeof col.accessor>[], []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink">Master Sheet</h1>
        </div>
        <button onClick={() => downloadMasterSheetCSV(filters)} className="btn-primary inline-flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <ReportFiltersBar filters={filters} onChange={setFilters} />

      <div className="mt-4">
        <DataGrid<MasterSheetRow>
          data={data}
          columns={columns}
          getRowId={(r) => r.taskId}
          onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
          searchPlaceholder="Search client, service, assignee…"
          globalFilterFn={(row, _id, q) => {
            const r = row.original;
            const s = q.toLowerCase();
            return (
              r.clientName.toLowerCase().includes(s) ||
              r.serviceType.toLowerCase().includes(s) ||
              r.assignedTo.toLowerCase().includes(s)
            );
          }}
          isLoading={isLoading}
          error={error as Error | null}
          emptyLabel="No data found"
        />
      </div>
    </div>
  );
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
