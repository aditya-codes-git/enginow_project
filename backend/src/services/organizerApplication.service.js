import OrganizerApplication from '../models/OrganizerApplication.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import * as emailService from './email.service.js';

export const createOrganizerApplication = async (data) => {
  const { email } = data;

  // 1. Check if email already belongs to a registered organizer or admin
  const existingUser = await User.findOne({ email });
  if (existingUser && (existingUser.role === 'organiser' || existingUser.role === 'admin')) {
    throw new ApiError(400, 'This email address is already registered as an organizer or admin account.');
  }

  // 2. Check for duplicate pending/active application in progress
  const activeApplication = await OrganizerApplication.findOne({
    email,
    status: { $in: ['Pending', 'Under Review', 'Contacted', 'Verification'] }
  });

  if (activeApplication) {
    throw new ApiError(400, 'An organizer application is already in progress for this email address.');
  }

  // 3. Create the organizer application document (ignores any fields not in the schema, does NOT touch the User collection)
  const application = await OrganizerApplication.create({
    organizationName: data.organizationName,
    organizationType: data.organizationType,
    applicantName: data.applicantName,
    email: data.email,
    phone: data.phone,
    website: data.website || '',
    linkedin: data.linkedin || '',
    city: data.city,
    country: data.country,
    description: data.description,
    purpose: data.purpose,
    expectedEvents: data.expectedEvents,
    expectedParticipants: data.expectedParticipants,
    additionalInformation: data.additionalInformation || '',
    status: 'Pending',
  });

  // 4. Send email notifications via abstracted service
  await emailService.sendAdminOnboardingNotification(application);
  await emailService.sendApplicantOnboardingConfirmation(application);

  return application;
};

export default {
  createOrganizerApplication,
};
