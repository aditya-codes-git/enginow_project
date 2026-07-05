import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { User, ShieldAlert, LogOut, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function AccountSettings() {
  const { user, updateProfile, logoutAll } = useAuth();
  const location = useLocation();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Session State
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');

  // Scroll to security section if hash is present
  useEffect(() => {
    if (location.hash === '#security') {
      const element = document.getElementById('security');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Keep state synced when user context loads/updates
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    if (!name.trim()) {
      setProfileError('Name cannot be empty.');
      setProfileLoading(false);
      return;
    }

    try {
      await updateProfile({ name: name.trim() });
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    const confirm = window.confirm(
      'Are you sure you want to log out from all devices? This will invalidate all active sessions, including this one.'
    );
    if (!confirm) return;

    setSessionLoading(true);
    setSessionError('');

    try {
      await logoutAll();
    } catch (err) {
      setSessionError(err.response?.data?.message || 'Failed to terminate active sessions.');
      setSessionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-theme-bg/50 py-10 px-4 sm:px-6 lg:px-8 text-slate-850 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text font-outfit">Account Settings</h1>
          <p className="text-sm text-theme-text-secondary mt-1">Manage your developer profile and security configurations.</p>
        </div>

        {/* Profile Card */}
        <section className="bg-theme-surface rounded-3xl border border-theme-divider shadow-sm overflow-hidden">
          <div className="border-b border-theme-divider bg-theme-bg px-6 py-4 flex items-center gap-3">
            <User className="w-5 h-5 text-theme-primary" />
            <div>
              <h2 className="font-bold text-theme-text text-base font-outfit">Profile Information</h2>
              <p className="text-xs text-theme-text-secondary">Update your public identity details.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-theme-success-border bg-theme-success-bg px-4 py-3 text-sm font-semibold text-theme-success">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="flex items-center gap-2 rounded-xl border border-theme-error-border bg-theme-error-bg px-4 py-3 text-sm font-semibold text-theme-error">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {profileError}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-theme-border text-sm bg-theme-bg focus:bg-theme-surface outline-none focus:ring-1 focus:ring-theme-focus transition duration-150 text-theme-text font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-theme-border text-sm bg-theme-bg-secondary text-theme-text-secondary outline-none cursor-not-allowed font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wide">Account Role</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-theme-border text-sm bg-theme-bg-secondary text-theme-text-secondary outline-none cursor-not-allowed font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-50">
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary text-white font-semibold py-2 px-5 rounded-xl text-sm transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {profileLoading ? 'Saving changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>

        {/* Security Password Card */}
        <section id="security" className="bg-theme-surface rounded-3xl border border-theme-divider shadow-sm overflow-hidden">
          <div className="border-b border-theme-divider bg-theme-bg px-6 py-4 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-theme-primary" />
            <div>
              <h2 className="font-bold text-theme-text text-base font-outfit">Security Credentials</h2>
              <p className="text-xs text-theme-text-secondary">Update password and secure access tokens.</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-6">
            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-theme-success-border bg-theme-success-bg px-4 py-3 text-sm font-semibold text-theme-success">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="flex items-center gap-2 rounded-xl border border-theme-error-border bg-theme-error-bg px-4 py-3 text-sm font-semibold text-theme-error">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {passwordError}
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-theme-border text-sm bg-theme-bg focus:bg-theme-surface outline-none focus:ring-1 focus:ring-theme-focus transition duration-150 text-theme-text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-theme-border text-sm bg-theme-bg focus:bg-theme-surface outline-none focus:ring-1 focus:ring-theme-focus transition duration-150 text-theme-text"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-theme-text-secondary uppercase tracking-wide">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-theme-border text-sm bg-theme-bg focus:bg-theme-surface outline-none focus:ring-1 focus:ring-theme-focus transition duration-150 text-theme-text"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-50">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary text-white font-semibold py-2 px-5 rounded-xl text-sm transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {passwordLoading ? 'Changing password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </section>

        {/* Sessions Card */}
        <section className="bg-theme-surface rounded-3xl border border-theme-divider shadow-sm overflow-hidden">
          <div className="border-b border-theme-divider bg-theme-bg px-6 py-4 flex items-center gap-3">
            <LogOut className="w-5 h-5 text-theme-primary" />
            <div>
              <h2 className="font-bold text-theme-text text-base font-outfit">Active User Sessions</h2>
              <p className="text-xs text-theme-text-secondary">Sign out of all devices and active browsers.</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {sessionError && (
              <div className="flex items-center gap-2 rounded-xl border border-theme-error-border bg-theme-error-bg px-4 py-3 text-sm font-semibold text-theme-error">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {sessionError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <p className="text-sm font-medium text-theme-text">
                  Wipe all active refresh tokens for this account.
                </p>
                <p className="text-xs text-theme-text-secondary mt-1">
                  You will be logged out of this device, as well as any other browsers, computers, or devices running EngiNow.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogoutAll}
                disabled={sessionLoading}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-5 rounded-xl text-sm transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 shrink-0"
              >
                {sessionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {sessionLoading ? 'Logging out...' : '🚪 Logout All Devices'}
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
