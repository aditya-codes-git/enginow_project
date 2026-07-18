import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronDown, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import Logo from './common/Logo';
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
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { currentTheme, theme } = useTheme();

  console.log('[Navbar] Render state:', { isAuthenticated, loading, user: user?.email });

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
            <Link to="/" className="inline-flex shrink-0 items-center group" aria-label="Enginow Ignite">
              <Logo imageClassName="group-hover:scale-[1.02]" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative font-medium text-sm px-3.5 py-2 rounded-full transition-all duration-200 ease-out hover:-translate-y-0.5 ${
                      isActive
                        ? 'text-blue-600 font-semibold bg-blue-50/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
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
                    className="flex items-center gap-1 font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer"
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
                        className="absolute right-0 mt-1 w-56 rounded-xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 z-50"
                      >
                        {user?.role === 'organiser' && (
                          <>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Organiser
                            </div>
                            <NavLink
                              to="/organiser"
                              end
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`
                              }
                            >
                              Events Dashboard
                            </NavLink>
                            <NavLink
                              to="/organiser/events/new"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`
                              }
                            >
                              Create Event
                            </NavLink>
                          </>
                        )}

                        {user?.role === 'admin' && (
                          <>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Admin
                            </div>
                            <NavLink
                              to="/admin/users"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`
                              }
                            >
                              Manage Users
                            </NavLink>
                            <NavLink
                              to="/admin/organisers"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`
                              }
                            >
                              Manage Teams
                            </NavLink>
                            <NavLink
                              to="/organiser"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`
                              }
                            >
                              Manage All Events
                            </NavLink>
                            <NavLink
                              to="/organiser/events/new"
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                }`
                              }
                            >
                              Create Event
                            </NavLink>
                          </>
                        )}

                        {user?.role === 'participant' && (
                          <>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Participant
                            </div>
                            <NavLink
                              to="/dashboard"
                              end
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm transition-colors ${
                                  isActive ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
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
              {loading ? (
                <div className="h-9 w-20 flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-slate-350 border-t-slate-950 rounded-full animate-spin" />
                </div>
              ) : isAuthenticated ? (
                <UserMenu user={user} logout={logout} />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-full hover:bg-slate-50/80 transition-all duration-200 ease-out hover:-translate-y-0.5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5"
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
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
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
              className="fixed inset-0 bg-slate-900 z-40 md:hidden"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50 shadow-2xl p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="inline-flex shrink-0 items-center" aria-label="Enginow Ignite">
                  <Logo imageClassName="h-8" textClassName="text-2xl" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
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
                      `text-base font-medium px-3 py-2.5 rounded-xl transition-all duration-200 ease-out hover:-translate-y-0.5 ${
                        isActive ? 'text-blue-600 bg-blue-50/50 font-semibold' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {/* Mobile Dashboard Accordion */}
                {isAuthenticated && (
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <button
                      onClick={() => setMobileDashboardOpen(!mobileDashboardOpen)}
                      className="w-full flex items-center justify-between text-base font-medium px-3 py-2.5 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer rounded-xl hover:bg-slate-50"
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
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 px-3">Organiser</div>
                              <NavLink
                                to="/organiser"
                                end
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
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
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
                                  }`
                                }
                              >
                                Create Event
                              </NavLink>
                            </>
                          )}

                          {user?.role === 'admin' && (
                            <>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 px-3">Admin</div>
                              <NavLink
                                to="/admin/users"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
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
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
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
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
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
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
                                  }`
                                }
                              >
                                Create Event
                              </NavLink>
                            </>
                          )}

                          {user?.role === 'participant' && (
                            <>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 px-3">Participant</div>
                              <NavLink
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                  `text-sm px-3 py-2 rounded-lg transition-colors ${
                                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
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

              <div className="border-t border-slate-100 pt-6 flex flex-col space-y-3">
                <ThemeSwitcher />
                {loading ? (
                  <div className="h-10 w-full flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                  </div>
                ) : isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-550 flex items-center justify-center font-bold text-white shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-sm truncate">{user?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 mt-1">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'organiser' ? '/organiser/dashboard' : '/dashboard'}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        to="/settings/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Account Settings</span>
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-red-650 hover:bg-red-50 font-semibold py-2.5 border border-red-200 rounded-xl transition-colors duration-200 cursor-pointer text-sm flex items-center justify-center gap-2"
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
                      className="w-full text-center text-slate-700 hover:text-blue-600 font-medium py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
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
