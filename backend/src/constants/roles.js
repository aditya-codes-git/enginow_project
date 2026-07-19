export const ROLES = {
  PARTICIPANT: 'participant',
  ORGANISER: 'organiser',
  ADMIN: 'admin',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INVITED: 'invited',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  DELETED: 'deleted',
};

export const ALL_ROLES = Object.values(ROLES);
export const ALL_USER_STATUS = Object.values(USER_STATUS);
