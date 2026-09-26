import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Building2, KeyRound, Mail, Pencil, Phone, Plus, UserCheck,
} from 'lucide-react';
import PageShell from '../../components/common/PageShell';
import CollapsibleSection from '../../components/common/CollapsibleSection';
import ClientLoginsPanel from '../../components/users/ClientLoginsPanel';
import SendSignInLinkButton from '../../components/users/SendSignInLinkButton';
import CreateMatterModal from '../../components/tasks/CreateMatterModal';
import { SkeletonRows } from '../../components/common/Skeleton';
import { usePageTitle } from '../../hooks/useDocumentTitle';
import { getClient } from '../../api/clients';
import ClientKpiStrip from './components/ClientKpiStrip';
import ClientMattersList from './components/ClientMattersList';
import AttentionFeed from './components/AttentionFeed';
import { ClientMoneyTable, ClientRenewals } from './components/ClientMoney';
import { eventLabel } from '../../lib/eventLabels';

/**
 * Stories 30.3–30.5 — the Client 360 (Epic 30).
 *
 * Answers "what is going on with this client?" in one screen: health, value,
 * commitments, coverage. Composed from small components on purpose — the audit
 * (S32) had to break up a 2,900-line matter page, and this one starts assembled.
 *
 * **Workbench-by-navigation.** The page mutates NOTHING about a matter. The only
 * actions here are the four with no matter to live in: create a matter, edit the
 * profile, nudge the client, manage their logins. Everything else is a link.
 */

const FIELD_LABEL: Record<string, string> = {
  panNumber: 'PAN',
  gstNumber: 'GST number',
  address: 'address',
  state: 'state',
};

function relDate(iso: string | null): string {
  if (!iso) return '—';
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ClientDetailPage() {
  const { uid = '' } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['clients', uid],
    queryFn: () => getClient(uid),
    enabled: Boolean(uid),
    staleTime: 15_000,
  });

  usePageTitle(data?.client.name ?? null);

  if (isLoading) {
    return (
      <PageShell title="Client" subtitle="Loading…">
        <div aria-busy="true" aria-label="Loading client">
          <div className="card overflow-hidden"><SkeletonRows rows={6} /></div>
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    // A staff uid, a deleted client, or another workspace's uid all land here —
    // say so plainly and give a way back rather than a dead end.
    return (
      <PageShell title="Client not found">
        <div className="card p-12 text-center">
          <p className="text-sm text-ink-muted">
            This client doesn&apos;t exist, or you don&apos;t have access to them.
          </p>
          <Link to="/clients" className="btn-secondary mt-4 inline-flex">Back to Clients</Link>
        </div>
      </PageShell>
    );
  }

  const { client, matters, renewals, attention, activity } = data;
  const org = client.organisation || client.businessName;

  return (
    <PageShell
      title={client.name}
      subtitle={[org, client.email].filter(Boolean).join(' · ')}
      back={(
        <button
          onClick={() => navigate('/clients')}
          aria-label="Back to Clients"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-soft"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      )}
      action={(
        <div className="flex items-center gap-2">
          {/* CM-FR10: the only actions with no matter to live in. */}
          {/* #203: a stuck client gets in without anyone handling a password. */}
          <SendSignInLinkButton uid={uid} email={client.email} />
          <button
            onClick={() => navigate(`/users/edit/client/${uid}`)}
            className="btn-secondary inline-flex items-center gap-1.5"
          >
            <Pencil className="w-4 h-4" /> <span className="hidden sm:inline">Edit profile</span>
          </button>
          <button onClick={() => setCreating(true)} className="btn-primary inline-flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Matter</span><span className="sm:hidden">Matter</span>
          </button>
        </div>
      )}
    >
      {creating && <CreateMatterModal onClose={() => setCreating(false)} initialClientUid={uid} />}

      <ClientKpiStrip client={client} />

      {/* Identity — the relationship facts a manager needs before a call. */}
      <section className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {client.email && (
            <p className="flex items-center gap-2 min-w-0">
              <Mail className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
              <span className="truncate">{client.email}</span>
            </p>
          )}
          {client.phone && (
            <p className="flex items-center gap-2 min-w-0">
              <Phone className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
              <span className="truncate">{client.phone}</span>
            </p>
          )}
          {client.groupCompany && (
            <p className="flex items-center gap-2 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
              <span className="truncate">{client.groupCompany}</span>
            </p>
          )}
          {client.professionalName && (
            <p className="flex items-center gap-2 min-w-0">
              <UserCheck className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />
              <span className="truncate">Referred by {client.professionalName}</span>
            </p>
          )}
          <p className="text-ink-muted">Client since {relDate(client.createdAt)}</p>
        </div>

        {/* CM-FR12: a quiet checklist, never a wall of warnings. */}
        {client.missingProfileFields.length > 0 && (
          <p className="mt-3 pt-3 border-t border-hairline-soft text-xs text-ink-muted">
            Missing for filings: {client.missingProfileFields.map((f) => FIELD_LABEL[f] ?? f).join(', ')}.{' '}
            <Link to={`/users/edit/client/${uid}`} className="text-brand-600 hover:underline">Add them</Link>
          </p>
        )}
      </section>

      {/* The actionable list leads — this is what the page is FOR. */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-ink mb-2">Needs attention</h2>
        <AttentionFeed items={attention} />
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-ink mb-2">Matters</h2>
        <ClientMattersList matters={matters} />
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-ink mb-2">Money</h2>
        <div className="card p-4"><ClientMoneyTable matters={matters} /></div>
      </section>

      <ClientRenewals renewals={renewals} />

      {activity.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-ink mb-2">Recent activity</h2>
          <div className="card divide-y divide-hairline overflow-hidden">
            {activity.map((e) => (
              <Link key={e.id} to={`/tasks/${e.taskId}`} className="block p-3 hover:bg-surface-soft">
                {/* Falling back to `e.type` printed the raw workflow event —
                    "COMPLETE_STEP", "BRANCH_DECISION" — on a client-facing
                    page. eventLabel() gives the standalone human form, and
                    sentence-cases anything it does not know rather than
                    leaking a new constant. */}
                <p className="text-sm text-ink truncate">{e.comment || eventLabel(e.type)}</p>
                <p className="text-xs text-ink-muted truncate">
                  {e.serviceName}{e.at ? ` · ${relDate(e.at)}` : ''}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <CollapsibleSection
          id={`client-logins-${uid}`}
          title="Logins"
          hint="Who can sign in on this client's behalf."
        >
          <div className="flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-ink-muted mt-1 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1"><ClientLoginsPanel clientUid={uid} /></div>
          </div>
        </CollapsibleSection>
      </section>
    </PageShell>
  );
}
