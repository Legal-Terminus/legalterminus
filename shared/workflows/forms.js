/**
 * Story 34.3 — form steps (Epic 34).
 *
 * A step that asks the client structured questions in the portal, so intake
 * data lands ON the record instead of arriving as free-text messages that
 * somebody has to re-key.
 *
 * ── Submission is a TRIGGER, not an advance ──
 *
 * Submitting completes the CLIENT's part and tells staff. It does not move the
 * matter: the 2026-09-05 decision (which cancelled 31.5) keeps a human in the
 * loop for every state change, and 34.2 was built the same way. Staff review
 * the answers and advance, exactly as they would after any client action.
 *
 * ── Field→profile mapping ──
 *
 * A field may declare `mapsTo`, so a GSTIN answer fills the client's
 * `gstNumber` and immediately feeds 34.2's conditions. Only fields a firm
 * genuinely re-asks are mappable, and the write goes through the same audited
 * path as a manual edit — a form must not be a side door into the profile.
 */

/** Field kinds. `file` deliberately absent — documents already have a flow. */
export const FIELD_TYPES = ['text', 'longtext', 'number', 'date', 'select', 'yesno'];

/** Client-profile fields a form answer may write. Deliberately short. */
export const MAPPABLE_PROFILE_FIELDS = [
  'gstNumber', 'panNumber', 'address', 'state', 'businessName', 'entityType',
];

export const MAX_FIELDS_PER_FORM = 40;
export const MAX_ANSWER_LENGTH = 2000;

/**
 * Validate a form definition. Returns an array of error strings.
 *
 * Called from `validateDefinition`, so a form that could not be filled in is
 * refused when the workflow is SAVED rather than when a client opens it and
 * finds a broken page.
 */
export function validateForm(form) {
  const errors = [];
  if (!form) return errors;
  if (typeof form !== 'object') return ['form must be an object'];

  const fields = Array.isArray(form.fields) ? form.fields : null;
  if (!fields || fields.length === 0) return ['a form step must have at least one field'];
  if (fields.length > MAX_FIELDS_PER_FORM) {
    errors.push(`a form may have at most ${MAX_FIELDS_PER_FORM} fields`);
  }

  const keys = new Set();
  for (const f of fields) {
    const where = f?.key ? `field '${f.key}'` : `field '${f?.label ?? '?'}'`;
    if (!f?.key || !/^[a-z0-9_]{1,40}$/i.test(f.key)) {
      errors.push(`${where}: key must be 1-40 letters, digits or underscores`);
      continue;
    }
    // Duplicate keys would make one answer overwrite another silently.
    if (keys.has(f.key)) errors.push(`duplicate field key '${f.key}'`);
    keys.add(f.key);

    if (!f.label || !String(f.label).trim()) errors.push(`${where}: a label is required`);
    if (!FIELD_TYPES.includes(f.type)) errors.push(`${where}: unknown type '${f.type}'`);

    // A dropdown with no options cannot be answered.
    if (f.type === 'select') {
      const opts = Array.isArray(f.options) ? f.options.filter((o) => String(o ?? '').trim()) : [];
      if (opts.length === 0) errors.push(`${where}: a dropdown needs at least one option`);
    }

    if (f.mapsTo !== undefined && !MAPPABLE_PROFILE_FIELDS.includes(f.mapsTo)) {
      errors.push(`${where}: '${f.mapsTo}' is not a mappable client field`);
    }
  }
  return errors;
}

/**
 * Coerce and validate one client's answers against the form.
 *
 * Returns `{ answers, errors }`. Answers are cleaned rather than trusted: the
 * portal is a browser and a determined client can post anything.
 */
export function validateAnswers(form, raw) {
  const errors = [];
  const answers = {};
  const fields = Array.isArray(form?.fields) ? form.fields : [];
  const input = raw && typeof raw === 'object' ? raw : {};

  for (const f of fields) {
    const value = input[f.key];
    const missing = value === undefined || value === null || String(value).trim() === '';

    if (missing) {
      // Required is enforced on SUBMIT only; a partial save may leave gaps,
      // which is what makes "come back to it later" work.
      if (f.required) errors.push({ field: f.key, message: `${f.label} is required.` });
      continue;
    }

    switch (f.type) {
      case 'number': {
        const n = Number(value);
        if (!Number.isFinite(n)) { errors.push({ field: f.key, message: `${f.label} must be a number.` }); break; }
        answers[f.key] = n;
        break;
      }
      case 'yesno':
        answers[f.key] = value === true || value === 'true' || value === 'yes';
        break;
      case 'date': {
        const t = new Date(String(value)).getTime();
        if (Number.isNaN(t)) { errors.push({ field: f.key, message: `${f.label} must be a date.` }); break; }
        // Stored as a plain date string, not a timestamp: a birth date has no
        // timezone, and turning it into one shifts it by a day for some users.
        answers[f.key] = String(value).slice(0, 10);
        break;
      }
      case 'select': {
        const opts = (f.options ?? []).map((o) => String(o));
        if (!opts.includes(String(value))) {
          errors.push({ field: f.key, message: `${f.label} must be one of the listed options.` });
          break;
        }
        answers[f.key] = String(value);
        break;
      }
      default:
        // Trimmed at the SOURCE, so the stored answer and any profile field it
        // maps to hold the same string. Leaving it raw meant staff read back
        // "  29ABCDE1234F1Z5  " while the client's profile held it clean.
        answers[f.key] = String(value).trim().slice(0, MAX_ANSWER_LENGTH);
    }
  }

  // Anything the form did not ask for is DROPPED rather than stored: a client
  // posting extra keys must not be able to write arbitrary data onto a matter.
  return { answers, errors };
}

/**
 * Which client-profile fields these answers should write.
 *
 * Only mapped, answered fields, and only into the allowlist — so a form can
 * never reach a field a firm did not choose to expose.
 */
export function profileUpdatesFrom(form, answers) {
  const out = {};
  for (const f of Array.isArray(form?.fields) ? form.fields : []) {
    if (!f.mapsTo || !MAPPABLE_PROFILE_FIELDS.includes(f.mapsTo)) continue;
    const v = answers?.[f.key];
    if (v === undefined || v === null || v === '') continue;
    out[f.mapsTo] = typeof v === 'string' ? v.trim() : v;
  }
  return out;
}

/** The client-facing view: internal notes stripped (AC5). */
export function formForClient(form) {
  if (!form) return null;
  return {
    title: form.title ?? null,
    description: form.description ?? null,
    fields: (form.fields ?? []).map((f) => ({
      key: f.key,
      label: f.label,
      type: f.type,
      required: f.required === true,
      help: f.help ?? null,
      options: f.type === 'select' ? (f.options ?? []) : undefined,
      // `internalNote` and `mapsTo` are deliberately absent: the first is for
      // staff, and the second would tell a client which profile field their
      // answer rewrites.
    })),
  };
}

/** A one-line summary for the editor and the 31.4 automation row. */
export function describeForm(form) {
  const n = (form?.fields ?? []).length;
  if (!n) return null;
  return `Asks the client ${n} question${n === 1 ? '' : 's'}`;
}
