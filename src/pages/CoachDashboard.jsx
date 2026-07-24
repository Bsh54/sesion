import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { CalendarDays, Users, Coins, Plus, ArrowLeft } from 'lucide-react'
import { getProfile } from '../lib/profile'
import { getCoachSessions } from '../lib/store'
import { avatarUrl, shortAddress } from '../lib/avatar'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 rounded-card border border-border bg-surface p-3 text-center">
      <Icon size={18} className="mx-auto text-ink-soft" strokeWidth={1.75} />
      <p className="mt-1 font-display text-xl font-bold leading-none">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  )
}

export default function CoachDashboard() {
  const navigate = useNavigate()
  const { wallet } = useOutletContext()
  const [name, setName] = useState('')
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    getProfile(wallet).then((p) => setName(p.name || ''))
    getCoachSessions(wallet).then(setSessions)
  }, [wallet])

  const bookings = sessions.reduce((n, s) => n + s.booked, 0)
  const earnings = sessions.reduce((n, s) => n + s.booked * s.priceNim, 0)

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Coach</h1>
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-1 text-sm font-semibold text-ink-soft"
        >
          <ArrowLeft size={16} /> Client view
        </button>
      </header>

      <div className="mt-5 flex items-center gap-4 rounded-card bg-ink p-5 text-bg">
        <img
          src={avatarUrl(wallet)}
          alt=""
          className="h-14 w-14 shrink-0 rounded-full bg-lime object-cover"
        />
        <div className="min-w-0">
          <p className="font-display text-lg font-bold">{name || 'Coach'}</p>
          <p className="tnum truncate text-sm text-bg/60">{shortAddress(wallet)}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Stat icon={CalendarDays} label="Events" value={sessions.length} />
        <Stat icon={Users} label="Bookings" value={bookings} />
        <Stat icon={Coins} label="NIM earned" value={Number(earnings.toFixed(2))} />
      </div>

      <button
        onClick={() => navigate('/coach/create')}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-4 text-base font-semibold text-ink transition-transform active:scale-95"
      >
        <Plus size={20} /> Create a session
      </button>

      <button
        onClick={() => navigate('/coach/events')}
        className="mt-3 w-full rounded-full border border-border py-3 text-sm font-semibold text-ink"
      >
        Manage my events
      </button>
    </div>
  )
}
