import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Copy,
  Check,
  Pencil,
  ArrowLeft,
  Phone,
  Mail,
  Link2,
  Camera,
  Loader2,
  LogOut,
} from 'lucide-react'
import { getProfile, saveProfile } from '../lib/profile'
import { uploadImage } from '../lib/upload'
import { displayAvatar, shortAddress } from '../lib/avatar'

export default function CoachProfile() {
  const navigate = useNavigate()
  const { wallet } = useOutletContext()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [link, setLink] = useState('')
  const [editingContact, setEditingContact] = useState(false)
  const [savingContact, setSavingContact] = useState(false)

  useEffect(() => {
    getProfile(wallet).then((p) => {
      setName(p.name || '')
      setAvatar(p.avatar || '')
      setPhone(p.phone || '')
      setEmail(p.email || '')
      setLink(p.link || '')
    })
  }, [wallet])

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const saveName = async () => {
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

  const saveContact = async () => {
    setSavingContact(true)
    try {
      await saveProfile({ wallet, phone, email, link })
      setEditingContact(false)
    } catch {
      /* ignore */
    } finally {
      setSavingContact(false)
    }
  }

  const hasContact = phone || email || link

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

      {/* Avatar + name */}
      <div className="mt-6 flex flex-col items-center text-center">
        <label className="relative cursor-pointer">
          <img
            src={displayAvatar(avatar, wallet)}
            alt=""
            className="h-24 w-24 rounded-full bg-lime object-cover"
          />
          <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-lime text-ink ring-2 ring-bg">
            {uploadingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          </span>
          <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
        </label>

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
              onClick={saveName}
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

      {/* Contact */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Contact</h2>
          {!editingContact && (
            <button
              onClick={() => setEditingContact(true)}
              className="flex items-center gap-1 text-sm font-semibold text-ink"
            >
              <Pencil size={14} /> {hasContact ? 'Edit' : 'Add'}
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-ink-soft">Shown on your sessions so people can reach you.</p>

        {editingContact ? (
          <div className="mt-3 space-y-3">
            {[
              { icon: Phone, v: phone, set: setPhone, ph: 'Phone / WhatsApp', max: 40 },
              { icon: Mail, v: email, set: setEmail, ph: 'Email', max: 80 },
              { icon: Link2, v: link, set: setLink, ph: 'Instagram / website link', max: 120 },
            ].map(({ icon: Icon, v, set, ph, max }) => (
              <div
                key={ph}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3"
              >
                <Icon size={18} className="shrink-0 text-ink-soft" />
                <input
                  className="w-full bg-transparent py-3 outline-none"
                  value={v}
                  onChange={(e) => set(e.target.value)}
                  placeholder={ph}
                  maxLength={max}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                onClick={saveContact}
                disabled={savingContact}
                className="flex-1 rounded-full bg-ink py-3 font-semibold text-bg disabled:opacity-60"
              >
                {savingContact ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setEditingContact(false)}
                className="flex-1 rounded-full border border-border py-3 font-semibold text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : hasContact ? (
          <div className="mt-3 space-y-2">
            {phone && (
              <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3 text-sm">
                <Phone size={16} className="text-ink-soft" /> {phone}
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3 text-sm">
                <Mail size={16} className="text-ink-soft" /> {email}
              </div>
            )}
            {link && (
              <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-3 text-sm">
                <Link2 size={16} className="text-ink-soft" /> <span className="truncate">{link}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 rounded-card border border-border p-4 text-center text-sm text-ink-soft">
            No contact added yet.
          </p>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={() => navigate('/')}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-ink-soft transition-transform active:scale-95"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  )
}
