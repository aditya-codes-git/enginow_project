import ApiError from '../utils/ApiError.js';

export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User is not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
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
