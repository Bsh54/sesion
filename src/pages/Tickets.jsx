import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { Ticket as TicketIcon, Calendar, MapPin, QrCode, X, Check, Loader2, Download } from 'lucide-react'
import { getTickets } from '../lib/tickets'
import { getSessions } from '../lib/store'
import { getAddress } from '../lib/nimiq'
import { formatDate, formatTime } from '../lib/format'

export default function Tickets() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null) // null = loading
  const [active, setActive] = useState(null)

  useEffect(() => {
    ;(async () => {
      const wallet = await getAddress()
      const [tks, sessions] = await Promise.all([getTickets(wallet), getSessions()])
      const map = Object.fromEntries(sessions.map((s) => [s.id, s]))
      setItems(tks.map((t) => ({ ...t, session: map[t.sessionId] })).filter((x) => x.session))
    })()
  }, [])

  if (items === null) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-ink-soft" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
          <TicketIcon size={28} className="text-ink-soft" strokeWidth={1.75} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">No tickets yet</h2>
        <p className="mt-1 text-sm text-ink-soft">Book a session and your QR ticket shows up here.</p>
        <button
          onClick={() => navigate('/app')}
          className="mt-5 rounded-full bg-ink px-6 py-3 font-semibold text-bg transition-transform active:scale-95"
        >
          Explore sessions
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">My tickets</h1>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item)}
            className="flex w-full items-center gap-4 overflow-hidden rounded-card border border-border bg-surface p-3 text-left transition-transform active:scale-[.99]"
          >
            <img
              src={item.session.image}
              alt=""
              className="h-20 w-20 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-bold leading-tight">
                {item.session.title}
              </p>
              <p className="tnum mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                <Calendar size={14} /> {formatDate(item.session.startsAt)} ·{' '}
                {formatTime(item.session.startsAt)}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
                <MapPin size={14} /> {item.session.location}
              </p>
            </div>
            <span className="flex shrink-0 flex-col items-center gap-1 text-ink">
              <QrCode size={26} />
              <span className="text-[11px] font-semibold">View</span>
            </span>
          </button>
        ))}
      </div>

      {/* Ticket QR modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-5"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-sm rounded-ticket bg-surface p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="-mt-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                <Check size={14} /> Confirmed
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold">{active.session.title}</h2>
              <p className="tnum text-sm text-ink-soft">
                {formatDate(active.session.startsAt)} · {formatTime(active.session.startsAt)}
              </p>
            </div>

            <div className="my-5 border-t border-dashed border-border" />

            <div className="flex justify-center">
              <QRCodeCanvas
                id="ticket-qr"
                value={`SESION:${active.session.id}:${active.code.slice(0, 24)}`}
                size={190}
                fgColor="#14161B"
                bgColor="#FFFFFF"
              />
            </div>
            <p className="tnum mt-3 text-xs text-ink-soft">
              Ticket {active.code.slice(0, 10).toUpperCase()}
            </p>
            <p className="text-xs text-ink-soft">Show this QR at the door</p>

            <button
              onClick={() => {
                const canvas = document.getElementById('ticket-qr')
                if (!canvas) return
                const link = document.createElement('a')
                link.download = `sesion-ticket-${active.session.id}.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 font-semibold text-bg transition-transform active:scale-95"
            >
              <Download size={18} /> Download ticket
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
