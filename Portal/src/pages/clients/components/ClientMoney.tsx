import { Link } from 'react-router-dom';
import type { ClientMatter } from '../../../api/clients';

/**
 * Story 30.4 (CM-FR8/9) — what the client owes, and what we owe them next.
 *
 * Recording a payment happens on the matter's Payments tab; these rows link
 * there (`?tab=payments`, Story 29.2/S24). Nothing is edited here.
 */

const inr = (n: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ClientMoneyTable({ matters }: { matters: ClientMatter[] }) {
  // An unpriced matter has nothing to say about money; showing it as ₹0 would
  // assert a price nobody set.
  const priced = matters.filter((m) => m.money.priced);
  if (priced.length === 0) {
    return <p className="text-sm text-ink-muted">No priced matters yet.</p>;
  }

  const totals = priced.reduce((acc, m) => ({
    total: acc.total + m.money.total,
    received: acc.received + m.money.received,
    balance: acc.balance + m.money.balance,
  }), { total: 0, received: 0, balance: 0 });

  const rows = [...priced].sort((a, b) => b.money.balance - a.money.balance);

  return (
    <>
      {/* Story 29.4 (S13): tables get a stacked branch on mobile, never an overflow. */}
      <div className="md:hidden divide-y divide-hairline-soft">
        {rows.map((m) => (
          <Link key={m.id} to={`/tasks/${m.id}?tab=payments`} className="block py-3">
            <p className="text-sm font-medium text-ink truncate">{m.serviceName}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 text-xs">
              <span className="text-ink-muted">Cost <span className="text-ink">{inr(m.money.total)}</span></span>
              <span className="text-ink-muted">Received <span className="text-ink">{inr(m.money.received)}</span></span>
              <span className={m.money.balance > 0 ? 'text-amber-800 font-medium' : 'text-ink-muted'}>
                Balance {inr(m.money.balance)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-muted text-xs">
              <th className="pb-2 font-medium">Matter</th>
              <th className="pb-2 font-medium text-right">Cost</th>
              <th className="pb-2 font-medium text-right">Received</th>
              <th className="pb-2 font-medium text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-t border-hairline-soft hover:bg-surface-soft">
                <td className="py-2">
                  <Link to={`/tasks/${m.id}?tab=payments`} className="text-ink hover:underline">
                    {m.serviceName}
                  </Link>
                </td>
                <td className="py-2 text-right text-ink-muted">{inr(m.money.total)}</td>
                <td className="py-2 text-right text-ink-muted">{inr(m.money.received)}</td>
                <td className={`py-2 text-right ${m.money.balance > 0 ? 'text-amber-800 font-medium' : 'text-ink-muted'}`}>
                  {inr(m.money.balance)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-hairline font-medium">
              <td className="py-2 text-ink">Total</td>
              <td className="py-2 text-right text-ink">{inr(totals.total)}</td>
              <td className="py-2 text-right text-ink">{inr(totals.received)}</td>
              <td className={`py-2 text-right ${totals.balance > 0 ? 'text-amber-800' : 'text-ink'}`}>
                {inr(totals.balance)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Is this ISO date in the past? Impure by nature, so it lives OUTSIDE render. */
function isPast(iso?: string | null) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && t < Date.now();
}

export function ClientRenewals({ renewals }: { renewals: ClientMatter[] }) {
  // No recurring services → render nothing at all. Empty scaffolding on a
  // monitoring page is noise.
  if (renewals.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-ink mb-2">Renewals</h2>
      <div className="card divide-y divide-hairline overflow-hidden">
        {renewals.map((m) => {
          // Compared against the clock read inside `isPast`, a module-scope
          // helper — reading Date.now() during render would make this component
          // non-deterministic (react-hooks/purity).
          const late = isPast(m.recurrenceNextDueAt);
          return (
            <Link key={m.id} to={`/tasks/${m.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-surface-soft">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{m.serviceName}</p>
                <p className="text-xs text-ink-muted capitalize">{m.recurrence ?? 'recurring'}</p>
              </div>
              <span className={`text-sm shrink-0 ${late ? 'text-amber-800 font-medium' : 'text-ink-muted'}`}>
                {late ? 'Due ' : ''}{shortDate(m.recurrenceNextDueAt)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
