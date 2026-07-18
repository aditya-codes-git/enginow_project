import { z } from 'zod';
import { ALL_ROLES } from '../constants/roles.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    role: z.enum(ALL_ROLES).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters').optional(),
    bio: z.string().max(300, 'Bio must not exceed 300 characters').optional(),
    avatar: z.string().url('Avatar must be a valid URL').or(z.literal('')).optional(),
    organization: z.string().max(100, 'Organization name must not exceed 100 characters').optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }),
    newPassword: z.string({ required_error: 'New password is required' }).min(6, 'New password must be at least 6 characters'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string({ required_error: 'New password is required' }).min(6, 'New password must be at least 6 characters'),
  }),
});
