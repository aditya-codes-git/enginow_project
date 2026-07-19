import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { USER_STATUS } from '../constants/roles.js';
import supabase from '../config/supabase.js';

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

    // Retrieve the verified user payload via Supabase API (asymmetric RS256 token verification)
    console.log('[verifySupabaseUser] Calling supabase.auth.getUser(token)...');
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('[verifySupabaseUser] Supabase auth.getUser error:', error);
      const apiErr = new ApiError(401, error.message || 'Not authorized, invalid token');
      apiErr.supabaseError = error;
      throw apiErr;
    }

    if (!supabaseUser) {
      console.error('[verifySupabaseUser] Supabase auth.getUser returned no user.');
      throw new ApiError(401, 'Not authorized, invalid token');
    }

    console.log('[verifySupabaseUser] Supabase user verified:', {
      id: supabaseUser.id,
      email: supabaseUser.email,
    });

    const supabaseUserId = supabaseUser.id;
    const email = supabaseUser.email;

    // Check if the user already exists in MongoDB
    let user = await User.findOne({ supabaseUserId });
    console.log('[verifySupabaseUser] MongoDB lookup by supabaseUserId:', user ? user.email : 'NOT FOUND');

    if (!user) {
      // Check for email collision (pre-existing local/Google users with the same email)
      user = await User.findOne({ email: email.toLowerCase() });
      console.log('[verifySupabaseUser] MongoDB lookup by email collision:', user ? user.email : 'NOT FOUND');

      if (user) {
        // Link the existing MongoDB account to the Supabase identity
        user.supabaseUserId = supabaseUserId;
        user.provider = supabaseUser.app_metadata?.provider || 'email';
        await user.save();
        console.log('[verifySupabaseUser] Linked existing MongoDB account to Supabase ID');
      } else {
        // Auto-create new user record in MongoDB (First-time onboarding)
        const metadata = supabaseUser.user_metadata || {};
        user = await User.create({
          supabaseUserId,
          email: email.toLowerCase(),
          name: metadata.full_name || metadata.name || email.split('@')[0],
          avatar: metadata.avatar_url || '',
          provider: supabaseUser.app_metadata?.provider || 'email',
          role: 'participant', // default role
          status: USER_STATUS.ACTIVE,
        });
        console.log('[verifySupabaseUser] Created new MongoDB user:', user.email);
      }
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
    
    // Write debug info to file
    try {
      const fs = await import('fs');
      const debugInfo = {
        timestamp: new Date().toISOString(),
        token: token ? `${token.substring(0, 15)}... [length: ${token.length}]` : 'NONE',
        errorMsg: err.message,
        stack: err.stack,
        supabaseError: err.supabaseError || null
      };
      fs.writeFileSync('d:/enginow_project/backend/auth_debug.json', JSON.stringify(debugInfo, null, 2));
    } catch (fsErr) {
      console.error('Failed to write debug info file:', fsErr.message);
    }

    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(401, err.message || 'Not authorized, invalid session');
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
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (!error && supabaseUser) {
      const supabaseUserId = supabaseUser.id;
      let user = await User.findOne({ supabaseUserId });

      if (!user) {
        user = await User.findOne({ email: supabaseUser.email.toLowerCase() });
        if (user) {
          user.supabaseUserId = supabaseUserId;
          user.provider = supabaseUser.app_metadata?.provider || 'email';
          await user.save();
        } else {
          const metadata = supabaseUser.user_metadata || {};
          user = await User.create({
            supabaseUserId,
            email: supabaseUser.email.toLowerCase(),
            name: metadata.full_name || metadata.name || supabaseUser.email.split('@')[0],
            avatar: metadata.avatar_url || '',
            provider: supabaseUser.app_metadata?.provider || 'email',
            role: 'participant',
            status: USER_STATUS.ACTIVE,
          });
        }
      }

      if (user && user.status !== USER_STATUS.SUSPENDED) {
        user.lastLogin = new Date();
        await user.save();
        req.user = user;
      }
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
