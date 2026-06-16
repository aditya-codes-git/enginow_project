import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { USER_STATUS } from '../constants/roles.js';
import { verifyAccessToken } from '../utils/token.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    const decoded = verifyAccessToken(token);
    
    // Fetch user details from database, optimizing using specific field selection and lean queries
    const user = await User.findById(decoded.id)
      .select('_id id name email role status')
      .lean();
      
    if (!user) {
      throw new ApiError(401, 'User associated with token not found');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(403, 'Your account has been suspended');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Check if TokenExpiredError is thrown by jsonwebtoken
    const message = error.name === 'TokenExpiredError' ? 'Access token expired' : 'Not authorized, invalid token';
    throw new ApiError(401, message);
  }
});

export default protect;

/**
 * Optional authentication middleware.
 * Attaches req.user if a valid Bearer token is present,
 * otherwise passes through silently (req.user remains undefined).
 * Never throws 401 — unauthenticated access is allowed.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id)
      .select('_id id name email role status')
      .lean();
      
    if (user && user.status !== USER_STATUS.SUSPENDED) {
      req.user = user;
    }
  } catch (err) {
    // Token invalid or expired — proceed as unauthenticated
    req.user = null;
  }

  next();
});

