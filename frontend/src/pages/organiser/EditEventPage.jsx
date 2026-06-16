import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StatusBadge from '../../components/common/StatusBadge'
import Step2EventDetails from '../../components/organiser/StepForm/Step2EventDetails'
import Step3Content from '../../components/organiser/StepForm/Step3Content'
import Step4Schedule from '../../components/organiser/StepForm/Step4Schedule'
import Step5Media from '../../components/organiser/StepForm/Step5Media'
import Step6OrgContact from '../../components/organiser/StepForm/Step6OrgContact'
import Step7Preview from '../../components/organiser/StepForm/Step7Preview'
import useEvents, { defaultEventDraft, getEventCompletion } from '../../hooks/useEvents'
import eventService from '../../services/eventService'

const tabs = [
  { label: 'Details', component: Step2EventDetails },
  { label: 'Content', component: Step3Content },
  { label: 'Schedule', component: Step4Schedule },
  { label: 'Media', component: Step5Media },
  { label: 'Operations', component: Step6OrgContact },
  { label: 'Preview', component: Step7Preview },
]

function EditEventPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { updateEvent, archiveEvent } = useEvents()
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState(defaultEventDraft)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState(null)

  const ActiveTab = tabs[activeTab].component
  const completion = useMemo(() => getEventCompletion(formData), [formData])

  const fetchDetails = async () => {
    setLoading(true)
    setNotice('')
    setErrorState(null)
    try {
      const data = await eventService.getEvent(eventId)
      setFormData({ ...defaultEventDraft, ...data })
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(err)
      }
      if (err.response?.status === 403) {
        setErrorState(403)
      } else if (err.response?.status === 404) {
        setErrorState(404)
      } else {
        setErrorState(500)
      }
      setNotice(err.response?.data?.message || 'Failed to load event details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [eventId])

  const updateField = (field, value) => {
    setNotice('')
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async () => {
    setNotice('')
    try {
      const updated = await updateEvent(formData.id, formData)
      setFormData({ ...defaultEventDraft, ...updated })
      setNotice('Event changes saved.')
    } catch (err) {
      const serverMessage = err.response?.data?.message
      const validationErrors = err.response?.data?.errors
      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
        const details = validationErrors.map(e => {
          const fieldName = e.field.replace('body.', '');
          return `${fieldName}: ${e.message}`;
        }).join(', ');
        setNotice(`Validation failed: ${details}`);
      } else {
        setNotice(serverMessage || err.message || 'Failed to save changes.');
      }
    }
  }

  const handleArchive = async () => {
    setNotice('')
    try {
      await archiveEvent(formData.id)
      setFormData((current) => ({ ...current, status: 'Archived' }))
      setNotice('Event archived.')
    } catch (err) {
      setNotice(err.response?.data?.message || err.message || 'Failed to archive event.')
    }
  }

  const handleSubmitForApproval = async () => {
    setNotice('')
    try {
      const updated = await eventService.submitEvent(formData.id)
      setFormData({ ...defaultEventDraft, ...updated })
      setNotice('Event submitted for admin approval successfully.')
    } catch (err) {
      const serverMessage = err.response?.data?.message
      const validationErrors = err.response?.data?.errors
      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
        const details = validationErrors.map(e => {
          const fieldName = e.field.replace('body.', '');
          return `${fieldName}: ${e.message}`;
        }).join(', ');
        setNotice(`Validation failed: ${details}`);
      } else {
        setNotice(serverMessage || err.message || 'Failed to submit event for approval.');
      }
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
          <p className="text-neutral-600 mt-4">Loading event editor...</p>
        </div>
      </main>
    )
  }

  if (errorState === 403) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-neutral-900">Access Denied</h1>
          <p className="text-neutral-600 mt-2">You don't have permission to access this event.</p>
          <button
            type="button"
            onClick={() => navigate('/organiser')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Return to dashboard
          </button>
        </div>
      </main>
    )
  }

  if (errorState === 404 || !formData.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-neutral-900">Event not found</h1>
          <p className="text-neutral-600 mt-2">The event you're looking for doesn't exist.</p>
          <button
            type="button"
            onClick={() => navigate('/organiser')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Return to dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/organiser" className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 block">
            ← Back to dashboard
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-neutral-900">{formData.title || 'Untitled event'}</h1>
                <StatusBadge status={formData.status} />
              </div>
              <p className="text-lg text-neutral-600">
                Update event details, manage submissions, configure judging, and oversee the complete event lifecycle.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <p className="text-sm font-semibold text-blue-650 mb-3">Profile Completion</p>
              <p className="text-4xl font-bold text-blue-900 mb-3">{completion}%</p>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="text-xs text-blue-750 mt-3">
                {completion === 100 ? '✓ Event is live and complete' : `${100 - completion}% more to complete`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {notice && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {notice}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="font-semibold text-white">Event Configuration</h2>
            <p className="text-sm text-blue-100 mt-1">Manage all aspects of your event</p>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 px-6 py-4 bg-neutral-50">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  setNotice('')
                  setActiveTab(index)
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === index
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            <ActiveTab formData={formData} updateField={updateField} />
          </div>

          <div className="border-t border-neutral-200 bg-neutral-50 px-8 py-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleArchive}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <span>📦</span>
                Archive
              </button>
              {(formData.status || '').toLowerCase() === 'approved' && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-sm">
                  <span>🟢</span>
                  Live publicly
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              <span>💾</span>
              Save changes
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default EditEventPage
