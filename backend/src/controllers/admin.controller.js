import asyncHandler from '../utils/asyncHandler.js';
import * as adminService from '../services/admin.service.js';

export const getUsers = asyncHandler(async (req, res) => {
  const currentAdminId = req.user?._id;
  const result = await adminService.getAllUsersPaginated({
    currentAdminId,
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    role: req.query.role,
    status: req.query.status,
    provider: req.query.provider,
  });
  
  res.status(200).json({
    success: true,
    data: result.users,
    pagination: result.pagination,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  if (req.user && req.user._id.toString() === req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Administrators cannot modify their own account.',
    });
  }
  const user = await adminService.updateUserRoleAndStatus(req.params.id, req.body, req.user._id, req.body.reason);
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

export const getEvents = asyncHandler(async (req, res) => {
  const events = await adminService.getAllEvents();
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

export const suspendEvent = asyncHandler(async (req, res) => {
  const event = await adminService.suspendEvent(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Event suspended successfully',
    data: event,
  });
});

export const activateEvent = asyncHandler(async (req, res) => {
  const event = await adminService.activateEvent(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Event activated successfully',
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

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await adminService.getAllBlogs();
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

export const getPendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await adminService.getPendingBlogs();
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.getBlogBySlug(req.params.slug);
  res.status(200).json({
    success: true,
    data: blog,
  });
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.createBlog(req.body);
  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.updateBlog(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await adminService.deleteBlog(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully',
  });
});

export const approveBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.approveBlog(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Blog approved successfully',
    data: blog,
  });
});

export const rejectBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.rejectBlog(req.params.id, req.body.rejectionReason);
  res.status(200).json({
    success: true,
    message: 'Blog rejected successfully',
    data: blog,
  });
});

export const suspendBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.suspendBlog(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Blog suspended successfully',
    data: blog,
  });
});

export const activateBlog = asyncHandler(async (req, res) => {
  const blog = await adminService.activateBlog(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Blog activated successfully',
    data: blog,
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const suspendUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const reason = req.body.reason || '';
  if (adminId.toString() === req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Administrators cannot modify their own account.',
    });
  }
  const user = await adminService.suspendUser(req.params.id, adminId, reason);
  res.status(200).json({
    success: true,
    message: 'User suspended successfully',
    data: user,
  });
});

export const unsuspendUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const reason = req.body.reason || '';
  if (adminId.toString() === req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Administrators cannot modify their own account.',
    });
  }
  const user = await adminService.unsuspendUser(req.params.id, adminId, reason);
  res.status(200).json({
    success: true,
    message: 'User unsuspended successfully',
    data: user,
  });
});

export const banUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const reason = req.body.reason || '';
  if (adminId.toString() === req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Administrators cannot modify their own account.',
    });
  }
  const user = await adminService.banUser(req.params.id, adminId, reason);
  res.status(200).json({
    success: true,
    message: 'User banned successfully',
    data: user,
  });
});

export const unbanUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const reason = req.body.reason || '';
  if (adminId.toString() === req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Administrators cannot modify their own account.',
    });
  }
  const user = await adminService.unbanUser(req.params.id, adminId, reason);
  res.status(200).json({
    success: true,
    message: 'User unbanned successfully',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const reason = req.body.reason || '';
  if (adminId.toString() === req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'Administrators cannot modify their own account.',
    });
  }
  await adminService.softDeleteUser(req.params.id, adminId, reason);
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

