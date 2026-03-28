import { useState, useEffect, useCallback } from 'react'
import { getAccounts, getActiveAcc, setActiveAcc, getTrades, getTheme, setTheme } from '../lib/db'

export function useAppState() {
  const [activeAcc, setActiveAccState] = useState(getActiveAcc)
  const [accounts, setAccountsState]   = useState(getAccounts)
  const [trades, setTradesState]        = useState(getTrades)
  const [theme, setThemeState]          = useState(getTheme)
  const [tick, setTick]                 = useState(0)

  // Refresh all data
  const refresh = useCallback(() => {
    setTradesState(getTrades())
    setAccountsState(getAccounts())
    setActiveAccState(getActiveAcc())
    setTick(t => t + 1)
  }, [])

  const switchAccount = useCallback((id) => {
    setActiveAcc(id)
    setActiveAccState(id)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }, [theme])

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return { activeAcc, accounts, trades, theme, refresh, switchAccount, toggleTheme, tick }
}

export function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}
