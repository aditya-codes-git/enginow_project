import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarPlus } from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

export default function CTASection() {
  const { theme, currentTheme } = useTheme();
  const isLight = currentTheme !== 'dark';

  return (
    <section className="py-20 md:py-24 bg-theme-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className={`relative rounded-3xl py-16 px-6 sm:px-12 md:py-20 text-center overflow-hidden transition-all duration-300 ${
            isLight
              ? 'bg-slate-50 border border-slate-200/80 shadow-2xl shadow-slate-100'
              : 'bg-[#111111] border border-[#2C2C2C]'
          }`}
        >
          {/* Dot grid texture */}
          <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            isLight ? 'bg-grid-pattern opacity-[0.25]' : 'bg-dot-grid-dark opacity-[0.4]'
          }`} />

          {/* Subtle ambient shapes — light mode only */}
          {isLight && (
            <>
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/[0.06] rounded-full blur-[80px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/[0.05] rounded-full blur-[80px] pointer-events-none translate-x-1/4 translate-y-1/4" />
            </>
          )}
          
          <div className="relative max-w-2xl mx-auto space-y-6 md:space-y-8 z-10">
            {/* Headline */}
            <h3 className={`heading-clear font-outfit font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight transition-colors duration-300 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Ready to discover your next opportunity?
            </h3>
            
            {/* Subheading */}
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg mx-auto transition-colors duration-300 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Join thousands of engineering students discovering events that help them build skills and launch careers.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
              <Link
                to="/events"
                style={{
                  backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                  color: theme.colors.textOnPrimary || '#ffffff',
                }}
                className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/hackathons"
                className={`inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100/80 text-slate-800 border-slate-200 shadow-sm'
                    : 'bg-[#1b1b1b] hover:bg-[#222222] text-white border-[#2C2C2C] hover:border-[#2A2A2A]'
                }`}
              >
                <CalendarPlus className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                <span>Browse Hackathons</span>
              </Link>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

