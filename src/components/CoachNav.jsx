import { NavLink } from 'react-router-dom'
import { LayoutGrid, CalendarDays, Plus, UserRound } from 'lucide-react'

const item = 'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1'

function Tab({ to, end, icon: Icon, label }) {
  return (
    <NavLink to={to} end={end} aria-label={label} className={item}>
      {({ isActive }) => (
        <>
          <Icon size={22} strokeWidth={1.75} className={isActive ? 'text-lime' : 'text-bg/55'} />
          <span
            className={`text-[11px] font-semibold ${isActive ? 'text-lime' : 'text-bg/55'}`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function CoachNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2">
        <Tab to="/coach" end icon={LayoutGrid} label="Dashboard" />
        <Tab to="/coach/events" icon={CalendarDays} label="Events" />
        <NavLink to="/coach/create" aria-label="Create" className={item}>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-lime text-ink shadow-float transition-transform active:scale-95">
            <Plus size={24} />
          </span>
        </NavLink>
        <Tab to="/coach/profile" icon={UserRound} label="Profile" />
      </div>
    </nav>
  )
}
