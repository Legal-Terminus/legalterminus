import { CLIENT_ASSIGNEE } from '../../../shared/workflows/definitionSchema.js';

/**
 * #192 — a workflow step's default assignees.
 *
 * A step stores two fields: `defaultAssigneeUids` (everyone) and
 * `defaultAssigneeUid` (the primary, which single-assignee consumers read). Every
 * screen that writes them must keep them consistent, and some writers only know
 * the single field (the legacy `/step-assignees` endpoint, an older Portal bundle
 * still open in a browser). So the rule is:
 *
 *   the list counts only while its FIRST entry is the step's `defaultAssigneeUid`.
 *
 * If the single field was changed or cleared by a writer that did not know about
 * the list, the stale list is dropped instead of silently overriding the change
 * (e.g. "Who does this? → The client" must not leave two staff members on the
 * step). Pure — no I/O.
 */
export function stepAssigneeList(step) {
  const single = step?.defaultAssigneeUid || null;
  const list = Array.isArray(step?.defaultAssigneeUids)
    ? [...new Set(step.defaultAssigneeUids.filter(Boolean))]
    : [];
  if (list.length && single === list[0]) return list;
  return single ? [single] : [];
}

/** A copy of `step` with its assignee fields reconciled by `stepAssigneeList`. */
export function reconcileStepAssignees(step) {
  const copy = { ...step };
  const list = stepAssigneeList(step);
  if (list.length > 1) copy.defaultAssigneeUids = list;
  else delete copy.defaultAssigneeUids; // one (or none): the single field says it all
  return copy;
}

/** Every real user uid a definition's steps name as default assignees. */
export function definitionAssigneeUids(steps) {
  const uids = new Set();
  for (const s of steps ?? []) {
    for (const u of stepAssigneeList(s)) if (u !== CLIENT_ASSIGNEE) uids.add(u);
  }
  return [...uids];
}

/**
 * Refuse a client as a step's default assignee. Throws `{ status: 400 }`. Users
 * that no longer exist are left alone here: a Service naming a since-deleted
 * member must stay saveable (it always was), and a matter simply gets nobody for
 * that entry.
 */
export async function assertNoClientAssignees(db, steps) {
  const uids = definitionAssigneeUids(steps);
  const snaps = await Promise.all(uids.map((u) => db.collection('users').doc(u).get()));
  if (snaps.some((s) => s.exists && s.data().role === 'client')) {
    throw { status: 400, message: 'Cannot assign a step to a client' };
  }
}

/**
 * The owners a step-patch body asks for, or `undefined` when it does not touch
 * ownership. `assignedToUids` (the matter screen's picker) wins; `assignedTo`
 * alone means exactly that one person; null / '' / [] unassigns. Deduped, order
 * kept — the first entry becomes the step's primary `assignedTo`. Pure.
 */
export function requestedStepOwners({ assignedTo, assignedToUids } = {}) {
  if (Array.isArray(assignedToUids)) return [...new Set(assignedToUids.filter(Boolean))];
  if (assignedTo !== undefined) return assignedTo ? [assignedTo] : [];
  return undefined;
}

/**
 * Refuse anyone who cannot do staff work: a client, a view-only professional,
 * or a uid with no user record. The caller passes only uids NEW to the step, so
 * a step keeps an owner it already had (its client, on a client-owned step).
 * Throws `{ status: 400 }`.
 */
export async function assertStaffOwners(db, uids, { staffRoles }) {
  const snaps = await Promise.all(uids.map((u) => db.collection('users').doc(u).get()));
  for (const s of snaps) {
    if (!s.exists) throw { status: 400, message: 'One of the chosen people no longer exists. Refresh and try again.' };
    if (!staffRoles.includes(s.data().role)) throw { status: 400, message: 'A step can only be assigned to team members.' };
  }
}
