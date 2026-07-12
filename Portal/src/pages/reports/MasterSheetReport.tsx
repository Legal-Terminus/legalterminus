import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { getMasterSheet, downloadMasterSheetCSV } from '../../api/reports';
import type { ReportFilters, MasterSheetRow } from '../../api/reports';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import DataGrid from '../../components/common/DataGrid';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';

const col = createColumnHelper<MasterSheetRow>();

const PAYMENT_CLS: Record<string, string> = {
  fully_paid: 'bg-green-100 text-green-700',
  part_paid: 'bg-yellow-100 text-yellow-700',
  not_paid: 'bg-red-100 text-red-700',
};

// #84: the Master Sheet is the central report — reports 1-11 are reached by
// filtering these columns. Auto-updates every 30s (real-time-ish).
export default function MasterSheetReport() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['report-master-sheet', filters],
    queryFn: () => getMasterSheet(filters),
    refetchInterval: 30_000,      // #84: real-time auto-update
    refetchOnWindowFocus: true,
  });

  const columns = useMemo(() => [
    col.accessor('clientName', { header: 'Client', size: 160, cell: (c) => <span className="text-sm font-medium text-ink truncate">{c.getValue()}</span> }),
    col.accessor('serviceType', { header: 'Service', size: 170, cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue()}</span> }),
    col.accessor((r) => r.createdAt, { id: 'createdAt', header: 'Created', size: 110, meta: { disableColumnFilter: true }, cell: (c) => <span className="text-xs text-ink-faint">{formatDate(c.getValue() as string)}</span> }),
    col.accessor((r) => `${r.currentStep}/${r.totalSteps}`, { id: 'step', header: 'Step', size: 80, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() as string}</span> }),
    col.accessor('taskStatus', { header: 'Status', size: 110, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor('priority', { header: 'Priority', size: 90, cell: (c) => <span className={`text-xs font-medium ${c.getValue() === 'High' ? 'text-red-600' : 'text-ink-muted'}`}>{c.getValue()}</span> }),
    col.accessor('assignedTo', { header: 'Assigned To', size: 140, cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue() || '—'}</span> }),
    col.accessor('professional', { header: 'Professional', size: 140, cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue() || '—'}</span> }),
    col.accessor('pendingReason', { header: 'Pending Reason', size: 170, cell: (c) => <span className="text-xs text-ink-muted truncate">{c.getValue() || '—'}</span> }),
    col.accessor('pendingFrom', { header: 'Pending From', size: 110, cell: (c) => <span className="text-xs text-ink-muted">{c.getValue() || '—'}</span> }),
    col.accessor('approvalPendingFrom', { header: 'Approval From', size: 110, cell: (c) => <span className="text-xs text-ink-muted">{c.getValue() || '—'}</span> }),
    col.accessor('paymentStatus', { header: 'Payment', size: 100, cell: (c) => <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_CLS[c.getValue()] ?? PAYMENT_CLS.not_paid}`}>{c.getValue()}</span> }),
    col.accessor('totalFees', { header: 'Total Fees (₹)', size: 120, cell: (c) => <span className="text-sm text-ink-muted">₹{(c.getValue() ?? 0).toLocaleString('en-IN')}</span> }),
    col.accessor('amountPaid', { header: 'Paid (₹)', size: 100, cell: (c) => <span className="text-sm text-ink-muted">₹{(c.getValue() ?? 0).toLocaleString('en-IN')}</span> }),
    col.accessor('amountDue', { header: 'Due (₹)', size: 100, cell: (c) => <span className="text-sm text-ink-muted">₹{(c.getValue() ?? 0).toLocaleString('en-IN')}</span> }),
    col.accessor('paymentMode', { header: 'Mode', size: 90, cell: (c) => <span className="text-xs text-ink-muted">{c.getValue() || '—'}</span> }),
    col.accessor('referralSource', { header: 'Referral', size: 120, cell: (c) => <span className="text-xs text-ink-muted truncate">{c.getValue() || '—'}</span> }),
    col.accessor((r) => r.lastUpdated ?? '', { id: 'lastUpdated', header: 'Updated', size: 110, meta: { disableColumnFilter: true }, cell: (c) => <span className="text-xs text-ink-faint">{formatDate(c.getValue() as string)}</span> }),
  ] as ReturnType<typeof col.accessor>[], []);

  const onExportXlsx = async () => {
    const cols: ExportColumn<MasterSheetRow>[] = [
      { header: 'Client', value: (r) => r.clientName },
      { header: 'Service', value: (r) => r.serviceType },
      { header: 'Created', value: (r) => formatDate(r.createdAt) },
      { header: 'Current Step', value: (r) => `${r.currentStep}/${r.totalSteps}` },
      { header: 'Status', value: (r) => r.taskStatus },
      { header: 'Priority', value: (r) => r.priority },
      { header: 'Assigned To', value: (r) => r.assignedTo },
      { header: 'Professional', value: (r) => r.professional },
      { header: 'Pending Reason', value: (r) => r.pendingReason },
      { header: 'Pending From', value: (r) => r.pendingFrom },
      { header: 'Approval Pending From', value: (r) => r.approvalPendingFrom },
      { header: 'Payment Status', value: (r) => r.paymentStatus },
      { header: 'Total Fees', value: (r) => r.totalFees },
      { header: 'Amount Paid', value: (r) => r.amountPaid },
      { header: 'Amount Due', value: (r) => r.amountDue },
      { header: 'Payment Mode', value: (r) => r.paymentMode },
      { header: 'Referral Source', value: (r) => r.referralSource },
      { header: 'Last Updated', value: (r) => formatDate(r.lastUpdated) },
    ];
    await exportToXlsx(data, cols, 'master-sheet', 'Master Sheet');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink">Master Sheet</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onExportXlsx} className="btn-primary inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={() => downloadMasterSheetCSV(filters)} className="btn-secondary inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      <ReportFiltersBar filters={filters} onChange={setFilters} />

      <div className="mt-4">
        <DataGrid<MasterSheetRow>
          tableId="rpt-master-sheet"
          data={data}
          columns={columns}
          getRowId={(r) => r.taskId}
          onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
          searchPlaceholder="Search client, service, professional, assignee, reason…"
          globalFilterFn={(row, _id, q) => {
            const r = row.original;
            const s = q.toLowerCase();
            return (
              r.clientName.toLowerCase().includes(s) ||
              r.serviceType.toLowerCase().includes(s) ||
              r.assignedTo.toLowerCase().includes(s) ||
              (r.professional ?? '').toLowerCase().includes(s) ||
              (r.pendingReason ?? '').toLowerCase().includes(s) ||
              (r.referralSource ?? '').toLowerCase().includes(s) ||
              (r.taskStatus ?? '').toLowerCase().includes(s)
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
