import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store'
import TabBar from './components/TabBar'
import PinLock from './components/PinLock'
import Welcome from './screens/Welcome'
import Today from './screens/Today'
import Sos from './screens/Sos'
import Slip from './screens/Slip'
import Journey from './screens/Journey'
import Partner from './screens/Partner'
import Settings from './screens/Settings'

const UNLOCK_KEY = 'livre.unlocked'

function Shell() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="mx-auto min-h-screen w-full max-w-[520px] px-5 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <Outlet />
      <TabBar />
    </div>
  )
}

export default function App() {
  const { state } = useStore()
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const el = document.documentElement
    if (state.theme === 'auto') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', state.theme)
  }, [state.theme])

  if (state.pinHash && !unlocked) {
    return (
      <PinLock
        hash={state.pinHash}
        onUnlock={() => {
          try {
            sessionStorage.setItem(UNLOCK_KEY, '1')
          } catch {
            /* ignora */
          }
          setUnlocked(true)
        }}
      />
    )
  }

  if (!state.profile) {
    return (
      <Routes>
        <Route path="*" element={<Welcome />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Today />} />
        <Route path="/jornada" element={<Journey />} />
        <Route path="/parceiro" element={<Partner />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/queda" element={<Slip />} />
      </Route>
      <Route path="/sos" element={<Sos />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
