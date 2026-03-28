import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, SectionTitle, Alert } from '../ui/index'
import { toast } from '../ui/index'
import {
  getDailyLog, setDailyLog, getJournal, addJournalEntry, deleteJournalEntry,
  getMacro, setMacro, getFilteredTrades, todayStr, fmtDate, fmtPnl
} from '../../lib/db'
import { CHECKLIST } from '../../data/constants'

function SubTabs({ active, onChange }) {
  const tabs = [
    { id: 'daily',   label: '📆 Daily Log' },
    { id: 'journal', label: '📓 Journal' },
    { id: 'macro',   label: '🌍 Macro' },
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

// ── DAILY LOG ──────────────────────────────────────────
function DailyLog({ refresh }) {
  const [date, setDate]   = useState(todayStr())
  const [log, setLogState] = useState(() => getDailyLog(todayStr()))
  const trades = getFilteredTrades().filter(t => t.date === date && t.status === 'closed')
  const pnl    = trades.reduce((s, t) => s + (parseFloat(t.pnl) || 0), 0)
  const wins   = trades.filter(t => t.outcome === 'win').length
  const doneCount = CHECKLIST.filter(i => log.checklist?.[i.id]).length

  const load = (d) => {
    setDate(d)
    setLogState(getDailyLog(d))
  }

  const toggleCheck = (id) => {
    const cl = { ...(log.checklist || {}), [id]: !log.checklist?.[id] }
    const updated = { ...log, checklist: cl }
    setLogState(updated)
    setDailyLog(date, updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="label">Select Date</label>
          <input type="date" className="input" value={date} onChange={e => load(e.target.value)} />
        </div>
        <button onClick={() => load(todayStr())} className="btn-secondary whitespace-nowrap">Today</button>
      </div>

      {/* Day summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-[9px] font-mono text-ink-4 uppercase tracking-wide mb-1">Day P&L</div>
          <div className={`font-mono text-xl font-bold ${pnl >= 0 ? 'text-sage' : 'text-crimson'}`}>{fmtPnl(pnl)}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-[9px] font-mono text-ink-4 uppercase tracking-wide mb-1">Trades</div>
          <div className="font-mono text-xl font-bold text-ink">{trades.length}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-[9px] font-mono text-ink-4 uppercase tracking-wide mb-1">W / L</div>
          <div className="font-mono text-xl font-bold text-ink">{wins}W / {trades.length - wins}L</div>
        </div>
      </div>

      {/* Checklist */}
      <Card>
        <CardHeader title="Checklist" badge={`${doneCount}/${CHECKLIST.length}`} />
        <CardBody>
          {CHECKLIST.map(item => (
            <div key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all mb-1.5
                ${log.checklist?.[item.id] ? 'bg-sage/5 border-sage/20' : 'bg-cream-2 border-cream-3 hover:border-gold-2/30'}`}>
              <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5
                ${log.checklist?.[item.id] ? 'bg-sage border-transparent' : 'border-cream-4'}`}>
                {log.checklist?.[item.id] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <div className={`text-sm font-medium ${log.checklist?.[item.id] ? 'line-through text-ink-4' : 'text-ink-2'}`}>{item.text}</div>
                <div className="text-[11px] text-ink-4 mt-0.5">{item.note}</div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Gameplan */}
      <Card>
        <CardHeader title="Gameplan" />
        <CardBody>
          {log.gameplan
            ? <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{log.gameplan}</p>
            : <p className="text-sm text-ink-4 font-mono">No gameplan saved for {fmtDate(date)}.</p>
          }
        </CardBody>
      </Card>

      {/* Trades */}
      {trades.length > 0 && (
        <Card>
          <CardHeader title="Trades" badge={String(trades.length)} />
          <CardBody>
            {trades.map(t => {
              const pnl = parseFloat(t.pnl) || 0
              return (
                <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-cream-3 last:border-0">
                  <span className="font-mono text-sm font-bold text-ink w-20">{t.instrument}</span>
                  <span className={`badge ${t.dir === 'long' ? 'badge-green' : 'badge-red'}`}>{t.dir === 'long' ? 'LONG' : 'SHORT'}</span>
                  <span className="text-xs text-ink-4 flex-1 truncate">{t.setup}</span>
                  <span className={`font-mono text-sm font-bold ${pnl >= 0 ? 'text-sage' : 'text-crimson'}`}>{fmtPnl(pnl)}</span>
                </div>
              )
            })}
          </CardBody>
        </Card>
      )}
    </div>
  )
}

// ── JOURNAL ────────────────────────────────────────────
function Journal({ refresh }) {
  const [entries, setEntries] = useState(getJournal)
  const [form, setForm] = useState({ text: '', lesson: '', emo: '', comp: '✅ Full', res: '🟢 Green day' })

  const save = () => {
    if (!form.text.trim()) { toast('Entry required', 'warn'); return }
    addJournalEntry({ id: Date.now(), dt: new Date().toISOString(), ...form })
    setEntries(getJournal())
    setForm({ text: '', lesson: '', emo: '', comp: '✅ Full', res: '🟢 Green day' })
    toast('✓ Journal entry saved')
  }

  const del = (id) => {
    deleteJournalEntry(id)
    setEntries(getJournal())
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="New Entry" />
        <CardBody className="space-y-3">
          <div>
            <label className="label">What Happened?</label>
            <textarea className="input min-h-[120px] resize-y" value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              placeholder="Session review. Setups taken, skipped. News reaction as expected?" />
          </div>
          <div>
            <label className="label">Key Lesson (one sentence)</label>
            <input className="input" value={form.lesson}
              onChange={e => setForm(f => ({ ...f, lesson: e.target.value }))}
              placeholder="e.g. Waited for 3M in-out candle. LTF ChoCh confirmed HTF POI." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Emotional Rating (1–10)</label>
              <input className="input" type="number" min="1" max="10" value={form.emo}
                onChange={e => setForm(f => ({ ...f, emo: e.target.value }))} placeholder="7" />
            </div>
            <div>
              <label className="label">Rule Compliance</label>
              <select className="input" value={form.comp} onChange={e => setForm(f => ({ ...f, comp: e.target.value }))}>
                <option>✅ Full</option>
                <option>⚠️ Partial</option>
                <option>❌ Poor</option>
              </select>
            </div>
            <div>
              <label className="label">Result</label>
              <select className="input" value={form.res} onChange={e => setForm(f => ({ ...f, res: e.target.value }))}>
                <option>🟢 Green day</option>
                <option>🔴 Red day</option>
                <option>⚪ Breakeven</option>
                <option>📚 Study only</option>
              </select>
            </div>
          </div>
          <button onClick={save} className="btn-gold w-full">SAVE ENTRY</button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Entries" badge={String(entries.length)} />
        <div>
          {entries.length === 0
            ? <p className="text-center text-ink-4 font-mono text-xs py-8">No journal entries yet</p>
            : entries.map(e => (
              <div key={e.id} className="border-l-2 border-l-gold-2 ml-5 mr-5 my-3 pl-4 py-2 bg-cream-2/50 rounded-r-xl">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-ink-4">
                    {new Date(e.dt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="badge badge-gray">{e.res}</span>
                  <span className="badge badge-gray">{e.comp}</span>
                  {e.emo && <span className="badge badge-gold">Emotion: {e.emo}/10</span>}
                  <button onClick={() => del(e.id)} className="ml-auto text-ink-4 hover:text-crimson text-xs transition-colors">×</button>
                </div>
                <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-wrap mb-2">{e.text}</p>
                {e.lesson && (
                  <div className="p-2.5 bg-gold-2/8 border border-gold-2/20 rounded-lg text-sm text-gold-2">
                    → {e.lesson}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </Card>
    </div>
  )
}

// ── MACRO ──────────────────────────────────────────────
function Macro({ refresh }) {
  const today = todayStr()
  const [form, setForm] = useState(() => getMacro(today))
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    setMacro(today, form)
    toast('✓ Macro saved')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Today's Macro Context" badge="SAVED PER DAY" />
        <CardBody className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">DXY Direction</label>
              <select className="input" value={form.dxy || ''} onChange={e => set('dxy', e.target.value)}>
                <option value="">—</option>
                <option>📈 Rising — Headwind for indices</option>
                <option>📉 Falling — Tailwind for indices</option>
                <option>➡️ Flat / Consolidating</option>
              </select>
            </div>
            <div>
              <label className="label">Macro Bias</label>
              <select className="input" value={form.bias || ''} onChange={e => set('bias', e.target.value)}>
                <option value="">—</option>
                <option>🟢 Risk-On</option>
                <option>🔴 Risk-Off</option>
                <option>🔵 Neutral</option>
                <option>📰 News Day</option>
              </select>
            </div>
            <div>
              <label className="label">Key Event Today</label>
              <input className="input" value={form.event || ''} onChange={e => set('event', e.target.value)} placeholder="CPI 8:30AM, NFP, FOMC..." />
            </div>
            <div>
              <label className="label">Speculation Direction</label>
              <select className="input" value={form.spec || ''} onChange={e => set('spec', e.target.value)}>
                <option value="">—</option>
                <option>🟢 Expecting Beat — Long bias</option>
                <option>🔴 Expecting Miss — Short bias</option>
                <option>🟡 Uncertain — Wait for print</option>
                <option>⚡ Volatility play</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Your Macro Analysis</label>
            <textarea className="input min-h-[100px] resize-y" value={form.sum || ''}
              onChange={e => set('sum', e.target.value)}
              placeholder="DXY direction, key events, bias for session, news speculation thesis. Write it like a 7AM briefing." />
          </div>
          <button onClick={save} className="btn-gold w-full">SAVE MACRO</button>
        </CardBody>
      </Card>

      {/* Quick Reference Table */}
      <Card>
        <CardHeader title="Event Quick Reference" badge="CHEATSHEET" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-cream-3">
                {['Event','US30','NAS100','Gold','USD','Action'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-gold-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['🔥 CPI Hot',    '↓','↓↓','↑','↑','Fade rallies. Short on LTF BOS post-sweep.','bear'],
                ['❄️ CPI Cool',   '↑','↑↑','↓','↓','Buy LTF pullback to 5M OB after sweep.','bull'],
                ['💪 NFP Strong', 'Mixed','↓','↓','↑','NAS short after reaction sweep.','bear'],
                ['🩸 NFP Weak',   '↑','↑','↑','↓','Buy dips. LTF ChoCh + BOS entry.','bull'],
                ['🏦 FOMC Hike',  '↓↓','↓↓','Vol','↑↑','Wait 15 min after Powell ends.','bear'],
                ['🏦 FOMC Cut',   '↑↑','↑↑','↑','↓↓','Buy first LTF pullback to 15M OB.','bull'],
                ['📈 DXY Rising', 'Headwind','Headwind','↓','—','Reduce long exposure. Short bias.','bear'],
                ['📉 DXY Falling','Tailwind','Tailwind','↑','—','Long bias. Buy dips at HTF POI.','bull'],
                ['🔴 VIX >25',    '50% size','50% size','↑','↑','Half size. Gold or flat.','bear'],
                ['🌍 Geopolitical','Risk-Off','Risk-Off','↑↑','↑','Sit out indices. Gold at POI only.','bear'],
                ['🗣️ Powell Hawkish','↓','↓','Vol','↑','Flat during speech. Enter 15 min after.','bear'],
                ['🗣️ Powell Dovish','↑↑','↑↑','↑','↓','Buy LTF pullback after euphoria spike.','bull'],
              ].map(([ev, us30, nas, gold, usd, action, dir]) => (
                <tr key={ev} className="border-b border-cream-3/50 hover:bg-cream-2/50 transition-colors">
                  <td className="px-3 py-2 font-medium text-ink-2 whitespace-nowrap">{ev}</td>
                  <td className={`px-3 py-2 font-mono font-bold ${dir==='bull'?'text-sage':'text-crimson'}`}>{us30}</td>
                  <td className={`px-3 py-2 font-mono font-bold ${dir==='bull'?'text-sage':'text-crimson'}`}>{nas}</td>
                  <td className="px-3 py-2 font-mono text-gold-2">{gold}</td>
                  <td className="px-3 py-2 font-mono text-ink-3">{usd}</td>
                  <td className="px-3 py-2 text-ink-4 text-[11px]">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* News Protocol */}
      <Card>
        <CardHeader title="News Trading Protocol" badge="HIDDEN OS" />
        <CardBody className="space-y-3">
          {[
            ['PRE', 'nt-pre', '30–60 MIN BEFORE RELEASE', 'Form your speculation thesis. Mark HTF OB/FVG/iFVG. Define Scenario A (beat) and Scenario B (miss). A pre-news speculation entry requires price to already be at an HTF POI before the release.'],
            ['🚫', 'nt-dur', '15 MIN BEFORE → 2 MIN AFTER — NO ENTRIES', 'Spreads widen. Algos scan for stops. No edge for retail in this window. If you have an open trade, set SL to breakeven and let it ride.'],
            ['RCT', 'nt-post', 'REACTION ENTRY (POST-NEWS) — HIGHEST PROBABILITY', 'Wait for: (1) Initial spike to exhaust. (2) ChoCh on 3M/5M confirming real direction. (3) Pullback to LTF POI. (4) 3M in-out candle at retest. This is the second move — the real direction after liquidity is collected.'],
            ['CNT', 'nt-post', 'POST-NEWS CONTINUATION (15–60 MIN AFTER)', 'After direction confirmed: BOS on 15M confirms continuation. Look for pullbacks to 15M or 5M FVG/OB. Standard HiddenOS execution applies. These are often the cleanest trades of the news day.'],
          ].map(([dot, type, title, desc]) => (
            <div key={title} className={`flex gap-3 pb-3 border-b border-cream-3 last:border-0`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[10px] font-bold
                ${type === 'nt-pre' ? 'bg-gold-2/10 border-2 border-gold-2 text-gold-2'
                  : type === 'nt-dur' ? 'bg-crimson/10 border-2 border-crimson text-crimson'
                  : 'bg-sage/10 border-2 border-sage text-sage'}`}>
                {dot}
              </div>
              <div>
                <div className="font-mono text-[10px] font-bold text-ink mb-1 tracking-wide">{title}</div>
                <p className="text-sm text-ink-3 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}

// ── MAIN LOG TAB ───────────────────────────────────────
export default function Log({ refresh }) {
  const [sub, setSub] = useState('daily')
  return (
    <div className="fade-up">
      <SubTabs active={sub} onChange={setSub} />
      {sub === 'daily'   && <DailyLog refresh={refresh} />}
      {sub === 'journal' && <Journal  refresh={refresh} />}
      {sub === 'macro'   && <Macro    refresh={refresh} />}
    </div>
  )
}
