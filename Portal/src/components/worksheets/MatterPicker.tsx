import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ExternalLink, X } from 'lucide-react';
import { searchWorksheetMatters, type MatterRef } from '../../api/worksheets';

/**
 * #210 / #217 — link a record to its matter. Only matters of the services
 * linked to the sheet are offered (an admin sets them under Edit columns).
 */
export default function MatterPicker({
  sheet, value, matter, label, onChange,
}: {
  sheet: string;
  value: string | null;
  matter: MatterRef | undefined;
  label: string;
  onChange: (id: string | null, ref?: MatterRef) => void;
}) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);
  const { data, isFetching } = useQuery({
    queryKey: ['worksheet-matters', sheet, debounced],
    queryFn: () => searchWorksheetMatters(sheet, debounced),
    enabled: !value,
    staleTime: 30_000,
  });

  if (value) {
    return (
      <div className="flex items-center gap-2 min-h-11">
        <Link to={`/tasks/${value}`} className="text-sm text-brand-700 hover:underline inline-flex items-center gap-1 min-w-0">
          <span className="truncate">{matter?.label ?? 'Open matter'}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </Link>
        <button type="button" onClick={() => onChange(null)} aria-label={`Unlink ${label}`}
          className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-9 min-w-9">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const none = data && data.linkedServices.length === 0;
  return (
    <div className="space-y-1.5">
      <input
        value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Find ${label}`}
        placeholder={none ? 'No services linked to this sheet' : 'Search by client, organisation or service…'}
        disabled={!!none} className="input-field px-4 py-3"
      />
      {none && <p className="text-xs text-ink-muted">An admin can link services to this sheet under Edit columns.</p>}
      {!none && (
        <ul className="max-h-48 overflow-y-auto divide-y divide-hairline-soft rounded-lg border border-hairline" aria-label="Matching matters">
          {isFetching && !data && <li className="px-3 py-2 text-xs text-ink-muted">Searching…</li>}
          {data?.data.length === 0 && <li className="px-3 py-2 text-xs text-ink-muted">No matching matter.</li>}
          {data?.data.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => onChange(m.id, { label: m.label, status: m.status })}
                className="w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-surface-soft min-h-11">
                {m.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
