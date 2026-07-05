import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, Clock, Headphones, Mail, BookOpen, Zap } from 'lucide-react'
import EventStatusList from '../../components/organiser/EventStatusList'
import useEvents from '../../hooks/useEvents'
import { useAuth } from '../../hooks/useAuth'
import { showError, showSuccess } from '../../utils/toast'

function formatDate(value) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function OrganiserDashboard() {
  const navigate = useNavigate()
  const { events, metrics, loading, archiveEvent, deleteEvent } = useEvents()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const handleArchive = async (event) => {
    try {
      await archiveEvent(event.id)
      showSuccess('Event archived successfully.')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to archive event.')
    }
  }

  const handleDelete = async (event) => {
    const confirmed = window.confirm(`Delete "${event.title || 'this event'}"? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await deleteEvent(event.id)
      showSuccess('Event deleted successfully.')
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete event.')
    }
  }

  const metricCards = [
    { label: 'Live events', value: metrics.live, detail: `${events.length} total managed`, accent: 'border-l-blue-600' },
    { label: 'Registrations', value: metrics.registrations, detail: 'Across all active events', accent: 'border-l-emerald-500' },
    { label: 'Submissions', value: metrics.submissions, detail: 'Ready for review and judging', accent: 'border-l-amber-500' },
    { label: 'Judges', value: metrics.judges, detail: 'Assigned to current programs', accent: 'border-l-sky-500' },
  ]

  const upcomingDeadlines = useMemo(
    () =>
      events
        .flatMap((event) => [
          { event: event.title, label: 'Registration closes', date: event.registrationDeadline },
          { event: event.title, label: 'Submission deadline', date: event.submissionDeadline },
          { event: event.title, label: 'Judging ends', date: event.judgingEnd },
        ])
        .filter((item) => item.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5),
    [events],
  )

  return (
    <main className="min-h-screen bg-theme-bg/50 p-6 md:p-8 text-theme-text font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Modern Hero Section Card */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 md:p-12 shadow-xl border border-slate-900">
          {/* Subtle background glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center">
            <div className="space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-blue-300" />
                {isAdmin ? 'Admin Event Workspace' : 'Organiser Workspace'}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-outfit">
                {isAdmin ? 'Manage Every Event' : 'Master Your Events'}
              </h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                {isAdmin
                  ? 'Create, edit, archive, delete, and inspect registrations for events across the platform.'
                  : 'Manage registrations, submissions, and judging all from one powerful dashboard. Track every detail, from setup to reporting.'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                to="/organiser/events/new"
                className="bg-theme-primary hover:bg-theme-primary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:-translate-y-0.5"
              >
                Create New Event
              </Link>
              <a
                href="#managed-events"
                className="bg-theme-surface-elevated hover:bg-slate-750 border border-slate-750 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                View Managed Events
              </a>
            </div>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((metric) => (
            <div key={metric.label} className={`bg-theme-surface rounded-2xl border border-theme-divider border-l-2 ${metric.accent} p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[130px]`}>
              <div>
                <p className="text-theme-text-muted text-xs font-semibold uppercase tracking-wider">{metric.label}</p>
                {loading ? (
                  <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg mt-2" />
                ) : (
                  <p className="text-3xl font-extrabold text-theme-text mt-2 font-outfit">
                    {metric.value}
                  </p>
                )}
              </div>
              <p className="text-theme-text-secondary text-xs font-medium border-t border-slate-50 pt-3 mt-4">
                {metric.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main events panel */}
          <div className="lg:col-span-2 space-y-6" id="managed-events">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-theme-text font-outfit">{isAdmin ? 'All Events' : 'Your Events'}</h2>
                <p className="text-theme-text-secondary text-sm mt-1">{isAdmin ? 'Manage every event across the platform' : 'Manage, edit, and track event progress'}</p>
              </div>
              <Link
                to="/organiser/events/new"
                className="text-theme-primary hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                + New Event
              </Link>
            </div>
            
            <div className="bg-theme-surface rounded-2xl border border-theme-divider p-6 shadow-sm">
              <EventStatusList
                events={events}
                onEdit={(event) => navigate(`/organiser/events/${event.id}/edit`)}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Checklist */}
            <div className="bg-theme-surface rounded-2xl border border-theme-divider p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-theme-text font-outfit flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-theme-primary" />
                Operations Checklist
              </h3>
              <div className="space-y-3">
                {[
                  { text: 'Complete event details', done: true },
                  { text: 'Set registration deadline', done: true },
                  { text: 'Configure submission rules', done: false },
                  { text: 'Assign judges and criteria', done: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked={item.done}
                      className="w-5 h-5 rounded border-slate-300 text-theme-primary focus:ring-blue-500/20 cursor-pointer transition"
                    />
                    <span className={`text-sm transition-colors ${item.done ? 'text-theme-text-muted line-through' : 'text-theme-text-secondary group-hover:text-theme-primary'}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-theme-surface rounded-2xl border border-theme-divider p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-theme-text font-outfit flex items-center gap-2">
                <Clock className="w-5 h-5 text-theme-primary" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-4">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((deadline) => (
                    <div key={`${deadline.event}-${deadline.label}`} className="border-l-2 border-blue-500 pl-3 space-y-1">
                      <p className="font-semibold text-theme-text text-sm">{deadline.label}</p>
                      <p className="text-xs text-theme-text-secondary">{deadline.event}</p>
                      <p className="text-xs font-semibold text-theme-primary">{formatDate(deadline.date)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-theme-text-secondary">No upcoming deadlines</p>
                )}
              </div>
            </div>

            {/* Quick Support */}
            <div className="bg-theme-surface rounded-2xl border border-theme-divider p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-theme-text font-outfit flex items-center gap-2">
                <Headphones className="w-5 h-5 text-theme-primary" />
                Quick Support
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-bg border border-theme-divider text-theme-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-theme-text">Email Support</p>
                    <p className="text-theme-text-secondary">support@enginow.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-theme-bg border border-theme-divider text-theme-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-theme-text">Documentation</p>
                    <p className="text-theme-text-secondary">Learn best practices</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  )
}

export default OrganiserDashboard
