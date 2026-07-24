import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowLeft,
  Share2,
  Star,
  MapPin,
  Calendar,
  Clock,
  Gauge,
  Users,
  BadgeCheck,
  ExternalLink,
  Check,
  Loader2,
} from 'lucide-react'
import { CATEGORIES, GOOD_TO_KNOW, AMENITIES, SAMPLE_REVIEWS } from '../data/sessions'
import { getSession } from '../lib/store'
import { formatDate, formatTime, spotsInfo } from '../lib/format'
import { paySession } from '../lib/nimiq'

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
  const session = getSession(id)

  const [status, setStatus] = useState('idle') // idle | paying | booked
  const [ticket, setTicket] = useState(null)

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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.location)}`
  const bio = `${session.coach.name} is a verified ${category?.label.toLowerCase() ?? 'fitness'} coach with ${session.coach.sessions} sessions hosted and a ${session.coach.rating}-star rating from the community.`

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: session.title, url })
      else await navigator.clipboard.writeText(url)
    } catch {
      /* user cancelled */
    }
  }

  const handleBook = async () => {
    setStatus('paying')
    try {
      const res = await paySession({
        recipient: session.coach.wallet,
        nim: session.priceNim,
        ref: `SESION:${session.id}`,
      })
      if (navigator.vibrate) navigator.vibrate(10)
      setTicket({ code: res.txHash })
      setStatus('booked')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
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
        <button
          onClick={share}
          aria-label="Share"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-bg/90 text-ink transition-transform active:scale-95"
        >
          <Share2 size={20} />
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
            <p className="mt-3 text-center text-xs text-ink-soft">
              Free cancellation up to 2 hours before
            </p>
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
            <div className="flex items-center justify-between gap-3 rounded-card border border-border p-4">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0 text-ink-soft" />
                <span className="text-sm font-medium">{session.location}</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink"
              >
                Map <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Coach */}
          <div>
            <SectionTitle>Your coach</SectionTitle>
            <div className="mt-3 rounded-card border border-border p-4">
              <div className="flex items-center gap-3">
                <img
                  src={session.coach.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
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

          {/* Who's coming */}
          <div>
            <div className="flex items-center justify-between">
              <SectionTitle>Who&apos;s coming</SectionTitle>
              <span className={`text-sm font-semibold ${scarce ? 'text-coral' : 'text-ink-soft'}`}>
                {session.booked} going · {left} left
              </span>
            </div>
            <div className="mt-3 flex -space-x-2">
              {Array.from({ length: Math.min(session.booked, 8) }).map((_, i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/80?img=${(i + 3) * 5}`}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-bg object-cover"
                />
              ))}
              {session.booked > 8 && (
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-bg bg-muted text-xs font-semibold text-ink-soft">
                  +{session.booked - 8}
                </span>
              )}
            </div>
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
                value={`SESION:${session.id}:${ticket.code}`}
                size={180}
                fgColor="#14161B"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="tnum mt-3 text-xs text-ink-soft">Ticket {ticket.code}</p>
            <p className="text-xs text-ink-soft">Show this QR at the door</p>

            <button
              onClick={() => navigate('/app')}
              className="mt-5 w-full rounded-full bg-ink py-3 font-semibold text-bg transition-transform active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
