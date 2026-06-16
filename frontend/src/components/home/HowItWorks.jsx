import React from 'react';
import { motion } from 'framer-motion';
import { Compass, UserCheck, Trophy, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: Compass,
      title: 'Browse Opportunities',
      description: 'Explore verified technical events filterable by category, tech stack, difficulty, and your favorite colleges.',
      color: 'from-blue-600 to-blue-700 shadow-sm',
    },
    {
      step: '02',
      icon: UserCheck,
      title: 'Register Instantly',
      description: 'Use your unified student profile to register for events, hackathons, and webinars in just a single click.',
      color: 'from-blue-600 to-blue-700 shadow-sm',
    },
    {
      step: '03',
      icon: Trophy,
      title: 'Learn, Compete & Grow',
      description: 'Acquire digital certificates, win prizes, build a project portfolio, and discover internships or job postings.',
      color: 'from-cyan-500 to-cyan-600 shadow-sm',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-0 right-0 h-96 bg-slate-50/50 -skew-y-3 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
          <h2 className="font-outfit font-bold text-xs text-blue-600 uppercase tracking-widest">
            Timeline
          </h2>
          <h3 className="font-outfit font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900">
            How{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              EngiNow Works
            </span>
          </h3>
          <p className="text-slate-500 text-base sm:text-lg">
            EngiNow bridges the gap between student talent and opportunities in 3 simple steps.
          </p>
        </div>

        {/* Steps flow */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-1 bg-slate-100 -z-10">
            {/* Animated Glow pipe */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left group"
                >
                  {/* Step bubble and number container */}
                  <div className="relative flex items-center justify-center mb-6">
                    {/* Circle badge */}
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300`}>
                      <StepIcon className="w-9 h-9" />
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-4 border-white flex items-center justify-center text-white text-xs font-bold font-outfit">
                        {step.step}
                      </span>
                    </div>
                    {/* Inner glowing halo */}
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-outfit font-bold text-slate-900 text-xl sm:text-2xl mb-3 mt-2">
                    {step.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    {step.description}
                  </p>

                  {/* Mobile timeline connectors */}
                  {index < 2 && (
                    <div className="lg:hidden w-1 h-12 bg-gradient-to-b from-blue-500/30 to-cyan-500/30 my-4" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
