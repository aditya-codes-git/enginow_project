import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, CalendarDays, Settings, ShieldAlert, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function UserMenu({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentTheme, theme } = useTheme();

  // Solid opaque surface color per theme — no transparency
  const panelBg = theme.colors.surface || (currentTheme === 'dark' ? '#111827' : '#ffffff');
  const panelBorder = currentTheme === 'dark' ? '#374151' : '#e5e7eb';
  const hoverBg = theme.colors.background || (currentTheme === 'dark' ? '#1f2937' : '#f9fafb');

  // Get first name from full name
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const firstInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'organiser') return '/organiser/dashboard';
    return '/dashboard';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-theme-border bg-theme-bg hover:bg-theme-bg-secondary hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
      >
        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {firstInitial}
        </div>
        <span className="text-sm font-semibold text-theme-text-secondary hidden sm:inline">
          {firstName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-theme-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            backgroundColor: panelBg,
            borderColor: panelBorder,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
          className="absolute right-0 mt-2 w-72 rounded-2xl border py-2.5 z-[200] animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {/* Top User Summary */}
          <div className="px-4 py-3 border-b border-theme-divider flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-xl font-extrabold text-white shadow-md">
              {firstInitial}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-theme-text truncate leading-tight">{user?.name}</h4>
              <p className="text-xs text-theme-text-secondary truncate mt-0.5 leading-tight">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="px-1.5 py-1.5 space-y-0.5">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary transition duration-150"
            >
              <User className="w-4 h-4 text-theme-text-muted" />
              <span>My Profile</span>
            </Link>

            <Link
              to={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary transition duration-150"
            >
              <CalendarDays className="w-4 h-4 text-theme-text-muted" />
              <span>My Events / Dashboard</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/organiser"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary transition duration-150"
              >
                <CalendarDays className="w-4 h-4 text-theme-text-muted" />
                <span>Manage All Events</span>
              </Link>
            )}

            <Link
              to="/settings/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary transition duration-150"
            >
              <Settings className="w-4 h-4 text-theme-text-muted" />
              <span>Account Settings</span>
            </Link>

            <Link
              to="/settings/account#security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-theme-text-secondary hover:bg-theme-bg hover:text-theme-primary transition duration-150"
            >
              <ShieldAlert className="w-4 h-4 text-theme-text-muted" />
              <span>Security</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-theme-bg-secondary my-1" />

          {/* Footer Logout Button */}
          <div className="px-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-theme-error hover:bg-theme-error-bg transition duration-150 text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
