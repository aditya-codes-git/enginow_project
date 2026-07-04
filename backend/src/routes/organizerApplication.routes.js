import { Router } from 'express';
import { createApplication } from '../controllers/organizerApplication.controller.js';
import validate from '../middleware/validate.middleware.js';
import { createOrganizerApplicationSchema } from '../validators/organizerApplication.validator.js';

const router = Router();

// Public submission route
router.post('/', validate(createOrganizerApplicationSchema), createApplication);

export default router;
