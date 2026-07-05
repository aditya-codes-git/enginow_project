import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronDown, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import enginowLogo from '../assets/enginow-logo.png';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../hooks/useAuth';
import UserMenu from './common/UserMenu';
import { useTheme } from '../context/ThemeContext';


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { currentTheme, theme } = useTheme();

  const isHomePage = location.pathname === '/';

  const hexToRgb = (hex) => {
    if (!hex) return '255, 255, 255';
    const normalized = hex.replace('#', '');
    const value = normalized.length === 3
      ? normalized.split('').map((char) => char + char).join('')
      : normalized;
    const number = parseInt(value, 16);
    return `${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}`;
  };

  const getBorderColor = () => {
    if (currentTheme === 'dark') {
      return 'rgba(255, 255, 255, 0.1)';
    }
    if (currentTheme === 'light') {
      return 'rgba(226, 232, 240, 0.6)';
    }
    return `rgba(${hexToRgb(theme.colors.border)}, 0.6)`;
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Hackathons', path: '/hackathons' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Floating Glass Navbar Wrapper */}
      <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 flex justify-center">
        <nav
          style={{
            backgroundColor: `rgba(${hexToRgb(theme.colors.background)}, 0.7)`,
            borderColor: getBorderColor(),
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
          }}
          className="w-full max-w-7xl rounded-[24px] transition-all duration-300 will-change-transform flex items-center h-[68px] backdrop-blur-xl backdrop-saturate-150 border"
        >
          <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img src={enginowLogo} alt="EngiNow" className="h-9 w-auto group-hover:scale-[1.02] transition-transform duration-200" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative font-medium text-sm px-3.5 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-theme-primary font-semibold bg-blue-50/60'
                        : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg/80'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Dashboard Dropdown */}
              {isAuthenticated && (
                <div
                  className="relative"
                  onMouseEnter={() => setDesktopDropdownOpen(true)}
                  onMouseLeave={() => setDesktopDropdownOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 font-medium text-sm text-theme-text-secondary hover:text-theme-text hover:bg-theme-bg/80 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer"
                  >
                    <span>Dashboard</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {desktopDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-1 w-56 rounded-xl bg-theme-surface border border-theme-border/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 z-50"
                      >
                        {user?.role === 'organiser' && (
                          <>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">
                              Organiser
                            </div>
                            <NavLink
                              to="/organiser"
                              end
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              Events Dashboard
                            </NavLink>
                            <NavLink
                              to="/organiser/events/new"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              Create Event
                            </NavLink>
                          </>
                        )}

                        {user?.role === 'admin' && (
                          <>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">
                              Admin
                            </div>
                            <NavLink
                              to="/admin/users"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              Manage Users
                            </NavLink>
                            <NavLink
                              to="/admin/organisers"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              Manage Teams
                            </NavLink>
                            <NavLink
                              to="/organiser"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              Manage All Events
                            </NavLink>
                            <NavLink
                              to="/organiser/events/new"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              Create Event
                            </NavLink>
                          </>
                        )}

                        {user?.role === 'participant' && (
                          <>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-theme-text-muted uppercase tracking-widest">
                              Participant
                            </div>
                            <NavLink
                              to="/dashboard"
                              end
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-theme-primary font-semibold bg-blue-50/50' : 'text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary'
                                }`
                              }
                            >
                              My Dashboard
                            </NavLink>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <ThemeSwitcher />
              {isAuthenticated ? (
                <UserMenu user={user} logout={logout} />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-theme-text-secondary hover:text-theme-text font-medium text-sm px-4 py-2 rounded-full hover:bg-theme-bg/80 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                      color: theme.colors.textOnPrimary || '#ffffff',
                    }}
                    className="font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5 hover:opacity-95"
                  >
                    Sign Up
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-theme-text-secondary hover:text-theme-primary hover:bg-theme-bg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-theme-primary z-40 md:hidden"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-theme-surface z-50 shadow-2xl p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-theme-divider">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                  <img src={enginowLogo} alt="EngiNow" className="h-8 w-auto" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-theme-text-secondary hover:text-theme-primary hover:bg-theme-bg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 py-8 flex flex-col space-y-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-medium px-3 py-2.5 rounded-xl transition-colors ${
                        isActive ? 'text-theme-primary bg-blue-50/50 font-semibold' : 'text-theme-text-secondary hover:text-theme-primary hover:bg-theme-bg'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {/* Mobile Dashboard Accordion */}
                {isAuthenticated && (
                  <div className="border-t border-theme-divider pt-4 mt-2">
                    <button
                      onClick={() => setMobileDashboardOpen(!mobileDashboardOpen)}
                      className="w-full flex items-center justify-between text-base font-medium px-3 py-2.5 text-theme-text-secondary hover:text-theme-primary transition-colors cursor-pointer rounded-xl hover:bg-theme-bg"
                    >
                      <span>Dashboard</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileDashboardOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {mobileDashboardOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 overflow-hidden flex flex-col space-y-1 mt-1"
                        >
                          {user?.role === 'organiser' && (
                            <>
                              <div className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest pt-2 px-3">Organiser</div>
                              <NavLink
                                to="/organiser"
                                end
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                  Events Dashboard
                              </NavLink>
                              <NavLink
                                to="/organiser/events/new"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                Create Event
                              </NavLink>
                            </>
                          )}

                          {user?.role === 'admin' && (
                            <>
                              <div className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest pt-2 px-3">Admin</div>
                              <NavLink
                                to="/admin/users"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                Manage Users
                              </NavLink>
                              <NavLink
                                to="/admin/organisers"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                Manage Teams
                              </NavLink>
                              <NavLink
                                to="/organiser"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                Manage All Events
                              </NavLink>
                              <NavLink
                                to="/organiser/events/new"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                Create Event
                              </NavLink>
                            </>
                          )}

                          {user?.role === 'participant' && (
                            <>
                              <div className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest pt-2 px-3">Participant</div>
                              <NavLink
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-theme-primary font-semibold' : 'text-theme-text-secondary hover:text-theme-primary'
                                  }`
                                }
                              >
                                My Dashboard
                              </NavLink>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="border-t border-theme-divider pt-6 flex flex-col space-y-3">
                <ThemeSwitcher />
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-3 bg-theme-bg rounded-2xl border border-theme-divider">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-550 flex items-center justify-center font-bold text-white shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-theme-text text-sm truncate">{user?.name}</div>
                        <div className="text-xs text-theme-text-secondary truncate">{user?.email}</div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 mt-1">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-text-secondary hover:bg-theme-bg text-sm font-semibold transition"
                      >
                        <User className="w-4 h-4 text-theme-text-secondary" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'organiser' ? '/organiser/dashboard' : '/dashboard'}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-text-secondary hover:bg-theme-bg text-sm font-semibold transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-theme-text-secondary" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        to="/settings/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-text-secondary hover:bg-theme-bg text-sm font-semibold transition"
                      >
                        <Settings className="w-4 h-4 text-theme-text-secondary" />
                        <span>Account Settings</span>
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-theme-error hover:bg-theme-error-bg font-semibold py-2.5 border border-theme-error-border rounded-xl transition-colors duration-200 cursor-pointer text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center text-theme-text-secondary hover:text-theme-primary font-medium py-3 border border-theme-border rounded-xl hover:bg-theme-bg transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                        color: theme.colors.textOnPrimary || '#ffffff',
                      }}
                      className="w-full text-center font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 hover:opacity-95"
                    >
                      Sign Up
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
