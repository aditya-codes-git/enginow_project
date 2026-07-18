import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import eventService from '../../services/eventService';
import adminService from '../../services/adminService';
import { Mail, Calendar, Shield, Trophy, FileCode2, Sparkles, Users, User } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial for Avatar
  const firstInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Format joined date
  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'Member since recent';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateString));
    } catch (e) {
      return 'Member since recent';
    }
  };

  useEffect(() => {
    const fetchRoleSpecificStats = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        if (user.role === 'participant') {
          // Fetch events and submissions
          const [events, submissions] = await Promise.all([
            userService.getMyEvents(),
            userService.getMySubmissions(),
          ]);
          setStats({
            registeredEventsCount: (events || []).length,
            submissionsCount: (submissions || []).length,
          });
        } else if (user.role === 'organiser') {
          // Fetch created events
          const response = await eventService.getEvents({ organiser: user.id || user._id });
          setStats({
            eventsCreatedCount: (response.events || []).length,
          });
        } else if (user.role === 'admin') {
          // Fetch users count
          const usersList = await adminService.getUsers();
          setStats({
            usersManagedCount: (usersList || []).length,
          });
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Failed to fetch profile stats:', err);
        }
        setError('Could not load profile statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoleSpecificStats();
  }, [user]);

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 text-slate-850 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-outfit">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your personal details and activity stats.</p>
        </div>

        {/* Profile Card */}
        <section className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden relative p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Large Avatar */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-600 to-blue-700 flex items-center justify-center text-4xl font-black text-white shadow-lg shrink-0 select-none">
              {firstInitial}
            </div>

            {/* User details */}
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  {user?.role}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-950 font-outfit mt-2">{user?.name}</h2>
              </div>

              <div className="grid gap-3 max-w-md mx-auto sm:mx-0 text-sm font-medium text-slate-600">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Joined {formatJoinedDate(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Card */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-950 font-outfit">Activity & Performance</h3>
          
          {loading ? (
            /* Skeleton Loading State */
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-8 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-8 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ) : error ? (
            /* Error Alert */
            <div className="bg-red-50 text-red-750 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold">
              {error}
            </div>
          ) : (
            /* Real Stats */
            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* Participant Stats */}
              {user?.role === 'participant' && (
                <>
                  <div className="bg-white rounded-2xl border border-slate-150 border-l-4 border-l-blue-600 p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Registered Events</p>
                      <strong className="block text-4xl font-extrabold text-slate-900 mt-2 font-outfit">
                        {stats?.registeredEventsCount || 0}
                      </strong>
                      <span className="block text-[11px] text-slate-500 mt-2">Active hackathons or program signups</span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-150 border-l-4 border-l-emerald-500 p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Project Submissions</p>
                      <strong className="block text-4xl font-extrabold text-slate-900 mt-2 font-outfit">
                        {stats?.submissionsCount || 0}
                      </strong>
                      <span className="block text-[11px] text-slate-500 mt-2">GitHub repos and live demo deployments</span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileCode2 className="w-5 h-5" />
                    </div>
                  </div>
                </>
              )}

              {/* Organiser Stats */}
              {user?.role === 'organiser' && (
                <div className="bg-white rounded-2xl border border-slate-150 border-l-4 border-l-pink-600 p-6 shadow-sm flex items-center justify-between sm:col-span-2">
                  <div>
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Events Created</p>
                    <strong className="block text-4xl font-extrabold text-slate-900 mt-2 font-outfit">
                      {stats?.eventsCreatedCount || 0}
                    </strong>
                    <span className="block text-[11px] text-slate-500 mt-2">Programs managed, drafts, pending reviews, and live events</span>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              )}

              {/* Admin Stats */}
              {user?.role === 'admin' && (
                <div className="bg-white rounded-2xl border border-slate-150 border-l-4 border-l-blue-600 p-6 shadow-sm flex items-center justify-between sm:col-span-2">
                  <div>
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Users Managed</p>
                    <strong className="block text-4xl font-extrabold text-slate-900 mt-2 font-outfit">
                      {stats?.usersManagedCount || 0}
                    </strong>
                    <span className="block text-[11px] text-slate-500 mt-2">Identity profiles, moderation settings, and participant directories</span>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              )}

            </div>
          )}
        </section>

      </div>
    </main>
  );
}
