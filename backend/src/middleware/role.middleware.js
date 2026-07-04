import ApiError from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User is not authenticated'));
    }

    if (req.user.role !== ROLES.ADMIN && !allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden. Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};
