import OrganiserTeam from '../models/OrganiserTeam.js';
import Blog from '../models/Blog.js';
import ApiError from '../utils/ApiError.js';
import { ORGANISER_STATUS } from '../constants/organiserStatus.js';
import { BLOG_STATUS } from '../constants/blogStatus.js';

export const createOrganiserTeam = async (teamData, organiserId) => {
  const existingTeam = await OrganiserTeam.findOne({ members: organiserId });
  if (existingTeam) {
    throw new ApiError(400, 'You are already a member of an organiser team');
  }

  const nameTaken = await OrganiserTeam.findOne({ name: teamData.name });
  if (nameTaken) {
    throw new ApiError(400, 'Organiser team name is already taken');
  }

  return await OrganiserTeam.create({
    name: teamData.name,
    email: teamData.email,
    website: teamData.website,
    members: [organiserId],
    status: ORGANISER_STATUS.PENDING,
  });
};

export const getMyTeam = async (organiserId) => {
  return await OrganiserTeam.findOne({ members: organiserId })
    .populate('members', 'name email avatar organization')
    .populate('eventsManaged');
};

export const getMyBlogs = async (organiserId) => {
  return await Blog.find({ organiser: organiserId }).sort({ createdAt: -1 });
};

export const createMyBlog = async (blogData, organiserId) => {
  const existingBlog = await Blog.findOne({ slug: blogData.slug });
  if (existingBlog) {
    throw new ApiError(400, 'A blog with this slug already exists');
  }

  return await Blog.create({
    ...blogData,
    organiser: organiserId,
    status: BLOG_STATUS.PENDING,
  });
};

export const updateMyBlog = async (blogId, blogData, organiserId) => {
  const blog = await Blog.findOne({ _id: blogId, organiser: organiserId });
  if (!blog) {
    throw new ApiError(404, 'Blog not found or you do not have permission to edit it');
  }

  if (blog.status === BLOG_STATUS.APPROVED) {
    throw new ApiError(400, 'Cannot edit an approved blog. Contact admin to make changes.');
  }

  Object.assign(blog, blogData);
  await blog.save();
  return blog;
};

export const submitMyBlog = async (blogId, organiserId) => {
  const blog = await Blog.findOne({ _id: blogId, organiser: organiserId });
  if (!blog) {
    throw new ApiError(404, 'Blog not found or you do not have permission to submit it');
  }

  if (blog.status !== BLOG_STATUS.DRAFT) {
    throw new ApiError(400, 'Only draft blogs can be submitted for approval');
  }

  blog.status = BLOG_STATUS.PENDING;
  await blog.save();
  return blog;
};

export const deleteMyBlog = async (blogId, organiserId) => {
  const blog = await Blog.findOneAndDelete({ _id: blogId, organiser: organiserId });
  if (!blog) {
    throw new ApiError(404, 'Blog not found or you do not have permission to delete it');
  }
  return blog;
};