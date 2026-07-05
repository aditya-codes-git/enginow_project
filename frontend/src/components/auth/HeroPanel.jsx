import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import EcosystemNetwork from './EcosystemNetwork';
import InteractiveSearchConsole from './InteractiveSearchConsole';

const updates = [
  'IIT Bombay published a new Hackathon',
  'IEEE Workshop registrations opened',
  'Google Developer Group joined EngiNow',
  '142 students registered for Open Source Sprint',
];

export default function HeroPanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % updates.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hidden lg:flex relative flex-col items-center justify-between py-14 px-8 overflow-hidden select-none bg-theme-bg border-r border-theme-border/60">
      {/* Subtle background network mesh */}
      <EcosystemNetwork />

      {/* Top Section: Branding & Info */}
      <div className="w-full max-w-[380px] text-center space-y-4 mt-8 relative z-10">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-theme-text-muted bg-theme-bg-secondary/80 border border-theme-border/50 px-3 py-1 rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-theme-primary" />
            Verified Campus Chapters
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text font-outfit">
            Find your next opportunity.
          </h1>
          <p className="text-[12px] leading-5 text-theme-text-secondary font-medium">
            Engineering events, hackathons, workshops and communities — all in one place.
          </p>
        </div>
      </div>

      {/* Middle Section: Realistic Interactive Search */}
      <div className="relative z-10 w-full flex justify-center py-6">
        <InteractiveSearchConsole />
      </div>

      {/* Bottom Section: Subtle Live Feed */}
      <div className="w-full max-w-[380px] relative z-10">
        <div className="rounded-xl border border-theme-border/60 bg-theme-surface shadow-sm p-3.5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live feed
          </div>

          <div className="flex-1 pl-4 h-full relative overflow-hidden flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute text-[11px] font-semibold text-theme-text-secondary truncate max-w-[200px]"
              >
                {updates[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
