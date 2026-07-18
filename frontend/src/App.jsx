import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  Link,
} from 'react-router-dom';
import { ShieldX } from 'lucide-react';

import Navbar from './components/Navbar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

import HomePage from './pages/HomePage';
import Footer from './components/common/Footer';

import OrganiserManagementPage from './pages/admin/OrganiserManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import BlogManagementPage from './pages/admin/BlogManagementPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventManagementPage from './pages/admin/EventManagementPage';

import OrganiserBlogPage from './pages/organiser/OrganiserBlogPage';
import CreateEventPage from './pages/organiser/CreateEventPage';
import EditEventPage from './pages/organiser/EditEventPage';
import EventRegistrationsPage from './pages/organiser/EventRegistrationsPage';
import OrganiserDashboard from './pages/organiser/OrganiserDashboard';

import UserDashboard from './pages/user/UserDashboard';

import ContactPage from './pages/public/ContactPage';
import EventDetailPage from './pages/public/EventDetailPage';
import EventsPage from './pages/public/EventsPage';
import HackathonsPage from './pages/public/HackathonsPage';
import ResourcesPage from './pages/public/ResourcesPage';
import AboutCompanyPage from './pages/public/AboutCompanyPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import BlogsPage from './pages/public/BlogsPage';
import InfoPage from './pages/public/InfoPage';
import SuccessStoriesPage from './pages/public/SuccessStoriesPage';

import AuthPage from './pages/auth/AuthPage';
import AccountSettings from './pages/settings/AccountSettings';
import ProfilePage from './pages/profile/ProfilePage';

function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm shadow-red-100">
        <ShieldX className="h-8 w-8" />
      </div>

      <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-900">
        403 - Access Denied
      </h1>

      <p className="mt-2 max-w-md text-slate-500">
        You do not have the required permissions to view this page.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700"
      >
        Return Home
      </Link>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const { theme } = useTheme();

  const isHomePage = location.pathname === '/';
  const isAuthPage =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/signup');

  const isPanelPage =
    location.pathname.startsWith('/organiser') ||
    location.pathname.startsWith('/admin');

  let bgClass = 'bg-white';

  if (!isHomePage) {
    if (isAuthPage) bgClass = 'bg-white';
    else if (isPanelPage) bgClass = 'bg-slate-50';
    else bgClass = 'bg-[#f4f1e8]';
  }

  const showNavbar = !isAuthPage;
  const showFooter = !isAuthPage && !isPanelPage;

  // Main fix: apply top spacing to ALL pages under navbar except auth and homepage
  const mainTopPadding = (isAuthPage || isHomePage) ? '' : 'pt-24 md:pt-28';

  return (
    <div
      className={`min-h-screen ${bgClass} text-slate-800 font-sans flex flex-col transition-colors duration-300`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
      }}
    >
      {showNavbar && <Navbar />}

      <main className={`flex-grow ${mainTopPadding}`}>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Authentication */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Public Pages */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/hackathons" element={<HackathonsPage />} />
          <Route path="/hackathons/:eventId" element={<EventDetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />
          <Route path="/about" element={<AboutCompanyPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/terms" element={<InfoPage pageKey="terms" />} />
          <Route path="/privacy" element={<InfoPage pageKey="privacy" />} />
          <Route path="/refund" element={<InfoPage pageKey="refund" />} />
          <Route path="/faqs" element={<InfoPage pageKey="faqs" />} />
          <Route path="/help" element={<InfoPage pageKey="help" />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Participant Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['participant', 'user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Organiser */}
          <Route
            path="/organiser"
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <OrganiserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/events/new"
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/events/:eventId/edit"
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/events/:eventId/registrations"
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <EventRegistrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/blogs"
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <OrganiserBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organiser/dashboard"
            element={
              <ProtectedRoute allowedRoles={['organiser', 'admin']}>
                <OrganiserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organisers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrganiserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BlogManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventManagementPage />
              </ProtectedRoute>
            }
          />

          {/* General Profile & Settings */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/account"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />

          {/* Forbidden */}
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <MainLayout />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
