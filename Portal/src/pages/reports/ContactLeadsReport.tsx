import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getContactLeadsReport } from '../../api/reports';
import type { ContactLead } from '../../api/reports';
import { useAuthStore } from '../../store/authStore';
import {
  ArrowLeft, Search, Phone, Mail, MapPin, MessageSquare,
  CheckCircle2, UserPlus, Inbox,
} from 'lucide-react';

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';
type RegFilter = 'all' | 'registered' | 'new_lead';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_BADGE: Record<string, string> = {
  new:       'badge-blue',
  contacted: 'badge-amber',
  closed:    'badge-gray',
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function RegisteredTag({ lead }: { lead: ContactLead }) {
  if (lead.registered) {
    return (
      <span className="badge-green">
        <CheckCircle2 className="w-3 h-3" /> Client
      </span>
    );
  }
  return (
    <span className="badge-gray">
      <UserPlus className="w-3 h-3" /> New lead
    </span>
  );
}

export default function ContactLeadsReport() {
  const role = useAuthStore((s) => s.role);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [reg, setReg] = useState<RegFilter>('all');
  const [search, setSearch] = useState('');

  const { data: leads = [], isLoading, isError } = useQuery({
    queryKey: ['report-contact-leads'],
    queryFn: getContactLeadsReport,
  });

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
            <Link
              to="/reports"
              className="p-1.5 -ml-1.5 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
            >
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
      </div>

      <div className="page-content flex-1 space-y-4">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="nav-pill-container shrink-0 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={status === tab.value ? 'nav-pill-active' : 'nav-pill'}
              >
                {tab.label}
                <span className="ml-1.5 text-[10px] opacity-60">{counts[tab.value]}</span>
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
          <input
            type="text"
            placeholder="Search by name, email, phone, company, or service…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
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
                      {['Lead', 'Contact', 'Service / Source', 'Status', 'Type', 'Received'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-ink-muted">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-surface-soft transition-colors align-top">
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
                          <a href={`mailto:${lead.email}`} className="text-sm text-ink-soft flex items-center gap-1.5 hover:text-ink">
                            <Mail className="w-3.5 h-3.5 text-ink-faint shrink-0" />{lead.email}
                          </a>
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="text-xs text-ink-muted flex items-center gap-1.5 mt-1 hover:text-ink">
                              <Phone className="w-3 h-3 text-ink-faint shrink-0" />{lead.phone}
                            </a>
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
                            <p className="text-xs text-ink-faint mt-0.5">Call: {lead.preferredCallTime}</p>
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
                <div key={lead.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{lead.fullName || '—'}</p>
                      {lead.company && <p className="text-xs text-ink-faint truncate">{lead.company}</p>}
                    </div>
                    <RegisteredTag lead={lead} />
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <a href={`mailto:${lead.email}`} className="text-xs text-ink-soft flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-ink-faint shrink-0" />{lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="text-xs text-ink-soft flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-ink-faint shrink-0" />{lead.phone}
                      </a>
                    )}
                    {(lead.sourceLabel || lead.source) && (
                      <p className="text-xs text-ink-muted flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                        {lead.sourceLabel || lead.source}
                      </p>
                    )}
                  </div>

                  {lead.message && (
                    <p className="mt-2 text-xs text-ink-muted line-clamp-2">{lead.message}</p>
                  )}

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
    </div>
  );
}
