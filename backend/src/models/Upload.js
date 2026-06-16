import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Upload URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by user ID is required'],
    },
    originalName: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
uploadSchema.index({ uploadedBy: 1 });
uploadSchema.index({ url: 1 });

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;
