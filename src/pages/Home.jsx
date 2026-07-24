import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import CategoryChips from '../components/CategoryChips'
import SessionCard from '../components/SessionCard'
import { getSessions } from '../lib/store'

export default function Home() {
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)
  const [all] = useState(() => getSessions())

  const sessions = useMemo(
    () => (category ? all.filter((s) => s.category === category) : all),
    [category, all],
  )

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Sesión</h1>
        <span className="flex items-center gap-1 text-sm font-medium text-ink-soft">
          <MapPin size={16} strokeWidth={1.75} /> Rio de Janeiro
        </span>
      </header>

      {/* Search */}
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

      {/* Sessions */}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-2xl font-bold">This week</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </section>
    </div>
  )
}
