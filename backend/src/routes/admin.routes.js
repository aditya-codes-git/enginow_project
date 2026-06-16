import { Router } from 'express';
import {
  getUsers,
  updateUser,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getOrganisers,
  verifyOrganiser,
} from '../controllers/admin.controller.js';
import protect from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { adminRejectEventSchema, adminUpdateUserSchema } from '../validators/event.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.ADMIN));

router.get('/users', getUsers);
router.patch('/users/:id', validate(adminUpdateUserSchema), updateUser);

router.get('/events/pending', getPendingEvents);
router.patch('/events/:id/approve', approveEvent);
router.patch('/events/:id/reject', validate(adminRejectEventSchema), rejectEvent);

router.get('/organisers', getOrganisers);
router.patch('/organisers/:id/verify', verifyOrganiser);

export default router;
