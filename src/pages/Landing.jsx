import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Globe2, Zap, Wallet, ArrowRight } from 'lucide-react'
import { getSessions } from '../lib/store'
import SessionCard from '../components/SessionCard'

// Landing structure (ui-ux-pro-max "Marketplace / Directory" pattern, trimmed):
// 1. Hero  2. Featured listings  3. Trust / Safety  4. CTA (Become a host/seller)

const TRUST = [
  { icon: ShieldCheck, title: 'Non-custodial', text: 'Sesión never holds your money.' },
  { icon: Globe2, title: 'No borders', text: 'Pay a coach anywhere in the world.' },
  { icon: Zap, title: 'Instant', text: 'Settlement in seconds, not days.' },
  { icon: Wallet, title: 'No card, no KYC', text: 'Just your Nimiq wallet.' },
]

// Repeated section title with a lime marker for visual coherence.
function SectionTitle({ children }) {
  return (
    <div>
      <span className="mb-3 block h-1.5 w-10 rounded-full bg-lime" />
      <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight">{children}</h2>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getSessions().then((s) => setFeatured(s.slice(0, 4)))
  }, [])

  return (
    <div className="min-h-dvh bg-bg">
      {/* HERO — full-bleed image behind the whole hero, nav overlay, centered text */}
      <section className="relative w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1600&q=75"
          alt="A coach leading an energetic fitness class"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" />

        <div className="relative">
          {/* Nav (over image) */}
          <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
            <span className="font-display text-2xl font-extrabold tracking-tight text-bg">
              Sesión
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/coach')}
                className="hidden text-sm font-semibold text-bg sm:block"
              >
                Become a coach
              </button>
              <button
                onClick={() => navigate('/app')}
                className="rounded-full bg-bg px-5 py-2.5 text-sm font-semibold text-ink transition-transform active:scale-95"
              >
                Open app
              </button>
            </div>
          </header>

          {/* Centered hero content */}
          <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 pb-16 text-center sm:min-h-[76vh]">
            <h1 className="font-display text-[clamp(2.5rem,9vw,5rem)] font-extrabold uppercase leading-[1] tracking-tight text-bg">
              Find your next <span className="text-lime">session.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-bg/85">
              Book local coaches for yoga, boxing, dance and more. Pay directly in NIM — instant,
              no card, no borders.
            </p>
            <button
              onClick={() => navigate('/app')}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-9 py-4 text-base font-semibold text-ink shadow-float transition-transform active:scale-95"
            >
              Explore sessions <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED LISTINGS */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between">
          <SectionTitle>Featured this week</SectionTitle>
          <button
            onClick={() => navigate('/app')}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink"
          >
            See all <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      {/* 3. TRUST / SAFETY */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <div className="mb-6">
            <SectionTitle>Safe by design</SectionTitle>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-card border border-border p-5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-lime text-ink">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
                <p className="text-sm text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA — client */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-card bg-ink px-6 py-12 sm:px-12">
          <h2 className="max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-bg">
            Ready to <span className="text-lime">move?</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-bg/70">
            Find a session near you and pay your coach directly in NIM — in seconds, from
            anywhere in the world.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/app')}
              className="flex items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 text-base font-semibold text-ink transition-transform active:scale-95"
            >
              Explore sessions <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/coach')}
              className="flex items-center justify-center gap-2 rounded-full border border-bg/40 px-7 py-4 text-base font-semibold text-bg transition-transform active:scale-95"
            >
              Become a coach
            </button>
          </div>
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
