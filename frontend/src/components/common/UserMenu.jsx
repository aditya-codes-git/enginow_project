import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, CalendarDays, Settings, ShieldAlert, LogOut } from 'lucide-react';

export default function UserMenu({ user, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
      >
        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {firstInitial}
        </div>
        <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
          {firstName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-150 bg-white shadow-2xl py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Top User Summary */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-xl font-extrabold text-white shadow-md">
              {firstInitial}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 truncate leading-tight">{user?.name}</h4>
              <p className="text-xs text-slate-500 truncate mt-0.5 leading-tight">{user?.email}</p>
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
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition duration-150"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              to={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition duration-150"
            >
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span>My Events / Dashboard</span>
            </Link>

            <Link
              to="/settings/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition duration-150"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Settings</span>
            </Link>

            <Link
              to="/settings/account#security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition duration-150"
            >
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Security</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 my-1" />

          {/* Footer Logout Button */}
          <div className="px-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-650 hover:bg-red-50 transition duration-150 text-left cursor-pointer"
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
