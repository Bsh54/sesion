import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Globe2, Zap, Wallet, ArrowRight, Star } from 'lucide-react'
import { SESSIONS } from '../data/sessions'
import SessionCard from '../components/SessionCard'

// Landing structure (ui-ux-pro-max "Marketplace / Directory" pattern, trimmed):
// 1. Hero  2. Featured listings  3. Trust / Safety  4. CTA (Become a host/seller)

const TRUST = [
  { icon: ShieldCheck, title: 'Non-custodial', text: 'Sesión never holds your money.' },
  { icon: Globe2, title: 'No borders', text: 'Pay a coach anywhere in the world.' },
  { icon: Zap, title: 'Instant', text: 'Settlement in seconds, not days.' },
  { icon: Wallet, title: 'No card, no KYC', text: 'Just your Nimiq wallet.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-bg">
      {/* Navbar */}
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

      {/* 1. HERO */}
      <section className="mx-auto max-w-5xl px-5 pt-2 pb-8 text-center">
        <h1 className="font-display text-[clamp(2.25rem,8vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
          Find your next <span className="bg-lime px-2">session.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-ink-soft">
          Book local coaches for yoga, boxing, dance and more. Pay directly in NIM — instant,
          no card, no borders.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-base font-semibold text-bg shadow-float transition-transform active:scale-95"
          >
            Explore sessions <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/create')}
            className="flex items-center justify-center gap-2 rounded-full border border-ink px-7 py-4 text-base font-semibold text-ink transition-transform active:scale-95"
          >
            I&apos;m a coach
          </button>
        </div>
      </section>

      {/* 2. FEATURED LISTINGS */}
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

      {/* 3. TRUST / SAFETY */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-10">
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

      {/* 4. CTA — become a host/seller */}
      <section className="mx-auto max-w-5xl px-5 py-10">
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
