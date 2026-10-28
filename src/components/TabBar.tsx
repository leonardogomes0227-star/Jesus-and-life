import { NavLink, Link } from 'react-router-dom'
import type { ReactNode } from 'react'

const Icon = ({ children }: { children: ReactNode }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
)

const tabs = [
  { to: '/', label: 'Hoje', end: true, icon: <Icon><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></Icon> },
  { to: '/jornada', label: 'Jornada', icon: <Icon><path d="M3 17c4 0 4-10 9-10s5 10 9 10" /></Icon> },
  null,
  { to: '/parceiro', label: 'Parceiro', icon: <Icon><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4c1.8.8 3 2.6 3 5.6" /></Icon> },
  { to: '/ajustes', label: 'Ajustes', icon: <Icon><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></Icon> },
]

export default function TabBar() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-[520px] grid-cols-5 items-end px-2">
        {tabs.map((t, i) =>
          t ? (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-xs font-semibold ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`
                }
              >
                {t.icon}
                {t.label}
              </NavLink>
            </li>
          ) : (
            <li key={i} className="flex justify-center">
              <Link
                to="/sos"
                aria-label="SOS — preciso de ajuda agora"
                className="-mt-6 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-sun text-sun-ink shadow-lg shadow-sun/40 ring-4 ring-bg transition active:scale-95"
              >
                <span className="font-display text-lg font-bold leading-none">SOS</span>
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
