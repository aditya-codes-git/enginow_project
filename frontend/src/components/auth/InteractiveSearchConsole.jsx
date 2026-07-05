import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Users, Trophy } from 'lucide-react';

const mockQueries = [
  { text: 'AI Hackathon', results: [{ title: 'Google AI Challenge', tag: 'Open', meta: '1,200 Participants', icon: Trophy }] },
  { text: 'Cloud Workshop', results: [{ title: 'AWS Cloud Bootcamp', tag: 'Tomorrow', meta: '250 RSVPs', icon: Calendar }] },
  { text: 'IEEE Meetup', results: [{ title: 'IEEE Student Meetup', tag: 'Published', meta: 'RVCE Bangalore', icon: Users }] },
];

export default function InteractiveSearchConsole() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    let typeTimeout;
    let sequenceTimeout;

    const runSequence = () => {
      const currentQuery = mockQueries[queryIndex];
      let charIdx = 0;
      setTypedText('');
      setShowResults(false);

      // Typing simulation
      const typeNextChar = () => {
        if (charIdx < currentQuery.text.length) {
          setTypedText((prev) => prev + currentQuery.text[charIdx]);
          charIdx++;
          typeTimeout = setTimeout(typeNextChar, 100);
        } else {
          // Pause then show results
          typeTimeout = setTimeout(() => {
            setShowResults(true);
            // Wait, then transition to next query after display
            sequenceTimeout = setTimeout(() => {
              setQueryIndex((prev) => (prev + 1) % mockQueries.length);
            }, 4000);
          }, 500);
        }
      };

      typeNextChar();
    };

    runSequence();

    return () => {
      clearTimeout(typeTimeout);
      clearTimeout(sequenceTimeout);
    };
  }, [queryIndex]);

  const activeQuery = mockQueries[queryIndex];

  return (
    <div className="w-full max-w-[360px] rounded-xl border border-theme-border/60 bg-theme-surface shadow-md p-4 space-y-4">
      {/* Console Bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-theme-bg border border-theme-border/40">
        <Search className="w-4 h-4 text-theme-text-muted flex-shrink-0" />
        <span className="text-sm font-semibold text-theme-text">
          {typedText}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-1.5 h-3.5 ml-0.5 bg-theme-text/80 align-middle"
          />
        </span>
      </div>

      {/* Results Box */}
      <div className="min-h-[140px] relative">
        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key={queryIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-2.5"
            >
              {activeQuery.results.map((res, i) => {
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

              {/* Extra placeholder events representing ecosystem breadth */}
              <div className="h-[1px] bg-theme-divider my-2" />
              <div className="flex items-center gap-2 text-[10px] font-medium text-theme-text-muted px-1.5">
                <span>Other events matching queries:</span>
                <span className="bg-theme-bg px-1.5 py-0.5 rounded border border-theme-border/40">24 Hackathons</span>
                <span className="bg-theme-bg px-1.5 py-0.5 rounded border border-theme-border/40">18 Workshops</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-theme-text-muted"
            >
              Searching directory...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
