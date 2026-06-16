# Phase 2 Authentication & Security Hardening Plan

This plan documents the security architecture upgrades for the EngiNow Events Platform backend.

---

## 1. Current Authentication Flow

Currently, the system uses a development-grade single JWT authentication flow:
- **Registration / Login**: User submits credentials -> Backend verifies or creates user -> Generates a single JWT containing `{ id, role, email }` signed with `JWT_SECRET` (which falls back to `'local_dev_secret_key_1234567890'`) with a lifespan of `30d`.
- **API Requests**: The token is passed via `Authorization: Bearer <token>` header.
- **Middleware**: `auth.middleware.js` verifies the signature, loads the user from the database, checks if they are suspended, and attaches the user to `req.user`.

---

## 2. Weaknesses Found

1. **Long-Lived Single JWT (XSS/Stealing Risk)**: A single token that lasts 30 days cannot be revoked. If stolen via XSS or network intercept, an attacker has indefinitely prolonged access.
2. **Missing Token Revocation**: Since token verification is purely cryptographic (stateless), there is no mechanism to invalidate a session on password change, logout, or account suspension until the token expires.
3. **Raw Sensitive Storage**: Refresh tokens or reset tokens stored raw in MongoDB could expose all active user sessions if the database is read-compromised.
4. **No Rate Limiting on Auth Endpoints**: High-risk routes like Login, Password Reset, and Register are vulnerable to credential stuffing, brute force, and DDoS.
5. **No MongoDB Sanitization or Parameter Pollution Protection**: The API does not sanitize user input against MongoDB operator injection (e.g., passing `{"email": {"$gt": ""}}` to bypass checks) or protect against HTTP Parameter Pollution (HPP).
6. **Weak Secret Fallbacks**: Fallback secrets allow the app to run in development or production with insecure, default keys if configuration files are missing.

---

## 3. Planned Changes

### Task 1: Access + Refresh Token Authentication
- **Access Token**: Short-lived (15 minutes), passed in response body. Used for regular API authorization.
- **Refresh Token**: Long-lived (7-30 days), stored in an HTTP-only, secure (in production), SameSite-configured cookie. Used to rotate and request new access/refresh tokens.
  - **Cookie Settings**: In production (`NODE_ENV === 'production'`), uses `sameSite: "none", secure: true` to support cross-domain deployment. In development, uses `sameSite: "lax", secure: false`.
- **Token Utility**: Create [token.js](file:///d:/Enginow/events.enginow/backend/src/utils/token.js) with:
  - `generateAccessToken(user)`
  - `generateRefreshToken(user)`
  - `verifyAccessToken(token)`
  - `verifyRefreshToken(token)`

### Task 2: Secure Refresh Token Database Storage & Max Sessions
- Update `User.js` model to include a `refreshTokens` subdocument array:
  ```javascript
  refreshTokens: [{
    tokenHash: String, // SHA256 hashed refresh token
    createdAt: Date,
    expiresAt: Date,
    deviceInfo: String
  }]
  ```
- **Max Sessions Limit**: Limit user's active sessions/refresh tokens to a maximum of 5. When a new login occurs, if active sessions count exceeds 5, remove the oldest session(s) first.
- Refresh tokens are hashed using Node's native `crypto` module (SHA256) before storing or querying.

### Task 3: Login & Logout Flow Updates
- **Login (`POST /api/auth/login`)**: Validates credentials -> Generates access/refresh tokens -> Enforces max active sessions limit of 5 -> Hashes and saves the new refresh token -> Sets refresh token in the HTTP-Only cookie -> Returns access token and user metadata in response body.
- **Logout (`POST /api/auth/logout`)**: Reads the refresh token from the cookie -> Hashes it and removes the matching record from the user's `refreshTokens` list in the DB -> Clears the cookie.
- **Logout All Devices (`POST /api/auth/logout-all`)**: Wipes the entire `refreshTokens` array for the authenticated user, invalidating all sessions -> Clears the cookie.

### Task 4: Token Refresh with Rotation & Reuse Detection
- **POST `/api/auth/refresh`**:
  - Reads refresh token from cookie -> Verifies it cryptographically.
  - Hashing: Hashes the token to compare.
  - **Rotation**: If the hashed token exists, delete the old refresh token, generate a brand-new refresh token and access token, save the new hashed refresh token, set the new cookie, and return the new access token.
  - **Reuse Detection**: If the refresh token is cryptographically valid, but its hash is **not** in the database, this indicates it has already been used and rotated (or stolen). In this case, **revoke all active sessions** for the user (clear `refreshTokens = []`) and force a complete re-login.

### Task 5: Password Management Endpoints
- **Change Password (`PUT /api/auth/change-password`)**: Validated with current password, hashes new password, and **wipes all active refresh tokens** (forcing logout on all devices).
- **Forgot Password (`POST /api/auth/forgot-password`)**: Generates a random reset token using `crypto.randomBytes(32)` -> Stores the SHA256 hashed token as `passwordResetToken` and set `passwordResetExpires` -> Logs/sends reset placeholder link.
- **Reset Password (`POST /api/auth/reset-password/:token`)**: Verifies matching hashed token and checks expiry -> Hashes and saves the new password -> Clears reset token/expiry -> **Wipes all active refresh tokens**.

### Task 6: Email Verification Foundation
- Add fields to `User.js` model: `emailVerified: Boolean` (default false) and `emailVerificationToken: String`.
- Implement `POST /api/auth/verify-email/:token` endpoint to mark email as verified.
- **Enforcement**: Set `emailVerified: false` on registration, but **do not block logins** during Phase 2 until a live email provider phase is completed.

### Task 7: Strict Rate Limiting
- Create [rateLimiter.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/rateLimiter.middleware.js) using `express-rate-limit` with:
  - Login: Max 5 attempts / 15 minutes.
  - Forgot Password: Max 3 attempts / 1 hour.
  - Register: Max 10 attempts / 1 hour.

### Task 8: Environment Variable Validation
- Create [env.js](file:///d:/Enginow/events.enginow/backend/src/config/env.js) using Zod to parse and validate required variables: `NODE_ENV`, `PORT`, `MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and `FRONTEND_URL`.
- Call this validator in `server.js` and `test-auth.js` to fail-fast on startup if values are invalid or missing, with no fallback defaults.

### Task 9: Input Validation with Zod
- Create and expand `auth.validator.js` to validate request payloads for:
  - **Register**: name, email, password, role.
  - **Login**: email, password.
  - **Change Password**: currentPassword, newPassword.
  - **Forgot Password**: email.
  - **Reset Password**: password.

### Task 10: Security Headers and Query Sanitization
- Install and configure `express-mongo-sanitize` (to block query injection) and `hpp` (to prevent parameter pollution).
- Configure Helmet and CORS options dynamically reading `FRONTEND_URL` and requiring credentials.

### Task 10: Updated Auth Middleware
- Update [auth.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/auth.middleware.js) to parse the `Bearer` access token, verify signature, and check user status. Suspended users are rejected with `403 Forbidden`.

---

## 4. Affected Files

### Modified Files:
- [package.json](file:///d:/Enginow/events.enginow/backend/package.json) (dependencies for sanitization and hpp)
- [User.js](file:///d:/Enginow/events.enginow/backend/src/models/User.js) (add refreshTokens array, email verification, and reset token schemas)
- [auth.routes.js](file:///d:/Enginow/events.enginow/backend/src/routes/auth.routes.js) (new routes for refresh, logout, password reset, change password, email verification)
- [auth.controller.js](file:///d:/Enginow/events.enginow/backend/src/controllers/auth.controller.js) (controller handlers for all new auth actions)
- [auth.service.js](file:///d:/Enginow/events.enginow/backend/src/services/auth.service.js) (business logic for logins, tokens, resets, verifications)
- [auth.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/auth.middleware.js) (protect middleware updating to access token)
- [app.js](file:///d:/Enginow/events.enginow/backend/src/app.js) (helmet, cors, hpp, mongo-sanitize integration)
- [server.js](file:///d:/Enginow/events.enginow/backend/src/server.js) (env validation invocation)
- [.env.example](file:///d:/Enginow/events.enginow/backend/.env.example) (add access/refresh configuration variables)

### New Files:
- [env.js](file:///d:/Enginow/events.enginow/backend/src/config/env.js) (environment parser via Zod)
- [token.js](file:///d:/Enginow/events.enginow/backend/src/utils/token.js) (helper for access and refresh tokens)
- [rateLimiter.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/rateLimiter.middleware.js) (fine-grained auth rate limits)
- [test-auth.js](file:///d:/Enginow/events.enginow/backend/test-auth.js) (comprehensive test suite covering all tasks)

---

## 5. Verification Plan

### Automated Verification:
- Run `node test-auth.js` to execute the full auth flow and security tests.
- Run `node test-db.js` to verify registration, submission, and cancellation still pass.
- Run `node test-upload.js` to confirm upload endpoint works.

### Manual Verification:
- Boot up local server with missing `.env` parameters to confirm fail-fast behavior.
- Validate cookie security flags (`httpOnly`, `secure`, `sameSite`) are present in HTTP responses.
