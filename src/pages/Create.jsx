import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Loader2, ImagePlus } from 'lucide-react'
import { getProfile } from '../lib/profile'
import { createSession } from '../lib/store'
import { uploadImage } from '../lib/upload'
import LocationInput from '../components/LocationInput'
import { CATEGORIES, LEVELS } from '../data/sessions'

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
  const { wallet } = useOutletContext()
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
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [latLon, setLatLon] = useState({ lat: null, lon: null })

  useEffect(() => {
    getProfile(wallet).then((p) => setCoachName(p.name || ''))
  }, [wallet])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onImage = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setUploading(true)
    try {
      setImage(await uploadImage(f))
    } catch {
      setError('Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title || !form.date || !form.time || !form.location) {
      setError('Please fill in title, date, time and location.')
      return
    }
    if (!image) {
      setError('Please add a cover image.')
      return
    }
    setSubmitting(true)
    try {
      await createSession({
        title: form.title,
        category: form.category,
        priceNim: Number(form.priceNim) || 0,
        durationMin: Number(form.durationMin) || 60,
        level: form.level,
        startsAt: `${form.date}T${form.time}:00`,
        location: form.location,
        lat: latLon.lat,
        lon: latLon.lon,
        capacity: Number(form.capacity) || 10,
        description: form.description,
        image,
        coachWallet: wallet,
        coachName,
      })
      navigate('/coach/events')
    } catch {
      setError('Could not create the session. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate('/coach/events')}
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

        <Field label="Cover image">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-surface p-3">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-muted">
              {uploading ? (
                <Loader2 size={20} className="animate-spin text-ink-soft" />
              ) : image ? (
                <img src={image} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={22} className="text-ink-soft" />
              )}
            </span>
            <span className="text-sm text-ink-soft">
              {image ? 'Change photo' : 'Upload a cover photo (required)'}
            </span>
            <input type="file" accept="image/*" onChange={onImage} className="hidden" />
          </label>
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

        <Field label="Location">
          <LocationInput
            value={form.location}
            onChange={(v) => {
              setForm((f) => ({ ...f, location: v }))
              setLatLon({ lat: null, lon: null })
            }}
            onSelect={(s) => {
              setForm((f) => ({ ...f, location: s.name }))
              setLatLon({ lat: s.lat, lon: s.lon })
            }}
            className={inputClass}
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
          Payments go straight to your wallet — you keep 100%.
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
