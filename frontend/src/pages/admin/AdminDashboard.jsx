import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, ClipboardCheck, ArrowRight, ShieldCheck, Activity, CalendarPlus } from 'lucide-react';
import adminService from '../../services/adminService';
import { SkeletonBox } from '../../components/common/Skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    orgsCount: 0,
    pendingEventsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [users, orgs, pendingEvents] = await Promise.all([
          adminService.getUsers(),
          adminService.getOrganisers(),
          adminService.getPendingEvents(),
        ]);
        setStats({
          usersCount: users.length,
          orgsCount: orgs.length,
          pendingEventsCount: pendingEvents.length,
        });
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Failed to load admin metrics:', err);
        }
        setError('Could not load platform metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminActions = [
    {
      title: 'Manage Platform Users',
      description: 'Review participant profile details, monitor registrations, and suspend or reactivate system accounts.',
      href: '/admin/users',
      icon: Users,
      color: 'blue',
      badge: `${stats.usersCount} Profiles`,
    },
    {
      title: 'Verify Organiser Teams',
      description: 'Verify organizer workspaces and review their event publishing status to keep the pipeline moving.',
      href: '/admin/organisers',
      icon: Building2,
      color: 'emerald',
      badge: `${stats.orgsCount} Workspace Teams`,
    },
    {
      title: 'Pending Approvals Queue',
      description: 'Review pending event details, check for quality standards, and approve or request revisions.',
      href: '/admin/organisers', // This page handles pending events under the second tab
      icon: ClipboardCheck,
      color: 'amber',
      badge: `${stats.pendingEventsCount} Awaiting Review`,
    },
    {
      title: 'Manage All Events',
      description: 'Open the event operations workspace to create, edit, archive, delete, and inspect registrations for any event.',
      href: '/organiser',
      icon: CalendarPlus,
      color: 'cyan',
      badge: 'Full Access',
    },
  ];

  return (
    <main className="min-h-screen bg-theme-bg/50 p-6 md:p-8 text-theme-text font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header Section */}
        <section className="relative overflow-hidden rounded-3xl bg-theme-primary text-white p-8 md:p-12 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Control Center
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-outfit">
                System Administration
              </h1>
              <p className="text-theme-text-muted text-base md:text-lg leading-relaxed">
                Monitor platform health, verify organizer teams, manage system accounts, and coordinate event approvals.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-theme-error-border bg-theme-error-bg p-4 text-sm font-semibold text-theme-error">
            {error}
          </div>
        )}

        {/* Live Platform Stats */}
        <section className="grid gap-6 sm:grid-cols-3">
          <div className="bg-theme-surface rounded-2xl border border-theme-border/60 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Platform Users</span>
              {loading ? (
                <SkeletonBox className="h-9 w-16 rounded mt-1" />
              ) : (
                <h3 className="text-3xl font-extrabold text-theme-text font-outfit">{stats.usersCount}</h3>
              )}
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-theme-primary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-theme-surface rounded-2xl border border-theme-border/60 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Organiser Teams</span>
              {loading ? (
                <SkeletonBox className="h-9 w-16 rounded mt-1" />
              ) : (
                <h3 className="text-3xl font-extrabold text-theme-text font-outfit">{stats.orgsCount}</h3>
              )}
            </div>
            <div className="h-12 w-12 rounded-xl bg-theme-success-bg text-theme-success flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-theme-surface rounded-2xl border border-theme-border/60 p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">Pending Approvals</span>
              {loading ? (
                <SkeletonBox className="h-9 w-16 rounded mt-1" />
              ) : (
                <h3 className="text-3xl font-extrabold text-theme-text font-outfit">{stats.pendingEventsCount}</h3>
              )}
            </div>
            <div className="h-12 w-12 rounded-xl bg-theme-warning-bg text-theme-warning flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Management Directory Hub */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-theme-primary" />
            <h2 className="text-2xl font-bold text-theme-text font-outfit">Management Consoles</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {adminActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.title} className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-theme-bg border border-theme-divider rounded-2xl text-theme-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      {!loading && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-theme-bg-secondary text-theme-text-secondary">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-outfit text-theme-text">{action.title}</h3>
                      <p className="text-theme-text-secondary text-sm leading-relaxed">{action.description}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 mt-6">
                    <Link
                      to={action.href}
                      className="w-full inline-flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-primary text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all"
                    >
                      Open Console <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
