import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import CategoryChips from '../components/CategoryChips'
import SessionCard from '../components/SessionCard'
import { SESSIONS } from '../data/sessions'

export default function Home() {
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)

  const sessions = useMemo(
    () => (category ? SESSIONS.filter((s) => s.category === category) : SESSIONS),
    [category],
  )

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Sesión</h1>
        <span className="flex items-center gap-1 text-sm font-medium text-ink-soft">
          <MapPin size={16} strokeWidth={1.75} /> Rio de Janeiro
        </span>
      </header>

      {/* Search = the primary CTA */}
      <button
        onClick={() => navigate('/search')}
        className="mt-4 flex w-full items-center gap-3 rounded-full bg-surface px-5 py-4 text-left shadow-card active:scale-[.99]"
      >
        <Search size={20} className="text-ink-soft" />
        <span className="text-base text-ink-soft">Yoga, boxing, near you…</span>
      </button>

      {/* Categories */}
      <div className="mt-5">
        <CategoryChips active={category} onSelect={setCategory} />
      </div>

      {/* Featured sessions */}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-2xl font-bold">This week</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>

      {/* Trust banner */}
      <div className="mt-6 flex items-center gap-3 rounded-card bg-ink px-5 py-4 text-bg">
        <ShieldCheck size={22} className="shrink-0 text-lime" />
        <p className="text-sm font-medium">
          Pay coaches directly in NIM. No card, no borders, no platform fee.
        </p>
      </div>

      {/* Coach CTA */}
      <button
        onClick={() => navigate('/create')}
        className="mt-4 flex w-full items-center justify-between rounded-card border border-border bg-surface px-5 py-4 text-left active:scale-[.99]"
      >
        <span>
          <span className="block font-display text-xl font-bold">Are you a coach?</span>
          <span className="text-sm text-ink-soft">Create a session and get paid instantly.</span>
        </span>
        <ArrowRight size={22} className="text-ink" />
      </button>
    </div>
  )
}
