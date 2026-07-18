/**
 * FluidDropdown — generic animated dropdown built with framer-motion.
 * Adapted from fluid-dropdown.tsx (TypeScript → plain JSX for this project).
 *
 * Props:
 *   trigger      ReactNode   – Content shown in the closed trigger button
 *   items        Array       – List of { id, ...rest } objects to render
 *   selectedId   string      – Currently selected item id
 *   onSelect     fn(item)    – Called when user picks an item
 *   renderItem   fn(item, isHovered, isSelected) → ReactNode
 *   triggerStyle object      – Inline style applied to the trigger button
 *   panelStyle   object      – Inline style applied to the dropdown panel
 *   className    string      – Extra class on root wrapper
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ── click-outside hook ────────────────────────────────────────────────
function useClickAway(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ── animation variants ─────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── main component ─────────────────────────────────────────────────────
export function FluidDropdown({
  trigger,
  items = [],
  selectedId,
  onSelect,
  renderItem,
  triggerStyle = {},
  panelStyle = {},
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const dropdownRef = useRef(null);

  useClickAway(dropdownRef, () => setIsOpen(false));

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  // Index of whichever item is currently highlighted (hovered or selected)
  const highlightIndex = items.findIndex(
    (item) => (hoveredId ?? selectedId) === item.id,
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`relative ${className || 'w-full'}`}
        ref={dropdownRef}
        onKeyDown={handleKeyDown}
      >
        {/* ── Trigger ── */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          style={triggerStyle}
          className="flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2"
        >
          <span className="flex items-center gap-2 min-w-0 truncate">
            {trigger}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex shrink-0 items-center justify-center"
          >
            <ChevronDown className="h-4 w-4 opacity-60" />
          </motion.span>
        </button>

        {/* ── Panel ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: { type: 'spring', stiffness: 500, damping: 30, mass: 1 },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: { type: 'spring', stiffness: 500, damping: 30, mass: 1 },
              }}
              className="absolute left-0 right-0 top-full mt-2 z-[300] overflow-hidden"
            >
              <motion.div
                style={panelStyle}
                className="w-full rounded-xl border p-1 shadow-2xl"
                initial={{ borderRadius: 10 }}
                animate={{ borderRadius: 14, transition: { duration: 0.2 } }}
              >
                <motion.div
                  role="listbox"
                  className="relative py-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Sliding highlight pill */}
                  {highlightIndex >= 0 && (
                    <motion.div
                      layoutId="fluid-dropdown-highlight"
                      className="absolute inset-x-1 rounded-lg"
                      style={{ height: 40, backgroundColor: 'rgba(128,128,128,0.15)' }}
                      animate={{ y: highlightIndex * 40 }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                    />
                  )}

                  {/* Items */}
                  {items.map((item) => {
                    const isHovered = hoveredId === item.id;
                    const isSelected = selectedId === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        role="option"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => {
                          onSelect(item);
                          setIsOpen(false);
                        }}
                        onHoverStart={() => setHoveredId(item.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        variants={itemVariants}
                        whileTap={{ scale: 0.97 }}
                        className="relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-100 focus:outline-none"
                        style={{ height: 40 }}
                      >
                        {renderItem(item, isHovered, isSelected)}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export default FluidDropdown;
