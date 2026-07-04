import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Archive, Calendar, Users, Trash2 } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import EmptyState from '../common/EmptyState'
import { getEventCompletion, getEventHealth } from '../../hooks/useEvents'

function EventStatusList({ events, onEdit, onArchive, onDelete }) {
  const safeEvents = events || []
  if (!safeEvents.length) {
    return (
      <EmptyState
        title="No events yet"
        description="Start by creating your first event. Set up registrations, submissions, and judging all in one place."
        icon={Calendar}
        actionText="Create New Event"
        actionHref="/organiser/events/new"
      />
    )
  }

  return (
    <section className="space-y-4">
      {safeEvents.map((event) => {
        const completion = getEventCompletion(event)
        const health = getEventHealth(event)
        const statusBorders = {
          draft: 'border-l-slate-300',
          active: 'border-l-emerald-500',
          published: 'border-l-blue-600',
          completed: 'border-l-slate-400',
        }

        return (
          <article key={event.id || event.title} className={`group bg-white border border-slate-200 border-l-4 ${statusBorders[event.status?.toLowerCase()] || statusBorders.draft} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(event.title || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-neutral-900 truncate">{event.title || 'Untitled event'}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{event.location || 'Location TBD'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block px-2 py-1 bg-slate-50 border border-slate-150 rounded text-xs font-semibold text-neutral-700">
                        {event.type || 'Event'}
                      </span>
                      <StatusBadge status={event.status || 'Draft'} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{event.registrations || 0}</p>
                  <p className="text-xs font-medium text-neutral-600 mt-1">Signups</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{event.submissions || 0}</p>
                  <p className="text-xs font-medium text-neutral-600 mt-1">Submissions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">{event.judges || 0}</p>
                  <p className="text-xs font-medium text-neutral-600 mt-1">Judges</p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-600">{health}</span>
                    <span className="text-xs font-bold text-neutral-900">{completion}%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 flex items-center justify-end gap-2">
                <Link
                  to={`/organiser/events/${event.id}/registrations`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  Registrations
                </Link>
                <button
                  type="button"
                  onClick={() => onEdit?.(event)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onArchive?.(event)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(event)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default EventStatusList
