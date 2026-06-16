import React from 'react';
import { motion } from 'framer-motion';
import { Map, MessageSquare, TrendingUp, Users, Calendar, ArrowUpRight, Globe, Zap, CheckCircle2, Rocket } from 'lucide-react';

export default function PlatformShowcase() {
  return (
    <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-white via-neutral-50/80 to-white overflow-hidden font-sans">
      {/* Faint Dot Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-70 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse 60% 50% at 50% 50%,#000_70%,transparent_100%)]" />

      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-200/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Grid Container wrapper with shadow */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl rounded-3xl shadow-[0_30px_70px_-10px_rgba(15,23,42,0.18),0_15px_30px_-15px_rgba(37,99,235,0.08)] relative z-10 bg-white"
      >
        {/* Inner container to hold borders and clip contents */}
        <div className="border border-neutral-200 rounded-3xl overflow-hidden bg-white">
          
          {/* Top Split Layout */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* TOP LEFT CARD: Campus Event Network */}
            <div className="group relative p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[380px] hover:bg-slate-50/30 transition-all duration-300">
              {/* Subtle glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
              
              <div className="relative z-10">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
                  Campus Event Network
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-outfit tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
                  Discover opportunities across engineering communities worldwide.
                </h3>
              </div>

              {/* Network / Map Visualizer */}
              <div className="relative h-44 mt-8 w-full select-none overflow-hidden rounded-xl bg-slate-50/60 border border-slate-100 flex items-center justify-center">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse 60% 50% at 50% 50%,#000_70%,transparent_100%)] opacity-50" />
                
                {/* Custom SVG Network Connections */}
                <svg className="absolute inset-0 w-full h-full text-blue-500/25" xmlns="http://www.w3.org/2000/svg">
                  {/* Connection lines */}
                  <line x1="20%" y1="30%" x2="50%" y2="25%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="25%" x2="80%" y2="35%" stroke="currentColor" strokeWidth="1" />
                  <line x1="20%" y1="30%" x2="40%" y2="70%" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="40%" y1="70%" x2="80%" y2="35%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
                  <line x1="50%" y1="25%" x2="40%" y2="70%" stroke="currentColor" strokeWidth="1" />
                  
                  {/* Active node pulses */}
                  <circle cx="20%" cy="30%" r="4" className="fill-blue-500" />
                  <circle cx="50%" cy="25%" r="5" className="fill-blue-500" />
                  <circle cx="80%" cy="35%" r="4" className="fill-blue-600" />
                  <circle cx="40%" cy="70%" r="6" className="fill-cyan-500" />
 
                  {/* Animated pulse rings */}
                  <circle cx="50%" cy="25%" r="10" className="stroke-blue-400 fill-none opacity-40 animate-ping" />
                  <circle cx="40%" cy="70%" r="12" className="stroke-cyan-400 fill-none opacity-40 animate-ping" />
                </svg>

                {/* Floating Badges simulating active events */}
                <div className="absolute top-4 left-4 animate-float-slow">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-slate-200/80 text-slate-700 backdrop-blur-md shadow-sm">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>IIT Bombay</span>
                  </div>
                </div>

                <div className="absolute bottom-6 right-6 animate-float-medium">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 border border-blue-150 text-blue-750 backdrop-blur-md shadow-md shadow-slate-100 hover:border-blue-300 transition-colors duration-200">
                    <Rocket className="w-3 h-3 text-blue-500" />
                    <span>New Hackathon</span>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 animate-float-fast">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-blue-600 backdrop-blur-md shadow-sm">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Active events nearby</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP RIGHT CARD: Direct Organizer Connect */}
            <div className="group relative p-8 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[380px] hover:bg-slate-50/30 transition-all duration-300">
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

              <div className="relative z-10">
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  Direct Organizer Connect
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-outfit tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
                  Connect with event teams and never miss important updates.
                </h3>
              </div>

              {/* Chat Interface Preview */}
              <div className="relative mt-8 space-y-4 rounded-xl bg-slate-50/60 border border-slate-100 p-5 min-h-[176px] flex flex-col justify-center">
                {/* Message 1 (Student) */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-start gap-3 group/msg"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-xs text-blue-600 shadow-inner group-hover/msg:border-blue-400/40 transition-colors duration-200">
                    S
                  </div>
                  <div className="flex flex-col max-w-[75%]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-500">Student</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[9px] text-slate-400">Just now</span>
                    </div>
                    <div className="mt-1 bg-white border border-slate-200/70 text-slate-700 px-3.5 py-2 rounded-2xl rounded-tl-none text-xs leading-relaxed shadow-sm">
                      Is team participation allowed?
                    </div>
                  </div>
                </motion.div>

                {/* Message 2 (Organizer Reply) */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.65 }}
                  className="flex items-start gap-3 justify-end group/msg"
                >
                  <div className="flex flex-col items-end max-w-[75%]">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[9px] text-slate-400">Just now</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-1">
                        Organizer
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      </span>
                    </div>
                    <div className="mt-1 bg-blue-600 text-white px-3.5 py-2 rounded-2xl rounded-tl-none text-xs leading-relaxed shadow-md">
                      Yes! Teams of up to 4 members can register.
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 shadow-inner group-hover/msg:border-blue-300 transition-colors duration-200">
                    O
                  </div>
                </motion.div>
              </div>
            </div>

          </div>

          {/* CENTER HERO METRIC */}
          <div className="relative col-span-full border-t border-b border-slate-105 bg-slate-50/20 px-6 py-14 sm:py-16 text-center overflow-hidden flex flex-col items-center justify-center">
            {/* Subtle background ring */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle closest-side at 50% 50%,rgba(37,99,235,0.02)_0%,transparent_50%)] pointer-events-none" />
            
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">
              ENGINEERING EVENT ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight font-extrabold font-outfit tracking-tight text-slate-900 max-w-2xl relative z-10">
              One Platform.<br className="sm:hidden" /> Endless Opportunities.
            </h2>
            <p className="mt-4 text-sm text-slate-500 max-w-md relative z-10 font-normal">
              Seamlessly bridging the gap between student talent and world-class organizers.
            </p>
          </div>

          {/* BOTTOM ANALYTICS CARD: Event Insights */}
          <div className="group relative p-8 sm:p-12 overflow-hidden flex flex-col justify-between hover:bg-slate-50/30 transition-all duration-300">
            {/* Gradient backdrop */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Event Insights
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-outfit tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-200 max-w-xl">
                  Track registrations, engagement, and audience growth from one powerful dashboard.
                </h3>
              </div>
              
              {/* Quick Stats Panel */}
              <div className="flex items-center gap-6 bg-slate-50/80 border border-slate-200/60 px-5 py-3.5 rounded-xl backdrop-blur-md shadow-sm">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrations</div>
                  <div className="text-lg font-bold font-outfit text-slate-800 mt-0.5 flex items-center gap-1.5">
                    12.4k
                    <span className="text-xs text-emerald-500 font-sans font-semibold">+42%</span>
                  </div>
                </div>
                <div className="w-px bg-slate-200 h-8" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</div>
                  <div className="text-lg font-bold font-outfit text-slate-800 mt-0.5 flex items-center gap-1.5">
                    48.6k
                    <span className="text-xs text-emerald-500 font-sans font-semibold">+18%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom SVG Dashboard Area Chart Mock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative h-60 mt-10 w-full select-none overflow-hidden rounded-xl bg-slate-50/50 border border-slate-200/80 p-4 shadow-sm"
            >
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-6 px-8 pointer-events-none">
                <div className="w-full border-b border-slate-100" />
                <div className="w-full border-b border-slate-100" />
                <div className="w-full border-b border-slate-100" />
                <div className="w-full border-b border-slate-100" />
              </div>

              {/* SVG area curves */}
              <svg viewBox="0 0 500 150" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  {/* Views Area Gradient */}
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Registrations Area Gradient */}
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid vertical markers */}
                <line x1="83" y1="0" x2="83" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="166" y1="0" x2="166" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="249" y1="0" x2="249" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="332" y1="0" x2="332" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="415" y1="0" x2="415" y2="150" stroke="#f1f5f9" strokeWidth="1" />

                {/* VIEWS (Lower/under layer) */}
                <path
                  d="M0 120 C 50 110, 100 130, 150 90 C 200 50, 250 80, 300 45 C 350 10, 400 35, 450 15 L 500 10 L 500 150 L 0 150 Z"
                  fill="url(#viewsGrad)"
                />
                <path
                  d="M0 120 C 50 110, 100 130, 150 90 C 200 50, 250 80, 300 45 C 350 10, 400 35, 450 15 L 500 10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* REGISTRATIONS (Upper layer) */}
                <path
                  d="M0 140 C 50 130, 100 120, 150 105 C 200 90, 250 70, 300 55 C 350 40, 400 25, 450 18 L 500 12 L 500 150 L 0 150 Z"
                  fill="url(#regGrad)"
                />
                <path
                  d="M0 140 C 50 130, 100 120, 150 105 C 200 90, 250 70, 300 55 C 350 40, 400 25, 450 18 L 500 12"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                />

                {/* Interactive Tooltip Circle Indicator */}
                <circle cx="300" cy="55" r="5" className="fill-blue-500 stroke-white stroke-2" />
                <circle cx="300" cy="55" r="10" className="stroke-blue-400 fill-none opacity-40 animate-ping" />
              </svg>

              {/* Custom UI overlay tooltip */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-3 text-[10px] pointer-events-none">
                <div>
                  <span className="text-slate-400 block font-medium">October Peak</span>
                  <span className="font-bold text-slate-800 font-outfit text-xs">Hackathon Season</span>
                </div>
                <div className="w-px bg-slate-200 h-6" />
                <div>
                  <span className="text-blue-600 font-semibold block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Registrations: 4.8k
                  </span>
                  <span className="text-blue-500 font-semibold block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Views: 15.2k
                  </span>
                </div>
              </div>

              {/* Timeline X Axis */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-[9px] font-semibold text-slate-400 uppercase tracking-widest pointer-events-none">
                <span>May</span>
                <span>June</span>
                <span>July</span>
                <span>August</span>
                <span>September</span>
                <span>October</span>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
