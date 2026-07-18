import React, { useState, useEffect } from 'react'
import { Building2, ClipboardCheck, ShieldCheck, Sparkles, XCircle, CheckCircle } from 'lucide-react'
import OrganiserTable from '../../components/admin/OrganiserTable'
import adminService from '../../services/adminService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { showSuccess, showError } from '../../utils/toast'

function OrganiserManagementPage() {
  const [organisers, setOrganisers] = useState([])
  const [pendingEvents, setPendingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('teams') // 'teams' or 'events'
  const [rejectionEventId, setRejectionEventId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      const [orgsData, eventsData] = await Promise.all([
        adminService.getOrganisers(),
        adminService.getPendingEvents(),
      ])

      // Map teams to match OrganiserTable expected fields
      const mappedOrgs = (orgsData || []).map((o) => ({
        id: o._id,
        name: o.name || 'Unnamed Team',
        contactName: o.members?.[0]?.name || 'N/A',
        email: o.contactEmail || o.members?.[0]?.email || 'N/A',
        status: o.status === 'verified' ? 'Verified' : 'Pending',
        eventsManaged: o.eventsManaged?.length || 0,
        pendingEvents: 0,
        approvalRate: 100,
        joinedAt: o.createdAt,
      }))

      setOrganisers(mappedOrgs)
      setPendingEvents(eventsData || [])
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Failed to load organizer management data:', err)
      }
      setError(err.response?.data?.message || 'Failed to load organizer management data. Please reload.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleVerifyTeam = async (team) => {
    try {
      await adminService.verifyOrganiser(team.id)
      showSuccess('Organiser team verified successfully.')
      fetchDashboardData()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to verify organiser team.')
    }
  }

  const handleApproveEvent = async (eventId) => {
    try {
      await adminService.approveEvent(eventId)
      showSuccess('Event approved successfully.')
      fetchDashboardData()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to approve event.')
    }
  }

  const handleRejectEvent = async (e) => {
    e.preventDefault()
    if (!rejectionReason.trim()) {
      showError('Please enter a rejection reason.')
      return
    }

    try {
      await adminService.rejectEvent(rejectionEventId, rejectionReason)
      showSuccess('Event rejected/returned to organiser with feedback.')
      setRejectionEventId(null)
      setRejectionReason('')
      fetchDashboardData()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reject event.')
    }
  }

  const verifiedTeamsCount = organisers.filter((o) => o.status === 'Verified').length
  const pendingTeamsCount = organisers.filter((o) => o.status === 'Pending').length

  const organiserStats = [
    { label: 'Verified teams', value: verifiedTeamsCount, icon: ShieldCheck, detail: 'Ready to publish' },
    { label: 'Pending review', value: pendingTeamsCount + pendingEvents.length, icon: ClipboardCheck, detail: 'Need admin action' },
    { label: 'Pending events', value: pendingEvents.length, icon: Sparkles, detail: 'Awaiting approvals' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="bg-white text-slate-900 relative">
      <section className="relative overflow-hidden bg-mesh pt-10 pb-12">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <Building2 className="h-4 w-4" />
                Team operations
              </div>
              <h1 className="mt-6 font-outfit text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                Organiser management
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Verify organiser teams, review event quality, and keep publishing workflows moving smoothly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {organiserStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <strong className="mt-4 block font-outfit text-3xl font-bold text-slate-950">{stat.value}</strong>
                    <span className="text-sm font-semibold text-slate-600">{stat.label}</span>
                    <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('teams')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition ${
              activeTab === 'teams' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Organiser Teams ({organisers.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition ${
              activeTab === 'events' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Pending Events Queue ({pendingEvents.length})
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        {activeTab === 'teams' ? (
          <OrganiserTable
            organisers={organisers}
            onVerify={handleVerifyTeam}
          />
        ) : (
          <div className="space-y-4">
            {pendingEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {event.type}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Created {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 font-outfit mt-2">{event.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{event.tagline || event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-450 font-semibold">
                        <span>📍 Mode: {event.mode}</span>
                        <span>🗓️ Dates: {event.startDate} to {event.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleApproveEvent(event.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl text-sm transition cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => setRejectionEventId(event.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl text-sm transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
                <ClipboardCheck className="mx-auto h-10 w-10 text-slate-400" />
                <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-950">No pending events</h2>
                <p className="mx-auto mt-2 max-w-md text-slate-600">
                  Organiser event submissions requiring admin approval will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Reject Reason Modal */}
      {rejectionEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleRejectEvent} className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-950 font-outfit">Reason for Rejection</h3>
            <p className="text-slate-500 text-sm">Please explain why this event listing was not approved so the organiser can revise it.</p>
            
            <textarea
              required
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Incomplete description of criteria or invalid venue details..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-1 focus:ring-blue-600 resize-none"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectionEventId(null)
                  setRejectionReason('')
                }}
                className="flex-1 py-2 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-sm transition text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition shadow-md cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default OrganiserManagementPage
