import asyncHandler from '../utils/asyncHandler.js';
import * as organiserService from '../services/organiser.service.js';

export const createTeam = asyncHandler(async (req, res) => {
  const team = await organiserService.createOrganiserTeam(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Organiser team join request submitted successfully',
    data: team,
  });
});

export const getMyTeam = asyncHandler(async (req, res) => {
  const team = await organiserService.getMyTeam(req.user._id);
  res.status(200).json({
    success: true,
    data: team || null,
  });
});
