import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Copy,
  Check,
  Ticket,
  CalendarClock,
  Sparkles,
  ChevronRight,
  Loader2,
  Wallet,
  Pencil,
  Camera,
  LogOut,
} from 'lucide-react'
import { getAddress } from '../lib/nimiq'
import { getTickets } from '../lib/tickets'
import { getProfile, saveProfile } from '../lib/profile'
import { getSessions } from '../lib/store'
import { uploadImage } from '../lib/upload'
import { displayAvatar, shortAddress } from '../lib/avatar'
import { CATEGORIES } from '../data/sessions'
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

export default function Profile() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(undefined) // undefined = loading, null = none
  const [booked, setBooked] = useState([])
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    ;(async () => {
      const w = await getAddress()
      setWallet(w ?? null)
      if (!w) return
      const [tks, sessions, p] = await Promise.all([getTickets(w), getSessions(), getProfile(w)])
      const map = Object.fromEntries(sessions.map((s) => [s.id, s]))
      setBooked(tks.map((t) => ({ ...t, session: map[t.sessionId] })).filter((x) => x.session))
      setName(p.name || '')
      setAvatar(p.avatar || '')
    })()
  }, [])

  if (wallet === undefined) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 size={28} className="animate-spin text-ink-soft" />
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
          <Wallet size={28} className="text-ink-soft" strokeWidth={1.75} />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Connect your wallet</h2>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">
          Open Sesión inside Nimiq Pay to see your profile and bookings.
        </p>
      </div>
    )
  }

  const now = Date.now()
  const upcoming = booked
    .filter((b) => new Date(b.session.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.session.startsAt) - new Date(b.session.startsAt))

  const counts = {}
  booked.forEach((b) => (counts[b.session.category] = (counts[b.session.category] || 0) + 1))
  const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
  const topCategory = CATEGORIES.find((c) => c.id === topId)?.label ?? '—'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const onAvatar = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadingAvatar(true)
    try {
      const url = await uploadImage(f)
      await saveProfile({ wallet, avatar: url })
      setAvatar(url)
    } catch {
      /* ignore */
    } finally {
      setUploadingAvatar(false)
    }
  }

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
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Profile</h1>

      {/* Wallet + identity card */}
      <div className="mt-5 rounded-card bg-ink p-5 text-bg">
        <div className="flex items-center gap-4">
          <label className="relative shrink-0 cursor-pointer">
            <img
              src={displayAvatar(avatar, wallet)}
              alt="Your avatar"
              className="h-14 w-14 rounded-full bg-lime object-cover"
            />
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-lime text-ink ring-2 ring-ink">
              {uploadingAvatar ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Camera size={12} />
              )}
            </span>
            <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
          </label>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={40}
                  placeholder="Your name"
                  autoFocus
                  className="w-full min-w-0 rounded-full bg-bg/10 px-3 py-2 text-bg outline-none placeholder:text-bg/50"
                />
                <button
                  onClick={save}
                  disabled={saving}
                  className="shrink-0 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink transition-transform active:scale-95 disabled:opacity-60"
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
          <button
            onClick={copy}
            aria-label="Copy address"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg/10 text-bg transition-transform active:scale-95"
          >
            {copied ? <Check size={18} className="text-lime" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-3">
        <Stat icon={Ticket} label="Booked" value={booked.length} />
        <Stat icon={CalendarClock} label="Upcoming" value={upcoming.length} />
        <Stat icon={Sparkles} label="Top" value={topCategory} />
      </div>

      {/* Upcoming sessions */}
      <div className="mt-6">
        <h2 className="mb-3 font-display text-xl font-bold">Upcoming sessions</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-card border border-border p-5 text-center">
            <p className="text-sm text-ink-soft">No upcoming sessions yet.</p>
            <button
              onClick={() => navigate('/app')}
              className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg transition-transform active:scale-95"
            >
              Explore sessions
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/session/${b.session.id}`)}
                className="flex w-full items-center gap-4 rounded-card border border-border bg-surface p-3 text-left transition-transform active:scale-[.99]"
              >
                <img
                  src={b.session.image}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold leading-tight">
                    {b.session.title}
                  </p>
                  <p className="tnum mt-0.5 text-sm text-ink-soft">
                    {formatDate(b.session.startsAt)} · {formatTime(b.session.startsAt)}
                  </p>
                </div>
                <ChevronRight size={20} className="shrink-0 text-ink-soft" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Coach space entry */}
      <button
        onClick={() => navigate('/coach')}
        className="mt-6 flex w-full items-center justify-between rounded-card bg-ink px-5 py-4 text-left text-bg transition-transform active:scale-[.99]"
      >
        <span>
          <span className="block font-display text-lg font-bold">Coach space</span>
          <span className="text-sm text-bg/60">Host sessions and get paid in NIM</span>
        </span>
        <ChevronRight size={20} className="text-bg/70" />
      </button>

      {/* Link to tickets */}
      <button
        onClick={() => navigate('/tickets')}
        className="mt-4 flex w-full items-center justify-between rounded-card border border-border bg-surface px-5 py-4 text-left transition-transform active:scale-[.99]"
      >
        <span className="flex items-center gap-3 font-semibold">
          <Ticket size={20} /> My tickets
        </span>
        <ChevronRight size={20} className="text-ink-soft" />
      </button>

      <button
        onClick={() => navigate('/')}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-ink-soft transition-transform active:scale-95"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  )
}
