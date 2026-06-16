import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitter user is required'],
    },
    teamName: {
      type: String,
      trim: true,
      default: '',
    },
    teamMembers: [
      {
        name: {
          type: String,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
        },
        role: {
          type: String,
          trim: true,
        },
      },
    ],
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    demoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    presentationUrl: {
      type: String,
      trim: true,
      default: '',
    },
    files: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'winner'],
      default: 'submitted',
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Unique compound index to ensure one submission per user/team leader per event
submissionSchema.index({ event: 1, submittedBy: 1 }, { unique: true });

// Standalone indexes
submissionSchema.index({ event: 1 });
submissionSchema.index({ submittedBy: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
