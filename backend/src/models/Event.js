import mongoose from 'mongoose';
import {
  ALL_EVENT_STATUS,
  ALL_EVENT_TYPES,
  ALL_EVENT_VISIBILITIES,
  ALL_EVENT_MODES,
  EVENT_STATUS,
  EVENT_VISIBILITY,
} from '../constants/eventStatus.js';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Event tagline is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ALL_EVENT_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: ALL_EVENT_STATUS,
      default: EVENT_STATUS.APPROVED,
    },
    visibility: {
      type: String,
      enum: ALL_EVENT_VISIBILITIES,
      default: EVENT_VISIBILITY.PUBLIC,
    },
    mode: {
      type: String,
      enum: ALL_EVENT_MODES,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    // Dates
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    submissionStart: {
      type: Date,
    },
    submissionDeadline: {
      type: Date,
    },
    judgingStart: {
      type: Date,
    },
    judgingEnd: {
      type: Date,
    },
    winnerAnnouncement: {
      type: Date,
    },
    // Other Details
    track: [
      {
        type: String,
        trim: true,
      },
    ],
    prizePool: {
      type: String,
      default: '',
    },
    teamSize: {
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 1,
      },
    },
    eligibility: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    rules: {
      type: String,
      default: '',
    },
    judgingCriteria: {
      type: String,
      default: '',
    },
    resources: [
      {
        type: String,
        trim: true,
      },
    ],
    // Media
    coverImage: {
      type: String,
      default: '',
    },
    websiteUrl: {
      type: String,
      default: '',
    },
    communityUrl: {
      type: String,
      default: '',
    },
    sponsorLogos: [
      {
        type: String,
      },
    ],
    // Contact
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
    },
    // Relationships
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    /**
     * @deprecated
     * Kept only for migration compatibility.
     * Use Registration collection instead.
     */
    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxCapacity: {
      type: Number,
      default: 0,
    },
    registrationQuestions: [
      {
        type: String,
        trim: true,
      },
    ],
    // Stats
    registrationCount: {
      type: Number,
      default: 0,
      min: [0, 'Registration count cannot be negative'],
    },
    submissionCount: {
      type: Number,
      default: 0,
      min: [0, 'Submission count cannot be negative'],
    },
    judgeCount: {
      type: Number,
      default: 0,
      min: [0, 'Judge count cannot be negative'],
    },
    // Admin review
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook for database safety checks
eventSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date cannot be before start date');
  }
  if (this.registrationDeadline && this.endDate && this.registrationDeadline > this.endDate) {
    this.invalidate('registrationDeadline', 'Registration deadline cannot be after event end');
  }
  next();
});

// Indexes
// Full-text search index
eventSchema.index({
  title: 'text',
  tagline: 'text',
  description: 'text',
});

// Single-field indexes for filtering & sorting
// Note: status and type are omitted here — the compound index below covers
// leading-field queries on status and type without duplication.
eventSchema.index({ mode: 1 });
eventSchema.index({ city: 1 });
eventSchema.index({ startDate: 1 });

// Compound index — also serves single-field queries on status and type
eventSchema.index({ status: 1, type: 1, startDate: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
