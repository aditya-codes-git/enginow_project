import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import env from '../config/env.js';

/**
 * Helper to set HTTP-only secure cookie for refresh tokens
 */
const setRefreshTokenCookie = (res, token) => {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Helper to clear refresh token cookie
 */
const clearRefreshTokenCookie = (res) => {
  const isProduction = env.NODE_ENV === 'production';
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }
  
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAllDevices(req.user._id);
  
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out from all devices successfully',
  });
});

export const refresh = asyncHandler(async (req, res) => {
  // In development the frontend and backend run on different ports (cross-origin).
  // Browsers block SameSite=Lax cookies on cross-origin POST requests, so the
  // cookie never arrives. Accept the token from the request body as a fallback.
  const oldRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  
  try {
    const result = await authService.refreshAccessToken(oldRefreshToken);
    
    // Rotate cookie
    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    // If refresh token fails (expired/reused), clear the cookie to reset client state
    clearRefreshTokenCookie(res);
    throw error;
  }
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  
  // Wipes sessions so also clear the current active device cookie
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in again.',
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: result.message,
    resetToken: env.NODE_ENV === 'test' || env.NODE_ENV === 'development' ? result.resetToken : undefined, // expose token for local tests
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  
  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Password has been reset successfully.',
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params.token);
  res.status(200).json({
    success: true,
    message: 'Email verified successfully.',
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const token = req.body.token || req.body.accessToken || req.body.idToken;
  const result = await authService.loginGoogleUser(token);
  
  setRefreshTokenCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    message: 'Google login successful',
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      avatar: result.user.avatar,
      role: result.user.role,
      provider: result.user.provider,
    },
  });
});

