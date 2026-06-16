import React, { useState } from 'react'
import uploadService from '../../../services/uploadService'

function Field({ label, hint, children }) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}
      {children}
    </label>
  )
}

function Step5Media({ formData = {}, updateField = () => {} }) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await uploadService.uploadImage(file)
      if (response?.success && response?.data?.url) {
        updateField('coverImage', response.data.url)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload image.')
    } finally {
      setUploading(false)
    }
  }

  const sponsors = String(formData.sponsorLogos || '')
    .split(',')
    .map((sponsor) => sponsor.trim())
    .filter(Boolean)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="grid gap-4">
        <div className="grid gap-2 border-b border-slate-100 pb-4">
          <Field label="Upload Cover Image" hint="Upload directly from your device">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 w-full text-sm text-slate-550 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </Field>
          {uploading && <p className="text-xs text-blue-600">Uploading cover image...</p>}
        </div>
        
        <Field label="Or Cover image URL" hint="Use a URL if image is already hosted online">
          <input
            value={formData.coverImage || ''}
            onChange={(event) => updateField('coverImage', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://images.unsplash.com/..."
          />
        </Field>
        <Field label="Event website">
          <input
            value={formData.websiteUrl || ''}
            onChange={(event) => updateField('websiteUrl', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://events.enginow.com/ai-builders"
          />
        </Field>
        <Field label="Community or updates link">
          <input
            value={formData.communityUrl || ''}
            onChange={(event) => updateField('communityUrl', event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Discord, Slack, WhatsApp, or update page"
          />
        </Field>
        <Field label="Sponsor names" hint="Comma separated">
          <textarea
            value={formData.sponsorLogos || ''}
            onChange={(event) => updateField('sponsorLogos', event.target.value)}
            rows="4"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Enginow, CloudScale, BuildLabs"
          />
        </Field>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Public preview assets</h2>
        <div className="mt-4 aspect-video overflow-hidden rounded-md bg-slate-100">
          {formData.coverImage ? (
            <img src={formData.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm font-medium text-slate-500">
              Cover image preview
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {sponsors.length ? (
            sponsors.map((sponsor) => (
              <span key={sponsor} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {sponsor}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">Sponsors will appear here as compact badges.</p>
          )}
        </div>
      </aside>
    </div>
  )
}
export default Step5Media