import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const cards = [
  { title: 'AI Hackathon', sub: 'Registration Open', x: '8%', y: '12%', delay: 0 },
  { title: 'Cloud Workshop', sub: 'Tomorrow', x: '72%', y: '8%', delay: 1.5 },
  { title: 'IEEE Student Chapter', sub: 'Active', x: '5%', y: '68%', delay: 3 },
  { title: 'Certificate Earned', sub: '✓ Verified', x: '75%', y: '72%', delay: 2 },
  { title: 'Open Source Sprint', sub: 'Starts Jan 15', x: '60%', y: '42%', delay: 4 },
  { title: 'Google Developer Group', sub: 'Meetup', x: '15%', y: '40%', delay: 2.5 },
];

export default function FloatingEventCards({ mouseX, mouseY }) {
  return (
    <>
      {cards.map((card, i) => {
        // Parallax offset from mouse — deeper cards move less
        const depth = 0.6 + (i % 3) * 0.2;
        const offsetX = useTransform(mouseX, (v) => v * depth * 12);
        const offsetY = useTransform(mouseY, (v) => v * depth * 12);

        return (
          <motion.div
            key={card.title}
            className="absolute pointer-events-none select-none"
            style={{
              left: card.x,
              top: card.y,
              x: offsetX,
              y: offsetY,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.25, 0.45, 0.25],
              scale: 1,
              y: [0, -8 - i * 2, 0],
            }}
            transition={{
              opacity: {
                duration: 6 + i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: card.delay,
              },
              y: {
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: card.delay,
              },
              scale: { duration: 0.6, delay: card.delay * 0.3 },
            }}
          >
            <div className="w-36 rounded-xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm p-3 shadow-lg">
              <p className="text-[11px] font-bold text-white/70 truncate">{card.title}</p>
              <p className="text-[9px] font-medium text-white/40 mt-0.5">{card.sub}</p>
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
