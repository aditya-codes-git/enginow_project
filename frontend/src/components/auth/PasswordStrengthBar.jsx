import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

function getStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score: 2, label: 'Fair', color: '#f97316' };
  if (score === 3) return { score: 3, label: 'Medium', color: '#eab308' };
  if (score === 4) return { score: 4, label: 'Strong', color: '#22c55e' };
  return { score: 5, label: 'Very Strong', color: '#10b981' };
}

export default function PasswordStrengthBar({ password }) {
  const { score, label, color } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-1.5 pt-1"
    >
      {/* Progress bar track */}
      <div className="h-1.5 rounded-full bg-theme-border/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(score / 5) * 100}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-theme-text-muted">
          Password Strength
        </span>
        <motion.span
          key={label}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
}
