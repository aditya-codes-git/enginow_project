import asyncHandler from '../utils/asyncHandler.js';
import * as submissionService from '../services/submission.service.js';

export const submitProject = asyncHandler(async (req, res) => {
  const submission = await submissionService.createSubmission(
    req.params.id,
    req.user._id,
    req.body
  );
  res.status(201).json({
    success: true,
    message: 'Project submitted successfully',
    data: submission,
  });
});

export const getEventSubmissions = asyncHandler(async (req, res) => {
  const submissions = await submissionService.getEventSubmissions(
    req.params.id,
    req.user
  );
  res.status(200).json({
    success: true,
    data: submissions,
  });
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await submissionService.getUserSubmissions(req.user._id);
  res.status(200).json({
    success: true,
    data: submissions,
  });
});
