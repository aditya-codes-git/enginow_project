import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Compass, Zap, ShieldCheck, BarChart3, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function FeaturesSection() {
  const mainFeature = {
    icon: Compass,
    title: 'Event Discovery',
    description: 'Browse verified events, workshops, hackathons, and competitions tailored to your engineering discipline. Filter by category, tech stack, location, and difficulty — all from a single search.',
    color: 'bg-blue-50 text-blue-600',
  };

  const features = [
    {
      icon: Search,
      title: 'Smart Filters',
      description: 'Sort by category, prize pools, dates, locations, or organisations.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Zap,
      title: 'One-Click Register',
      description: 'Register using your unified student profile in a single click.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Organisers',
      description: 'Participate in authentic contests backed by verified chapters.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Event Analytics',
      description: 'Track registrations, conversions, and audience demographics.',
      color: 'bg-cyan-50 text-cyan-600',
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
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20 space-y-4">
          <h2 className="font-outfit font-bold text-xs text-blue-600 uppercase tracking-widest">
            Platform Features
          </h2>
          <h3 className="font-outfit font-extrabold text-3xl sm:text-4xl md:text-[42px] tracking-tight text-slate-900 leading-tight">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              discover opportunities
            </span>
          </h3>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
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
            className="group relative p-8 sm:p-10 bg-white border border-slate-200/80 rounded-2xl shadow-[0_2px_20px_rgba(241,245,249,0.6)] hover:shadow-[0_15px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200/60 flex flex-col justify-between min-h-[320px] lg:row-span-2 overflow-hidden"
          >
            {/* Hover accent bar */}
            <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-500 ease-out" />

            <div className="space-y-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${mainFeature.color} shadow-sm`}>
                <MainIcon className="w-6 h-6" />
              </div>
              <h4 className="font-outfit font-bold text-slate-900 text-2xl sm:text-3xl leading-tight">
                {mainFeature.title}
              </h4>
              <p className="text-slate-500 text-base leading-relaxed max-w-md">
                {mainFeature.description}
              </p>
            </div>

            {/* Illustration: Search Preview Mock */}
            <div className="mt-8 bg-slate-50/80 border border-slate-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Search events, hackathons…</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Web Dev', 'AI/ML', 'Cloud', 'Mobile'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-500">
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
                  className="group relative p-6 bg-white border border-slate-100/80 rounded-2xl shadow-[0_2px_12px_rgba(241,245,249,0.4)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:border-slate-200 overflow-hidden"
                >
                  {/* Hover accent bar */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-500 ease-out" />

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feature.color} mb-5 shadow-sm`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="font-outfit font-bold text-slate-800 text-base mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
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
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Browse:</span>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all duration-200"
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
