import { Router } from 'express';
import {
  getEvents,
  getMyEvents,
  getEvent,
  createEvent,
  updateEvent,
  submitEvent,
  archiveEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
} from '../controllers/event.controller.js';
import { submitProject, getEventSubmissions } from '../controllers/submission.controller.js';
import protect, { optionalAuth } from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createEventSchema, updateEventSchema } from '../validators/event.validator.js';
import { createRegistrationSchema } from '../validators/registration.validator.js';
import { createSubmissionSchema } from '../validators/submission.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public routes
router.get('/', getEvents);

// Organiser-only: all events owned by the authenticated user (any status)
router.get(
  '/my-events',
  protect,
  allowRoles(ROLES.ORGANISER),
  getMyEvents
);

router.get('/:id', optionalAuth, getEvent);

// Protected routes (require auth)
router.post(
  '/',
  protect,
  allowRoles(ROLES.ORGANISER),
  validate(createEventSchema),
  createEvent
);

router.put(
  '/:id',
  protect,
  allowRoles(ROLES.ORGANISER),
  validate(updateEventSchema),
  updateEvent
);

router.patch(
  '/:id/submit',
  protect,
  allowRoles(ROLES.ORGANISER),
  submitEvent
);

router.patch(
  '/:id/archive',
  protect,
  allowRoles(ROLES.ORGANISER, ROLES.ADMIN),
  archiveEvent
);

router.delete(
  '/:id',
  protect,
  allowRoles(ROLES.ORGANISER),
  deleteEvent
);

// Registrations (Participant only)
router.post(
  '/:id/register',
  protect,
  allowRoles(ROLES.PARTICIPANT),
  validate(createRegistrationSchema),
  registerForEvent
);

router.delete(
  '/:id/register',
  protect,
  allowRoles(ROLES.PARTICIPANT),
  cancelRegistration
);

// Organizer / Admin registration list view
router.get(
  '/:id/registrations',
  protect,
  allowRoles(ROLES.ORGANISER, ROLES.ADMIN),
  getEventRegistrations
);

// Submissions (Participant submits, Organizer/Admin views)
router.post(
  '/:id/submissions',
  protect,
  allowRoles(ROLES.PARTICIPANT),
  validate(createSubmissionSchema),
  submitProject
);

router.get(
  '/:id/submissions',
  protect,
  allowRoles(ROLES.ORGANISER, ROLES.ADMIN),
  getEventSubmissions
);

export default router;
