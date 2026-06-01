import type { ReportFilters } from '../../api/reports';

interface Props {
  filters: ReportFilters;
  onChange: (f: ReportFilters) => void;
  extraFields?: React.ReactNode;
}

export default function ReportFiltersBar({ filters, onChange, extraFields }: Props) {
  const set = (key: keyof ReportFilters, value: string) =>
    onChange({ ...filters, [key]: value || undefined });

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-gray-500">From</label>
        <input
          type="date"
          value={filters.startDate ?? ''}
          onChange={(e) => set('startDate', e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-xs text-gray-500">To</label>
        <input
          type="date"
          value={filters.endDate ?? ''}
          onChange={(e) => set('endDate', e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      {extraFields}
      <button
        onClick={() => onChange({})}
        className="self-end rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
      >
        Clear
      </button>
    </div>
  );
}
