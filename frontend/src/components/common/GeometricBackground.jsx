import React from 'react';
import { motion } from 'framer-motion';

export default function GeometricBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full border border-blue-500/15"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute right-[-120px] top-12 h-[28rem] w-[28rem] rounded-full border border-cyan-400/10"
      />

      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 left-12 h-40 w-40 rotate-12 border border-blue-400/10"
      />

      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-20 h-28 w-28 rounded-2xl border border-sky-300/10"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08),transparent_24%)]" />
    </div>
  );
}