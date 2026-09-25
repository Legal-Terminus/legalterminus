/**
 * Story 34.1 — client tags and the derived entity profile (Epic 34).
 *
 * We already store rich statutory fields (`gstNumber`, `panNumber`,
 * `businessName`…) but they are inert strings: nothing can ask "does this
 * client have GST?" without re-implementing the check. This turns them into a
 * profile that automation can read.
 *
 * ── One derivation, one place (AC3) ──
 *
 * Story 34.2 will make workflow steps conditional on these values. If the
 * roster computed `hasGst` one way and the workflow engine another, a step
 * would skip for a client the UI shows as GST-registered — a bug nobody could
 * reproduce from the screen. So every consumer calls `deriveProfile` and there
 * is deliberately no second implementation.
 *
 * ── Tags are internal ──
 *
 * Tags describe how the FIRM thinks about a client ("chases invoices",
 * "audit risk"). They are never shown in the client portal, which is enforced
 * at the projection rather than by asking each screen to remember (AC4).
 */

/** The entity kinds a firm actually files for, in Indian practice. */
export const ENTITY_TYPES = [
  'proprietorship', 'partnership', 'llp', 'pvt_ltd', 'public', 'trust', 'society', 'individual',
];

/** Human labels, exported so the form and the filters cannot drift apart. */
export const ENTITY_TYPE_LABELS = {
  proprietorship: 'Proprietorship',
  partnership: 'Partnership',
  llp: 'LLP',
  pvt_ltd: 'Private Limited',
  public: 'Public Limited',
  trust: 'Trust',
  society: 'Society',
  individual: 'Individual',
};

export const MAX_TAGS_PER_CLIENT = 25;
export const MAX_TAG_LENGTH = 40;

/**
 * Normalise a tag: trimmed, collapsed whitespace, lower-cased.
 *
 * Lower-casing is what makes "GST" and "gst" the same tag. Without it a roster
 * filter silently misses half the clients a firm believes it tagged, and the
 * managed list fills with near-duplicates.
 */
export function normaliseTag(raw) {
  const s = String(raw ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (!s) return null;
  return s.slice(0, MAX_TAG_LENGTH);
}

/** Clean a whole tag array: normalised, de-duplicated, capped, order kept. */
export function normaliseTags(raw) {
  const out = [];
  for (const t of Array.isArray(raw) ? raw : []) {
    const tag = normaliseTag(t);
    if (tag && !out.includes(tag)) out.push(tag);
    if (out.length >= MAX_TAGS_PER_CLIENT) break;
  }
  return out;
}

/** A statutory field counts as present only if it holds something real. */
function present(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

/**
 * The derived profile for one client document.
 *
 * Pure, so 34.2's condition evaluation can be tested without Firestore, and so
 * a snapshot of the result can be recorded on a matter at step entry.
 */
export function deriveProfile(user = {}) {
  const entityType = ENTITY_TYPES.includes(user.entityType) ? user.entityType : null;
  return {
    tags: normaliseTags(user.tags),
    entityType,
    hasGst: present(user.gstNumber),
    hasPan: present(user.panNumber),
    // A profile is "complete" when a firm could actually file for this client.
    // Reported, never enforced — a half-filled client is still a client.
    isComplete: present(user.panNumber) && !!entityType,
  };
}

/** Does a client carry this tag? Normalises both sides, so casing never bites. */
export function hasTag(user, tag) {
  const want = normaliseTag(tag);
  if (!want) return false;
  return deriveProfile(user).tags.includes(want);
}

/**
 * The managed tag list, merged with whatever clients actually
 * carry. A tag in use but missing from the managed list still appears, so a
 * roster filter can never offer less than the data contains.
 */
export function mergeManagedTags(managed, inUse) {
  const out = normaliseTags(managed);
  for (const t of normaliseTags(inUse)) if (!out.includes(t)) out.push(t);
  return out.sort();
}

/**
 * Rename a tag across a set of client docs (AC2).
 *
 * Returns only the clients that actually change, so the caller writes the
 * minimum. A rename onto an EXISTING tag merges rather than duplicating.
 */
export function planTagRename(clients, from, to) {
  const a = normaliseTag(from);
  const b = normaliseTag(to);
  if (!a || !b || a === b) return [];
  const changes = [];
  for (const c of clients) {
    const tags = normaliseTags(c.tags);
    if (!tags.includes(a)) continue;
    const next = [];
    for (const t of tags) {
      const mapped = t === a ? b : t;
      if (!next.includes(mapped)) next.push(mapped);
    }
    changes.push({ id: c.id, tags: next });
  }
  return changes;
}

/** Detach a tag from every client that has it (AC2: delete = detach). */
export function planTagDelete(clients, tag) {
  const t = normaliseTag(tag);
  if (!t) return [];
  return clients
    .filter((c) => normaliseTags(c.tags).includes(t))
    .map((c) => ({ id: c.id, tags: normaliseTags(c.tags).filter((x) => x !== t) }));
}
