import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  getContactLeadsReport, createLead, updateLead, deleteLead,
  type ContactLead, type LeadStatus, type LeadInput,
} from '../../api/reports';
import { useAuthStore } from '../../store/authStore';
import { useConfirm } from '../../components/common/confirmContext';
import {
  ArrowLeft, Search, Phone, Mail, MapPin, MessageSquare,
  CheckCircle2, UserPlus, Inbox, Plus, X, Trash2, Clock, Hash,
} from 'lucide-react';

type StatusFilter = 'all' | LeadStatus;
type RegFilter = 'all' | 'registered' | 'new_lead';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_FLOW: LeadStatus[] = ['new', 'contacted', 'closed'];
const STATUS_BADGE: Record<string, string> = {
  new: 'badge-blue', contacted: 'badge-amber', closed: 'badge-gray',
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function RegisteredTag({ lead }: { lead: ContactLead }) {
  return lead.registered ? (
    <span className="badge-green"><CheckCircle2 className="w-3 h-3" /> Client</span>
  ) : (
    <span className="badge-gray"><UserPlus className="w-3 h-3" /> New lead</span>
  );
}

export default function ContactLeadsReport() {
  const role = useAuthStore((s) => s.role);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [reg, setReg] = useState<RegFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ContactLead | null>(null);
  const [adding, setAdding] = useState(false);

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['report-contact-leads'],
    queryFn: getContactLeadsReport,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['report-contact-leads'] });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      const matchStatus = status === 'all' || l.status === status;
      const matchReg =
        reg === 'all' ||
        (reg === 'registered' && l.registered) ||
        (reg === 'new_lead' && !l.registered);
      const matchSearch =
        !q ||
        l.fullName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.refId.toLowerCase().includes(q) ||
        l.sourceLabel.toLowerCase().includes(q);
      return matchStatus && matchReg && matchSearch;
    });
  }, [leads, status, reg, search]);

  const counts = useMemo(() => ({
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    closed: leads.filter((l) => l.status === 'closed').length,
    registered: leads.filter((l) => l.registered).length,
  }), [leads]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          {(role === 'admin' || role === 'manager') && (
            <Link to="/reports" className="p-1.5 -ml-1.5 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div>
            <h1 className="text-base font-semibold text-ink">Contact Leads</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              {filtered.length} of {leads.length} · {counts.registered} already clients
            </p>
          </div>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="page-content flex-1 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="nav-pill-container shrink-0 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button key={tab.value} onClick={() => setStatus(tab.value)}
                className={status === tab.value ? 'nav-pill-active' : 'nav-pill'}>
                {tab.label}<span className="ml-1.5 text-[10px] opacity-60">{counts[tab.value]}</span>
              </button>
            ))}
          </div>
          <div className="nav-pill-container shrink-0">
            <button onClick={() => setReg('all')} className={reg === 'all' ? 'nav-pill-active' : 'nav-pill'}>All</button>
            <button onClick={() => setReg('registered')} className={reg === 'registered' ? 'nav-pill-active' : 'nav-pill'}>Clients</button>
            <button onClick={() => setReg('new_lead')} className={reg === 'new_lead' ? 'nav-pill-active' : 'nav-pill'}>New leads</button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input type="text" placeholder="Search by name, email, phone, company, ref ID…"
            value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>

        {/* Content */}
        {isLoading ? (
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
            {/* Desktop table */}
            <div className="card overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-hairline-soft bg-surface-soft">
                      {['Ref', 'Lead', 'Contact', 'Service / Source', 'Status', 'Type', 'Received'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-ink-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filtered.map((lead) => (
                      <tr key={lead.id} onClick={() => setSelected(lead)}
                        className="hover:bg-surface-soft transition-colors align-top cursor-pointer">
                        <td className="px-5 py-4">
                          <span className="text-xs font-mono text-ink-muted whitespace-nowrap">{lead.refId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-ink">{lead.fullName || '—'}</p>
                          {lead.company && <p className="text-xs text-ink-faint mt-0.5">{lead.company}</p>}
                          {lead.message && (
                            <p className="text-xs text-ink-muted mt-1 flex items-start gap-1 max-w-xs">
                              <MessageSquare className="w-3 h-3 mt-0.5 shrink-0 text-ink-faint" />
                              <span className="line-clamp-2">{lead.message}</span>
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-ink-soft flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-ink-faint shrink-0" />{lead.email}
                          </span>
                          {lead.phone && (
                            <span className="text-xs text-ink-muted flex items-center gap-1.5 mt-1">
                              <Phone className="w-3 h-3 text-ink-faint shrink-0" />{lead.phone}
                            </span>
                          )}
                          {lead.state && (
                            <p className="text-xs text-ink-faint flex items-center gap-1.5 mt-1">
                              <MapPin className="w-3 h-3 shrink-0" />{lead.state}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-ink-soft">{lead.sourceLabel || lead.source || '—'}</p>
                          {lead.preferredCallTime && (
                            <p className="text-xs text-ink-faint mt-0.5">Prefers call: {lead.preferredCallTime}</p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={STATUS_BADGE[lead.status] ?? 'badge-gray'}>{lead.status}</span>
                        </td>
                        <td className="px-5 py-4"><RegisteredTag lead={lead} /></td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-ink-muted whitespace-nowrap">{fmtDate(lead.createdAt)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filtered.map((lead) => (
                <div key={lead.id} onClick={() => setSelected(lead)} className="card p-4 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{lead.fullName || '—'}</p>
                      <p className="text-[11px] font-mono text-ink-faint">{lead.refId}</p>
                    </div>
                    <RegisteredTag lead={lead} />
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <span className="text-xs text-ink-soft flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-ink-faint shrink-0" />{lead.email}
                    </span>
                    {lead.phone && (
                      <span className="text-xs text-ink-soft flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-ink-faint shrink-0" />{lead.phone}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-hairline-soft flex items-center justify-between">
                    <span className={STATUS_BADGE[lead.status] ?? 'badge-gray'}>{lead.status}</span>
                    <span className="text-xs text-ink-faint">{fmtDate(lead.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail / edit drawer */}
      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onChanged={() => { invalidate(); setSelected(null); }}
        />
      )}

      {/* Add drawer */}
      {adding && (
        <LeadDrawer
          lead={null}
          onClose={() => setAdding(false)}
          onChanged={() => { invalidate(); setAdding(false); }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────  Lead drawer (view / edit / add)  ───────────────────────── */

function LeadDrawer({
  lead, onClose, onChanged,
}: { lead: ContactLead | null; onClose: () => void; onChanged: () => void }) {
  const isNew = !lead;
  const confirm = useConfirm();
  const [form, setForm] = useState<LeadInput>({
    fullName: lead?.fullName ?? '',
    company: lead?.company ?? '',
    email: lead?.email ?? '',
    phone: lead?.phone ?? '',
    state: lead?.state ?? '',
    preferredCallTime: lead?.preferredCallTime ?? '',
    sourceLabel: lead?.sourceLabel ?? '',
    message: lead?.message ?? '',
    notes: lead?.notes ?? '',
  });
  const [error, setError] = useState('');

  const set = (k: keyof LeadInput, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const saveMut = useMutation({
    mutationFn: (body: LeadInput) => (isNew ? createLead(body) : updateLead(lead!.id, body)),
    onSuccess: onChanged,
    onError: (e: Error) => setError(e.message),
  });

  const statusMut = useMutation({
    mutationFn: (status: LeadStatus) => updateLead(lead!.id, { status }),
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
      setError('Name and at least one of email or phone are required.');
      return;
    }
    setError('');
    saveMut.mutate(form);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-hairline shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-sm font-semibold text-ink truncate">
              {isNew ? 'Add Lead' : (lead!.fullName || 'Lead')}
            </h2>
            {!isNew && (
              <span className="text-[11px] font-mono text-ink-faint flex items-center gap-0.5">
                <Hash className="w-3 h-3" />{lead!.refId}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-soft">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>
          )}

          {/* Status actions (existing leads only) */}
          {!isNew && (
            <div>
              <p className="input-label">Status</p>
              <div className="nav-pill-container w-fit">
                {STATUS_FLOW.map((s) => (
                  <button
                    key={s}
                    disabled={statusMut.isPending}
                    onClick={() => statusMut.mutate(s)}
                    className={lead!.status === s ? 'nav-pill-active capitalize' : 'nav-pill capitalize'}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {lead!.contactedAt && (
                <p className="text-xs text-ink-faint mt-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Contacted {fmtDate(lead!.contactedAt)}
                </p>
              )}
            </div>
          )}

          {/* Editable fields */}
          <div className="grid grid-cols-1 gap-3">
            <Field label="Full name" value={form.fullName!} onChange={(v) => set('fullName', v)} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" value={form.email!} onChange={(v) => set('email', v)} />
              <Field label="Phone" value={form.phone!} onChange={(v) => set('phone', v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company" value={form.company!} onChange={(v) => set('company', v)} />
              <Field label="State" value={form.state!} onChange={(v) => set('state', v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Service / source" value={form.sourceLabel!} onChange={(v) => set('sourceLabel', v)} />
              <Field label="Preferred call time" value={form.preferredCallTime!} onChange={(v) => set('preferredCallTime', v)} />
            </div>
            <div>
              <label className="input-label">Enquiry message</label>
              <textarea value={form.message} onChange={(e) => set('message', e.target.value)}
                rows={2} className="input-field resize-none" />
            </div>
            <div>
              <label className="input-label">Conversation notes</label>
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
                rows={4} placeholder="Follow-up notes — what was discussed, next steps…"
                className="input-field resize-none" />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-hairline p-4 flex items-center gap-2 shrink-0">
          {!isNew && (
            <button
              onClick={async () => { if (await confirm({ title: 'Delete lead?', message: 'This permanently removes the lead.', confirmLabel: 'Delete', tone: 'danger' })) delMut.mutate(); }}
              disabled={delMut.isPending}
              className="btn-danger px-3"
              title="Delete lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saveMut.isPending} className="btn-primary flex-1">
            {saveMut.isPending ? 'Saving…' : isNew ? 'Add Lead' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
}

function Field({
  label, value, onChange, required,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="input-label">{label}{required && <span className="text-red-400"> *</span>}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </div>
  );
}
