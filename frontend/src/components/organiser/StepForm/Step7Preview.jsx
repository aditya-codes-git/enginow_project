import React from 'react'
import { getEventCompletion, getEventHealth } from '../../../hooks/useEvents'

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value || 'Not set'}</p>
    </div>
  )
}

function Step7Preview({ formData = {} }) {
  const completion = getEventCompletion(formData)
  const health = getEventHealth(formData)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[16/7] bg-slate-100">
          {formData.coverImage ? (
            <img src={formData.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
              Event cover
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              {formData.status || 'Draft'}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {formData.type || 'Event'}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {formData.mode || 'Hybrid'}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-950">{formData.title || 'Untitled event'}</h2>
          <p className="mt-2 text-sm text-slate-600">{formData.tagline || formData.description || 'Add a clear event summary before publishing.'}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Detail label="Location" value={formData.location} />
            <Detail label="Dates" value={formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : ''} />
            <Detail label="Prize pool" value={formData.prizePool} />
            <Detail label="Tracks" value={formData.track} />
            <Detail label="Team size" value={formData.teamSize} />
            <Detail label="Submissions due" value={formData.submissionDeadline} />
          </div>
        </div>
      </article>

      <aside className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Readiness</span>
            <span className="font-bold text-slate-950">{completion}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${completion}%` }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">{health}</p>
          <p className="mt-1 text-sm text-slate-500">
            Review page content, submission rules, judging period, and contact information before publishing.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-950">Operations snapshot</h3>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-lg font-bold text-slate-950">{formData.registrations || 0}</p>
              <p className="text-xs text-slate-500">Signups</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-lg font-bold text-slate-950">{formData.submissions || 0}</p>
              <p className="text-xs text-slate-500">Projects</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-lg font-bold text-slate-950">{formData.judges || 0}</p>
              <p className="text-xs text-slate-500">Judges</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
export default Step7Preview