import { z } from 'zod';
import { ALL_EVENT_TYPES, ALL_EVENT_MODES, ALL_EVENT_VISIBILITIES } from '../constants/eventStatus.js';
import { ALL_ROLES, ALL_USER_STATUS } from '../constants/roles.js';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3, 'Title must be at least 3 characters').max(100, 'Title must not exceed 100 characters'),
    tagline: z.string({ required_error: 'Tagline is required' }).min(3, 'Tagline must be at least 3 characters').max(200, 'Tagline must not exceed 200 characters'),
    type: z.enum(ALL_EVENT_TYPES, { required_error: 'Valid event type is required' }),
    mode: z.enum(ALL_EVENT_MODES, { required_error: 'Valid event mode is required' }),
    visibility: z.enum(ALL_EVENT_VISIBILITIES).optional(),
    location: z.string().optional(),
    venue: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    
    startDate: z.string({ required_error: 'Start date is required' }).refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
    endDate: z.string({ required_error: 'End date is required' }).refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date' }),
    registrationDeadline: z.string({ required_error: 'Registration deadline is required' }).refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid registration deadline' }),
    
    submissionStart: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional().nullable(),
    submissionDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional().nullable(),
    judgingStart: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional().nullable(),
    judgingEnd: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional().nullable(),
    winnerAnnouncement: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional().nullable(),
    
    track: z.array(z.string()).optional(),
    prizePool: z.string().optional(),
    teamSize: z.object({
      min: z.number().int().min(1, 'Minimum team size must be at least 1').default(1),
      max: z.number().int().min(1, 'Maximum team size must be at least 1').default(1),
    }).optional(),
    eligibility: z.string().optional(),
    description: z.string({ required_error: 'Description is required' }).min(10, 'Description must be at least 10 characters'),
    rules: z.string().optional(),
    judgingCriteria: z.string().optional(),
    resources: z.array(z.string()).optional(),
    
    coverImage: z.string().optional(),
    websiteUrl: z.string().url('Invalid website URL').or(z.literal('')).optional(),
    communityUrl: z.string().url('Invalid community URL').or(z.literal('')).optional(),
    sponsorLogos: z.array(z.string()).optional(),
    
    contactName: z.string({ required_error: 'Contact name is required' }),
    contactEmail: z.string({ required_error: 'Contact email is required' }).email('Invalid contact email address'),
    
    maxCapacity: z.number().int().min(0).optional(),
    registrationQuestions: z.array(z.string()).optional(),
  }),
});

export const updateEventSchema = createEventSchema.deepPartial();
export const adminRejectEventSchema = z.object({
  body: z.object({
    rejectionReason: z.string({ required_error: 'Rejection reason is required' }).min(5, 'Rejection reason must be at least 5 characters'),
  }),
});
export const adminUpdateUserSchema = z.object({
  body: z.object({
    role: z.enum(ALL_ROLES).optional(),
    status: z.enum(ALL_USER_STATUS).optional(),
  }),
});
