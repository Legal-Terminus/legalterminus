import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Clock } from 'lucide-react';
import { getSlaReport } from '../../api/reports';
import type { SlaBreach, SlaFilters, OnTimeRate } from '../../api/reports';
import DataGrid from '../../components/common/DataGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UrgentBadge from '../../components/tasks/UrgentBadge';

/**
 * SLA / Delay report (E13-S04). The reporting counterpart to "running late"
 * visibility (E13-S03): an aggregate, management-facing view of where matters are
 * slipping — every overdue/at-risk active step across all matters, plus on-time
 * completion rate per service and per phase. Lateness is read from server-stamped
 * per-step due dates (E13-S02); this page only renders, never recomputes.
 */

const col = createColumnHelper<SlaBreach>();

function slaColumns(): ColumnDef<SlaBreach, unknown>[] {
  return [
    col.accessor((b) => b.clientName, {
      id: 'client',
      header: 'Client',
      size: 170,
      cell: (ctx) => (
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink truncate">{ctx.getValue() as string}</span>
          {ctx.row.original.isUrgent && <UrgentBadge compact />}
        </span>
      ),
    }),
    col.accessor((b) => b.serviceName, {
      id: 'service',
      header: 'Service',
      size: 170,
      cell: (ctx) => <span className="text-sm text-ink-muted truncate">{ctx.getValue() as string}</span>,
    }),
    col.accessor((b) => b.stepTitle, {
      id: 'step',
      header: 'Step',
      size: 190,
      cell: (ctx) => (
        <span className="text-sm text-ink-muted truncate">
          {ctx.getValue() as string}
          <span className="text-ink-faint"> · {ctx.row.original.phaseName}</span>
        </span>
      ),
    }),
    col.accessor((b) => b.assigneeName ?? 'Unassigned', {
      id: 'assignee',
      header: 'Assignee',
      size: 150,
      cell: (ctx) => <span className="text-sm text-ink-muted truncate">{ctx.getValue() as string}</span>,
    }),
    col.accessor((b) => (b.severity === 'overdue' ? b.daysOverdue : -b.daysLeft), {
      id: 'lateness',
      header: 'Lateness',
      size: 140,
      cell: (ctx) => {
        const b = ctx.row.original;
        if (b.severity === 'overdue') {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              <AlertTriangle className="w-3 h-3" /> Overdue {b.daysOverdue}d
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            <Clock className="w-3 h-3" /> {b.daysLeft <= 0 ? 'Due today' : `${b.daysLeft}d left`}
          </span>
        );
      },
    }),
  ];
}

function slaGlobalFilter(row: { original: SlaBreach }, _id: string, q: string) {
  const b = row.original;
  const s = q.toLowerCase();
  return (
    b.clientName.toLowerCase().includes(s) ||
    b.serviceName.toLowerCase().includes(s) ||
    b.stepTitle.toLowerCase().includes(s) ||
    (b.assigneeName ?? '').toLowerCase().includes(s)
  );
}

function RateBar({ rows, title }: { rows: OnTimeRate[]; title: string }) {
  if (rows.length === 0) return null;
  return (
    <section className="card p-4">
      <h2 className="text-sm font-semibold text-ink mb-3">{title}</h2>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <span className="text-xs text-ink-muted w-44 truncate" title={r.label}>{r.label}</span>
            <div className="flex-1 h-2 rounded-full bg-surface-card overflow-hidden">
              <div
                className={`h-full rounded-full ${(r.rate ?? 0) >= 80 ? 'bg-green-500' : (r.rate ?? 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${r.rate ?? 0}%` }}
              />
            </div>
            <span className="text-xs font-medium text-ink w-20 text-right">
              {r.rate == null ? '—' : `${r.rate}%`}
              <span className="text-ink-faint"> ({r.onTime}/{r.total})</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SlaReport() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SlaFilters>({ atRiskDays: 2 });
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-sla', filters],
    queryFn: () => getSlaReport(filters),
  });
  const columns = useMemo(() => slaColumns(), []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">SLA / Delay Report</h1>
      </div>

      {/* Summary chips */}
      {data && (
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="card px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-ink-muted">Overdue</span>
            <span className="text-lg font-semibold text-ink">{data.summary.overdue}</span>
          </div>
          <div className="card px-4 py-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-ink-muted">At risk</span>
            <span className="text-lg font-semibold text-ink">{data.summary.atRisk}</span>
          </div>
          <div className="flex flex-col gap-0.5 ml-auto">
            <label className="text-xs text-ink-muted">At-risk window (days)</label>
            <input
              type="number"
              min={0}
              max={30}
              value={filters.atRiskDays ?? 2}
              onChange={(e) => setFilters((f) => ({ ...f, atRiskDays: Number(e.target.value) }))}
              className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="At-risk window in days"
            />
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm mt-4">Failed to load report.</p>}

      {data && (
        <div className="flex flex-col gap-6">
          {data.breaches.length === 0 ? (
            <p className="text-gray-400 text-sm mt-2 text-center py-8">
              No overdue or at-risk steps. Everything is on track. 🎉
            </p>
          ) : (
            <DataGrid<SlaBreach>
          tableId="rpt-sla"
              data={data.breaches}
              columns={columns}
              getRowId={(b) => `${b.taskId}-${b.stepNumber}`}
              onRowClick={(b) => navigate(`/tasks/${b.taskId}`)}
              searchable
              pageSize={15}
              globalFilterFn={slaGlobalFilter}
              emptyLabel="None"
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RateBar rows={data.onTimeByService} title="On-time completion — by service" />
            <RateBar rows={data.onTimeByPhase} title="On-time completion — by phase" />
          </div>
        </div>
      )}
    </div>
  );
}
