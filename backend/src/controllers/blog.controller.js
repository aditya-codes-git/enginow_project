import asyncHandler from '../utils/asyncHandler.js';
import Blog from '../models/Blog.js';
import ApiError from '../utils/ApiError.js';
import { BLOG_STATUS } from '../constants/blogStatus.js';

export const getPublishedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: BLOG_STATUS.APPROVED }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: blogs,
  });
});

export const getPublishedBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: BLOG_STATUS.APPROVED,
  });

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
});