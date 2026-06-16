import OrganiserTeam from '../models/OrganiserTeam.js';
import ApiError from '../utils/ApiError.js';
import { ORGANISER_STATUS } from '../constants/organiserStatus.js';

export const createOrganiserTeam = async (teamData, organiserId) => {
  // Check if organiser is already member of a team
  const existingTeam = await OrganiserTeam.findOne({ members: organiserId });
  if (existingTeam) {
    throw new ApiError(400, 'You are already a member of an organiser team');
  }

  // Check if team name is already taken
  const nameTaken = await OrganiserTeam.findOne({ name: teamData.name });
  if (nameTaken) {
    throw new ApiError(400, 'Organiser team name is already taken');
  }

  const team = await OrganiserTeam.create({
    name: teamData.name,
    email: teamData.email,
    website: teamData.website,
    members: [organiserId],
    status: ORGANISER_STATUS.PENDING,
  });

  return team;
};

export const getMyTeam = async (organiserId) => {
  const team = await OrganiserTeam.findOne({ members: organiserId })
    .populate('members', 'name email avatar organization')
    .populate('eventsManaged');
    
  return team;
};
