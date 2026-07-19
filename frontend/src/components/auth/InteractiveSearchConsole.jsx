import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Users, Trophy, Code, Cpu } from 'lucide-react';

// ─── Predefined search queries ────────────────────────────────────────────────
const QUERIES = [
  {
    text: 'AI Hackathon',
    results: [{ title: 'Google AI Challenge', tag: 'Open', meta: '1,200 Participants', icon: Trophy }],
  },
  {
    text: 'IEEE Workshop',
    results: [{ title: 'IEEE Student Workshop', tag: 'Tomorrow', meta: 'RVCE Bangalore', icon: Users }],
  },
  {
    text: 'Smart India Hackathon',
    results: [{ title: 'SIH 2025 – Grand Finale', tag: 'Registering', meta: '40,000+ Students', icon: Trophy }],
  },
  {
    text: 'Machine Learning Workshop',
    results: [{ title: 'ML Bootcamp by GDSC', tag: 'Open', meta: '320 RSVPs', icon: Cpu }],
  },
  {
    text: 'Competitive Programming',
    results: [{ title: 'CodeChef Long Challenge', tag: 'Live', meta: 'Rating: All Levels', icon: Code }],
  },
  {
    text: 'Web Development Workshop',
    results: [{ title: 'Full-Stack Dev Bootcamp', tag: 'Open', meta: '180 Seats Left', icon: Calendar }],
  },
  {
    text: 'Blockchain Hackathon',
    results: [{ title: 'ETHIndia 2025', tag: 'Upcoming', meta: '2,500 Hackers', icon: Trophy }],
  },
  {
    text: 'Data Science Bootcamp',
    results: [{ title: 'Analytics Vidhya Bootcamp', tag: 'Open', meta: '500 Enrolled', icon: Cpu }],
  },
  {
    text: 'Flutter Hackathon',
    results: [{ title: 'FlutterFlow Buildathon', tag: 'Open', meta: '600 Participants', icon: Code }],
  },
  {
    text: 'Open Source Sprint',
    results: [{ title: 'Hacktoberfest Sprint', tag: 'Live', meta: 'Remote · Global', icon: Users }],
  },
];

// ─── Timing constants ─────────────────────────────────────────────────────────
const TYPE_MIN_MS   = 65;   // min ms per character typed
const TYPE_MAX_MS   = 105;  // max ms per character typed
const DELETE_MS     = 40;   // ms per character deleted
const PAUSE_AFTER_TYPE_MS   = 1800; // pause while results are shown
const PAUSE_AFTER_DELETE_MS = 500;  // pause before typing next query

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function InteractiveSearchConsole() {
  const [queryIndex, setQueryIndex]   = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isDeleting, setIsDeleting]   = useState(false);

  // Refs so the animation loop always reads the latest state without stale closures
  const stateRef = useRef({ queryIndex: 0, displayText: '', isDeleting: false, showResults: false });
  const timerRef = useRef(null);

  useEffect(() => {
    // Keep ref in sync
    stateRef.current = { queryIndex, displayText, isDeleting, showResults };
  });

  useEffect(() => {
    function tick() {
      const { queryIndex: qi, displayText: dt, isDeleting: del } = stateRef.current;
      const fullText = QUERIES[qi].text;

      if (!del) {
        // ── Typing phase ──
        if (dt.length < fullText.length) {
          const next = fullText.slice(0, dt.length + 1);
          setDisplayText(next);
          timerRef.current = setTimeout(tick, randomBetween(TYPE_MIN_MS, TYPE_MAX_MS));
        } else {
          // Finished typing → show results, pause, then start deleting
          setShowResults(true);
          timerRef.current = setTimeout(() => {
            setIsDeleting(true);
            setShowResults(false);
            timerRef.current = setTimeout(tick, DELETE_MS);
          }, PAUSE_AFTER_TYPE_MS);
        }
      } else {
        // ── Deleting phase ──
        if (dt.length > 0) {
          const next = dt.slice(0, dt.length - 1);
          setDisplayText(next);
          timerRef.current = setTimeout(tick, DELETE_MS);
        } else {
          // Finished deleting → pause then move to next query
          setIsDeleting(false);
          setQueryIndex((prev) => (prev + 1) % QUERIES.length);
          timerRef.current = setTimeout(tick, PAUSE_AFTER_DELETE_MS);
        }
      }
    }

    timerRef.current = setTimeout(tick, PAUSE_AFTER_DELETE_MS);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryIndex]); // Re-run the loop whenever queryIndex advances

  const activeQuery = QUERIES[queryIndex];

  return (
    <div className="w-full max-w-[360px] rounded-xl border border-theme-border/60 bg-theme-surface shadow-md p-4 space-y-4">
      {/* Search bar with blinking cursor */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-theme-bg border border-theme-border/40">
        <Search className="w-4 h-4 text-theme-text-muted flex-shrink-0" />
        <span className="text-sm font-semibold text-theme-text">
          {displayText}
          {/* Blinking cursor */}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-[2px] h-3.5 ml-0.5 bg-theme-text/70 align-middle rounded-full"
          />
        </span>
      </div>

      {/* Results box */}
      <div className="min-h-[148px] relative">
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key={`results-${queryIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              {activeQuery.results.map((res) => {
                const Icon = res.icon;
                return (
                  <div
                    key={res.title}
                    className="flex items-center justify-between p-3 rounded-lg border border-theme-border bg-theme-bg-secondary/40 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-theme-text">{res.title}</h4>
                        <p className="text-[10px] text-theme-text-muted mt-0.5">{res.meta}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-theme-primary bg-theme-primary/10 border border-theme-primary/15 px-2 py-0.5 rounded-full">
                      {res.tag}
                    </span>
                  </div>
                );
              })}

              {/* Ecosystem breadth row */}
              <div className="h-[1px] bg-theme-divider" />
              <div className="flex items-center gap-2 text-[10px] font-medium text-theme-text-muted px-1.5">
                <span>Also found:</span>
                <span className="bg-theme-bg px-1.5 py-0.5 rounded border border-theme-border/40">24 Hackathons</span>
                <span className="bg-theme-bg px-1.5 py-0.5 rounded border border-theme-border/40">18 Workshops</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-theme-text-muted"
            >
              {displayText.length > 0 ? 'Searching directory…' : 'Try searching for events…'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
