import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Copy, Check, Pencil, ArrowLeft } from 'lucide-react'
import { getProfile, saveProfile } from '../lib/profile'
import { avatarUrl, shortAddress } from '../lib/avatar'

export default function CoachProfile() {
  const navigate = useNavigate()
  const { wallet } = useOutletContext()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getProfile(wallet).then((p) => setName(p.name || ''))
  }, [wallet])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
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
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate('/coach')}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-muted text-ink"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Coach profile</h1>
      </header>

      <div className="mt-6 flex flex-col items-center text-center">
        <img
          src={avatarUrl(wallet)}
          alt=""
          className="h-24 w-24 rounded-full bg-lime object-cover"
        />
        {editing ? (
          <div className="mt-4 flex w-full max-w-xs items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={40}
              placeholder="Your coach name"
              autoFocus
              className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-center outline-none focus:ring-2 focus:ring-lime"
            />
            <button
              onClick={save}
              disabled={saving}
              className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-bg"
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
            className="mt-4 flex items-center gap-2"
          >
            <span className="font-display text-2xl font-bold">{name || 'Add your name'}</span>
            <Pencil size={16} className="text-ink-soft" />
          </button>
        )}
      </div>

      {/* Wallet */}
      <div className="mt-6 flex items-center justify-between rounded-card border border-border bg-surface p-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Wallet</p>
          <p className="tnum truncate font-semibold">{shortAddress(wallet)}</p>
        </div>
        <button
          onClick={copy}
          aria-label="Copy address"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-ink transition-transform active:scale-95"
        >
          {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-ink-soft">
        Payments from your sessions land straight in this wallet.
      </p>
    </div>
  )
}
