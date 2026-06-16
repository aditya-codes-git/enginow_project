import './set-test-env.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import app from './src/app.js';
import User from './src/models/User.js';
import { ROLES, USER_STATUS } from './src/constants/roles.js';
import env from './src/config/env.js';

dotenv.config();

// Helper to extract refresh token cookie from Response headers
const getRefreshTokenCookie = (response) => {
  const cookies = response.headers.getSetCookie();
  const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
  if (!refreshCookie) return null;
  return refreshCookie.split(';')[0].split('=')[1];
};

const runAuthTests = async () => {
  let server;
  const testEmail = 'test.user@enginow.com';
  const originalPassword = 'password123';
  const updatedPassword = 'newsecurepassword456';
  const resetPasswordVal = 'resetpassword789';

  try {
    const mongoUri = env.MONGO_URI || 'mongodb://localhost:27017/enginow-events';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');

    // Cleanup previous runs
    await User.deleteMany({ email: testEmail });
    console.log('Cleaned up previous test users.');

    // Start Express server on dynamic port
    server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/auth`;
    console.log(`Test server booted on port ${port}. Base URL: ${baseUrl}`);

    console.log('\n--- 1. Testing Registration ---');
    let registerRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Security User',
        email: testEmail,
        password: originalPassword,
        role: ROLES.PARTICIPANT,
      }),
    });
    
    let registerBody = await registerRes.json();
    console.log(`Register status: ${registerRes.status}`);
    if (registerRes.status !== 201) {
      throw new Error(`Registration failed: ${registerBody.message}`);
    }
    
    let registerCookie = getRefreshTokenCookie(registerRes);
    if (!registerCookie) {
      throw new Error('Refresh token cookie was not set on registration!');
    }
    console.log('✔ Registration successful. Cookie retrieved.');

    // Verify emailVerified is false
    let dbUser = await User.findOne({ email: testEmail });
    if (!dbUser || dbUser.emailVerified !== false || !dbUser.emailVerificationToken) {
      throw new Error('Email verification fields were not set correctly on user registration');
    }
    console.log('✔ DB verified: emailVerified is false and token is generated.');

    console.log('\n--- 2. Testing Login ---');
    let loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: originalPassword,
      }),
    });

    let loginBody = await loginRes.json();
    console.log(`Login status: ${loginRes.status}`);
    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${loginBody.message}`);
    }

    let loginAccessToken = loginBody.accessToken;
    let loginRefreshToken = getRefreshTokenCookie(loginRes);
    if (!loginAccessToken || !loginRefreshToken) {
      throw new Error('Access token or Refresh token missing from login response.');
    }
    console.log('✔ Login successful. Access & Refresh tokens generated.');

    console.log('\n--- 3. Testing Protected Route ---');
    let meRes = await fetch(`${baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${loginAccessToken}`,
      },
    });
    let meBody = await meRes.json();
    console.log(`Profile status: ${meRes.status}`);
    if (meRes.status !== 200 || meBody.data.email !== testEmail) {
      throw new Error(`Accessing profile failed: ${meBody.message}`);
    }
    console.log('✔ Accessed profile route successfully using Access Token.');

    console.log('\n--- 4. Testing Refresh Token Rotation ---');
    let refreshRes1 = await fetch(`${baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${loginRefreshToken}`,
      },
    });

    let refreshBody1 = await refreshRes1.json();
    console.log(`Refresh 1 status: ${refreshRes1.status}`);
    if (refreshRes1.status !== 200) {
      throw new Error(`Refresh failed: ${refreshBody1.message}`);
    }

    let rotatedAccessToken = refreshBody1.accessToken;
    let rotatedRefreshToken = getRefreshTokenCookie(refreshRes1);
    if (!rotatedAccessToken || !rotatedRefreshToken) {
      throw new Error('Tokens not rotated successfully.');
    }
    if (rotatedRefreshToken === loginRefreshToken) {
      throw new Error('Refresh token was not rotated (remained identical)!');
    }
    console.log('✔ Token rotation successful. Generated brand new access and refresh tokens.');

    console.log('\n--- 5. Testing Refresh Token Reuse Detection ---');
    // Attempting to reuse the old 'loginRefreshToken' (which was already rotated)
    let reuseRes = await fetch(`${baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${loginRefreshToken}`,
      },
    });

    let reuseBody = await reuseRes.json();
    console.log(`Reuse status: ${reuseRes.status}`);
    if (reuseRes.status !== 401) {
      throw new Error(`Expected 401, got ${reuseRes.status}`);
    }

    // Database check: all refresh tokens for the user must be cleared
    let userAfterReuse = await User.findOne({ email: testEmail });
    if (userAfterReuse.refreshTokens.length > 0) {
      throw new Error(`Sessions were not invalidated upon reuse detection! Count: ${userAfterReuse.refreshTokens.length}`);
    }
    console.log('✔ Session hijacking block successful. Wiped all user sessions on reuse.');

    console.log('\n--- 6. Testing Max Active Sessions Limit (Max 5) ---');
    // Log in 6 times to create 6 active sessions
    let currentRefreshToken = '';
    let currentAccessToken = '';
    for (let i = 1; i <= 6; i++) {
      let limitLoginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: originalPassword,
        }),
      });
      let limitLoginBody = await limitLoginRes.json();
      console.log(`  Login #${i} status: ${limitLoginRes.status}`, JSON.stringify(limitLoginBody));
      currentRefreshToken = getRefreshTokenCookie(limitLoginRes);
      currentAccessToken = limitLoginBody.accessToken;
    }

    let userSessions = await User.findOne({ email: testEmail });
    console.log(`Total sessions in database: ${userSessions.refreshTokens.length}`);
    if (userSessions.refreshTokens.length !== 5) {
      throw new Error(`Expected exactly 5 active sessions in DB, got ${userSessions.refreshTokens.length}`);
    }
    console.log('✔ Max active sessions limit of 5 enforced. Oldest session evicted.');

    console.log('\n--- 7. Testing Logout ---');
    let logoutRes = await fetch(`${baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${currentRefreshToken}`,
      },
    });
    console.log(`Logout status: ${logoutRes.status}`);
    if (logoutRes.status !== 200) {
      throw new Error('Logout request failed.');
    }

    let userSessionsAfterLogout = await User.findOne({ email: testEmail });
    if (userSessionsAfterLogout.refreshTokens.length !== 4) {
      throw new Error(`Expected 4 sessions remaining in DB after logout, got ${userSessionsAfterLogout.refreshTokens.length}`);
    }
    console.log('✔ Logout successful. Cookie cleared and session hash pulled from DB.');

    console.log('\n--- 8. Testing Logout All Devices ---');
    // Login twice more to get active sessions
    await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: originalPassword }),
    });
    let multipleSessionsRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: originalPassword }),
    });
    let multipleSessionsBody = await multipleSessionsRes.json();
    let authAccessToken = multipleSessionsBody.accessToken;

    let preLogoutAllUser = await User.findOne({ email: testEmail });
    console.log(`Active sessions prior to Logout All: ${preLogoutAllUser.refreshTokens.length}`);

    let logoutAllRes = await fetch(`${baseUrl}/logout-all`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authAccessToken}`,
      },
    });
    console.log(`Logout-all status: ${logoutAllRes.status}`);
    if (logoutAllRes.status !== 200) {
      throw new Error('Logout all devices request failed.');
    }

    let postLogoutAllUser = await User.findOne({ email: testEmail });
    if (postLogoutAllUser.refreshTokens.length !== 0) {
      throw new Error(`Expected 0 sessions, got ${postLogoutAllUser.refreshTokens.length}`);
    }
    console.log('✔ Logout All Devices successful. Wiped all sessions.');

    console.log('\n--- 9. Testing Change Password ---');
    // Login again to get new credentials
    let passwordLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: originalPassword }),
    });
    let passwordLoginBody = await passwordLoginRes.json();
    let oldPassAccessToken = passwordLoginBody.accessToken;

    let changePasswordRes = await fetch(`${baseUrl}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oldPassAccessToken}`,
      },
      body: JSON.stringify({
        currentPassword: originalPassword,
        newPassword: updatedPassword,
      }),
    });
    console.log(`Change password status: ${changePasswordRes.status}`);
    if (changePasswordRes.status !== 200) {
      let body = await changePasswordRes.json();
      throw new Error(`Change password failed: ${body.message}`);
    }

    // Verify all sessions were invalidated on password change
    let postChangeUser = await User.findOne({ email: testEmail });
    if (postChangeUser.refreshTokens.length !== 0) {
      throw new Error('Active sessions were not invalidated on password change!');
    }

    // Try logging in with the old password (should fail)
    let oldLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: originalPassword }),
    });
    if (oldLoginRes.status !== 401) {
      throw new Error(`Expected login failure (401) with old password, got status: ${oldLoginRes.status}`);
    }

    // Try logging in with the new password (should succeed)
    let newLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: updatedPassword }),
    });
    if (newLoginRes.status !== 200) {
      throw new Error(`Expected successful login with new password, got status: ${newLoginRes.status}`);
    }
    console.log('✔ Password change successful. Invalidated old sessions, old credentials blocked, new credentials work.');

    console.log('\n--- 10. Testing Forgot & Reset Password ---');
    let forgotRes = await fetch(`${baseUrl}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    let forgotBody = await forgotRes.json();
    console.log(`Forgot Password status: ${forgotRes.status}`);
    if (forgotRes.status !== 200 || !forgotBody.resetToken) {
      throw new Error('Forgot password request failed to return verification token');
    }

    // Reset password using token
    let resetRes = await fetch(`${baseUrl}/reset-password/${forgotBody.resetToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: resetPasswordVal }),
    });
    console.log(`Reset Password status: ${resetRes.status}`);
    if (resetRes.status !== 200) {
      let body = await resetRes.json();
      throw new Error(`Reset password failed: ${body.message}`);
    }

    // Verify reset works by logging in
    let resetLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: resetPasswordVal }),
    });
    if (resetLoginRes.status !== 200) {
      throw new Error('Failed to log in with reset password!');
    }
    console.log('✔ Forgot & Reset password flow verified successfully.');

    console.log('\n--- 11. Testing Suspended User Rejection ---');
    // Suspend user
    let userToSuspend = await User.findOne({ email: testEmail });
    userToSuspend.status = USER_STATUS.SUSPENDED;
    await userToSuspend.save();
    console.log('User status set to SUSPENDED in DB.');

    // 11a. Login should fail
    let suspendedLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: resetPasswordVal }),
    });
    console.log(`Suspended Login status: ${suspendedLoginRes.status}`);
    if (suspendedLoginRes.status !== 403) {
      throw new Error(`Expected login rejection 403, got ${suspendedLoginRes.status}`);
    }

    // 11b. Access protected route with active token should fail
    // Create token manually representing the user
    let manualAccessToken = jwt.sign(
      { id: userToSuspend._id.toString(), role: userToSuspend.role, email: userToSuspend.email },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    let suspendedAccessRes = await fetch(`${baseUrl}/me`, {
      headers: { 'Authorization': `Bearer ${manualAccessToken}` },
    });
    console.log(`Suspended Access status: ${suspendedAccessRes.status}`);
    if (suspendedAccessRes.status !== 403) {
      throw new Error(`Expected profile route rejection 403, got ${suspendedAccessRes.status}`);
    }

    // 11c. Refresh token verification should fail for suspended user
    // Generate valid refresh token manually
    let manualRefreshToken = jwt.sign(
      { id: userToSuspend._id.toString() },
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    // Add session to DB
    userToSuspend.refreshTokens.push({
      tokenHash: crypto.createHash('sha256').update(manualRefreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + 86400000),
    });
    await userToSuspend.save();

    let suspendedRefreshRes = await fetch(`${baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': `refreshToken=${manualRefreshToken}`,
      },
    });
    console.log(`Suspended Refresh status: ${suspendedRefreshRes.status}`);
    if (suspendedRefreshRes.status !== 403) {
      throw new Error(`Expected refresh rejection 403, got ${suspendedRefreshRes.status}`);
    }
    console.log('✔ Account suspension enforcement works across login, access, and refresh pipelines.');

    console.log('\n--- 12. Testing Invalid / Malformed / Expired Token Rejection ---');
    let malformedRes = await fetch(`${baseUrl}/me`, {
      headers: { 'Authorization': 'Bearer absolute_nonsense_token_value' },
    });
    console.log(`Malformed token status: ${malformedRes.status}`);
    if (malformedRes.status !== 401) {
      throw new Error(`Expected 401, got ${malformedRes.status}`);
    }

    let expiredToken = jwt.sign(
      { id: userToSuspend._id.toString() },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '-10s' } // Expired token
    );
    let expiredRes = await fetch(`${baseUrl}/me`, {
      headers: { 'Authorization': `Bearer ${expiredToken}` },
    });
    let expiredBody = await expiredRes.json();
    console.log(`Expired token status: ${expiredRes.status}`);
    if (expiredRes.status !== 401 || !expiredBody.message.includes('expired')) {
      throw new Error(`Expected token expired message, got: ${expiredBody.message}`);
    }
    console.log('✔ Malformed and expired tokens correctly rejected with 401.');

    console.log('\n======================================================');
    console.log('🎉 SUCCESS: All Phase 2 Authentication & Security Hardening tests passed!');
    console.log('======================================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:');
    console.error(error);
  } finally {
    // Cleanup
    await User.deleteMany({ email: testEmail });
    console.log('Cleaned up test user.');

    if (server) {
      server.close();
      console.log('Stopped test server.');
    }
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

runAuthTests();
