# EngiNow Events Platform Backend

This is the production-ready, highly secure, and optimized Express.js backend for the **EngiNow Events Platform**, designed for discovering and managing hackathons, workshops, and webinars for engineering students.

---

## 🚀 Refactoring & Production Hardening Features

The backend has been completely refactored and hardened for production deployment:
1. **Centralized Zod Environment Validation**: All configuration values are validated on startup in [env.js](file:///d:/Enginow/events.enginow/backend/src/config/env.js). Raw `process.env` calls are removed. Includes full support for MongoDB Atlas connection strings.
2. **Standardized Input Validation**: Custom [validate.middleware.js](file:///d:/Enginow/events.enginow/backend/src/middleware/validate.middleware.js) parses, coerces, and writes Zod schema outputs (with defaults) back to request bodies (`req.body`, `req.query`, `req.params`).
3. **Upgraded Global Error Handler**: Catching and normalising database exceptions (CastErrors as `400`, unique index code `11000` as `409`, Mongoose validation errors as standard `{ field, message }` arrays), JWT errors, and Multer errors cleanly. Internal traces are masked in production.
4. **Consistency Transactions**: Database writes for registrations, cancellations, and submissions are executed inside ACID MongoDB transactions using [runWithTransaction](file:///d:/Enginow/events.enginow/backend/src/utils/transaction.js) to avoid data drift.
5. **Static serving & Normalized Paths**: Serving local disk uploads in development statically via Express on `/uploads` and normalizing Windows path backslashes. Production uses Cloudinary storage.
6. **Production Security**: Responses are compressed with `gzip`, reverse proxies are trusted, requests are logged using `morgan`, and strict rate limit boundaries are enforced on sensitive authentication endpoints.
7. **Database Optimizations**: Avoided full database user lookups on authentication check middleware using specific field projection (`.select()`) and light plain object formatting (`.lean()`).
8. **Lifecycle & Monitoring**: Added a `/health` probe endpoint and implemented graceful shutdown hooks to safely close HTTP and MongoDB connections on process termination.

---

## Architecture

The project follows a clean service-oriented layered structure:
- **Models**: Mongoose schemas defining data validation, pre-save hooks (password hashing), and performance indexes.
- **Services**: Business logic encapsulation, transaction bounds, and database operations.
- **Controllers**: Thin controllers handling request validation, routing orchestration, and response dispatching.
- **Routes**: API endpoint maps divided by business contexts.
- **Middleware**: Global error handling, authentication, roles verification, body validation, and file uploads.
- **Validators**: Schema validation using Zod.

---

## Directory Structure

```
backend/
├── src/
│   ├── config/                # Mongoose database & Cloudinary integrations
│   ├── constants/             # Centralized system enums (ROLES, STATUS, etc.)
│   ├── controllers/           # Slim Express controllers
│   ├── models/                # MongoDB Mongoose models (User, Event, OrganiserTeam, Submission)
│   ├── services/              # Encapsulated business logic layer
│   ├── routes/                # Express routing definitions (Auth, Event, Admin, User, Upload)
│   ├── middleware/            # Error, Auth, Role, Zod, and Multer file upload middlewares
│   ├── validators/            # Request payloads validation schemas using Zod
│   ├── utils/                 # Utility files (ApiError, asyncHandler, token, transaction)
│   ├── app.js                 # Express Application configurations, security settings & health check
│   └── server.js              # Server entry point, DB connection init & graceful shutdown hooks
├── .env.example               # Example configurations template
├── .env                       # Local configurations (keep git-ignored)
├── test-db.js                 # Direct Mongoose schema & transaction validation script
├── test-auth.js               # Phase 2 Authentication & Security test runner
├── test-upload.js             # Upload validation & size limitation test runner
└── package.json               # Package config & dependency list
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally or a MongoDB Atlas URI

### Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Configuration
1. Copy the `.env.example` file to create a `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Configure the following variables in `.env`:
   - `PORT`: Server port (default: `5000`)
   - `NODE_ENV`: Runtime mode (`development`, `production`, `test`)
   - `MONGO_URI`: MongoDB Atlas or local connection string
   - `ACCESS_TOKEN_SECRET`: At least 16-character string for signing short-lived tokens
   - `REFRESH_TOKEN_SECRET`: At least 16-character string for signing long-lived tokens
   - `ACCESS_TOKEN_EXPIRE`: Token expiration (default: `15m`)
   - `REFRESH_TOKEN_EXPIRE`: Session expiration (default: `7d`)
   - `FRONTEND_URL`: Allowed CORS origin constraint matching your frontend client
   - `CLOUDINARY_NAME`: Cloudinary account name (optional in dev)
   - `CLOUDINARY_API_KEY`: Cloudinary API key (optional in dev)
   - `CLOUDINARY_SECRET`: Cloudinary secret (optional in dev)

---

## Available Scripts

### Development
Starts the server locally using `nodemon` for hot reloading:
```bash
npm run dev
```

### Production
Starts the server using standard node execution:
```bash
npm start
```

### Direct Verification Tests
We have built three specialized local test suites to verify backend features:
- **Database & Transactions**: `node test-db.js`
- **Authentication & Security**: `node test-auth.js`
- **Uploads Validation**: `node test-upload.js`

---

## API Endpoints List

### 0. Health probe
- `GET /health`: Returns application status, database connectivity, and uptime.

### 1. Authentication APIs (`/api/auth`)
- `POST /register`: Registers a new user (Participant, Organiser).
- `POST /login`: Authenticates credentials, sets HttpOnly refresh cookie, and returns access token.
- `POST /refresh`: Rotates refresh token cookie and provides a new access token.
- `POST /logout`: Revokes the current refresh token session.
- `POST /logout-all`: Revokes all refresh token sessions across all devices.
- `GET /me`: Returns profile details of the current user.
- `PUT /me`: Updates profile details (name, bio, avatar, organization).
- `PUT /change-password`: Changes user password and revokes all other sessions.
- `POST /forgot-password`: Generates reset token.
- `POST /reset-password/:token`: Sets a new password using reset token.

### 2. Event APIs (`/api/events`)
- `GET /`: Lists all approved events with pagination, full text search, and filters.
- `GET /:id`: Retrieves detailed event profile.
- `POST /`: Creates a new event in `draft` state (Organiser only).
- `PUT /:id`: Edits event details (Owner organiser only).
- `PATCH /:id/submit`: Submits event draft for admin review (`draft` -> `pending`).
- `PATCH /:id/archive`: Archives the event (`status` -> `archived`).
- `DELETE /:id`: Deletes event draft (Owner organiser only).
- `POST /:id/register`: Registers a participant to the event (ACID Transaction, Participant only).
- `DELETE /:id/register`: Cancels event registration (ACID Transaction, Participant only).
- `GET /:id/registrations`: Retrieves registered users list (Owner organiser/Admin only).
- `POST /:id/submissions`: Submits project for the event (ACID Transaction, Participant only).
- `GET /:id/submissions`: Retrieves project submissions list (Owner organiser/Admin only).

### 3. User APIs (`/api/users`)
- `GET /me/events`: Returns events registered by the current participant.
- `GET /me/submissions`: Returns submissions created by the current participant.

### 4. Organiser APIs (`/api/organisers`)
- `POST /`: Submits a request to create or join an OrganiserTeam (Validated).
- `GET /my-team`: Retrieves team details and events managed.

### 5. Admin APIs (`/api/admin`)
- `GET /users`: Lists all users.
- `PATCH /users/:id`: Updates user role and status (active, suspended).
- `GET /events/pending`: Retrieves events awaiting admin approval.
- `PATCH /events/:id/approve`: Approves event (`pending` -> `approved`).
- `PATCH /events/:id/reject`: Rejects event (`pending` -> `rejected`) with feedback.
- `GET /organisers`: Lists all OrganiserTeams.
- `PATCH /organisers/:id/verify`: Approves and verifies an organiser team, promoting members to `organiser` role.

