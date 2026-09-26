import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { getReportingAccess, putReportingAccess, type AccessTable, type SectionKey } from '../../api/marketing';
import { useToast } from '../../components/common/toastContext';

/**
 * #196 / #197 — Settings → Reporting access. The admin decides, per team
 * member and per section, who may EDIT (enter and change data), who may only
 * VIEW, and who sees nothing. Admins always have full access; anyone not given
 * a level has none, so a new team member starts with no access.
 */
export default function ReportingAccessPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['reporting-access'], queryFn: getReportingAccess });
  const [grants, setGrants] = useState<AccessTable['grants'] | null>(null);
  useEffect(() => { if (data) setGrants(data.grants); }, [data]);

  const save = useMutation({
    mutationFn: () => putReportingAccess(grants!),
    onSuccess: () => {
      toast.success('Reporting access saved.');
      qc.invalidateQueries({ queryKey: ['reporting-access'] });
      qc.invalidateQueries({ queryKey: ['reporting-access-me'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Could not save access.'),
  });

  const setLevel = (section: SectionKey, uid: string, level: string) => setGrants((g) => {
    const next = { ...g!, [section]: { ...(g![section] ?? {}) } };
    if (level) next[section][uid] = level as 'view' | 'edit'; else delete next[section][uid];
    return next;
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="page-header">
        <div>
          <h1 className="text-base font-semibold text-ink">Reporting access</h1>
          <p className="text-sm text-ink-muted mt-0.5">Who can see and edit Leads and the marketing reports</p>
        </div>
      </div>
      <div className="page-content space-y-4">
        <p className="text-sm text-ink-muted flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
          Admins always have full access. Everyone else sees only what you grant here — a new team member starts with no access.
        </p>
        {isLoading || !grants ? <div className="card p-10 text-center text-sm text-ink-muted">{isError ? 'Could not load access.' : 'Loading…'}</div>
          : data!.staff.length === 0 ? <div className="card p-10 text-center text-sm text-ink-muted">No managers or team members yet.</div>
          : (
            <>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="table">
                    <thead><tr className="bg-surface-soft border-b border-hairline">
                      <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted">Team member</th>
                      {data!.sections.map((s) => <th key={s.key} className="px-3 py-3 text-left text-xs font-medium text-ink-muted whitespace-nowrap">{s.label}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-hairline-soft">
                      {data!.staff.map((u) => (
                        <tr key={u.uid}>
                          <td className="px-4 py-2">
                            <p className="font-medium text-ink">{u.name}</p>
                            <p className="text-xs text-ink-muted capitalize">{u.role.replace('_', ' ')}</p>
                          </td>
                          {data!.sections.map((s) => (
                            <td key={s.key} className="px-3 py-2">
                              <select
                                aria-label={`${s.label} access for ${u.name}`}
                                value={grants[s.key]?.[u.uid] ?? ''}
                                onChange={(e) => setLevel(s.key, u.uid, e.target.value)}
                                className="input-field py-1.5 text-xs min-w-[110px]"
                              >
                                <option value="">No access</option>
                                <option value="view">View</option>
                                {s.editable && <option value="edit">Edit</option>}
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <button onClick={() => save.mutate()} disabled={save.isPending} className="btn-primary">
                {save.isPending ? 'Saving…' : 'Save access'}
              </button>
            </>
          )}
      </div>
    </div>
  );
}
