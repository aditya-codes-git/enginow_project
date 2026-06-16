import { Router } from 'express';
import { createTeam, getMyTeam } from '../controllers/organiser.controller.js';
import protect from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.ORGANISER));

router.post('/', createTeam);
router.get('/my-team', getMyTeam);

export default router;
