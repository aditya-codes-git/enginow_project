import React from 'react'
import { Building2, CheckCircle2, Eye, Search, ShieldOff } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

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

function OrganiserTable({ organisers, onReview, onVerify, onSuspend }) {
  const safeOrganisers = organisers || []
  if (!safeOrganisers.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
        <Search className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-950">No organisers found</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Organiser applications and verified teams will appear here.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="font-outfit text-2xl font-bold text-slate-950">Team directory</h2>
        <p className="mt-1 text-sm text-slate-500">Track organiser quality, approval velocity, and publishing readiness.</p>
      </div>

      <div className="divide-y divide-slate-100">
        {safeOrganisers.map((organiser) => {
          const isVerified = String(organiser.status).toLowerCase() === 'verified'

          return (
            <div key={organiser.id || organiser.email} className="p-5 transition hover:bg-slate-50/80">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950">{organiser.name || 'Unnamed organiser'}</h3>
                      <p className="text-sm text-slate-600">{organiser.contactName || 'No contact'}</p>
                      <p className="truncate text-sm text-slate-600">{organiser.email || 'No email'}</p>
                      <p className="mt-1 text-xs text-slate-500">Joined {formatDate(organiser.joinedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                  <div>
                    <p className="font-outfit text-2xl font-bold text-slate-950">{organiser.eventsManaged || 0}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Managed</p>
                  </div>
                  <div>
                    <p className="font-outfit text-2xl font-bold text-slate-950">{organiser.pendingEvents || 0}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending</p>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Approval rate</span>
                    <span>{organiser.approvalRate || 0}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
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
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </button>
                  <button
                    type="button"
                    onClick={() => (isVerified ? onSuspend?.(organiser) : onVerify?.(organiser))}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
