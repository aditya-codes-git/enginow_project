import { z } from 'zod';

export const createOrganizerApplicationSchema = z.object({
  body: z.object({
    organizationName: z
      .string({ required_error: 'Organization name is required' })
      .trim()
      .min(2, 'Organization name must be at least 2 characters')
      .max(100, 'Organization name must not exceed 100 characters'),
    organizationType: z.enum([
      'College',
      'University',
      'Company',
      'Startup',
      'Student Chapter',
      'Community',
      'NGO',
      'Training Institute',
      'Other'
    ], { required_error: 'Organization type is required' }),
    applicantName: z
      .string({ required_error: 'Applicant name is required' })
      .trim()
      .min(2, 'Applicant name must be at least 2 characters')
      .max(100, 'Applicant name must not exceed 100 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim()
      .max(100, 'Email must not exceed 100 characters'),
    phone: z
      .string({ required_error: 'Phone number is required' })
      .trim()
      .min(8, 'Phone number must be at least 8 characters')
      .max(20, 'Phone number must not exceed 20 characters'),
    website: z
      .string()
      .url('Website must be a valid URL')
      .or(z.literal(''))
      .optional()
      .default(''),
    linkedin: z
      .string()
      .url('LinkedIn profile must be a valid URL')
      .or(z.literal(''))
      .optional()
      .default(''),
    city: z
      .string({ required_error: 'City is required' })
      .trim()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must not exceed 50 characters'),
    country: z
      .string({ required_error: 'Country is required' })
      .trim()
      .min(2, 'Country must be at least 2 characters')
      .max(50, 'Country must not exceed 50 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description must not exceed 1000 characters'),
    purpose: z
      .string({ required_error: 'Purpose is required' })
      .trim()
      .min(10, 'Purpose must be at least 10 characters')
      .max(1000, 'Purpose must not exceed 1000 characters'),
    expectedEvents: z
      .number({ required_error: 'Expected events count is required' })
      .min(1, 'Expected events must be at least 1'),
    expectedParticipants: z
      .number({ required_error: 'Expected participants count is required' })
      .min(1, 'Expected participants must be at least 1'),
    additionalInformation: z
      .string()
      .max(1000, 'Additional information must not exceed 1000 characters')
      .optional()
      .default(''),
  }),
});
