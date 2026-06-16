import User from '../models/User.js';
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';

export const getRegisteredEvents = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const registrations = await Registration.find({
    user: userId,
    status: 'registered',
  }).populate({
    path: 'event',
    populate: {
      path: 'organiser',
      select: 'name email avatar organization',
    },
  });

  return registrations.map((r) => r.event).filter(Boolean);
};
