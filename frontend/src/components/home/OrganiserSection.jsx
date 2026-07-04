import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles, BarChart2, Calendar, FileText, Users } from 'lucide-react';

export default function OrganiserSection() {
  const organiserFeatures = [
    {
      title: 'Multi-Step Event Creation',
      description: 'Quickly set timelines, select track options, and publish prizes with a guided onboarding wizard.',
    },
    {
      title: 'Registration Management',
      description: 'Review submissions, screen applicants, approve slots, and export candidate registers with ease.',
    },
    {
      title: 'Approval Workflow',
      description: 'Gain rapid authorization and verify listings via official administration review boards.',
    },
    {
      title: 'Participant Insights',
      description: 'Access attendance ratios, college distributions, feedback scores, and performance analytics.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Text and Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 md:space-y-8"
          >
            <div className="space-y-3">
              <h2 className="font-outfit font-bold text-xs text-blue-600 uppercase tracking-widest">
                For Organisers
              </h2>
              <h3 className="heading-clear font-outfit font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900">
                Host Events{' '}
                <span className="text-gradient-clear">
                  Without The Hassle
                </span>
              </h3>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                Create, manage, review, and publish events through a guided workflow designed for organisers.
              </p>
            </div>

            {/* Features Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {organiserFeatures.map((feat, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-outfit font-bold text-sm text-slate-800">{feat.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                to="/become-organizer"
                className="group inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-100/30"
              >
                <span>Start Organising</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Illustration (Organiser Dashboard Mock) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* Dashboard Mock Window */}
            <div className="w-full max-w-[480px] bg-slate-50 border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden p-1">
              
              {/* Window Header */}
              <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                    <span className="w-3 h-3 rounded-full bg-green-400 block" />
                  </div>
                  <span className="w-px bg-slate-200 h-4 mx-1" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-outfit">Organiser Dashboard</span>
                </div>
                <div className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[9px] font-bold text-blue-700">
                  Live View
                </div>
              </div>

              {/* Window Content */}
              <div className="p-4 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Active Registrations</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-800 font-outfit">342</span>
                      <span className="text-[10px] font-bold text-emerald-600 font-outfit">+14%</span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Capacity</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-800 font-outfit">500</span>
                      <span className="text-[10px] font-semibold text-slate-400">Slots</span>
                    </div>
                  </div>
                </div>

                {/* Event Creation Wizard Preview */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Event Setup Wizard</span>
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Step 3 of 4</span>
                  </div>

                  {/* Steps Progress Indicator */}
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 bg-blue-600 rounded-full flex-1" />
                    <div className="h-1.5 bg-blue-600 rounded-full flex-1" />
                    <div className="h-1.5 bg-blue-600 rounded-full flex-1 animate-pulse" />
                    <div className="h-1.5 bg-slate-100 rounded-full flex-1" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Set Timeline: June 15 - June 20</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Configure Tracks: Web Dev, AI, Cloud</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Review Badge Card */}
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2.5 shadow-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                      <span className="text-xs font-bold font-outfit uppercase tracking-wide">Admin Review Status</span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-500 rounded text-slate-950">Pending</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed text-slate-350">
                    Your hackathon listing is currently being reviewed by SVNIT Administrators. You will receive an instant email confirmation once verified.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
