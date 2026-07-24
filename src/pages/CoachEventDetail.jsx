import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, MapPin, Loader2, ScanLine, Check, X } from 'lucide-react'
import { getSession } from '../lib/store'
import { getAttendees, checkinTicket } from '../lib/profile'
import { displayAvatar, shortAddress } from '../lib/avatar'
import { formatDate, formatTime } from '../lib/format'
import QrScanner from '../components/QrScanner'

export default function CoachEventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [attendees, setAttendees] = useState([])
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const loadAttendees = () => getAttendees(id).then(setAttendees)

  useEffect(() => {
    getSession(id).then((s) => setSession(s ?? null))
    loadAttendees()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onScan = async (text) => {
    setScanning(false)
    const parts = String(text).split(':')
    if (parts[0] !== 'SESION') {
      setResult({ valid: false, reason: 'This is not a Sesión ticket.' })
      return
    }
    if (parts[1] !== id) {
      setResult({ valid: false, reason: 'This ticket is for another session.' })
      return
    }
    const r = await checkinTicket(id, parts[2] || '')
    setResult(r.valid ? r : { valid: false, reason: 'No booking matches this ticket.' })
    loadAttendees()
  }

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

      {/* Bookings + scan */}
      <div className="mt-4 flex items-center justify-between rounded-card bg-ink px-5 py-4 text-bg">
        <span className="flex items-center gap-2 font-semibold">
          <Users size={18} className="text-lime" /> {session.booked}/{session.capacity} booked
        </span>
        <button
          onClick={() => {
            setResult(null)
            setScanning(true)
          }}
          className="flex items-center gap-2 rounded-full bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition-transform active:scale-95"
        >
          <ScanLine size={18} /> Scan ticket
        </button>
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
                  src={displayAvatar(a.avatar, a.wallet)}
                  alt=""
                  className="h-10 w-10 rounded-full bg-lime object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{a.name || 'Guest'}</p>
                  <p className="tnum truncate text-xs text-ink-soft">{shortAddress(a.wallet)}</p>
                </div>
                {a.checked_in ? (
                  <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                    <Check size={13} /> Checked in
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-ink-soft">
                    Booked
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scanner */}
      {scanning && <QrScanner onResult={onScan} onClose={() => setScanning(false)} />}

      {/* Scan result */}
      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5"
          onClick={() => setResult(null)}
        >
          <div
            className="w-full max-w-sm rounded-card bg-surface p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {result.valid ? (
              <>
                <div
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
                    result.already ? 'bg-coral/15 text-coral' : 'bg-success/15 text-success'
                  }`}
                >
                  <Check size={32} />
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold">
                  {result.already ? 'Already checked in' : 'Checked in!'}
                </h2>
                <p className="text-sm text-ink-soft">{result.name || 'Guest'}</p>
              </>
            ) : (
              <>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/15 text-destructive">
                  <X size={32} />
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold">Invalid ticket</h2>
                <p className="text-sm text-ink-soft">{result.reason}</p>
              </>
            )}
            <button
              onClick={() => setResult(null)}
              className="mt-5 w-full rounded-full bg-ink py-3 font-semibold text-bg"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
