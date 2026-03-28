/**
 * HiddenOS Data Layer
 * ─────────────────────────────────────────────
 * Currently uses localStorage. To switch to Supabase:
 * 1. npm install @supabase/supabase-js
 * 2. Replace each function body with a Supabase query
 * 3. Everything else in the app stays the same.
 */

const KEY = (k) => `tos3_${k}`

export const db = {
  get: (k) => {
    try { return JSON.parse(localStorage.getItem(KEY(k))) } catch { return null }
  },
  set: (k, v) => {
    try { localStorage.setItem(KEY(k), JSON.stringify(v)) } catch {}
  },
  del: (k) => { try { localStorage.removeItem(KEY(k)) } catch {} },
}

// ── TRADES ──────────────────────────────────
export const getTrades    = ()    => db.get('trades') || []
export const setTrades    = (v)   => db.set('trades', v)
export const addTrade     = (t)   => setTrades([...getTrades(), t])
export const updateTrade  = (id, patch) =>
  setTrades(getTrades().map(t => t.id === id ? { ...t, ...patch } : t))
export const deleteTrade  = (id)  =>
  setTrades(getTrades().filter(t => t.id !== id))

// ── ACCOUNTS ────────────────────────────────
export const DEFAULT_ACCOUNTS = [
  { id: 'funded_hive',  name: 'Funded Hive',    startBal: 25000,  color: '#0D8F6E' },
  { id: 'ftmo_chal',    name: 'FTMO Challenge',  startBal: 100000, color: '#C28A1A' },
  { id: 'ftmo_fund',    name: 'FTMO Funded',     startBal: 100000, color: '#9C27B0' },
  { id: 'topstep',      name: 'TopStep',         startBal: 50000,  color: '#1565C0' },
  { id: 'personal',     name: 'Personal',        startBal: 10000,  color: '#126E87' },
  { id: 'sim',          name: 'Sim',             startBal: 100000, color: '#7A6848' },
]
export const getAccounts  = ()    => db.get('accounts') || DEFAULT_ACCOUNTS
export const setAccounts  = (v)   => db.set('accounts', v)
export const getActiveAcc = ()    => db.get('activeAcc') || 'all'
export const setActiveAcc = (v)   => db.set('activeAcc', v)

// ── DAILY LOG ───────────────────────────────
export const getDailyLog  = (d)   => db.get(`dl_${d}`) || { checklist: {}, gameplan: '', mood: '', notes: '' }
export const setDailyLog  = (d,v) => db.set(`dl_${d}`, v)

// ── JOURNAL ─────────────────────────────────
export const getJournal   = ()    => db.get('journal') || []
export const addJournalEntry = (e) => db.set('journal', [e, ...getJournal()])
export const deleteJournalEntry = (id) =>
  db.set('journal', getJournal().filter(e => e.id !== id))

// ── MACRO ───────────────────────────────────
export const getMacro     = (d)   => db.get(`macro_${d}`) || {}
export const setMacro     = (d,v) => db.set(`macro_${d}`, v)

// ── QUICK NOTES ─────────────────────────────
export const getQNotes    = ()    => db.get('qnotes') || []
export const addQNote     = (n)   => db.set('qnotes', [n, ...getQNotes()].slice(0, 20))
export const deleteQNote  = (id)  => db.set('qnotes', getQNotes().filter(n => n.id !== id))

// ── THEME ───────────────────────────────────
export const getTheme     = ()    => db.get('theme') || 'light'
export const setTheme     = (v)   => db.set('theme', v)

// ── HELPERS ─────────────────────────────────
export const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

export const fmtPnl = (n) => {
  const a = Math.abs(n)
  const s = a >= 1000 ? `${(a/1000).toFixed(1)}K` : a.toFixed(2)
  return (n >= 0 ? '+$' : '-$') + s
}

export const fmtDate = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })

export const getAccIdFromTrade = (t, accounts) => {
  if (!t.account) return 'unknown'
  const found = accounts.find(a => a.id === t.account || a.name === t.account)
  return found ? found.id : t.account
}

export const getFilteredTrades = () => {
  const all = getTrades()
  const active = getActiveAcc()
  if (active === 'all') return all
  const accounts = getAccounts()
  return all.filter(t => getAccIdFromTrade(t, accounts) === active)
}

export const calcStats = (trades) => {
  const closed = trades.filter(t => t.status === 'closed')
  const open   = trades.filter(t => t.status === 'open')
  const wins   = closed.filter(t => t.outcome === 'win')
  const losses = closed.filter(t => t.outcome === 'loss')
  const totalPnl = closed.reduce((s, t) => s + (parseFloat(t.pnl) || 0), 0)
  const grossWin  = wins.reduce((s, t) => s + (parseFloat(t.pnl) || 0), 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + (parseFloat(t.pnl) || 0), 0))
  const pf = grossLoss > 0 ? (grossWin / grossLoss).toFixed(2) : '∞'
  const wr = closed.length ? Math.round(wins.length / closed.length * 100) : 0
  return { closed, open, wins, losses, totalPnl, grossWin, grossLoss, pf, wr }
}
