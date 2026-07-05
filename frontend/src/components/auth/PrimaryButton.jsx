import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function PrimaryButton({
  children,
  loading = false,
  success = false,
  disabled = false,
  type = 'submit',
  onClick,
}) {
  const isDisabled = disabled || loading || success;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-xl py-3 px-6 text-sm font-semibold shadow-lg transition-shadow duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--text-on-primary)',
      }}
      whileHover={!isDisabled ? {
        y: -2,
        boxShadow: '0 12px 28px -4px rgba(var(--color-primary-rgb), 0.35)',
      } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '100%', opacity: 0.12 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent, white, transparent)',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{children}</span>
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Success!</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <motion.span
              className="inline-flex"
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  );
}
