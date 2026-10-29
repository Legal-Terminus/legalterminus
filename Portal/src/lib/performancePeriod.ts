/**
 * LT #216 — the Employee Performance report's period presets, in the viewer's
 * LOCAL time: "today" starts at local midnight, weeks start on Monday.
 */
export type PerfPeriod = 'today' | 'week' | 'month' | 'custom';

export const PERF_PERIODS: { value: PerfPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'custom', label: 'Custom dates' },
];

export interface PeriodRange { from: Date; to: Date; error?: string }

const startOfDay = (y: number, m: number, d: number) => new Date(y, m, d, 0, 0, 0, 0);
const endOfDay = (y: number, m: number, d: number) => new Date(y, m, d, 23, 59, 59, 999);

/** 'YYYY-MM-DD' → [y, monthIndex, d], or null. */
function parseDay(s?: string): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? '');
  if (!m) return null;
  const y = Number(m[1]); const mo = Number(m[2]) - 1; const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  return dt.getMonth() === mo ? [y, mo, d] : null;
}

/** A Date → 'YYYY-MM-DD' in local time (for <input type="date">). */
export function toDayString(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function periodRange(period: PerfPeriod, from?: string, to?: string, now = new Date()): PeriodRange {
  const y = now.getFullYear(); const m = now.getMonth(); const d = now.getDate();
  if (period === 'today') return { from: startOfDay(y, m, d), to: endOfDay(y, m, d) };
  if (period === 'week') {
    const back = (now.getDay() + 6) % 7; // Monday = 0
    return { from: startOfDay(y, m, d - back), to: endOfDay(y, m, d - back + 6) };
  }
  if (period === 'month') return { from: startOfDay(y, m, 1), to: endOfDay(y, m + 1, 0) };
  const f = parseDay(from) ?? [y, m, d];
  const t = parseDay(to) ?? f;
  const range = { from: startOfDay(...f), to: endOfDay(...t) };
  if (range.to < range.from) return { ...range, error: 'The end date is before the start date.' };
  if ((range.to.getTime() - range.from.getTime()) / 86_400_000 > 366) return { ...range, error: 'Choose a period of at most a year.' };
  return range;
}

/** Minutes east of UTC for the viewer (IST = 330) — where the server starts a day. */
export const localTzOffset = () => -new Date().getTimezoneOffset();
