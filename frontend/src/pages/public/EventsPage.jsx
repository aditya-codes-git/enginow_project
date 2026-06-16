import React, { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, Sparkles, Users } from 'lucide-react'
import EventFilters from '../../components/events/EventFilters'
import EventGrid from '../../components/events/EventGrid'
import FeaturedStrip from '../../components/events/FeaturedStrip'
import useEvents from '../../hooks/useEvents'
import { SkeletonEventCard } from '../../components/common/Skeleton'

function eventMatches(event, filters) {
  const search = String(filters.search || '').toLowerCase().trim()
  const searchableText = [event.title, event.tagline, event.description, event.city, event.location, event.track].join(' ').toLowerCase()
  const matchesSearch = !search || searchableText.includes(search)
  const matchesMode = filters.mode === 'All' || !filters.mode || event.mode === filters.mode
  const matchesStatus = filters.status === 'All' || !filters.status || event.status === filters.status

  return matchesSearch && matchesMode && matchesStatus
}

function EventsPage() {
  const { events, loading } = useEvents()
  const [filters, setFilters] = useState({ search: '', mode: 'All', status: 'All' })

  const publicEvents = useMemo(
    () => (events || []).filter((event) => event.type !== 'Hackathon' && event.status !== 'Archived'),
    [events],
  )

  const filteredEvents = useMemo(
    () => publicEvents.filter((event) => eventMatches(event, filters)),
    [publicEvents, filters],
  )

  const totalRegistrations = loading
    ? 0
    : publicEvents.reduce((sum, item) => sum + Number(item.registrations || 0), 0)
  const cities = loading
    ? 0
    : new Set(publicEvents.map((item) => item.city || item.location).filter(Boolean)).size

  return (
    <main className="bg-white text-slate-900">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-[15%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur-sm mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Public events
          </div>

          {/* Headline */}
          <h1 className="font-outfit text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[52px] lg:leading-[1.1] max-w-3xl">
            Discover events for builders and curious teams.
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-500">
            Explore workshops, demo nights, webinars, competitions, and community meetups curated from trusted organisers.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#event-results"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse events
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#event-filters"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Refine search
            </a>
          </div>

          {/* Horizontal Stats Strip */}
          <div className="mt-12 flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-slate-100">
            {[
              {
                label: 'Events live',
                value: loading ? null : publicEvents.length,
                icon: CalendarDays,
              },
              {
                label: 'Registrations',
                value: loading ? null : totalRegistrations,
                icon: Users,
              },
              {
                label: 'Cities covered',
                value: loading ? null : (cities || 'Online'),
                icon: MapPin,
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-blue-600 shrink-0">
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
      <section id="event-results" className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonEventCard />
            <SkeletonEventCard />
            <SkeletonEventCard />
          </div>
        ) : (
          <>
            <FeaturedStrip event={publicEvents[0]} />
            <div id="event-filters">
              <EventFilters filters={filters} onChange={setFilters} total={filteredEvents.length} />
            </div>
            <EventGrid events={filteredEvents} />
          </>
        )}
      </section>
    </main>
  )
}

export default EventsPage
