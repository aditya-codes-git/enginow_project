import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Heart } from 'lucide-react';

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export default function Footer() {
  const footerLinks = {
    platform: [
      { name: 'About', path: '/about' },
      { name: 'Events', path: '/events' },
      { name: 'Hackathons', path: '/hackathons' },
      { name: 'Blogs', path: '/blogs' },
      { name: 'Success Stories', path: '/success-stories' },
    ],
    support: [
      { name: 'Contact', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Help Center', path: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Refund Policy', path: '/refund' },
    ]
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://linkedin.com' },
    { name: 'GitHub', icon: GithubIcon, url: 'https://github.com' },
    { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com' }
  ];

  return (
    <footer className="bg-theme-footer-bg border-t border-theme-footer-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12 pb-12 border-b border-theme-footer-border">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center">
                <Code2 className="text-white w-5 h-5" />
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight text-theme-footer-heading">
                Engi<span className="text-blue-400">Now</span>
              </span>
            </Link>
            <p className="text-theme-footer-muted text-sm max-w-sm leading-relaxed">
              The premier college event discovery platform designed for engineering and technology students. Join competitions, build skills, and launch your career.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-theme-footer-bg border border-theme-footer-border text-theme-footer-muted hover:text-theme-footer-hover hover:bg-theme-footer-bg hover:border-theme-footer-hover/40 transition-all duration-200"
                    aria-label={`Follow EngiNow on ${social.name}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-theme-footer-heading text-xs tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-theme-footer-muted hover:text-theme-footer-hover text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Columns */}
          <div>
            <h3 className="font-semibold text-theme-footer-heading text-xs tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-theme-footer-muted hover:text-theme-footer-hover text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Columns */}
          <div>
            <h3 className="font-semibold text-theme-footer-heading text-xs tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-theme-footer-muted hover:text-theme-footer-hover text-sm transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-theme-footer-text text-xs gap-4">
          <p>&copy; 2026 EngiNow. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for engineering students with <Heart className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
