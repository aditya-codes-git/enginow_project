import React from 'react'
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, Scale, Users, Award, Code, Lightbulb, FileText, Trophy, Calendar } from 'lucide-react'

const resources = [
  {
    title: 'Submission checklist',
    description: 'Prepare demo links, repository access, setup notes, screenshots, and a concise project summary before the deadline.',
    tag: 'Participants',
    icon: ClipboardList,
  },
  {
    title: 'Judging rubric',
    description: 'Understand how impact, execution, originality, usability, and presentation quality are evaluated across events.',
    tag: 'Teams',
    icon: Scale,
  },
  {
    title: 'Organiser playbook',
    description: 'Plan event timelines, review queues, sponsor assets, mentor sessions, and communication flows from one place.',
    tag: 'Organisers',
    icon: Users,
  },
  {
    title: 'Hackathon starter kit',
    description: 'Boilerplate code, API integration guides, and quick setup templates for popular tech stacks used in competitions.',
    tag: 'Participants',
    icon: Code,
  },
  {
    title: 'Idea validation framework',
    description: 'Assess problem relevance, solution feasibility, and market need before committing to build during time-constrained events.',
    tag: 'Teams',
    icon: Lightbulb,
  },
  {
    title: 'Event approval guidelines',
    description: 'Learn what admins review—event quality, complete details, realistic schedules, and clear prize structures.',
    tag: 'Organisers',
    icon: FileText,
  },
  {
    title: 'Winning project showcase',
    description: 'Browse past winning projects, presentation decks, and key strategies that impressed judges across different event types.',
    tag: 'Participants',
    icon: Trophy,
  },
  {
    title: 'Event promotion toolkit',
    description: 'Social media templates, email campaigns, poster designs, and outreach strategies to maximize event registrations.',
    tag: 'Organisers',
    icon: Award,
  },
  {
    title: 'Schedule optimization',
    description: 'Balance workshop sessions, coding time, breaks, and presentation slots to keep participants engaged throughout.',
    tag: 'Organisers',
    icon: Calendar,
  },
]

const quickLinks = ['Registration basics', 'Team formation', 'Demo day prep', 'Mentor office hours', 'Pitch deck templates', 'Technical support']

function ResourcesPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-mesh pt-10 pb-12">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                <BookOpen className="h-4 w-4" />
                Resource library
              </div>
              <h1 className="heading-clear mt-6 font-outfit text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[56px]">
                Practical guides for better participation, judging, and organising.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Use concise checklists and playbooks to remove friction before registration, submission, review, or event launch.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-500">Popular starting points</p>
              <div className="mt-5 grid gap-3">
                {quickLinks.map((link) => (
                  <div key={link} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      {link}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <article key={resource.title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{resource.tag}</p>
              <h2 className="mt-3 font-outfit text-2xl font-bold text-slate-950">{resource.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{resource.description}</p>
              <button type="button" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition group-hover:gap-3">
                Read guide
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default ResourcesPage
