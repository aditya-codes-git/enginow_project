import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';
import OrganiserTeam from '../models/OrganiserTeam.js';
import Blog from '../models/Blog.js';
import ApiError from '../utils/ApiError.js';
import { EVENT_STATUS } from '../constants/eventStatus.js';
import { ORGANISER_STATUS } from '../constants/organiserStatus.js';
import { BLOG_STATUS } from '../constants/blogStatus.js';
import { runWithTransaction } from '../utils/transaction.js';

export const getAllUsers = async () => {
  return await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
};

export const updateUserRoleAndStatus = async (userId, { role, status }) => {
  const updates = {};
  if (role) updates.role = role;
  if (status) updates.status = status;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
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
