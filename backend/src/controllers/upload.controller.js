import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Upload from '../models/Upload.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file');
  }

  const urlPath = req.file.path.replace(/\\/g, '/');

  // Save upload info to DB
  const upload = await Upload.create({
    url: urlPath, // Multer-Cloudinary sets the URL here (or local normalized path)
    publicId: req.file.filename, // Multer-Cloudinary sets the public_id here
    uploadedBy: req.user._id,
    originalName: req.file.originalname || '',
    mimeType: req.file.mimetype || '',
    size: req.file.size,
  });


  res.status(201).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: upload.url,
      publicId: upload.publicId,
    },
  });
});
