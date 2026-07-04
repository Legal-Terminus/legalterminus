import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getStorageReport } from '../../api/reports';

const fmtBytes = (b: number) => {
  if (!b) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

// #84 report 11 — application storage usage.
export default function StorageReportPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['report-storage'],
    queryFn: getStorageReport,
    refetchInterval: 60_000,
  });

  const alertCls = data?.alertLevel === 'critical' ? 'text-red-600' : data?.alertLevel === 'warning' ? 'text-amber-700' : 'text-emerald-700';

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">Storage Usage</h1>
      </div>

      {isLoading && <p className="text-sm text-ink-muted">Loading…</p>}
      {error && <p className="text-sm text-red-600">{(error as Error).message}</p>}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Stat label="Total used" value={fmtBytes(data.totalBytes)} />
            <Stat label="Remaining" value={fmtBytes(data.remaining)} />
            <Stat label="Used %" value={`${data.usedPct}%`} />
            <Stat label="Alert" value={data.alertLevel} cls={alertCls} />
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold text-ink mb-2">Client document storage</p>
            {data.perClient.length === 0 ? (
              <p className="text-xs text-ink-faint">No documents stored yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-faint text-xs">
                    <th className="pb-1 font-medium">Client</th>
                    <th className="pb-1 font-medium">Storage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.perClient.map((c) => (
                    <tr key={c.client} className="border-t border-hairline-soft">
                      <td className="py-1.5 text-ink-muted">{c.client}</td>
                      <td className="py-1.5 text-ink-muted">{fmtBytes(c.bytes)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, cls }: { label: string; value: string; cls?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`text-lg font-semibold mt-1 capitalize ${cls ?? 'text-ink'}`}>{value}</p>
    </div>
  );
}
