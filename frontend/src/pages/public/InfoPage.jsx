import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { footerPageContent } from '../../data/content'

function InfoPage({ pageKey }) {
  const params = useParams()
  const key = pageKey || params.pageKey
  const page = footerPageContent[key]

  if (!page) {
    return <Navigate to="/" replace />
  }

  const Icon = page.icon

  return (
    <main className="bg-theme-surface text-theme-text">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-theme-surface/10 px-4 py-2 text-sm font-semibold text-blue-100">
            <Icon className="h-4 w-4" />
            {page.eyebrow}
          </div>
          <h1 className="mt-6 font-outfit text-4xl font-extrabold tracking-tight sm:text-5xl">{page.title}</h1>
          <p className="mt-4 text-sm font-semibold text-blue-200">{page.updated}</p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{page.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="divide-y divide-theme-divider rounded-2xl border border-theme-border bg-theme-surface shadow-sm">
          {page.sections.map((section) => (
            <section key={section.heading} className="p-6 sm:p-8">
              <h2 className="font-outfit text-2xl font-bold text-theme-text">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-theme-text-secondary">{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}

export default InfoPage
