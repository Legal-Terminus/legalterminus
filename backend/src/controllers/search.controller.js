import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { clientScopeUid, professionalCanSee } from './tasks.controller.js';

/**
 * E22-S02 — global search. Ported from the cometflow portal (its Story 36.1),
 * adapted to single-tenant: `db` is the module import, not a per-request handle.
 *
 * ── Why this is prefix matching over chosen fields, not full text ──
 *
 * Firestore has no full-text search. The alternatives were an external index
 * (Typesense/Meilisearch) or targeted matching over the handful of fields
 * people actually search by. The second is chosen deliberately: it needs no new
 * infrastructure, it reads through the same `db`
 * as every other controller, and "find the Acme GST matter" is a prefix
 * query, not a document-similarity problem. If a firm outgrows it, an external
 * index slots in behind the same endpoint.
 *
 * ── Role scoping is the hard part ──
 *
 * A search box is the easiest place in a product to leak data, because it
 * touches every collection at once and a mistake looks like a feature. So
 * scoping reuses the SAME predicates the list endpoints use — `clientScopeUid`
 * for clients, `professionalCanSee` for professionals — rather than
 * re-expressing them here, where they would drift.
 */

/** Per group, so one noisy group cannot crowd out the others. */
const PER_GROUP = 5;

/** Below this a query matches half the workspace and helps nobody. */
const MIN_QUERY = 2;

/** How many documents we are willing to scan per group. */
const SCAN_LIMIT = 300;

const norm = (v) => String(v ?? '').toLowerCase();

/** Does any of the searchable text start with, or contain, the query? */
export function matches(fields, q) {
  const needle = norm(q).trim();
  if (!needle) return false;
  return fields.some((f) => norm(f).includes(needle));
}

/**
 * Rank: a prefix match beats a mid-string one, because someone typing "acm"
 * means Acme, not "Pharmacme".
 */
export function scoreMatch(fields, q) {
  const needle = norm(q).trim();
  // An empty needle makes `includes` true for EVERY string, which would score
  // the whole workspace as a prefix match and dump it into the results. The
  // endpoint's minimum-length guard hides this today; a future caller would
  // not be so lucky.
  if (!needle) return 0;
  let best = 0;
  for (const f of fields) {
    const hay = norm(f);
    if (!hay.includes(needle)) continue;
    if (hay.startsWith(needle)) best = Math.max(best, 3);
    else if (hay.split(/\s+/).some((w) => w.startsWith(needle))) best = Math.max(best, 2);
    else best = Math.max(best, 1);
  }
  return best;
}

const byScore = (a, b) => b.score - a.score;

// ─── GET /api/search?q= ─────────────────────────────────────────────────────

export async function search(req, res) {
  const q = String(req.query.q ?? '').trim();

  if (q.length < MIN_QUERY) {
    // Not an error: the UI calls this on every keystroke, and a one-character
    // query genuinely has no useful answer.
    return res.json({ query: q, clients: [], matters: [], documents: [] });
  }

  const { role, uid } = req.user;
  const isClient = role === 'client';
  const isProfessional = role === 'professional';

  try {
    // ── Matters ──
    // A client sees only their own; a professional only those they are named
    // on. Both predicates are the ones the list endpoints already use.
    let matterQuery = db.collection('tasks');
    if (isClient) matterQuery = matterQuery.where('clientUid', '==', clientScopeUid(req.user));
    const matterSnap = await matterQuery.limit(SCAN_LIMIT).get();

    const matters = matterSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((t) => !isProfessional || professionalCanSee(t, uid))
      .map((t) => ({
        t,
        score: scoreMatch([t.serviceName, t.organisation, t.clientName, t.workflowType], q),
      }))
      .filter((r) => r.score > 0)
      .sort(byScore)
      .slice(0, PER_GROUP)
      .map(({ t }) => ({
        id: t.id,
        title: t.serviceName || t.workflowType || 'Matter',
        subtitle: t.organisation || t.clientName || null,
        status: t.status ?? null,
        href: `/tasks/${t.id}`,
      }));

    // ── Clients ──
    // A client searching must never discover OTHER clients, so the group is
    // simply absent for them rather than filtered — there is no version of this
    // list they should see.
    let clients = [];
    if (!isClient) {
      const clientSnap = await db.collection('users')
        .where('role', '==', 'client').limit(SCAN_LIMIT).get();
      clients = clientSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .map((c) => ({
          c,
          // GSTIN and PAN are included because "who is 29ABCDE1234F1Z5?" is a
          // question firms genuinely ask.
          score: scoreMatch([c.name, c.fullName, c.organisation, c.businessName, c.email,
            c.gstNumber, c.panNumber], q),
        }))
        .filter((r) => r.score > 0)
        .sort(byScore)
        .slice(0, PER_GROUP)
        .map(({ c }) => ({
          id: c.id,
          title: c.name || c.fullName || c.email || 'Client',
          subtitle: c.organisation || c.email || null,
          href: `/clients/${c.id}`,
        }));
    }

    // ── Documents ──
    // Scoped by the MATTERS the caller can already see, which is the cheapest
    // correct answer: a document is exactly as visible as its matter.
    const visibleMatterIds = new Set(matterSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((t) => !isProfessional || professionalCanSee(t, uid))
      .map((t) => t.id));

    let documents = [];
    try {
      const docSnap = await db.collectionGroup('documents').limit(SCAN_LIMIT).get();
      documents = docSnap.docs
        .map((d) => ({ id: d.id, taskId: d.ref.parent.parent?.id ?? null, ...d.data() }))
        .filter((d) => d.taskId && visibleMatterIds.has(d.taskId))
        // A client sees only what has been shared with them — the same rule the
        // documents list applies.
        .filter((d) => !isClient || d.clientVisible === true)
        .map((d) => ({ d, score: scoreMatch([d.fileName, d.docType], q) }))
        .filter((r) => r.score > 0)
        .sort(byScore)
        .slice(0, PER_GROUP)
        .map(({ d }) => ({
          id: d.id,
          title: d.fileName || 'Document',
          subtitle: d.docType || null,
          href: `/tasks/${d.taskId}`,
        }));
    } catch (err) {
      // The collection-group index may not be deployed. A missing document
      // group must degrade the results, never break the search box.
      logger.warn({ err: err?.message }, 'search: document group unavailable');
    }

    res.json({ query: q, clients, matters, documents });
  } catch (err) {
    logger.error({ err }, 'search failed');
    res.status(500).json({ message: 'Search failed' });
  }
}
