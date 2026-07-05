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
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
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

// Slugify helper function
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special chars except alphanumeric, space, hyphen
    .replace(/[\s_]+/g, '-')  // replace spaces and underscores with hyphens
    .replace(/-+/g, '-')      // collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

// Pre-validate hook for database safety checks
eventSchema.pre('validate', async function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date cannot be before start date');
  }
  if (this.registrationDeadline && this.endDate && this.registrationDeadline > this.endDate) {
    this.invalidate('registrationDeadline', 'Registration deadline cannot be after event end');
  }

  // Generate unique slug ONLY for new events or if slug is missing
  if (this.isNew && !this.slug) {
    const baseSlug = slugify(this.title || 'event');
    let uniqueSlug = baseSlug;
    let counter = 1;
    let slugExists = true;

    while (slugExists) {
      const checkSlug = counter === 1 ? uniqueSlug : `${baseSlug}-${counter}`;
      const existingEvent = await mongoose.model('Event').findOne({ slug: checkSlug });
      if (!existingEvent || (existingEvent._id.toString() === this._id.toString())) {
        uniqueSlug = checkSlug;
        slugExists = false;
      } else {
        counter++;
      }
    }
    this.slug = uniqueSlug;
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
eventSchema.index({ status: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ mode: 1 });
eventSchema.index({ city: 1 });
eventSchema.index({ startDate: 1 });

// Compound index
eventSchema.index({ status: 1, type: 1, startDate: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;

