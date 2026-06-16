<div align="center">

# EngiNow — Events Platform

**The central hub for engineering students to discover, host, and manage hackathons, coding contests, workshops, and career-building events.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](#) · [Report Bug](https://github.com/enginow-in/events.enginow/issues) · [Request Feature](https://github.com/enginow-in/events.enginow/issues)

</div>

---

## 🧭 Overview

Engineering and technology students across India face a fragmented landscape when searching for hackathons, coding competitions, technical workshops, and career events. Information is scattered across college WhatsApp groups, random social media posts, and disjointed listing sites — leading to missed deadlines and undiscovered opportunities.

**EngiNow Events** solves this by providing a single, curated platform where:

- **Students** discover and register for relevant events with full transparency on rules, schedules, prizes, and judging criteria.
- **Organisers** create, manage, and track events through a guided multi-step workflow with built-in analytics and operational tools.
- **Administrators** maintain platform quality through event approval queues, user management, and organiser verification.

### Who is this for?

| Audience | Use Case |
|---|---|
| **College students** | Browse hackathons, filter by mode/track, view event details, and register |
| **Event organisers** | Create event listings with a structured 7-step form, track registrations and submissions |
| **Community leads** | Host workshops, demo nights, and meetups with professional event pages |
| **Platform admins** | Approve/reject events, manage users, verify organiser teams |

---

## ✨ Key Features

### 🎓 For Students & Participants

| Feature | Description |
|---|---|
| **Event Discovery** | Browse curated listings of workshops, demo nights, and builder meetups with search, sort, and filtering |
| **Hackathon Explorer** | Dedicated hackathon section with team-size and mode filters, live stats on open hackathons and project counts |
| **Rich Event Details** | Full event pages with cover banners, schedules, rules, prizes, judging criteria, and organiser contact info |
| **Resource Guides** | Submission checklists, judging rubrics, and organiser playbooks to help participants prepare |
| **Category Browsing** | Explore events by type — hackathons, workshops, webinars, competitions, and internships |
| **Contact & Support** | Direct contact form with topic selection for participant support, sponsorship, and judging inquiries |

### 🛠 For Organisers

| Feature | Description |
|---|---|
| **Organiser Dashboard** | Central workspace with live event metrics (registrations, submissions, judges), upcoming deadlines sidebar, and operations checklist |
| **7-Step Event Creation** | Guided wizard: Basic Info → Event Details → Content & Rules → Schedule & FAQs → Media & Links → Organiser Contact → Preview & Submit |
| **Event Editor** | Tabbed editing interface with profile completion tracker, save/archive controls, and status badges |
| **Event Health Scoring** | Automatic readiness assessment based on field completion, registration activity, and judge assignment |
| **Status Lifecycle** | Events progress through `Draft → Pending → Approved → Archived` (or `Rejected` with admin feedback) |
| **Local Persistence** | Event data persisted via localStorage for offline-capable prototyping before backend integration |

### 🔐 For Administrators

| Feature | Description |
|---|---|
| **User Management** | View active users, invitations, and suspended accounts with tabular admin controls |
| **Organiser Verification** | Review organiser teams, verify credentials, track events managed per team |
| **Platform Statistics** | Dashboard-level stats for verified teams, pending reviews, and total events managed |

### 🎨 Design & Experience

| Feature | Description |
|---|---|
| **Premium Homepage** | Hero section with gradient mesh backgrounds, animated statistics, partner logo strip, feature showcase, testimonials, and CTA sections |
| **Interactive 3D Asset** | Spline-powered 3D robot on authentication pages with lazy loading and fallback states |
| **Responsive Navigation** | Unified global navbar with scroll-aware styling, dropdown dashboard menu, and mobile slide-out drawer |
| **Micro-animations** | Framer Motion transitions throughout — page elements, dropdowns, mobile menus, and scroll-to-top |
| **Custom Design System** | Extended Tailwind config with curated color palette, Outfit + Inter typography, and floating keyframe animations |

---

## 🏗 Tech Stack

| Category | Technology |
|---|---|
| **UI Framework** | React 18.3 (JavaScript, no TypeScript) |
| **Build Tool** | Vite 5.2 with `@vitejs/plugin-react` |
| **Styling** | Tailwind CSS 3.4 with custom design tokens |
| **Routing** | React Router v6 (client-side SPA) |
| **Animation** | Framer Motion 12.x |
| **3D Graphics** | Spline (`@splinetool/react-spline`) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios (configured, pending backend) |
| **Utilities** | clsx, tailwind-merge |
| **Particles** | tsparticles (React + Slim) |
| **CSS Processing** | PostCSS + Autoprefixer |
| **Fonts** | Google Fonts — Inter, Outfit |
| **Package Manager** | npm |

---

## 📐 Architecture

### High-Level Overview

```
┌────────────────────────────────────────────────────┐
│                    Browser (SPA)                   │
├────────────────────────────────────────────────────┤
│   React Router v6 → MainLayout → Route Matching   │
│   ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│   │  Public   │  │ Organiser│  │     Admin     │   │
│   │  Pages    │  │  Pages   │  │    Pages      │   │
│   └────┬─────┘  └────┬─────┘  └──────┬────────┘   │
│        └──────────────┼───────────────┘            │
│               Shared Components                    │
│         (Navbar, Footer, Cards, Badges)            │
├────────────────────────────────────────────────────┤
│  Context (AuthContext) │ Hooks (useEvents, useAuth)│
├────────────────────────────────────────────────────┤
│         Services (api.js) → Backend API            │
│              [Fully Implemented & Verified]        │
└────────────────────────────────────────────────────┘
```

The frontend operates as a single-page application integrated with a production-ready Express + MongoDB backend. Core operations (events querying, registrations, and project submissions) are powered by transactional database writes.

### Data Flow

1. **State Management**: React hooks + context. `useEvents` manages CRUD operations, metrics aggregation, and localStorage persistence.
2. **Routing**: `App.jsx` renders a `MainLayout` component that injects a global `Navbar` and conditionally applies background classes based on the current route.
3. **Role Separation**: Routes are logically grouped by role (`/organiser/*`, `/admin/*`, `/login`, `/signup`). `ProtectedRoute` guards routes based on JWT claims validated by the server.


---

## 📁 Project Structure

```
events.enginow/
│
├── frontend/                          # React SPA (primary codebase)
│   ├── public/                        # Static assets served by Vite
│   ├── src/
│   │   ├── assets/                    # Logo, favicon images
│   │   │   ├── enginow-logo.png
│   │   │   └── enginow_icon.png       # Browser tab favicon
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Global premium navigation bar
│   │   │   │
│   │   │   ├── common/                # Shared reusable components
│   │   │   │   ├── EventCard.jsx      # Public event listing card
│   │   │   │   ├── HackathonCard.jsx  # Hackathon listing card
│   │   │   │   ├── StatusBadge.jsx    # Color-coded status indicator
│   │   │   │   ├── Footer.jsx         # Global site footer
│   │   │   │   ├── ProtectedRoute.jsx # Auth guard (scaffolded)
│   │   │   │   └── LoadingSpinner.jsx # Loading state indicator
│   │   │   │
│   │   │   ├── home/                  # Homepage section components
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── PartnersStrip.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── CategoriesSection.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   ├── OrganiserSection.jsx
│   │   │   │   ├── WorkflowSection.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   └── CTASection.jsx
│   │   │   │
│   │   │   ├── events/                # Event listing components
│   │   │   │   ├── EventFilters.jsx
│   │   │   │   ├── EventGrid.jsx
│   │   │   │   └── FeaturedStrip.jsx
│   │   │   │
│   │   │   ├── hackathons/            # Hackathon listing components
│   │   │   │   ├── HackathonFilters.jsx
│   │   │   │   └── HackathonGrid.jsx
│   │   │   │
│   │   │   ├── organiser/             # Organiser management components
│   │   │   │   ├── EventStatusList.jsx
│   │   │   │   └── StepForm/          # 7-step event creation wizard
│   │   │   │       ├── StepWrapper.jsx
│   │   │   │       ├── Step1BasicInfo.jsx
│   │   │   │       ├── Step2EventDetails.jsx
│   │   │   │       ├── Step3Content.jsx
│   │   │   │       ├── Step4Schedule.jsx
│   │   │   │       ├── Step5Media.jsx
│   │   │   │       ├── Step6OrgContact.jsx
│   │   │   │       └── Step7Preview.jsx
│   │   │   │
│   │   │   ├── admin/                 # Admin panel components
│   │   │   │   ├── UserTable.jsx
│   │   │   │   ├── OrganiserTable.jsx
│   │   │   │   └── PendingEventCard.jsx
│   │   │   │
│   │   │   └── ui/                    # Primitives & visual components
│   │   │       ├── interactive-3d-robot.jsx
│   │   │       ├── card.jsx
│   │   │       ├── demo.jsx
│   │   │       ├── InfiniteSlider.jsx
│   │   │       ├── ProgressiveBlur.jsx
│   │   │       └── Sparkles.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Landing page orchestrator
│   │   │   ├── public/                # Public-facing pages
│   │   │   │   ├── EventsPage.jsx
│   │   │   │   ├── EventDetailPage.jsx
│   │   │   │   ├── HackathonsPage.jsx
│   │   │   │   ├── ResourcesPage.jsx
│   │   │   │   └── ContactPage.jsx
│   │   │   ├── auth/                  # Authentication pages
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── SignupPage.jsx
│   │   │   ├── user/                  # Participant pages
│   │   │   │   └── UserDashboard.jsx
│   │   │   ├── organiser/             # Organiser pages
│   │   │   │   ├── OrganiserDashboard.jsx
│   │   │   │   ├── CreateEventPage.jsx
│   │   │   │   └── EditEventPage.jsx
│   │   │   └── admin/                 # Admin pages
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── PendingQueuePage.jsx
│   │   │       ├── UserManagementPage.jsx
│   │   │       └── OrganiserManagementPage.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state (scaffolded)
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # Auth hook (scaffolded)
│   │   │   └── useEvents.js           # Event CRUD + localStorage persistence
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance (scaffolded)
│   │   ├── utils/
│   │   │   ├── cn.js                  # clsx + tailwind-merge utility
│   │   │   └── roleRedirect.js        # Role-based redirect logic (scaffolded)
│   │   │
│   │   ├── App.jsx                    # Route definitions + global layout
│   │   ├── main.jsx                   # React DOM entry point
│   │   └── index.css                  # Tailwind directives + global styles
│   │
│   ├── index.html                     # HTML entry with meta tags, fonts, favicon
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js             # Extended design system tokens
│   └── postcss.config.js
│
├── backend/                           # REST API (planned — see Roadmap)
│   └── README.md
│
├── database/                          # Database schemas (planned — see Roadmap)
│   └── README.md
│
└── README.md                          # ← You are here
```

---

## 📸 Screenshots

> Screenshots will be added as the platform progresses through visual QA. Placeholder sections below indicate planned captures.

| Page | Description |
|---|---|
| **Homepage** | Hero with gradient mesh, partner strip, feature cards, testimonials |
| **Events Listing** | Search/filter interface with neobrutalist event cards |
| **Event Detail** | Full-page event view with banner, rules, prizes, and contact |
| **Hackathons** | Dedicated hackathon explorer with live stats counters |
| **Login / Signup** | Split-pane layout with 3D Spline robot and premium form |
| **Organiser Dashboard** | Dark hero card, metric grid, event list with health scores |
| **Create Event** | 7-step wizard with progress indicators |
| **Admin Panel** | User management tables and organiser verification |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/enginow-in/events.enginow.git
cd events.enginow

# 2. Navigate to the frontend
cd frontend

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env
# Edit .env with your configuration (see Environment Variables below)

# 5. Start the development server
npm run dev
```

The app will open at **http://localhost:3000**.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR on port 3000 |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Base URL for the backend REST API | Yes |
| `VITE_SPLINE_SCENE` | Spline 3D scene URL for auth pages | No (has default) |

> **Note**: The backend is now fully live and connected. Make sure to configure `VITE_API_URL` to point to the backend REST API (e.g. `http://localhost:5000/api`) to load and persist live database records.


---

## 👥 User Roles & Permissions

| Role | Access Level | Key Features |
|---|---|---|
| **Visitor** (Unauthenticated) | Public pages only | Browse events, hackathons, resources; view event details; access contact form |
| **Participant** | Public + User Dashboard | Everything visitors can do, plus: enrolled events, saved events, profile settings |
| **Organiser** | Public + Organiser Suite | Create events via 7-step wizard, manage event lifecycle, track registrations/submissions/judges, view analytics |
| **Admin** | Full platform access | Approve/reject events, manage all users, verify organiser teams, platform-wide statistics |

---

## 🔄 Application Routes

### Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero, partners, features, how it works, categories, testimonials, CTA |
| `/events` | Events Listing | Featured strip + searchable/filterable event grid |
| `/events/:eventId` | Event Detail | Full event page with banner, overview, rules, prizes, contact |
| `/hackathons` | Hackathons | Dedicated hackathon listing with live stats and filters |
| `/resources` | Resources | Submission checklists, judging rubrics, organiser playbooks |
| `/contact` | Contact | Contact form with topic selector and support info |
| `/login` | Login | Split-pane authentication with 3D robot asset |
| `/signup` | Sign Up | Registration with role selection (Participant / Organiser) |

### Authenticated Routes

| Route | Role | Page |
|---|---|---|
| `/organiser` | Organiser | Events Dashboard — metrics, event list, deadlines, checklist |
| `/organiser/events/new` | Organiser | 7-step event creation wizard |
| `/organiser/events/:eventId/edit` | Organiser | Tabbed event editor with completion tracker |
| `/admin/users` | Admin | User management table |
| `/admin/organisers` | Admin | Organiser team verification |

---

## 🔁 Event Lifecycle

Events follow a structured status progression. The frontend renders each state with distinct visual treatments.

```
                    ┌──────────┐
                    │  Draft   │
                    └────┬─────┘
                         │  Organiser submits
                         ▼
                    ┌──────────┐
                    │ Pending  │
                    └────┬─────┘
                    ┌────┴─────┐
                    ▼          ▼
              ┌──────────┐ ┌──────────┐
              │ Approved │ │ Rejected │
              └────┬─────┘ └──────────┘
                   │         (visible to organiser
                   │          with admin's reason)
                   ▼
              ┌──────────┐
              │ Archived │
              └──────────┘
```

| Status | Public Visibility | Organiser View | Admin View |
|---|:---:|:---:|:---:|
| **Draft** | ✗ | ✓ Editable | ✗ |
| **Pending** | ✗ | ✓ With badge | ✓ In review queue |
| **Approved** | ✓ Listed | ✓ With metrics | ✓ |
| **Rejected** | ✗ | ✓ With reason note | ✓ |
| **Archived** | ✗ | ✓ Read-only | ✓ |

---

## 🗺 Roadmap

### Phase 1 — Frontend (✅ Current)

- [x] Premium responsive homepage with 9 content sections
- [x] Event and hackathon discovery with search, sort, and filter
- [x] Rich event detail pages with full information architecture
- [x] 7-step guided event creation wizard for organisers
- [x] Organiser dashboard with metrics, deadlines, and operations checklist
- [x] Admin panels for user and organiser management
- [x] Split-pane authentication pages with interactive 3D Spline asset
- [x] Global responsive navigation with scroll-aware styling
- [x] Role-based route scaffolding with `ProtectedRoute`

### Phase 2 — Backend API (✅ Current)

- [x] Node.js + Express REST API server
- [x] JWT-based authentication and session management (Refresh Token Rotation + evictions)
- [x] Role-based middleware (participant, organiser, admin)
- [x] Event CRUD endpoints with status transitions
- [x] Event approval/rejection workflow with admin notes
- [x] User registration, login, and profile management
- [x] File upload support with Cloudinary / local fallback disk storage
- [x] Search, pagination, and sorting for event listings
- [x] Rate limiting, strict CORS, and Zod input validation
- [x] Production optimizations (gzip compression, morgan logging, health checks, graceful shutdowns)

### Phase 3 — Database & Transactions (✅ Current)

- [x] MongoDB Atlas schema design (User, Event, OrganiserTeam, Submission, Registration, Upload models)
- [x] Indexing strategy for full-text search performance
- [x] ACID database transaction support for submissions, registrations, and cancellations

### Phase 4 — Advanced Features (🔮 Future)

- [ ] AI-powered event recommendations based on user interests and history
- [ ] Real-time notification system (email + in-app) for deadlines and updates
- [ ] Advanced analytics dashboard for organisers (registration funnels, geographic distribution)
- [ ] Team formation and matching system for hackathons
- [ ] Integrated judging portal with scoring rubrics
- [ ] Calendar sync (Google Calendar, iCal export)
- [ ] Mobile-responsive PWA with offline support
- [ ] Social sharing and event bookmarking
- [ ] Organiser reputation and rating system
- [ ] Webhook integrations (Slack, Discord notifications)

---

## 🗄 Backend Architecture

> This section outlines the fully-implemented and production-hardened backend and database design powering the platform.


### API Endpoints

#### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create new user account | Public |
| `POST` | `/api/auth/login` | Authenticate and receive JWT | Public |
| `POST` | `/api/auth/logout` | Invalidate session | Authenticated |
| `GET` | `/api/auth/me` | Get current user profile | Authenticated |
| `PUT` | `/api/auth/me` | Update profile | Authenticated |

#### Events

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/events` | List approved events (paginated, filterable) | Public |
| `GET` | `/api/events/:id` | Get event details | Public |
| `POST` | `/api/events` | Create new event (status: draft) | Organiser |
| `PUT` | `/api/events/:id` | Update event details | Organiser (owner) |
| `PATCH` | `/api/events/:id/submit` | Submit event for review (draft → pending) | Organiser (owner) |
| `PATCH` | `/api/events/:id/approve` | Approve event (pending → approved) | Admin |
| `PATCH` | `/api/events/:id/reject` | Reject event with reason (pending → rejected) | Admin |
| `PATCH` | `/api/events/:id/archive` | Archive event | Organiser (owner) / Admin |
| `DELETE` | `/api/events/:id` | Delete draft event | Organiser (owner) |

#### Registrations

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/events/:id/register` | Register for an event | Participant |
| `DELETE` | `/api/events/:id/register` | Cancel registration | Participant |
| `GET` | `/api/events/:id/registrations` | List registrations | Organiser (owner) / Admin |

#### Admin

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all users | Admin |
| `PATCH` | `/api/admin/users/:id` | Update user role or status | Admin |
| `GET` | `/api/admin/organisers` | List organiser teams | Admin |
| `PATCH` | `/api/admin/organisers/:id/verify` | Verify organiser team | Admin |
| `GET` | `/api/admin/events/pending` | List events awaiting review | Admin |
| `GET` | `/api/admin/stats` | Platform-wide statistics | Admin |

### Database Schema (Planned)

#### Users Collection

```
users {
  _id              ObjectId
  name             String       (required)
  email            String       (required, unique, indexed)
  passwordHash     String       (required)
  role             Enum         ["participant", "organiser", "admin"]
  status           Enum         ["active", "invited", "suspended"]
  avatar           String       (URL)
  bio              String
  organization     String
  registeredEvents [ObjectId]   → events
  createdAt        Date
  updatedAt        Date
}
```

#### Events Collection

```
events {
  _id                  ObjectId
  title                String       (required, indexed)
  tagline              String
  type                 Enum         ["Hackathon", "Workshop", "Webinar", "Competition", "Event"]
  status               Enum         ["draft", "pending", "approved", "rejected", "archived"]
  visibility           Enum         ["public", "private"]
  mode                 Enum         ["Online", "In-person", "Hybrid"]
  location             String
  venue                String
  city                 String       (indexed)
  country              String
  startDate            Date         (indexed)
  endDate              Date
  registrationDeadline Date
  submissionStart      Date
  submissionDeadline   Date
  judgingStart          Date
  judgingEnd            Date
  winnerAnnouncement   Date
  track                String
  prizePool            String
  teamSize             String
  eligibility          String
  description          String       (required)
  rules                String
  judgingCriteria       String
  resources            String
  coverImage           String       (URL)
  websiteUrl           String
  communityUrl         String
  sponsorLogos         String
  contactName          String
  contactEmail         String
  organiser            ObjectId     → users (required)
  organiserName        String
  organiserWebsite     String
  rejectionReason      String       (set by admin on rejection)
  registrations        [ObjectId]   → users
  registrationCount    Number       (denormalized)
  submissionCount      Number       (denormalized)
  judgeCount           Number       (denormalized)
  createdAt            Date
  updatedAt            Date
}
```

#### Organiser Teams Collection

```
organiserTeams {
  _id            ObjectId
  name           String       (required)
  email          String       (required)
  website        String
  members        [ObjectId]   → users
  status         Enum         ["pending", "verified", "revoked"]
  eventsManaged  Number       (denormalized)
  verifiedAt     Date
  verifiedBy     ObjectId     → users (admin)
  createdAt      Date
  updatedAt      Date
}
```

### Recommended Backend Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Runtime** | Node.js 20 LTS | JavaScript ecosystem consistency with frontend |
| **Framework** | Express.js | Lightweight, widely adopted, flexible middleware |
| **Database** | MongoDB + Mongoose | Flexible schema for evolving event data models |
| **Authentication** | JWT (jsonwebtoken + bcrypt) | Stateless auth matching the SPA architecture |
| **Validation** | Joi or Zod | Request body/param validation |
| **File Storage** | Cloudinary or AWS S3 | Event banner and media uploads |
| **Email** | Nodemailer + SendGrid | Transactional emails (registration confirmation, approval notices) |
| **Deployment** | Vercel (frontend) + Railway/Render (backend) | Managed hosting with auto-deploy from GitHub |

---

## 🤝 Contributing

Contributions are welcome and appreciated. Here's how to get started:

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the project's code conventions
5. **Test** your changes locally with `npm run dev` and `npm run build`
6. **Commit** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add event bookmark functionality"
   ```
7. **Push** to your fork and open a **Pull Request** against `main`

### Code Conventions

- **Components**: PascalCase filenames, one component per file
- **Pages**: Organized by role (`public/`, `auth/`, `organiser/`, `admin/`)
- **Styling**: Tailwind CSS utility classes; extend `tailwind.config.js` for new design tokens
- **State**: React hooks + context; no external state management libraries
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`)

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `aditya-core` | Core platform features and homepage |
| `riya-public-pages` | Public-facing pages and admin UI |
| `feature/*` | Individual feature development |

---

## 👏 Team

Built by **Team 3** during the HP × EngiNow Internship 2025.

| Contributor | Role |
|---|---|
| **Aditya Pharande** | Core architecture, homepage, navigation, authentication UI |
| **Akarshak** | Frontend infrastructure, component development |
| **Riya Mishra** | Public pages, admin management UI |

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for engineering students, by engineering students.**

Made with ❤️ in India

[⬆ Back to Top](#enginow--events-platform)

</div>
