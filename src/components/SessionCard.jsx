import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { CATEGORIES } from '../data/sessions'
import { formatDate, formatTime, spotsInfo } from '../lib/format'

export default function SessionCard({ session }) {
  const navigate = useNavigate()
  const category = CATEGORIES.find((c) => c.id === session.category)
  const { left, scarce } = spotsInfo(session)

  return (
    <button
      onClick={() => navigate(`/session/${session.id}`)}
      className="group block w-full overflow-hidden rounded-card bg-surface text-left shadow-card transition-transform duration-150 active:scale-[.98]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={session.image}
          alt={session.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-ink">
            {category.label}
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 text-bg">
          <h3 className="font-display text-2xl font-bold leading-none">{session.title}</h3>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="tnum text-lg font-bold text-ink">
            {session.priceNim} <span className="text-sm font-semibold text-ink-soft">NIM</span>
          </span>
          <span className="tnum text-sm font-medium text-ink-soft">
            {formatDate(session.startsAt)} · {formatTime(session.startsAt)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={session.coach.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-sm font-medium text-ink-soft">{session.coach.name}</span>
            <span className="flex items-center gap-0.5 text-sm font-semibold text-ink">
              <Star size={13} className="fill-lime text-lime" /> {session.coach.rating}
            </span>
          </div>
          {scarce && (
            <span className="rounded-full bg-coral/10 px-2 py-0.5 text-xs font-semibold text-coral">
              {left} left
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
