import { z } from 'zod';

export const createSubmissionSchema = z.object({
  body: z.object({
    teamName: z.string().trim().optional(),
    teamMembers: z.array(
      z.object({
        name: z.string().min(2, 'Member name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        role: z.string().min(2, 'Member role must be at least 2 characters'),
      })
    ).optional(),
    title: z.string({ required_error: 'Title is required' }).min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters'),
    description: z.string({ required_error: 'Description is required' }).min(10, 'Description must be at least 10 characters'),
    githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')).optional(),
    demoUrl: z.string().url('Invalid Demo URL').or(z.literal('')).optional(),
    presentationUrl: z.string().url('Invalid Presentation URL').or(z.literal('')).optional(),
    files: z.array(z.string()).optional(),
  }),
});
