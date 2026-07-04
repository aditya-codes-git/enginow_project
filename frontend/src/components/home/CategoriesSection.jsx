import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Code2, Laptop, Video, MessageSquare, Briefcase, ArrowUpRight } from 'lucide-react';

export default function CategoriesSection() {
  const categories = [
    {
      name: 'Hackathons',
      icon: Trophy,
      count: '120+ Active',
      description: 'Collaborate to solve real-world problems and win prizes.',
      color: 'from-blue-500/10 to-blue-600/10 text-blue-600',
      borderColor: 'hover:border-blue-200/80',
    },
    {
      name: 'Coding Competitions',
      icon: Code2,
      count: '85+ Active',
      description: 'Test your algorithms and compete in real-time sprints.',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
      borderColor: 'hover:border-emerald-200/80',
    },
    {
      name: 'Workshops',
      icon: Laptop,
      count: '150+ Active',
      description: 'Hands-on practical labs to master modern tech stacks.',
      color: 'from-blue-500/10 to-sky-500/10 text-blue-600',
      borderColor: 'hover:border-blue-200/80',
    },
    {
      name: 'Webinars',
      icon: Video,
      count: '95+ Active',
      description: 'Learn from engineering leaders and industry professionals.',
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600',
      borderColor: 'hover:border-amber-200/80',
    },
    {
      name: 'Tech Talks',
      icon: MessageSquare,
      count: '60+ Active',
      description: 'Engage with community experts on bleeding-edge tech trends.',
      color: 'from-pink-500/10 to-rose-500/10 text-rose-600',
      borderColor: 'hover:border-rose-200/80',
    },
    {
      name: 'Career Events',
      icon: Briefcase,
      count: '75+ Active',
      description: 'Prepare for interviews, resume reviews, and networking.',
      color: 'from-sky-500/10 to-blue-500/10 text-sky-600',
      borderColor: 'hover:border-sky-200/80',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div className="space-y-3">
            <h2 className="font-outfit font-bold text-xs text-blue-600 uppercase tracking-widest">
              Categories
            </h2>
            <h3 className="heading-clear font-outfit font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900">
              Browse Events By{' '}
              <span className="text-gradient-clear">
                Category
              </span>
            </h3>
          </div>
          <div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 font-semibold text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all opportunities
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${category.borderColor} hover:-translate-y-0.5 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  {/* Icon with gradient bg */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Event Count pill */}
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-slate-50 text-slate-500 rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-200">
                    {category.count}
                  </span>
                </div>

                {/* Info */}
                <h4 className="font-outfit font-bold text-slate-800 text-lg mt-5 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {category.name}
                </h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {category.description}
                </p>
                
                {/* Arrow hint that slides in on hover */}
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                  <span>Browse Category</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
