import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { clientDatabaseUpdateSchema, clientDatabaseListQuerySchema } from '../schemas/clientDatabase.schema.js';
import {
  listClientDatabase,
  listClientDatabaseNames,
  getClientDatabaseRecord,
  updateClientDatabaseRecord,
} from '../controllers/clientDatabase.controller.js';

/**
 * LT #205 — the Client Database. Admin + manager only, to read AND to edit:
 * the guard sits on every route so no other role reaches handler logic.
 */
const router = Router();

const manage = [verifyToken, requireRole('admin', 'manager')];

router.get('/', ...manage, validate(clientDatabaseListQuerySchema, 'query'), listClientDatabase);
// Before '/:clientUid' so 'names' is not captured as a uid.
router.get('/names', ...manage, listClientDatabaseNames);
router.get('/:clientUid', ...manage, getClientDatabaseRecord);
router.put('/:clientUid', ...manage, validate(clientDatabaseUpdateSchema), updateClientDatabaseRecord);

export default router;
