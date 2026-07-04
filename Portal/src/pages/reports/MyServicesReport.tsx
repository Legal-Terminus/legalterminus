import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { getMyServices, type MyServiceRow } from '../../api/reports';
import DataGrid from '../../components/common/DataGrid';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';

const col = createColumnHelper<MyServiceRow>();

type Tab = 'all' | 'fully_paid' | 'part_paid' | 'not_paid';
const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All Work' },
  { key: 'fully_paid', label: 'Paid' },
  { key: 'part_paid', label: 'Partly Paid' },
  { key: 'not_paid', label: 'Unpaid' },
];

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

// #84 reports 12-16 — the client's own services & payments. One report with
// All / Paid / Partly-paid / Unpaid views.
export default function MyServicesReport() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['report-my-services'],
    queryFn: getMyServices,
    refetchInterval: 30_000,
  });

  const rows = useMemo(() => tab === 'all' ? data : data.filter((r) => r.paymentStatus === tab), [data, tab]);

  const columns = useMemo(() => [
    col.accessor('serviceName', { header: 'Service', size: 200, cell: (c) => <span className="text-sm font-medium text-ink truncate">{c.getValue()}</span> }),
    col.accessor('status', { header: 'Status', size: 110, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor('pendingAction', { header: 'Pending Action', size: 140, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
    col.accessor((r) => `${r.currentStep}/${r.totalSteps}`, { id: 'step', header: 'Timeline', size: 100, cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() as string}</span> }),
    col.accessor('assignedTeam', { header: 'Assigned Team', size: 150, cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue() || '—'}</span> }),
    col.accessor('totalFees', { header: 'Total Fees', size: 110, cell: (c) => <span className="text-sm text-ink-muted">{inr(c.getValue())}</span> }),
    col.accessor('amountPaid', { header: 'Paid', size: 100, cell: (c) => <span className="text-sm text-ink-muted">{inr(c.getValue())}</span> }),
    col.accessor('amountDue', { header: 'Due', size: 100, cell: (c) => <span className="text-sm text-ink-muted">{inr(c.getValue())}</span> }),
  ] as ReturnType<typeof col.accessor>[], []);

  const onExport = async () => {
    const cols: ExportColumn<MyServiceRow>[] = [
      { header: 'Service', value: (r) => r.serviceName },
      { header: 'Status', value: (r) => r.status },
      { header: 'Pending Action', value: (r) => r.pendingAction },
      { header: 'Assigned Team', value: (r) => r.assignedTeam },
      { header: 'Payment Status', value: (r) => r.paymentStatus },
      { header: 'Total Fees', value: (r) => r.totalFees },
      { header: 'Paid', value: (r) => r.amountPaid },
      { header: 'Due', value: (r) => r.amountDue },
      { header: 'Payment Mode', value: (r) => r.paymentMode },
    ];
    await exportToXlsx(rows, cols, 'my-services', 'My Services');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink">My Services</h1>
        </div>
        <button onClick={onExport} className="btn-primary inline-flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-hairline mb-4">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3.5 py-2 text-sm font-medium -mb-px border-b-2 ${tab === t.key ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <DataGrid<MyServiceRow>
        data={rows}
        columns={columns}
        getRowId={(r) => r.taskId}
        onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
        searchPlaceholder="Search service…"
        globalFilterFn={(row, _id, q) => row.original.serviceName.toLowerCase().includes(q.toLowerCase())}
        isLoading={isLoading}
        error={error as Error | null}
        emptyLabel="No services"
      />
    </div>
  );
}
