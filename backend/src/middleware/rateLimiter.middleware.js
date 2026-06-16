import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const isTest = env.NODE_ENV === 'test';

const rateLimitHandler = (req, res, next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
  });
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 100 : 5,
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTest ? 100 : 3,
  message: 'Too many password reset requests. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTest ? 100 : 10,
  message: 'Too many registration requests. Please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
