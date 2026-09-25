/**
 * Story 35.1 — date-anchored due rules (Epic 35).
 *
 * Every deadline today is a duration from when the step started
 * (`typicalDurationDays`, default 2). That cannot express the deadlines a
 * compliance practice actually works to:
 *
 *   "GSTR-1 by the 11th"                  → a fixed statutory date
 *   "client sign-off 5 days before filing" → BACKWARD from another date
 *   "file within 30 days of the AGM"       → forward from a per-matter date
 *
 * A `dueRule` expresses those directly. Duration ETAs stay the default and keep
 * working untouched, so no existing definition changes behaviour.
 *
 * ── Everything here is pure ──
 *
 * Date arithmetic is where off-by-one bugs live, and a deadline that is one day
 * wrong is worse than no deadline at all — a firm plans around it. So resolution
 * is a pure function of (rule, context), with the boundaries tested explicitly
 * rather than inferred.
 */

/** Where a due date is measured FROM. */
export const DUE_ANCHORS = ['matter_start', 'step_start', 'anchor_date', 'statutory'];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A date with no time, in UTC.
 *
 * Deadlines are calendar facts: "the 11th" is the 11th regardless of the hour
 * or the reader's timezone. Carrying a time through the arithmetic makes a due
 * date land a day early or late depending on who is looking, which is exactly
 * the class of bug this module exists to avoid.
 */
export function toDateOnly(value) {
  if (!value) return null;
  const s = String(value);
  // An ISO date or datetime: take the date part verbatim rather than parsing
  // through a local timezone, which would shift it.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const t = new Date(s).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

/** Add (or subtract) whole days to a date-only string. */
export function addDays(dateOnly, days) {
  const base = toDateOnly(dateOnly);
  if (!base || !Number.isFinite(days)) return null;
  const t = Date.parse(`${base}T00:00:00.000Z`);
  return new Date(t + Math.trunc(days) * DAY_MS).toISOString().slice(0, 10);
}

/**
 * Validate a rule. Returns an error string, or null.
 *
 * Called from `validateDefinition`, so an unusable rule is refused when the
 * workflow is SAVED — a deadline that silently fails to resolve leaves a step
 * with no date at all, which nobody notices until it is late.
 */
export function validateDueRule(rule, { statutoryKeys = null } = {}) {
  if (!rule) return null;
  if (typeof rule !== 'object') return 'dueRule must be an object';

  const { anchor, offsetDays, statutoryKey } = rule;
  if (!DUE_ANCHORS.includes(anchor)) {
    return `Unknown due anchor '${anchor}' (expected ${DUE_ANCHORS.join(', ')}).`;
  }
  if (offsetDays !== undefined && !Number.isInteger(offsetDays)) {
    return 'offsetDays must be a whole number of days.';
  }
  if (anchor === 'statutory') {
    if (!statutoryKey) return "A statutory rule needs a statutoryKey (e.g. 'gstr1').";
    // The calendar (35.3) is the authority; when a caller supplies the known
    // keys we can refuse a typo at save time instead of at run time.
    if (statutoryKeys && !statutoryKeys.includes(statutoryKey)) {
      return `Unknown statutory date '${statutoryKey}'.`;
    }
  }
  return null;
}

/**
 * Resolve a rule to a due date, or null when it cannot be resolved.
 *
 * Returning null is deliberate and safe: the caller falls back to the duration
 * ETA, so a matter created without an anchor date still gets a sensible
 * deadline rather than none.
 *
 * @param {object} rule
 * @param {object} ctx.matterStart   ISO — when the matter began
 * @param {object} ctx.stepStart     ISO — when this step became active
 * @param {object} ctx.anchorDate    ISO — the per-matter date (AGM, notice…)
 * @param {Function} ctx.resolveStatutory (key, ctx) → ISO date | null
 */
export function resolveDueDate(rule, ctx = {}) {
  if (!rule || validateDueRule(rule)) return null;
  const offset = Number.isInteger(rule.offsetDays) ? rule.offsetDays : 0;

  let base = null;
  switch (rule.anchor) {
    case 'matter_start': base = toDateOnly(ctx.matterStart); break;
    case 'step_start': base = toDateOnly(ctx.stepStart); break;
    case 'anchor_date': base = toDateOnly(ctx.anchorDate); break;
    case 'statutory':
      base = typeof ctx.resolveStatutory === 'function'
        ? toDateOnly(ctx.resolveStatutory(rule.statutoryKey, ctx))
        : null;
      break;
    default: base = null;
  }
  if (!base) return null;

  // A negative offset is BACKWARD scheduling: "five days before filing".
  return addDays(base, offset);
}

/** Does this definition need an anchor date at matter creation (AC2)? */
export function definitionNeedsAnchorDate(definition) {
  return (definition?.steps ?? []).some((s) => s?.dueRule?.anchor === 'anchor_date');
}

/** Human summary for the editor and the 31.4 automation row. */
export function describeDueRule(rule) {
  if (!rule) return null;
  const n = Number.isInteger(rule.offsetDays) ? rule.offsetDays : 0;
  const when = n === 0 ? 'on' : n > 0 ? `${n} day${n === 1 ? '' : 's'} after` : `${Math.abs(n)} day${Math.abs(n) === 1 ? '' : 's'} before`;
  switch (rule.anchor) {
    case 'matter_start': return `Due ${when} the matter starts`;
    case 'step_start': return `Due ${when} the step starts`;
    case 'anchor_date': return `Due ${when} the matter's key date`;
    case 'statutory': return `Due ${when} ${rule.statutoryKey}`;
    default: return null;
  }
}

/** Whole days from today to the due date. Negative means overdue. */
export function daysUntil(dueDate, now = Date.now()) {
  const due = toDateOnly(dueDate);
  if (!due) return null;
  const today = new Date(now).toISOString().slice(0, 10);
  return Math.round((Date.parse(`${due}T00:00:00.000Z`) - Date.parse(`${today}T00:00:00.000Z`)) / DAY_MS);
}
