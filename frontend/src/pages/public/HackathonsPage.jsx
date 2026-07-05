import React, { useMemo, useState } from 'react'
import { ArrowRight, Code2, Rocket, Trophy, Users } from 'lucide-react'
import HackathonFilters from '../../components/hackathons/HackathonFilters'
import HackathonGrid from '../../components/hackathons/HackathonGrid'
import useEvents from '../../hooks/useEvents'
import { SkeletonEventCard } from '../../components/common/Skeleton'
import { useTheme } from '../../context/ThemeContext'

function hackathonMatches(hackathon, filters) {
  const search = String(filters.search || '').toLowerCase().trim()
  const searchableText = [hackathon.title, hackathon.tagline, hackathon.description, hackathon.city, hackathon.location, hackathon.track].join(' ').toLowerCase()
  const matchesSearch = !search || searchableText.includes(search)
  const matchesMode = filters.mode === 'All' || !filters.mode || hackathon.mode === filters.mode
  const matchesTeam = filters.teamSize === 'All' || !filters.teamSize || hackathon.teamSizeLabel === filters.teamSize

  return matchesSearch && matchesMode && matchesTeam
}

function HackathonsPage() {
  const { theme } = useTheme()
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
    <div className="bg-theme-surface text-theme-text">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-50 pointer-events-none" />
        <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Badge — cyan accent for hackathons */}
          <div className="inline-flex items-center gap-2 rounded-full border border-theme-info-border bg-theme-surface/80 px-3.5 py-1.5 text-xs font-semibold text-theme-primary shadow-sm backdrop-blur-sm mb-6">
            <Code2 className="h-3.5 w-3.5" />
            Hackathons
          </div>

          {/* Headline */}
          <h1 className="heading-clear font-outfit text-4xl font-extrabold tracking-tight text-theme-text sm:text-5xl lg:text-[52px] max-w-3xl">
            Build under pressure, ship with focus.
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-theme-text-secondary">
            Find hackathons with clear timelines, practical themes, team formats, and submission paths built for serious builders.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#hackathon-results"
              style={{
                backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                color: theme.colors.textOnPrimary || '#ffffff',
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg hover:opacity-95"
            >
              View challenges
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#hackathon-filters"
              className="inline-flex items-center justify-center rounded-xl border border-theme-border bg-theme-surface px-6 py-3 text-sm font-semibold text-theme-text-secondary transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-theme-bg"
            >
              Filter by team
            </a>
          </div>

          {/* Horizontal Stats Strip */}
          <div className="mt-12 flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-theme-divider">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-info-bg border border-theme-info-border text-theme-primary shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    {stat.value === null ? (
                      <div className="h-7 w-12 bg-theme-bg-secondary animate-pulse rounded mt-0.5" />
                    ) : (
                      <p className="font-outfit text-2xl font-bold text-theme-text leading-tight">{stat.value}</p>
                    )}
                    <p className="text-xs font-medium text-theme-text-muted">{stat.label}</p>
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
    </div>
  )
}

export default HackathonsPage
