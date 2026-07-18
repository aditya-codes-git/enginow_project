import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Users, Calendar } from 'lucide-react'
import eventService from '../../services/eventService'
import EventRegistrationsTab from '../../components/organiser/EventRegistrationsTab'

export default function EventRegistrationsPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const [eventData, regsData] = await Promise.all([
          eventService.getEvent(eventId),
          eventService.getEventRegistrations(eventId)
        ])
        setEvent(eventData)
        setRegistrations(regsData || [])
      } catch (err) {
        console.error('Failed to load registrations data:', err)
        setError(err.response?.data?.message || 'Failed to load attendee registrations.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [eventId])

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
          <p className="text-slate-600 mt-4 font-semibold">Loading registrations...</p>
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
        <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-650">Error</p>
          <h1 className="mt-2 font-outfit text-3xl font-bold text-slate-950">Cannot load registrations</h1>
          <p className="text-slate-500 mt-2">{error || 'The event details could not be found.'}</p>
          <Link to="/organiser" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link to="/organiser" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>

        {/* Dashboard Header */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                Registrations Panel
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight font-outfit">
                {event.title}
              </h1>
              <p className="text-slate-350 text-sm max-w-xl">
                Review registration details, inspect team composition, check questionnaire responses, and download CSV reports.
              </p>
            </div>
            
            <div className="bg-slate-800/80 border border-slate-700 px-5 py-4 rounded-2xl flex items-center gap-4 shadow-inner shrink-0">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Registered</p>
                <p className="text-2xl font-bold font-outfit text-white">{registrations.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Registrations List Panel */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-950 font-outfit">Attendee Records</h2>
          </div>
          
          <EventRegistrationsTab registrations={registrations} eventTitle={event.title} />
        </section>

      </div>
    </main>
  )
}
