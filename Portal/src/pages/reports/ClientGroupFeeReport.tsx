import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import {
  getClientGroupFees, INDIVIDUAL_CLIENTS,
  type ClientGroupFeeFilters, type ClientGroupFeeRow,
} from '../../api/reports';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';

/**
 * LT #206 — works and fees per group / client, one financial year at a time.
 *
 * Admin only (route + API). A matter is counted in the financial year it was
 * CREATED in, so "works" and "fee charged" describe the same matters; money
 * received later still shows against that matter. Change the year to compare.
 */

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;
const fee = (r: ClientGroupFeeRow, n: number) => (r.priced ? inr(n) : '—');
const day = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
/** "pending_approval" → "Pending approval". */
const statusLabel = (s: string) => {
  const t = (s || '').replace(/_/g, ' ').trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '—';
};
const fyLabel = (fy: string) => `FY ${fy}`;

export default function ClientGroupFeeReport() {
  const [filters, setFilters] = useState<ClientGroupFeeFilters>({});
  const set = (patch: ClientGroupFeeFilters) => setFilters((f) => ({ ...f, ...patch }));

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['report-client-group-fees', filters],
    queryFn: () => getClientGroupFees(filters),
    placeholderData: keepPreviousData,
  });

  // Picking a group narrows the client list to that group's clients.
  const clientOptions = (data?.clients ?? []).filter((c) => {
    if (!filters.group) return true;
    if (filters.group === INDIVIDUAL_CLIENTS) return !c.group;
    return c.group.toLowerCase() === filters.group.toLowerCase();
  });

  const onExport = async () => {
    if (!data) return;
    const cols: ExportColumn<ClientGroupFeeRow>[] = [
      { header: 'Group', value: (r) => r.group || 'Individual client' },
      { header: 'Client Name', value: (r) => r.clientName },
      { header: 'Work / Service', value: (r) => r.serviceName },
      { header: 'Date', value: (r) => (r.createdAt ? r.createdAt.slice(0, 10) : '') },
      { header: 'Financial Year', value: (r) => r.financialYear ?? '' },
      { header: 'Fee Charged', value: (r) => (r.priced ? r.charged : '') },
      { header: 'Fee Received', value: (r) => (r.priced ? r.received : '') },
      { header: 'Balance', value: (r) => (r.priced ? r.balance : '') },
      { header: 'Status', value: (r) => statusLabel(r.status) },
    ];
    await exportToXlsx(data.rows, cols, `client-group-fees-${data.financialYear}`, 'Work & Fee');
  };

  const selectCls = 'input-field w-full';

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline shrink-0">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink truncate">Client / Group Work &amp; Fee</h1>
        </div>
        <button onClick={onExport} disabled={!data || data.rows.length === 0} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      <div className="card p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label htmlFor="fee-fy" className="input-label">Financial year</label>
          <select id="fee-fy" className={selectCls} value={filters.fy ?? data?.financialYear ?? ''} onChange={(e) => set({ fy: e.target.value })}>
            {(data?.financialYears ?? []).map((fy) => <option key={fy} value={fy}>{fyLabel(fy)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fee-group" className="input-label">Group</label>
          {/* Changing the group clears the client: the old one may not be in it. */}
          <select id="fee-group" className={selectCls} value={filters.group ?? ''} onChange={(e) => set({ group: e.target.value, clientUid: '' })}>
            <option value="">All groups and clients</option>
            <option value={INDIVIDUAL_CLIENTS}>Individual clients (no group)</option>
            {(data?.groups ?? []).map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fee-client" className="input-label">Client / company</label>
          <select id="fee-client" className={selectCls} value={filters.clientUid ?? ''} onChange={(e) => set({ clientUid: e.target.value })}>
            <option value="">All clients</option>
            {clientOptions.map((c) => <option key={c.uid} value={c.uid}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fee-service" className="input-label">Work / service</label>
          <select id="fee-service" className={selectCls} value={filters.serviceKey ?? ''} onChange={(e) => set({ serviceKey: e.target.value })}>
            <option value="">All services</option>
            {(data?.services ?? []).map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
      {error && <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">{(error as Error).message}</p>}

      {data && (
        <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Stat label="Total works" value={String(data.totals.works)} />
            <Stat label="Fees charged" value={inr(data.totals.charged)} />
            <Stat label="Fees received" value={inr(data.totals.received)} />
            {/* Colour keys off the value: nothing owed is the good case. */}
            <Stat label="Balance" value={inr(data.totals.balance)} warn={data.totals.balance > 0} />
          </div>

          {data.byGroup.length > 1 && (
            <div className="card overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <caption className="sr-only">Totals by group</caption>
                <thead>
                  <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                    <th className="p-3 font-medium">Group</th>
                    <th className="p-3 font-medium text-right">Clients</th>
                    <th className="p-3 font-medium text-right">Works</th>
                    <th className="p-3 font-medium text-right">Charged</th>
                    <th className="p-3 font-medium text-right">Received</th>
                    <th className="p-3 font-medium text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byGroup.map((g) => (
                    <tr key={g.group || INDIVIDUAL_CLIENTS} className="border-b border-hairline-soft last:border-0">
                      <td className="p-3 text-ink">{g.group || 'Individual clients'}</td>
                      <td className="p-3 text-right">{g.clients}</td>
                      <td className="p-3 text-right">{g.works}</td>
                      <td className="p-3 text-right">{inr(g.charged)}</td>
                      <td className="p-3 text-right">{inr(g.received)}</td>
                      <td className="p-3 text-right">{inr(g.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.rows.length === 0 ? (
            <div className="card p-10 text-center text-sm text-ink-muted">
              No works for this selection in {fyLabel(data.financialYear)}.
            </div>
          ) : (
            <>
              {/* Desktop: a table. Phones: one card per work — no sideways scroll. */}
              <div className="card overflow-x-auto hidden md:block">
                <table className="w-full text-sm">
                  <caption className="sr-only">Works in {fyLabel(data.financialYear)}</caption>
                  <thead>
                    <tr className="text-left text-xs text-ink-muted border-b border-hairline">
                      <th className="p-3 font-medium">Client</th>
                      <th className="p-3 font-medium">Work / service</th>
                      <th className="p-3 font-medium">Date</th>
                      <th className="p-3 font-medium text-right">Fee charged</th>
                      <th className="p-3 font-medium text-right">Received</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((r) => (
                      <tr key={r.taskId} className="border-b border-hairline-soft last:border-0 hover:bg-surface-soft">
                        <td className="p-3">
                          <p className="text-ink">{r.clientName}</p>
                          <p className="text-xs text-ink-muted">{r.group || 'Individual client'}</p>
                        </td>
                        <td className="p-3"><Link to={`/tasks/${r.taskId}`} className="text-brand-600 hover:underline">{r.serviceName || '(no service)'}</Link></td>
                        <td className="p-3 text-ink-muted whitespace-nowrap">{day(r.createdAt)}</td>
                        <td className="p-3 text-right">{fee(r, r.charged)}</td>
                        <td className="p-3 text-right">{fee(r, r.received)}</td>
                        <td className="p-3 text-ink-muted">{statusLabel(r.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="md:hidden space-y-2">
                {data.rows.map((r) => (
                  <li key={r.taskId}>
                    <Link to={`/tasks/${r.taskId}`} className="card p-4 block">
                      <p className="text-sm font-semibold text-ink">{r.clientName}</p>
                      <p className="text-xs text-ink-muted">{r.group || 'Individual client'}</p>
                      <p className="text-sm text-ink mt-2">{r.serviceName || '(no service)'}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                        <span>{day(r.createdAt)}</span>
                        <span>Charged {fee(r, r.charged)}</span>
                        <span>Received {fee(r, r.received)}</span>
                        <span>{statusLabel(r.status)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${warn ? 'text-amber-800' : 'text-ink'}`}>{value}</p>
    </div>
  );
}
