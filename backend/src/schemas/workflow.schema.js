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
