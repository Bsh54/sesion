import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, MapPin, Loader2 } from 'lucide-react'
import { getSession } from '../lib/store'
import { getAttendees } from '../lib/profile'
import { avatarUrl, shortAddress } from '../lib/avatar'
import { formatDate, formatTime } from '../lib/format'

export default function CoachEventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [attendees, setAttendees] = useState([])

  useEffect(() => {
    getSession(id).then((s) => setSession(s ?? null))
    getAttendees(id).then(setAttendees)
  }, [id])

  if (session === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 size={28} className="animate-spin text-ink-soft" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 text-center">
        <h2 className="font-display text-2xl font-bold">Event not found</h2>
        <button
          onClick={() => navigate('/coach/events')}
          className="mt-4 rounded-full bg-ink px-6 py-3 font-semibold text-bg"
        >
          Back to events
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate('/coach/events')}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-muted text-ink"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Manage event</h1>
      </header>

      {/* Event summary */}
      <div className="mt-5 overflow-hidden rounded-card border border-border">
        <img src={session.image} alt="" className="h-40 w-full object-cover" />
        <div className="p-4">
          <h2 className="font-display text-2xl font-bold">{session.title}</h2>
          <p className="tnum mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <Calendar size={14} /> {formatDate(session.startsAt)} · {formatTime(session.startsAt)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin size={14} /> {session.location}
          </p>
        </div>
      </div>

      {/* Booking stats */}
      <div className="mt-4 flex items-center justify-between rounded-card bg-ink px-5 py-4 text-bg">
        <span className="flex items-center gap-2 font-semibold">
          <Users size={18} className="text-lime" /> Bookings
        </span>
        <span className="tnum font-display text-xl font-bold">
          {session.booked}
          <span className="text-bg/60">/{session.capacity}</span>
        </span>
      </div>

      {/* Attendees */}
      <div className="mt-6">
        <h3 className="mb-3 font-display text-xl font-bold">Who&apos;s coming</h3>
        {attendees.length === 0 ? (
          <p className="text-sm text-ink-soft">No bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {attendees.map((a) => (
              <div
                key={a.wallet}
                className="flex items-center gap-3 rounded-card border border-border bg-surface p-3"
              >
                <img
                  src={avatarUrl(a.wallet)}
                  alt=""
                  className="h-10 w-10 rounded-full bg-lime object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{a.name || 'Guest'}</p>
                  <p className="tnum truncate text-xs text-ink-soft">{shortAddress(a.wallet)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
