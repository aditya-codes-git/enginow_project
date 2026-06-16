# Backend Code Quality & Architecture Analysis Report

This report presents a thorough analysis of the EngiNow Events Platform backend. It identifies code quality issues, security vulnerabilities, database consistency bugs, and architectural inconsistencies, and provides actionable recommendations with refactoring code snippets.

---

## 📋 Executive Summary

The backend codebase is built on **Node.js, Express, MongoDB/Mongoose, and Zod**. It is generally well-structured, follows a decoupled route-controller-service pattern, utilizes security middlewares, and implements JWT-based Refresh Token Rotation.

However, several critical and high-priority issues were identified:
1. **Security & Configuration**: Environment variables bypass the Zod validation schema, leading to raw `process.env` calls.
2. **Data Inconsistency**: Zod validation middleware discards default values and type coercions, and certain multi-document updates (Submissions) lack database transaction guarantees.
3. **Broken Local Fallbacks**: The local upload filesystem fallback is broken in development because the directory is not statically served, and URLs are saved with raw filesystem backslashes on Windows.
4. **Error Handling Gaps**: CastErrors and duplicate key violations crash into generic `500 Internal Server Error` responses, exposing database internals.

---

## 🛠️ Detailed Findings & Improvements

### 1. Raw `process.env` Usage Bypassing Central Validation
* **Severity:** 🔴 Critical / High
* **Files Affected:**
  * [src/config/db.js](file:///d:/Enginow/events.enginow/backend/src/config/db.js#L5)
  * [src/config/cloudinary.js](file:///d:/Enginow/events.enginow/backend/src/config/cloudinary.js#L8-L10)
  * [src/utils/token.js](file:///d:/Enginow/events.enginow/backend/src/utils/token.js#L15)
  * [src/middleware/upload.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/upload.middleware.js#L17-L22)
  * [src/middleware/error.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/error.middleware.js#L20)
* **The Problem:**
  While a centralized validation file exists in `src/config/env.js`, many files bypass it and reference raw `process.env` directly. Furthermore, crucial variables like `CLOUDINARY_*` and `*EXPIRE` limits are not validated in the schema. This can cause silent failures or runtime crashes if variables are misconfigured.
* **Proposed Solution:**
  Update `src/config/env.js` to validate all backend environment variables, and export them. Replace all raw `process.env` calls with references to the validated `env` object.

```javascript
// src/config/env.js
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => Number(val)).default('5000'),
  MONGO_URI: z.string().url('MONGO_URI must be a valid URL'),
  ACCESS_TOKEN_SECRET: z.string().min(16),
  REFRESH_TOKEN_SECRET: z.string().min(16),
  ACCESS_TOKEN_EXPIRE: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRE: z.string().default('7d'),
  FRONTEND_URL: z.string().url(),
  CLOUDINARY_NAME: z.string().optional().default('dev_cloudinary'),
  CLOUDINARY_API_KEY: z.string().optional().default('dev_api_key'),
  CLOUDINARY_SECRET: z.string().optional().default('dev_secret'),
});
```

---

### 2. Discarded Zod Defaults and Transformed Inputs
* **Severity:** 🔴 High
* **Files Affected:**
  * [src/middleware/validate.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/validate.middleware.js#L3-L20)
* **The Problem:**
  The validation middleware validates requests using `schema.parse()`, but it does not write the parsed and transformed values back to Express request properties. Any `.default()` declarations (e.g. `registrationType` default of `'individual'` in `registration.validator.js` or `teamSize` defaults in `event.validator.js`) are thrown away. The controller only receives the raw unvalidated payload.
* **Proposed Solution:**
  Assign the result of `schema.parse` back to the corresponding `req` objects.

```javascript
// src/middleware/validate.middleware.js
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      next();
    } catch (error) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message,
      }));
      next(new ApiError(400, 'Validation failed', formattedErrors));
    }
  };
};
```

---

### 3. Inconsistent Refresh Token Expirations
* **Severity:** 🟡 Medium
* **Files Affected:**
  * [src/services/auth.service.js](file:///d:/Enginow/events.enginow/backend/src/services/auth.service.js#L22)
  * [src/utils/token.js](file:///d:/Enginow/events.enginow/backend/src/utils/token.js#L33)
* **The Problem:**
  The JWT signature expiration defaults to `7d` via `process.env.REFRESH_TOKEN_EXPIRE`, but in `auth.service.js` the database session expiration date is hardcoded:
  ```javascript
  const daysToExpire = 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysToExpire);
  ```
  If an administrator changes `REFRESH_TOKEN_EXPIRE` in `.env` to `30d` for longer-lived sessions, the JWT will remain cryptographically valid, but users will be forced to log out after 7 days because the database session `expiresAt` is hardcoded.
* **Proposed Solution:**
  Implement a helper to parse time-duration strings (like `'7d'`, `'30d'`, `'24h'`) in `env.js` and use it to calculate the database expiration dynamically.

---

### 4. Broken Local Fallback File Upload & Static Server Serving
* **Severity:** 🔴 High
* **Files Affected:**
  * [src/app.js](file:///d:/Enginow/events.enginow/backend/src/app.js)
  * [src/controllers/upload.controller.js](file:///d:/Enginow/events.enginow/backend/src/controllers/upload.controller.js#L12)
* **The Problem:**
  If Cloudinary is not configured, the backend falls back to saving files locally in `./uploads`. However:
  1. The `uploads` directory is **never served statically** in `app.js`. When a client tries to load an image path, the backend returns a `404 Not Found`.
  2. On Windows, `req.file.path` evaluates to filesystem paths containing backslashes (e.g. `uploads\image-123.png`), which makes the database URL invalid for HTTP requests.
* **Proposed Solution:**
  1. Add static serving middleware to `app.js`:
     ```javascript
     app.use('/uploads', express.static('uploads'));
     ```
  2. Normalize the file URL path to use forward slashes in the upload controller, and prefix it with the API server base URL for consistency:
     ```javascript
     const normalizedPath = req.file.path.replace(/\\/g, '/');
     ```

---

### 5. Error Handling Gaps: CastErrors, Duplicate Key, and Normalized Validation Errors
* **Severity:** 🔴 High
* **Files Affected:**
  * [src/middleware/error.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/error.middleware.js)
* **The Problem:**
  * **CastError**: Providing an invalid MongoDB ObjectId in parameter routes (e.g. `/api/events/invalid-id`) causes Mongoose to throw a `CastError`. The current middleware returns a `500 Internal Server Error` instead of a standard `400 Bad Request`.
  * **Duplicate Key Error (code 11000)**: Under concurrent situations, unique constraints (like duplicate email or double registrations) can crash with a 500 error leaking database schemas.
  * **Mongoose Validation Errors**: Standard Mongoose validation errors are sent back as objects instead of the standard `[{ field: string, message: string }]` array format.
* **Proposed Solution:**
  Refactor the error middleware to specifically capture and normalize these database errors.

```javascript
// src/middleware/error.middleware.js refactoring block
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong';
    let errors = [];

    // 1. Mongoose Validation Error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
    } 
    // 2. Mongoose Invalid ObjectId Cast Error
    else if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    } 
    // 3. MongoDB Duplicate Key Error
    else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue)[0];
      message = `A record with this ${field} already exists.`;
      errors = [{ field, message: `Duplicate value for ${field}` }];
    }
    // 4. Multer / File Upload errors
    else if (error.name === 'MulterError' || error.code?.startsWith('LIMIT_')) {
      statusCode = 400;
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  // Response output logic remains standard...
};
```

---

### 6. Missing Organiser Team Input Validation
* **Severity:** 🟡 Medium
* **Files Affected:**
  * [src/routes/organiser.routes.js](file:///d:/Enginow/events.enginow/backend/src/routes/organiser.routes.js#L12)
* **The Problem:**
  The route `POST /api/organisers` registers new organiser teams directly by mapping request bodies to mongoose creators without any schema validation middleware. Omitted fields, invalid URLs, or malformed email parameters are not intercepted until Mongoose database validation is triggered.
* **Proposed Solution:**
  Add a validation schema file `src/validators/organiser.validator.js` and use it on the route:

```javascript
// src/validators/organiser.validator.js
import { z } from 'zod';

export const createOrganiserTeamSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Team name is required' }).min(3).max(100),
    email: z.string({ required_error: 'Contact email is required' }).email(),
    website: z.string().url().or(z.literal('')).optional(),
  }),
});
```

---

### 7. Submission Database Consistency & Missing Transactions
* **Severity:** 🔴 High
* **Files Affected:**
  * [src/services/submission.service.js](file:///d:/Enginow/events.enginow/backend/src/services/submission.service.js#L7-L46)
* **The Problem:**
  In `createSubmission`, a project submission is created and the event's `submissionCount` is updated. However, this is not wrapped inside a database transaction session. If updating the event fails (due to locks or schema validations), the submission will be persisted in MongoDB but the counts will be permanently out of sync.
* **Proposed Solution:**
  Use the transaction utility `runWithTransaction` to wrap the submission creation logic:

```javascript
// src/services/submission.service.js
export const createSubmission = async (eventId, userId, submissionData) => {
  return await runWithTransaction(async (session) => {
    const opts = session ? { session } : {};

    const event = await Event.findById(eventId).session(session);
    if (!event) throw new ApiError(404, 'Event not found');

    const isRegistered = await Registration.exists({
      user: userId,
      event: eventId,
      status: 'registered',
    });
    if (!isRegistered) throw new ApiError(400, 'You must be registered to submit');

    const existingSubmission = await Submission.findOne({ event: eventId, submittedBy: userId }).session(session);
    if (existingSubmission) throw new ApiError(400, 'Already submitted');

    const submission = await Submission.create([{
      event: eventId,
      submittedBy: userId,
      ...submissionData,
    }], opts);

    event.submissionCount = (event.submissionCount || 0) + 1;
    await event.save(opts);

    return submission[0];
  });
};
```

---

### 8. Architectural Optimization: Repetitive Database Lookups on Auth Middleware
* **Severity:** 🟡 Medium (Performance Optimisation)
* **Files Affected:**
  * [src/middleware/auth.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/auth.middleware.js#L22)
* **The Problem:**
  On *every single protected request*, the `protect` middleware makes a database call:
  `User.findById(decoded.id).select('-passwordHash -refreshTokens')`
  For API actions that do not require full profiles (e.g. checking user roles or token validation), this creates unnecessary database load and query bottlenecks under scale.
* **Proposed Solution:**
  Include core claims in the signed Access Token JWT (such as `role` and `status`) so the middleware can authorize the request based on token properties alone, querying the database only for user mutating operations or high-security actions.

---

### 9. Lack of Real Email Delivery Service Integration
* **Severity:** 🟢 Low (Extensibility)
* **Files Affected:**
  * [src/services/auth.service.js](file:///d:/Enginow/events.enginow/backend/src/services/auth.service.js#L252)
* **The Problem:**
  The `forgotPassword` service logs reset URLs to the console. While sufficient for development, it requires refactoring before staging or production environments can be deployed.
* **Proposed Solution:**
  Introduce an abstract email helper (e.g. `src/utils/email.js`) configured via NodeMailer or SendGrid. In development, it can fall back to console logging or Ethereal Email, making the production transition seamless.

---

## 📈 Summary Table of Improvements

| # | Improvement Area | Target Component / File | Severity | Impact of Fix |
|---|------------------|-------------------------|----------|---------------|
| 1 | Central Environment Schema | `src/config/env.js` | 🔴 High | Prevents runtime crashes from configuration mismatch. |
| 2 | Zod Middleware Result Assignment | `src/middleware/validate.middleware.js` | 🔴 High | Correctly applies defaults and sanitizes schema inputs. |
| 3 | Serve local uploads statically | `src/app.js` & `upload.controller.js` | 🔴 High | Resolves image loading `404` errors in local development. |
| 4 | DB Transaction on Submissions | `src/services/submission.service.js` | 🔴 High | Guarantees atomic writes, keeping metrics in sync. |
| 5 | DB Exception Normalization | `src/middleware/error.middleware.js` | 🔴 High | Protects internal data schemas and formats API errors neatly. |
| 6 | Organiser validation schema | `src/routes/organiser.routes.js` | 🟡 Medium | Validates fields on team registration before DB writes. |
| 7 | Dynamic token expirations | `src/services/auth.service.js` | 🟡 Medium | Synchronizes database state with environment token limits. |
| 8 | Optimize auth middleware lookups | `src/middleware/auth.middleware.js` | 🟡 Medium | Drastically reduces database load on read-heavy routes. |
| 9 | Add NodeMailer email utility | `src/utils/email.js` | 🟢 Low | Enables actual password reset emails to be sent. |
