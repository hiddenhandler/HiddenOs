import { useClock } from '../../hooks/useAppState'
import { SESSION_START, SESSION_END } from '../../data/constants'
import { fmtPnl, calcStats } from '../../lib/db'
import { ProgressBar } from './index'

export default function Header({ trades, theme, onToggleTheme }) {
  const now    = useClock()
  const mins   = now.getHours() * 60 + now.getMinutes()
  const isLive = mins >= SESSION_START && mins < SESSION_END
  const isPre  = mins < SESSION_START
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  const pct    = isLive ? ((mins - SESSION_START) / (SESSION_END - SESSION_START)) * 100 : isPre ? 0 : 100

  let timeLeft = ''
  if (isPre) {
    const r = SESSION_START - mins
    timeLeft = `Opens in ${Math.floor(r/60)}h ${String(r%60).padStart(2,'0')}m`
  } else if (isLive) {
    const r = SESSION_END - mins
    timeLeft = `${Math.floor(r/60)}h ${String(r%60).padStart(2,'0')}m left`
  } else {
    timeLeft = 'Next: 07:00 ET'
  }

  const { totalPnl } = calcStats(trades)

  return (
    <header className="sticky top-0 z-40 bg-cream/97 backdrop-blur-xl border-b border-cream-3 shadow-sm">
      <div className="flex items-center h-14 px-4 gap-3">
        {/* Logo */}
        <div className="font-mono text-base font-bold tracking-widest text-gold-2">
          HIDDEN<span className="text-ink-4">OS</span>
        </div>

        <div className="w-px h-5 bg-cream-3" />

        {/* Session indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cream-2 border border-cream-3 rounded-full">
          <div className={`w-2 h-2 rounded-full flex-shrink-0
            ${isLive ? 'bg-sage pulse-dot' : isPre ? 'bg-gold-2' : 'bg-ink-4'}`} />
          <span className="font-mono text-[10px] font-bold tracking-widest text-ink-3">
            {isLive ? 'LIVE' : isPre ? 'PRE-MKT' : 'CLOSED'}
          </span>
          <span className="font-mono text-[10px] text-ink-4 hidden sm:block">{timeLeft}</span>
        </div>

        {/* Session bar (desktop) */}
        {isLive && (
          <div className="hidden md:flex flex-col gap-0.5 flex-1 max-w-32">
            <ProgressBar pct={pct} gradient />
          </div>
        )}

        {/* P&L */}
        <div className={`font-mono text-sm font-bold ml-auto
          ${totalPnl >= 0 ? 'text-sage' : 'text-crimson'}`}>
          {fmtPnl(totalPnl)}
        </div>

        {/* Clock */}
        <span className="font-mono text-xs text-ink-4 hidden sm:block">{timeStr}</span>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-cream-2 border border-cream-3 text-sm hover:border-gold-2/30 transition-colors"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
