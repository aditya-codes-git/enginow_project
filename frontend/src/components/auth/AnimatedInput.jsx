import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedInput({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  trailing,
  error,
  autoComplete,
  name,
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const isActive = focused || value?.length > 0;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-bold text-theme-text-secondary uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {/* Focus glow ring */}
        <motion.div
          className="absolute -inset-[1.5px] rounded-[14px] pointer-events-none"
          initial={false}
          animate={{
            opacity: focused ? 1 : 0,
            scale: focused ? 1 : 0.98,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--accent-hover))',
          }}
        />

        {/* Input container */}
        <div
          className={`relative flex items-center gap-2 rounded-xl border bg-theme-bg transition-colors duration-200 ${
            error
              ? 'border-theme-error'
              : focused
                ? 'border-transparent'
                : 'border-theme-border hover:border-theme-text-muted/40'
          }`}
        >
          {Icon && (
            <motion.span
              className="pl-3.5 text-theme-text-muted"
              animate={{ color: focused ? 'var(--color-primary)' : undefined }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-4 h-4" />
            </motion.span>
          )}

          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            name={name}
            className={`flex-1 bg-transparent py-2 text-sm font-medium text-theme-text placeholder:text-theme-text-muted/60 outline-none ${
              Icon ? 'pl-1' : 'pl-3.5'
            } ${trailing ? 'pr-1' : 'pr-3.5'}`}
          />

          {trailing && (
            <div className="pr-2">{trailing}</div>
          )}
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-theme-error pl-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
