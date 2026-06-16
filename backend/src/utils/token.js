import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

/**
 * Generate a short-lived access token
 * @param {Object} user User document
 * @returns {String} Signed JWT access token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email, status: user.status },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRE,
    }
  );
};

/**
 * Generate a long-lived refresh token
 * @param {Object} user User document
 * @returns {String} Signed JWT refresh token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id.toString(),
      jti: crypto.randomUUID()
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRE,
    }
  );
};


/**
 * Verify an access token
 * @param {String} token 
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

/**
 * Verify a refresh token
 * @param {String} token 
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

/**
 * Hash a token using SHA-256 for secure database storage
 * @param {String} token 
 * @returns {String} Hex-encoded SHA-256 hash
 */
export const hashToken = (token) => {
  if (!token) return '';
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};
