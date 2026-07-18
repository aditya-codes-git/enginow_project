import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Users, User, Send, CheckCircle } from 'lucide-react'
import eventService from '../../services/eventService'
import { useAuth } from '../../hooks/useAuth'
import { showSuccess, showError } from '../../utils/toast'

function getTeamSizeLimits(teamSize) {
  if (teamSize && typeof teamSize === 'object') {
    const min = Math.max(1, Number(teamSize.min) || 1)
    const max = Math.max(min, Number(teamSize.max) || min)
    return { min, max }
  }

  if (typeof teamSize === 'string') {
    const parts = teamSize.split('-').map((part) => parseInt(part.trim(), 10))
    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      const min = Math.max(1, parts[0])
      return { min, max: Math.max(min, parts[1]) }
    }

    if (parts.length === 1 && !Number.isNaN(parts[0])) {
      const size = Math.max(1, parts[0])
      return { min: size, max: size }
    }
  }

  return { min: 1, max: 1 }
}

export default function RegistrationModal({ event, onClose, onSuccess }) {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Configure constraints
  const { min: minTeamSize, max: maxTeamSize } = getTeamSizeLimits(event.teamSize)
  const hasTeamSupport = maxTeamSize > 1
  const mustBeTeam = minTeamSize > 1

  // State fields
  const [registrationType, setRegistrationType] = useState(
    mustBeTeam ? 'team' : 'individual'
  )
  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembers] = useState([
    { name: user?.name || '', email: user?.email || '', role: 'Leader' }
  ])
  
  // Custom Answers State
  const [answers, setAnswers] = useState({})

  // Initialize empty answers for questions
  useEffect(() => {
    if (event.registrationQuestions && event.registrationQuestions.length > 0) {
      const initialAnswers = {}
      event.registrationQuestions.forEach((q) => {
        initialAnswers[q] = ''
      })
      setAnswers(initialAnswers)
    }
  }, [event])

  const handleAddMember = () => {
    if (teamMembers.length >= maxTeamSize) return
    setTeamMembers([...teamMembers, { name: '', email: '', role: '' }])
  }

  const handleRemoveMember = (index) => {
    // Keep at least 1 member (the leader)
    if (teamMembers.length <= 1) return
    const nextMembers = [...teamMembers]
    nextMembers.splice(index, 1)
    setTeamMembers(nextMembers)
  }

  const handleMemberChange = (index, field, value) => {
    const nextMembers = [...teamMembers]
    nextMembers[index][field] = value
    setTeamMembers(nextMembers)
  }

  const handleAnswerChange = (question, value) => {
    setAnswers({ ...answers, [question]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // 1. Questionnaire answers formatting
      const formattedAnswers = Object.entries(answers).map(([question, answer]) => ({
        question,
        answer: answer.trim()
      }))

      // Validate that all questions are answered
      const unanswered = formattedAnswers.some((ans) => !ans.answer)
      if (unanswered) {
        throw new Error('Please answer all custom registration questions.')
      }

      // 2. Payload generation
      const payload = {
        registrationType,
        answers: formattedAnswers
      }

      if (registrationType === 'team') {
        if (!teamName.trim()) {
          throw new Error('Team name is required.')
        }

        // Validate members
        const invalidMember = teamMembers.some(
          (m) => !m.name.trim() || !m.email.trim() || !m.role.trim()
        )
        if (invalidMember) {
          throw new Error('Please complete name, email, and role for all team members.')
        }

        if (teamMembers.length < minTeamSize || teamMembers.length > maxTeamSize) {
          throw new Error(`Your team size must be between ${minTeamSize} and ${maxTeamSize} members.`)
        }

        payload.teamName = teamName.trim()
        payload.teamMembers = teamMembers.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim(),
          role: m.role.trim()
        }))
      }

      // 3. API Invocation
      await eventService.registerForEvent(event.id, payload)
      
      setSuccess(true)
      showSuccess(`Successfully registered for ${event.title}!`)
      
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1800)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.')
      showError(err.response?.data?.message || err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 transition"
          disabled={submitting}
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-outfit">Registration Confirmed!</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              You're all set to participate. Head over to your dashboard to track details or projects.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div>
              <h3 className="text-2xl font-extrabold text-slate-950 font-outfit">Register for {event.type}</h3>
              <p className="text-slate-500 text-sm mt-1">{event.title}</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Registration Type Choice */}
            {hasTeamSupport && !mustBeTeam && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registration Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationType('individual')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border font-bold text-sm transition ${
                      registrationType === 'individual'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegistrationType('team')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border font-bold text-sm transition ${
                      registrationType === 'team'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-655'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Team
                  </button>
                </div>
              </div>
            )}

            {/* Team details fields */}
            {registrationType === 'team' && (
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Dream Hackers"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Team Members ({teamMembers.length} of max {maxTeamSize})
                    </label>
                    {teamMembers.length < maxTeamSize && (
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Member
                      </button>
                    )}
                  </div>

                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {index === 0 ? 'Team Leader (You)' : `Member #${index + 1}`}
                        </span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(index)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Full Name</label>
                          <input
                            type="text"
                            required
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            placeholder="Name"
                            disabled={index === 0}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-colors disabled:opacity-70 disabled:bg-slate-50 disabled:hover:border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Email Address</label>
                          <input
                            type="email"
                            required
                            value={member.email}
                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                            placeholder="Email"
                            disabled={index === 0}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-colors disabled:opacity-70 disabled:bg-slate-50 disabled:hover:border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Team Role</label>
                          <input
                            type="text"
                            required
                            value={member.role}
                            onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                            placeholder="e.g. Developer, Designer"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Questionnaire */}
            {event.registrationQuestions && event.registrationQuestions.length > 0 && (
              <div className="space-y-5 border-t border-slate-100 pt-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Questionnaire</label>
                {event.registrationQuestions.map((q, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800 block leading-tight">{q}</label>
                    <textarea
                      required
                      rows={3}
                      value={answers[q] || ''}
                      onChange={(e) => handleAnswerChange(q, e.target.value)}
                      placeholder="Enter your response here..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-slate-300 transition-colors resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Submit Actions */}
            <div className="border-t border-slate-100 pt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition hover:-translate-y-0.5 active:translate-y-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Registering...' : 'Register Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
