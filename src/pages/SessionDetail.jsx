import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Gauge,
  Users,
  BadgeCheck,
  Check,
  Loader2,
} from 'lucide-react'
import {
  CATEGORIES,
  GOOD_TO_KNOW,
  AMENITIES,
  SAMPLE_REVIEWS,
  FOCUS,
  INTENSITY,
  AGENDA,
} from '../data/sessions'
import { getSession } from '../lib/store'
import { addTicket } from '../lib/tickets'
import { getAttendees } from '../lib/profile'
import { avatarUrl, shortAddress } from '../lib/avatar'
import { formatDate, formatTime, spotsInfo } from '../lib/format'
import { paySession, getAddress } from '../lib/nimiq'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 rounded-card border border-border bg-surface p-3 text-center">
      <Icon size={18} className="mx-auto text-ink-soft" strokeWidth={1.75} />
      <p className="mt-1 font-display text-lg font-bold leading-none">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  )
}

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? 'fill-lime text-lime' : 'text-border'}
        />
      ))}
    </span>
  )
}

function SectionTitle({ children }) {
  return <h2 className="font-display text-xl font-bold">{children}</h2>
}

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined) // undefined = loading, null = not found
  const [status, setStatus] = useState('idle') // idle | paying | booked
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [attendees, setAttendees] = useState([])

  useEffect(() => {
    getSession(id).then((s) => setSession(s ?? null))
  }, [id])

  useEffect(() => {
    if (session) getAttendees(session.id).then(setAttendees)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

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
        <h2 className="font-display text-2xl font-bold">Session not found</h2>
        <button
          onClick={() => navigate('/app')}
          className="mt-4 rounded-full bg-ink px-6 py-3 font-semibold text-bg"
        >
          Back to marketplace
        </button>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === session.category)
  const { left, scarce } = spotsInfo(session)
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(session.location)}&z=14&output=embed`
  const bio = `${session.coach.name} is a verified ${category?.label.toLowerCase() ?? 'fitness'} coach with ${session.coach.sessions} sessions hosted and a ${session.coach.rating}-star rating from the community.`

  const handleBook = async () => {
    setError('')
    setStatus('paying')
    try {
      const res = await paySession({
        recipient: session.coach.wallet,
        nim: session.priceNim,
        ref: `SESION:${session.id}`,
      })
      if (navigator.vibrate) navigator.vibrate(10)
      const wallet = await getAddress()
      if (wallet) {
        try {
          await addTicket({ wallet, sessionId: session.id, code: res.receipt })
        } catch {
          /* payment succeeded; ticket save is best-effort */
        }
      }
      setTicket({ code: res.receipt })
      setStatus('booked')
    } catch (e) {
      setError(e?.message || 'Payment failed. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-card">
        <img
          src={session.image}
          alt={session.title}
          className="h-72 w-full object-cover sm:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-bg/90 text-ink transition-transform active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>
        {category && (
          <span className="absolute bottom-4 left-4 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">
            {category.label}
          </span>
        )}
      </div>

      {/* Two-column layout: details + sticky booking card */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-10">
        {/* Booking card (right on desktop, top on mobile) */}
        <aside className="lg:order-2">
          <div className="rounded-card border border-border bg-surface p-5 shadow-card lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Price</p>
            <p className="tnum mt-1 font-display text-4xl font-extrabold leading-none">
              {session.priceNim} <span className="text-xl text-ink-soft">NIM</span>
            </p>
            <p className="text-sm text-ink-soft">per spot</p>

            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-ink-soft" />
                <span className="tnum">
                  {formatDate(session.startsAt)} · {formatTime(session.startsAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ink-soft" />
                <span className={scarce ? 'font-semibold text-coral' : ''}>
                  {left > 0 ? `${left} spots left` : 'Sold out'}
                </span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={status !== 'idle' || left <= 0}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-base font-semibold text-bg transition-transform active:scale-95 disabled:opacity-50"
            >
              {status === 'paying' ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processing…
                </>
              ) : left <= 0 ? (
                'Sold out'
              ) : (
                `Book · ${session.priceNim} NIM`
              )}
            </button>
            {error && (
              <p className="mt-3 text-center text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
            <p className="mt-3 text-center text-xs text-ink-soft">
              Free cancellation up to 2 hours before
            </p>

            {/* Location map */}
            <div className="mt-5 overflow-hidden rounded-card border border-border">
              <iframe
                title={`Map of ${session.location}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-40 w-full border-0"
              />
              <div className="flex items-center gap-2 px-4 py-3">
                <MapPin size={16} className="shrink-0 text-ink-soft" />
                <span className="text-sm font-medium">{session.location}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main details */}
        <main className="space-y-8 lg:order-1 lg:col-span-2">
          {/* Header */}
          <div>
            <h1 className="font-display text-4xl font-extrabold uppercase leading-tight tracking-tight">
              {session.title}
            </h1>
            <div className="mt-1 flex items-center gap-1 text-sm font-medium text-ink-soft">
              <Star size={15} className="fill-lime text-lime" /> {session.coach.rating} · with{' '}
              {session.coach.name}
            </div>
            <div className="mt-4 flex gap-3">
              <Stat icon={Clock} label="Duration" value={`${session.durationMin}m`} />
              <Stat icon={Gauge} label="Level" value={session.level} />
              <Stat icon={Users} label="Spots left" value={left} />
            </div>
          </div>

          {/* When & where */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-card border border-border p-4">
              <Calendar size={18} className="shrink-0 text-ink-soft" />
              <span className="tnum text-sm font-medium">
                {formatDate(session.startsAt)} · {formatTime(session.startsAt)}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-card border border-border p-4">
              <MapPin size={18} className="shrink-0 text-ink-soft" />
              <span className="text-sm font-medium">{session.location}</span>
            </div>
          </div>

          {/* Coach */}
          <div>
            <SectionTitle>Your coach</SectionTitle>
            <div className="mt-3 rounded-card border border-border p-4">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl(session.coach.wallet)}
                  alt=""
                  className="h-12 w-12 rounded-full bg-lime object-cover"
                />
                <div className="flex-1">
                  <p className="flex items-center gap-1 font-semibold">
                    {session.coach.name}
                    <BadgeCheck size={16} className="text-lime" />
                  </p>
                  <p className="text-sm text-ink-soft">{session.coach.sessions} sessions hosted</p>
                </div>
                <span className="flex items-center gap-1 font-semibold">
                  <Star size={15} className="fill-lime text-lime" /> {session.coach.rating}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{bio}</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <SectionTitle>Details</SectionTitle>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Class size', value: `${session.capacity} people` },
                { label: 'Language', value: 'English' },
                { label: 'Intensity', value: INTENSITY[session.level] ?? 'Moderate' },
                { label: 'Category', value: category?.label ?? '—' },
              ].map((f) => (
                <div key={f.label} className="rounded-card border border-border p-3">
                  <p className="text-xs text-ink-soft">{f.label}</p>
                  <p className="mt-0.5 font-display text-lg font-bold leading-tight">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(FOCUS[session.category] ?? []).map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-lime/25 px-3 py-1 text-sm font-semibold text-ink"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* What to expect */}
          <div>
            <SectionTitle>What to expect</SectionTitle>
            <ol className="mt-3 space-y-3">
              {AGENDA.map((a, i) => (
                <li key={a.phase} className="flex gap-3">
                  <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime text-sm font-bold text-ink">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold leading-tight">{a.phase}</p>
                    <p className="text-sm text-ink-soft">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* What's included */}
          <div>
            <SectionTitle>What&apos;s included</SectionTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-ink"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Who's coming — real attendees */}
          <div>
            <div className="flex items-center justify-between">
              <SectionTitle>Who&apos;s coming</SectionTitle>
              <span className="text-sm font-semibold text-ink-soft">{attendees.length} going</span>
            </div>
            {attendees.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">Be the first to book this session.</p>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="flex -space-x-2">
                  {attendees.slice(0, 10).map((a) => (
                    <img
                      key={a.wallet}
                      src={avatarUrl(a.wallet)}
                      alt={a.name || shortAddress(a.wallet)}
                      title={a.name || shortAddress(a.wallet)}
                      className="h-9 w-9 rounded-full border-2 border-bg bg-lime object-cover"
                    />
                  ))}
                  {attendees.length > 10 && (
                    <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-bg bg-muted text-xs font-semibold text-ink-soft">
                      +{attendees.length - 10}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-soft">
                  {attendees
                    .slice(0, 3)
                    .map((a) => a.name || 'Guest')
                    .join(' · ')}
                  {attendees.length > 3 ? ` and ${attendees.length - 3} more` : ''}
                </p>
              </div>
            )}
          </div>

          {/* About */}
          <div>
            <SectionTitle>About this session</SectionTitle>
            <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">{session.description}</p>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between">
              <SectionTitle>Reviews</SectionTitle>
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Star size={15} className="fill-lime text-lime" /> {session.coach.rating}
                <span className="font-medium text-ink-soft">
                  · {session.coach.sessions} sessions
                </span>
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SAMPLE_REVIEWS.map((r) => (
                <div key={r.name} className="rounded-card border border-border p-4">
                  <div className="flex items-center gap-3">
                    <img src={r.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{r.name}</p>
                      <Stars rating={r.rating} />
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Good to know */}
          <div>
            <SectionTitle>Good to know</SectionTitle>
            <ul className="mt-2 space-y-2">
              {GOOD_TO_KNOW.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>

      {/* Ticket overlay */}
      {status === 'booked' && ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5">
          <div className="w-full max-w-sm rounded-ticket bg-surface p-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
              <Check size={28} />
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold">You&apos;re booked!</h2>
            <p className="text-sm text-ink-soft">
              {session.title} · {formatDate(session.startsAt)} {formatTime(session.startsAt)}
            </p>

            <div className="my-5 border-t border-dashed border-border" />

            <div className="flex justify-center">
              <QRCodeSVG
                value={`SESION:${session.id}:${ticket.code.slice(0, 24)}`}
                size={180}
                fgColor="#14161B"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="tnum mt-3 text-xs text-ink-soft">
              Ticket {ticket.code.slice(0, 10).toUpperCase()}
            </p>
            <p className="text-xs text-ink-soft">Show this QR at the door</p>

            <button
              onClick={() => navigate('/tickets')}
              className="mt-5 w-full rounded-full bg-ink py-3 font-semibold text-bg transition-transform active:scale-95"
            >
              View my tickets
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
