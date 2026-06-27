import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getProfessionalMappingReport } from '../../api/reports';
import type { MappingGroup } from '../../api/reports';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Professional / Group-company mapping (#62). Shows how many clients are handled
 * under each professional and each parent/group company, expandable to the client
 * list, so the firm can track volume per professional/entity.
 */

function GroupList({ title, groups, onClient }: {
  title: string; groups: MappingGroup[]; onClient: (uid: string) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <section className="card p-4">
      <h2 className="text-sm font-semibold text-ink mb-3">{title}</h2>
      {groups.length === 0 ? (
        <p className="text-sm text-ink-muted">No clients yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-hairline">
          {groups.map((g) => (
            <div key={g.name} className="py-2">
              <button
                onClick={() => setOpen((o) => ({ ...o, [g.name]: !o[g.name] }))}
                className="w-full flex items-center justify-between gap-3 text-left"
              >
                <span className="text-sm font-medium text-ink truncate">{g.name}</span>
                <span className="text-xs text-ink-muted shrink-0">{g.count} client{g.count === 1 ? '' : 's'}</span>
              </button>
              {open[g.name] && (
                <div className="mt-2 flex flex-col gap-1 pl-2">
                  {g.clients.map((c) => (
                    <button key={c.uid} onClick={() => onClient(c.uid)} className="text-left text-sm text-brand-600 hover:underline truncate">
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function ProfessionalMappingReport() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['report-professional-mapping'],
    queryFn: getProfessionalMappingReport,
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/reports" className="text-sm text-brand-600 hover:underline">← Reports</Link>
        <h1 className="text-xl font-semibold text-ink">Professional / Group Mapping</h1>
      </div>

      {isLoading && <LoadingSpinner />}
      {isError && <p className="text-red-600 text-sm mt-4">Failed to load report.</p>}

      {data && (
        <>
          <p className="text-sm text-ink-muted mb-4">{data.totalClients} clients total.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GroupList title="By Professional" groups={data.byProfessional} onClient={(uid) => navigate(`/users/edit/client/${uid}`)} />
            <GroupList title="By Group Company" groups={data.byGroup} onClient={(uid) => navigate(`/users/edit/client/${uid}`)} />
          </div>
        </>
      )}
    </div>
  );
}
