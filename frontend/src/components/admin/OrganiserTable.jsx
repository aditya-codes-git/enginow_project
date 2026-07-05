import React from 'react'
import { Building2, CheckCircle2, Eye, Search, ShieldOff } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

function formatDate(value) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function OrganiserTable({ organisers, onReview, onVerify, onSuspend }) {
  const safeOrganisers = organisers || []
  if (!safeOrganisers.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-theme-bg p-16 text-center">
        <Search className="mx-auto h-10 w-10 text-theme-text-muted" />
        <h2 className="mt-4 font-outfit text-2xl font-bold text-theme-text">No organisers found</h2>
        <p className="mx-auto mt-2 max-w-md text-theme-text-secondary">
          Organiser applications and verified teams will appear here.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-theme-border bg-theme-surface shadow-sm">
      <div className="border-b border-theme-divider px-6 py-5">
        <h2 className="font-outfit text-2xl font-bold text-theme-text">Team directory</h2>
        <p className="mt-1 text-sm text-theme-text-secondary">Track organiser quality, approval velocity, and publishing readiness.</p>
      </div>

      <div className="divide-y divide-theme-divider">
        {safeOrganisers.map((organiser) => {
          const isVerified = String(organiser.status).toLowerCase() === 'verified'

          return (
            <div key={organiser.id || organiser.email} className="p-5 transition hover:bg-theme-bg/80">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-theme-text">{organiser.name || 'Unnamed organiser'}</h3>
                      <p className="text-sm text-theme-text-secondary">{organiser.contactName || 'No contact'}</p>
                      <p className="truncate text-sm text-theme-text-secondary">{organiser.email || 'No email'}</p>
                      <p className="mt-1 text-xs text-theme-text-secondary">Joined {formatDate(organiser.joinedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                  <div>
                    <p className="font-outfit text-2xl font-bold text-theme-text">{organiser.eventsManaged || 0}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-theme-text-secondary">Managed</p>
                  </div>
                  <div>
                    <p className="font-outfit text-2xl font-bold text-theme-text">{organiser.pendingEvents || 0}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-theme-text-secondary">Pending</p>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-theme-text-secondary">
                    <span>Approval rate</span>
                    <span>{organiser.approvalRate || 0}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-theme-primary transition-all"
                      style={{ width: `${organiser.approvalRate || 0}%` }}
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <StatusBadge status={organiser.status || 'Pending'} />
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:col-span-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onReview?.(organiser)}
                    className="inline-flex items-center gap-2 rounded-xl bg-theme-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-theme-primary"
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </button>
                  <button
                    type="button"
                    onClick={() => (isVerified ? onSuspend?.(organiser) : onVerify?.(organiser))}
                    className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-sm font-semibold text-theme-text-secondary transition hover:bg-theme-bg"
                  >
                    {isVerified ? <ShieldOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {isVerified ? 'Suspend' : 'Verify'}
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

export default OrganiserTable
