import React from 'react'
function Field({ label, children, className = '' }) {
  return (
    <label className={className}>
      <span className="text-sm font-semibold text-theme-text-secondary">{label}</span>
      {children}
    </label>
  )
}


function Step2EventDetails({ formData = {}, updateField = () => {} }) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Primary location" className="md:col-span-2">
          <input
            value={formData.location || ''}
            onChange={(event) => updateField('location', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Bengaluru + Online"
          />
        </Field>
        <Field label="Venue">
          <input
            value={formData.venue || ''}
            onChange={(event) => updateField('venue', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Innovation Hub, Main Auditorium"
          />
        </Field>
        <Field label="City">
          <input
            value={formData.city || ''}
            onChange={(event) => updateField('city', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Bengaluru"
          />
        </Field>
        <Field label="Country">
          <input
            value={formData.country || ''}
            onChange={(event) => updateField('country', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="India"
          />
        </Field>
        <Field label="Team size">
          <input
            value={formData.teamSize || ''}
            onChange={(event) => updateField('teamSize', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="1-4"
          />
        </Field>
        <Field label="Tracks or themes" className="md:col-span-2">
          <input
            value={formData.track || ''}
            onChange={(event) => updateField('track', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="AI, Cloud, Developer Tools"
          />
        </Field>
        <Field label="Prize pool">
          <input
            value={formData.prizePool || ''}
            onChange={(event) => updateField('prizePool', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="INR 3,00,000"
          />
        </Field>
        <Field label="Eligibility">
          <input
            value={formData.eligibility || ''}
            onChange={(event) => updateField('eligibility', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Students, founders, professionals"
          />
        </Field>
        <Field label="Max capacity">
          <input
            type="number"
            min="0"
            value={formData.maxCapacity ?? ''}
            onChange={(event) => updateField('maxCapacity', event.target.value === '' ? '' : parseInt(event.target.value, 10))}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="0 (Unlimited)"
          />
        </Field>
        <Field label="Registration questions (one question per line)" className="md:col-span-2">
          <textarea
            value={
              Array.isArray(formData.registrationQuestions)
                ? formData.registrationQuestions.join('\n')
                : formData.registrationQuestions || ''
            }
            onChange={(event) => updateField('registrationQuestions', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y"
            rows={4}
            placeholder="What is your GitHub profile?&#10;What is your primary development stack?"
          />
        </Field>
      </section>

      <section className="rounded-lg border border-theme-border bg-theme-bg p-5">
        <h2 className="text-base font-bold text-theme-text">Event page readiness</h2>
        <p className="mt-2 text-sm text-theme-text-secondary">
          Hackathon listings perform better when participants can instantly understand venue,
          format, tracks, team rules, prizes, and whether they are eligible to join.
        </p>
      </section>
    </div>
  )
}

export default Step2EventDetails
