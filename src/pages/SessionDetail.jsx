import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Star, MapPin, Calendar, Check, Loader2 } from 'lucide-react'
import { CATEGORIES } from '../data/sessions'
import { getSession } from '../lib/store'
import { formatDate, formatTime, spotsInfo } from '../lib/format'
import { paySession } from '../lib/nimiq'

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
    <div className="min-h-dvh bg-bg pb-28">
      {/* Hero */}
      <div className="relative">
        <img src={session.image} alt={session.title} className="h-72 w-full object-cover" />
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

      {/* Content */}
      <div className="mx-auto max-w-2xl px-5 pt-5">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">
          {session.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-soft">
          <span className="tnum flex items-center gap-1.5">
            <Calendar size={16} /> {formatDate(session.startsAt)} · {formatTime(session.startsAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={16} /> {session.location}
          </span>
        </div>

        {/* Coach */}
        <div className="mt-5 flex items-center gap-3 rounded-card border border-border p-4">
          <img src={session.coach.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-semibold">{session.coach.name}</p>
            <p className="text-sm text-ink-soft">Coach</p>
          </div>
          <span className="flex items-center gap-1 font-semibold">
            <Star size={15} className="fill-lime text-lime" /> {session.coach.rating}
          </span>
        </div>

        {/* Who's coming */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Who&apos;s coming</h2>
            <span
              className={`text-sm font-semibold ${scarce ? 'text-coral' : 'text-ink-soft'}`}
            >
              {session.booked} going · {left} left
            </span>
          </div>
          <div className="mt-3 flex -space-x-2">
            {Array.from({ length: Math.min(session.booked, 6) }).map((_, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/80?img=${(i + 3) * 5}`}
                alt=""
                className="h-9 w-9 rounded-full border-2 border-bg object-cover"
              />
            ))}
            {session.booked > 6 && (
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-bg bg-muted text-xs font-semibold text-ink-soft">
                +{session.booked - 6}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="font-display text-xl font-bold">About this session</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">{session.description}</p>
        </div>
      </div>

      {/* Sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-sheet backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="tnum text-2xl font-bold leading-none">
              {session.priceNim} <span className="text-base font-semibold text-ink-soft">NIM</span>
            </p>
            <p className="text-xs text-ink-soft">per spot</p>
          </div>
          <button
            onClick={handleBook}
            disabled={status !== 'idle' || left <= 0}
            className="flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-semibold text-bg transition-transform active:scale-95 disabled:opacity-50"
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
        </div>
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
