import React from 'react'
import EventCard from '../common/EventCard'

function FeaturedStrip({ event }) {
  if (!event) return null

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-primary">Featured</p>
        <h2 className="mt-1 font-outfit text-3xl font-bold text-theme-text">Recommended for builders</h2>
      </div>
      <EventCard event={event} featured />
    </section>
  )
}

export default FeaturedStrip
