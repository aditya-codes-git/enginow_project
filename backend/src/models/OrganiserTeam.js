import mongoose from 'mongoose';
import { ORGANISER_STATUS, ALL_ORGANISER_STATUS } from '../constants/organiserStatus.js';

const organiserTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Team contact email is required'],
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      default: '',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ALL_ORGANISER_STATUS,
      default: ORGANISER_STATUS.PENDING,
    },
    eventsManaged: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const OrganiserTeam = mongoose.model('OrganiserTeam', organiserTeamSchema);

export default OrganiserTeam;
