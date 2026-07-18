import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Eye, CalendarPlus, Search } from 'lucide-react';
import adminService from '../../services/adminService';
import { showSuccess, showError } from '../../utils/toast';

function EventManagementPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await adminService.getEvents();
      setEvents(data || []);
    } catch (err) {
      showError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApprove = async (eventId) => {
    if (!window.confirm('Approve this event and make it live?')) return;

    try {
      await adminService.approveEvent(eventId);
      showSuccess('Event approved and is now live!');
      fetchEvents();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to approve event.');
    }
  };

  const handleReject = async (eventId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;

    if (reason.trim().length < 5) {
      showError('Rejection reason must be at least 5 characters.');
      return;
    }

    try {
      await adminService.rejectEvent(eventId, reason.trim());
      showSuccess('Event rejected.');
      fetchEvents();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reject event.');
    }
  };

  const filteredEvents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return events;

    return events.filter((event) => {
      const title = event.title?.toLowerCase() || '';
      const organiser = event.organiser?.name?.toLowerCase() || '';
      return title.includes(term) || organiser.includes(term);
    });
  }, [events, searchTerm]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-outfit text-3xl font-bold text-slate-900">
            Event & Hackathon Management
          </h1>
          <p className="mt-1 text-slate-500">
            Review, approve, reject, and monitor community submissions.
          </p>
        </div>

        <Link
          to="/organiser/events/new?type=Event"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          <CalendarPlus className="h-5 w-5" />
          Create Event
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/50 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or organiser..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Title & Type</th>
                <th className="px-6 py-4 font-semibold">Organiser</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event._id || event.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{event.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{event.type || 'Event'}</p>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {event.organiser?.name || event.organiserName || 'Unknown'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                          event.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : event.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : event.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/events/${event._id || event.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="View Event"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        {event.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(event._id || event.id)}
                              className="rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-50"
                              title="Approve"
                              type="button"
                            >
                              <Check className="h-5 w-5" />
                            </button>

                            <button
                              onClick={() => handleReject(event._id || event.id)}
                              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                              title="Reject"
                              type="button"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default EventManagementPage;