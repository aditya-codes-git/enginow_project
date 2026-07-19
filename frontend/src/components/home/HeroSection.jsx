import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users } from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

export default function HeroSection() {
  const { theme } = useTheme();
  const [mockupState, setMockupState] = useState('normal');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMockupState('closed');
    setTimeout(() => {
      setMockupState('normal');
      setIsAnimating(false);
    }, 1500);
  };

  const handleMinimize = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMockupState('minimized');
    setTimeout(() => {
      setMockupState('normal');
      setIsAnimating(false);
    }, 1500);
  };

  const handleMaximize = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMockupState('maximized');
    setTimeout(() => {
      setMockupState('normal');
      setIsAnimating(false);
    }, 1500);
  };
  
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
      {/* Animated Background Orbs */}
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
            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="heading-clear font-outfit text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-theme-text"
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
              className="text-theme-text-secondary text-base sm:text-lg leading-relaxed max-w-lg font-normal"
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
                style={{
                  backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                  color: theme.colors.textOnPrimary || '#ffffff',
                }}
                className="group relative inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:opacity-95"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
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
              <motion.div
                animate={mockupState}
                variants={{
                  normal: { scale: 1, opacity: 1, y: 0 },
                  closed: { scale: 0.92, opacity: 0, y: 15 },
                  minimized: { scale: 0.95, opacity: 0.6, y: 10 },
                  maximized: { scale: 1.04, opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-theme-surface border border-theme-border/80 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.12)] overflow-hidden origin-center"
              >
                
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-theme-bg border-b border-theme-divider">
                  <div className="flex gap-1.5 group/controls">
                    {/* Red button */}
                    <button
                      onClick={handleClose}
                      disabled={isAnimating}
                      className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 group-hover/controls:bg-[#FF5F57] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-[#FF5F57]/50 focus:outline-none focus:ring-1 focus:ring-red-400"
                      aria-label="Close window"
                    >
                      <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 text-red-950/70 opacity-0 group-hover/controls:opacity-100 transition-opacity duration-200 stroke-current stroke-[1.5]">
                        <line x1="1" y1="1" x2="5" y2="5" />
                        <line x1="5" y1="1" x2="1" y2="5" />
                      </svg>
                    </button>
                    {/* Yellow button */}
                    <button
                      onClick={handleMinimize}
                      disabled={isAnimating}
                      className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 group-hover/controls:bg-[#FEBC2E] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-[#FEBC2E]/50 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      aria-label="Minimize window"
                    >
                      <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 text-yellow-950/70 opacity-0 group-hover/controls:opacity-100 transition-opacity duration-200 stroke-current stroke-[1.5]">
                        <line x1="1" y1="3" x2="5" y2="3" />
                      </svg>
                    </button>
                    {/* Green button */}
                    <button
                      onClick={handleMaximize}
                      disabled={isAnimating}
                      className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 group-hover/controls:bg-[#28C840] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-[#28C840]/50 focus:outline-none focus:ring-1 focus:ring-green-400"
                      aria-label="Maximize window"
                    >
                      <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 text-green-950/70 opacity-0 group-hover/controls:opacity-100 transition-opacity duration-200 fill-current">
                        <polygon points="1,1 3,1 1,3" />
                        <polygon points="5,5 3,5 5,3" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-theme-surface border border-theme-border rounded-lg px-3 py-1 text-[11px] text-theme-text-muted font-medium text-center">
                      enginow.com/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-5 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'My Registrations', value: '—', sub: 'Events Joined' },
                      { label: 'Upcoming Events', value: '—', sub: 'This month' },
                      { label: 'Certificates', value: '—', sub: 'Earned' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-theme-bg/80 border border-theme-divider rounded-xl p-3 space-y-1">
                        <span className="text-[9px] font-bold text-theme-text-muted uppercase tracking-wide truncate block">{stat.label}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-theme-text font-outfit">{stat.value}</span>
                          <span className="text-[9px] font-semibold text-theme-text-muted whitespace-nowrap">{stat.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-theme-bg/50 border border-theme-divider rounded-xl p-4 h-32 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold text-theme-text-secondary uppercase tracking-wide">Participation Activity</span>
                      <span className="text-[10px] font-medium text-theme-primary bg-blue-50 px-2 py-0.5 rounded-full">Live</span>
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
                  <div className="bg-theme-surface border border-theme-divider rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-theme-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-theme-text-secondary">Application Tracker</p>
                        <p className="text-[10px] text-theme-text-muted">3 of 6 applications completed</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-theme-primary bg-blue-50 px-2.5 py-1 rounded-full">In Progress</span>
                  </div>

                  {/* Participant Preview */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['bg-blue-500', 'bg-cyan-500', 'bg-slate-400', 'bg-theme-primary'].map((c, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center`}>
                          <Users className="w-3.5 h-3.5 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-theme-text-muted font-medium">Friends participating…</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-theme-divider grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto lg:mx-0 lg:max-w-none"
        >
          {[
            { value: '1000+', label: 'Events Hosted' },
            { value: '25K+', label: 'Active Students' },
            { value: '300+', label: 'Organisers' },
            { value: '50+', label: 'Colleges' },
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left space-y-1">
              <p className="font-outfit text-2xl sm:text-3xl font-bold text-theme-text">{stat.value}</p>
              <p className="text-xs font-semibold text-theme-text-muted tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade mask */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-theme-bg to-transparent pointer-events-none z-10" />
    </section>
  );
}
