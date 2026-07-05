import React from 'react'
import HackathonCard from '../common/HackathonCard'

function HackathonGrid({ hackathons = [] }) {
  if (!hackathons.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-theme-bg p-10 text-center">
        <h2 className="font-outfit text-2xl font-bold text-theme-text">No hackathons found</h2>
        <p className="mt-2 text-sm text-theme-text-secondary">Try a different keyword, mode, or team-size filter.</p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id || hackathon.title} hackathon={hackathon} />
      ))}
    </section>
  )
}

export default HackathonGrid
