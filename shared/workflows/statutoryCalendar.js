/**
 * Story 35.3 — the statutory calendar (Epic 35).
 *
 * Story 35.1 lets a step say "due on `gstr1`". This is where that key becomes a
 * date. The table is per workspace: the platform seeds sensible defaults, and a
 * firm edits OVERRIDES only — so a platform re-seed can never clobber a firm's
 * edit, and a firm's edit never has to be re-applied after one.
 *
 * ── Why a firm must be able to edit it ──
 *
 * CBDT and GSTN extend due dates several times a year, usually at short notice.
 * If the calendar were platform-only, every extension would need a deploy and
 * every firm would work to a wrong date until it landed. One edit here moves
 * every affected deadline.
 *
 * ── Three layers, in precedence order ──
 *
 *   1. a year-specific OVERRIDE   ("GSTR-1 for Sep 2026 was extended to the 13th")
 *   2. a workspace OVERRIDE       (this firm always works to a different rule)
 *   3. the platform DEFAULT
 *
 * An extension is the common case and is dated, so it must not silently become
 * this firm's permanent rule — which is why layer 1 is separate from layer 2.
 */

/** How a statutory date is expressed. */
export const RULE_KINDS = ['day_of_month', 'fixed_date', 'anchor_offset'];

/**
 * Platform defaults. Deliberately a small, uncontroversial set: these are the
 * dates a firm would recognise without argument, and a workspace can add its
 * own. Getting a date wrong here is worse than omitting it, because a firm
 * would trust it.
 */
export const DEFAULT_CALENDAR = {
  gstr1: { label: 'GSTR-1 (monthly)', kind: 'day_of_month', day: 11 },
  gstr3b: { label: 'GSTR-3B (monthly)', kind: 'day_of_month', day: 20 },
  tds_payment: { label: 'TDS payment', kind: 'day_of_month', day: 7 },
  pf_payment: { label: 'PF contribution', kind: 'day_of_month', day: 15 },
  esi_payment: { label: 'ESI contribution', kind: 'day_of_month', day: 15 },
  // Anchored to the AGM rather than the calendar: the date only exists once a
  // company has held its meeting.
  roc_aoc4: { label: 'ROC AOC-4 (30 days after AGM)', kind: 'anchor_offset', offsetDays: 30 },
  roc_mgt7: { label: 'ROC MGT-7 (60 days after AGM)', kind: 'anchor_offset', offsetDays: 60 },
};

export const DEFAULT_KEYS = Object.keys(DEFAULT_CALENDAR);

/** Validate one entry. Returns an error string, or null. */
export function validateCalendarEntry(entry) {
  if (!entry || typeof entry !== 'object') return 'A calendar entry must be an object.';
  if (!RULE_KINDS.includes(entry.kind)) {
    return `Unknown rule kind '${entry.kind}' (expected ${RULE_KINDS.join(', ')}).`;
  }
  if (entry.kind === 'day_of_month') {
    // 1–28 only: a rule of "the 30th" is undefined in February, and silently
    // clamping it would make a deadline wrong two months in twelve.
    if (!Number.isInteger(entry.day) || entry.day < 1 || entry.day > 28) {
      return 'day must be a whole number between 1 and 28 (a later day is undefined in February).';
    }
  }
  if (entry.kind === 'fixed_date' && !/^\d{4}-\d{2}-\d{2}$/.test(String(entry.date ?? ''))) {
    return 'date must be YYYY-MM-DD.';
  }
  if (entry.kind === 'anchor_offset' && !Number.isInteger(entry.offsetDays)) {
    return 'offsetDays must be a whole number of days.';
  }
  return null;
}

/**
 * Merge the three layers for one key.
 *
 * `periodKey` scopes a year-specific override — "2026-09" for a monthly filing,
 * "2026" for an annual one. An override for a period that is not the one being
 * resolved is ignored, which is what keeps a one-off extension one-off.
 */
export function resolveEntry(key, { defaults = DEFAULT_CALENDAR, overrides = {}, periodKey = null } = {}) {
  const base = defaults[key] ?? null;
  const ws = overrides[key] ?? null;

  // Layer 1: a dated extension for exactly this period.
  const periodOverride = periodKey && ws?.periods && ws.periods[periodKey]
    ? ws.periods[periodKey]
    : null;

  const merged = { ...(base ?? {}), ...(ws?.entry ?? {}), ...(periodOverride ?? {}) };
  if (!merged.kind) return null;
  return {
    ...merged,
    key,
    // Where the answer came from, so the settings screen can show "overridden"
    // and offer a revert rather than leaving a firm guessing.
    source: periodOverride ? 'period' : ws?.entry ? 'workspace' : 'platform',
  };
}

/**
 * The date this key resolves to for a given month.
 *
 * @param {string} key
 * @param {object} ctx.month      'YYYY-MM' — the period being filed for
 * @param {object} ctx.anchorDate ISO date, for anchor_offset rules
 */
export function resolveStatutoryDate(key, ctx = {}) {
  const entry = resolveEntry(key, ctx);
  if (!entry || validateCalendarEntry(entry)) return null;

  switch (entry.kind) {
    case 'fixed_date':
      return entry.date;

    case 'day_of_month': {
      const month = String(ctx.month ?? '').match(/^(\d{4})-(\d{2})$/);
      if (!month) return null;
      // The filing month is the month AFTER the period, which is how monthly
      // returns actually work: September's GSTR-1 is due in October.
      const [, y, m] = month;
      const due = new Date(Date.UTC(Number(y), Number(m), entry.day));
      return due.toISOString().slice(0, 10);
    }

    case 'anchor_offset': {
      const anchor = String(ctx.anchorDate ?? '').slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(anchor)) return null;
      const t = Date.parse(`${anchor}T00:00:00.000Z`);
      return new Date(t + entry.offsetDays * 86_400_000).toISOString().slice(0, 10);
    }

    default:
      return null;
  }
}

/** Every key a workspace can reference — defaults plus its own additions. */
export function calendarKeys({ defaults = DEFAULT_CALENDAR, overrides = {} } = {}) {
  return [...new Set([...Object.keys(defaults), ...Object.keys(overrides)])].sort();
}

/** The settings-screen view: what it resolves to, and whether a firm changed it. */
export function presentCalendar({ defaults = DEFAULT_CALENDAR, overrides = {}, month = null } = {}) {
  return calendarKeys({ defaults, overrides }).map((key) => {
    const entry = resolveEntry(key, { defaults, overrides, periodKey: month });
    return {
      key,
      label: entry?.label ?? key,
      kind: entry?.kind ?? null,
      day: entry?.day ?? null,
      date: entry?.date ?? null,
      offsetDays: entry?.offsetDays ?? null,
      source: entry?.source ?? 'platform',
      resolved: month ? resolveStatutoryDate(key, { defaults, overrides, month, periodKey: month }) : null,
    };
  });
}
