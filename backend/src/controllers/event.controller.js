import asyncHandler from '../utils/asyncHandler.js';
import * as eventService from '../services/event.service.js';

export const getEvents = asyncHandler(async (req, res) => {
  const result = await eventService.queryEvents(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMyEvents = asyncHandler(async (req, res) => {
  const result = await eventService.queryOrgEvents(req.user, req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getEvent = asyncHandler(async (req, res) => {
  // req.user is populated by optionalAuth middleware (may be null for public access)
  const event = await eventService.getEventDetails(req.params.id, req.user || null);
  res.status(200).json({
    success: true,
    data: event,
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEventDraft(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Event draft created successfully',
    data: event,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEventDetails(req.params.id, req.body, req.user);
  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: event,
  });
});

export const submitEvent = asyncHandler(async (req, res) => {
  const event = await eventService.submitEvent(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Event submitted for approval successfully',
    data: event,
  });
});

export const archiveEvent = asyncHandler(async (req, res) => {
  const event = await eventService.archiveEvent(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Event archived successfully',
    data: event,
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const result = await eventService.deleteEvent(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const registerForEvent = asyncHandler(async (req, res) => {
  const event = await eventService.registerForEvent(req.params.id, req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: 'Successfully registered for the event',
    data: event,
  });
});

export const cancelRegistration = asyncHandler(async (req, res) => {
  const event = await eventService.cancelRegistration(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Successfully cancelled registration for the event',
    data: event,
  });
});

export const getEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await eventService.getEventRegistrations(req.params.id, req.user);
  res.status(200).json({
    success: true,
    data: registrations,
  });
});
