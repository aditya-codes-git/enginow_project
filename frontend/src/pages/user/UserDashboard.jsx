import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import { CalendarDays, Code, ExternalLink, Mail, User, Shield, Calendar, Send } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import { Link } from "react-router-dom";
import EmptyState from '../../components/common/EmptyState';
import { SkeletonBox } from '../../components/common/Skeleton';

export default function UserDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Change 4: Concurrent API loading using Promise.all
        const [eventsData, submissionsData] = await Promise.all([
          userService.getMyEvents(),
          userService.getMySubmissions(),
        ]);
        setEvents(eventsData);
        setSubmissions(submissionsData);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error(err);
        }
        setError('Failed to fetch dashboard metrics. Please reload.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Inline loading skeletons instead of full-page loading spinner

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Profile Card Header */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-700 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Participant Profile
                </span>
                <h1 className="text-3xl font-bold tracking-tight font-outfit">{user?.name}</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-350 text-sm">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {user?.email}</span>
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Role: {user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Dashboard Stats */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-blue-600 p-6 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div>
              <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Registered Programs</p>
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg mt-2" />
              ) : (
                <p className="text-4xl font-extrabold text-slate-900 mt-2 font-outfit">{(events || []).length}</p>
              )}
            </div>
            <p className="text-slate-500 text-xs font-medium border-t border-slate-50 pt-3 mt-4">
              Active hackathons and public events
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500 p-6 shadow-sm flex flex-col justify-between min-h-[130px]">
            <div>
              <p className="text-slate-450 text-xs font-semibold uppercase tracking-wider">Project Submissions</p>
              {loading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-lg mt-2" />
              ) : (
                <p className="text-4xl font-extrabold text-slate-900 mt-2 font-outfit">{(submissions || []).length}</p>
              )}
            </div>
            <p className="text-slate-500 text-xs font-medium border-t border-slate-50 pt-3 mt-4">
              GitHub and live demo references
            </p>
          </div>
        </section>

        {/* Grid Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Registered Events */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-slate-950">Your Registered Events</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                      <div className="flex gap-2">
                        <SkeletonBox className="h-5 w-16 rounded-full" />
                        <SkeletonBox className="h-5 w-24 rounded-full" />
                      </div>
                      <SkeletonBox className="h-6 w-3/4 rounded-md" />
                      <SkeletonBox className="h-4 w-5/6 rounded" />
                    </div>
                  ))}
                </div>
              ) : (events || []).length > 0 ? (
                (events || []).map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-55 text-blue-700">{evt.type}</span>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" /> {formatDate(evt.startDate)}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-950">{evt.title}</h3>
                      <p className="text-slate-500 text-sm max-w-md line-clamp-1">{evt.tagline || evt.description}</p>
                    </div>
                    <Link
                      to={evt.type === 'Hackathon' ? `/hackathons/${evt.slug || evt.id}` : `/events/${evt.slug || evt.id}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm transition shrink-0"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No registered events"
                  description="You haven't registered for any events yet. Check out open opportunities."
                  icon={Calendar}
                  actionText="Browse Active Events"
                  actionHref="/events"
                />
              )}
            </div>
          </section>

          {/* Submissions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-slate-950">Your Project Submissions</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                      <div className="flex justify-between">
                        <SkeletonBox className="h-5 w-16 rounded-full" />
                        <SkeletonBox className="h-4 w-12 rounded" />
                      </div>
                      <SkeletonBox className="h-6 w-2/3 rounded-md" />
                      <SkeletonBox className="h-4 w-5/6 rounded" />
                    </div>
                  ))}
                </div>
              ) : (submissions || []).length > 0 ? (
                (submissions || []).map((sub) => (
                  <div key={sub._id || sub.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">Project</span>
                        <h3 className="font-bold text-lg text-slate-950 mt-1">{sub.title}</h3>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {formatDate(sub.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2">{sub.description}</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {sub.githubUrl && (
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 transition"
                        >
                          <Code className="w-3.5 h-3.5" /> Repository <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {sub.demoUrl && (
                        <a
                          href={sub.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 transition"
                        >
                          Live Demo <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No project submissions"
                  description="No project submissions have been made yet. Submit your project via registered Hackathons when ready."
                  icon={Send}
                />
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

function formatDate(dateString) {
  if (!dateString) return 'Recent';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch (e) {
    return 'Recent';
  }
}
