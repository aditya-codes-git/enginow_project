import Submission from '../models/Submission.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { runWithTransaction } from '../utils/transaction.js';

export const createSubmission = async (eventId, userId, submissionData) => {
  return await runWithTransaction(async (session) => {
    const opts = session ? { session } : {};

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    // Check if user is registered for this event
    const registrationDoc = await Registration.findOne({
      user: userId,
      event: eventId,
      status: 'registered',
    }).session(session);

    if (!registrationDoc) {
      throw new ApiError(400, 'You must be registered for this event to submit a project');
    }

    // Check unique submission constraint
    const existingSubmission = await Submission.findOne({
      event: eventId,
      submittedBy: userId,
    }).session(session);

    if (existingSubmission) {
      throw new ApiError(400, 'You have already submitted a project for this event');
    }

    // Create submission
    const submissions = await Submission.create(
      [
        {
          event: eventId,
          submittedBy: userId,
          ...submissionData,
        }
      ],
      opts
    );

    // Increment event submissionCount atomically
    event.submissionCount = (event.submissionCount || 0) + 1;
    await event.save(opts);

    return submissions[0];
  });
};


export const getEventSubmissions = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const isOwner = event.organiser.toString() === user._id.toString();
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to view submissions for this event');
  }

  const submissions = await Submission.find({ event: eventId })
    .populate('submittedBy', 'name email avatar organization')
    .sort({ createdAt: -1 });

  return submissions;
};

export const getUserSubmissions = async (userId) => {
  const submissions = await Submission.find({ submittedBy: userId })
    .populate('event', 'title tagline type mode startDate endDate coverImage')
    .sort({ createdAt: -1 });

  return submissions;
};
