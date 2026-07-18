import React from 'react'

function Field({ label, children }) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function Step4Schedule({ formData = {}, updateField = () => {} }) {
  const milestones = [
    ['Registration closes', formData.registrationDeadline],
    ['Submissions open', formData.submissionStart],
    ['Submission deadline', formData.submissionDeadline],
    ['Judging starts', formData.judgingStart],
    ['Judging ends', formData.judgingEnd],
    ['Winners announced', formData.winnerAnnouncement],
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Event starts">
          <input
            type="date"
            value={formData.startDate || ''}
            onChange={(event) => updateField('startDate', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Event ends">
          <input
            type="date"
            value={formData.endDate || ''}
            onChange={(event) => updateField('endDate', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Registration deadline">
          <input
            type="date"
            value={formData.registrationDeadline || ''}
            onChange={(event) => updateField('registrationDeadline', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Submissions open">
          <input
            type="datetime-local"
            value={formData.submissionStart || ''}
            onChange={(event) => updateField('submissionStart', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Submission deadline">
          <input
            type="datetime-local"
            value={formData.submissionDeadline || ''}
            onChange={(event) => updateField('submissionDeadline', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Judging starts">
          <input
            type="datetime-local"
            value={formData.judgingStart || ''}
            onChange={(event) => updateField('judgingStart', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Judging ends">
          <input
            type="datetime-local"
            value={formData.judgingEnd || ''}
            onChange={(event) => updateField('judgingEnd', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
        <Field label="Winner announcement">
          <input
            type="datetime-local"
            value={formData.winnerAnnouncement || ''}
            onChange={(event) => updateField('winnerAnnouncement', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </Field>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Timeline preview</h2>
        <div className="mt-4 space-y-4">
          {milestones.map(([label, value]) => (
            <div key={label} className="border-l-2 border-blue-500 pl-3">
              <p className="text-sm font-semibold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500">{value || 'Not scheduled'}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
export default Step4Schedule