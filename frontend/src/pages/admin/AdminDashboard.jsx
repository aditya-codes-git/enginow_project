import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  ClipboardCheck,
  ArrowRight,
  ShieldCheck,
  Activity,
  CalendarPlus,
  BookOpen,
  Trophy,
} from 'lucide-react';
import adminService from '../../services/adminService';
import { SkeletonBox } from '../../components/common/Skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    orgsCount: 0,
    pendingEventsCount: 0,
    pendingBlogsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const [users, orgs, pendingEvents, pendingBlogs] = await Promise.all([
          adminService.getUsers(),
          adminService.getOrganisers(),
          adminService.getPendingEvents(),
          adminService.getPendingBlogs(),
        ]);

        setStats({
          usersCount: users.length,
          orgsCount: orgs.length,
          pendingEventsCount: pendingEvents.length,
          pendingBlogsCount: pendingBlogs.length,
        });
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Failed to load admin metrics', err);
        }
        setError('Could not load platform metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Platform Users',
      value: stats.usersCount,
      icon: Users,
      iconWrap: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Organiser Teams',
      value: stats.orgsCount,
      icon: Building2,
      iconWrap: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Pending Events',
      value: stats.pendingEventsCount,
      icon: ClipboardCheck,
      iconWrap: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Pending Blogs',
      value: stats.pendingBlogsCount,
      icon: BookOpen,
      iconWrap: 'bg-violet-50 text-violet-600',
    },
  ];

  const adminActions = [
    {
      title: 'Manage Platform Users',
      description:
        'Review participant profile details, monitor registrations, and suspend or reactivate system accounts.',
      href: '/admin/users',
      icon: Users,
      badge: `${stats.usersCount} Profiles`,
    },
    {
      title: 'Verify Organiser Teams',
      description:
        'Verify organizer workspaces and review their event publishing status to keep the pipeline moving.',
      href: '/admin/organisers',
      icon: Building2,
      badge: `${stats.orgsCount} Teams`,
    },
    {
      title: 'Pending Approvals Queue',
      description:
        'Review pending submissions, check quality standards, and approve or reject events and hackathons with feedback.',
      href: '/admin/events',
      icon: ClipboardCheck,
      badge: `${stats.pendingEventsCount} Awaiting Review`,
    },
    {
      title: 'Manage Hackathons',
      description:
        'Review, approve, reject, and monitor live hackathons from the unified moderation table.',
      href: '/admin/events',
      icon: Trophy,
      badge: `${stats.pendingEventsCount} Pending`,
    },
    {
      title: 'Manage All Events',
      description:
        'Review, approve, reject, and manage every event and hackathon on the platform.',
      href: '/admin/events',
      icon: CalendarPlus,
      badge: 'Manage All',
    },
    {
      title: 'Manage Blogs',
      description:
        'Review pending blogs, approve or reject submissions, and manage published blog content.',
      href: '/admin/blogs',
      icon: BookOpen,
      badge: `${stats.pendingBlogsCount} Pending`,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-xl md:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Platform Control Center
              </span>

              <h1 className="font-outfit text-4xl font-extrabold tracking-tight md:text-5xl">
                System Administration
              </h1>

              <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                Monitor platform health, verify organiser teams, manage system
                accounts, and coordinate event, hackathon, and blog approvals.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <section>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          </section>
        )}

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {card.title}
                  </span>

                  {loading ? (
                    <SkeletonBox className="mt-1 h-9 w-16 rounded" />
                  ) : (
                    <h3 className="font-outfit text-3xl font-extrabold text-slate-900">
                      {card.value}
                    </h3>
                  )}
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconWrap}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h2 className="font-outfit text-2xl font-bold text-slate-950">
              Management Consoles
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            Open a console to manage platform operations and moderation workflows.
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {adminActions.map((action) => {
              const Icon = action.icon;

              return (
                <div
                  key={action.title}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>

                      {!loading && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                          {action.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-outfit text-xl font-bold text-slate-900">
                        {action.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-50 pt-6">
                    <Link
                      to={action.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
                    >
                      Open Console
                      <ArrowRight className="h-4 w-4" />
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