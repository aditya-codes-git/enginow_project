import React from 'react'
import EventCard from '../common/EventCard'

function EventGrid({ events = [] }) {
  if (!events.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h2 className="font-outfit text-2xl font-bold text-slate-950">No events match this search</h2>
        <p className="mt-2 text-sm text-slate-600">Try a different keyword, mode, or status filter.</p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id || event.title} event={event} />
      ))}
    </section>
  )
}

export default EventGrid
