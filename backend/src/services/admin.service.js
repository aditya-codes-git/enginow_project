import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';
import OrganiserTeam from '../models/OrganiserTeam.js';
import Blog from '../models/Blog.js';
import AuditLog from '../models/AuditLog.js';
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';
import { EVENT_STATUS } from '../constants/eventStatus.js';
import { ORGANISER_STATUS } from '../constants/organiserStatus.js';
import { BLOG_STATUS } from '../constants/blogStatus.js';
import { runWithTransaction } from '../utils/transaction.js';

export const getAllUsersPaginated = async ({ page = 1, limit = 20, search, role, status, provider }) => {
  const filter = {
    isDeleted: { $ne: true }, // Exclude soft-deleted users
    role: { $ne: 'admin' }, // Exclude ALL administrator accounts
  };

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
    ];
  }

  if (role && role !== 'all') {
    filter.role = role.toLowerCase();
  }

  if (status && status !== 'all') {
    filter.status = status.toLowerCase();
  }

  if (provider && provider !== 'all') {
    filter.provider = provider.toLowerCase();
  }

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(limit));
  const skip = (parsedPage - 1) * parsedLimit;

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select('-passwordHash -refreshTokens')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit);

  return {
    users,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    },
  };
};

export const getAllUsers = async () => {
  return await User.find({ isDeleted: { $ne: true }, role: { $ne: 'admin' } }).select('-passwordHash').sort({ createdAt: -1 });
};

export const updateUserRoleAndStatus = async (userId, { role, status }, adminId, reason = '') => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot modify other administrator accounts.');
  }

  const updates = {};
  if (role) updates.role = role;
  if (status) updates.status = status;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-passwordHash -refreshTokens');

  if (role && role !== user.role) {
    await AuditLog.create({
      adminId,
      targetUserId: userId,
      action: 'change-role',
      reason: `Changed role from ${user.role} to ${role}. ${reason}`,
    });
  }

  return updatedUser;
};

export const getPendingEvents = async () => {
  return await Event.find({ status: EVENT_STATUS.PENDING })
    .populate('organiser', 'name email avatar organization')
    .sort({ createdAt: 1 });
};

export const getAllEvents = async () => {
  return await Event.find({})
    .populate('organiser', 'name email avatar organization')
    .sort({ createdAt: -1 });
};

export const approveEvent = async (eventId) => {
  return await runWithTransaction(async (session) => {
    const opts = session ? { session } : {};

    const event = await Event.findById(eventId).session(session);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (event.status !== EVENT_STATUS.PENDING) {
      throw new ApiError(400, `Event is not pending approval (current status: ${event.status})`);
    }

    event.status = EVENT_STATUS.APPROVED;
    event.rejectionReason = ''; // Clear rejection reason if previously set
    await event.save(opts);

    // Add event to organiser's team eventsManaged list if team exists
    const team = await OrganiserTeam.findOne({ members: event.organiser }).session(session);
    if (team) {
      if (!team.eventsManaged.includes(eventId)) {
        team.eventsManaged.push(eventId);
        await team.save(opts);
      }
    }

    return event;
  });
};

export const rejectEvent = async (eventId, rejectionReason) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.status !== EVENT_STATUS.PENDING) {
    throw new ApiError(400, `Event is not pending approval (current status: ${event.status})`);
  }

  event.status = EVENT_STATUS.REJECTED;
  event.rejectionReason = rejectionReason;
  await event.save();

  return event;
};

export const suspendEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.status === EVENT_STATUS.SUSPENDED) {
    throw new ApiError(400, 'Event is already suspended');
  }

  event.status = EVENT_STATUS.SUSPENDED;
  await event.save();
  return event;
};

export const activateEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.status === EVENT_STATUS.APPROVED) {
    throw new ApiError(400, 'Event is already active');
  }

  event.status = EVENT_STATUS.APPROVED;
  event.rejectionReason = '';
  await event.save();
  return event;
};

export const getAllOrganisers = async () => {
  return await OrganiserTeam.find({})
    .populate('members', 'name email avatar organization')
    .sort({ createdAt: -1 });
};

export const verifyOrganiserTeam = async (teamId, adminId) => {
  return await runWithTransaction(async (session) => {
    const opts = session ? { session } : {};

    const team = await OrganiserTeam.findById(teamId).session(session);
    if (!team) {
      throw new ApiError(404, 'Organiser team not found');
    }

    team.status = ORGANISER_STATUS.VERIFIED;
    team.verifiedAt = new Date();
    team.verifiedBy = adminId;
    await team.save(opts);

    // Automatically update team members role to organiser if needed, and make sure their status is active
    await User.updateMany(
      { _id: { $in: team.members } },
      { $set: { role: 'organiser', status: 'active' } },
      opts
    );

    return team;
  });
};

export const getAllBlogs = async () => {
  return await Blog.find({}).sort({ createdAt: -1 });
};

export const getPendingBlogs = async () => {
  return await Blog.find({ status: BLOG_STATUS.PENDING }).sort({ createdAt: 1 });
};

export const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug });
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  return blog;
};

export const createBlog = async (blogData) => {
  const existingBlog = await Blog.findOne({ slug: blogData.slug });
  if (existingBlog) {
    throw new ApiError(400, 'A blog with this slug already exists');
  }
  const blog = await Blog.create(blogData);
  return blog;
};

export const updateBlog = async (blogId, blogData) => {
  const blog = await Blog.findByIdAndUpdate(blogId, { $set: blogData }, { new: true, runValidators: true });
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  return blog;
};

export const deleteBlog = async (blogId) => {
  const blog = await Blog.findByIdAndDelete(blogId);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  return blog;
};

export const approveBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  if (![BLOG_STATUS.PENDING, BLOG_STATUS.SUSPENDED].includes(blog.status)) {
    throw new ApiError(400, `Blog cannot be approved from current status: ${blog.status}`);
  }
  blog.status = BLOG_STATUS.APPROVED;
  blog.rejectionReason = '';
  await blog.save();
  return blog;
};

export const suspendBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (blog.status === BLOG_STATUS.SUSPENDED) {
    throw new ApiError(400, 'Blog is already suspended');
  }

  blog.status = BLOG_STATUS.SUSPENDED;
  await blog.save();
  return blog;
};

export const activateBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  if (blog.status === BLOG_STATUS.APPROVED) {
    throw new ApiError(400, 'Blog is already active');
  }

  blog.status = BLOG_STATUS.APPROVED;
  blog.rejectionReason = '';
  await blog.save();
  return blog;
};

export const rejectBlog = async (blogId, rejectionReason) => {
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }
  if (blog.status !== BLOG_STATUS.PENDING) {
    throw new ApiError(400, `Blog is not pending approval (current status: ${blog.status})`);
  }
  blog.status = BLOG_STATUS.REJECTED;
  blog.rejectionReason = rejectionReason;
  await blog.save();
  return blog;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash -refreshTokens');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Access to administrator profiles is restricted.');
  }

  // Count events created, registrations, and blogs written
  const eventsCreated = await Event.countDocuments({ organiser: userId });
  const eventsRegistered = await Registration.countDocuments({ user: userId });
  const blogsWritten = await Blog.countDocuments({ organiser: userId });

  const userObj = user.toObject();
  userObj.eventsCreated = eventsCreated;
  userObj.eventsRegistered = eventsRegistered;
  userObj.blogsWritten = blogsWritten;

  return userObj;
};

export const suspendUser = async (userId, adminId, reason) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot modify other administrator accounts.');
  }

  if (user.status === 'banned') {
    throw new ApiError(409, 'Cannot suspend a banned user.');
  }
  if (user.status === 'deleted' || user.isDeleted) {
    throw new ApiError(409, 'Cannot suspend a deleted user.');
  }

  user.status = 'suspended';
  await user.save();

  await AuditLog.create({
    adminId,
    targetUserId: userId,
    action: 'suspend',
    reason,
  });

  return await User.findById(userId).select('-passwordHash -refreshTokens');
};

export const unsuspendUser = async (userId, adminId, reason) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot modify other administrator accounts.');
  }

  if (user.status === 'banned') {
    throw new ApiError(409, 'Banned users must be unbanned first.');
  }
  if (user.status === 'deleted' || user.isDeleted) {
    throw new ApiError(409, 'Cannot unsuspend a deleted user.');
  }

  user.status = 'active';
  await user.save();

  await AuditLog.create({
    adminId,
    targetUserId: userId,
    action: 'unsuspend',
    reason,
  });

  return await User.findById(userId).select('-passwordHash -refreshTokens');
};

export const banUser = async (userId, adminId, reason) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot modify other administrator accounts.');
  }

  if (user.status === 'deleted' || user.isDeleted) {
    throw new ApiError(409, 'Cannot ban a deleted user.');
  }

  user.status = 'banned';
  await user.save();

  await AuditLog.create({
    adminId,
    targetUserId: userId,
    action: 'ban',
    reason,
  });

  return await User.findById(userId).select('-passwordHash -refreshTokens');
};

export const unbanUser = async (userId, adminId, reason) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot modify other administrator accounts.');
  }

  if (user.status === 'deleted' || user.isDeleted) {
    throw new ApiError(409, 'Cannot unban a deleted user.');
  }

  user.status = 'active';
  await user.save();

  await AuditLog.create({
    adminId,
    targetUserId: userId,
    action: 'unban',
    reason,
  });

  return await User.findById(userId).select('-passwordHash -refreshTokens');
};

export const softDeleteUser = async (userId, adminId, reason) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === 'admin') {
    throw new ApiError(403, 'Administrators cannot modify other administrator accounts.');
  }

  user.status = 'deleted';
  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();

  await AuditLog.create({
    adminId,
    targetUserId: userId,
    action: 'delete',
    reason,
  });

  return { success: true };
};

