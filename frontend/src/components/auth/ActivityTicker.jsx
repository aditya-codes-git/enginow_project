import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const activities = [
  'IIT Bombay published a new Hackathon',
  'IEEE Workshop registrations opened',
  '1,240 students registered today',
  'New AI Challenge added to the platform',
  'CSI Chapter joined EngiNow',
  'Cloud Computing Bootcamp went live',
  'Google Developer Group hosted a meetup',
  '500+ teams formed for CodeSprint',
];

export default function ActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center gap-2 text-[12px] font-medium text-white/60"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" />
          <span className="truncate">{activities[index]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
