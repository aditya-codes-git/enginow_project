import React from 'react';
import { Sparkles } from '../ui/Sparkles';
import { InfiniteSlider } from '../ui/InfiniteSlider';
import { ProgressiveBlur } from '../ui/ProgressiveBlur';

export default function PartnersStrip() {
  const partners = [
    {
      id: 'ieee',
      name: 'IEEE',
      component: () => (
        <svg viewBox="0 0 100 24" className="h-6 w-auto fill-current" aria-label="IEEE logo">
          <text x="0" y="18" className="font-outfit font-black tracking-widest text-lg">IEEE</text>
        </svg>
      ),
      className: 'text-slate-400/80 hover:text-sky-600 transition-colors duration-300 transform hover:scale-[1.05] flex items-center justify-center cursor-pointer',
    },
    {
      id: 'gdg',
      name: 'Google Developer Groups',
      component: () => (
        <div className="flex items-center gap-1.5 font-outfit font-semibold text-sm select-none">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-label="GDG logo icon">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.03 1 1 6.03 1 12.24s5.03 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.302-.178-1.865H12.24z"/>
          </svg>
          <span className="tracking-tight whitespace-nowrap">Google Dev Groups</span>
        </div>
      ),
      className: 'text-slate-400/80 hover:text-blue-500 transition-colors duration-300 transform hover:scale-[1.05] flex items-center justify-center cursor-pointer',
    },
    {
      id: 'github',
      name: 'GitHub Campus',
      component: () => (
        <div className="flex items-center gap-1.5 font-outfit font-bold text-sm select-none">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-label="GitHub logo icon">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <span className="tracking-tight whitespace-nowrap">GitHub Campus</span>
        </div>
      ),
      className: 'text-slate-400/80 hover:text-slate-900 transition-colors duration-300 transform hover:scale-[1.05] flex items-center justify-center cursor-pointer',
    },
    {
      id: 'microsoft',
      name: 'Microsoft Learn',
      component: () => (
        <div className="flex items-center gap-1.5 font-outfit font-semibold text-sm select-none">
          <svg viewBox="0 0 23 23" className="h-5 w-5 fill-current" aria-label="Microsoft logo icon">
            <path d="M0 0h11v11H0z" className="text-red-500"/>
            <path d="M12 0h11v11H12z" className="text-green-500"/>
            <path d="M0 12h11v11H0z" className="text-blue-500"/>
            <path d="M12 12h11v11H12z" className="text-yellow-500"/>
          </svg>
          <span className="tracking-tight whitespace-nowrap">Microsoft Learn</span>
        </div>
      ),
      className: 'text-slate-400/80 hover:text-sky-500 transition-colors duration-300 transform hover:scale-[1.05] flex items-center justify-center cursor-pointer',
    },
    {
      id: 'devfolio',
      name: 'Devfolio',
      component: () => (
        <div className="flex items-center gap-1.5 font-outfit font-bold text-sm select-none">
          <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white font-black text-xs font-mono">D</span>
          <span className="tracking-tight whitespace-nowrap">DEVFOLIO</span>
        </div>
      ),
      className: 'text-slate-400/80 hover:text-blue-600 transition-colors duration-300 transform hover:scale-[1.05] flex items-center justify-center cursor-pointer',
    },
    {
      id: 'mlh',
      name: 'MLH',
      component: () => (
        <div className="flex items-center gap-1.5 font-outfit font-extrabold text-sm select-none">
          <span className="border-2 border-red-500 text-red-500 rounded px-1.5 py-0.5 text-xs">MLH</span>
          <span className="tracking-tight text-slate-800 whitespace-nowrap">Hackathons</span>
        </div>
      ),
      className: 'text-slate-400/80 hover:text-red-500 transition-colors duration-300 transform hover:scale-[1.05] flex items-center justify-center cursor-pointer',
    },
  ];

  return (
    <section className="bg-white pt-16 pb-0 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-gradient-clear font-outfit font-black tracking-tight text-2xl sm:text-3xl">
            Trusted by Student Communities
          </span>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
            Empowering the Next Generation of Tech Leaders
          </p>
        </div>
      </div>

      <div className="relative mt-10 h-[80px] w-full">
        <InfiniteSlider 
          className='flex h-full w-full items-center' 
          duration={30}
          gap={64}
        >
          {partners.map(({ id, component: Logo, className }) => (
            <div 
              key={id} 
              className={`${className} flex-shrink-0`}
            >
              <Logo />
            </div>
          ))}
        </InfiniteSlider>
        <ProgressiveBlur
          className='pointer-events-none absolute top-0 left-0 h-full w-[80px] md:w-[140px] z-10'
          direction='left'
          blurIntensity={0.45}
        />
        <ProgressiveBlur
          className='pointer-events-none absolute top-0 right-0 h-full w-[80px] md:w-[140px] z-10'
          direction='right'
          blurIntensity={0.45}
        />
      </div>

      <div className="relative mt-8 h-36 w-full overflow-hidden [mask-image:radial-gradient(circle closest-side at 50% 50%,white,transparent)] pointer-events-none">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle closest-side at 50% 100%,#2563eb,transparent_70%)] before:opacity-30" />
        <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] bg-white" />
        <Sparkles
          density={800}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(circle_closest-side_at_50%_50%,white,transparent_85%)]"
          color="#2563eb"
        />
      </div>
    </section>
  );
}
