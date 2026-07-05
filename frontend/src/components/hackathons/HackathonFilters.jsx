import React from 'react'
import { Filter, Search } from 'lucide-react'

const teamSizes = ['All', '1-2', '1-3', '1-4', '2-5']
const modes = ['All', 'Online', 'Hybrid', 'In-person']

function HackathonFilters({ filters, onChange, total = 0 }) {
  const updateFilter = (key, value) => onChange?.({ ...filters, [key]: value })

  return (
    <section className="rounded-2xl border border-theme-border bg-theme-surface p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-theme-primary">
            <Filter className="h-4 w-4" />
            Hackathon finder
          </div>
          <h2 className="mt-2 font-outfit text-2xl font-bold text-theme-text">{total} challenges open</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[680px]">
          <label className="grid gap-2 text-sm font-semibold text-theme-text-secondary">
            Search
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-text-muted" />
              <input
                value={filters.search || ''}
                onChange={(event) => updateFilter('search', event.target.value)}
                placeholder="AI, cloud, city"
                className="w-full rounded-xl border border-theme-border bg-theme-bg py-3 pl-10 pr-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-theme-text-secondary">
            Mode
            <select value={filters.mode || 'All'} onChange={(event) => updateFilter('mode', event.target.value)} className="rounded-xl border border-theme-border bg-theme-bg px-3 py-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100">
              {modes.map((mode) => (
                <option key={mode}>{mode}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-theme-text-secondary">
            Team size
            <select value={filters.teamSize || 'All'} onChange={(event) => updateFilter('teamSize', event.target.value)} className="rounded-xl border border-theme-border bg-theme-bg px-3 py-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100">
              {teamSizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  )
}

export default HackathonFilters
