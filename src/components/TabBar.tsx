import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
)

interface Tab { to: string; label: string; icon: ReactNode; match: string[] }

const tabs: (Tab | null)[] = [
  { to: '/', label: 'Início', match: ['/', '/momento', '/pausa', '/noite'], icon: <Icon><path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></Icon> },
  { to: '/biblia', label: 'Bíblia', match: ['/biblia', '/planos', '/orar', '/descanso'], icon: <Icon><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M9 8h6" /></Icon> },
  null,
  { to: '/trilha', label: 'Trilhas', match: ['/trilha', '/plano', '/jornada', '/temas', '/queda', '/ajustes', '/sobre'], icon: <Icon><path d="M4 19c0-5 4-5 8-7s4-4 8-7" /><circle cx="5" cy="19" r="1.5" /><circle cx="19" cy="5" r="1.5" /></Icon> },
  { to: '/parceiro', label: 'Parceiro', match: ['/parceiro'], icon: <Icon><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4c1.8.8 3 2.6 3 5.6" /></Icon> },
]

const isActive = (t: Tab, path: string) => t.match.some((m) => (m === '/' ? path === '/' : path === m || path.startsWith(m + '/')))

export default function TabBar() {
  const { pathname } = useLocation()
  return (
    <>
      {/* Celular */}
      <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="mx-auto grid max-w-[520px] grid-cols-5 items-end px-1">
          {tabs.map((t, i) =>
            t ? (
              <li key={t.to}>
                <Link to={t.to} aria-current={isActive(t, pathname) ? 'page' : undefined} className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-semibold ${isActive(t, pathname) ? 'text-accent' : 'text-muted'}`}>
                  {t.icon}
                  {t.label}
                </Link>
              </li>
            ) : (
              <li key={i} className="flex justify-center">
                <Link to="/sos" aria-label="SOS: preciso de ajuda agora" className="-mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-sun text-sun-ink shadow-lg shadow-sun/40 ring-4 ring-bg transition active:scale-95">
                  <span className="font-display text-lg font-bold leading-none">SOS</span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Computador */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-line bg-surface px-4 py-6 md:flex">
        <Link to="/" className="mb-8 px-3 font-display text-2xl font-bold text-accent">Livre</Link>
        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1">
          {tabs.filter(Boolean).map((t) => {
            const tab = t as Tab
            const on = isActive(tab, pathname)
            return (
              <Link key={tab.to} to={tab.to} aria-current={on ? 'page' : undefined} className={`flex min-h-[48px] items-center gap-3 rounded-2xl px-3 font-semibold transition ${on ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-bg'}`}>
                {tab.icon}
                {tab.label}
              </Link>
            )
          })}
        </nav>
        <Link to="/sos" className="btn-sun w-full !px-3 text-base">SOS · Ajuda agora</Link>
      </aside>
    </>
  )
}
