import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { Search, ShieldCheck, Globe2, Zap, Wallet, ArrowRight, Star } from 'lucide-react'
import { CATEGORIES, SESSIONS } from '../data/sessions'
import SessionCard from '../components/SessionCard'

// Landing structure follows the ui-ux-pro-max "Marketplace / Directory" pattern:
// 1. Hero (search-focused)  2. Categories  3. Featured listings
// 4. Trust / Safety  5. CTA (Become a host/seller)
// Primary CTA = the search bar; navbar exposes "Become a coach" (list your item).

const POPULAR = ['Yoga', 'Boxing', 'Pilates near me', 'Sunrise flow']

const TRUST = [
  { icon: ShieldCheck, title: 'Non-custodial', text: 'Sesión never holds your money.' },
  { icon: Globe2, title: 'No borders', text: 'Pay a coach anywhere in the world.' },
  { icon: Zap, title: 'Instant', text: 'Settlement in seconds, not days.' },
  { icon: Wallet, title: 'No card, no KYC', text: 'Just your Nimiq wallet.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const goSearch = (e) => {
    e.preventDefault()
    navigate('/app')
  }

  return (
    <div className="min-h-dvh bg-bg">
      {/* Navbar — logo + "list your item" */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <span className="font-display text-2xl font-extrabold tracking-tight">Sesión</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/create')}
            className="hidden text-sm font-semibold text-ink sm:block"
          >
            Become a coach
          </button>
          <button
            onClick={() => navigate('/app')}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg transition-transform active:scale-95"
          >
            Open app
          </button>
        </div>
      </header>

      {/* 1. HERO — search is the CTA */}
      <section className="mx-auto max-w-5xl px-5 pt-8 pb-10 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-ink" /> Fitness &amp; wellness, paid in NIM
        </p>
        <h1 className="font-display text-[clamp(2.75rem,11vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
          Find your next
          <br />
          <span className="bg-lime px-2">session.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-soft">
          Book local coaches for yoga, boxing, dance and more. Pay directly in NIM — instant,
          no card, no borders.
        </p>

        {/* Search bar = primary CTA */}
        <form
          onSubmit={goSearch}
          className="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-full bg-surface p-2 pl-5 shadow-float"
        >
          <Search size={20} className="shrink-0 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yoga, boxing, near you…"
            aria-label="Search sessions"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink outline-none placeholder:text-ink-soft"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bg transition-transform active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Popular searches suggestions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-ink-soft">Popular:</span>
          {POPULAR.map((term) => (
            <button
              key={term}
              onClick={() => navigate('/app')}
              className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES — visual icons */}
      <section className="mx-auto max-w-5xl px-5 py-8">
        <h2 className="mb-5 font-display text-3xl font-extrabold uppercase tracking-tight">
          Browse by category
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {CATEGORIES.map((cat) => {
            const Icon = Icons[cat.icon] ?? Icons.Circle
            return (
              <button
                key={cat.id}
                onClick={() => navigate('/app')}
                className="flex flex-col items-center gap-2 rounded-card bg-surface p-4 shadow-card transition-transform active:scale-95"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-lime text-ink">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-ink">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. FEATURED LISTINGS */}
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight">
            Featured this week
          </h2>
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-1 text-sm font-semibold text-ink"
          >
            See all <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SESSIONS.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      {/* 4. TRUST / SAFETY */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <h2 className="mb-8 text-center font-display text-3xl font-extrabold uppercase tracking-tight">
            Safe by design
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                <p className="text-sm text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-ink-soft">
            <Star size={15} className="fill-lime text-lime" /> Trusted by independent coaches
            worldwide
          </p>
        </div>
      </section>

      {/* 5. CTA — become a host/seller */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="rounded-card bg-ink px-6 py-12 text-center text-bg sm:px-10">
          <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Coaches, get paid <span className="text-lime">anywhere.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-bg/70">
            No terminal, no bank, no platform cut. Create a session, share your link, and NIM
            lands straight in your wallet.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="mx-auto mt-7 flex items-center gap-2 rounded-full bg-lime px-7 py-4 text-base font-semibold text-ink transition-transform active:scale-95"
          >
            Create your first session <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink-soft sm:flex-row">
          <span className="font-display text-xl font-extrabold text-ink">Sesión</span>
          <span>Built on Nimiq Pay · {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
