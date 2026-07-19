import React from 'react'
import { Eye, Search, ShieldOff, UserCheck } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import { useAuth } from '../../hooks/useAuth'

function formatDate(value) {
  if (!value) return 'Not set'
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

function UserTable({ users, onView, onSuspend, onActivate }) {
  const { user: currentUser } = useAuth()
  const safeUsers = users || []
  if (!safeUsers.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
        <Search className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-950">No users found</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Users will appear here after registrations or invitations begin.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="font-outfit text-2xl font-bold text-slate-950">Account directory</h2>
        <p className="mt-1 text-sm text-slate-500">Review identity, role, participation, and moderation state.</p>
      </div>

      <div className="divide-y divide-slate-100">
        {safeUsers.map((user) => {


          return (
            <div key={user.id || user.email} className="p-5 transition hover:bg-slate-50/80">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-lg font-bold text-white shadow-sm">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950">{user.name || 'Unnamed user'}</h3>
                      <p className="truncate text-sm text-slate-600">{user.email || 'No email'}</p>
                      <p className="mt-1 text-xs text-slate-500">Joined {formatDate(user.joinedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
                    <p className="mt-1 font-semibold text-slate-800">{user.role || 'Participant'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Events</p>
                    <p className="mt-1 font-semibold text-slate-800">{user.eventsJoined || 0}</p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <StatusBadge status={user.status || 'Active'} />
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:col-span-5 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onView?.(user)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200/80"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed">
                      Administrator
                    </span>
                  ) : (
                    <>
                      {/* Suspend / Unsuspend */}
                      {String(user.status).toLowerCase() === 'suspended' ? (
                        <button
                          type="button"
                          onClick={() => onActivate?.(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100/75"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Unsuspend
                        </button>
                      ) : String(user.status).toLowerCase() === 'banned' ? null : (
                        <button
                          type="button"
                          onClick={() => onSuspend?.(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100/75"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          Suspend
                        </button>
                      )}

                      {/* Ban / Unban */}
                      {String(user.status).toLowerCase() === 'banned' ? (
                        <button
                          type="button"
                          onClick={() => onUnban?.(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100/75"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Unban
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onBan?.(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-rose-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-rose-100/75"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          Ban
                        </button>
                      )}

                      {/* Soft Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete?.(user)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-red-50/40 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100/50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default UserTable;

