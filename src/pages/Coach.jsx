import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Loader2,
  Wallet,
  Pencil,
  Check,
  CalendarDays,
  Users,
  Coins,
  ChevronRight,
} from 'lucide-react'
import { getAddress } from '../lib/nimiq'
import { getProfile, saveProfile } from '../lib/profile'
import { getCoachSessions } from '../lib/store'
import { avatarUrl, shortAddress } from '../lib/avatar'
import { formatDate, formatTime } from '../lib/format'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex-1 rounded-card border border-border bg-surface p-3 text-center">
      <Icon size={18} className="mx-auto text-ink-soft" strokeWidth={1.75} />
      <p className="mt-1 font-display text-xl font-bold leading-none">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  )
}

export default function Coach() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(undefined)
  const [sessions, setSessions] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      const w = await getAddress()
      setWallet(w ?? null)
      if (!w) return
      const [p, cs] = await Promise.all([getProfile(w), getCoachSessions(w)])
      setName(p.name || '')
      setSessions(cs)
    })()
  }, [])

  if (wallet === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 size={28} className="animate-spin text-ink-soft" />
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
          <Wallet size={28} className="text-ink-soft" strokeWidth={1.75} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Connect your wallet</h2>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">
          Open Sesión inside Nimiq Pay to host sessions and get paid.
        </p>
      </div>
    )
  }

  const totalBookings = sessions.reduce((n, s) => n + s.booked, 0)
  const earnings = sessions.reduce((n, s) => n + s.booked * s.priceNim, 0)

  const save = async () => {
    setSaving(true)
    try {
      const clean = draft.trim().slice(0, 40)
      await saveProfile({ wallet, name: clean })
      setName(clean)
      setEditing(false)
    } catch {
      /* ignore */
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            aria-label="Back to app"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-ink"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Coach</h1>
        </div>
        <button
          onClick={() => navigate('/app')}
          className="text-sm font-semibold text-ink-soft"
        >
          View as client
        </button>
      </header>

      {/* Coach identity */}
      <div className="mt-5 flex items-center gap-4 rounded-card bg-ink p-5 text-bg">
        <img
          src={avatarUrl(wallet)}
          alt=""
          className="h-14 w-14 shrink-0 rounded-full bg-lime object-cover"
        />
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={40}
                placeholder="Your coach name"
                autoFocus
                className="w-full min-w-0 rounded-full bg-bg/10 px-3 py-2 text-bg outline-none placeholder:text-bg/50"
              />
              <button
                onClick={save}
                disabled={saving}
                className="shrink-0 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink"
              >
                {saving ? '…' : 'Save'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setDraft(name)
                setEditing(true)
              }}
              className="flex items-center gap-2"
            >
              <span className="font-display text-lg font-bold">{name || 'Add your name'}</span>
              <Pencil size={14} className="text-bg/60" />
            </button>
          )}
          <p className="tnum truncate text-sm text-bg/60">{shortAddress(wallet)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-3">
        <Stat icon={CalendarDays} label="Events" value={sessions.length} />
        <Stat icon={Users} label="Bookings" value={totalBookings} />
        <Stat icon={Coins} label="NIM earned" value={Number(earnings.toFixed(2))} />
      </div>

      {/* Create hosting */}
      <button
        onClick={() => navigate('/create')}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-4 text-base font-semibold text-ink transition-transform active:scale-95"
      >
        <Plus size={20} /> Create a session
      </button>

      {/* Manage events */}
      <div className="mt-7">
        <h2 className="mb-3 font-display text-xl font-bold">Your events</h2>
        {sessions.length === 0 ? (
          <div className="rounded-card border border-border p-6 text-center">
            <p className="text-sm text-ink-soft">
              No events yet. Create your first session and share it with your community.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/session/${s.id}`)}
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
    </div>
  )
}
