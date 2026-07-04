import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, Sparkles, Users, Zap } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const mockVariants = {
    hidden: { opacity: 0, y: 40, rotateY: 5 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
    },
  };

  return (
    <section className="relative pt-28 pb-6 md:pt-32 md:pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-mesh bg-grid-pattern min-h-[85vh] flex items-center">
      {/* Animated Background Orbs — subtle, not glowing balls */}
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[100px] animate-drift pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-[5%] w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[100px] animate-drift-slow pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Asymmetric Split: Text + Dashboard Mock */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

          {/* Left: Headline & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 md:space-y-8"
          >
            {/* Eyebrow Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white/80 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Platform for engineering communities
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="heading-clear font-outfit text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900"
            >
              Discover, register &{' '}
              <span className="text-gradient-clear from-blue-600 via-blue-500 to-cyan-500">
                compete
              </span>{' '}
              in engineering events.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg font-normal"
            >
              Find hackathons, coding contests, workshops, and career events from trusted colleges and communities — all in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 pt-1"
            >
              <Link
                to="/events"
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/become-organiser"
                className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
              >
                Host an Event
              </Link>
            </motion.div>

            {/* Event Preview Ticker — generic, no fake data */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2.5 pt-3"
            >
              {[
                { label: 'Hackathons', icon: Zap, accent: 'text-amber-600 bg-amber-50 border-amber-100' },
                { label: 'Workshops', icon: FileText, accent: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Competitions', icon: Sparkles, accent: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${tag.accent}`}
                >
                  <tag.icon className="w-3.5 h-3.5" />
                  {tag.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Preview Mock */}
          <motion.div
            variants={mockVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Shadow underneath for depth */}
              <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/[0.03] to-transparent rounded-3xl blur-2xl pointer-events-none" />

              {/* Main Window */}
              <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.12)] overflow-hidden">

                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-200 block" />
                    <span className="w-3 h-3 rounded-full bg-slate-200 block" />
                    <span className="w-3 h-3 rounded-full bg-slate-200 block" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-[11px] text-slate-400 font-medium text-center">
                      enginow.com/organiser
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-5 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Registrations', value: '—', sub: 'Total' },
                      { label: 'Page Views', value: '—', sub: 'This month' },
                      { label: 'Events', value: '—', sub: 'Published' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-slate-800 font-outfit">{stat.value}</span>
                          <span className="text-[10px] text-slate-400">{stat.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 h-32 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Registrations</span>
                      <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    {/* SVG area chart */}
                    <svg viewBox="0 0 300 60" className="w-full h-14" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 50 C 30 45, 60 40, 90 35 C 120 30, 150 25, 180 20 C 210 15, 240 12, 270 8 L 300 5 L 300 60 L 0 60 Z"
                        fill="url(#heroChartGrad)"
                      />
                      <path
                        d="M0 50 C 30 45, 60 40, 90 35 C 120 30, 150 25, 180 20 C 210 15, 240 12, 270 8 L 300 5"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                      <circle cx="270" cy="8" r="3" className="fill-blue-500 stroke-white stroke-2" />
                    </svg>
                  </div>

                  {/* Event Row */}
                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Event Setup Wizard</p>
                        <p className="text-[10px] text-slate-400">Step 3 of 6 — Configure tracks</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">In Progress</span>
                  </div>

                  {/* Participant Preview */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['bg-blue-500', 'bg-cyan-500', 'bg-slate-400', 'bg-blue-600'].map((c, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                          <Users className="w-3 h-3 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Participants joining…</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Full-Width Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto lg:mx-0 lg:max-w-none"
        >
          {[
            { value: '1000+', label: 'Events Hosted' },
            { value: '25K+', label: 'Active Students' },
            { value: '300+', label: 'Organisers' },
            { value: '50+', label: 'Colleges' },
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left space-y-1">
              <p className="font-outfit text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-400 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Bottom fade mask */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </section>
  );
}
