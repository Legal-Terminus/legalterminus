/**
 * Human labels for matter event types.
 *
 * WHY. An event's `type` is the raw workflow event that caused it —
 * `COMPLETE_STEP`, `BRANCH_DECISION`, `GOVT_APPROVE`. That is exactly right in
 * the stored audit trail, and exactly wrong on screen: the client 360's
 * activity feed falls back to the type when an event carries no comment, so a
 * real client page read "COMPLETE_STEP" and "BRANCH_DECISION" in front of the
 * client's own name.
 *
 * ── Two vocabularies, deliberately ──
 *
 * `EVENT_VERB` in TaskDetailPage phrases the same types as VERB PHRASES
 * ("completed the step"), because that timeline always renders them after an
 * actor: "Priya completed the step". Those cannot be reused where the label
 * stands alone — "COMPLETE_STEP" would become "completed the step" with
 * nothing to complete it.
 *
 * So this module holds the STANDALONE form ("Step completed"), for surfaces
 * that show an event without an actor. The diagram has a third set again
 * (`EVENT_LABEL` in machineToGraph.ts) phrased as edge conditions — "When
 * done" — which is right for an arrow and wrong for a feed.
 *
 * Three vocabularies sounds like duplication; it is not. Each reads correctly
 * only in its own frame, and collapsing them would make at least two of the
 * three ungrammatical.
 */

/** Standalone, sentence-case descriptions of what happened. */
const EVENT_LABEL: Record<string, string> = {
  COMPLETE_STEP: 'Step completed',
  BRANCH_DECISION: 'Decision made',
  CLIENT_APPROVE: 'Client approved',
  CLIENT_REJECT: 'Client requested changes',
  GOVT_APPROVE: 'Department approved',
  GOVT_REJECT: 'Department rejected',
  REWORK: 'Sent back for correction',
  RECORD_PAYMENT: 'Payment recorded',
  PAYMENT_RECORDED: 'Payment recorded',
  PAYMENT_UPDATED: 'Payment updated',
  PAYMENT_DELETED: 'Payment deleted',
  ADMIN_OVERRIDE_PAYMENT: 'Payment gate overridden',
  STEP_NOTE: 'Note added',
  STEP_REASSIGNED: 'Step reassigned',
  MATTER_REASSIGNED: 'Matter reassigned',
  REMINDER_SENT: 'Reminder sent',
  INTERNAL_REMINDER_SENT: 'Internal reminder sent',
  STEP_REOPENED: 'Step reopened',
  TASK_APPROVED: 'Matter approved',
  TASK_REJECTED: 'Matter rejected',
  TASK_STOPPED: 'Matter stopped',
  TASK_RESTARTED: 'Matter restarted',
  TASK_ARCHIVED: 'Matter archived',
  AUTOMATION: 'Ran automatically',
  AUTOMATION_FAILED: 'Automation did not run',
};

/**
 * A readable description of an event type.
 *
 * Unknown types degrade to sentence case rather than to the raw constant, so a
 * workflow event added later reads as "Some new event" instead of leaking
 * `SOME_NEW_EVENT` onto a client-facing page. The map stays the place to give
 * it proper wording.
 */
export function eventLabel(type: string | null | undefined): string {
  if (!type) return 'Activity';
  const known = EVENT_LABEL[type];
  if (known) return known;
  const words = type.toLowerCase().replace(/_/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Activity';
}
