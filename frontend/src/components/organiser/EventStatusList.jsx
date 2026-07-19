import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Archive, Calendar, Users, Trash2, ShieldOff, CheckCircle2 } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import EmptyState from '../common/EmptyState'
import { getEventCompletion, getEventHealth } from '../../hooks/useEvents'

function EventStatusList({ events, onEdit, onArchive, onDelete, onSuspend, onActivate, canModerate = false }) {
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
          approved: 'border-l-emerald-500',
          pending: 'border-l-amber-500',
          suspended: 'border-l-red-500',
          rejected: 'border-l-red-500',
          published: 'border-l-blue-600',
          completed: 'border-l-slate-400',
        }
        const status = String(event.status || '').toLowerCase()

        return (
          <article key={event.id || event.title} className={`group bg-white border border-slate-200 border-l-4 ${statusBorders[event.status?.toLowerCase()] || statusBorders.draft} rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Section: Avatar & Event Information */}
              <div className="md:col-span-1 lg:col-span-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">
                  {(event.title || 'E').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-neutral-900 truncate" title={event.title}>{event.title || 'Untitled event'}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{event.location || 'Location TBD'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-neutral-700">
                      {event.type || 'Event'}
                    </span>
                    <StatusBadge status={event.status || 'Draft'} />
                  </div>
                </div>
              </div>

              {/* Middle Section: Statistics Card and Progress stacked vertically */}
              <div className="md:col-span-1 lg:col-span-5 flex flex-col justify-center gap-4 w-full min-w-[285px]">
                {/* Statistics Card */}
                <div className="grid grid-cols-3 bg-slate-50/50 rounded-2xl py-4 px-2 border border-slate-200 divide-x divide-slate-200 shadow-sm w-full">
                  <div className="flex flex-col items-center justify-center px-2">
                    <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">Signups</span>
                    <strong className="text-3xl font-extrabold text-neutral-950 mt-1">{event.registrations || 0}</strong>
                  </div>
                  <div className="flex flex-col items-center justify-center px-2">
                    <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">Submissions</span>
                    <strong className="text-3xl font-extrabold text-neutral-950 mt-1">{event.submissions || 0}</strong>
                  </div>
                  <div className="flex flex-col items-center justify-center px-2">
                    <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">Judges</span>
                    <strong className="text-3xl font-extrabold text-neutral-950 mt-1">{event.judges || 0}</strong>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-2 w-full px-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-neutral-600">{health}</span>
                    <span className="text-xs font-black text-neutral-950">{completion}%</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden border border-slate-200/40 w-full">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 rounded-full"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Section: Action Buttons */}
              <div className="md:col-span-2 lg:col-span-3 flex flex-wrap md:flex-row lg:flex-col items-stretch gap-2.5 lg:pl-4 lg:border-l lg:border-slate-100">
                <Link
                  to={`/organiser/events/${event.id}/registrations`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Users className="w-3.5 h-3.5" />
                  Registrations
                </Link>
                
                <button
                  type="button"
                  onClick={() => onEdit?.(event)}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onArchive?.(event)}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>

                {canModerate && status !== 'suspended' && (
                  <button
                    type="button"
                    onClick={() => onSuspend?.(event)}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-250 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100/60 transition-colors"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    Suspend
                  </button>
                )}

                {canModerate && status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => onActivate?.(event)}
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-250 bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100/60 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {status === 'pending' ? 'Approve' : 'Activate'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDelete?.(event)}
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-250 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100/60 transition-colors"
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
