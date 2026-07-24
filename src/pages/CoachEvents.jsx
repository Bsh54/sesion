import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Users, ChevronRight, Plus, Loader2, CalendarDays } from 'lucide-react'
import { getCoachSessions } from '../lib/store'
import { formatDate, formatTime } from '../lib/format'

export default function CoachEvents() {
  const navigate = useNavigate()
  const { wallet } = useOutletContext()
  const [sessions, setSessions] = useState(null)

  useEffect(() => {
    getCoachSessions(wallet).then(setSessions)
  }, [wallet])

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Your events</h1>

      {sessions === null ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-ink-soft" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="mt-6 rounded-card border border-border p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-muted">
            <CalendarDays size={26} className="text-ink-soft" strokeWidth={1.75} />
          </div>
          <p className="mt-3 text-sm text-ink-soft">
            No events yet. Create your first session and share it with your community.
          </p>
          <button
            onClick={() => navigate('/coach/create')}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-semibold text-ink transition-transform active:scale-95"
          >
            <Plus size={18} /> Create a session
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/coach/event/${s.id}`)}
              className="flex w-full items-center gap-4 rounded-card border border-border bg-surface p-3 text-left transition-transform active:scale-[.99]"
            >
              <img src={s.image} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold leading-tight">{s.title}</p>
                <p className="tnum mt-0.5 text-sm text-ink-soft">
                  {formatDate(s.startsAt)} · {formatTime(s.startsAt)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Users size={14} /> {s.booked}/{s.capacity} booked
                </p>
              </div>
              <ChevronRight size={20} className="shrink-0 text-ink-soft" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
