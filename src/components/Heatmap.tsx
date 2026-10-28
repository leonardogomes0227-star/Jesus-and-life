import { addDays, dayKey, diffDays } from '../lib/dates'
import type { AppState } from '../lib/types'

type Kind = 'none' | 'free' | 'checkin' | 'slip'

/** Mapa dos últimos 84 dias (12 semanas), alinhado por dia da semana. */
export default function Heatmap({ state, today, streakStart }: { state: AppState; today: string; streakStart: string }) {
  const free = new Set<string>()
  for (let d = streakStart; diffDays(d, today) >= 0; d = addDays(d, 1)) free.add(d)
  state.slips.forEach((s) => {
    const day = dayKey(new Date(s.at))
    for (let i = 1; i < s.streakDays; i++) free.add(addDays(day, -i))
  })
  const checks = new Set(state.checkins.map((c) => c.date))
  const slips = new Set(state.slips.map((s) => dayKey(new Date(s.at))))

  const todayDow = new Date(today + 'T00:00').getDay()
  const total = 77 + todayDow + 1 // 12 semanas, a primeira coluna começa no domingo
  const start = addDays(today, -(total - 1))
  const cells: { k: string; kind: Kind }[] = []
  for (let i = 0; i < total; i++) {
    const k = addDays(start, i)
    const kind: Kind = slips.has(k) ? 'slip' : checks.has(k) ? 'checkin' : free.has(k) ? 'free' : 'none'
    cells.push({ k, kind })
  }
  const cls: Record<Kind, string> = {
    none: 'bg-line/60',
    free: 'bg-accent/35',
    checkin: 'bg-accent',
    slip: 'bg-sun',
  }

  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label="Mapa dos últimos 84 dias">
        {cells.map((c) => (
          <div key={c.k} title={c.k} className={`aspect-square rounded-[4px] ${cls[c.kind]} ${c.k === today ? 'ring-2 ring-ink/60' : ''}`} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-accent" />Check-in</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-accent/35" />Dia de caminhada</span>
        <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-sun" />Recomeço</span>
      </div>
    </div>
  )
}
