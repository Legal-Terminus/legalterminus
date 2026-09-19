import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { getBoard } from '../controllers/mattersBoard.controller.js';

/**
 * E22-S01 — the matters board (pipeline view).
 *
 * Staff only. Role scoping inside the controller mirrors the matters LIST
 * exactly, so the board and the list can never disagree about what a given user
 * may see — a second scoping rule here would drift from the first.
 */
const router = Router();

router.use(verifyToken);
router.get('/board', requireRole('admin', 'manager', 'team_member'), getBoard);

export default router;
