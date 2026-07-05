import React from 'react'


function Field({ label, children, className = '' }) {
  return (
    <label className={className}>
      <span className="text-sm font-semibold text-theme-text-secondary">{label}</span>
      {children}
    </label>
  )
}
function Step1BasicInfo({ formData = {}, updateField = () => {} }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Event title" className="md:col-span-2">
          <input
            value={formData.title || ''}
            onChange={(event) => updateField('title', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="AI Builders Hack Summit"
          />
        </Field>
        <Field label="Short tagline" className="md:col-span-2">
          <input
            value={formData.tagline || ''}
            onChange={(event) => updateField('tagline', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Build, submit, and demo with mentors and judges."
          />
        </Field>
        <Field label="Event type">
          <select
            value={formData.type || 'Hackathon'}
            onChange={(event) => updateField('type', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option>Hackathon</option>
            <option>Event</option>
            <option>Workshop</option>
            <option>Webinar</option>
            <option>Competition</option>
          </select>
        </Field>
        <Field label="Publish status">
          <select
            value={formData.status || 'Draft'}
            onChange={(event) => updateField('status', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option>Draft</option>
            <option>Review</option>
            <option>Published</option>
            <option>Archived</option>
          </select>
        </Field>
        <Field label="Visibility">
          <select
            value={formData.visibility || 'Public'}
            onChange={(event) => updateField('visibility', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option>Public</option>
            <option>Private</option>
          </select>
        </Field>
        <Field label="Format">
          <select
            value={formData.mode || 'Hybrid'}
            onChange={(event) => updateField('mode', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option>Online</option>
            <option>In-person</option>
            <option>Hybrid</option>
          </select>
        </Field>
      </div>

      <aside className="rounded-lg border border-theme-border bg-theme-bg p-5">
        <h2 className="text-base font-bold text-theme-text">Organizer focus</h2>
        <p className="mt-2 text-sm text-theme-text-secondary">
          Strong hackathon pages make the event promise clear first, then connect it to signups,
          submissions, and judging. Keep this step concise and participant-facing.
        </p>
        <div className="mt-4 space-y-2 text-sm text-theme-text-secondary">
          <p className="font-semibold">Recommended basics</p>
          <p>Clear title, one-line value, event type, public status, and delivery format.</p>
        </div>
      </aside>
    </div>
  )
}

export default Step1BasicInfo
