import { z } from 'zod';

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
 * (string key) → { assigneeUid?: string|null, etaDays?: number|null,
 * clientVisible?: boolean }. Omitted sub-fields are left unchanged; null clears
 * an assignee/ETA. Step existence + assignee validity are checked in the
 * controller against the live definition/users.
 */
export const stepSettingsSchema = z.object({
  settings: z.record(
    z.string().trim().regex(/^\d+$/, 'step key must be a step number'),
    z.object({
      assigneeUid: z.string().trim().max(200).nullable().optional(),
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
const stepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  type: z.enum(['step', 'payment_gate', 'branch', 'final']),
  assignedRole: z.string().trim().max(60).optional(),
  defaultAssigneeUid: z.string().trim().max(200).optional(),
  effects: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  phaseId: z.string().trim().max(100).optional(),
  typicalDurationDays: z.number().min(0).max(3650).optional(),
  clientVisible: z.boolean().optional(),
  clientActionLabel: z.string().trim().max(120).optional(),
  checklistItems: z.array(z.string().trim().min(1).max(300)).max(50).optional(),
  allowDocUpload: z.boolean().optional(),
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
