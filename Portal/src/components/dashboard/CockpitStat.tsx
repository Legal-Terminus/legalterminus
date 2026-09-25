import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Story 39.1 — one figure on the dashboard cockpit.
 *
 * Every figure is a LINK: it lands on the rows that make it up, so the number
 * is a door rather than a decoration. Tone follows the house colour rule —
 * colour marks the exception, so a zero is always calm whatever the field.
 */
export type StatTone = 'danger' | 'warning' | 'info' | 'success';

interface Props {
  label: string;
  /** `undefined` = still loading (renders a placeholder). */
  value: number | string | undefined;
  to: string;
  /** Short line under the figure — what the number means, or what to do. */
  hint?: string;
  /** Applied only when `value` is a positive number (or a non-empty string). */
  tone?: StatTone;
  /** Story 39.1 AC4: figures are for reading, so a test can find them by name. */
  testId?: string;
}

const TONE_TEXT: Record<StatTone, string> = {
  danger: 'text-red-700',
  warning: 'text-amber-800',
  info: 'text-blue-700',
  success: 'text-emerald-800',
};

export default function CockpitStat({ label, value, to, hint, tone, testId }: Props) {
  const isPositive = typeof value === 'number' ? value > 0 : typeof value === 'string' && value !== '' && value !== '₹0';
  const cls = tone && isPositive ? TONE_TEXT[tone] : 'text-ink';
  return (
    <Link
      to={to}
      data-testid={testId}
      className="group card p-4 min-h-[88px] flex flex-col justify-between hover:shadow-card-hover hover:border-ink/15 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-ink-muted leading-snug">{label}</p>
        <ArrowRight className="w-3.5 h-3.5 shrink-0 text-ink-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="mt-2">
        {value === undefined ? (
          <span aria-hidden="true" className="inline-block h-7 w-12 rounded bg-surface-strong/70 animate-pulse" />
        ) : (
          <span className={`text-2xl font-semibold tabular-nums leading-none ${cls}`}>{value}</span>
        )}
        {hint && <p className="mt-1 text-[11px] text-ink-faint leading-snug">{hint}</p>}
      </div>
    </Link>
  );
}

/** A titled group of stats or a list, with an optional "see all" link. */
export function CockpitSection({
  title, to, linkLabel = 'See all', children,
}: { title: string; to?: string; linkLabel?: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {to && (
          <Link to={to} className="text-xs text-ink-muted hover:text-ink hover:underline">
            {linkLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
