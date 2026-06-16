import asyncHandler from '../utils/asyncHandler.js';
import * as adminService from '../services/admin.service.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserRoleAndStatus(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const getPendingEvents = asyncHandler(async (req, res) => {
  const events = await adminService.getPendingEvents();
  res.status(200).json({
    success: true,
    data: events,
  });
});

export const approveEvent = asyncHandler(async (req, res) => {
  const event = await adminService.approveEvent(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Event approved successfully',
    data: event,
  });
});

export const rejectEvent = asyncHandler(async (req, res) => {
  const event = await adminService.rejectEvent(req.params.id, req.body.rejectionReason);
  res.status(200).json({
    success: true,
    message: 'Event rejected successfully',
    data: event,
  });
});

export const getOrganisers = asyncHandler(async (req, res) => {
  const organisers = await adminService.getAllOrganisers();
  res.status(200).json({
    success: true,
    data: organisers,
  });
});

export const verifyOrganiser = asyncHandler(async (req, res) => {
  const team = await adminService.verifyOrganiserTeam(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Organiser team verified successfully',
    data: team,
  });
});
