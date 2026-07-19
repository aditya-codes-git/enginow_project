import { Router } from 'express';
import {
  getUsers,
  updateUser,
  getEvents,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  suspendEvent,
  activateEvent,
  getOrganisers,
  verifyOrganiser,
  getBlogs,
  getPendingBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  approveBlog,
  rejectBlog,
  suspendBlog,
  activateBlog,
  getUser,
  suspendUser,
  unsuspendUser,
  banUser,
  unbanUser,
  deleteUser,
} from '../controllers/admin.controller.js';
import protect from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  adminRejectEventSchema,
  adminUpdateUserSchema,
  adminRejectBlogSchema,
  createBlogSchema,
} from '../validators/event.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.ADMIN));

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', validate(adminUpdateUserSchema), updateUser);
router.patch('/users/:id/suspend', suspendUser);
router.patch('/users/:id/unsuspend', unsuspendUser);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.delete('/users/:id', deleteUser);

router.get('/events/pending', getPendingEvents);
router.get('/events', getEvents);
router.patch('/events/:id/approve', approveEvent);
router.patch('/events/:id/reject', validate(adminRejectEventSchema), rejectEvent);
router.patch('/events/:id/suspend', suspendEvent);
router.patch('/events/:id/activate', activateEvent);

router.get('/organisers', getOrganisers);
router.patch('/organisers/:id/verify', verifyOrganiser);

router.get('/blogs', getBlogs);
router.get('/blogs/pending', getPendingBlogs);
router.get('/blogs/:slug', getBlog);
router.post('/blogs', validate(createBlogSchema), createBlog);
router.patch('/blogs/:id', validate(createBlogSchema), updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.patch('/blogs/:id/approve', approveBlog);
router.patch('/blogs/:id/reject', validate(adminRejectBlogSchema), rejectBlog);
router.patch('/blogs/:id/suspend', suspendBlog);
router.patch('/blogs/:id/activate', activateBlog);

export default router;