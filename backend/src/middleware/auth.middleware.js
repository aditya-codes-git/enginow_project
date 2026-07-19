import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { USER_STATUS } from '../constants/roles.js';
import { verifyAccessToken } from '../utils/token.js';

export const verifySupabaseUser = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('[verifySupabaseUser] Received Authorization Token:', token ? `${token.substring(0, 15)}...` : 'NONE');

  try {
    if (!token) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Not authorized, user not found');
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(403, 'Your account has been suspended');
    }

    // Log the user's active session timestamp
    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (err) {
    console.error('[verifySupabaseUser] Authentication middleware caught exception:', err.message);
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(401, 'Not authorized, invalid session');
  }
});

export const optionalSupabaseAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    
    if (user && user.status !== USER_STATUS.SUSPENDED) {
      user.lastLogin = new Date();
      await user.save();
      req.user = user;
    }
  } catch (err) {
    // Proceed silently as unauthenticated
  }

  next();
});

// Maintain backward compatibility with existing route imports
const protect = verifySupabaseUser;
export const optionalAuth = optionalSupabaseAuth;

export default protect;

