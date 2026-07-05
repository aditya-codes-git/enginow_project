import React from 'react'
import { Quote, Trophy } from 'lucide-react'

import { successStories } from '../../data/content'

function SuccessStoriesPage() {
  return (
    <main className="bg-theme-surface text-theme-text">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-theme-surface/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <Trophy className="h-4 w-4" />
              Success Stories
            </div>
            <h1 className="mt-6 font-outfit text-4xl font-extrabold tracking-tight sm:text-5xl">
              Students and organisers building momentum through EngiNow.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Sample stories showing how the platform supports discovery, participation, and campus event operations.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
        {successStories.map((story) => (
          <article key={story.name} className="rounded-2xl border border-theme-border bg-theme-surface p-7 shadow-sm">
            <Quote className="h-8 w-8 text-slate-200" />
            <p className="mt-5 text-base leading-7 text-theme-text-secondary">"{story.feedback}"</p>
            <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
              {story.result}
            </div>
            <div className="mt-6 flex items-center gap-4 border-t border-theme-divider pt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-theme-primary font-outfit text-sm font-bold text-white">
                {story.initials}
              </div>
              <div>
                <h2 className="font-outfit text-base font-bold text-theme-text">{story.name}</h2>
                <p className="text-sm text-theme-text-secondary">
                  {story.role} / <span className="text-theme-primary">{story.college}</span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default SuccessStoriesPage
