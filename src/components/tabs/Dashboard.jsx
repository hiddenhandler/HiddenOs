import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, StatCard, Alert, CheckItem, PillSelect, SectionTitle, TradeCard } from '../ui/index'
import { getDailyLog, setDailyLog, getMacro, getQNotes, addQNote, deleteQNote, todayStr, fmtDate, calcStats, getFilteredTrades } from '../../lib/db'
import { CHECKLIST, MOODS, MOOD_ALERTS } from '../../data/constants'
import { toast } from '../ui/index'
import { ProgressBar } from '../ui/index'

export default function Dashboard({ refresh }) {
  const today   = todayStr()
  const [log, setLog]     = useState(() => getDailyLog(today))
  const [qNote, setQNote] = useState('')
  const [qNotes, setQNotes] = useState(getQNotes)
  const [trades, setTrades] = useState(getFilteredTrades)

  useEffect(() => {
    setTrades(getFilteredTrades())
    setQNotes(getQNotes())
  }, [refresh])

  const saveLog = (patch) => {
    const updated = { ...log, ...patch }
    setLog(updated)
    setDailyLog(today, updated)
  }

  const toggleCheck = (id) => {
    const cl = { ...(log.checklist || {}), [id]: !log.checklist?.[id] }
    saveLog({ checklist: cl })
  }

  const doneCount = CHECKLIST.filter(i => log.checklist?.[i.id]).length

  const saveNote = () => {
    if (!qNote.trim()) return
    const n = { id: Date.now(), dt: today, text: qNote }
    addQNote(n)
    setQNotes(getQNotes())
    setQNote('')
    toast('✓ Note saved')
  }

  const delNote = (id) => {
    deleteQNote(id)
    setQNotes(getQNotes())
  }

  const macro = getMacro(today)
  const stats = calcStats(trades)
  const todayLosses = trades.filter(t => t.date === today && t.outcome === 'loss').length

  const moodAlert = log.mood ? MOOD_ALERTS[log.mood] : null
  const bestTrade  = stats.closed.reduce((b, t) => (parseFloat(t.pnl)||0) > (parseFloat(b?.pnl)||0) ? t : b, null)
  const worstTrade = stats.closed.reduce((w, t) => (parseFloat(t.pnl)||0) < (parseFloat(w?.pnl)||0) ? t : w, null)

  return (
    <div className="fade-up space-y-4">
      {/* Day alerts */}
      {todayLosses >= 3 && <Alert type="error">🚨 3 LOSSES TODAY — SESSION OVER. Close TradingView now.</Alert>}
      {todayLosses === 2 && <Alert type="warn">⚠️ 2 losses today. Next loss = session over.</Alert>}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total P&L"     value={`${stats.totalPnl >= 0 ? '+' : ''}$${Math.abs(stats.totalPnl).toFixed(0)}`} sub={`${stats.closed.length} trades`} accent={stats.totalPnl >= 0 ? 'gold' : 'red'} />
        <StatCard label="Win Rate"      value={`${stats.wr}%`}  sub={`${stats.wins.length}W / ${stats.losses.length}L`} accent="green" />
        <StatCard label="Profit Factor" value={stats.pf}        sub="Gross W÷L" accent="gold" />
        <StatCard label="Open"          value={stats.open.length} sub="positions" accent="blue" />
        <StatCard label="Best Trade"    value={bestTrade ? `+$${Math.abs(parseFloat(bestTrade.pnl)).toFixed(0)}` : '$0'} sub={bestTrade?.instrument || '—'} accent="green" />
        <StatCard label="Worst Trade"   value={worstTrade ? `-$${Math.abs(parseFloat(worstTrade.pnl)).toFixed(0)}` : '$0'} sub={worstTrade?.instrument || '—'} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Plan */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Today's Plan" badge={fmtDate(today)} />
            <CardBody className="space-y-4">
              <div>
                <label className="label">Session Bias</label>
                <select
                  className="input"
                  value={log.bias || ''}
                  onChange={e => saveLog({ bias: e.target.value })}
                >
                  <option value="">— Select —</option>
                  <option>🟢 Bullish — Long bias</option>
                  <option>🔴 Bearish — Short bias</option>
                  <option>🔵 Range — Wait for break</option>
                  <option>📰 News Day — Spec/Reaction</option>
                  <option>⚠️ No Trade Day</option>
                </select>
              </div>
              <div>
                <label className="label">Gameplan</label>
                <textarea
                  className="input min-h-[80px] resize-y"
                  value={log.gameplan || ''}
                  onChange={e => saveLog({ gameplan: e.target.value })}
                  placeholder="Setup? Key levels? News events? Speculation thesis?"
                />
              </div>
              <div>
                <label className="label">Emotional State</label>
                <PillSelect
                  options={MOODS}
                  value={log.mood || ''}
                  onChange={v => saveLog({ mood: v })}
                />
                {moodAlert && (
                  <div className="mt-2">
                    <Alert type={moodAlert.type === 'error' ? 'error' : 'warn'}>{moodAlert.msg}</Alert>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Quick Notes */}
          <Card>
            <CardHeader title="Quick Notes" />
            <CardBody>
              <div className="flex gap-2 mb-3">
                <input
                  className="input flex-1"
                  value={qNote}
                  onChange={e => setQNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveNote()}
                  placeholder="Level to watch, news observation..."
                />
                <button onClick={saveNote} className="btn-gold whitespace-nowrap">Save</button>
              </div>
              {qNotes.slice(0, 4).map(n => (
                <div key={n.id} className="flex gap-2 items-start p-3 bg-cream-2 border border-cream-3 border-l-2 border-l-gold-2 rounded-r-xl rounded-l-none mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-ink-4 mb-0.5">{n.dt}</div>
                    <div className="text-sm text-ink-2">{n.text}</div>
                  </div>
                  <button onClick={() => delNote(n.id)} className="text-ink-4 hover:text-crimson text-xs mt-0.5">×</button>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pre-trade Checklist */}
          <Card>
            <CardHeader title="Pre-Trade Checklist" badge={`${doneCount}/${CHECKLIST.length}`} />
            <CardBody>
              <div className="mb-3">
                <ProgressBar pct={(doneCount / CHECKLIST.length) * 100} />
              </div>
              {CHECKLIST.map(item => (
                <CheckItem
                  key={item.id}
                  checked={!!log.checklist?.[item.id]}
                  text={item.text}
                  note={item.note}
                  onToggle={() => toggleCheck(item.id)}
                />
              ))}
            </CardBody>
          </Card>

          {/* Macro Snapshot */}
          <Card>
            <CardHeader title="Macro Snapshot" badge="TODAY" />
            <CardBody>
              {macro.bias || macro.spec || macro.sum ? (
                <div className="space-y-2">
                  {macro.bias && (
                    <div>
                      <div className="label">Bias</div>
                      <div className="text-sm font-semibold text-ink-2">{macro.bias}</div>
                    </div>
                  )}
                  {macro.event && (
                    <div>
                      <div className="label">Key Event</div>
                      <div className="text-sm text-gold-2 font-medium">{macro.event}</div>
                    </div>
                  )}
                  {macro.spec && (
                    <div>
                      <div className="label">Speculation</div>
                      <div className="text-sm text-ink-2">{macro.spec}</div>
                    </div>
                  )}
                  {macro.sum && (
                    <div className="p-3 bg-cream-2 rounded-xl text-sm text-ink-3 leading-relaxed">{macro.sum}</div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-ink-4 font-mono">No macro saved today. Go to Log → Macro tab.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader title="Recent Trades" badge={String(trades.length)} />
        <CardBody>
          {trades.length === 0 ? (
            <p className="text-center text-ink-4 font-mono text-xs py-8">No trades logged yet</p>
          ) : (
            trades.slice(-5).reverse().map(t => <TradeCard key={t.id} trade={t} />)
          )}
        </CardBody>
      </Card>
    </div>
  )
}
