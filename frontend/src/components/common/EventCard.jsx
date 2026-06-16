import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'

function formatDate(value) {
  if (!value) return 'Date to be announced'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function EventCard({ event, featured = false }) {
  const safeEvent = event || {}
  const detailPath = `/events/${safeEvent.id || ''}`
  const coverImage = safeEvent.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
  const tracks = (safeEvent.track || 'Community').split(',').slice(0, 3)

  return (
    <article className={`group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)] ${featured ? 'lg:grid lg:grid-cols-[1.05fr_1fr]' : ''}`}>
      {/* Image */}
      <Link to={detailPath} className={`relative block w-full overflow-hidden ${featured ? 'lg:aspect-auto aspect-[16/10]' : 'aspect-[16/10]'}`}>
        <img src={coverImage} alt={safeEvent.title || 'Event cover'} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        {/* Mode Badge */}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-sm shadow-sm">
          {safeEvent.mode || 'Hybrid'}
        </span>

        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer-overlay bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />
      </Link>

      {/* Content */}
      <div className="flex h-full flex-col justify-between gap-5 p-5 sm:p-6">
        <div className="space-y-3">
          {/* Type + Title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">{safeEvent.type || 'Event'}</p>
            </div>
            <Link to={detailPath}>
              <h3 className="font-outfit text-xl sm:text-2xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{safeEvent.title || 'Untitled event'}</h3>
            </Link>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">{safeEvent.tagline || safeEvent.description || 'Discover sessions, speakers, and community experiences curated for builders.'}</p>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 pt-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
              <span>{formatDate(safeEvent.startDate)}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{safeEvent.location || safeEvent.city || 'Online'}</span>
            </span>
          </div>
        </div>

        {/* Footer: Tags + Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/60">
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((track) => (
              <span key={track.trim()} className="rounded-md border border-slate-200/80 bg-slate-50/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {track.trim()}
              </span>
            ))}
          </div>
          <Link to={detailPath} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group/link">
            View details
            <ArrowRight className="h-3.5 w-3.5 translate-x-0 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default EventCard
