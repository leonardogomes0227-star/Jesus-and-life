import { Link } from 'react-router-dom'
import Heatmap from '../components/Heatmap'
import LiberdadeTabs from '../components/LiberdadeTabs'
import MoodChart from '../components/MoodChart'
import { MILESTONES, MOODS } from '../lib/content'
import { addDays, dayKey, fmtDate } from '../lib/dates'
import { bestStreak, streakDay, totalDays, useStore } from '../lib/store'

const DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const BLOCKS = ['Madrugada', 'Manhã', 'Tarde', 'Noite']
const BLOCK_HOURS = ['0 às 5h', '6 às 11h', '12 às 17h', '18 às 23h']
const WEEKDAY = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export default function Journey() {
  const { state } = useStore()
  const today = dayKey()
  const total = totalDays(state)
  const since = (n: number) => addDays(today, -n)
  const inRange = (iso: string, from: number, to: number) => { const d = dayKey(new Date(iso)); return d >= since(from) && d <= since(to) }

  // esta semana (últimos 7 dias) e a semana anterior
  const week = (from: number, to: number) => {
    const c = state.checkins.filter((x) => x.date >= since(from) && x.date <= since(to))
    return {
      moments: state.moments.filter((m) => inRange(m.at, from, to)).length,
      waves: state.sos.filter((s) => s.outcome === 'passed' && inRange(s.at, from, to)).length,
      slips: state.slips.filter((s) => inRange(s.at, from, to)).length,
      mood: c.length ? c.reduce((a, x) => a + x.mood, 0) / c.length : 0,
      checks: c.length,
    }
  }
  const w1 = week(6, 0), w0 = week(13, 7)

  // quando é mais difícil: SOS e recomeços, por dia da semana e faixa do dia
  const grid = Array.from({ length: 4 }, () => new Array(7).fill(0) as number[])
  const hard = [...state.slips.map((s) => s.at), ...state.sos.map((s) => s.at)]
  hard.forEach((iso) => { const d = new Date(iso); grid[Math.floor(d.getHours() / 6)][d.getDay()]++ })
  const max = Math.max(1, ...grid.flat())
  const byBlock = grid.map((r) => r.reduce((a, b) => a + b, 0))
  const byDay = DOW.map((_, d) => grid.reduce((a, r) => a + r[d], 0))
  const peakBlock = hard.length >= 3 ? byBlock.indexOf(Math.max(...byBlock)) : -1
  const peakDay = hard.length >= 3 ? byDay.indexOf(Math.max(...byDay)) : -1

  const counts = new Map<string, number>()
  const add = (t?: string) => t && counts.set(t, (counts.get(t) ?? 0) + 1)
  state.checkins.forEach((c) => c.triggers.forEach(add)); state.slips.forEach((s) => s.triggers.forEach(add)); state.sos.forEach((s) => add(s.trigger))
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const noRule = top.find(([t]) => !(state.plan?.rules ?? []).some((r) => r.trigger === t))

  // uma única leitura, com um próximo passo
  type Insight = { text: string; cta?: { to: string; label: string } }
  const insight: Insight | null =
    peakBlock >= 0 && peakDay >= 0 && hard.length >= 4
      ? { text: `Os momentos mais difíceis costumam vir ${peakBlock === 0 ? 'na madrugada' : peakBlock === 1 ? 'de manhã' : peakBlock === 2 ? 'à tarde' : 'à noite'}, principalmente na ${WEEKDAY[peakDay]}. Vale ter um plano para esse horário.`, cta: state.plan ? { to: '/plano', label: 'Ver o meu plano' } : { to: '/plano', label: 'Montar o meu plano' } }
      : noRule && noRule[1] >= 2
        ? { text: `“${noRule[0]}” apareceu ${noRule[1]} vezes e você ainda não tem uma regra para isso.`, cta: { to: '/plano', label: 'Criar uma regra' } }
        : w1.slips === 0 && w0.slips > 0
          ? { text: 'Esta semana você não registrou recomeços, e na anterior registrou. Isso é progresso, mesmo que pequeno.' }
          : null

  const delta = (a: number, b: number) => (a === b ? 'igual à semana passada' : a > b ? `${a - b} a mais que na semana passada` : `${b - a} a menos que na semana passada`)

  type Ev = { at: string; title: string; text?: string }
  const events: Ev[] = [
    { at: state.createdAt, title: 'Você começou a jornada' },
    ...state.checkins.map((c) => ({ at: c.at, title: `Humor: ${MOODS[c.mood - 1].label}`, text: [c.triggers.join(', '), c.note].filter(Boolean).join(' · ') })),
    ...state.sos.filter((s) => s.outcome === 'passed').map((s) => ({ at: s.at, title: 'A onda passou', text: s.helped?.length ? 'Ajudou: ' + s.helped.join(', ') : undefined })),
    ...state.slips.map((s) => ({ at: s.at, title: `Recomeço após ${s.streakDays - 1} ${s.streakDays - 1 === 1 ? 'dia' : 'dias'}`, text: [s.place, s.plan && `Daqui para frente: ${s.plan}`].filter(Boolean).join(' · ') })),
    ...state.meetings.map((m) => ({ at: m.at, title: 'Encontro com o parceiro', text: m.commitment && `Combinado: ${m.commitment}` })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

  const last14 = state.checkins.filter((c) => c.date >= since(13))
  const hasData = hard.length > 0 || state.checkins.length > 0 || state.moments.length > 0

  return (
    <main className="space-y-10 pb-8">
      <LiberdadeTabs />
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight">Jornada</h1>
        <p className="mt-2 text-muted">Para onde você já caminhou, e o que isso mostra.</p>
      </header>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {([[total, 'dias acumulados'], [streakDay(state), 'dia da sequência'], [bestStreak(state), 'melhor sequência']] as [number, string][]).map(([n, l]) => <div key={l}><p className="font-display text-5xl font-semibold leading-none">{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>)}
      </div>

      {insight && (
        <section className="rounded-3xl bg-night p-6 text-night-ink">
          <p className="text-sm font-semibold opacity-70">O que a sua jornada mostra</p>
          <p className="mt-2 font-display text-2xl leading-snug">{insight.text}</p>
          {insight.cta && <Link to={insight.cta.to} className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full bg-night-ink px-6 font-semibold text-night">{insight.cta.label}</Link>}
        </section>
      )}

      {!hasData && <p className="rounded-3xl bg-sand p-6 text-sand-ink">A Jornada começa a mostrar padrões depois dos seus primeiros momentos com Deus, check-ins e usos do SOS. Volte aqui em alguns dias.</p>}

      {hasData && (
        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold">Esta semana</h2>
          <div className="grid grid-cols-2 gap-3">
            {([[w1.moments, 'momentos com Deus', delta(w1.moments, w0.moments)], [w1.waves, 'ondas vencidas', delta(w1.waves, w0.waves)], [w1.slips, w1.slips === 1 ? 'recomeço' : 'recomeços', delta(w1.slips, w0.slips)], [w1.checks ? w1.mood.toFixed(1) : '–', 'humor médio (de 5)', w1.checks && w0.checks ? (w1.mood >= w0.mood ? 'igual ou melhor que antes' : 'um pouco abaixo da semana passada') : 'registre o humor para comparar']] as [string | number, string, string][]).map(([n, l, d]) => (
              <div key={l} className="card !p-4"><p className="font-display text-4xl font-semibold leading-none">{n}</p><p className="mt-1 text-sm font-medium">{l}</p><p className="mt-1 text-xs text-muted">{d}</p></div>
            ))}
          </div>
        </section>
      )}

      {hard.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold">Quando é mais difícil</h2>
          <p className="text-sm text-muted">Cada quadrado é um uso do SOS ou um recomeço. Quanto mais escuro, mais vezes.</p>
          <div className="grid grid-cols-[4.5rem_repeat(7,1fr)] items-center gap-1.5" role="img" aria-label="Quando é mais difícil, por dia da semana e período do dia">
            <span />
            {DOW.map((d, k) => <span key={k} className="text-center text-xs font-semibold text-muted">{d}</span>)}
            {grid.map((row, b) => (
              <div key={b} className="contents">
                <span className="text-xs text-muted">{BLOCKS[b]}<span className="block text-[10px] opacity-70">{BLOCK_HOURS[b]}</span></span>
                {row.map((n, d) => <span key={d} className="aspect-square rounded-md border border-line" style={{ background: n ? `rgb(var(--sun) / ${0.18 + 0.82 * (n / max)})` : 'transparent' }} title={`${n}`} />)}
              </div>
            ))}
          </div>
        </section>
      )}

      {top.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold">O que mais puxa</h2>
          <ul className="space-y-3">
            {top.map(([t, n]) => (
              <li key={t}>
                <div className="flex justify-between text-sm font-semibold"><span>{t}</span><span className="text-muted">{n}×</span></div>
                <div className="mt-1 h-2.5 rounded-full bg-line"><div className="h-full rounded-full bg-sun" style={{ width: `${(n / top[0][1]) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {last14.length >= 2 && (
        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold">Humor nos últimos 14 dias</h2>
          <MoodChart checkins={state.checkins} today={today} />
        </section>
      )}

      {hasData && (
        <section className="space-y-3">
          <h2 className="font-display text-3xl font-semibold">Últimas 12 semanas</h2>
          <Heatmap state={state} today={today} streakStart={state.streakStart} />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-3xl font-semibold">Conquistas</h2>
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map((m) => { const got = total >= m.days; return <span key={m.days} title={m.text} className={`rounded-full border px-4 py-2 text-sm font-semibold ${got ? 'border-sun bg-sun/15' : 'border-line text-muted opacity-60'}`}>{m.days} {m.days === 1 ? 'dia' : 'dias'} · {m.title}</span> })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-3xl font-semibold">Linha do tempo</h2>
        <ol className="space-y-4 border-l border-line pl-5">
          {events.slice(0, 30).map((e, i) => (
            <li key={i} className="relative"><span className="absolute -left-[1.6rem] top-2 h-2 w-2 rounded-full bg-muted" aria-hidden /><p className="font-semibold">{e.title}</p>{e.text && <p className="text-sm text-muted">{e.text}</p>}<p className="text-xs text-muted">{fmtDate(e.at)}</p></li>
          ))}
        </ol>
      </section>
    </main>
  )
}
