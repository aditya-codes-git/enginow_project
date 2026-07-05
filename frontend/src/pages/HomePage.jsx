import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// Homepage Sections
import HeroSection from '../components/home/HeroSection';
import PlatformShowcase from '../components/home/PlatformShowcase';
import PartnersStrip from '../components/home/PartnersStrip';
import FeaturesSection from '../components/home/FeaturesSection';
import OrganiserSection from '../components/home/OrganiserSection';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
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
      {/* Main Sections */}
      <main className="flex-grow">
        <HeroSection />
        
        <PartnersStrip />
        
        <PlatformShowcase />
        
        <FeaturesSection />
        
        <OrganiserSection />
        
        <Testimonials />
        
        <CTASection />
      </main>
      {/* Floating Scroll-To-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-xl bg-theme-primary text-white shadow-lg border border-slate-800 hover:bg-theme-primary transition-colors duration-200 cursor-pointer"
            aria-label="Scroll to top"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
