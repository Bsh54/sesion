import { useRef, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'

// Place autocomplete powered by OpenStreetMap Nominatim (no API key).
export default function LocationInput({ value, onChange, onSelect, className }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  const query = (q) => {
    clearTimeout(timer.current)
    if (q.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(q)}`,
          { headers: { 'Accept-Language': 'en' } },
        )
        const data = await res.json()
        setSuggestions(Array.isArray(data) ? data : [])
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleChange = (e) => {
    onChange(e.target.value)
    query(e.target.value)
  }

  const choose = (s) => {
    onSelect({ name: s.display_name, lat: parseFloat(s.lat), lon: parseFloat(s.lon) })
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div className="relative">
      <input
        className={className}
        value={value}
        onChange={handleChange}
        placeholder="Search a place…"
        autoComplete="off"
      />
      {loading && (
        <Loader2 size={16} className="absolute right-3 top-3.5 animate-spin text-ink-soft" />
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-2xl border border-border bg-surface shadow-card">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => choose(s)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-ink-soft" />
                <span className="line-clamp-2">{s.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
