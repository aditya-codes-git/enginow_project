import mongoose from 'mongoose';

const organizerApplicationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxlength: [100, 'Organization name must not exceed 100 characters'],
    },
    organizationType: {
      type: String,
      required: [true, 'Organization type is required'],
      enum: [
        'College',
        'University',
        'Company',
        'Startup',
        'Student Chapter',
        'Community',
        'NGO',
        'Training Institute',
        'Other'
      ],
    },
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
      maxlength: [100, 'Applicant name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Email must not exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number must not exceed 20 characters'],
    },
    website: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Website URL must not exceed 200 characters'],
    },
    linkedin: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'LinkedIn profile URL must not exceed 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [50, 'City must not exceed 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [50, 'Country must not exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
      trim: true,
      maxlength: [1000, 'Purpose must not exceed 1000 characters'],
    },
    expectedEvents: {
      type: Number,
      required: [true, 'Expected number of events per year is required'],
      min: [1, 'Expected events must be at least 1'],
    },
    expectedParticipants: {
      type: Number,
      required: [true, 'Expected participant count is required'],
      min: [1, 'Expected participants must be at least 1'],
    },
    additionalInformation: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Additional information must not exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Contacted', 'Verification', 'Approved', 'Rejected', 'Withdrawn'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
      select: false, // Prevents adminNotes from returning in normal queries
    },
    // Timestamps for audit trail
    reviewStartedAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    contactedAt: { type: Date },
    // Extensibility placeholder fields for uploads
    documents: [
      {
        documentType: { type: String, trim: true },
        url: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Virtuals
organizerApplicationSchema.virtual('applicationId').get(function() {
  return this._id;
});

organizerApplicationSchema.virtual('submittedAt').get(function() {
  return this.createdAt;
});

organizerApplicationSchema.set('toJSON', { virtuals: true });
organizerApplicationSchema.set('toObject', { virtuals: true });

const OrganizerApplication = mongoose.model('OrganizerApplication', organizerApplicationSchema);
export default OrganizerApplication;
