import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Search,
  CreditCard,
  QrCode,
  Globe2,
  Zap,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

const STEPS = [
  { icon: Search, title: 'Find a session', text: 'Browse local yoga, boxing, dance and more.' },
  { icon: CreditCard, title: 'Book & pay in NIM', text: 'One tap. Money goes straight to the coach.' },
  { icon: QrCode, title: 'Show your QR', text: 'Get checked in and enjoy your class.' },
]

const PERKS = [
  { icon: Globe2, title: 'No borders', text: 'Pay a coach anywhere in the world.' },
  { icon: Zap, title: 'Instant', text: 'Settlement in seconds, not days.' },
  { icon: ShieldCheck, title: 'Non-custodial', text: 'Sesión never holds your money.' },
  { icon: Wallet, title: 'No card, no KYC', text: 'Just your Nimiq wallet.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-bg">
      {/* Top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <span className="font-display text-2xl font-extrabold tracking-tight">Sesión</span>
        <button
          onClick={() => navigate('/app')}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg transition-transform active:scale-95"
        >
          Open app
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-6 pb-10">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-ink" /> Fitness &amp; wellness, paid in NIM
        </p>
        <h1 className="font-display text-[clamp(3rem,13vw,7rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
          Book it.
          <br />
          Move.
          <br />
          <span className="text-ink-soft">Pay in </span>
          <span className="bg-lime px-2">NIM.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink-soft">
          The marketplace for independent coaches. Book a class and pay directly in NIM —
          instant, no card, no borders.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

        {/* Hero image */}
        <div className="mt-10 overflow-hidden rounded-card shadow-card">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=70"
            alt="A coach leading a movement class"
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
      </section>

      {/* Perks strip */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon size={24} className="text-ink" strokeWidth={1.75} />
              <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
              <p className="text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="rounded-card bg-surface p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-lime text-ink">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="tnum font-display text-4xl font-extrabold text-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-1 text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For coaches */}
      <section className="mx-auto max-w-5xl px-5 pb-14">
        <div className="rounded-card bg-ink px-6 py-10 text-bg sm:px-10 sm:py-14">
          <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Coaches, get paid <span className="text-lime">anywhere.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-bg/70">
            No terminal, no bank, no platform cut. Create a session, share your link, and NIM
            lands straight in your wallet — from students across the world.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="mt-7 flex items-center gap-2 rounded-full bg-lime px-7 py-4 text-base font-semibold text-ink transition-transform active:scale-95"
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
