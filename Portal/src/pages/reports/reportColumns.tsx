import { createColumnHelper } from '@tanstack/react-table';
import type { Task } from '../../types/task';
import UrgentBadge from '../../components/tasks/UrgentBadge';

/**
 * Shared TanStack column definitions for the task-based reports (All / Completed /
 * Pending), so every report grid has the same columns, sorting and formatting.
 */
const col = createColumnHelper<Task>();

const PAYMENT_CLS: Record<string, string> = {
  fully_paid: 'bg-green-100 text-green-700',
  part_paid: 'bg-yellow-100 text-yellow-700',
  not_paid: 'bg-red-100 text-red-700',
};

export function taskReportColumns() {
  return [
    col.accessor((t) => t.clientName || t.clientUid, {
      id: 'client',
      header: 'Client',
      size: 180,
      cell: (ctx) => (
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink truncate">{ctx.getValue() as string}</span>
          {ctx.row.original.isUrgent && <UrgentBadge compact />}
        </span>
      ),
    }),
    col.accessor((t) => t.serviceName || t.workflowType, {
      id: 'service',
      header: 'Service',
      size: 200,
      cell: (ctx) => <span className="text-sm text-ink-muted truncate">{ctx.getValue() as string}</span>,
    }),
    col.accessor((t) => t.currentStepNumber, {
      id: 'step',
      header: 'Step',
      size: 110,
      cell: (ctx) => {
        const t = ctx.row.original;
        const total = t.totalSteps ?? t.steps?.length ?? 0;
        const label = t.status === 'completed'
          ? `${total}/${total}`
          : `${t.currentStepNumber}${total ? `/${total}` : ''}`;
        return <span className="text-sm text-ink-muted">{label}</span>;
      },
    }),
    col.accessor((t) => t.paymentStatus ?? 'not_paid', {
      id: 'payment',
      header: 'Payment',
      size: 120,
      cell: (ctx) => {
        const v = ctx.getValue() as string;
        return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PAYMENT_CLS[v] ?? PAYMENT_CLS.not_paid}`}>{v}</span>;
      },
    }),
    col.accessor('status', {
      header: 'Status',
      size: 130,
      cell: (ctx) => <span className="text-sm text-ink-muted">{ctx.getValue()}</span>,
    }),
    col.accessor((t) => t.updatedAt ?? '', {
      id: 'updatedAt',
      header: 'Updated',
      meta: { disableColumnFilter: true }, // #91: unique timestamps — picker useless
      size: 120,
      cell: (ctx) => <span className="text-xs text-ink-faint">{formatDate(ctx.getValue() as string)}</span>,
    }),
  ] as ReturnType<typeof col.accessor>[];
}

export function taskReportGlobalFilter(row: { original: Task }, _id: string, q: string) {
  const t = row.original;
  const s = q.toLowerCase();
  return (
    (t.clientName ?? t.clientUid ?? '').toLowerCase().includes(s) ||
    (t.serviceName ?? t.workflowType ?? '').toLowerCase().includes(s) ||
    (t.status ?? '').toLowerCase().includes(s)
  );
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}
