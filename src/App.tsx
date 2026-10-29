import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store'
import TabBar from './components/TabBar'
import UpdateBanner from './components/UpdateBanner'
import { isUnlocked, markUnlocked } from './lib/pin'
import PinLock from './components/PinLock'
import Welcome from './screens/Welcome'
import Home from './screens/Home'
import Momento from './screens/Momento'
import Pausa from './screens/Pausa'
import Noite from './screens/Noite'
import { BibleHome, BookPage, Reader } from './screens/Bible'
import { PlanList, PlanPage } from './screens/Plans'
import Plano from './screens/Plano'
import Prayer from './screens/Prayer'
import { RestList, RestPlayer } from './screens/Rest'
import Sos from './screens/Sos'
import Slip from './screens/Slip'
import Journey from './screens/Journey'
import Partner from './screens/Partner'
import Semana from './screens/Semana'
import Settings from './screens/Settings'
import Sobre from './screens/Sobre'
import Trail from './screens/Trail'
import Lesson from './screens/Lesson'
import { ArticlePage, TopicList, TopicPage } from './screens/Topics'

function Shell() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="min-h-screen w-full px-5 pb-32 md:pb-16 md:pl-60 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div key={pathname} className="fade-up mx-auto w-full max-w-[520px] md:max-w-[680px] md:px-8">
        <Outlet />
      </div>
      <TabBar />
      <UpdateBanner />
    </div>
  )
}

export default function App() {
  const { state } = useStore()
  const [, force] = useState(0)
  const unlocked = isUnlocked()

  useEffect(() => {
    const el = document.documentElement
    if (state.theme === 'auto') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', state.theme)
  }, [state.theme])

  // Modo discreto: nome e ícone neutros na aba do navegador.
  useEffect(() => {
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (state.discreet) {
      document.title = 'Notas'
      if (icon) icon.href = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#8a8a8a"/><path d="M18 22h28M18 32h28M18 42h18" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>')
    } else {
      document.title = 'Livre'
      if (icon) icon.href = '/favicon.svg'
    }
  }, [state.discreet])

  if (state.pinHash && !unlocked) {
    return (
      <PinLock
        hash={state.pinHash}
        onUnlock={() => {
          markUnlocked()
          force((n) => n + 1)
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
        <Route path="/" element={<Home />} />
        <Route path="/momento" element={<Momento />} />
        <Route path="/pausa" element={<Pausa />} />
        <Route path="/noite" element={<Noite />} />
        <Route path="/ler" element={<Navigate to="/biblia" replace />} />
        <Route path="/devocional" element={<Navigate to="/momento" replace />} />
        <Route path="/agora/:m" element={<Navigate to="/momento" replace />} />
        <Route path="/biblia" element={<BibleHome />} />
        <Route path="/biblia/:book" element={<BookPage />} />
        <Route path="/biblia/:book/:chapter" element={<Reader />} />
        <Route path="/planos" element={<PlanList />} />
        <Route path="/planos/:id" element={<PlanPage />} />
        <Route path="/orar" element={<Prayer />} />
        <Route path="/descanso" element={<RestList />} />
        <Route path="/descanso/:id" element={<RestPlayer />} />
        <Route path="/trilha" element={<Trail />} />
        <Route path="/trilha/:n" element={<Lesson />} />
        <Route path="/plano" element={<Plano />} />
        <Route path="/jornada" element={<Journey />} />
        <Route path="/temas" element={<TopicList />} />
        <Route path="/temas/:id" element={<TopicPage />} />
        <Route path="/temas/:id/:article" element={<ArticlePage />} />
        <Route path="/parceiro" element={<Partner />} />
        <Route path="/parceiro/semana" element={<Semana />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/queda" element={<Slip />} />
      </Route>
      <Route path="/sos" element={<Sos />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
