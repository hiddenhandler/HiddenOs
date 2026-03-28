import { useState, useRef } from 'react'
import { Card, CardHeader, CardBody, CheckItem, TradeCard, Alert, SectionTitle } from '../ui/index'
import { toast } from '../ui/index'
import { addTrade, updateTrade, getTrades, setTrades, getAccounts, getActiveAcc, todayStr } from '../../lib/db'
import { CHECKLIST, INSTRUMENTS, SETUPS, HTF_OPTIONS, HTF_POI_OPTIONS, LTF_OPTIONS, LTF_POI_OPTIONS, EXEC_3M_OPTIONS, EMOTION_OPTIONS } from '../../data/constants'

function calcRR(entry, sl, tp) {
  if (!entry || !sl || !tp || entry === sl) return null
  const risk = Math.abs(entry - sl)
  const rwd  = Math.abs(tp - entry)
  return (rwd / risk).toFixed(2)
}

const EMPTY_FORM = {
  instrument: 'US30', dir: 'long', entry: '', sl: '', tp: '', size: '',
  setup: '', htf: '', htfpoi: '', ltf: '', ltfpoi: '', exec3m: '', emotion: '',
  story: '', account: '', photos: [],
}

export default function Trade({ refresh }) {
  const accounts = getAccounts()
  const activeAcc = getActiveAcc()
  const [form, setForm]       = useState({ ...EMPTY_FORM, account: activeAcc !== 'all' ? activeAcc : accounts[0]?.id || '' })
  const [checks, setChecks]   = useState({})
  const [clForm, setClForm]   = useState({ id: '', exit: '', outcome: 'win', pnl: '', notes: '' })
  const [filter, setFilter]   = useState('all')
  const [showImport, setShowImport] = useState(false)
  const fileRef = useRef()

  const allTrades = getTrades()
  const openTrades = allTrades.filter(t => t.status === 'open')
  const rr = calcRR(parseFloat(form.entry), parseFloat(form.sl), parseFloat(form.tp))
  const doneCount = CHECKLIST.filter(i => checks[i.id]).length

  const filtered = allTrades.filter(t => {
    if (filter === 'open') return t.status === 'open'
    if (filter === 'win')  return t.outcome === 'win'
    if (filter === 'loss') return t.outcome === 'loss'
    return true
  }).slice().reverse()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 4)
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader()
      r.onload = e => res(e.target.result)
      r.readAsDataURL(f)
    }))
    Promise.all(readers).then(imgs => set('photos', imgs))
  }

  const logTrade = () => {
    if (!form.entry || !form.sl || !form.tp) { toast('Entry, SL & TP required', 'warn'); return }
    if (doneCount < CHECKLIST.length) { toast('Complete all checklist items first', 'warn'); return }
    const t = {
      id: Date.now().toString(), ts: new Date().toISOString(), date: todayStr(),
      status: 'open', outcome: null, pnl: null, exit: null, closedAt: null,
      ...form,
    }
    addTrade(t)
    setForm({ ...EMPTY_FORM, account: form.account })
    setChecks({})
    refresh()
    toast('✓ Trade logged')
  }

  const closeTrade = () => {
    if (!clForm.id || !clForm.exit) { toast('Select trade and enter exit price', 'warn'); return }
    updateTrade(clForm.id, {
      status: 'closed', exit: clForm.exit, outcome: clForm.outcome,
      pnl: parseFloat(clForm.pnl) || 0, notes: clForm.notes, closedAt: new Date().toISOString()
    })
    setClForm({ id: '', exit: '', outcome: 'win', pnl: '', notes: '' })
    refresh()
    toast('✓ Trade closed')
  }

  const exportCSV = () => {
    const header = 'ACCOUNT,SYMBOL,DIRECTION,OPEN DATE,CLOSE DATE,ENTRY PRICE,EXIT PRICE,STOP LOSS,TAKE PROFIT,PnL ($),OUTCOME,SETUP TYPE,NOTES\n'
    const rows = getTrades().map(t =>
      [t.account||'', t.instrument||'', t.dir==='long'?'BUY':'SELL', t.date||'',
       t.closedAt?.split('T')[0]||'', t.entry||'', t.exit||'', t.sl||'', t.tp||'',
       t.pnl||'', t.outcome||'', (t.setup||'').replace(/,/g,' '), (t.notes||'').replace(/,/g,' ')]
      .join(',')
    ).join('\n')
    const blob = new Blob([header+rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `HiddenOS_Export_${todayStr()}.csv`
    a.click()
    toast('✓ Exported')
  }

  return (
    <div className="fade-up space-y-4">
      {/* Log New Trade */}
      <Card>
        <CardHeader title="Log New Trade" badge="SAVES LOCALLY" />
        <CardBody className="space-y-4">
          {/* Basic fields */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div><label className="label">Instrument</label>
              <select className="input" value={form.instrument} onChange={e => set('instrument', e.target.value)}>
                {INSTRUMENTS.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div><label className="label">Direction</label>
              <select className="input" value={form.dir} onChange={e => set('dir', e.target.value)}>
                <option value="long">Long 📈</option>
                <option value="short">Short 📉</option>
              </select>
            </div>
            <div><label className="label">Account</label>
              <select className="input" value={form.account} onChange={e => set('account', e.target.value)}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div><label className="label">Entry Price</label>
              <input className="input" type="number" step="0.01" value={form.entry} onChange={e => set('entry', e.target.value)} placeholder="47520" />
            </div>
            <div><label className="label">Stop Loss</label>
              <input className="input" type="number" step="0.01" value={form.sl} onChange={e => set('sl', e.target.value)} placeholder="47438" />
            </div>
            <div><label className="label">Take Profit</label>
              <input className="input" type="number" step="0.01" value={form.tp} onChange={e => set('tp', e.target.value)} placeholder="47706" />
            </div>
            <div><label className="label">Size ($Risk)</label>
              <input className="input" type="number" value={form.size} onChange={e => set('size', e.target.value)} placeholder="500" />
            </div>
          </div>

          {/* Setup type */}
          <div><label className="label">Setup Type</label>
            <select className="input" value={form.setup} onChange={e => set('setup', e.target.value)}>
              <option value="">— Select Setup —</option>
              {Object.entries(SETUPS).map(([group, items]) => (
                <optgroup key={group} label={`── ${group} ──`}>
                  {items.map(s => <option key={s}>{s}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* HTF / LTF */}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">HTF Alignment</label>
              <select className="input" value={form.htf} onChange={e => set('htf', e.target.value)}>
                <option value="">—</option>
                {HTF_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="label">HTF POI</label>
              <select className="input" value={form.htfpoi} onChange={e => set('htfpoi', e.target.value)}>
                <option value="">—</option>
                {HTF_POI_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="label">LTF Alignment</label>
              <select className="input" value={form.ltf} onChange={e => set('ltf', e.target.value)}>
                <option value="">—</option>
                {LTF_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="label">LTF POI</label>
              <select className="input" value={form.ltfpoi} onChange={e => set('ltfpoi', e.target.value)}>
                <option value="">—</option>
                {LTF_POI_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="label">3M Execution</label>
              <select className="input" value={form.exec3m} onChange={e => set('exec3m', e.target.value)}>
                <option value="">—</option>
                {EXEC_3M_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div><label className="label">Emotion at Entry</label>
              <select className="input" value={form.emotion} onChange={e => set('emotion', e.target.value)}>
                <option value="">—</option>
                {EMOTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Story */}
          <div><label className="label">Setup Story</label>
            <textarea className="input min-h-[72px] resize-y" value={form.story} onChange={e => set('story', e.target.value)}
              placeholder="Wyckoff phase? HTF POI reached? LTF ChoCh/BOS? 3M in-out candle? News context?" />
          </div>

          {/* RR Box */}
          {form.entry && form.sl && form.tp && (
            <div className="flex items-center justify-between p-4 bg-cream-2 border border-cream-3 rounded-xl">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-4 mb-1">Risk : Reward</div>
                <div className="text-sm text-ink-3">
                  Risk {Math.abs(parseFloat(form.entry)-parseFloat(form.sl)).toFixed(1)} pts · Reward {Math.abs(parseFloat(form.tp)-parseFloat(form.entry)).toFixed(1)} pts
                </div>
              </div>
              <div className={`font-mono text-3xl font-bold ${rr >= 2 ? 'text-sage' : rr >= 1.5 ? 'text-gold-2' : 'text-crimson'}`}>
                1:{rr}
              </div>
            </div>
          )}

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Pre-Trade Checklist</label>
              <span className="badge badge-gray">{doneCount}/{CHECKLIST.length}</span>
            </div>
            {CHECKLIST.map(item => (
              <CheckItem key={item.id} checked={!!checks[item.id]} text={item.text} note={item.note}
                onToggle={() => setChecks(c => ({ ...c, [item.id]: !c[item.id] }))} />
            ))}
          </div>

          {/* Photos */}
          <div>
            <label className="label">Chart Screenshots (up to 4)</label>
            <div className="border-2 border-dashed border-cream-4 rounded-xl p-5 text-center cursor-pointer hover:border-gold-2/40 hover:bg-gold-2/3 transition-all"
              onClick={() => fileRef.current?.click()}>
              <div className="text-2xl mb-1">📷</div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-4">Tap to upload screenshots</div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
            </div>
            {form.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {form.photos.map((p, i) => <img key={i} src={p} alt="" className="rounded-xl border border-cream-3 object-cover h-24 w-full" />)}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={logTrade} className="btn-gold flex-1">LOG TRADE</button>
            <button onClick={() => { setForm({ ...EMPTY_FORM, account: form.account }); setChecks({}) }} className="btn-secondary">Clear</button>
          </div>
        </CardBody>
      </Card>

      {/* Close Open Trade */}
      {openTrades.length > 0 && (
        <Card>
          <CardHeader title="Close Open Trade" />
          <CardBody className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Open Trade</label>
                <select className="input" value={clForm.id} onChange={e => setClForm(f => ({...f, id: e.target.value}))}>
                  <option value="">— Pick trade —</option>
                  {openTrades.map(t => <option key={t.id} value={t.id}>{t.instrument} {t.dir.toUpperCase()} @ {t.entry} ({t.date})</option>)}
                </select>
              </div>
              <div><label className="label">Exit Price</label>
                <input className="input" type="number" step="0.01" value={clForm.exit} onChange={e => setClForm(f => ({...f, exit: e.target.value}))} />
              </div>
              <div><label className="label">Outcome</label>
                <select className="input" value={clForm.outcome} onChange={e => setClForm(f => ({...f, outcome: e.target.value}))}>
                  <option value="win">✅ Win</option>
                  <option value="loss">❌ Loss</option>
                  <option value="be">⚪ Breakeven</option>
                </select>
              </div>
              <div><label className="label">Actual P&L ($)</label>
                <input className="input" type="number" step="0.01" value={clForm.pnl} onChange={e => setClForm(f => ({...f, pnl: e.target.value}))} />
              </div>
            </div>
            <div><label className="label">Post-Trade Notes</label>
              <textarea className="input" value={clForm.notes} onChange={e => setClForm(f => ({...f, notes: e.target.value}))} placeholder="What happened? News reaction as expected?" />
            </div>
            <button onClick={closeTrade} className="btn-primary w-full">CLOSE TRADE</button>
          </CardBody>
        </Card>
      )}

      {/* Trade History */}
      <Card>
        <CardHeader title="Trade History" badge={String(allTrades.length)}
          right={
            <select className="input py-1 text-xs w-24" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="win">Wins</option>
              <option value="loss">Losses</option>
            </select>
          }
        />
        <CardBody>
          {filtered.length === 0
            ? <p className="text-center text-ink-4 font-mono text-xs py-8">No trades</p>
            : filtered.map(t => <TradeCard key={t.id} trade={t} />)
          }
        </CardBody>
      </Card>

      {/* Import / Export */}
      <Card>
        <CardHeader title="Import / Export" badge="CSV"
          right={<button onClick={() => setShowImport(!showImport)} className="text-ink-4 text-lg leading-none">{showImport ? '▲' : '▼'}</button>}
        />
        {showImport && (
          <CardBody>
            <div className="flex gap-2 flex-wrap">
              <button onClick={exportCSV} className="btn-secondary text-xs">⬆ Export All Trades</button>
              <button onClick={() => {
                const h = 'ACCOUNT,SYMBOL,DIRECTION,OPEN DATE,CLOSE DATE,ENTRY PRICE,EXIT PRICE,STOP LOSS,TAKE PROFIT,PnL ($),OUTCOME,SETUP TYPE,NOTES\n'
                const ex = 'Funded Hive,US30,BUY,2026-03-14,2026-03-14,47320.50,47480.25,47210.00,47600.00,319.50,WIN,ChoCh+FVG+EQ,Clean 4H OB entry\n'
                const blob = new Blob([h+ex], { type: 'text/csv' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = 'HiddenOS_Import_Template.csv'
                a.click()
                toast('✓ Template downloaded')
              }} className="btn-secondary text-xs">⬇ Download Template</button>
            </div>
          </CardBody>
        )}
      </Card>
    </div>
  )
}
