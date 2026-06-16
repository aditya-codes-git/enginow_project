import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended'],
      default: 'registered',
    },
    registrationType: {
      type: String,
      enum: ['individual', 'team'],
      default: 'individual',
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
    answers: [
      {
        question: {
          type: String,
          trim: true,
        },
        answer: {
          type: String,
          trim: true,
        },
      },
    ],
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// Unique compound index to prevent double registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Standalone indexes for query performance
registrationSchema.index({ event: 1 });
registrationSchema.index({ user: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
