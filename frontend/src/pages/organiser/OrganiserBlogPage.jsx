import React, { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Send, BookOpen, FileText } from 'lucide-react'
import organiserBlogService from '../../services/organiserBlogService'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { showSuccess, showError } from '../../utils/toast'

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  author: '',
  date: new Date().toISOString().split('T')[0],
  hero: '',
  sections: [{ heading: '', body: '' }],
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function BlogForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)

  const setField = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const setSection = (i, key, val) =>
    setForm((prev) => {
      const sections = [...prev.sections]
      sections[i] = { ...sections[i], [key]: val }
      return { ...prev, sections }
    })

  const addSection = () =>
    setForm((prev) => ({ ...prev, sections: [...prev.sections, { heading: '', body: '' }] }))

  const removeSection = (i) =>
    setForm((prev) => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }))

  const handleTitleChange = (val) => {
    setForm((prev) => ({ ...prev, title: val, slug: prev.slug || slugify(val) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.excerpt.trim() || !form.category.trim() || !form.author.trim()) {
      showError('Title, excerpt, category, and author are required.')
      return
    }
    if ((form.sections || []).some((section) => !section.heading.trim() || !section.body.trim())) {
      showError('Each section needs a heading and body.')
      return
    }
    onSave(form)
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-1 focus:ring-blue-600'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-950 font-outfit">
        {initial?.id ? 'Edit Blog Post' : 'New Blog Post'}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
          <input className={inputCls} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Slug</label>
          <input className={inputCls} value={form.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="auto-generated" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
          <input className={inputCls} value={form.category} onChange={(e) => setField('category', e.target.value)} placeholder="e.g. Hackathon Tips" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Author</label>
          <input className={inputCls} value={form.author} onChange={(e) => setField('author', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Hero Image URL</label>
          <input className={inputCls} value={form.hero} onChange={(e) => setField('hero', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Publish Date</label>
          <input className={inputCls} type="date" value={form.date} onChange={(e) => setField('date', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Excerpt *</label>
          <textarea className={inputCls} rows={2} value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} required />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Sections</span>
          <button type="button" onClick={addSection} className="text-xs font-semibold text-blue-600 hover:text-blue-700">+ Add Section</button>
        </div>
        {form.sections.map((sec, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Section {i + 1}</span>
              {form.sections.length > 1 && (
                <button type="button" onClick={() => removeSection(i)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
              )}
            </div>
            <input
              className={inputCls}
              placeholder="Heading *"
              value={sec.heading}
              onChange={(e) => setSection(i, 'heading', e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={4}
              placeholder="Body content *"
              value={sec.body}
              onChange={(e) => setSection(i, 'body', e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition">
          <FileText className="h-4 w-4" /> Save Draft
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          Cancel
        </button>
      </div>
    </form>
  )
}

function formatDate(val) {
  if (!val) return '—'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(val))
}

export default function OrganiserBlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await organiserBlogService.getMyBlogs()
      setBlogs(data || [])
    } catch (err) {
      if (err.response?.status !== 401) showError('Failed to load blogs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (form) => {
    try {
      if (editing?.id) {
        await organiserBlogService.updateBlog(editing.id, form)
        showSuccess('Blog updated.')
      } else {
        await organiserBlogService.createBlog(form)
        showSuccess('Blog saved as draft.')
      }
      setShowForm(false)
      setEditing(null)
      load()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save blog.')
    }
  }

  const handleSubmit = async (blog) => {
    if (!window.confirm(`Submit "${blog.title}" for admin review?`)) return
    try {
      await organiserBlogService.submitBlog(blog._id || blog.id)
      showSuccess('Blog submitted for review.')
      load()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit blog.')
    }
  }

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return
    try {
      await organiserBlogService.deleteBlog(blog._id || blog.id)
      showSuccess('Blog deleted.')
      load()
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete blog.')
    }
  }

  const handleEdit = (blog) => {
    setEditing({
      id: blog._id || blog.id,
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      category: blog.category || '',
      author: blog.author || '',
      date: blog.date || new Date().toISOString().split('T')[0],
      hero: blog.hero || '',
      sections: blog.sections?.length ? blog.sections : [{ heading: '', body: '' }],
    })
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 font-outfit flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-blue-600" /> My Blog Posts
            </h1>
            <p className="text-slate-500 text-sm mt-1">Write posts and submit them for admin approval before they go live.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => { setEditing(null); setShowForm(true) }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-md"
            >
              <Plus className="h-4 w-4" /> New Post
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <BlogForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        )}

        {/* Blog List */}
        {blogs.length === 0 && !showForm ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-950">No blog posts yet</h2>
            <p className="mt-2 text-slate-500">Create your first post and submit it for admin review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => {
              const id = blog._id || blog.id
              const status = (blog.status || 'draft').toLowerCase()
              const isDraft = status === 'draft'
              const isPending = status === 'pending'
              const isRejected = status === 'rejected'

              return (
                <div key={id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-950 text-lg truncate">{blog.title || 'Untitled'}</h3>
                      <StatusBadge status={blog.status || 'draft'} />
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{blog.excerpt}</p>
                    {isRejected && blog.rejectionReason && (
                      <p className="mt-1 text-xs text-red-600 font-semibold">Rejected: {blog.rejectionReason}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">{blog.category} · {formatDate(blog.createdAt)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    {(isDraft || isRejected) && (
                      <>
                        <button
                          onClick={() => handleEdit(blog)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleSubmit(blog)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          <Send className="h-3.5 w-3.5" /> Submit for Review
                        </button>
                      </>
                    )}
                    {isPending && (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                        Awaiting admin approval
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(blog)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
