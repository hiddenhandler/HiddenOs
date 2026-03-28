import { Routes, Route } from 'react-router-dom'
import { useAppState } from './hooks/useAppState'
import Header      from './components/ui/Header'
import { TopNav, BottomNav } from './components/ui/Nav'
import AccountBar  from './components/ui/AccountBar'
import { ToastContainer } from './components/ui/index'
import Dashboard   from './components/tabs/Dashboard'
import Trade       from './components/tabs/Trade'
import Track       from './components/tabs/Track'
import Log         from './components/tabs/Log'
import Knowledge   from './components/tabs/Knowledge'

export default function App() {
  const { activeAcc, accounts, trades, theme, refresh, switchAccount, toggleTheme } = useAppState()

  return (
    <div className="min-h-screen bg-cream font-sans">
      <Header trades={trades} theme={theme} onToggleTheme={toggleTheme} />
      <TopNav />
      <AccountBar
        accounts={accounts}
        activeAcc={activeAcc}
        onSwitch={switchAccount}
        onRefresh={refresh}
      />

      <main className="max-w-4xl mx-auto px-4 py-5 pb-24 sm:pb-8">
        <Routes>
          <Route path="/"          element={<Dashboard  refresh={refresh} />} />
          <Route path="/trade"     element={<Trade      refresh={refresh} />} />
          <Route path="/track"     element={<Track      refresh={refresh} />} />
          <Route path="/log"       element={<Log        refresh={refresh} />} />
          <Route path="/knowledge" element={<Knowledge               />} />
        </Routes>
      </main>

      <BottomNav />
      <ToastContainer />
    </div>
  )
}
