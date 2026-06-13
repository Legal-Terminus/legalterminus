import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getMasterSheet, downloadMasterSheetCSV } from '../../api/reports';
import type { ReportFilters, MasterSheetRow } from '../../api/reports';
import ReportFiltersBar from '../../components/reports/ReportFiltersBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type SortKey = keyof MasterSheetRow;

export default function MasterSheetReport() {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdated');
  const [sortAsc, setSortAsc] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-master-sheet', filters],
    queryFn: () => getMasterSheet(filters),
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const rows = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    const filtered = q
      ? data.filter(
          (r) =>
            r.clientName.toLowerCase().includes(q) ||
            r.serviceType.toLowerCase().includes(q) ||
            r.assignedTo.toLowerCase().includes(q) ||
            r.taskId.toLowerCase().includes(q)
        )
      : data;

    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortAsc ? cmp : -cmp;
    });
  }, [data, search, sortKey, sortAsc]);

  const COLS: { key: SortKey; label: string }[] = [
    { key: 'clientName',    label: 'Client' },
    { key: 'serviceType',   label: 'Service' },
    { key: 'currentStep',   label: 'Step' },
    { key: 'assignedTo',    label: 'Assigned To' },
    { key: 'paymentStatus', label: 'Payment' },
    { key: 'amountPaid',    label: 'Paid (₹)' },
    { key: 'amountDue',     label: 'Due (₹)' },
    { key: 'taskStatus',    label: 'Status' },
    { key: 'lastUpdated',   label: 'Last Updated' },
  ];

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <span className="text-gray-300 ml-1">↕</span> :
    sortAsc ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-sm text-indigo-600 hover:underline">← Reports</Link>
          <h1 className="text-xl font-semibold text-gray-900">Master Sheet</h1>
        </div>
        <button
          onClick={() => downloadMasterSheetCSV(filters)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Export CSV
        </button>
      </div>

      <ReportFiltersBar filters={filters} onChange={setFilters} />

      <div className="mb-3">
        <input
          type="search"
          placeholder="Search client, service, assignee…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm">Failed to load master sheet.</p>}

      {data && (
        <p className="text-xs text-gray-400 mb-2">{rows.length} of {data.length} rows</p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Task ID</th>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    className="px-4 py-3 text-left font-medium cursor-pointer select-none whitespace-nowrap"
                  >
                    {c.label}<SortIcon k={c.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.taskId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-xs text-gray-400">{row.taskId.slice(0, 8)}…</td>
                  <td className="px-4 py-2 font-medium">{row.clientName}</td>
                  <td className="px-4 py-2">{row.serviceType}</td>
                  <td className="px-4 py-2">{row.currentStep} / {row.totalSteps}</td>
                  <td className="px-4 py-2">{row.assignedTo || '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.paymentStatus === 'fully_paid' ? 'bg-green-100 text-green-700' :
                      row.paymentStatus === 'part_paid'  ? 'bg-yellow-100 text-yellow-700' :
                                                           'bg-red-100 text-red-700'
                    }`}>{row.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-2">₹{row.amountPaid.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2">₹{row.amountDue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2">{row.taskStatus}</td>
                  <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                    {row.lastUpdated ? new Date(row.lastUpdated).toLocaleDateString('en-IN') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <p className="text-gray-400 text-sm mt-8 text-center">No data found.</p>
      )}
    </div>
  );
}
