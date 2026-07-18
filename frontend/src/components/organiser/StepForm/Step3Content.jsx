import React from 'react'
function Field({ label, hint, children }) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}
      {children}
    </label>
  )
}

function Step3Content({ formData = {}, updateField = () => {} }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4">
        <Field label="Overview" hint="What builders will make and why it matters">
          <textarea
            value={formData.description || ''}
            onChange={(event) => updateField('description', event.target.value)}
            rows="5"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Describe the challenge, audience, mentors, expected outcomes, and demo experience."
          />
        </Field>
        <Field label="Rules" hint="Eligibility, team limits, allowed work, late edits">
          <textarea
            value={formData.rules || ''}
            onChange={(event) => updateField('rules', event.target.value)}
            rows="4"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Teams must submit a demo link, repository, project summary, and setup instructions before the deadline."
          />
        </Field>
        <Field label="Judging criteria" hint="The rubric judges and participants will see">
          <textarea
            value={formData.judgingCriteria || ''}
            onChange={(event) => updateField('judgingCriteria', event.target.value)}
            rows="4"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Impact, technical execution, usability, originality, and demo quality."
          />
        </Field>
        <Field label="Participant resources" hint="APIs, docs, mentor links, starter kits">
          <textarea
            value={formData.resources || ''}
            onChange={(event) => updateField('resources', event.target.value)}
            rows="3"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Starter APIs, cloud credits, mentor office hours, judging rubric, workshop recordings."
          />
        </Field>
      </div>

      <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-base font-bold text-slate-950">Submission quality</h2>
        <p className="mt-2 text-sm text-slate-600">
          Devpost-style submission flows work best when requirements are explicit before the build
          starts. Make the judging rubric visible and tell teams exactly what to upload.
        </p>
        <div className="mt-4 rounded-md bg-white p-4 text-sm text-slate-700 ring-1 ring-slate-200">
          <p className="font-semibold text-slate-950">Useful fields</p>
          <p className="mt-2">Demo URL, repository, project summary, setup notes, screenshots, and team members.</p>
        </div>
      </aside>
    </div>
  )
}

export default Step3Content