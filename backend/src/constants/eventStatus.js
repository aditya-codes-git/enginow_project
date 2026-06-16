export const EVENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
};

export const EVENT_TYPE = {
  HACKATHON: 'Hackathon',
  WORKSHOP: 'Workshop',
  WEBINAR: 'Webinar',
  COMPETITION: 'Competition',
  EVENT: 'Event',
};

export const EVENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const EVENT_MODE = {
  ONLINE: 'Online',
  IN_PERSON: 'In-person',
  HYBRID: 'Hybrid',
};

export const ALL_EVENT_STATUS = Object.values(EVENT_STATUS);
export const ALL_EVENT_TYPES = Object.values(EVENT_TYPE);
export const ALL_EVENT_VISIBILITIES = Object.values(EVENT_VISIBILITY);
export const ALL_EVENT_MODES = Object.values(EVENT_MODE);
