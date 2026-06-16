import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage as cloudinaryStorage } from '../config/cloudinary.js';
import env from '../config/env.js';

// Setup file upload filter (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images are allowed!'), false);
  }
};

// Detect if Cloudinary is configured with actual credentials vs default local placeholders
const isCloudinaryConfigured = 
  env.NODE_ENV === 'production' || 
  (env.CLOUDINARY_NAME && 
   env.CLOUDINARY_NAME !== 'dev_cloudinary' &&
   env.CLOUDINARY_API_KEY && 
   env.CLOUDINARY_API_KEY !== 'dev_api_key' &&
   env.CLOUDINARY_SECRET && 
   env.CLOUDINARY_SECRET !== 'dev_secret');

let storage;

if (isCloudinaryConfigured) {
  storage = cloudinaryStorage;
} else {
  // Local fallback storage for development and testing
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
