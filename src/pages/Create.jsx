import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Wallet } from 'lucide-react'
import { getAddress } from '../lib/nimiq'
import { getProfile } from '../lib/profile'
import { createSession } from '../lib/store'
import { CATEGORIES, LEVELS, CATEGORY_IMAGE } from '../data/sessions'

const inputClass =
  'w-full rounded-2xl border border-border bg-surface px-4 py-3 text-base outline-none focus:ring-2 focus:ring-lime'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  )
}

export default function Create() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(undefined)
  const [coachName, setCoachName] = useState('')
  const [form, setForm] = useState({
    title: '',
    category: 'yoga',
    priceNim: '',
    durationMin: '60',
    level: 'All levels',
    date: '',
    time: '',
    location: '',
    capacity: '10',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      const w = await getAddress()
      setWallet(w ?? null)
      if (w) {
        const p = await getProfile(w)
        setCoachName(p.name || '')
      }
    })()
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.date || !form.time || !form.location) {
      setError('Please fill in title, date, time and location.')
      return
    }
    setSubmitting(true)
    try {
      const created = await createSession({
        title: form.title,
        category: form.category,
        priceNim: Number(form.priceNim) || 0,
        durationMin: Number(form.durationMin) || 60,
        level: form.level,
        startsAt: `${form.date}T${form.time}:00`,
        location: form.location,
        capacity: Number(form.capacity) || 10,
        description: form.description,
        image: CATEGORY_IMAGE[form.category],
        coachWallet: wallet,
        coachName,
      })
      navigate('/coach')
      void created
    } catch {
      setError('Could not create the session. Please try again.')
      setSubmitting(false)
    }
  }

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
          Open Sesión inside Nimiq Pay to host a session and get paid.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-muted text-ink"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">New session</h1>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={form.title}
            onChange={set('title')}
            maxLength={80}
            placeholder="Sunrise Vinyasa Flow"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select className={inputClass} value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <select className={inputClass} value={form.level} onChange={set('level')}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (NIM)">
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              value={form.priceNim}
              onChange={set('priceNim')}
              placeholder="6"
            />
          </Field>
          <Field label="Duration (min)">
            <input
              type="number"
              min="5"
              className={inputClass}
              value={form.durationMin}
              onChange={set('durationMin')}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <input type="date" className={inputClass} value={form.date} onChange={set('date')} />
          </Field>
          <Field label="Time">
            <input type="time" className={inputClass} value={form.time} onChange={set('time')} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Location">
            <input
              className={inputClass}
              value={form.location}
              onChange={set('location')}
              maxLength={120}
              placeholder="Copacabana Beach"
            />
          </Field>
          <Field label="Capacity">
            <input
              type="number"
              min="1"
              className={inputClass}
              value={form.capacity}
              onChange={set('capacity')}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            className={`${inputClass} min-h-[96px] resize-y`}
            value={form.description}
            onChange={set('description')}
            maxLength={500}
            placeholder="What should people expect?"
          />
        </Field>

        <p className="text-xs text-ink-soft">
          Payments go straight to your wallet: <span className="tnum">{coachName || 'you'}</span> ·
          you keep 100%.
        </p>

        {error && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-base font-semibold text-bg transition-transform active:scale-95 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Publishing…
            </>
          ) : (
            'Publish session'
          )}
        </button>
      </form>
    </div>
  )
}
