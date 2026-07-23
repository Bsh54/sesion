import * as Icons from 'lucide-react'
import { CATEGORIES } from '../data/sessions'

export default function CategoryChips({ active, onSelect }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1">
      {CATEGORIES.map((cat) => {
        const Icon = Icons[cat.icon] ?? Icons.Circle
        const isActive = active === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            aria-pressed={isActive}
            className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors duration-150 active:scale-95 ${
              isActive
                ? 'bg-ink text-bg'
                : 'bg-muted text-ink-soft hover:text-ink'
            }`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
