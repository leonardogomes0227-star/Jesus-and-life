import LiberdadeTabs from '../components/LiberdadeTabs'
import CountUp from '../components/CountUp'
import Heatmap from '../components/Heatmap'
import MoodChart from '../components/MoodChart'
import { MILESTONES, MOODS } from '../lib/content'
import { dayKey, fmtDate, fmtDateTime } from '../lib/dates'
import { bestStreak, streakDay, totalDays, useStore } from '../lib/store'

const BLOCKS = ['0–3h', '3–6h', '6–9h', '9–12h', '12–15h', '15–18h', '18–21h', '21–24h']
const PERIOD = ['na madrugada', 'de manhã cedo', 'de manhã', 'no fim da manhã', 'à tarde', 'no fim da tarde', 'à noite', 'tarde da noite']

export default function Journey() {
  const { state } = useStore()
  const today = dayKey()
  const total = totalDays(state)
  const waves = state.sos.filter((s) => s.outcome === 'passed').length

  const counts = new Map<string, number>()
  const add = (l: string[]) => l.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1))
  state.checkins.forEach((c) => add(c.triggers))
  state.slips.forEach((s) => add(s.triggers))
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const hours = new Array(8).fill(0) as number[]
  ;[...state.slips, ...state.sos].forEach((s) => hours[Math.floor(new Date(s.at).getHours() / 3)]++)
  const maxH = Math.max(1, ...hours)
  const peak = hours.indexOf(maxH)
  const hasHours = hours.some((h) => h > 0)

  const last14 = state.checkins.filter((c) => c.date >= dayKey(new Date(Date.now() - 13 * 86400000)))
  const avg = last14.length ? last14.reduce((a, c) => a + c.mood, 0) / last14.length : 0

  const insights: string[] = []
  if (hasHours) insights.push(`Os momentos mais sensíveis costumam vir ${PERIOD[peak]} (${BLOCKS[peak]}). Prepare um plano para esse horário.`)
  if (top[0]) insights.push(`“${top[0][0]}” é o gatilho que mais aparece. Vale pensar em uma saída para ele.`)
  if (last14.length >= 3) insights.push(`Seu humor médio nas últimas duas semanas foi ${MOODS[Math.round(avg) - 1].label.toLowerCase()} (${avg.toFixed(1)} de 5).`)
  if (waves > 0) insights.push(`Você já venceu ${waves} ${waves === 1 ? 'onda' : 'ondas'}. Cada uma deixa você mais forte.`)

  type Ev = { at: string; icon: string; title: string; text?: string }
  const events: Ev[] = [
    { at: state.createdAt, icon: '🌱', title: 'Você começou a jornada' },
    ...state.checkins.map((c) => ({ at: c.at, icon: MOODS[c.mood - 1].emoji, title: `Check-in: ${MOODS[c.mood - 1].label}`, text: [c.triggers.join(', '), c.note].filter(Boolean).join(' · ') })),
    ...state.sos.filter((s) => s.outcome === 'passed').map((s) => ({ at: s.at, icon: '🌊', title: 'A onda passou' })),
    ...state.slips.map((s) => ({ at: s.at, icon: '🌅', title: `Recomeço após ${s.streakDays - 1} ${s.streakDays - 1 === 1 ? 'dia' : 'dias'}`, text: [s.place, s.plan && `Plano: ${s.plan}`].filter(Boolean).join(' · ') })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

  return (
    <main className="space-y-5">
      <LiberdadeTabs />
      <header className="fade-up">
        <h1 className="font-display text-3xl font-bold">Jornada</h1>
        <p className="mt-1 text-muted">Para onde você já caminhou.</p>
      </header>

      <section className="grid grid-cols-2 gap-3 fade-up">
        {[
          [total, 'dias acumulados', '☀️'],
          [streakDay(state), 'dias na sequência atual', '🔥'],
          [bestStreak(state), 'melhor sequência', '🏆'],
          [waves, 'ondas vencidas', '🌊'],
        ].map(([n, l, i]) => (
          <div key={l} className="card !p-4">
            <span className="text-xl" aria-hidden>{i}</span>
            <p className="font-display text-3xl font-bold"><CountUp to={Number(n)} /></p>
            <p className="text-sm text-muted">{l}</p>
          </div>
        ))}
      </section>

      {insights.length > 0 && (
        <section className="rounded-3xl bg-accent p-5 text-accent-ink fade-up">
          <p className="text-xs font-bold uppercase tracking-wide opacity-80">O que a sua jornada mostra</p>
          <ul className="mt-2 space-y-2">{insights.map((t) => <li key={t} className="leading-snug">• {t}</li>)}</ul>
        </section>
      )}

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Humor nos últimos 14 dias</h2>
        <div className="mt-3">{last14.length ? <MoodChart checkins={state.checkins} today={today} /> : <p className="text-muted">Faça seu primeiro check-in na tela Hoje para ver o gráfico.</p>}</div>
      </section>

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Últimas 12 semanas</h2>
        <div className="mt-3"><Heatmap state={state} today={today} streakStart={state.streakStart} /></div>
      </section>

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Conquistas</h2>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {MILESTONES.map((m) => {
            const got = total >= m.days
            return (
              <div key={m.days} title={m.text} className={`flex flex-col items-center rounded-2xl p-2 text-center ${got ? 'bg-sun/15' : 'bg-bg opacity-50'}`}>
                <span className={`text-2xl ${got ? '' : 'grayscale'}`} aria-hidden>{m.emoji}</span>
                <span className="mt-1 text-xs font-bold leading-tight">{m.days}d</span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-muted">{MILESTONES.filter((m) => total >= m.days).length} de {MILESTONES.length} conquistadas.</p>
      </section>

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Gatilhos mais frequentes</h2>
        {top.length === 0 ? (
          <p className="mt-2 text-muted">Quando você registrar check-ins com gatilhos, eles aparecem aqui.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {top.map(([t, n]) => (
              <li key={t}>
                <div className="flex justify-between text-sm font-semibold"><span>{t}</span><span className="text-muted">{n}×</span></div>
                <div className="mt-1 h-2.5 rounded-full bg-bg"><div className="h-full rounded-full bg-sun" style={{ width: `${(n / top[0][1]) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Horários de risco</h2>
        {!hasHours ? (
          <p className="mt-2 text-muted">Ainda sem dados. Usar o SOS ou registrar uma queda ajuda a descobrir seus horários mais sensíveis.</p>
        ) : (
          <div className="mt-4 grid grid-cols-8 items-end gap-1.5">
            {hours.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="flex h-24 w-full items-end"><div className={`w-full rounded-t-md ${h ? (i === peak ? 'bg-sun' : 'bg-sun/50') : 'bg-line'}`} style={{ height: `${Math.max(6, (h / maxH) * 100)}%` }} /></div>
                <span className="text-[10px] leading-tight text-muted">{BLOCKS[i]}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Linha do tempo</h2>
        <ol className="relative mt-4 space-y-5 before:absolute before:bottom-2 before:left-5 before:top-2 before:w-px before:bg-line">
          {events.slice(0, 40).map((e, i) => (
            <li key={i} className="relative flex gap-3">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-lg" aria-hidden>{e.icon}</span>
              <div className="pt-0.5">
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
