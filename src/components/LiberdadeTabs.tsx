import { Link, useLocation } from 'react-router-dom'

const ITEMS = [
  { to: '/trilha', label: 'Trilha', match: ['/trilha'] },
  { to: '/jornada', label: 'Jornada', match: ['/jornada'] },
  { to: '/temas', label: 'Aprender', match: ['/temas'] },
  { to: '/queda', label: 'Recomeçar', match: ['/queda'] },
]

export default function LiberdadeTabs() {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Liberdade" className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
      {ITEMS.map((i) => {
        const on = i.match.some((m) => pathname === m || pathname.startsWith(m + '/'))
        return <Link key={i.to} to={i.to} aria-current={on ? 'page' : undefined} className={`chip shrink-0 ${on ? '!border-accent !bg-accent !text-accent-ink' : ''}`}>{i.label}</Link>
      })}
    </nav>
  )
}
