import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Calendar, Search } from 'lucide-react'

import { blogPosts } from '../../data/content'

function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.map((post) => post.category)))],
    []
  )

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const searchable = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase()
    const matchesQuery = searchable.includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  })

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)

  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <BookOpen className="h-4 w-4" />
              EngiNow Blogs
            </div>
            <h1 className="mt-6 font-outfit text-4xl font-extrabold tracking-tight sm:text-5xl">
              Guides for better events, stronger teams, and cleaner submissions.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Read practical notes for participants, organisers, and campus teams planning their next technical event.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="relative block w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blogs"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        {featuredPost ? (
          <div className="py-10">
            <Link
              to={`/blogs/${featuredPost.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/30 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <img
                src={featuredPost.hero}
                alt=""
                className="h-72 w-full object-cover lg:h-full"
              />
              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    <span>{featuredPost.category}</span>
                    <span className="text-slate-300">/</span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {featuredPost.date}
                    </span>
                  </div>
                  <h2 className="mt-5 font-outfit text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">{featuredPost.excerpt}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 text-sm font-semibold text-slate-500">
                  <span>{featuredPost.readTime}</span>
                  <span className="inline-flex items-center gap-2 text-blue-600 transition group-hover:gap-3">
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {remainingPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blogs/${post.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">{post.category}</p>
                  <h3 className="mt-4 font-outfit text-2xl font-bold text-slate-950">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-500">
                    <span>{post.readTime}</span>
                    <span className="inline-flex items-center gap-2 text-blue-600 transition group-hover:gap-3">
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="font-outfit text-2xl font-bold text-slate-900">No blogs found</p>
            <p className="mt-2 text-slate-500">Try a different search term or category.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default BlogsPage
