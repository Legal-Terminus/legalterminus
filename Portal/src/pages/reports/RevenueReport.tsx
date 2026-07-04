import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { getRevenueReport } from '../../api/reports';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

// #84 report 10 — revenue & collection performance.
export default function RevenueReportPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['report-revenue'],
    queryFn: getRevenueReport,
    refetchInterval: 30_000,
  });

  const onExport = async () => {
    if (!data) return;
    const cols: ExportColumn<{ label: string; collected: number; outstanding?: number }>[] = [
      { header: 'Segment', value: (r) => r.label },
      { header: 'Collected', value: (r) => r.collected },
      { header: 'Outstanding', value: (r) => r.outstanding ?? '' },
    ];
    const rows = [
      ...data.monthly.map((m) => ({ label: `Month ${m.month}`, collected: m.collected })),
      ...data.services.map((s) => ({ label: `Service: ${s.service}`, collected: s.collected, outstanding: s.outstanding })),
      ...data.team.map((t) => ({ label: `Team: ${t.name}`, collected: t.collected })),
    ];
    await exportToXlsx(rows, cols, 'revenue-analytics', 'Revenue');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink">Revenue Analytics</h1>
        </div>
        <button onClick={onExport} disabled={!data} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
          <Download className="w-4 h-4" /> Export Excel
        </button>
      </div>

      {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
      {error && <p className="text-sm text-red-600">{(error as Error).message}</p>}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Stat label="Collected" value={inr(data.collected)} tone="emerald" />
            <Stat label="Outstanding" value={inr(data.outstanding)} tone="amber" />
            <Stat label="Total Fees" value={inr(data.totalFees)} />
            <Stat label="Pending" value={inr(data.pending)} tone="red" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Panel title="Service-wise revenue">
              <Table head={['Service', 'Collected', 'Outstanding']}
                rows={data.services.map((s) => [s.service, inr(s.collected), inr(s.outstanding)])} />
            </Panel>
            <Panel title="Team-wise revenue">
              <Table head={['Team member', 'Collected']} rows={data.team.map((t) => [t.name, inr(t.collected)])} />
            </Panel>
            <Panel title="Monthly collected">
              <Table head={['Month', 'Collected']} rows={data.monthly.map((m) => [m.month, inr(m.collected)])} />
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'emerald' | 'amber' | 'red' }) {
  const cls = tone === 'emerald' ? 'text-emerald-700' : tone === 'amber' ? 'text-amber-700' : tone === 'red' ? 'text-red-600' : 'text-ink';
  return (
    <div className="card p-4">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${cls}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <p className="text-sm font-semibold text-ink mb-2">{title}</p>
      {children}
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (rows.length === 0) return <p className="text-xs text-ink-faint">No data.</p>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-ink-faint text-xs">
          {head.map((h) => <th key={h} className="pb-1 font-medium">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-hairline-soft">
            {r.map((c, j) => <td key={j} className="py-1.5 text-ink-muted">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
