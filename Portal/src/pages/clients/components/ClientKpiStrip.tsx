import type { ClientRollup } from '../../../api/clients';

/**
 * Story 30.3 (CM-FR5) — the Client 360's headline numbers.
 *
 * Tone rule, learned from the audit (S12): a zero is the GOOD case. Nothing here
 * turns red for "0 overdue" — colour appears only when a number is actually
 * asking for something.
 */

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Kpi({ label, value, tone, hint }: {
  label: string;
  value: string | number;
  tone?: 'alert' | 'warn';
  hint?: string;
}) {
  const cls = tone === 'alert' ? 'text-red-700' : tone === 'warn' ? 'text-amber-800' : 'text-ink';
  return (
    <div className="card p-4" title={hint}>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${cls}`}>{value}</p>
    </div>
  );
}

export default function ClientKpiStrip({ client }: { client: ClientRollup }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      <Kpi label="Active matters" value={client.activeMatters} />
      <Kpi
        label="With client"
        value={client.stuckOnClient}
        tone={client.stuckOnClient > 0 ? 'warn' : undefined}
        hint="Steps waiting on the client to approve, sign or upload"
      />
      <Kpi
        label="Overdue"
        value={client.overdue}
        tone={client.overdue > 0 ? 'alert' : undefined}
        hint="Steps past their due date — we are late"
      />
      <Kpi
        label="Outstanding"
        // Unpriced work is unknown, not zero (see api/clients.ts).
        value={client.hasPricedMatter ? inr(client.outstanding) : '—'}
        tone={client.outstanding > 0 ? 'warn' : undefined}
      />
      <Kpi
        label="Lifetime collected"
        value={client.hasPricedMatter ? inr(client.lifetimeCollected) : '—'}
      />
      <Kpi label="Next renewal" value={shortDate(client.nextRenewalAt)} />
    </div>
  );
}
