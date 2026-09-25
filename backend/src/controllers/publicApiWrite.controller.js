import crypto from 'node:crypto';
import { logger } from '../config/logger.js';
import { db } from '../config/firebase.js';
import { createTask } from './tasks.controller.js';
import { serializeMatter, serializeClient } from './publicApi.controller.js';

/**
 * Story 33.3 — the `/api/v1` WRITE API (Epic 33).
 *
 * ── Reusing the real creation path, not reimplementing it ──
 *
 * AC2 requires that an API-created matter behaves exactly like a UI-created one:
 * same licence seat check, same workflow validation, same payment gate
 * resolution, same notifications, same webhook. The only way to guarantee that
 * is to CALL the same handler, so this delegates to `createTask` rather than
 * duplicating six hundred lines that would drift within a release.
 *
 * That handler gates on `req.user.role`, and an API principal deliberately has
 * none — a key is not a person (see apiToken.middleware.js). So the write path
 * grants an EXPLICIT acting role, derived from the token's scope and nothing
 * else. This is a deliberate, narrow mapping in one visible place, not a role
 * quietly attached at authentication time where every other handler would then
 * see it.
 */

/** A scope grants exactly the role that scope's operations require. */
const SCOPE_ROLE = {
  'write:matters': 'manager',
  'write:clients': 'manager',
};

/**
 * Run a handler with an acting role for the duration of ONE call.
 *
 * The role is attached to a shallow copy rather than to `req.user` itself, so
 * nothing downstream of this request can observe an API key as a person.
 */
function withActingRole(req, scope) {
  return { ...req, user: { ...req.user, role: SCOPE_ROLE[scope] } };
}

const IDEM = 'apiIdempotency';
/** How long a replay returns the original result (AC1). */
const IDEM_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Idempotency (AC1).
 *
 * An intake integration retries — a Zapier step times out, a CRM redelivers —
 * and without this a retry raises a second matter for the same client. The key
 * is claimed with `create()` BEFORE the work runs, so two concurrent retries
 * cannot both proceed; the guarantee is Firestore's, not a read-then-write
 * race. The same mechanism the action runner uses.
 *
 * Scoped by TOKEN, so one firm's key cannot collide with, or read, another's.
 */
export async function withIdempotency(req, res, run) {
  const key = req.headers['idempotency-key'];
  if (!key) return run();
  if (typeof key !== 'string' || key.length > 200) {
    return res.status(400).json({ error: 'bad_request', message: 'Idempotency-Key must be a short string.' });
  }

  const id = crypto.createHash('sha256').update(`${req.user.tokenId}:${key}`).digest('hex');
  const ref = db.collection(IDEM).doc(id);

  try {
    await ref.create({
      tokenId: req.user.tokenId,
      path: req.path,
      at: new Date().toISOString(),
      status: 'running',
    });
  } catch (err) {
    if (err?.code === 6 || /already exists/i.test(err?.message ?? '')) {
      const prior = (await ref.get()).data();
      // A retry of a request that is still in flight: tell the caller to wait
      // rather than starting a second one.
      if (prior?.status === 'running') {
        return res.status(409).json({
          error: 'in_progress',
          message: 'A request with this Idempotency-Key is still being processed.',
        });
      }
      const age = Date.now() - new Date(prior?.at ?? 0).getTime();
      if (age < IDEM_TTL_MS && prior?.response) {
        // The original outcome, replayed verbatim.
        return res.status(prior.responseStatus ?? 200).json(prior.response);
      }
      // Expired: let it run again rather than refusing forever.
    } else {
      logger.error({ err }, 'idempotency claim failed');
    }
  }

  // Capture what the handler answers so a later replay can return it.
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    ref.set({ status: 'done', response: body, responseStatus: res.statusCode }, { merge: true })
      .catch(() => { /* recording must not fail the request */ });
    return originalJson(body);
  };
  return run();
}

// ─── POST /api/v1/matters ───────────────────────────────────────────────────

export async function createMatterViaApi(req, res) {
  return withIdempotency(req, res, async () => {
    // Delegating to the real handler means the licence seat check, the workflow
    // validation, the gate resolution and the matter.created webhook all apply
    // unchanged — the point of AC2.
    const acting = withActingRole(req, 'write:matters');
    // The handler writes its own response, so re-shape it into the public
    // contract on the way out rather than letting internal fields escape.
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 201 && body?.id) {
        return originalJson({ data: serializeMatter(body.id, body) });
      }
      return originalJson(body);
    };
    logger.info({ tokenId: req.user.tokenId }, 'api: create matter');
    return createTask(acting, res);
  });
}

// ─── POST /api/v1/clients ───────────────────────────────────────────────────

/**
 * Create a client user.
 *
 * Unlike matters this does not delegate: client creation lives in
 * `userService.createPortalUser`, which sends an invitation email and mints
 * Firebase credentials — behaviour an intake integration does not want and did
 * not ask for. So this writes the client record directly through the same
 * validated shape, and a firm invites the client to the portal separately.
 */
export async function createClientViaApi(req, res) {
  return withIdempotency(req, res, async () => {
    const { db } = req;
    const { name, email, phone, organisation } = req.body ?? {};

    const clean = String(name ?? '').trim();
    if (!clean) return res.status(400).json({ error: 'bad_request', message: 'name is required.' });
    if (clean.length > 200) return res.status(400).json({ error: 'bad_request', message: 'name is too long.' });
    const mail = String(email ?? '').trim().toLowerCase();
    if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
      return res.status(400).json({ error: 'bad_request', message: 'email is not valid.' });
    }

    try {
      if (mail) {
        // A duplicate email is the single most likely intake mistake, and
        // creating a second record for one client is hard to unpick afterwards.
        const dup = await db.collection('users').where('email', '==', mail).limit(1).get();
        if (!dup.empty) {
          return res.status(409).json({
            error: 'already_exists',
            message: 'A user with that email already exists.',
            data: serializeClient(dup.docs[0].id, dup.docs[0].data()),
          });
        }
      }

      const ref = db.collection('users').doc();
      const record = {
        name: clean,
        email: mail || null,
        phone: String(phone ?? '').trim().slice(0, 40) || null,
        organisation: String(organisation ?? '').trim().slice(0, 200) || null,
        role: 'client',
        // AC4: the write is attributed to the TOKEN, never to a person.
        createdBy: `token:${req.user.tokenId}`,
        createdVia: 'api',
        createdAt: new Date().toISOString(),
      };
      await ref.set(record);
      logger.info({ tokenId: req.user.tokenId, clientId: ref.id }, 'api: create client');
      res.status(201).json({ data: serializeClient(ref.id, record) });
    } catch (err) {
      logger.error({ err }, 'v1 createClient failed');
      res.status(500).json({ error: 'internal_error', message: 'The request could not be completed.' });
    }
  });
}
