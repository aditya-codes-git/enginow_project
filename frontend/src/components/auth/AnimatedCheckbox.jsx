import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function AnimatedCheckbox({ checked, onChange, children }) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2.5 cursor-pointer group select-none"
    >
      {/* Custom checkbox */}
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          aria-checked={checked}
        />
        <motion.div
          className={`w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-colors duration-150 ${
            checked
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
              : 'border-theme-border bg-theme-bg group-hover:border-theme-text-muted/50'
          }`}
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <motion.div
            initial={false}
            animate={checked ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
      </div>

      {/* Label text */}
      <span className="text-xs font-semibold leading-5 text-theme-text-secondary">
        {children}
      </span>
    </label>
  );
}
