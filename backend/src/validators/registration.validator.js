import { z } from 'zod';

export const createRegistrationSchema = z.object({
  body: z.object({
    registrationType: z.enum(['individual', 'team']).default('individual'),
    teamName: z.string().trim().optional(),
    teamMembers: z.array(
      z.object({
        name: z.string({ required_error: 'Member name is required' }).trim().min(2, 'Name must be at least 2 characters'),
        email: z.string({ required_error: 'Member email is required' }).trim().email('Invalid email address'),
        role: z.string({ required_error: 'Member role is required' }).trim().min(2, 'Role must be at least 2 characters'),
      })
    ).optional(),
    answers: z.array(
      z.object({
        question: z.string({ required_error: 'Question is required' }).trim().min(1, 'Question is required'),
        answer: z.string({ required_error: 'Answer is required' }).trim().min(1, 'Answer is required'),
      })
    ).optional(),
  }).superRefine((body, ctx) => {
    if (body.registrationType !== 'team') return;

    if (!body.teamName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['teamName'],
        message: 'Team name is required for team registrations',
      });
    }

    if (!body.teamMembers || body.teamMembers.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['teamMembers'],
        message: 'At least one team member is required for team registrations',
      });
    }
  }),
});
