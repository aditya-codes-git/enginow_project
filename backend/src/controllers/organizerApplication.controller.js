import asyncHandler from '../utils/asyncHandler.js';
import * as applicationService from '../services/organizerApplication.service.js';

export const createApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.createOrganizerApplication(req.body);
  res.status(201).json({
    success: true,
    message: 'Organizer application submitted successfully',
    data: application,
  });
});

export default {
  createApplication,
};
