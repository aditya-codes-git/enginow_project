import { Router } from 'express';
import {
  register,
  login,
  logout,
  logoutAll,
  refresh,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleLogin,
} from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateMeSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';
import {
  loginLimiter,
  forgotPasswordLimiter,
  registerLimiter,
} from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Public auth routes
router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/google-login', googleLogin);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.post('/verify-email/:token', verifyEmail);

// Logout (can be done without full user lookup, but cookie clearance is direct)
router.post('/logout', logout);

// Protected routes (require valid Access Token)
router.get('/me', protect, getMe);
router.put('/me', protect, validate(updateMeSchema), updateMe);
router.post('/logout-all', protect, logoutAll);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;
