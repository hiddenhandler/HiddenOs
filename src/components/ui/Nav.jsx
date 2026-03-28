import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, TrendingUp, BookOpen, ScrollText } from 'lucide-react'

const TABS = [
  { to: '/',        label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trade',   label: 'Trade',     icon: PlusCircle,  gold: true },
  { to: '/track',   label: 'Track',     icon: TrendingUp },
  { to: '/log',     label: 'Log',       icon: ScrollText },
  { to: '/knowledge', label: 'Knowledge', icon: BookOpen },
]

export function TopNav() {
  return (
    <nav className="sticky top-14 z-30 bg-cream/97 backdrop-blur-xl border-b border-cream-3 hidden sm:flex items-center px-3 py-2 gap-1 overflow-x-auto no-scrollbar">
      {TABS.map(({ to, label, icon: Icon, gold }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-150 whitespace-nowrap flex-shrink-0
            ${gold
              ? isActive
                ? 'bg-gold-2 border-gold-2 text-white'
                : 'bg-gold-2/10 border-gold-2/30 text-gold-2 hover:bg-gold-2/20'
              : isActive
                ? 'bg-ink-2 border-ink-2 text-cream'
                : 'border-transparent text-ink-4 hover:bg-cream-2 hover:border-cream-3 hover:text-ink-2'}`
          }
        >
          <Icon size={13} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function BottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/98 backdrop-blur-xl border-t border-cream-3 pb-safe">
      <div className="flex h-16">
        {TABS.map(({ to, label, icon: Icon, gold }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 text-[8px] font-mono font-bold uppercase tracking-wide transition-colors
              ${isActive
                ? gold ? 'text-gold-2' : 'text-ink-2'
                : 'text-ink-4'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {label.slice(0, 4)}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
