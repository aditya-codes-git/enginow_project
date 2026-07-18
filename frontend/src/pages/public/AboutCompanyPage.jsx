import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, CheckCircle2 } from 'lucide-react'

import { companyHighlights, companyStats } from '../../data/content'

function AboutCompanyPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-mesh py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <Building2 className="h-4 w-4" />
              About Company
            </div>
            <h1 className="heading-clear mt-6 font-outfit text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[56px]">
              Building a cleaner way for students to discover technical opportunities.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              EngiNow brings event discovery, hackathon participation, organiser workflows, and student outcomes into one focused platform for engineering communities.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-outfit text-3xl font-extrabold text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {companyHighlights.map((highlight) => {
            const Icon = highlight.icon
            return (
              <article key={highlight.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 font-outfit text-2xl font-bold text-slate-950">{highlight.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{highlight.description}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-12 grid gap-8 rounded-2xl bg-slate-950 p-8 text-white md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">What we care about</p>
            <h2 className="mt-4 font-outfit text-3xl font-extrabold">Events should be easier to trust, join, and manage.</h2>
          </div>
          <div className="space-y-4">
            {['Clear information before registration', 'Better organiser visibility and admin review', 'Less manual tracking for campus teams'].map((item) => (
              <p key={item} className="flex items-start gap-3 text-sm font-semibold text-slate-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                {item}
              </p>
            ))}
            <Link to="/contact" className="inline-flex items-center gap-2 pt-2 text-sm font-bold text-blue-300 transition hover:gap-3">
              Contact EngiNow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutCompanyPage
