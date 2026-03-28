import { useState } from 'react'
import { getTrades, getAccIdFromTrade, fmtPnl, getAccounts, setAccounts } from '../../lib/db'
import { Modal } from './index'
import { toast } from './index'

const COLORS = ['#0D8F6E','#C28A1A','#1565C0','#9C27B0','#C04040','#126E87','#7A6848','#E64A19']

export default function AccountBar({ accounts, activeAcc, onSwitch, onRefresh }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState({ id: '', name: '', startBal: '', color: COLORS[0] })
  const trades = getTrades()

  const accPnl = (id) =>
    trades.filter(t => t.status === 'closed' && getAccIdFromTrade(t, accounts) === id)
      .reduce((s,t) => s + (parseFloat(t.pnl)||0), 0)

  const openEdit = (acc) => {
    setForm({ id: acc.id, name: acc.name, startBal: String(acc.startBal), color: acc.color })
    setModalOpen(true)
  }

  const saveAcc = () => {
    if (!form.name.trim()) { toast('Name required', 'warn'); return }
    const accs = getAccounts()
    if (form.id) {
      setAccounts(accs.map(a => a.id === form.id ? { ...a, name: form.name, startBal: parseFloat(form.startBal)||0, color: form.color } : a))
    } else {
      const id = form.name.toLowerCase().replace(/[^a-z0-9]/g,'_') + '_' + Date.now()
      setAccounts([...accs, { id, name: form.name, startBal: parseFloat(form.startBal)||0, color: form.color }])
    }
    setModalOpen(false)
    setForm({ id:'', name:'', startBal:'', color: COLORS[0] })
    onRefresh()
    toast('✓ Account saved')
  }

  const deleteAcc = (id) => {
    setAccounts(getAccounts().filter(a => a.id !== id))
    if (activeAcc === id) onSwitch('all')
    onRefresh()
    toast('Account deleted')
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cream-3 overflow-x-auto no-scrollbar bg-cream-2/50">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-ink-4 flex-shrink-0">Account →</span>

        {/* All pill */}
        <button
          onClick={() => onSwitch('all')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wide transition-all
            ${activeAcc === 'all' ? 'bg-ink-2 border-ink-2 text-cream' : 'border-cream-3 text-ink-4 hover:border-gold-2/30 hover:text-gold-2'}`}
        >
          ALL
        </button>

        {/* Account pills */}
        {accounts.map(acc => {
          const pnl   = accPnl(acc.id)
          const isAct = activeAcc === acc.id
          return (
            <button
              key={acc.id}
              onClick={() => onSwitch(acc.id)}
              style={isAct ? { backgroundColor: acc.color + '20', borderColor: acc.color + '60', color: acc.color } : {}}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wide transition-all
                ${!isAct ? 'border-cream-3 text-ink-4 hover:border-gold-2/30 hover:text-gold-2' : ''}`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: acc.color }} />
              {acc.name}
              {trades.filter(t => getAccIdFromTrade(t, accounts) === acc.id).length > 0 && (
                <span className={pnl >= 0 ? 'text-sage' : 'text-crimson'}>
                  {pnl >= 0 ? '+' : ''}${Math.abs(pnl).toFixed(0)}
                </span>
              )}
            </button>
          )
        })}

        {/* Manage button */}
        <button
          onClick={() => { setForm({ id:'', name:'', startBal:'', color: COLORS[0] }); setModalOpen(true) }}
          className="ml-auto flex-shrink-0 text-[9px] font-mono font-bold uppercase tracking-wide text-ink-4 hover:text-gold-2 border border-cream-3 hover:border-gold-2/30 rounded-lg px-2.5 py-1 transition-colors"
        >
          + Manage
        </button>
      </div>

      {/* Account Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Account Manager">
        <div className="p-5">
          {/* Existing accounts list */}
          <div className="mb-5">
            {accounts.map(acc => {
              const pnl = accPnl(acc.id)
              return (
                <div key={acc.id} className="flex items-center gap-3 p-3 bg-cream-2 border border-cream-3 rounded-xl mb-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: acc.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-bold text-ink">{acc.name}</div>
                    <div className="text-[10px] text-ink-4">Start: ${acc.startBal.toLocaleString()}</div>
                  </div>
                  <span className={`font-mono text-xs font-bold ${pnl >= 0 ? 'text-sage' : 'text-crimson'}`}>{fmtPnl(pnl)}</span>
                  <button onClick={() => openEdit(acc)} className="text-[9px] font-mono font-bold text-gold-2 border border-gold-2/30 rounded-lg px-2 py-1 hover:bg-gold-2/10 transition-colors">EDIT</button>
                  <button onClick={() => deleteAcc(acc.id)} className="text-[9px] font-mono font-bold text-crimson border border-crimson/20 rounded-lg px-2 py-1 hover:bg-crimson/8 transition-colors">×</button>
                </div>
              )
            })}
          </div>

          {/* Add / Edit form */}
          <div className="border border-dashed border-cream-4 rounded-xl p-4">
            <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-gold-2 mb-3">
              {form.id ? 'Edit Account' : 'Add Account'}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label">Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. FTMO 50K" />
              </div>
              <div>
                <label className="label">Starting Balance ($)</label>
                <input className="input" type="number" value={form.startBal} onChange={e => setForm(f => ({...f, startBal: e.target.value}))} placeholder="50000" />
              </div>
            </div>
            <div className="mb-3">
              <label className="label">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm(f => ({...f, color: c}))}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-all ${form.color === c ? 'ring-2 ring-offset-1 ring-gold-2 scale-110' : ''}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveAcc} className="btn-primary flex-1">Save Account</button>
              <button onClick={() => setForm({ id:'', name:'', startBal:'', color: COLORS[0] })} className="btn-secondary">Clear</button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
