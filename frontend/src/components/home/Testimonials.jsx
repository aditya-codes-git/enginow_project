import React from 'react';
import { motion } from 'framer-motion';
import { Quote, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Aditya Shah',
      college: 'SVNIT Surat',
      role: 'Web Developer & Hacker',
      feedback: 'EngiNow changed how I find hackathons. The unified student registration saved us so much time — my team found and registered for three hackathons in a single afternoon.',
      initials: 'AS',
      featured: true,
    },
    {
      name: 'Kriti Patel',
      college: 'NIT Surat',
      role: 'AI/ML Enthusiast',
      feedback: 'I attended the Generative AI workshop through EngiNow and got to network with speakers from top companies. Finding verified workshops has never been this simple.',
      initials: 'KP',
      featured: false,
    },
    {
      name: 'Devan Sharma',
      college: 'DAIICT',
      role: 'Competitive Programmer',
      feedback: 'As a club coordinator, I tracked 400+ registrations in real-time. It completely replaced messy spreadsheets and group forms.',
      initials: 'DS',
      featured: false,
    },
  ];

  const featured = testimonials.find(t => t.featured);
  const others = testimonials.filter(t => !t.featured);

  return (
    <section className="py-20 md:py-28 bg-slate-50/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20 space-y-4">
          <h2 className="font-outfit font-bold text-xs text-blue-600 uppercase tracking-widest">
            Community
          </h2>
          <h3 className="font-outfit font-extrabold text-3xl sm:text-4xl md:text-[42px] tracking-tight text-slate-900 leading-tight">
            Trusted by engineering{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              students
            </span>
          </h3>
        </div>

        {/* Featured + Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">

          {/* Featured Testimonial */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(241,245,249,0.6)] flex flex-col justify-between"
            >
              {/* Quote mark */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-slate-200" />
              </div>

              <p className="text-slate-700 text-lg sm:text-xl leading-relaxed mb-8 font-normal">
                "{featured.feedback}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-sm flex items-center justify-center font-outfit shadow-sm shrink-0">
                  {featured.initials}
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-slate-900 text-base flex items-center gap-1.5">
                    {featured.name}
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {featured.role} · <span className="text-blue-600">{featured.college}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Side Cards */}
          <div className="flex flex-col gap-6">
            {others.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 sm:p-7 hover:border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-1"
              >
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  "{test.feedback}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100/60">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center font-outfit shadow-sm shrink-0">
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="font-outfit font-bold text-slate-800 text-sm flex items-center gap-1">
                      {test.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </h4>
                    <p className="text-slate-500 text-xs">
                      {test.role} · <span className="text-blue-600">{test.college}</span>
                    </p>
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
