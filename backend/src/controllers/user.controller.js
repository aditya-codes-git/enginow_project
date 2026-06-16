import asyncHandler from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';

export const getMyRegisteredEvents = asyncHandler(async (req, res) => {
  const events = await userService.getRegisteredEvents(req.user._id);
  res.status(200).json({
    success: true,
    data: events,
  });
});
