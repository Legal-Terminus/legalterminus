import { Router } from 'express';
import { verifyToken, denyReadOnlyRoles } from '../middleware/auth.middleware.js';
import { search } from '../controllers/search.controller.js';

/**
 * E22-S02 — global search.
 *
 * Deliberately NO `requireRole`: everyone searches, including a client, and the
 * controller scopes what each role can see using the same predicates the list
 * endpoints use (`clientScopeUid`, `professionalCanSee`). A role guard here
 * would either lock a client out of finding their own matters or invite a
 * second, divergent scoping rule — and a search box is the easiest place in a
 * product to leak data, because it touches every collection at once.
 */
const router = Router();

router.use(verifyToken);
router.use(denyReadOnlyRoles);

router.get('/', search);

export default router;
