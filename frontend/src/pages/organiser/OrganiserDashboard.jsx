import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  Headphones,
  Mail,
  BookOpen,
  Zap,
} from 'lucide-react';
import EventStatusList from '../../components/organiser/EventStatusList';
import useEvents from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { showError, showSuccess } from '../../utils/toast';
import adminService from '../../services/adminService';

function formatDate(value) {
  if (!value) return 'Not set';
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Not set';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return 'Not set';
  }
}

function OrganiserDashboard() {
  const navigate = useNavigate();
  const { events, metrics, loading, archiveEvent, deleteEvent, refresh } = useEvents();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleArchive = async (event) => {
    try {
      await archiveEvent(event.id);
      showSuccess('Event archived successfully.');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to archive event.');
    }
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteEvent(event.id);
      showSuccess('Event deleted successfully.');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const handleSuspend = async (event) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Suspend "${event.title}"? It will be hidden from public pages.`
    );
    if (!confirmed) return;

    try {
      await adminService.suspendEvent(event.id);
      showSuccess('Event suspended successfully.');
      refresh();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to suspend event.');
    }
  };

  const handleActivate = async (event) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Activate "${event.title}"? It will go live on the site.`
    );
    if (!confirmed) return;

    try {
      await adminService.activateEvent(event.id);
      showSuccess('Event activated successfully.');
      refresh();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to activate event.');
    }
  };

  const dashboardTitle = useMemo(() => {
    if (isAdmin) return 'Manage Every Event';
    if (!events || events.length === 0) return 'My Dashboard';

    const hasHackathons = events.some((event) => event.type === 'Hackathon');
    const hasEvents = events.some((event) => event.type !== 'Hackathon');

    if (hasHackathons && !hasEvents) return 'Manage Your Hackathons';
    if (hasEvents && !hasHackathons) return 'Manage Your Events';
    return 'Manage Events & Hackathons';
  }, [events, isAdmin]);

  const metricCards = [
    {
      label: 'Live events',
      value: metrics.live,
      detail: `${events.length} total managed`,
      accent: 'border-l-blue-600',
    },
    {
      label: 'Registrations',
      value: metrics.registrations,
      detail: 'Across all active events',
      accent: 'border-l-emerald-500',
    },
    {
      label: 'Submissions',
      value: metrics.submissions,
      detail: 'Ready for review and judging',
      accent: 'border-l-amber-500',
    },
    {
      label: 'Judges',
      value: metrics.judges,
      detail: 'Assigned to current programs',
      accent: 'border-l-sky-500',
    },
  ];

  const upcomingDeadlines = useMemo(
    () =>
      events
        .flatMap((event) => [
          {
            event: event.title,
            label: 'Registration closes',
            date: event.registrationDeadline,
          },
          {
            event: event.title,
            label: 'Submission deadline',
            date: event.submissionDeadline,
          },
          {
            event: event.title,
            label: 'Judging ends',
            date: event.judgingEnd,
          },
        ])
        .filter((item) => item.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5),
    [events]
  );

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 text-slate-800 font-sans md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-60 w-60 rounded-full bg-emerald-100/40 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <Zap className="h-3.5 w-3.5 text-blue-600" />
                {isAdmin ? 'Admin Event Workspace' : 'Organiser Workspace'}
              </span>

              <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {dashboardTitle}
              </h1>

              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                {isAdmin
                  ? 'Create, edit, archive, delete, and inspect registrations for events across the platform.'
                  : dashboardTitle === 'Manage Your Hackathons'
                  ? 'Manage registrations, submissions, judging, and timelines for your hackathons.'
                  : dashboardTitle === 'Manage Your Events'
                  ? 'Manage registrations, schedules, and reporting for your events.'
                  : 'Manage registrations, submissions, and judging all from one powerful dashboard. Track every detail, from setup to reporting.'}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-4">
              <Link
                to="/organiser/events/new"
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
              >
                Create New Event
              </Link>

              <a
                href="#managed-events"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
              >
                View Managed Events
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <div
              key={metric.label}
              className={`min-h-[130px] rounded-2xl border border-slate-200 border-l-4 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${metric.accent} flex flex-col justify-between`}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {metric.label}
                </p>
                {loading ? (
                  <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <p className="mt-2 font-outfit text-3xl font-extrabold text-slate-900">
                    {metric.value}
                  </p>
                )}
              </div>
              <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                {metric.detail}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2" id="managed-events">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-outfit text-2xl font-bold text-slate-950">
                  {isAdmin ? 'All Events' : 'Your Events'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {isAdmin
                    ? 'Manage every event across the platform'
                    : 'Manage, edit, and track event progress'}
                </p>
              </div>

              <Link
                to="/organiser/events/new"
                className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                New Event
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <EventStatusList
                events={events}
                onEdit={(event) => navigate(`/organiser/events/${event.id}/edit`)}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onSuspend={handleSuspend}
                onActivate={handleActivate}
                canModerate={isAdmin}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-outfit text-lg font-bold text-slate-950">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
                Operations Checklist
              </h3>

              <div className="space-y-3">
                {[
                  { text: 'Complete event details', done: true },
                  { text: 'Set registration deadline', done: true },
                  { text: 'Configure submission rules', done: false },
                  { text: 'Assign judges and criteria', done: false },
                ].map((item, i) => (
                  <label
                    key={i}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.done}
                      className="h-5 w-5 cursor-pointer rounded border-slate-300 text-emerald-600 transition focus:ring-emerald-500/20"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        item.done
                          ? 'text-slate-400 line-through'
                          : 'text-slate-700 group-hover:text-emerald-600'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-outfit text-lg font-bold text-slate-950">
                <Clock className="h-5 w-5 text-emerald-600" />
                Upcoming Deadlines
              </h3>

              <div className="space-y-4">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((deadline) => (
                    <div
                      key={`${deadline.event}-${deadline.label}`}
                      className="space-y-1 border-l-2 border-emerald-500 pl-3"
                    >
                      <p className="text-sm font-semibold text-slate-800">
                        {deadline.label}
                      </p>
                      <p className="text-xs text-slate-500">{deadline.event}</p>
                      <p className="text-xs font-semibold text-emerald-600">
                        {formatDate(deadline.date)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No upcoming deadlines</p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-outfit text-lg font-bold text-slate-950">
                <Headphones className="h-5 w-5 text-emerald-600" />
                Quick Support
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-emerald-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email Support</p>
                    <p className="text-slate-600">support@enginow.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-emerald-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Documentation</p>
                    <p className="text-slate-600">Learn best practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrganiserDashboard;