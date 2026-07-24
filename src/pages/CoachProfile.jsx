import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Copy, Check, Pencil, ArrowLeft, Phone, Mail, Link2 } from 'lucide-react'
import { getProfile, saveProfile } from '../lib/profile'
import { avatarUrl, shortAddress } from '../lib/avatar'

const inputClass =
  'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-base outline-none focus:ring-2 focus:ring-lime'

export default function CoachProfile() {
  const navigate = useNavigate()
  const { wallet } = useOutletContext()
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [link, setLink] = useState('')
  const [savingContact, setSavingContact] = useState(false)
  const [savedContact, setSavedContact] = useState(false)

  useEffect(() => {
    getProfile(wallet).then((p) => {
      setName(p.name || '')
      setPhone(p.phone || '')
      setEmail(p.email || '')
      setLink(p.link || '')
    })
  }, [wallet])

  const saveContact = async () => {
    setSavingContact(true)
    setSavedContact(false)
    try {
      await saveProfile({ wallet, phone, email, link })
      setSavedContact(true)
      setTimeout(() => setSavedContact(false), 1500)
    } catch {
      /* ignore */
    } finally {
      setSavingContact(false)
    }
  }

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

      {/* Contact — shown on your session pages */}
      <div className="mt-7">
        <h2 className="font-display text-xl font-bold">Contact</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Shown on your sessions so people can reach you.
        </p>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3">
            <Phone size={18} className="shrink-0 text-ink-soft" />
            <input
              className="w-full bg-transparent py-3 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone / WhatsApp"
              maxLength={40}
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3">
            <Mail size={18} className="shrink-0 text-ink-soft" />
            <input
              className="w-full bg-transparent py-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              maxLength={80}
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3">
            <Link2 size={18} className="shrink-0 text-ink-soft" />
            <input
              className="w-full bg-transparent py-3 outline-none"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Instagram / website link"
              maxLength={120}
            />
          </div>
        </div>
        <button
          onClick={saveContact}
          disabled={savingContact}
          className="mt-4 w-full rounded-full bg-ink py-3 font-semibold text-bg transition-transform active:scale-95 disabled:opacity-60"
        >
          {savingContact ? 'Saving…' : savedContact ? 'Saved ✓' : 'Save contact'}
        </button>
      </div>
    </div>
  )
}
