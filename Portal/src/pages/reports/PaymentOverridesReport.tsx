import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { getPaymentOverridesReport } from '../../api/reports';
import type { PaymentOverrideRow } from '../../api/reports';
import DataGrid from '../../components/common/DataGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Payment Overrides report (#58). Matters that progressed ahead of payment —
 * either created with No Payment (admin-approved) or where the payment gate was
 * admin-overridden — surfaced separately for finance tracking/monitoring.
 */

const REASON_LABEL: Record<PaymentOverrideRow['overrideReason'], string> = {
  created_no_payment: 'Created — No Payment',
  gate_override: 'Gate Overridden',
  'created_no_payment+gate_override': 'No Payment + Gate Override',
};

const col = createColumnHelper<PaymentOverrideRow>();

function columns(): ColumnDef<PaymentOverrideRow, unknown>[] {
  return [
    col.accessor((r) => r.clientName, { id: 'client', header: 'Client', size: 180,
      cell: (c) => <span className="text-sm font-medium text-ink truncate">{c.getValue() as string}</span> }),
    col.accessor((r) => r.serviceName, { id: 'service', header: 'Service', size: 190,
      cell: (c) => <span className="text-sm text-ink-muted truncate">{c.getValue() as string}</span> }),
    col.accessor((r) => r.overrideReason, { id: 'reason', header: 'Reason', size: 220,
      cell: (c) => (
        <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
          {REASON_LABEL[c.getValue() as PaymentOverrideRow['overrideReason']]}
        </span>
      ) }),
    col.accessor((r) => r.paymentStatus, { id: 'payment', header: 'Payment', size: 110,
      cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() as string}</span> }),
    col.accessor((r) => r.amountDue, { id: 'due', header: 'Amount Due', size: 110,
      cell: (c) => <span className="text-sm text-ink-muted">{c.getValue() as number}</span> }),
    col.accessor('status', { header: 'Status', size: 130,
      cell: (c) => <span className="text-sm text-ink-muted">{c.getValue()}</span> }),
  ];
}

export default function PaymentOverridesReport() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-payment-overrides'],
    queryFn: getPaymentOverridesReport,
  });
  const cols = useMemo(() => columns(), []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">Payment Overrides</h1>
      </div>
      <p className="text-sm text-ink-muted mb-4">
        Matters progressing ahead of payment — created with No Payment (admin-approved) or with an
        admin-overridden payment gate.
      </p>

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm mt-4">Failed to load report.</p>}

      {data && (data.length === 0 ? (
        <p className="text-gray-400 text-sm mt-8 text-center">No payment overrides. 🎉</p>
      ) : (
        <DataGrid<PaymentOverrideRow>
          tableId="rpt-payment-overrides"
          data={data}
          columns={cols}
          getRowId={(r) => r.taskId}
          onRowClick={(r) => navigate(`/tasks/${r.taskId}`)}
          searchable
          pageSize={15}
          emptyLabel="None"
        />
      ))}
    </div>
  );
}
