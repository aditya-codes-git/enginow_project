import React from 'react'

function Field({ label, children }) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function Step6OrgContact({ formData = {}, updateField = () => {} }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Organizer name">
          <input
            value={formData.organiserName || ''}
            onChange={(event) => updateField('organiserName', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enginow"
          />
        </Field>
        <Field label="Organizer website">
          <input
            value={formData.organiserWebsite || ''}
            onChange={(event) => updateField('organiserWebsite', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://enginow.com"
          />
        </Field>
        <Field label="Primary contact name">
          <input
            value={formData.contactName || ''}
            onChange={(event) => updateField('contactName', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Events team"
          />
        </Field>
        <Field label="Primary contact email">
          <input
            type="email"
            value={formData.contactEmail || ''}
            onChange={(event) => updateField('contactEmail', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="events@enginow.com"
          />
        </Field>
        <Field label="Registrations">
          <input
            type="number"
            min="0"
            value={formData.registrations || 0}
            onChange={(event) => updateField('registrations', Number(event.target.value))}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Submissions">
          <input
            type="number"
            min="0"
            value={formData.submissions || 0}
            onChange={(event) => updateField('submissions', Number(event.target.value))}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Judges assigned">
          <input
            type="number"
            min="0"
            value={formData.judges || 0}
            onChange={(event) => updateField('judges', Number(event.target.value))}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-base font-bold text-slate-950">Manager operations</h2>
        <p className="mt-2 text-sm text-slate-600">
          Keep ownership and contact details visible for participants, mentors, judges, and sponsors.
          The pipeline numbers help the dashboard surface event health.
        </p>
      </aside>
    </div>
  )
}
export default Step6OrgContact