import { Construction } from 'lucide-react'

// Temporary empty state for screens not built yet.
export default function Placeholder({ title }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-muted">
        <Construction size={28} className="text-ink-soft" strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 font-display text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">Coming up next.</p>
    </div>
  )
}
