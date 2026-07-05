import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Code2, Trophy, Users } from 'lucide-react'

function formatDate(value) {
  if (!value) return 'Announced soon'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function HackathonCard({ hackathon }) {
  const safeHackathon = hackathon || {}
  const coverImage = safeHackathon.coverImage || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d'
  const hasPrize = safeHackathon.prizes && safeHackathon.prizes.length > 0

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      {/* Image */}
      <Link to={`/hackathons/${safeHackathon.slug || safeHackathon.id || ''}`} className="relative block w-full aspect-[16/10] overflow-hidden">
        <img src={coverImage} alt={safeHackathon.title || 'Hackathon cover'} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

        {/* Mode Badge */}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-sm shadow-sm">
          {safeHackathon.mode || 'Online'}
        </span>

        {/* Prize Badge (if available) */}
        {hasPrize && (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Prizes
          </span>
        )}

        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer-overlay bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="space-y-2.5">
          {/* Type indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-cyan-600">Hackathon</p>
          </div>
          <Link to={`/hackathons/${safeHackathon.slug || safeHackathon.id || ''}`}>
            <h3 className="font-outfit text-xl sm:text-2xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">{safeHackathon.title || 'Untitled hackathon'}</h3>
          </Link>
          <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">{safeHackathon.tagline || safeHackathon.description || 'Build, submit, and compete with teams across focused innovation tracks.'}</p>
        </div>

        {/* Stats Row — inline, lighter */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{safeHackathon.registrations || 0} registered</span>
          </span>
          <span className="w-px h-3.5 bg-slate-200" />
          <span className="flex items-center gap-1.5 font-medium">
            <Code2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{safeHackathon.submissions || 0} projects</span>
          </span>
          <span className="w-px h-3.5 bg-slate-200" />
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{safeHackathon.teamSizeLabel || '1-6'}</span>
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-slate-100/60">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            <span>Deadline: {formatDate(safeHackathon.registrationDeadline)}</span>
          </div>
          <Link to={`/hackathons/${safeHackathon.slug || safeHackathon.id || ''}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group/link">
            Explore
            <ArrowRight className="h-3.5 w-3.5 translate-x-0 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default HackathonCard
