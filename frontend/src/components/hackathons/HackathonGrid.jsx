import React from 'react'
import HackathonCard from '../common/HackathonCard'

function HackathonGrid({ hackathons = [] }) {
  if (!hackathons.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h2 className="font-outfit text-2xl font-bold text-slate-950">No hackathons found</h2>
        <p className="mt-2 text-sm text-slate-600">Try a different keyword, mode, or team-size filter.</p>
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
