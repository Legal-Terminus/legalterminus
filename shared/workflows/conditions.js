/**
 * Story 34.2 — step conditions (Epic 34).
 *
 * A step can declare a condition on the CLIENT's profile, so one definition
 * serves clients whose situations differ without an author inventing a manual
 * branch for a fact the system already knows ("does this client have GST?").
 *
 * ── Confirmed, never automatic (owner decision, 2026-09-06) ──
 *
 * This module answers ONE question: does this step apply to this client, and if
 * not, why? It never advances anything. The 2026-09-05 stance — a human stays
 * in the loop for every state change — cancelled auto-advance (31.5) and
 * automatic client chasing (31.1), and a condition skip is still an automatic
 * state change if the engine performs it. So the engine evaluates and
 * recommends; a person confirms the skip using the transition machinery that
 * already exists.
 *
 * A consequence worth noting: because nothing moves on its own, the original
 * design's cascade limiter and cycle guard are unnecessary. A chain of
 * inapplicable steps is confirmed one at a time, by somebody who can see the
 * reason for each.
 *
 * ── Typed operators ──
 *
 * Fields are typed, and each type admits only operators that mean something for
 * it. `hasGst gt 5` is nonsense, and letting an author express it produces a
 * condition that silently never matches — the failure mode a closed catalog
 * exists to prevent.
 */

/** The client-profile fields a condition may read, and their kind. */
export const CONDITION_FIELDS = {
  // `label` heads a column or a dropdown; `phrase` completes the sentence
  // "This step applies only when …". Lower-casing the label produced "client
  // has gst", which reads like a typo rather than a sentence.
  // `negative` is a separate sentence rather than "<phrase> is not set", which
  // produced "the client has a PAN is not set".
  hasGst: {
    kind: 'boolean', label: 'Client has GST',
    phrase: 'the client has GST', negative: 'the client has no GST registration',
  },
  hasPan: {
    kind: 'boolean', label: 'Client has PAN',
    phrase: 'the client has a PAN', negative: 'the client has no PAN',
  },
  isComplete: {
    kind: 'boolean', label: 'Client profile is complete',
    phrase: 'the client profile is complete', negative: 'the client profile is incomplete',
  },
  entityType: { kind: 'enum', label: 'Entity type', phrase: 'the entity type' },
  tags: { kind: 'set', label: 'Client tags', phrase: 'the client tags' },
};

export const CONDITION_FIELD_NAMES = Object.keys(CONDITION_FIELDS);

/** Operators, keyed by the field kind they are valid for. */
export const OPERATORS_BY_KIND = {
  boolean: ['is_true', 'is_false'],
  enum: ['equals', 'not_equals', 'in'],
  set: ['contains', 'not_contains'],
};

/** Every operator, for schema validation. */
export const CONDITION_OPERATORS = [
  ...new Set(Object.values(OPERATORS_BY_KIND).flat()),
];

/** Operators that take no value ("is the box ticked?"). */
const VALUELESS = new Set(['is_true', 'is_false']);

/**
 * Is this a structurally valid condition? Returns an error string, or null.
 *
 * Used by definition validation, so an author cannot SAVE a condition that
 * could never match — far better than discovering it when a real matter
 * reaches the step.
 */
export function validateCondition(condition) {
  if (!condition) return null; // absent is fine — most steps have none
  if (typeof condition !== 'object') return 'A condition must be an object.';

  const { field, op, value } = condition;
  const def = CONDITION_FIELDS[field];
  if (!def) return `Unknown condition field: ${field}`;

  const allowed = OPERATORS_BY_KIND[def.kind] ?? [];
  if (!allowed.includes(op)) {
    return `Operator '${op}' does not apply to ${def.label} (allowed: ${allowed.join(', ')}).`;
  }

  if (VALUELESS.has(op)) return null;
  if (value === undefined || value === null || value === '') {
    return `Operator '${op}' needs a value.`;
  }
  if (op === 'in' && !Array.isArray(value)) return "Operator 'in' needs a list of values.";
  if (op !== 'in' && Array.isArray(value)) return `Operator '${op}' takes a single value.`;
  return null;
}

/**
 * Evaluate a condition against a derived client profile.
 *
 * Returns `true` when the step APPLIES. An unreadable condition or a missing
 * profile returns `true` — fail OPEN, deliberately: a step that quietly
 * disappears because a profile field was blank is far worse than one that
 * appears and is completed. The person can always skip it.
 */
export function evaluateCondition(condition, profile) {
  if (!condition) return true;
  if (validateCondition(condition)) return true;
  if (!profile) return true;

  const { field, op, value } = condition;
  const actual = profile[field];

  switch (op) {
    case 'is_true': return actual === true;
    case 'is_false': return actual !== true;
    case 'equals': return actual === value;
    case 'not_equals': return actual !== value;
    case 'in': return Array.isArray(value) && value.includes(actual);
    case 'contains': return Array.isArray(actual) && actual.includes(value);
    case 'not_contains': return !(Array.isArray(actual) && actual.includes(value));
    default: return true;
  }
}

/**
 * Plain English for the person confirming a skip, and for the editor summary.
 *
 * The reason a step is being skipped has to be readable by whoever clicks the
 * button — "condition not met" tells them nothing about whether that is right.
 */
export function describeCondition(condition) {
  if (!condition) return null;
  const def = CONDITION_FIELDS[condition.field];
  if (!def) return 'an unrecognised condition';

  const { op, value } = condition;
  const phrase = def.phrase ?? def.label.toLowerCase();
  switch (op) {
    case 'is_true': return phrase;
    case 'is_false': return def.negative ?? `${phrase} is not set`;
    case 'equals': return `${phrase} is ${value}`;
    case 'not_equals': return `${phrase} is not ${value}`;
    case 'in': return `${phrase} is one of ${(value ?? []).join(', ')}`;
    case 'contains': return `client is tagged “${value}”`;
    case 'not_contains': return `client is not tagged “${value}”`;
    default: return 'an unrecognised condition';
  }
}

/** The sentence shown when a step does NOT apply. */
export function describeSkipReason(condition) {
  const what = describeCondition(condition);
  return what ? `This step applies only when ${what}.` : null;
}
