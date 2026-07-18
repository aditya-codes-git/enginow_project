import mongoose from 'mongoose';
import { BLOG_STATUS } from '../constants/blogStatus.js';

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    hero: {
      type: String,
      default: '',
    },
    sections: [
      {
        heading: {
          type: String,
          required: true,
        },
        body: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.DRAFT,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// slug is already indexed via unique:true in the field definition — no duplicate needed
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ title: 'text', excerpt: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;