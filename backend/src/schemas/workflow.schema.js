import { z } from 'zod';
import { DUE_ANCHORS } from '../../../shared/workflows/dueRules.js';
import { CONDITION_FIELD_NAMES, CONDITION_OPERATORS } from '../../../shared/workflows/conditions.js';
import { FIELD_TYPES, MAPPABLE_PROFILE_FIELDS, MAX_FIELDS_PER_FORM } from '../../../shared/workflows/forms.js';
import { ACTION_MOMENTS } from '../../../shared/workflows/actions.js';

/**
 * Workflow config schemas. Per-phase default assignees (E11-S02): a map of
 * phaseId → user UID (or null to clear). Phase-id and assignee validity (exists +
 * is staff) are checked in the controller against the live definition/users.
 */
export const phaseAssignmentsSchema = z.object({
  assignments: z.record(
    z.string().trim().min(1).max(100),                 // phaseId
    z.string().trim().max(200).nullable(),             // uid | null
  ),
}).strict();

/**
 * Per-step ETAs (E13-S01): a map of stepNumber (as string key) → duration in days
 * (or null to clear). Step existence is checked in the controller against the live
 * definition. 0–3650 days bounds it sanely (≈10y max).
 */
export const stepEtasSchema = z.object({
  etas: z.record(
    z.string().trim().regex(/^\d+$/, 'step key must be a step number'), // stepNumber
    z.number().min(0).max(3650).nullable(),                             // days | null
  ),
}).strict();

/**
 * Per-step default assignees: a map of stepNumber (as string key) → user UID
 * (or null to clear). Step existence and assignee validity (exists + is staff)
 * are checked in the controller against the live definition/users.
 */
export const stepAssigneesSchema = z.object({
  assignees: z.record(
    z.string().trim().regex(/^\d+$/, 'step key must be a step number'), // stepNumber
    z.string().trim().max(200).nullable(),                             // uid | null
  ),
}).strict();

/**
 * Combined per-step settings (one block per step): default assignee + ETA +
 * client visibility, saved together in a single version bump. Map of stepNumber
 * (string key) → { assigneeUid?: string|null, assigneeUids?: string[], etaDays?: number|null,
 * clientVisible?: boolean }. Omitted sub-fields are left unchanged; null clears
 * an assignee/ETA. Step existence + assignee validity are checked in the
 * controller against the live definition/users.
 */
export const stepSettingsSchema = z.object({
  settings: z.record(
    z.string().trim().regex(/^\d+$/, 'step key must be a step number'),
    z.object({
      assigneeUid: z.string().trim().max(200).nullable().optional(),
      // #192: a step may have several default assignees. The list is the source of
      // truth when sent; the controller keeps `assigneeUid` as its first entry so
      // existing single-assignee consumers keep working. Capped to keep a step's
      // routing comprehensible (and the notification fan-out bounded).
      assigneeUids: z.array(z.string().trim().min(1).max(200)).max(20).optional(),
      etaDays: z.number().min(0).max(3650).nullable().optional(),
      clientVisible: z.boolean().optional(),
    }).strict(),
  ),
}).strict();

/**
 * Full workflow-definition write schema (E10-S01 editor). Mirrors the data shape
 * documented in shared/workflows/definitionSchema.js. This is the SHAPE gate;
 * structural integrity (transition targets resolve, initialStep exists, no
 * dangling phases, etc.) is enforced by `validateDefinition` in the controller,
 * which is the authoritative semantic check shared with the runtime compiler.
 *
 * `version` is NOT accepted from the client — the server owns versioning (every
 * save bumps it). `id` is immutable on update (taken from the route param).
 */
const transitionSchema = z.object({
  event: z.string().trim().min(1).max(60),
  to: z.number().int(),
  branch: z.string().trim().max(60).optional(),
}).strict();

const gateSchema = z.object({
  requires: z.enum(['fully_paid', 'part_paid']),
  onPass: z.number().int(),
  onWait: z.number().int(),
}).strict();

// NOTE: step/phase/definition objects are NOT `.strict()` — the editor round-trips
// a full server definition, so legacy/server-managed fields (e.g. timestamps on a
// step, or future additive fields) are silently STRIPPED rather than 400-ing. The
// shared `validateDefinition` in the controller is the authoritative semantic gate.
/**
 * Story 35.1 date-anchored due rule ("GSTR-1 by the 11th"). The Portal's step
 * editor has offered it since the Ambyflow port, but this schema did not list
 * it, so a saved rule was silently STRIPPED and every step fell back to its
 * typical duration. Found while building #219 (2026-11-05); ported from
 * Ambyflow's schema. The statutory key is checked against the calendar when
 * the date is resolved: an unknown key resolves to no date, i.e. the duration.
 */
const stepDueRuleSchema = z.object({
  anchor: z.enum(DUE_ANCHORS),
  offsetDays: z.number().int().min(-3650).max(3650).optional(),
  statutoryKey: z.string().trim().max(60).optional(),
}).strict();

// Step conditions, forms and actions: the Service editor has offered them since
// the Ambyflow port and the engine runs them, but this schema did not list them,
// so a saved one was silently STRIPPED (found with the due rule, #219). Ported
// verbatim from Ambyflow's schema, 2026-11-05.
/**
 * Story 32.1 — one entry per type in `shared/workflows/actions.js`. Adding a
 * type means adding it there AND here; the registry is the catalog, this is its
 * validation. `.strict()` so a typo'd param is a loud error, not a silent drop.
 */
const actionBase = {
  id: z.string().trim().min(1).max(80).optional(),
  on: z.enum(ACTION_MOMENTS).optional(),
  legacy: z.string().trim().max(60).optional(),
};

/**
 * E01-S34-2: a step's condition on the client profile. Shape only — whether the
 * OPERATOR suits the FIELD is checked by validateCondition in
 * validateDefinition, where the error can name both.
 */
const stepConditionSchema = z.object({
  field: z.enum(CONDITION_FIELD_NAMES),
  op: z.enum(CONDITION_OPERATORS),
  value: z.union([z.string().trim().max(80), z.array(z.string().trim().max(80)).max(20)]).optional(),
}).strict();

/**
 * E01-S34-3: a form on a step. Shape only — cross-field rules (a dropdown needs
 * options, keys must be unique) live in validateForm, where the error can name
 * the offending field.
 */
const formFieldSchema = z.object({
  key: z.string().trim().regex(/^[a-z0-9_]{1,40}$/i),
  label: z.string().trim().min(1).max(200),
  type: z.enum(FIELD_TYPES),
  required: z.boolean().optional(),
  help: z.string().trim().max(500).optional(),
  options: z.array(z.string().trim().max(120)).max(50).optional(),
  mapsTo: z.enum(MAPPABLE_PROFILE_FIELDS).optional(),
  /** Staff-only guidance; stripped from the client view by formForClient. */
  internalNote: z.string().trim().max(500).optional(),
}).strict();

const stepFormSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  fields: z.array(formFieldSchema).min(1).max(MAX_FIELDS_PER_FORM),
}).strict();

const stepActionSchema = z.discriminatedUnion('type', [
  z.object({
    ...actionBase,
    type: z.literal('notify'),
    to: z.enum(['client', 'assignee', 'admins']),
    title: z.string().trim().min(1).max(200),
    message: z.string().trim().max(2000).optional(),
    onlyWhenPayment: z.enum(['not_paid', 'part_paid', 'fully_paid']).optional(),
  }).strict(),
  // E01-S32-2. `template` is validated as a non-empty key here; whether it
  // NAMES a real template is resolved at run time against the workspace's own
  // set, which the schema cannot see.
  z.object({
    ...actionBase,
    type: z.literal('send_email'),
    template: z.string().trim().min(1).max(80),
    to: z.enum(['client', 'assignee', 'admins']),
  }).strict(),
  z.object({
    ...actionBase,
    type: z.literal('legacy_send_email_noop'),
  }).strict(),
]);

const stepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().trim().min(1).max(160),
  // #103: separate client-facing step name (falls back to `title` when unset).
  clientTitle: z.string().trim().max(160).optional(),
  // #106: custom client email/notification when this client step becomes their turn.
  clientPromptTitle: z.string().trim().max(200).optional(),
  clientPromptMessage: z.string().trim().max(4000).optional(),
  description: z.string().trim().max(2000).optional(),
  type: z.enum(['step', 'payment_gate', 'branch', 'final']),
  assignedRole: z.string().trim().max(60).optional(),
  defaultAssigneeUid: z.string().trim().max(200).optional(),
  effects: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  dueRule: stepDueRuleSchema.optional(),
  actions: z.array(stepActionSchema).max(20).optional(),
  condition: stepConditionSchema.optional(),
  form: stepFormSchema.optional(),
  phaseId: z.string().trim().max(100).optional(),
  typicalDurationDays: z.number().min(0).max(3650).optional(),
  clientVisible: z.boolean().optional(),
  clientActionLabel: z.string().trim().max(120).optional(),
  checklistItems: z.array(z.string().trim().min(1).max(300)).max(50).optional(),
  allowDocUpload: z.boolean().optional(),
  // #81: independent internal vs client status + notes.
  internalStatus: z.string().trim().max(200).optional(),
  internalNotes: z.string().trim().max(4000).optional(),
  clientStatus: z.string().trim().max(200).optional(),
  clientNote: z.string().trim().max(4000).optional(),
  // #82: multiple audience-tagged descriptions.
  descriptions: z.array(z.object({
    id: z.string().trim().max(60).optional(),
    audience: z.enum(['internal', 'client']).optional(),
    text: z.string().trim().min(1).max(2000),
  })).max(30).optional(),
  ownerType: z.enum(['client', 'team', 'govt']).optional(),
  gate: gateSchema.optional(),
  transitions: z.array(transitionSchema).max(40).optional(),
});

const phaseSchema = z.object({
  id: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(160),
  order: z.number().int(),
});

/** Body of POST (create) — `id` required. */
export const createDefinitionSchema = z.object({
  id: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/, 'id must be kebab-case (a–z, 0–9, -)'),
  name: z.string().trim().min(1).max(160),
  initialStep: z.number().int().min(1),
  serviceKeys: z.array(z.string().trim().min(1).max(100)).max(50).optional(),
  steps: z.array(stepSchema).min(1).max(200),
  phases: z.array(phaseSchema).max(50).optional(),
});

/** Body of PATCH (update) — `id` comes from the route, not the body. */
export const updateDefinitionSchema = createDefinitionSchema.omit({ id: true });
