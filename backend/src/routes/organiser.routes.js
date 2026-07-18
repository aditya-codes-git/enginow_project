import { Router } from 'express';
import { createTeam, getMyTeam, getMyBlogs, createMyBlog, updateMyBlog, submitMyBlog, deleteMyBlog } from '../controllers/organiser.controller.js';
import protect from '../middleware/auth.middleware.js';
import { allowRoles } from '../middleware/role.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createBlogSchema } from '../validators/event.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.ORGANISER));

router.post('/', createTeam);
router.get('/my-team', getMyTeam);

// Blog management routes for organisers
router.get('/blogs', getMyBlogs);
router.post('/blogs', validate(createBlogSchema), createMyBlog);
router.patch('/blogs/:id', validate(createBlogSchema), updateMyBlog);
router.patch('/blogs/:id/submit', submitMyBlog);
router.delete('/blogs/:id', deleteMyBlog);

export default router;