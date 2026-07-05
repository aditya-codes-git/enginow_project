import React from 'react';
import { motion, useTransform } from 'framer-motion';
import enginowIcon from '../../assets/enginow_icon.png';

const orbitItems = [
  { emoji: '🏆', label: 'Trophy', angle: 0 },
  { emoji: '💻', label: 'Laptop', angle: 60 },
  { emoji: '🎟️', label: 'Ticket', angle: 120 },
  { emoji: '📜', label: 'Certificate', angle: 180 },
  { emoji: '🚀', label: 'Rocket', angle: 240 },
  { emoji: '👥', label: 'Community', angle: 300 },
];

const ORBIT_RADIUS = 130;

export default function OrbitSystem({ mouseX, mouseY }) {
  // Mouse parallax for the whole system
  const systemX = useTransform(mouseX, (v) => v * 8);
  const systemY = useTransform(mouseY, (v) => v * 8);

  return (
    <motion.div
      className="relative w-[320px] h-[320px] flex-shrink-0"
      style={{ x: systemX, y: systemY }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.08) 0%, transparent 70%)',
      }} />

      {/* Pulsing glow */}
      <motion.div
        className="absolute inset-8 rounded-full"
        animate={{
          boxShadow: [
            '0 0 40px 8px rgba(var(--color-primary-rgb), 0.1)',
            '0 0 60px 16px rgba(var(--color-primary-rgb), 0.18)',
            '0 0 40px 8px rgba(var(--color-primary-rgb), 0.1)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center logo */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/[0.08] flex items-center justify-center shadow-2xl"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={enginowIcon}
            alt="EngiNow"
            className="w-12 h-12 object-contain"
          />
        </motion.div>
      </div>

      {/* Orbiting items */}
      {orbitItems.map((item, i) => {
        const angleRad = (item.angle * Math.PI) / 180;
        const cx = 160 + ORBIT_RADIUS * Math.cos(angleRad) - 20;
        const cy = 160 + ORBIT_RADIUS * Math.sin(angleRad) - 20;

        // Per-item mouse offset
        const itemX = useTransform(mouseX, (v) => v * (2 + i * 0.5));
        const itemY = useTransform(mouseY, (v) => v * (2 + i * 0.5));

        return (
          <motion.div
            key={item.label}
            className="absolute w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] shadow-lg cursor-default"
            style={{
              left: cx,
              top: cy,
              x: itemX,
              y: itemY,
            }}
            animate={{
              y: [0, -6 - i, 0],
              rotate: [0, 4 - i, 0],
            }}
            transition={{
              duration: 4 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
            whileHover={{ scale: 1.2, boxShadow: '0 0 20px rgba(var(--color-primary-rgb), 0.3)' }}
            title={item.label}
            aria-label={item.label}
          >
            <span className="text-lg select-none" role="img" aria-label={item.label}>
              {item.emoji}
            </span>
          </motion.div>
        );
      })}

      {/* Orbit ring (decorative) */}
      <div
        className="absolute rounded-full border border-white/[0.04] pointer-events-none"
        style={{
          width: ORBIT_RADIUS * 2,
          height: ORBIT_RADIUS * 2,
          left: 160 - ORBIT_RADIUS,
          top: 160 - ORBIT_RADIUS,
        }}
      />
    </motion.div>
  );
}
