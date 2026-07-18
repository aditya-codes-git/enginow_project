import React from 'react'
import { Quote, Trophy } from 'lucide-react'

import { successStories } from '../../data/content'

function SuccessStoriesPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
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
          <article key={story.name} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <Quote className="h-8 w-8 text-slate-200" />
            <p className="mt-5 text-base leading-7 text-slate-700">"{story.feedback}"</p>
            <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
              {story.result}
            </div>
            <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-outfit text-sm font-bold text-white">
                {story.initials}
              </div>
              <div>
                <h2 className="font-outfit text-base font-bold text-slate-950">{story.name}</h2>
                <p className="text-sm text-slate-500">
                  {story.role} / <span className="text-blue-600">{story.college}</span>
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
