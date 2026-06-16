import { Router } from 'express';
import { getMyRegisteredEvents } from '../controllers/user.controller.js';
import { getMySubmissions } from '../controllers/submission.controller.js';
import protect from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.get(
  '/me/events',
  protect,
  allowRoles(ROLES.PARTICIPANT, ROLES.ORGANISER, ROLES.ADMIN),
  getMyRegisteredEvents
);

router.get(
  '/me/submissions',
  protect,
  allowRoles(ROLES.PARTICIPANT, ROLES.ORGANISER, ROLES.ADMIN),
  getMySubmissions
);

export default router;
