import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardBody, StatCard, SectionTitle } from '../ui/index'
import { getAccounts, getTrades, getAccIdFromTrade, fmtPnl, calcStats, getFilteredTrades, getActiveAcc } from '../../lib/db'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler)

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(100,80,40,0.06)' }, ticks: { color: '#8A7D6A', font: { family: 'Space Mono', size: 10 } } },
    y: { grid: { color: 'rgba(100,80,40,0.06)' }, ticks: { color: '#8A7D6A', font: { family: 'Space Mono', size: 10 } } },
  }
}

// ── SUB-TAB ────────────────────────────────────────────
function SubTabs({ active, onChange }) {
  const tabs = [
    { id: 'portfolio', label: '📦 Portfolio' },
    { id: 'calendar',  label: '📅 Calendar' },
    { id: 'analytics', label: '📊 Analytics' },
  ]
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest transition-all
            ${active === t.id ? 'bg-ink-2 border-ink-2 text-cream' : 'border-cream-3 text-ink-4 hover:border-gold-2/30 hover:text-gold-2'}`}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── PORTFOLIO ──────────────────────────────────────────
function Portfolio({ refresh }) {
  const accounts = getAccounts()
  const allTrades = getTrades()
  const closed = allTrades.filter(t => t.status === 'closed')
  const open   = allTrades.filter(t => t.status === 'open')

  const totalPnl = closed.reduce((s, t) => s + (parseFloat(t.pnl)||0), 0)
  const totalBal = accounts.reduce((s, a) => {
    const pnl = closed.filter(t => getAccIdFromTrade(t, accounts) === a.id).reduce((x,t) => x+(parseFloat(t.pnl)||0),0)
    return s + a.startBal + pnl
  }, 0)

  const wins = closed.filter(t => t.outcome === 'win')
  const gW = wins.reduce((s,t) => s+(parseFloat(t.pnl)||0),0)
  const gL = Math.abs(closed.filter(t=>t.outcome==='loss').reduce((s,t)=>s+(parseFloat(t.pnl)||0),0))
  const pf = gL > 0 ? (gW/gL).toFixed(2) : '∞'
  const wr = closed.length ? Math.round(wins.length/closed.length*100) : 0

  const today = new Date().toISOString().slice(0,10)
  const todayTrades = closed.filter(t => t.date === today)
  const todayPnl = todayTrades.reduce((s,t) => s+(parseFloat(t.pnl)||0), 0)

  const usedAccIds = new Set(allTrades.map(t => getAccIdFromTrade(t, accounts)))
  const activeAccs = accounts.filter(a => usedAccIds.has(a.id))

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="card p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/5 to-transparent pointer-events-none" />
        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-navy mb-1">Total Portfolio Balance</div>
        <div className="font-mono text-4xl font-bold text-ink leading-none mb-1">${totalBal.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
        <div className={`font-mono text-lg font-bold ${totalPnl >= 0 ? 'text-sage' : 'text-crimson'}`}>{fmtPnl(totalPnl)}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {[['Total Trades', allTrades.length], ['Win Rate', `${wr}%`], ['Open Positions', open.length], ['Profit Factor', pf]].map(([l,v]) => (
            <div key={l} className="bg-cream-2/70 border border-cream-3 rounded-xl p-3">
              <div className="text-[9px] font-mono text-ink-4 uppercase tracking-wide mb-1">{l}</div>
              <div className="font-mono text-xl font-bold text-ink">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Cards */}
      {activeAccs.length > 0 && (
        <>
          <SectionTitle>Account Breakdown</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeAccs.map(acc => {
              const accClosed = closed.filter(t => getAccIdFromTrade(t, accounts) === acc.id)
              const accOpen   = open.filter(t => getAccIdFromTrade(t, accounts) === acc.id)
              const pnl  = accClosed.reduce((s,t) => s+(parseFloat(t.pnl)||0), 0)
              const bal  = acc.startBal + pnl
              const accWr = accClosed.length ? Math.round(accClosed.filter(t=>t.outcome==='win').length/accClosed.length*100) : 0
              const gw = accClosed.filter(t=>t.outcome==='win').reduce((s,t)=>s+(parseFloat(t.pnl)||0),0)
              const gl = Math.abs(accClosed.filter(t=>t.outcome==='loss').reduce((s,t)=>s+(parseFloat(t.pnl)||0),0))
              const accPf = gl > 0 ? (gw/gl).toFixed(2) : '∞'
              const pct = Math.min(100, Math.max(0, (pnl/acc.startBal)*100+50))
              return (
                <div key={acc.id} className="card relative overflow-hidden p-4">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: acc.color }} />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: acc.color }} />
                    <span className="font-mono text-xs font-bold text-ink flex-1">{acc.name}</span>
                    {accOpen.length > 0 && <span className="badge badge-gold">{accOpen.length} OPEN</span>}
                  </div>
                  <div className={`font-mono text-2xl font-bold leading-none mb-0.5 ${pnl >= 0 ? 'text-ink' : 'text-crimson'}`}>
                    ${bal.toLocaleString(undefined,{maximumFractionDigits:0})}
                  </div>
                  <div className="text-[10px] font-mono text-ink-4 mb-3">Start: ${acc.startBal.toLocaleString()}</div>
                  {[['NET P&L', fmtPnl(pnl), pnl>=0?'text-sage':'text-crimson'], ['WIN RATE', `${accWr}%`, ''], ['PROFIT FACTOR', accPf, 'text-gold-2']].map(([l,v,c]) => (
                    <div key={l} className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-ink-4 uppercase tracking-wide">{l}</span>
                      <span className={`font-mono text-xs font-bold ${c || 'text-ink'}`}>{v}</span>
                    </div>
                  ))}
                  <div className="h-1 bg-cream-3 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: acc.color }} />
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-cream-3">
                    {[['Trades', accClosed.length], ['Wins', accClosed.filter(t=>t.outcome==='win').length], ['Losses', accClosed.filter(t=>t.outcome==='loss').length]].map(([l,v]) => (
                      <div key={l} className="text-center">
                        <div className="text-[8px] font-mono text-ink-4 uppercase">{l}</div>
                        <div className="font-mono text-sm font-bold text-ink">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity — All Accounts" badge={`${closed.slice(-20).length} trades`} />
        <div>
          {closed.length === 0
            ? <p className="text-center text-ink-4 font-mono text-xs py-8">No trades logged yet</p>
            : closed.slice(-20).reverse().map(t => {
              const acc = accounts.find(a => getAccIdFromTrade(t, accounts) === a.id) || { name: t.account||'?', color: '#7A6848' }
              const pnl = parseFloat(t.pnl)||0
              return (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3 border-b border-cream-3/50 hover:bg-cream-2/50 transition-colors">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: acc.color }} />
                  <span className="font-mono text-sm font-bold text-ink w-16">{t.instrument}</span>
                  <span className={`badge ${t.dir==='long'?'badge-green':'badge-red'}`}>{t.dir==='long'?'LONG':'SHORT'}</span>
                  <span className="text-[11px] text-ink-4 flex-1">{acc.name}</span>
                  <span className="text-[11px] text-ink-4">{t.date}</span>
                  <span className={`font-mono text-sm font-bold ${pnl>=0?'text-sage':'text-crimson'}`}>{fmtPnl(pnl)}</span>
                </div>
              )
            })
          }
        </div>
      </Card>
    </div>
  )
}

// ── CALENDAR ───────────────────────────────────────────
function Calendar({ refresh }) {
  const [year, setYear]   = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [selDay, setSel]  = useState(null)
  const trades = getFilteredTrades()
  const accounts = getAccounts()
  const closed = trades.filter(t => t.status === 'closed')

  const today = new Date().toISOString().slice(0,10)
  const totalPnl = closed.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0)
  const wins  = closed.filter(t=>t.outcome==='win')
  const losses= closed.filter(t=>t.outcome==='loss')

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dows   = ['S','M','T','W','T','F','S']
  const first  = new Date(year, month, 1).getDay()
  const days   = new Date(year, month+1, 0).getDate()

  const dayPnl = (ds) =>
    closed.filter(t=>t.date===ds).reduce((s,t)=>s+(parseFloat(t.pnl)||0),0)
  const dayTrades = (ds) => closed.filter(t=>t.date===ds)

  const selTrades = selDay ? dayTrades(selDay) : []
  const selPnl    = selTrades.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0)

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Net P&L"   value={fmtPnl(totalPnl)} accent={totalPnl>=0?'green':'red'} />
        <StatCard label="Trades"    value={closed.length} />
        <StatCard label="Wins"      value={wins.length} accent="green" />
        <StatCard label="Losses"    value={losses.length} accent="red" />
      </div>

      <Card>
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cream-3">
          <button onClick={() => { if (month===0){setMonth(11);setYear(y=>y-1)} else setMonth(m=>m-1) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cream-2 border border-cream-3 hover:border-gold-2/30 text-ink-3 transition-colors">‹</button>
          <span className="font-mono text-base font-bold tracking-widest text-ink">{months[month]} {year}</span>
          <button onClick={() => { if (month===11){setMonth(0);setYear(y=>y+1)} else setMonth(m=>m+1) }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-cream-2 border border-cream-3 hover:border-gold-2/30 text-ink-3 transition-colors">›</button>
        </div>
        <div className="p-3">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dows.map((d,i) => <div key={i} className="text-center text-[9px] font-mono text-ink-4 py-1">{d}</div>)}
          </div>
          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array(first).fill(null).map((_,i) => <div key={`e${i}`} />)}
            {Array(days).fill(null).map((_,i) => {
              const d   = i + 1
              const ds  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
              const pnl = dayPnl(ds)
              const cnt = dayTrades(ds).length
              const isT = ds === today
              const isS = ds === selDay
              return (
                <div key={d} onClick={() => setSel(isS ? null : ds)}
                  className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl cursor-pointer border transition-all duration-150 p-1
                    ${isS ? 'border-gold-2 bg-gold-2/10' : isT ? 'border-gold-2/50 bg-gold-2/5' : cnt > 0 ? pnl >= 0 ? 'border-sage/30 bg-sage/5' : 'border-crimson/30 bg-crimson/5' : 'border-cream-3 hover:border-gold-2/20 hover:bg-cream-2'}`}>
                  <span className="font-mono text-xs text-ink-2">{d}</span>
                  {cnt > 0 && <span className={`font-mono text-[9px] font-bold ${pnl>=0?'text-sage':'text-crimson'}`}>{pnl>=0?'+':''}{(pnl/1000).toFixed(1)}K</span>}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {selDay && (
        <Card>
          <CardHeader title={selDay} badge={`${fmtPnl(selPnl)}`} />
          <CardBody>
            {selTrades.length === 0
              ? <p className="text-ink-4 font-mono text-xs">No trades on {selDay}</p>
              : selTrades.map(t => {
                const pnl = parseFloat(t.pnl)||0
                return (
                  <div key={t.id} className="flex items-center gap-3 py-2 border-b border-cream-3 last:border-0">
                    <span className="font-mono text-sm font-bold text-ink">{t.instrument}</span>
                    <span className={`badge ${t.dir==='long'?'badge-green':'badge-red'}`}>{t.dir==='long'?'LONG':'SHORT'}</span>
                    <span className="text-xs text-ink-4 flex-1">{t.setup}</span>
                    <span className={`font-mono text-sm font-bold ${pnl>=0?'text-sage':'text-crimson'}`}>{fmtPnl(pnl)}</span>
                  </div>
                )
              })
            }
          </CardBody>
        </Card>
      )}
    </div>
  )
}

// ── ANALYTICS ──────────────────────────────────────────
function Analytics({ refresh }) {
  const trades  = getFilteredTrades()
  const closed  = trades.filter(t => t.status === 'closed')
  const wins    = closed.filter(t => t.outcome === 'win')
  const losses  = closed.filter(t => t.outcome === 'loss')
  const totalPnl = closed.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0)
  const gW = wins.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0)
  const gL = Math.abs(losses.reduce((s,t)=>s+(parseFloat(t.pnl)||0),0))
  const pf = gL>0?(gW/gL).toFixed(2):'∞'
  const wr = closed.length?Math.round(wins.length/closed.length*100):0
  const avgWin  = wins.length ? (gW/wins.length).toFixed(0) : 0
  const avgLoss = losses.length ? (gL/losses.length).toFixed(0) : 0

  // Equity curve
  const equity = [0]
  closed.forEach(t => equity.push(equity[equity.length-1] + (parseFloat(t.pnl)||0)))

  // By instrument
  const byInst = {}
  closed.forEach(t => { byInst[t.instrument] = (byInst[t.instrument]||0) + (parseFloat(t.pnl)||0) })

  // By day of week
  const byDow = [0,0,0,0,0]
  closed.forEach(t => {
    const d = new Date(t.date+'T12:00:00').getDay()
    const idx = [1,2,3,4,5].indexOf(d)
    if (idx >= 0) byDow[idx] += (parseFloat(t.pnl)||0)
  })

  const green = 'rgba(45,107,74,0.5)'
  const red   = 'rgba(139,32,32,0.5)'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Net P&L"      value={fmtPnl(totalPnl)} accent={totalPnl>=0?'green':'red'} sub={`${wr}% win rate`} />
        <StatCard label="Profit Factor" value={pf} accent="gold" />
        <StatCard label="Avg Win"       value={`+$${avgWin}`} accent="green" sub="per winner" />
        <StatCard label="Avg Loss"      value={`-$${avgLoss}`} accent="red" sub="per loser" />
      </div>

      {closed.length > 1 && (
        <>
          <Card>
            <CardHeader title="Equity Curve" />
            <CardBody>
              <div className="h-48">
                <Line
                  data={{
                    labels: equity.map((_,i) => i),
                    datasets: [{
                      data: equity,
                      borderColor: totalPnl >= 0 ? '#2D6B4A' : '#8B2020',
                      backgroundColor: totalPnl >= 0 ? 'rgba(45,107,74,0.07)' : 'rgba(139,32,32,0.07)',
                      borderWidth: 2, fill: true, tension: 0.3, pointRadius: 0
                    }]
                  }}
                  options={{ ...CHART_OPTS, maintainAspectRatio: false }}
                />
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader title="P&L by Day of Week" />
              <CardBody>
                <div className="h-40">
                  <Bar
                    data={{
                      labels: ['Mon','Tue','Wed','Thu','Fri'],
                      datasets: [{
                        data: byDow,
                        backgroundColor: byDow.map(v => v >= 0 ? green : red),
                        borderColor: byDow.map(v => v >= 0 ? '#2D6B4A' : '#8B2020'),
                        borderWidth: 1, borderRadius: 4
                      }]
                    }}
                    options={{ ...CHART_OPTS, maintainAspectRatio: false }}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="P&L by Instrument" />
              <CardBody>
                <div className="h-40">
                  <Bar
                    data={{
                      labels: Object.keys(byInst),
                      datasets: [{
                        data: Object.values(byInst),
                        backgroundColor: Object.values(byInst).map(v => v >= 0 ? green : red),
                        borderColor: Object.values(byInst).map(v => v >= 0 ? '#2D6B4A' : '#8B2020'),
                        borderWidth: 1, borderRadius: 4
                      }]
                    }}
                    options={{ ...CHART_OPTS, indexAxis: 'y', maintainAspectRatio: false }}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {closed.length === 0 && (
        <div className="text-center py-16 text-ink-4 font-mono text-xs">Log some trades to see analytics</div>
      )}
    </div>
  )
}

// ── MAIN TRACK TAB ─────────────────────────────────────
export default function Track({ refresh }) {
  const [sub, setSub] = useState('portfolio')
  return (
    <div className="fade-up">
      <SubTabs active={sub} onChange={setSub} />
      {sub === 'portfolio' && <Portfolio refresh={refresh} />}
      {sub === 'calendar'  && <Calendar  refresh={refresh} />}
      {sub === 'analytics' && <Analytics refresh={refresh} />}
    </div>
  )
}
