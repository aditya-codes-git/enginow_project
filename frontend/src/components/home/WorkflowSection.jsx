import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus, ShieldAlert, Award, UserPlus, Zap, ArrowRight, ArrowDown } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      title: 'Organiser Creates Event',
      role: 'Organiser',
      description: 'Host sets up tracks, timing schedules, and prize allocations in the wizard.',
      icon: FilePlus,
      color: 'border-blue-100 hover:border-blue-200/80 bg-blue-50/20 text-theme-primary',
    },
    {
      title: 'Admin Reviews Event',
      role: 'Admin',
      description: 'Campus administrators examine event details to ensure authentication guidelines are met.',
      icon: ShieldAlert,
      color: 'border-amber-100 hover:border-theme-warning-border/80 bg-theme-warning-bg/20 text-theme-warning',
    },
    {
      title: 'Event Approved',
      role: 'System',
      description: 'The listing is published on the public board, featuring a "Verified" badge.',
      icon: Award,
      color: 'border-emerald-100 hover:border-theme-success-border/80 bg-theme-success-bg/20 text-theme-success',
    },
    {
      title: 'Students Register',
      role: 'Participant',
      description: 'Engineering students discover details and register using unified student profiles.',
      icon: UserPlus,
      color: 'border-blue-100 hover:border-blue-200/80 bg-blue-50/20 text-theme-primary',
    },
    {
      title: 'Event Conducted',
      role: 'All Roles',
      description: 'Host conducts the hackathon or workshop; participants receive certifications.',
      icon: Zap,
      color: 'border-theme-info-border hover:border-theme-info-border/80 bg-theme-info-bg/20 text-theme-primary',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-theme-bg/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20 space-y-4">
          <h2 className="font-outfit font-bold text-xs text-theme-primary uppercase tracking-widest">
            System Architecture
          </h2>
          <h3 className="font-outfit font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-theme-text">
            Platform{' '}
            <span className="text-gradient-clear">
              Workflow
            </span>
          </h3>
          <p className="text-theme-text-secondary text-sm sm:text-base leading-relaxed">
            A transparent and highly governed lifecycle ensuring standard safety, validation, and verification guidelines for students.
          </p>
        </div>

        {/* Horizontal and Vertical flow container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 xl:gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={index}>
                {/* Step card */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`flex-1 p-6 bg-theme-surface border rounded-2xl shadow-[0_2px_12px_rgba(241,245,249,0.3)] transition-all duration-300 hover:shadow-md cursor-default w-full md:max-w-md lg:max-w-none ${step.color}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-divider flex items-center justify-center shadow-sm shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-theme-surface border border-theme-divider shadow-sm">
                        {step.role}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-outfit font-bold text-theme-text text-sm mt-4 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-theme-text-secondary text-xs leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>

                {/* Connector Arrow (Desktop vs Mobile) */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 py-2 lg:py-0">
                    <span className="hidden lg:block text-slate-300">
                      <ArrowRight className="w-5 h-5 animate-pulse" />
                    </span>
                    <span className="lg:hidden text-slate-300">
                      <ArrowDown className="w-5 h-5 animate-pulse" />
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
}
