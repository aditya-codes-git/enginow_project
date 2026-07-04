import React, { useMemo, useState } from 'react'
import { ArrowRight, Code2, Rocket, Trophy, Users } from 'lucide-react'
import HackathonFilters from '../../components/hackathons/HackathonFilters'
import HackathonGrid from '../../components/hackathons/HackathonGrid'
import useEvents from '../../hooks/useEvents'
import { SkeletonEventCard } from '../../components/common/Skeleton'

function hackathonMatches(hackathon, filters) {
  const search = String(filters.search || '').toLowerCase().trim()
  const searchableText = [hackathon.title, hackathon.tagline, hackathon.description, hackathon.city, hackathon.location, hackathon.track].join(' ').toLowerCase()
  const matchesSearch = !search || searchableText.includes(search)
  const matchesMode = filters.mode === 'All' || !filters.mode || hackathon.mode === filters.mode
  const matchesTeam = filters.teamSize === 'All' || !filters.teamSize || hackathon.teamSizeLabel === filters.teamSize

  return matchesSearch && matchesMode && matchesTeam
}

function HackathonsPage() {
  const { events, loading } = useEvents()
  const [filters, setFilters] = useState({ search: '', mode: 'All', teamSize: 'All' })

  const hackathons = useMemo(
    () => (events || []).filter((event) => event.type === 'Hackathon' && event.status !== 'Archived'),
    [events],
  )

  const filteredHackathons = useMemo(
    () => hackathons.filter((hackathon) => hackathonMatches(hackathon, filters)),
    [hackathons, filters],
  )

  const registrations = loading
    ? 0
    : hackathons.reduce((sum, item) => sum + Number(item.registrations || 0), 0)
  const submissions = loading
    ? 0
    : hackathons.reduce((sum, item) => sum + Number(item.submissions || 0), 0)

  return (
    <main className="bg-white text-slate-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white pointer-events-none" />
        <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Badge — cyan accent for hackathons */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-cyan-600 shadow-sm backdrop-blur-sm mb-6">
            <Code2 className="h-3.5 w-3.5" />
            Hackathons
          </div>

          {/* Headline */}
          <h1 className="heading-clear font-outfit text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[52px] max-w-3xl">
            Build under pressure, ship with focus.
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-500">
            Find hackathons with clear timelines, practical themes, team formats, and submission paths built for serious builders.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#hackathon-results"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              View challenges
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#hackathon-filters"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Filter by team
            </a>
          </div>

          {/* Horizontal Stats Strip */}
          <div className="mt-12 flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-slate-100">
            {[
              {
                label: 'Open tracks',
                value: loading ? null : hackathons.length,
                icon: Trophy,
              },
              {
                label: 'Teams registered',
                value: loading ? null : registrations,
                icon: Users,
              },
              {
                label: 'Projects shipped',
                value: loading ? null : submissions,
                icon: Rocket,
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    {stat.value === null ? (
                      <div className="h-7 w-12 bg-slate-100 animate-pulse rounded mt-0.5" />
                    ) : (
                      <p className="font-outfit text-2xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                    )}
                    <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="hackathon-results" className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonEventCard />
            <SkeletonEventCard />
            <SkeletonEventCard />
          </div>
        ) : (
          <>
            <div id="hackathon-filters">
              <HackathonFilters filters={filters} onChange={setFilters} total={filteredHackathons.length} />
            </div>
            <HackathonGrid hackathons={filteredHackathons} />
          </>
        )}
      </section>
    </main>
  )
}

export default HackathonsPage
