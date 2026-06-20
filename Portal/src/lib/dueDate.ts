/**
 * Lateness helpers (E13-S03). Derive a human "running late / due soon" label and
 * tone from a due date vs now — purely client-side, so My Tasks / Matters / the
 * dashboard widget can show it without extra backend calls.
 */
export type DueTone = 'overdue' | 'today' | 'soon' | 'ok' | 'none';

export interface DueInfo {
  tone: DueTone;
  label: string;
  /** Whole days until due (negative = overdue). null when there's no due date. */
  days: number | null;
}

const MS_PER_DAY = 86_400_000;

/** Calendar-day difference between `dueAt` and now (today = 0, yesterday = -1). */
function dayDelta(dueAt: string, now: Date): number {
  const due = new Date(dueAt);
  // Compare at day granularity so "due today" doesn't flip to overdue at the hour.
  const d0 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const d1 = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((d1 - d0) / MS_PER_DAY);
}

/**
 * Classify a due date. `soonThreshold` (default 2) is how many days out still
 * counts as "due soon". Returns tone + a short label suitable for a badge/column.
 */
export function dueInfo(dueAt?: string | null, now: Date = new Date(), soonThreshold = 2): DueInfo {
  if (!dueAt) return { tone: 'none', label: '—', days: null };
  const days = dayDelta(dueAt, now);
  if (days < 0) {
    const n = Math.abs(days);
    return { tone: 'overdue', label: `Overdue ${n}d`, days };
  }
  if (days === 0) return { tone: 'today', label: 'Due today', days };
  if (days <= soonThreshold) return { tone: 'soon', label: `Due in ${days}d`, days };
  return { tone: 'ok', label: `${days}d left`, days };
}

/** Tailwind badge classes per tone (shared so all surfaces look consistent). */
export const DUE_BADGE_CLASS: Record<DueTone, string> = {
  overdue: 'bg-red-50 text-red-600',
  today: 'bg-amber-50 text-amber-700',
  soon: 'bg-amber-50 text-amber-700',
  ok: 'bg-surface-card text-ink-muted',
  none: 'bg-surface-card text-ink-faint',
};
