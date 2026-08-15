import { Router } from 'express';
import { verifyToken, denyReadOnlyRoles } from '../middleware/auth.middleware.js';
import {
  listNotifications,
  markRead,
  markAllRead,
} from '../controllers/notifications.controller.js';

const router = Router();

// A user may only see/modify their OWN notifications — scoping is by req.user.uid
// inside the controller, so any authenticated role is allowed here.
router.use(verifyToken);
// #168: professionals are view-only — block every mutating method up front so a
// new route cannot accidentally grant them write access.
router.use(denyReadOnlyRoles);

router.get('/', listNotifications);            // the current user's notifications
router.patch('/read-all', markAllRead);        // mark all unread as read
router.patch('/:id/read', markRead);           // mark one as read

export default router;
