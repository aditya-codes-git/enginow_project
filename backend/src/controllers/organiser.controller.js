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

export const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await organiserService.getMyBlogs(req.user._id);
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

export const createMyBlog = asyncHandler(async (req, res) => {
  const blog = await organiserService.createMyBlog(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

export const updateMyBlog = asyncHandler(async (req, res) => {
  const blog = await organiserService.updateMyBlog(req.params.id, req.body, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
});

export const submitMyBlog = asyncHandler(async (req, res) => {
  const blog = await organiserService.submitMyBlog(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Blog submitted for approval',
    data: blog,
  });
});

export const deleteMyBlog = asyncHandler(async (req, res) => {
  await organiserService.deleteMyBlog(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully',
  });
});