import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Compass, Zap, ShieldCheck, BarChart3, ArrowUpRight } from 'lucide-react';

export default function FeaturesSection() {
  const mainFeature = {
    icon: Compass,
    title: 'Event Discovery',
    description: 'Browse verified events, workshops, hackathons, and competitions tailored to your engineering discipline. Filter by category, tech stack, location, and difficulty — all from a single search.',
  };

  const features = [
    {
      icon: Search,
      title: 'Smart Filters',
      description: 'Sort by category, prize pools, dates, locations, or organisations.',
    },
    {
      icon: Zap,
      title: 'One-Click Register',
      description: 'Register using your unified student profile in a single click.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Organisers',
      description: 'Participate in authentic contests backed by verified chapters.',
    },
    {
      icon: BarChart3,
      title: 'Event Analytics',
      description: 'Track registrations, conversions, and audience demographics.',
    },
  ];

  const categories = [
    { label: 'Hackathons', path: '/hackathons' },
    { label: 'Workshops', path: '/events' },
    { label: 'Webinars', path: '/events' },
    { label: 'Competitions', path: '/events' },
    { label: 'Career Events', path: '/events' },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 14 },
    },
  };

  const MainIcon = mainFeature.icon;

  return (
    <section className="py-20 md:py-28 bg-theme-surface relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20 space-y-4">
          <h2 className="font-outfit font-bold text-xs text-theme-primary uppercase tracking-widest">
            Platform Features
          </h2>
          <h3 className="heading-clear font-outfit font-extrabold text-3xl sm:text-4xl md:text-[42px] tracking-tight text-theme-text">
            Everything you need to{' '}
            <span className="text-gradient-clear">
              discover opportunities
            </span>
          </h3>
          <p className="text-theme-text-secondary text-base sm:text-lg leading-relaxed max-w-lg">
            One platform for discovering, organising, and managing engineering events across colleges.
          </p>
        </div>

        {/* Asymmetric Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6"
        >
          {/* Large Feature Card */}
          <motion.div
            variants={cardVariants}
            className="group relative p-8 sm:p-10 bg-theme-surface border border-theme-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-theme-primary/30 flex flex-col justify-between min-h-[320px] lg:row-span-2 overflow-hidden"
          >
            {/* Hover accent bar - Dynamic theme colors */}
            <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-theme-primary to-theme-secondary group-hover:w-full transition-all duration-500 ease-out" />

            <div className="space-y-5">
              {/* Theme-aware and consistent icon container */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-theme-bg-secondary border border-theme-border text-theme-primary shadow-sm group-hover:scale-105 group-hover:bg-theme-surface group-hover:shadow-md transition-all duration-300 mb-5">
                <MainIcon className="w-5 h-5" />
              </div>
              <h4 className="font-outfit font-bold text-theme-text text-2xl sm:text-3xl leading-tight">
                {mainFeature.title}
              </h4>
              <p className="text-theme-text-secondary text-base leading-relaxed max-w-md">
                {mainFeature.description}
              </p>
            </div>

            {/* Illustration: Search Preview Mock */}
            <div className="mt-8 bg-theme-bg-secondary/50 border border-theme-divider rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 bg-theme-surface border border-theme-border rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-theme-text-muted" />
                <span className="text-sm text-theme-text-muted">Search events, hackathons…</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Web Dev', 'AI/ML', 'Cloud', 'Mobile'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-theme-surface border border-theme-border text-[11px] font-semibold text-theme-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: 2×2 Smaller Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  className="group relative p-6 bg-theme-surface border border-theme-divider/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-theme-primary/30 overflow-hidden"
                >
                  {/* Hover accent bar - Dynamic theme colors */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-theme-primary to-theme-secondary group-hover:w-full transition-all duration-500 ease-out" />

                  {/* Theme-aware and consistent icon container */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-theme-bg-secondary border border-theme-border text-theme-primary shadow-sm group-hover:scale-105 group-hover:bg-theme-surface group-hover:shadow-md transition-all duration-300 mb-5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="font-outfit font-bold text-theme-text text-base mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-theme-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Category Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <span className="text-xs font-semibold text-theme-text-muted uppercase tracking-wider mr-1">Browse:</span>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="group inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-theme-border bg-theme-surface text-sm font-medium text-theme-text-secondary hover:border-theme-primary hover:text-theme-primary hover:bg-theme-primary/10 transition-all duration-200"
            >
              {cat.label}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
