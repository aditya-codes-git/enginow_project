import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Mail, MapPin, Trophy, Users, Video, Send, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import eventService from '../../services/eventService'
import userService from '../../services/userService'
import submissionService from '../../services/submissionService'
import TextBlock from '../../components/common/TextBlock'
import { showSuccess, showError } from '../../utils/toast'
import RegistrationModal from '../../components/common/RegistrationModal'

function formatDate(value) {
  if (!value) return 'Not announced'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

/** Format teamSize object → readable string */
function formatTeamSize(teamSize) {
  if (!teamSize) return null
  if (typeof teamSize === 'string') return teamSize.includes('-') ? `${teamSize} members` : `${teamSize} member${teamSize !== '1' ? 's' : ''}`
  if (typeof teamSize === 'object') {
    const min = teamSize.min ?? 1
    const max = teamSize.max ?? 1
    if (min === max) return `${min} member${min !== 1 ? 's' : ''}`
    return `${min} – ${max} members`
  }
  return String(teamSize)
}

function getMaxTeamSize(teamSize) {
  if (teamSize && typeof teamSize === 'object') return Number(teamSize.max) || 1
  if (typeof teamSize === 'string') {
    const parts = teamSize.split('-').map((part) => parseInt(part.trim(), 10))
    if (parts.length === 2 && !Number.isNaN(parts[1])) return parts[1]
    if (parts.length === 1 && !Number.isNaN(parts[0])) return parts[0]
  }
  return 1
}

/** Format track array → bullet-separated string */
function formatTracks(track) {
  if (!track) return null
  if (typeof track === 'string') return track
  if (Array.isArray(track)) {
    const filtered = track.filter(Boolean)
    if (filtered.length === 0) return null
    return filtered.join(' • ')
  }
  return String(track)
}

function InfoBlock({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-blue-600">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-550">{label}</dt>
          <dd className="mt-1 text-base font-bold text-slate-950 break-words" style={{ overflowWrap: 'anywhere' }}>{value || 'Not set'}</dd>
        </div>
      </div>
    </div>
  )
}

function EventDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const isHackathon = location.pathname.includes('hackathons')
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [submittingReg, setSubmittingReg] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  
  // Submission Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submissionTitle, setSubmissionTitle] = useState('')
  const [submissionDesc, setSubmissionDesc] = useState('')
  const [submissionGithub, setSubmissionGithub] = useState('')
  const [submissionDemo, setSubmissionDemo] = useState('')
  const [submittingProject, setSubmittingProject] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [pageError, setPageError] = useState('')

  const loadEventData = useCallback(async () => {
    setLoading(true)
    setPageError('')
    try {
      const data = await eventService.getEvent(slug)

      // Client-side permanent redirect for legacy ObjectId URLs
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug)
      if (isObjectId && data.slug) {
        navigate(`/${data.type === 'Hackathon' ? 'hackathons' : 'events'}/${data.slug}`, { replace: true })
        return
      }

      setEvent(data)

      // Only check registration status if participant is logged in
      if (isAuthenticated && user?.role === 'participant') {
        try {
          const myRegistered = await userService.getMyEvents()
          const registered = myRegistered.some((e) => e.id === data.id)
          setIsRegistered(registered)
        } catch (regErr) {
          // Registration check failure should not block event viewing
          if (regErr.response?.status !== 401) {
            console.error('Failed to check registration status:', regErr)
          }
        }
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(err)
      }
      setPageError(err.response?.data?.message || 'Failed to load event details.')
    } finally {
      setLoading(false)
    }
  }, [slug, navigate, isAuthenticated, user])

  useEffect(() => {
    loadEventData()
  }, [loadEventData])

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    
    const maxTeam = getMaxTeamSize(event.teamSize)
    const questionsCount = event.registrationQuestions?.length || 0
    if (maxTeam > 1 || questionsCount > 0) {
      setShowRegistrationModal(true)
      return
    }
    
    setSubmittingReg(true)
    try {
      await eventService.registerForEvent(event.id)
      setIsRegistered(true)
      showSuccess(`Successfully registered for the ${isHackathon ? 'hackathon' : 'event'}!`)
      // Refresh count
      const updated = await eventService.getEvent(slug)
      setEvent(updated)
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmittingReg(false)
    }
  }

  const handleRegistrationSuccess = async () => {
    setIsRegistered(true)
    try {
      const updated = await eventService.getEvent(slug)
      setEvent(updated)
    } catch (err) {
      console.error('Failed to reload event details:', err)
    }
  }

  const handleCancelRegistration = async () => {
    if (!window.confirm(`Are you sure you want to cancel your registration for this ${isHackathon ? 'hackathon' : 'event'}?`)) return
    
    setSubmittingReg(true)
    try {
      await eventService.cancelRegistration(event.id)
      setIsRegistered(false)
      showSuccess('Registration cancelled successfully.')
      // Refresh count
      const updated = await eventService.getEvent(slug)
      setEvent(updated)
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to cancel registration.')
    } finally {
      setSubmittingReg(false)
    }
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    setSubmittingProject(true)
    setSubmissionError('')
    
    try {
      await submissionService.submitProject(event.id, {
        title: submissionTitle,
        description: submissionDesc,
        githubUrl: submissionGithub,
        demoUrl: submissionDemo,
      })
      setSubmissionSuccess(true)
      setTimeout(() => {
        setShowSubmitModal(false)
        setSubmissionSuccess(false)
        setSubmissionTitle('')
        setSubmissionDesc('')
        setSubmissionGithub('')
        setSubmissionDemo('')
      }, 2000)
    } catch (err) {
      setSubmissionError(err.response?.data?.message || 'Failed to submit project.')
    } finally {
      setSubmittingProject(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-mesh px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-neutral-600 mt-4 font-semibold">Loading {isHackathon ? 'hackathon' : 'event'} details...</p>
        </div>
      </main>
    )
  }

  if (pageError || !event) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-mesh px-4 py-10">
        <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-650">Error</p>
          <h1 className="mt-2 font-outfit text-4xl font-bold text-slate-950">This {isHackathon ? 'hackathon' : 'event'} is unavailable</h1>
          <p className="text-slate-550 mt-2">{pageError || `The ${isHackathon ? 'hackathon' : 'event'} you are looking for does not exist.`}</p>
          <Link to={isHackathon ? "/hackathons" : "/events"} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to {isHackathon ? "hackathons" : "events"}
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen text-slate-900 relative">
      {/* Immersive Cover Hero */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        {/* Full-width Cover Image */}
        <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px]">
          <img 
            src={event.coverImage || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952'} 
            alt={event.title} 
            className="h-full w-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-10">
              <Link to={isHackathon ? "/hackathons" : "/events"} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to {isHackathon ? "hackathons" : "events"}
              </Link>

              <div className="space-y-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20 uppercase tracking-wider backdrop-blur-sm">
                  {event.type || 'Event'}
                </span>
                <h1 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white tracking-tight max-w-3xl break-words">
                  {event.title}
                </h1>
                {event.tagline && (
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl">
                    {event.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Info Strip */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{formatDate(event.startDate)}</span>
              </div>
              {event.registrationDeadline && (
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">Deadline</span>
                  <span className="font-medium">{formatDate(event.registrationDeadline)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{event.location || event.city || 'Online'}</span>
              </div>
              {event.registrationCount > 0 && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{event.registrationCount} registered</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 overflow-hidden">
        <article className="space-y-8 lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 max-w-full overflow-hidden">
            <h2 className="font-outfit text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3 font-outfit">Overview</h2>
            <TextBlock className="mt-4 text-slate-650 leading-relaxed text-sm sm:text-base">
              {event.description || 'More details will be shared by the organiser soon.'}
            </TextBlock>

            {event.rules && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-outfit text-xl font-bold text-slate-900 font-outfit">Rules</h3>
                <TextBlock className="mt-3 text-slate-650" size="sm">{event.rules}</TextBlock>
              </div>
            )}

            {event.judgingCriteria && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-outfit text-xl font-bold text-slate-900 font-outfit">Judging Criteria</h3>
                <TextBlock className="mt-3 text-slate-650" size="sm">{event.judgingCriteria}</TextBlock>
              </div>
            )}

            {event.eligibility && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="font-outfit text-xl font-bold text-slate-900 font-outfit">Eligibility</h3>
                <TextBlock className="mt-3 text-slate-650" size="sm">{event.eligibility}</TextBlock>
              </div>
            )}
          </div>
        </article>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 h-fit max-w-full overflow-hidden">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md max-w-full overflow-hidden">
            <h2 className="font-outfit text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 font-outfit">Participation</h2>
            <div className="space-y-4 mb-6">
              {event.prizePool && (
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100/85">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Prize Pool</span>
                    <span className="text-base font-extrabold text-slate-900 block mt-0.5">{event.prizePool}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100/85">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Size</span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">{formatTeamSize(event.teamSize)}</span>
                </div>
              </div>
              {formatTracks(event.track) && (
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100/85">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Track</span>
                    <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">{formatTracks(event.track)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Action Panel */}
            <div className="border-t border-slate-100 pt-5">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all hover:shadow-lg text-center text-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Login to Register
                </Link>
              ) : user?.role === 'participant' ? (
                isRegistered ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 border border-emerald-250 p-3 rounded-xl">
                      Registered ✓
                    </div>
                    {event.type === 'Hackathon' && (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Submit Project
                      </button>
                    )}
                    <button
                      onClick={handleCancelRegistration}
                      disabled={submittingReg}
                      className="w-full inline-flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition text-sm disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {submittingReg ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={submittingReg}
                    className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submittingReg ? 'Registering...' : `Register for ${isHackathon ? 'Hackathon' : 'Event'}`}
                  </button>
                )
              ) : (
                <div className="text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  You are viewing this as {user?.role === 'admin' ? 'an admin' : 'an organiser'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-full overflow-hidden">
            <h2 className="font-outfit text-lg font-bold text-slate-900 mb-3">Questions?</h2>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 overflow-hidden border border-slate-100">
              <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-600" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-450 uppercase tracking-wide">Organiser Contact</p>
                <p className="text-sm font-bold text-slate-900 mt-1 break-words leading-tight">{event.contactName || event.organiserName || 'Organiser team'}</p>
                <p className="text-xs text-slate-550 font-semibold break-all mt-1">{event.contactEmail || 'events@enginow.com'}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Project Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition"
            >
              ✕
            </button>

            {submissionSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900 font-outfit">Project Submitted!</h3>
                <p className="text-slate-500 text-sm">Your project submission was recorded successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950 font-outfit">Submit Your Project</h3>
                  <p className="text-slate-500 text-sm mt-1">Provide repository URLs and descriptions for judges.</p>
                </div>

                {submissionError && (
                  <div className="bg-red-50 text-red-700 text-xs font-semibold p-3 rounded-xl border border-red-200">
                    {submissionError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Project Title</label>
                  <input
                    type="text"
                    required
                    value={submissionTitle}
                    onChange={(e) => setSubmissionTitle(e.target.value)}
                    placeholder="EngiNow Events App"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={submissionDesc}
                    onChange={(e) => setSubmissionDesc(e.target.value)}
                    placeholder="Detail the problem solved, stack used, and setup instructions..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={submissionGithub}
                    onChange={(e) => setSubmissionGithub(e.target.value)}
                    placeholder="https://github.com/your-username/repo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Live Demo Link (Optional)</label>
                  <input
                    type="url"
                    value={submissionDemo}
                    onChange={(e) => setSubmissionDemo(e.target.value)}
                    placeholder="https://demo-app.vercel.app"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingProject}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submittingProject ? 'Submitting...' : 'Submit Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </main>
  )
}

export default EventDetailPage
