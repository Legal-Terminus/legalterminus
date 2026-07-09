import { useQuery } from '@tanstack/react-query';
import type { ReportFilters } from '../../api/reports';
import { getServiceCatalog } from '../../api/services';

interface Props {
  filters: ReportFilters;
  onChange: (f: ReportFilters) => void;
  extraFields?: React.ReactNode;
  /**
   * #91: which structured criteria to show, each AND-combined. Defaults to all.
   * Reports whose status is fixed (e.g. Completed) pass `status: false`.
   */
  criteria?: { status?: boolean; service?: boolean; payment?: boolean };
}

// Matter statuses a report can filter by (AND-combined with the other criteria).
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'pending_admin_approval', label: 'Pending admin approval' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Stopped' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
];

const PAYMENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'fully_paid', label: 'Fully paid' },
  { value: 'part_paid', label: 'Part paid' },
  { value: 'not_paid', label: 'Not paid' },
];

const inputCls =
  'rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400';

/**
 * #91: multiple-criteria report filtering. Status, Service Type, Payment and the
 * date range are ALL applied together (logical AND, server-side). The report's
 * free-text search box composes on top for quick client-name / assignee lookup.
 */
export default function ReportFiltersBar({ filters, onChange, extraFields, criteria }: Props) {
  const show = { status: true, service: true, payment: true, ...criteria };
  const set = (key: keyof ReportFilters, value: string) =>
    onChange({ ...filters, [key]: (value || undefined) as ReportFilters[keyof ReportFilters] });

  const { data: catalog } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: getServiceCatalog,
    staleTime: 5 * 60 * 1000,
    enabled: show.service,
  });
  const services = catalog ? Object.values(catalog.services) : [];

  const hasAny = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      {show.status && (
        <div className="flex flex-col gap-0.5">
          <label className="text-xs text-gray-500">Status</label>
          <select value={filters.status ?? ''} onChange={(e) => set('status', e.target.value)} className={inputCls} aria-label="Filter by status">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}
      {show.service && (
        <div className="flex flex-col gap-0.5">
          <label className="text-xs text-gray-500">Service</label>
          <select value={filters.serviceType ?? ''} onChange={(e) => set('serviceType', e.target.value)} className={inputCls} aria-label="Filter by service">
            <option value="">All services</option>
            {services.map((s) => <option key={s.key} value={s.key}>{s.displayName}</option>)}
          </select>
        </div>
      )}
      {show.payment && (
        <div className="flex flex-col gap-0.5">
          <label className="text-xs text-gray-500">Payment</label>
          <select value={filters.paymentStatus ?? ''} onChange={(e) => set('paymentStatus', e.target.value)} className={inputCls} aria-label="Filter by payment">
            <option value="">Any payment</option>
            {PAYMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-gray-500">From</label>
        <input
          type="date"
          value={filters.startDate ?? ''}
          onChange={(e) => set('startDate', e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-gray-500">To</label>
        <input
          type="date"
          value={filters.endDate ?? ''}
          onChange={(e) => set('endDate', e.target.value)}
          className={inputCls}
        />
      </div>
      {extraFields}
      <button
        onClick={() => onChange({})}
        disabled={!hasAny}
        className="self-end rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
      >
        Clear
      </button>
    </div>
  );
}
