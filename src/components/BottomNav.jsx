import { NavLink } from 'react-router-dom'
import { Compass, Search, Ticket, User } from 'lucide-react'

const ITEMS = [
  { to: '/app', label: 'Discover', icon: Compass, end: true },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1"
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={1.75}
                  className={isActive ? 'text-ink' : 'text-ink-soft'}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? 'text-ink' : 'text-ink-soft'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
