import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle2, CalendarDays, Swords, Trophy,
  ArrowRight, ShieldCheck, Zap, Award, Users, LayoutGrid,
  Star, ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Journey Steps (left timeline) ───────────────────────────────────────────
const STEPS = [
  {
    icon: Search,
    label: 'Discover',
    color: 'text-blue-500',
    ring: 'ring-blue-500/20',
    bg: 'bg-blue-500/10',
    description: 'Browse hackathons, workshops, competitions, internships and campus events.',
  },
  {
    icon: CheckCircle2,
    label: 'Register',
    color: 'text-emerald-500',
    ring: 'ring-emerald-500/20',
    bg: 'bg-emerald-500/10',
    description: 'Join with one click and receive instant confirmation.',
  },
  {
    icon: CalendarDays,
    label: 'Prepare',
    color: 'text-violet-500',
    ring: 'ring-violet-500/20',
    bg: 'bg-violet-500/10',
    description: 'Track deadlines, schedules, announcements and resources.',
  },
  {
    icon: Swords,
    label: 'Participate',
    color: 'text-orange-500',
    ring: 'ring-orange-500/20',
    bg: 'bg-orange-500/10',
    description: 'Attend events, collaborate with teammates and compete.',
  },
  {
    icon: Trophy,
    label: 'Achieve',
    color: 'text-amber-500',
    ring: 'ring-amber-500/20',
    bg: 'bg-amber-500/10',
    description: 'Earn certificates, badges and build your profile.',
  },
];

// ─── Journey cards (right mockup) ────────────────────────────────────────────
const JOURNEY_CARDS = [
  {
    step: 0,
    header: { icon: Search, label: 'Discover Events', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    content: (
      <div className="space-y-2">
        {['AI Hackathon 2026', 'Web Dev Bootcamp', 'UI/UX Design Challenge'].map((name, i) => (
          <div
            key={name}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-theme-border bg-theme-bg/80 hover:bg-theme-bg transition-colors duration-150"
          >
            <span className="text-xs font-semibold text-theme-text">{name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-theme-text-muted" />
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 1,
    header: { icon: CheckCircle2, label: 'Registration Successful', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    content: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-emerald-200/40 bg-emerald-500/8">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-theme-text">AI Hackathon 2026</p>
            <p className="text-[11px] text-theme-text-muted mt-0.5">Starts in 4 Days · Remote</p>
          </div>
        </div>
        <button className="w-full text-[11px] font-bold text-blue-600 border border-blue-200/50 bg-blue-50/50 hover:bg-blue-50 rounded-lg py-2 transition-colors duration-150">
          View Event Details →
        </button>
      </div>
    ),
  },
  {
    step: 2,
    header: { icon: CalendarDays, label: 'Event Timeline', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    content: (
      <div className="space-y-2">
        {[
          { label: 'Team Formation', done: true },
          { label: 'Submission Guide', done: true },
          { label: 'Hackathon Starts Tomorrow', done: false, highlight: true },
        ].map(({ label, done, highlight }) => (
          <div
            key={label}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border ${
              highlight
                ? 'border-violet-300/40 bg-violet-500/8 text-violet-600'
                : 'border-theme-border bg-theme-bg/60 text-theme-text-secondary'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 shrink-0 ${done ? 'text-emerald-500' : highlight ? 'text-violet-400' : 'text-theme-text-muted/40'}`}
            />
            <span className={`text-xs font-semibold ${highlight ? 'text-violet-600' : ''}`}>{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 3,
    header: { icon: Swords, label: 'Live Now — Competing', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    content: (
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Team Members', value: '4' },
            { label: 'Submissions', value: '1 / 3' },
            { label: 'Hours Left', value: '18h' },
            { label: 'Your Rank', value: '#42' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-theme-border bg-theme-bg/70 px-3 py-2">
              <p className="text-[10px] text-theme-text-muted font-medium">{label}</p>
              <p className="text-sm font-bold text-theme-text font-outfit mt-0.5">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-orange-500/8 border border-orange-300/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-[11px] font-bold text-orange-600">Hackathon is live</span>
        </div>
      </div>
    ),
  },
  {
    step: 4,
    header: { icon: Trophy, label: 'Congratulations! 🎉', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    content: (
      <div className="space-y-2.5">
        <div className="rounded-xl border border-amber-300/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 text-center space-y-1">
          <Trophy className="w-7 h-7 text-amber-500 mx-auto" />
          <p className="text-sm font-extrabold text-theme-text font-outfit">Certificate Earned</p>
          <p className="text-[11px] text-theme-text-muted">AI Hackathon 2026 · Participant</p>
        </div>
        <button className="w-full text-[11px] font-bold text-amber-600 border border-amber-200/50 bg-amber-50/50 hover:bg-amber-50 rounded-lg py-2 transition-colors duration-150 flex items-center justify-center gap-1.5">
          <Star className="w-3.5 h-3.5" /> Share Achievement
        </button>
      </div>
    ),
  },
];

// ─── Trust indicators ─────────────────────────────────────────────────────────
const TRUST = [
  { icon: LayoutGrid, label: 'Thousands of active events' },
  { icon: ShieldCheck, label: 'Verified organizers' },
  { icon: Zap, label: 'Instant registration' },
  { icon: Award, label: 'Digital certificates' },
];

// ─── Framer variants ──────────────────────────────────────────────────────────
const stepVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  }),
};

const cardVariant = {
  enter: { opacity: 0, y: 16, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.25 } },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticipantJourneySection() {
  const { theme } = useTheme();
  const [activeCard, setActiveCard] = useState(0);

  // Auto-advance every 3.2 s
  const advance = useCallback(() => {
    setActiveCard((prev) => (prev + 1) % JOURNEY_CARDS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(advance, 3200);
    return () => clearInterval(t);
  }, [advance]);

  const card = JOURNEY_CARDS[activeCard];
  const CardIcon = card.header.icon;

  return (
    <section className="py-20 md:py-28 bg-theme-surface relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute left-0 top-1/4 w-[420px] h-[420px] bg-blue-500/[0.04] rounded-full blur-[90px] -z-10 pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-[320px] h-[320px] bg-violet-500/[0.04] rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-14 md:mb-18 space-y-3"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-theme-primary font-outfit">
            For Participants
          </span>
          <h2 className="heading-clear font-outfit font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-theme-text max-w-xl">
            Everything You Need{' '}
            <span className="text-gradient-clear">To Discover &amp; Win</span>
          </h2>
          <p className="text-theme-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl">
            Find hackathons, workshops, internships, competitions, and campus events — all in one place.
            Register in seconds, stay updated, and earn certificates as you grow.
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">

          {/* LEFT: Vertical timeline */}
          <div className="lg:col-span-5 space-y-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeCard;
              return (
                <motion.div
                  key={step.label}
                  custom={i}
                  variants={stepVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex gap-4 cursor-pointer group"
                  onClick={() => setActiveCard(i)}
                >
                  {/* Icon column + connector line */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-2 transition-all duration-300 ${
                        isActive ? `${step.bg} ${step.ring} shadow-sm` : 'bg-theme-bg/70 ring-theme-border/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? step.color : 'text-theme-text-muted'} transition-colors duration-300`} />
                    </motion.div>

                    {/* Connector */}
                    {i < STEPS.length - 1 && (
                      <div className="relative w-[2px] flex-1 my-1 min-h-[32px] bg-theme-border/40 overflow-hidden rounded-full">
                        <motion.div
                          className="absolute inset-x-0 top-0 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"
                          animate={{ height: activeCard > i ? '100%' : '0%' }}
                          transition={{ duration: 0.45, ease: 'easeInOut' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className={`pb-8 ${i === STEPS.length - 1 ? 'pb-0' : ''} pt-1`}>
                    <h3
                      className={`font-outfit font-bold text-base transition-colors duration-300 ${
                        isActive ? 'text-theme-text' : 'text-theme-text-secondary group-hover:text-theme-text'
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p
                      className={`text-[13px] leading-relaxed mt-1 transition-all duration-300 ${
                        isActive ? 'text-theme-text-secondary max-h-20 opacity-100' : 'text-theme-text-muted max-h-0 opacity-0 overflow-hidden group-hover:max-h-20 group-hover:opacity-100'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-3 pt-6"
            >
              <Link
                to="/events"
                style={{
                  backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                  color: theme.colors.textOnPrimary || '#ffffff',
                }}
                className="group inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:opacity-95 hover:-translate-y-0.5 text-sm"
              >
                Explore Events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/hackathons"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl border border-theme-border bg-theme-bg hover:bg-theme-bg/80 text-theme-text text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Categories
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Auto-advancing journey card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            {/* Step dot progress indicator */}
            <div className="flex items-center gap-2">
              {JOURNEY_CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeCard
                      ? 'w-6 h-2 bg-blue-600'
                      : 'w-2 h-2 bg-theme-border hover:bg-theme-text-muted'
                  }`}
                  aria-label={`Journey step ${i + 1}`}
                />
              ))}
            </div>

            {/* Card window */}
            <div className="w-full bg-theme-bg border border-theme-border/80 rounded-2xl shadow-xl overflow-hidden">
              {/* Window chrome */}
              <div className="bg-theme-surface border-b border-theme-divider px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                    <span className="w-3 h-3 rounded-full bg-green-400 block" />
                  </div>
                  <span className="w-px bg-theme-border h-4 mx-1" />
                  <span className="text-[11px] font-bold text-theme-text-muted uppercase tracking-widest font-outfit">
                    enginow.com/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-300/30 rounded text-[9px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Live
                </div>
              </div>

              {/* Card content */}
              <div className="p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCard}
                    variants={cardVariant}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-3.5"
                  >
                    {/* Card header */}
                    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${card.header.bg}`}>
                      <CardIcon className={`w-4.5 h-4.5 ${card.header.color} shrink-0`} />
                      <span className={`text-[13px] font-bold ${card.header.color}`}>
                        {card.header.label}
                      </span>
                    </div>

                    {/* Card body */}
                    {card.content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1"
            >
              {TRUST.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-bg transition-colors duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                  <span className="text-[11px] font-semibold text-theme-text-secondary leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
