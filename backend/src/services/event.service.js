import mongoose from 'mongoose';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';
import { EVENT_STATUS, EVENT_VISIBILITY } from '../constants/eventStatus.js';
import { ROLES, USER_STATUS } from '../constants/roles.js';
import { runWithTransaction } from '../utils/transaction.js';

export const queryEvents = async (queryParams) => {
  const { page = 1, limit = 10, search, type, mode, city, category, organiser, status } = queryParams;
  const filter = {};

  if (status) {
    filter.status = status;
  } else {
    filter.status = EVENT_STATUS.APPROVED;
  }

  if (organiser) {
    filter.organiser = organiser;
  } else {
    filter.visibility = EVENT_VISIBILITY.PUBLIC;
  }

  if (search) {
    // Perform text search if index is ready, otherwise regex fallback
    filter.$text = { $search: search };
  }

  if (type) {
    filter.type = type;
  }

  if (mode) {
    filter.mode = mode;
  }

  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }

  if (category) {
    // Check if category matches type or is in track array
    filter.$or = [
      { type: category },
      { track: { $in: [category] } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  // If text search, sort by text search score, otherwise by start date
  const sortOption = search
    ? { score: { $meta: 'textScore' } }
    : { startDate: 1 };

  const projection = search
    ? { score: { $meta: 'textScore' } }
    : {};

  const events = await Event.find(filter, projection)
    .populate('organiser', 'name email avatar organization')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Event.countDocuments(filter);

  return {
    events,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

export const queryOrgEvents = async (user, queryParams = {}) => {
  const { page = 1, limit = 100, status } = queryParams;
  const filter = user.role === ROLES.ADMIN ? {} : { organiser: user._id };

  // Optional status filter — but NO default, so all statuses are returned
  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const events = await Event.find(filter)
    .populate('organiser', 'name email avatar organization')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Event.countDocuments(filter);

  return {
    events,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
  };
};

export const getEventDetails = async (eventId, currentUser) => {
  const event = await Event.findById(eventId)
    .populate('organiser', 'name email avatar organization bio');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // If event is not approved, check authorization
  if (event.status !== EVENT_STATUS.APPROVED) {
    const organiserIdStr = event.organiser?._id ? event.organiser._id.toString() : event.organiser?.toString();
    const currentUserIdStr = currentUser?._id ? currentUser._id.toString() : currentUser?.id ? currentUser.id.toString() : '';
    
    const isOwner = currentUser && organiserIdStr && organiserIdStr === currentUserIdStr;
    const isAdmin = currentUser && currentUser.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'You do not have permission to view this event in its current state');
    }
  }

  return event;
};

export const createEventDraft = async (eventData, organiserId) => {
  const event = await Event.create({
    ...eventData,
    organiser: organiserId,
    status: EVENT_STATUS.PENDING,
    visibility: eventData.visibility || EVENT_VISIBILITY.PUBLIC,
  });

  return event;
};

export const updateEventDetails = async (eventId, eventData, user) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const isOwner = event.organiser.toString() === user._id.toString();
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to edit this event');
  }

  // Prevent direct modifications to status or registrations inside general update
  const { status, registrations, registrationCount, submissionCount, judgeCount, organiser, rejectionReason, ...updates } = eventData;

  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('organiser', 'name email avatar organization');

  return updatedEvent;
};

export const submitEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const isOwner = event.organiser.toString() === user._id.toString();
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to submit this event');
  }

  if (event.status !== EVENT_STATUS.DRAFT && event.status !== EVENT_STATUS.REJECTED) {
    throw new ApiError(400, `Cannot submit an event with status '${event.status}'`);
  }

  event.status = EVENT_STATUS.PENDING;
  await event.save();

  return event;
};

export const archiveEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const isOwner = event.organiser.toString() === user._id.toString();
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to archive this event');
  }

  event.status = EVENT_STATUS.ARCHIVED;
  await event.save();

  return event;
};

export const deleteEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const isOwner = event.organiser.toString() === user._id.toString();
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to delete this event');
  }

  if (!isAdmin && event.status !== EVENT_STATUS.DRAFT) {
    throw new ApiError(400, 'Only draft events can be deleted');
  }

  await Event.findByIdAndDelete(eventId);
  return { success: true, message: 'Event draft deleted successfully' };
};

export const registerForEvent = async (eventId, participantId, registrationData = {}) => {
  return await runWithTransaction(async (session) => {
    const opts = session ? { session } : {};

    // 1. Fetch user and check suspension
    const user = await User.findById(participantId).session(session);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(403, 'Suspended users cannot register for events');
    }

    // 2. Fetch event
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.status !== EVENT_STATUS.APPROVED) {
      throw new ApiError(400, 'Cannot register for an event that is not approved');
    }

    // 3. Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new ApiError(400, 'Registration deadline has passed');
    }

    // 3.5 Check capacity limit
    if (event.maxCapacity > 0 && (event.registrationCount || 0) >= event.maxCapacity) {
      throw new ApiError(400, 'This event has reached its maximum registration capacity');
    }

    // 3.6 Check team size limits and details
    const regType = registrationData.registrationType || 'individual';
    if (regType === 'team') {
      const teamMembers = registrationData.teamMembers || [];
      const minSize = event.teamSize?.min ?? 1;
      const maxSize = event.teamSize?.max ?? 1;
      if (teamMembers.length < minSize || teamMembers.length > maxSize) {
        throw new ApiError(400, `Team size must be between ${minSize} and ${maxSize} members`);
      }
      if (!registrationData.teamName || !registrationData.teamName.trim()) {
        throw new ApiError(400, 'Team name is required for team registrations');
      }
    } else {
      const minSize = event.teamSize?.min ?? 1;
      if (minSize > 1) {
        throw new ApiError(400, `This event requires a team registration of at least ${minSize} members`);
      }
    }

    // 4. Check if already registered
    const existingRegistration = await Registration.findOne({
      user: participantId,
      event: eventId,
      status: 'registered'
    }).session(session);

    if (existingRegistration) {
      throw new ApiError(400, 'You are already registered for this event');
    }

    // 5. Create or update registration document
    const inactiveRegistration = await Registration.findOne({
      user: participantId,
      event: eventId,
      status: 'cancelled'
    }).session(session);

    if (inactiveRegistration) {
      inactiveRegistration.status = 'registered';
      inactiveRegistration.registrationType = registrationData.registrationType || 'individual';
      inactiveRegistration.teamName = registrationData.teamName || '';
      inactiveRegistration.teamMembers = registrationData.teamMembers || [];
      inactiveRegistration.answers = registrationData.answers || [];
      inactiveRegistration.registeredAt = new Date();
      inactiveRegistration.cancelledAt = undefined;
      await inactiveRegistration.save(opts);
    } else {
      await Registration.create(
        [
          {
            user: participantId,
            event: eventId,
            status: 'registered',
            registrationType: registrationData.registrationType || 'individual',
            teamName: registrationData.teamName || '',
            teamMembers: registrationData.teamMembers || [],
            answers: registrationData.answers || [],
          }
        ],
        opts
      );
    }

    // 6. Update event registrationCount atomically
    event.registrationCount = (event.registrationCount || 0) + 1;
    await event.save(opts);

    return event;
  });
};

export const cancelRegistration = async (eventId, participantId) => {
  return await runWithTransaction(async (session) => {
    const opts = session ? { session } : {};

    const user = await User.findById(participantId).session(session);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const registration = await Registration.findOne({
      user: participantId,
      event: eventId,
      status: 'registered'
    }).session(session);

    if (!registration) {
      throw new ApiError(400, 'You are not registered for this event');
    }

    // Update registration status
    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save(opts);

    // Update event registrationCount atomically
    event.registrationCount = Math.max(0, (event.registrationCount || 1) - 1);
    await event.save(opts);

    return event;
  });
};

export const getEventRegistrations = async (eventId, user) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const isOwner = event.organiser.toString() === user._id.toString();
  const isAdmin = user.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to view this registrations list');
  }

  const registrations = await Registration.find({
    event: eventId,
    status: 'registered',
  }).populate({
    path: 'user',
    select: 'name email avatar bio organization',
  });

  return registrations;
};
