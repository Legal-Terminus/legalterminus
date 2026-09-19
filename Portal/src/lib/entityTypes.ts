/**
 * Entity types for the client profile (ported from Ambyflow, Story 34.1).
 *
 * Mirrors `ENTITY_TYPE_LABELS` in `backend/src/services/clientProfile.service.js`.
 * The backend enum is the enforcement (a Zod `z.enum`); this is the display
 * list, and a test asserts the two agree — a client form offering a value the
 * schema rejects is a form that cannot be submitted.
 */
export const ENTITY_TYPE_OPTIONS = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'LLP' },
  { value: 'pvt_ltd', label: 'Private Limited' },
  { value: 'public', label: 'Public Limited' },
  { value: 'trust', label: 'Trust' },
  { value: 'society', label: 'Society' },
  { value: 'individual', label: 'Individual' },
] as const;

export const ENTITY_TYPE_LABEL: Record<string, string> =
  Object.fromEntries(ENTITY_TYPE_OPTIONS.map((o) => [o.value, o.label]));
