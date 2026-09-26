import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  getContactLeadsReport, createLead, updateLead, deleteLead, convertLeadToClient,
  type ContactLead, type LeadInput,
} from '../../api/reports';
import { getMyReportingAccess } from '../../api/marketing';
import {
  LEAD_SOURCES, LEAD_SERVICES, LEAD_OUTCOMES, outcomeLabel, outcomeNeedsRemarks, type LeadOutcome,
} from '../../lib/leadFields';
import { useAuthStore } from '../../store/authStore';
import { useConfirm } from '../../components/common/confirmContext';
import { useToast } from '../../components/common/toastContext';
import {
  ArrowLeft, Search, Phone, Mail, CheckCircle2, UserPlus, Inbox, Plus, X, Trash2, Hash, Loader2, Lock, Eye,
} from 'lucide-react';

/**
 * #196 — the Lead Dashboard, laid out like the firm's lead sheet: Ref No., Date,
 * Lead Source, Client, Organisation (+ objects), Mobile, Email, Service
 * Required, Proposal Sent On, Last Follow-up, General Remarks and the outcome
 * (Converted / Not Converted / Wrong Enquiry, with Remarks only when it did not
 * convert).
 *
 * Access is the admin's to give per person (Settings → Reporting access):
 * edit, view only, or none. The server enforces it; this page only shapes
 * itself to match.
 */

type OutcomeFilter = 'all' | 'open' | Exclude<LeadOutcome, ''>;
const OUTCOME_TABS: { value: OutcomeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  ...LEAD_OUTCOMES.map((o) => ({ value: o.value as OutcomeFilter, label: o.label })),
];

function fmtDate(d: string | null | undefined) {
  if (!d) return '—';
  const iso = d.length === 10 ? `${d}T00:00:00` : d;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function OutcomeTag({ outcome }: { outcome: string }) {
  const o = LEAD_OUTCOMES.find((x) => x.value === outcome);
  return o ? <span className={o.badge}>{o.label}</span> : <span className="text-xs text-ink-faint">Open</span>;
}

export default function ContactLeadsReport() {
  const role = useAuthStore((s) => s.role);
  const queryClient = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [outcome, setOutcome] = useState<OutcomeFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactLead | null>(null);
  const [adding, setAdding] = useState(false);

  const { data: access, isLoading: accessLoading } = useQuery({
    queryKey: ['reporting-access-me'],
    queryFn: getMyReportingAccess,
    staleTime: 30_000,
  });
  const level = access?.levels.leads ?? null;
  const canEdit = level === 'edit';
  const canConvert = canEdit && (role === 'admin' || role === 'manager');

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['report-contact-leads'],
    queryFn: getContactLeadsReport,
    enabled: !!level,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['report-contact-leads'] });

  // Outcome straight from the row — the most common edit on the sheet.
  const inlineOutcome = useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: LeadOutcome }) => updateLead(id, { outcome }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message || 'Could not update the outcome.'),
  });

  const convert = useMutation({
    mutationFn: (id: string) => convertLeadToClient(id),
    onSuccess: (res) => {
      toast.success(res.message || 'Lead converted to client.');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['portalUsers'] });
    },
    onError: (e: Error) => toast.error(e.message || 'Could not convert this lead.'),
  });

  const handleConvert = async (lead: ContactLead) => {
    if (!lead.email) {
      toast.error('This lead has no email — add one before converting.');
      return;
    }
    const ok = await confirm({
      title: 'Create a client account?',
      message: `Create a client account for ${lead.fullName || lead.email}. They'll appear on the Users page and can be assigned services.`,
      confirmLabel: 'Convert',
    });
    if (ok) convert.mutate(lead.id);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      const matchOutcome = outcome === 'all' || (outcome === 'open' ? !l.outcome : l.outcome === outcome);
      const matchSearch = !q || [
        l.fullName, l.email, l.phone, l.company, l.refId, l.leadSource, l.serviceRequired, l.organisationObjects,
      ].some((v) => (v ?? '').toLowerCase().includes(q));
      return matchOutcome && matchSearch;
    });
  }, [leads, outcome, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, open: leads.filter((l) => !l.outcome).length };
    for (const o of LEAD_OUTCOMES) c[o.value] = leads.filter((l) => l.outcome === o.value).length;
    return c;
  }, [leads]);

  const header = (
    <div className="page-header">
      <div className="flex items-center gap-3">
        {(role === 'admin' || role === 'manager') && (
          <Link to="/reports" aria-label="Back to reports" className="p-1.5 -ml-1.5 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}
        <div>
          <h1 className="text-base font-semibold text-ink">Lead Dashboard</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {level ? `${filtered.length} of ${leads.length} · ${counts.converted ?? 0} converted` : 'Leads'}
          </p>
        </div>
      </div>
      {canEdit && (
        <button onClick={() => setAdding(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      )}
    </div>
  );

  if (!accessLoading && !level) {
    return (
      <div className="flex flex-col min-h-full">
        {header}
        <div className="page-content">
          <div className="card p-10 text-center">
            <Lock className="w-8 h-8 text-ink-faint mx-auto" />
            <p className="text-sm font-medium text-ink mt-3">You don't have access to leads</p>
            <p className="text-sm text-ink-muted mt-1">An admin can grant it under Settings → Reporting access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      {header}

      <div className="page-content flex-1 space-y-4">
        {level === 'view' && (
          <p className="text-xs text-ink-muted flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View only — ask an admin if you need to add or edit leads.
          </p>
        )}

        <div className="nav-pill-container w-full sm:w-fit overflow-x-auto">
          {OUTCOME_TABS.map((tab) => (
            <button key={tab.value} onClick={() => setOutcome(tab.value)}
              className={outcome === tab.value ? 'nav-pill-active' : 'nav-pill'}>
              {tab.label}<span className="ml-1.5 text-[10px] opacity-60">{counts[tab.value] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input type="text" placeholder="Search by name, email, mobile, organisation, service, source or ref no…"
            value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>

        {isLoading || accessLoading ? (
          <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
            <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
            <span className="text-sm">Loading leads…</span>
          </div>
        ) : isError ? (
          <div className="card p-16 text-center text-red-600 text-sm">Failed to load leads.</div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
            <Inbox className="w-10 h-10 text-hairline" />
            <p className="text-sm font-medium">{search ? 'No results found' : 'No leads yet'}</p>
          </div>
        ) : (
          <>
            {/* Desktop: the sheet. Wide by nature, so it scrolls sideways inside
                its card, with the ref and name pinned. */}
            <div className="card overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1500px] text-sm">
                  <thead>
                    <tr className="border-b border-hairline-soft bg-surface-soft">
                      {['Ref No.', 'Date', 'Lead Source', 'Client Name', 'Organisation', 'Organisation Objects', 'Mobile',
                        'Email', 'Service Required', 'Proposal Sent On', 'Last Follow-up', 'General Remarks', 'Outcome', 'Remarks', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-muted whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filtered.map((lead) => (
                      <tr key={lead.id} onClick={() => setSelected(lead)}
                        className="hover:bg-surface-soft transition-colors align-top cursor-pointer">
                        <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{lead.refId}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{fmtDate(lead.leadDate)}</td>
                        <td className="px-4 py-3 text-ink-soft">{lead.leadSource || lead.sourceLabel || '—'}</td>
                        <td className="px-4 py-3 font-medium text-ink">{lead.fullName || '—'}</td>
                        <td className="px-4 py-3 text-ink-soft">{lead.company || '—'}</td>
                        <td className="px-4 py-3 text-ink-muted max-w-[220px]"><span className="line-clamp-2">{lead.organisationObjects || '—'}</span></td>
                        <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{lead.phone || '—'}</td>
                        <td className="px-4 py-3 text-ink-soft">{lead.email || '—'}</td>
                        <td className="px-4 py-3 text-ink-soft">{lead.serviceRequired || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{fmtDate(lead.proposalSentOn)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-ink-soft">{fmtDate(lead.lastFollowUp)}</td>
                        <td className="px-4 py-3 text-ink-muted max-w-[240px]"><span className="line-clamp-2">{lead.notes || '—'}</span></td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {canEdit ? (
                            <select
                              aria-label={`Outcome for ${lead.fullName || lead.refId}`}
                              value={lead.outcome}
                              disabled={inlineOutcome.isPending}
                              onChange={(e) => inlineOutcome.mutate({ id: lead.id, outcome: e.target.value as LeadOutcome })}
                              className="input-field py-1 text-xs max-w-[150px]"
                            >
                              <option value="">Open</option>
                              {LEAD_OUTCOMES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          ) : <OutcomeTag outcome={lead.outcome} />}
                        </td>
                        <td className="px-4 py-3 text-ink-muted max-w-[220px]"><span className="line-clamp-2">{outcomeNeedsRemarks(lead.outcome) ? (lead.outcomeRemarks || '—') : ''}</span></td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {lead.registered ? (
                            <span className="badge-green whitespace-nowrap"><CheckCircle2 className="w-3 h-3" /> Client</span>
                          ) : canConvert ? (
                            <button onClick={() => handleConvert(lead)} disabled={convert.isPending}
                              className="text-xs text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 whitespace-nowrap disabled:opacity-50">
                              {convert.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                              Create client account
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile: one card per lead. */}
            <div className="space-y-3 md:hidden">
              {filtered.map((lead) => (
                <div key={lead.id} onClick={() => setSelected(lead)} className="card p-4 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{lead.fullName || '—'}</p>
                      <p className="text-[11px] font-mono text-ink-faint">{lead.refId} · {fmtDate(lead.leadDate)}</p>
                    </div>
                    <OutcomeTag outcome={lead.outcome} />
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-ink-soft">
                    {lead.serviceRequired && <p>{lead.serviceRequired}{lead.leadSource ? ` · ${lead.leadSource}` : ''}</p>}
                    {lead.phone && <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 py-1"><Phone className="w-3.5 h-3.5 text-ink-faint" />{lead.phone}</a>}
                    {lead.email && <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 py-1"><Mail className="w-3.5 h-3.5 text-ink-faint" />{lead.email}</a>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          readOnly={!canEdit}
          canConvert={canConvert}
          converting={convert.isPending}
          onConvert={() => handleConvert(selected)}
          onClose={() => setSelected(null)}
          onChanged={() => { invalidate(); setSelected(null); }}
        />
      )}
      {adding && (
        <LeadDrawer lead={null} onClose={() => setAdding(false)} onChanged={() => { invalidate(); setAdding(false); }} />
      )}
    </div>
  );
}

/* ─────────────────────────  Lead drawer (view / edit / add)  ───────────────────────── */

const today = () => new Date().toISOString().slice(0, 10);

function LeadDrawer({
  lead, onClose, onChanged, readOnly = false, canConvert, converting, onConvert,
}: {
  lead: ContactLead | null;
  onClose: () => void;
  onChanged: () => void;
  readOnly?: boolean;
  canConvert?: boolean;
  converting?: boolean;
  onConvert?: () => void;
}) {
  const isNew = !lead;
  const confirm = useConfirm();
  const [form, setForm] = useState<LeadInput>({
    leadDate: lead?.leadDate || today(),
    leadSource: lead?.leadSource ?? '',
    fullName: lead?.fullName ?? '',
    company: lead?.company ?? '',
    organisationObjects: lead?.organisationObjects ?? '',
    phone: lead?.phone ?? '',
    email: lead?.email ?? '',
    serviceRequired: lead?.serviceRequired ?? '',
    proposalSentOn: lead?.proposalSentOn ?? '',
    lastFollowUp: lead?.lastFollowUp ?? '',
    notes: lead?.notes ?? '',
    outcome: lead?.outcome ?? '',
    outcomeRemarks: lead?.outcomeRemarks ?? '',
  });
  const [error, setError] = useState('');
  const set = (k: keyof LeadInput, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const saveMut = useMutation({
    mutationFn: (body: LeadInput) => (isNew ? createLead(body) : updateLead(lead!.id, body)),
    onSuccess: onChanged,
    onError: (e: Error) => setError(e.message),
  });
  const delMut = useMutation({
    mutationFn: () => deleteLead(lead!.id),
    onSuccess: onChanged,
    onError: (e: Error) => setError(e.message),
  });

  const handleSave = () => {
    if (!form.fullName || (!form.email && !form.phone)) {
      setError('Client name and at least one of mobile or email are required.');
      return;
    }
    if (form.phone && !/^\d{7,15}$/.test(form.phone)) {
      setError('Mobile number should be 7 to 15 digits.');
      return;
    }
    setError('');
    // Remarks are only kept for a lead that did not convert.
    saveMut.mutate(outcomeNeedsRemarks(form.outcome ?? '') ? form : { ...form, outcomeRemarks: '' });
  };

  const showRemarks = outcomeNeedsRemarks(form.outcome ?? '');

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div role="dialog" aria-label={isNew ? 'Add Lead' : 'Lead details'}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-lg flex flex-col">
        <div className="h-14 flex items-center justify-between px-5 border-b border-hairline shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-semibold text-ink truncate">{isNew ? 'Add Lead' : (lead!.fullName || 'Lead')}</h2>
            {!isNew && (
              <span className="text-[11px] font-mono text-ink-faint flex items-center gap-0.5">
                <Hash className="w-3 h-3" />{lead!.refId}
              </span>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2.5 rounded-lg text-ink-muted hover:bg-surface-soft">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>}
          {isNew && <p className="text-xs text-ink-muted">A Ref No. is assigned automatically when the lead is saved.</p>}

          {!isNew && (lead!.registered ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="w-4 h-4 shrink-0" /> Already a client.</div>
          ) : canConvert && onConvert ? (
            <button onClick={onConvert} disabled={converting}
              className="btn-secondary w-full inline-flex items-center justify-center gap-1.5 disabled:opacity-50">
              {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Create client account
            </button>
          ) : null)}

          <fieldset disabled={readOnly} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DateField label="Date" value={form.leadDate!} onChange={(v) => set('leadDate', v)} />
            <SelectField label="Lead Source" value={form.leadSource!} options={LEAD_SOURCES} onChange={(v) => set('leadSource', v)} />
            <TextField label="Client Name" value={form.fullName!} onChange={(v) => set('fullName', v)} required />
            <TextField label="Organisation Name" value={form.company!} onChange={(v) => set('company', v)} />
            <div className="sm:col-span-2">
              <label className="input-label" htmlFor="lead-objects">Organisation Objects</label>
              <textarea id="lead-objects" value={form.organisationObjects} onChange={(e) => set('organisationObjects', e.target.value)}
                rows={2} className="input-field resize-y" />
            </div>
            <TextField label="Mobile Number" value={form.phone!} inputMode="numeric"
              onChange={(v) => set('phone', v.replace(/\D/g, '').slice(0, 15))} />
            <TextField label="Email ID" type="email" value={form.email!} onChange={(v) => set('email', v)} />
            <SelectField label="Services Required" value={form.serviceRequired!} options={LEAD_SERVICES} onChange={(v) => set('serviceRequired', v)} />
            <DateField label="Proposal Sent On" value={form.proposalSentOn!} onChange={(v) => set('proposalSentOn', v)} />
            <DateField label="Last Follow-up" value={form.lastFollowUp!} onChange={(v) => set('lastFollowUp', v)} />
            <div className="sm:col-span-2">
              <label className="input-label" htmlFor="lead-remarks">General Remarks</label>
              <textarea id="lead-remarks" value={form.notes} onChange={(e) => set('notes', e.target.value)}
                rows={3} className="input-field resize-y" placeholder="What was discussed, next steps…" />
            </div>
            <div>
              <label className="input-label" htmlFor="lead-outcome">Converted / Not Converted / Wrong Enquiry</label>
              <select id="lead-outcome" value={form.outcome} onChange={(e) => set('outcome', e.target.value)} className="input-field">
                <option value="">Open — not decided</option>
                {LEAD_OUTCOMES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {showRemarks && (
              <div className="sm:col-span-2">
                <label className="input-label" htmlFor="lead-outcome-remarks">Remarks — why {outcomeLabel(form.outcome ?? '').toLowerCase()}?</label>
                <textarea id="lead-outcome-remarks" value={form.outcomeRemarks} onChange={(e) => set('outcomeRemarks', e.target.value)}
                  rows={2} className="input-field resize-y" />
              </div>
            )}
          </fieldset>

          {!isNew && (lead!.message || lead!.sourceLabel) && (
            <div className="text-xs text-ink-muted border-t border-hairline-soft pt-3 space-y-1">
              {lead!.sourceLabel && <p>Came in via: {lead!.sourceLabel}</p>}
              {lead!.message && <p>Enquiry: {lead!.message}</p>}
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="border-t border-hairline p-4 flex items-center gap-2 shrink-0">
            {!isNew && (
              <button
                onClick={async () => { if (await confirm({ title: 'Delete lead?', message: 'This permanently removes the lead.', confirmLabel: 'Delete', tone: 'danger' })) delMut.mutate(); }}
                disabled={delMut.isPending} className="btn-danger px-3" aria-label="Delete lead" title="Delete lead">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSave} disabled={saveMut.isPending} className="btn-primary flex-1">
              {saveMut.isPending ? 'Saving…' : isNew ? 'Add Lead' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function TextField({ label, value, onChange, required, type = 'text', inputMode }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
  type?: string; inputMode?: 'numeric' | 'text';
}) {
  const id = `lead-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <div>
      <label className="input-label" htmlFor={id}>{label}{required && <span className="text-red-600"> *</span>}</label>
      <input id={id} type={type} inputMode={inputMode} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = `lead-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <div>
      <label className="input-label" htmlFor={id}>{label}</label>
      <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  const id = `lead-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <div>
      <label className="input-label" htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="input-field">
        <option value="">— Select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
