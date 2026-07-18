import React, { useState, useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

import api from '../../services/api'
import { blogPosts as sampleBlogPosts } from '../../data/content'

function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/users/blogs/${slug}`)
      setPost(response.data.data)
    } catch (err) {
      const samplePost = sampleBlogPosts.find((blogPost) => blogPost.slug === slug)
      if (samplePost) {
        setPost(samplePost)
      } else if (err.response?.status === 404) {
        setError('not-found')
      } else {
        setError('Failed to load blog post.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (error === 'not-found' || !post) {
    return <Navigate to="/blogs" replace />
  }

  return (
    <main className="bg-white text-slate-900">
      <article>
        <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{post.category}</p>
            <h1 className="mt-4 font-outfit text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
              <span>{post.author}</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <img src={post.hero} alt="" className="h-80 w-full rounded-2xl object-cover shadow-sm sm:h-[440px]" />
        </div>

        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-outfit text-2xl font-bold text-slate-950">{section.heading}</h2>
                <p className="mt-3 text-base leading-8 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}

export default BlogDetailPage
