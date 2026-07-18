import React from 'react'
import { Search, CheckCircle2, ShieldOff, Trash2, Edit2, Eye, RotateCcw } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

function formatDate(value) {
  if (!value) return 'Not set'
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Not set';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return 'Not set';
  }
}

function BlogTable({ blogs, onEdit, onDelete, onApprove, onReject, onView, onSuspend, onActivate }) {
  const safeBlogs = blogs || []
  if (!safeBlogs.length) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-16 text-center">
        <Search className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-4 font-outfit text-2xl font-bold text-slate-950">No blogs found</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-600">
          Blogs will appear here once they are created.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="font-outfit text-2xl font-bold text-slate-950">Blog Directory</h2>
        <p className="mt-1 text-sm text-slate-500">Manage blog posts, approve pending content, and monitor publication status.</p>
      </div>

      <div className="divide-y divide-slate-100">
        {safeBlogs.map((blog) => {
          const isPending = String(blog.status).toLowerCase() === 'pending'
          const isApproved = String(blog.status).toLowerCase() === 'approved'
          const isSuspended = String(blog.status).toLowerCase() === 'suspended'

          return (
            <div key={blog.id || blog.slug} className="p-5 transition hover:bg-slate-50/80">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-lg font-bold text-white shadow-sm">
                      {(blog.title || 'B').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950">{blog.title || 'Untitled'}</h3>
                      <p className="truncate text-sm text-slate-600">{blog.slug || 'No slug'}</p>
                      <p className="mt-1 text-xs text-slate-500">Created {formatDate(blog.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:col-span-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
                    <p className="mt-1 font-semibold text-slate-800">{blog.category || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Author</p>
                    <p className="mt-1 font-semibold text-slate-800">{blog.author || 'Unknown'}</p>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <StatusBadge status={blog.status || 'draft'} />
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:col-span-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => onView?.(blog)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove?.(blog)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject?.(blog)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        <ShieldOff className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {!isPending && isApproved && (
                    <>
                      <button
                        type="button"
                        onClick={() => onEdit?.(blog)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onSuspend?.(blog)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        <ShieldOff className="h-4 w-4" />
                        Suspend
                      </button>
                    </>
                  )}
                  {isSuspended && (
                    <button
                      type="button"
                      onClick={() => onActivate?.(blog)}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Activate
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete?.(blog)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default BlogTable
