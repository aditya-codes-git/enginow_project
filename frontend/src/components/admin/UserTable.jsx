import React from 'react'
import { Eye, Search, ShieldOff, UserCheck } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

function formatDate(value) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function UserTable({ users, onView, onSuspend, onActivate }) {
  const safeUsers = users || []
  if (!safeUsers.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-theme-bg p-16 text-center">
        <Search className="mx-auto h-10 w-10 text-theme-text-muted" />
        <h2 className="mt-4 font-outfit text-2xl font-bold text-theme-text">No users found</h2>
        <p className="mx-auto mt-2 max-w-md text-theme-text-secondary">
          Users will appear here after registrations or invitations begin.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-theme-border bg-theme-surface shadow-sm">
      <div className="border-b border-theme-divider px-6 py-5">
        <h2 className="font-outfit text-2xl font-bold text-theme-text">Account directory</h2>
        <p className="mt-1 text-sm text-theme-text-secondary">Review identity, role, participation, and moderation state.</p>
      </div>

      <div className="divide-y divide-theme-divider">
        {safeUsers.map((user) => {
          const isSuspended = String(user.status).toLowerCase() === 'suspended'

          return (
            <div key={user.id || user.email} className="p-5 transition hover:bg-theme-bg/80">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-lg font-bold text-white shadow-sm">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-theme-text">{user.name || 'Unnamed user'}</h3>
                      <p className="truncate text-sm text-theme-text-secondary">{user.email || 'No email'}</p>
                      <p className="mt-1 text-xs text-theme-text-secondary">Joined {formatDate(user.joinedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-theme-text-secondary">Role</p>
                    <p className="mt-1 font-semibold text-theme-text">{user.role || 'Participant'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-theme-text-secondary">Events</p>
                    <p className="mt-1 font-semibold text-theme-text">{user.eventsJoined || 0}</p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <StatusBadge status={user.status || 'Active'} />
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:col-span-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onView?.(user)}
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-theme-primary"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => (isSuspended ? onActivate?.(user) : onSuspend?.(user))}
                    className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-sm font-semibold text-theme-text-secondary transition hover:bg-theme-bg"
                  >
                    {isSuspended ? <UserCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    {isSuspended ? 'Activate' : 'Suspend'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UserTable
