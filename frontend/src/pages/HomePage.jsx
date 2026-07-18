import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import HeroSection from '../components/home/HeroSection';
import PlatformShowcase from '../components/home/PlatformShowcase';
import PartnersStrip from '../components/home/PartnersStrip';
import FeaturesSection from '../components/home/FeaturesSection';
import OrganiserSection from '../components/home/OrganiserSection';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

const sectionReveal = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const RevealSection = React.memo(function RevealSection({ children }) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      {children}
    </motion.section>
  );
});

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-theme-surface text-theme-text font-sans flex flex-col">
      <main className="flex-grow">
        <HeroSection />

        <RevealSection>
          <PartnersStrip />
        </RevealSection>

        <RevealSection>
          <PlatformShowcase />
        </RevealSection>

        <RevealSection>
          <FeaturesSection />
        </RevealSection>

        <RevealSection>
          <OrganiserSection />
        </RevealSection>

        <RevealSection>
          <Testimonials />
        </RevealSection>

        <RevealSection>
          <CTASection />
        </RevealSection>
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ duration: 0.22 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition hover:bg-blue-700"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}