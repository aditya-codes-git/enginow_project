import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Quote } from 'lucide-react';

import { successStories } from '../../data/content';

export default function Testimonials() {
  const featured = successStories.find((story) => story.featured);
  const others = successStories.filter((story) => !story.featured).slice(0, 2);

  return (
    <section className="py-20 md:py-28 bg-theme-bg/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 md:mb-20 space-y-4">
          <h2 className="font-outfit font-bold text-xs text-theme-primary uppercase tracking-widest">
            Success Stories
          </h2>
          <h3 className="heading-clear font-outfit font-extrabold text-3xl sm:text-4xl md:text-[42px] tracking-tight text-theme-text">
            Real progress from engineering{' '}
            <span className="text-gradient-clear">
              students
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative bg-theme-surface border border-theme-border/80 rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(241,245,249,0.6)] flex flex-col justify-between"
            >
              <div className="mb-6">
                <Quote className="w-10 h-10 text-slate-200" />
              </div>

              <p className="text-theme-text-secondary text-lg sm:text-xl leading-relaxed mb-8 font-normal">
                "{featured.feedback}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-theme-divider">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-sm flex items-center justify-center font-outfit shadow-sm shrink-0">
                  {featured.initials}
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-theme-text text-base flex items-center gap-1.5">
                    {featured.name}
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </h4>
                  <p className="text-theme-text-secondary text-sm">
                    {featured.role} / <span className="text-theme-primary">{featured.college}</span>
                  </p>
                  <p className="mt-1 text-xs font-semibold text-theme-primary">{featured.result}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-6">
            {others.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                className="group relative bg-theme-surface border border-theme-divider rounded-2xl p-6 sm:p-7 hover:border-theme-border hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-1"
              >
                <p className="text-theme-text-secondary text-sm leading-relaxed mb-6">
                  "{story.feedback}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-theme-divider/60">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center font-outfit shadow-sm shrink-0">
                    {story.initials}
                  </div>
                  <div>
                    <h4 className="font-outfit font-bold text-theme-text text-sm flex items-center gap-1">
                      {story.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </h4>
                    <p className="text-theme-text-secondary text-xs">
                      {story.role} / <span className="text-theme-primary">{story.college}</span>
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-theme-primary">{story.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
