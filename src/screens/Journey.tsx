import { MOODS } from '../lib/content'
import { addDays, dayKey, fmtDate, fmtDateTime } from '../lib/dates'
import { totalDays, useStore } from '../lib/store'

const BLOCKS = ['0–3h', '3–6h', '6–9h', '9–12h', '12–15h', '15–18h', '18–21h', '21–24h']

export default function Journey() {
  const { state } = useStore()
  const today = dayKey()

  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))
  const byDate = new Map(state.checkins.map((c) => [c.date, c]))

  const counts = new Map<string, number>()
  const add = (l: string[]) => l.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  state.checkins.forEach((c) => add(c.triggers))
  state.slips.forEach((s) => add(s.triggers))
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const hours = new Array(8).fill(0) as number[]
  state.slips.forEach((s) => hours[Math.floor(new Date(s.at).getHours() / 3)]++)
  state.sos.forEach((s) => hours[Math.floor(new Date(s.at).getHours() / 3)]++)
  const maxH = Math.max(1, ...hours)
  const hasHours = hours.some((h) => h > 0)

  type Ev = { at: string; icon: string; title: string; text?: string }
  const events: Ev[] = [
    { at: state.createdAt, icon: '🌱', title: 'Você começou a jornada' },
    ...state.checkins.map((c) => ({
      at: c.at, icon: MOODS[c.mood - 1].emoji, title: `Check-in: ${MOODS[c.mood - 1].label}`,
      text: [c.triggers.join(', '), c.note].filter(Boolean).join(' · '),
    })),
    ...state.sos.filter((s) => s.outcome === 'passed').map((s) => ({ at: s.at, icon: '🌊', title: 'A onda passou' })),
    ...state.slips.map((s) => ({
      at: s.at, icon: '🌅', title: 'Recomeço',
      text: [s.place, s.plan && `Plano: ${s.plan}`].filter(Boolean).join(' · '),
    })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

  return (
    <main className="space-y-5 fade-up">
      <header>
        <h1 className="font-display text-3xl font-bold">Jornada</h1>
        <p className="mt-1 text-muted">{totalDays(state)} dias acumulados · {state.sos.filter((s) => s.outcome === 'passed').length} ondas que passaram</p>
      </header>

      <section className="card">
        <h2 className="font-display text-xl font-bold">Humor nos últimos 14 dias</h2>
        <div className="mt-4 flex h-28 items-end gap-1" role="img" aria-label="Gráfico de humor dos últimos 14 dias">
          {days.map((d) => {
            const c = byDate.get(d)
            return (
              <div key={d} className="flex flex-1 flex-col items-center justify-end gap-1" title={c ? MOODS[c.mood - 1].label : 'Sem registro'}>
                <div className={`w-full rounded-t-lg ${c ? 'bg-accent' : 'bg-line'}`} style={{ height: c ? `${c.mood * 18}%` : '6%' }} />
                <span className="text-[10px] text-muted">{d.slice(8)}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted">Barras mais altas = dias melhores. Dias sem registro ficam cinzas.</p>
      </section>

      <section className="card">
        <h2 className="font-display text-xl font-bold">Gatilhos mais frequentes</h2>
        {top.length === 0 ? (
          <p className="mt-2 text-muted">Quando você registrar check-ins com gatilhos, eles aparecem aqui.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {top.map(([t, n]) => (
              <li key={t}>
                <div className="flex justify-between text-sm font-semibold"><span>{t}</span><span className="text-muted">{n}×</span></div>
                <div className="mt-1 h-2 rounded-full bg-bg"><div className="h-full rounded-full bg-sun" style={{ width: `${(n / top[0][1]) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="font-display text-xl font-bold">Horários de risco</h2>
        {!hasHours ? (
          <p className="mt-2 text-muted">Ainda sem dados. Usar o SOS ou registrar uma queda ajuda a descobrir seus horários mais sensíveis.</p>
        ) : (
          <div className="mt-4 grid grid-cols-8 items-end gap-1.5">
            {hours.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="flex h-20 w-full items-end"><div className={`w-full rounded-t-md ${h ? 'bg-sun' : 'bg-line'}`} style={{ height: `${Math.max(6, (h / maxH) * 100)}%` }} /></div>
                <span className="text-[9px] leading-tight text-muted">{BLOCKS[i]}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="font-display text-xl font-bold">Linha do tempo</h2>
        <ol className="mt-3 space-y-4">
          {events.slice(0, 40).map((e, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-lg" aria-hidden>{e.icon}</span>
              <div>
                <p className="font-semibold">{e.title}</p>
                {e.text && <p className="text-sm text-muted">{e.text}</p>}
                <p className="text-xs text-muted" title={fmtDateTime(e.at)}>{fmtDate(e.at)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
