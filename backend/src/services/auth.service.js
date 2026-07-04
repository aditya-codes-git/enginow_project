import crypto from 'crypto';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { USER_STATUS, ROLES } from '../constants/roles.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../utils/token.js';
import env from '../config/env.js';

/**
 * Helper to process and add a refresh token to user sessions (max 5 active sessions)
 * @param {Object} user User model instance
 * @param {String} refreshToken Hashed or raw refresh token to add
 */
const addRefreshTokenSession = async (user, refreshToken) => {
  const tokenHash = hashToken(refreshToken);
  
  // Set expiration date matching environment config (default 7 days)
  const daysToExpire = 7; 
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysToExpire);

  // Enforce Max Sessions limit (max 5 devices/sessions)
  if (user.refreshTokens.length >= 5) {
    // Sort oldest first
    user.refreshTokens.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    while (user.refreshTokens.length >= 5) {
      user.refreshTokens.shift(); // Evict oldest
    }
  }

  user.refreshTokens.push({
    tokenHash,
    expiresAt,
    createdAt: new Date(),
  });

  await user.save();
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Create random verification token for email verification foundation
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    passwordHash: password, // Pre-save hooks will handle password hashing
    role: ROLES.PARTICIPANT,
    emailVerified: false,
    emailVerificationToken: verificationToken,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token session in database
  await addRefreshTokenSession(user, refreshToken);

  const userResponse = await User.findById(user._id).select('-passwordHash -refreshTokens');

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status === USER_STATUS.SUSPENDED) {
    throw new ApiError(403, 'Your account has been suspended');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token session in database
  await addRefreshTokenSession(user, refreshToken);

  const userResponse = await User.findById(user._id).select('-passwordHash -refreshTokens');

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  const tokenHash = hashToken(refreshToken);

  // Find user with this active refresh token and remove it
  const user = await User.findOne({ 'refreshTokens.tokenHash': tokenHash });
  if (user) {
    user.refreshTokens = user.refreshTokens.filter((s) => s.tokenHash !== tokenHash);
    await user.save();
  }
};

export const logoutAllDevices = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  user.refreshTokens = [];
  await user.save();
};

export const refreshAccessToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    // If cryptographic verification fails, we throw 401
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  let user;
  try {
    user = await User.findById(decoded.id);
  } catch (err) {
    throw new ApiError(401, 'Invalid refresh token payload');
  }

  if (!user) {
    throw new ApiError(401, 'User associated with token not found');
  }

  if (user.status === USER_STATUS.SUSPENDED) {
    throw new ApiError(403, 'Your account has been suspended');
  }

  const oldHash = hashToken(oldRefreshToken);
  const sessionIndex = user.refreshTokens.findIndex((s) => s.tokenHash === oldHash);

  // REUSE DETECTION / HIJACKING
  if (sessionIndex === -1) {
    // Cryptographically valid token, but hash not in database.
    // Token has been reused/stolen. Wipe all sessions!
    user.refreshTokens = [];
    await user.save();
    throw new ApiError(401, 'Session hijacked: Refresh token has already been used. All sessions revoked.');
  }

  // Check if session has expired based on database dates
  const session = user.refreshTokens[sessionIndex];
  if (new Date() > new Date(session.expiresAt)) {
    user.refreshTokens.splice(sessionIndex, 1);
    await user.save();
    throw new ApiError(401, 'Refresh token session expired');
  }

  // Generate rotated tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // ROTATION: Remove old session and add new session
  user.refreshTokens.splice(sessionIndex, 1);
  await addRefreshTokenSession(user, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash -refreshTokens');
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const allowedUpdates = {};
  if (updateData.name !== undefined) allowedUpdates.name = updateData.name;
  if (updateData.avatar !== undefined) allowedUpdates.avatar = updateData.avatar;
  if (updateData.bio !== undefined) allowedUpdates.bio = updateData.bio;
  if (updateData.organization !== undefined) allowedUpdates.organization = updateData.organization;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  ).select('-passwordHash -refreshTokens');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Incorrect current password');
  }

  // Update password (pre-save hook hashes it) and wipe all other active sessions
  user.passwordHash = newPassword;
  user.refreshTokens = [];
  await user.save();

  return { success: true };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Store hashed token and 10-minute expiry
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Return reset link placeholder
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;
  console.log(`[Email Placeholder] Password reset link sent to ${email}: ${resetUrl}`);

  return {
    success: true,
    message: 'Password reset link generated successfully',
    resetToken, // Returned for testing purposes
  };
};

export const resetPassword = async (token, newPassword) => {
  const tokenHash = hashToken(token);
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  // Update password, clear reset token fields, and revoke all sessions
  user.passwordHash = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  return { success: true };
};

export const verifyEmail = async (token) => {
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    throw new ApiError(400, 'Invalid or expired email verification token');
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  return { success: true };
};
