/**
 * Story 32.1 — the step ACTION registry (Epic 32, Automation Runtime).
 *
 * A step could previously trigger exactly three hardcoded `effects` strings,
 * two of which had handlers. This replaces that with a declarative, versioned
 * catalog: a step carries `actions[]`, each a typed object the runner executes.
 *
 * ── Two facts about the existing runtime this design had to absorb ──
 *
 * 1. **The legacy effects fire on step EXIT**, not entry: they read the step
 *    just completed. The story assumed entry. So an action declares WHEN it
 *    runs (`on: 'entry' | 'exit'`), legacy effects map to `exit`, and their
 *    behaviour is unchanged (AC3). New actions default to `entry`.
 *
 * 2. **Client email on entry already works and is NOT gated on `SEND_EMAIL`.**
 *    `transitionTask` emails the client whenever the new step's derived owner
 *    is the client, using the editor's clientPrompt fields (#106). 19 live
 *    steps carry the `SEND_EMAIL` string with no handler reading it — that is
 *    redundancy, not a dead feature. Mapping it to a *new* email action would
 *    DOUBLE-SEND to real clients, so it maps to a no-op that documents itself.
 *
 * This module is dependency-free and shared: the Zod schema, the runner, and
 * the Portal editor all derive from `ACTION_TYPES` so the catalog cannot drift.
 */

/** When an action runs relative to the step it is declared on. */
export const ACTION_MOMENTS = ['entry', 'exit'];

/**
 * The closed action catalog. Adding a type here is the ONLY way to add one —
 * validation, the runner and the editor all read this list (AC1).
 *
 * `params` documents each type's own fields; the Zod schema mirrors it.
 */
export const ACTION_TYPES = {
  /**
   * In-app notification (+ email via the notification transport) to a chosen
   * recipient. This is what both surviving legacy effects actually did.
   */
  notify: {
    label: 'Send a notification',
    defaultMoment: 'exit',
    params: {
      to: ['client', 'assignee', 'admins'],
      title: 'string (≤200)',
      message: 'string (≤2000)',
      /** Only send when the matter is in this payment state, if set. */
      onlyWhenPayment: ['not_paid', 'part_paid', 'fully_paid'],
    },
  },

  /**
   * Story 32.2 — send one of the WORKSPACE'S OWN email templates.
   *
   * Distinct from the inert `legacy_send_email_noop` below: that one stands for
   * the automatic client email on step entry, which step ownership already
   * sends. This one is a deliberate, authored choice of template, and defaults
   * to `entry` because the usual intent is "tell them what to do now".
   */
  send_email: {
    label: 'Send an email template',
    defaultMoment: 'entry',
    params: {
      template: 'one of the workspace email template keys',
      to: ['client', 'assignee', 'admins'],
    },
  },

  /**
   * Preserved for definitions that already carry `SEND_EMAIL`. It intentionally
   * does nothing: the client email on step entry is driven by step OWNERSHIP
   * (see the header note), so executing this too would send twice.
   */
  legacy_send_email_noop: {
    label: 'Email the client when this step starts (handled by step ownership)',
    defaultMoment: 'entry',
    params: {},
    inert: true,
  },
};

export const ACTION_TYPE_NAMES = Object.keys(ACTION_TYPES);

/**
 * Map a legacy `effects[]` string to its action equivalent.
 *
 * These reproduce the EXACT copy and guards the controller used, so a workflow
 * that is migrated behaves identically (AC3). The two live effects were:
 *   NOTIFY_CLIENT_RESUBMISSION — warn the client a resubmission was raised
 *   REMIND_PART_PAYMENT        — chase the balance, only while part-paid
 */
export function actionFromLegacyEffect(effect) {
  switch (effect) {
    case 'NOTIFY_CLIENT_RESUBMISSION':
      return {
        id: 'legacy:NOTIFY_CLIENT_RESUBMISSION',
        type: 'notify',
        on: 'exit',
        to: 'client',
        title: 'Resubmission required',
        // The controller interpolates matter context and the branch name; the
        // runner supplies the same, so the message is built there.
        message: '',
        legacy: 'NOTIFY_CLIENT_RESUBMISSION',
      };
    case 'REMIND_PART_PAYMENT':
      return {
        id: 'legacy:REMIND_PART_PAYMENT',
        type: 'notify',
        on: 'exit',
        to: 'client',
        title: 'Payment reminder',
        message: '',
        onlyWhenPayment: 'part_paid',
        legacy: 'REMIND_PART_PAYMENT',
      };
    case 'SEND_EMAIL':
      return {
        id: 'legacy:SEND_EMAIL',
        type: 'legacy_send_email_noop',
        on: 'entry',
        legacy: 'SEND_EMAIL',
      };
    default:
      return null;
  }
}

/**
 * Every action a step should run, from both the new `actions[]` and any legacy
 * `effects[]`, filtered to one moment.
 *
 * Declared order is preserved (AC2). A definition carrying both is not an error
 * — during migration a step may legitimately have old effects and new actions.
 */
export function actionsForStep(step, moment) {
  if (!step) return [];
  const declared = Array.isArray(step.actions) ? step.actions : [];
  const legacy = (Array.isArray(step.effects) ? step.effects : [])
    .map(actionFromLegacyEffect)
    .filter(Boolean);

  return [...declared, ...legacy]
    .map((a) => ({ ...a, on: a.on ?? ACTION_TYPES[a.type]?.defaultMoment ?? 'entry' }))
    .filter((a) => a.on === moment)
    .filter((a) => !ACTION_TYPES[a.type]?.inert);
}

/**
 * The idempotency key for one action run (AC4).
 *
 * Keyed on the ENTRY EVENT, never on elapsed time: a retried request, a double
 * click or a second server instance all produce the same key, so the write is
 * refused rather than duplicated.
 */
export function actionRunKey({ taskId, stepNumber, moment, actionId, eventId, attempt }) {
  const base = [taskId, stepNumber, moment, actionId, eventId].filter(Boolean).join('::');
  // A RETRY is a distinct attempt at the same run (Story 32.2, deferred here
  // from 32.3). Without this, retry and idempotency are irreconcilable: reusing
  // the key means Firestore refuses the retry, and dropping the key means two
  // operators clicking Retry double-send to the client. An explicit attempt
  // number keeps each attempt individually idempotent — clicking Retry twice on
  // the same row is still one send — while the automatic path is untouched:
  // no `attempt` produces byte-identical keys to before.
  return attempt ? `${base}::retry:${attempt}` : base;
}

/** Human summary for the automation log and the editor (32.3 / 31.4). */
export function describeAction(action) {
  const def = ACTION_TYPES[action?.type];
  if (!def) return 'Unknown action';
  if (action.type === 'send_email') {
    const who = { client: 'the client', assignee: 'the assignee', admins: 'the admins' }[action.to] ?? action.to;
    return `Emails ${who} the “${action.template}” template`;
  }
  if (action.type === 'notify') {
    const who = { client: 'the client', assignee: 'the assignee', admins: 'the admins' }[action.to] ?? action.to;
    const when = action.onlyWhenPayment ? ` (only when ${action.onlyWhenPayment.replace(/_/g, ' ')})` : '';
    return `Notifies ${who}${when}`;
  }
  return def.label;
}
