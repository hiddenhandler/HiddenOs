import { useState } from 'react'

// ── CARD ──────────────────────────────────────
export function Card({ children, className = '', hover = false }) {
  return (
    <div className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, badge, right, className = '' }) {
  return (
    <div className={`flex items-center justify-between px-5 py-3.5 border-b border-cream-3 ${className}`}>
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-2">{title}</span>
      <div className="flex items-center gap-2">
        {badge && <span className="badge badge-gray">{badge}</span>}
        {right}
      </div>
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}

// ── STAT CARD ─────────────────────────────────
export function StatCard({ label, value, sub, accent = 'gold' }) {
  const colors = {
    gold:   'bg-gold-2',
    green:  'bg-sage',
    red:    'bg-crimson',
    blue:   'bg-navy',
    gray:   'bg-ink-3',
  }
  return (
    <div className="card card-hover relative overflow-hidden p-4">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${colors[accent] || colors.gold}`} />
      <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-ink-4 mb-2">{label}</div>
      <div className="font-mono text-2xl font-bold text-ink leading-none">{value}</div>
      {sub && <div className="text-[11px] text-ink-4 mt-1.5">{sub}</div>}
    </div>
  )
}

// ── ALERT ─────────────────────────────────────
export function Alert({ type = 'info', children }) {
  const styles = {
    error:  'bg-crimson/8 border-crimson/20 text-crimson',
    warn:   'bg-gold-2/8 border-gold-2/20 text-gold-2',
    success:'bg-sage/8 border-sage/20 text-sage',
    info:   'bg-navy/8 border-navy/20 text-navy',
  }
  return (
    <div className={`px-4 py-3 rounded-xl border text-sm font-medium mb-3 ${styles[type]}`}>
      {children}
    </div>
  )
}

// ── PROGRESS BAR ──────────────────────────────
export function ProgressBar({ pct, gradient = false }) {
  return (
    <div className="h-1.5 bg-cream-3 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${gradient ? 'bg-gradient-to-r from-crimson via-gold-2 to-sage' : 'bg-gold-2'}`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  )
}

// ── CHECKLIST ITEM ────────────────────────────
export function CheckItem({ checked, text, note, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 mb-1.5
        ${checked
          ? 'bg-sage/5 border-sage/20'
          : 'bg-cream-2 border-cream-3 hover:border-gold-2/30 hover:bg-cream'}`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all
        ${checked ? 'bg-sage border-transparent' : 'border-cream-4'}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium leading-snug ${checked ? 'line-through text-ink-4' : 'text-ink-2'}`}>{text}</div>
        {note && <div className={`text-[11px] mt-0.5 ${checked ? 'text-ink-4' : 'text-ink-4'}`}>{note}</div>}
      </div>
    </div>
  )
}

// ── TRADE CARD ────────────────────────────────
export function TradeCard({ trade, compact = false }) {
  const isOpen  = trade.status === 'open'
  const isWin   = trade.outcome === 'win'
  const isLoss  = trade.outcome === 'loss'
  const pnl     = parseFloat(trade.pnl) || 0
  const accentColor = isOpen ? 'bg-gold-2' : isWin ? 'bg-sage' : isLoss ? 'bg-crimson' : 'bg-ink-3'

  return (
    <div className="card relative overflow-hidden mb-2 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-md">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />
      <div className="pl-4 pr-4 py-3">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="font-mono text-lg font-bold text-ink">{trade.instrument}</span>
          <span className={`badge ${trade.dir === 'long' ? 'badge-green' : 'badge-red'}`}>
            {trade.dir === 'long' ? 'LONG' : 'SHORT'}
          </span>
          {isOpen && <span className="badge badge-gold">OPEN</span>}
          {!isOpen && <span className={`badge ${isWin ? 'badge-green' : isLoss ? 'badge-red' : 'badge-gray'}`}>
            {trade.outcome?.toUpperCase() || 'BE'}
          </span>}
          {!isOpen && (
            <span className={`ml-auto font-mono text-lg font-bold ${pnl >= 0 ? 'text-sage' : 'text-crimson'}`}>
              {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toFixed(0)}
            </span>
          )}
        </div>
        {!compact && (
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[['Entry', trade.entry], ['SL', trade.sl], ['TP', trade.tp]].map(([l, v]) => (
              <div key={l} className="bg-cream-2 rounded-lg px-2.5 py-1.5">
                <div className="text-[9px] font-mono text-ink-4 uppercase tracking-wide mb-0.5">{l}</div>
                <div className="font-mono text-xs font-bold text-ink">{v || '—'}</div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {trade.setup && <span className="text-[11px] text-ink-4">{trade.setup}</span>}
          <span className="text-[11px] text-ink-4 ml-auto">{trade.date}</span>
        </div>
      </div>
    </div>
  )
}

// ── PILL SELECT ───────────────────────────────
export function PillSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const v = typeof opt === 'string' ? opt : opt.value
        const l = typeof opt === 'string' ? opt : opt.label
        return (
          <button
            key={v}
            onClick={() => onChange(v === value ? '' : v)}
            className={`px-3 py-1.5 rounded-full border text-sm transition-all duration-150
              ${value === v
                ? 'bg-gold-2/12 border-gold-2/40 text-gold-2 font-medium'
                : 'border-cream-3 text-ink-4 hover:border-gold-2/30 hover:text-gold-2'}`}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}

// ── TOAST ─────────────────────────────────────
let _showToast = null
export function registerToast(fn) { _showToast = fn }
export function toast(msg = '✓ Saved', type = 'success') {
  if (_showToast) _showToast(msg, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  registerToast((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500)
  })
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-5 py-2.5 rounded-xl border font-mono text-xs font-bold uppercase tracking-widest
          shadow-card-md backdrop-blur-sm
          ${t.type === 'error' ? 'bg-parchment border-crimson/30 text-crimson'
            : t.type === 'warn' ? 'bg-parchment border-gold-2/30 text-gold-2'
            : 'bg-parchment border-sage/30 text-sage'}`}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ── SECTION TITLE ─────────────────────────────
export function SectionTitle({ children }) {
  return (
    <div className="section-title">
      <span>{children}</span>
    </div>
  )
}

// ── MODAL ─────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-parchment border border-cream-3 rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-2">{title}</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-cream-2 border border-cream-3 text-ink-3 hover:border-crimson/30 hover:text-crimson transition-colors text-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
