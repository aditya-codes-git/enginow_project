import { z } from 'zod';

export const createRegistrationSchema = z.object({
  body: z.object({
    registrationType: z.enum(['individual', 'team']).default('individual'),
    teamName: z.string().trim().optional(),
    teamMembers: z.array(
      z.object({
        name: z.string({ required_error: 'Member name is required' }).min(2, 'Name must be at least 2 characters'),
        email: z.string({ required_error: 'Member email is required' }).email('Invalid email address'),
        role: z.string({ required_error: 'Member role is required' }).min(2, 'Role must be at least 2 characters'),
      })
    ).optional(),
    answers: z.array(
      z.object({
        question: z.string({ required_error: 'Question is required' }),
        answer: z.string({ required_error: 'Answer is required' }),
      })
    ).optional(),
  }),
});
