import React from 'react'
import { ArrowRight, Clock, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const contactCards = [
  { label: 'Email', value: 'events@enginow.com', detail: 'For support and partnerships', icon: Mail },
  { label: 'Response time', value: '2 business days', detail: 'Most requests are faster', icon: Clock },
  { label: 'Event quality', value: 'Curated review', detail: 'Every organiser gets guidance', icon: ShieldCheck },
]

function ContactPage() {
  const { theme } = useTheme()
  return (
    <main className="bg-theme-surface text-theme-text">
      <section className="relative overflow-hidden bg-mesh pt-10 pb-16">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-theme-surface/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <MessageSquare className="h-4 w-4" />
              Contact Enginow
            </div>
            <h1 className="heading-clear mt-6 font-outfit text-4xl font-extrabold tracking-tight text-theme-text sm:text-5xl lg:text-[56px]">
              Talk to the events team with the right context from day one.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-theme-text-secondary">
              Reach out for event partnerships, organiser onboarding, participant support, sponsorship, or judging coordination.
            </p>

            <div className="mt-8 grid gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.label} className="rounded-2xl border border-theme-border bg-theme-surface/90 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-theme-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-theme-text-secondary">{card.label}</p>
                        <p className="mt-1 font-outfit text-xl font-bold text-theme-text">{card.value}</p>
                        <p className="mt-1 text-sm text-theme-text-secondary">{card.detail}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <form className="rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-xl sm:p-8">
            <div className="mb-6">
              <h2 className="font-outfit text-2xl font-bold text-theme-text">Send a message</h2>
              <p className="mt-2 text-sm text-theme-text-secondary">A few details help us route your request to the right person.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-theme-text-secondary">
                Name
                <input className="rounded-xl border border-theme-border bg-theme-bg px-4 py-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-theme-text-secondary">
                Email
                <input type="email" className="rounded-xl border border-theme-border bg-theme-bg px-4 py-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100" placeholder="you@example.com" />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-theme-text-secondary">
              Topic
              <select className="rounded-xl border border-theme-border bg-theme-bg px-4 py-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100">
                <option>Participant support</option>
                <option>Organiser onboarding</option>
                <option>Sponsorship</option>
                <option>Judging</option>
              </select>
            </label>

            <label className="mt-4 grid gap-2 text-sm font-semibold text-theme-text-secondary">
              Message
              <textarea rows="6" className="resize-none rounded-xl border border-theme-border bg-theme-bg px-4 py-3 text-theme-text outline-none transition focus:border-blue-300 focus:bg-theme-surface focus:ring-4 focus:ring-blue-100" placeholder="How can we help?" />
            </label>

            <button
              type="button"
              style={{
                backgroundColor: theme.colors.primaryAccent || theme.colors.primary || '#2563eb',
                color: theme.colors.textOnPrimary || '#ffffff',
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto hover:opacity-95"
            >
              Send message
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ContactPage
