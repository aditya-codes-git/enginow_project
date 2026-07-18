import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Search } from 'lucide-react';
import BlogTable from '../../components/admin/BlogTable';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { showSuccess, showError } from '../../utils/toast';

function BlogManagementPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await adminService.getBlogs();
      const mapped = (data || []).map((b) => ({
        id: b._id,
        _id: b._id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        category: b.category,
        author: b.author,
        date: b.date,
        readTime: b.readTime,
        hero: b.hero,
        sections: b.sections,
        status: b.status,
        rejectionReason: b.rejectionReason,
        createdAt: b.createdAt,
      }));
      setBlogs(mapped);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error('Failed to load blogs:', err);
      }
      setError(
        err?.response?.data?.message ||
          'Failed to load blogs directory. Please reload.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleApprove = async (blog) => {
    try {
      await adminService.approveBlog(blog.id);
      showSuccess(`Blog "${blog.title}" has been approved and is now live.`);
      fetchBlogs();
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to approve blog.');
    }
  };

  const handleReject = async (blog) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminService.rejectBlog(blog.id, reason);
      showSuccess(`Blog "${blog.title}" has been rejected.`);
      fetchBlogs();
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to reject blog.');
    }
  };

  const handleView = (blog) => {
    window.open(`/blogs/${blog.slug}`, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete blog "${blog.title}"?`
    );
    if (!confirmed) return;

    try {
      await adminService.deleteBlog(blog.id);
      showSuccess(`Blog "${blog.title}" has been deleted.`);
      fetchBlogs();
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to delete blog.');
    }
  };

  const handleSuspend = async (blog) => {
    const confirmed = window.confirm(
      `Suspend blog "${blog.title}"? It will be hidden from public pages.`
    );
    if (!confirmed) return;

    try {
      await adminService.suspendBlog(blog.id);
      showSuccess(`Blog "${blog.title}" has been suspended.`);
      fetchBlogs();
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to suspend blog.');
    }
  };

  const handleActivate = async (blog) => {
    try {
      await adminService.activateBlog(blog.id);
      showSuccess(`Blog "${blog.title}" has been activated.`);
      fetchBlogs();
    } catch (err) {
      showError(err?.response?.data?.message || 'Failed to activate blog.');
    }
  };

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return blogs;

    return blogs.filter((blog) => {
      return (
        blog.title?.toLowerCase().includes(query) ||
        blog.slug?.toLowerCase().includes(query) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        blog.status?.toLowerCase().includes(query)
      );
    });
  }, [blogs, searchTerm]);

  const approvedCount = blogs.filter(
    (b) => String(b.status).toLowerCase() === 'approved'
  ).length;

  const pendingCount = blogs.filter(
    (b) => String(b.status).toLowerCase() === 'pending'
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <BookOpen className="h-4 w-4" />
                Blog Moderation
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Blog Management
              </h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                Review, approve, reject, suspend, and manage all blog posts
                published on the platform.
              </p>
            </div>

            <Link
              to="/organiser/blogs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Blog
            </Link>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Total Blogs</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{blogs.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-sm font-medium text-amber-700">Pending Approval</p>
              <p className="mt-2 text-3xl font-bold text-amber-900">{pendingCount}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-700">Published</p>
              <p className="mt-2 text-3xl font-bold text-emerald-900">{approvedCount}</p>
            </div>
          </div>

          <div className="mt-8 relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search blogs by title, slug, category, excerpt, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <BlogTable
            blogs={filteredBlogs}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
            onDelete={handleDelete}
            onSuspend={handleSuspend}
            onActivate={handleActivate}
          />
        </section>
      </div>
    </main>
  );
}

export default BlogManagementPage;