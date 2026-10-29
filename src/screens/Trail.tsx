import { Link } from 'react-router-dom'
import LiberdadeTabs from '../components/LiberdadeTabs'
import { LESSONS, PHASES, PHASE_INFO } from '../lib/trail'
import { bestStreak, currentLesson, streakDay, totalDays, useStore } from '../lib/store'

const RESULT_LABEL = { sim: 'prática feita', parte: 'prática em parte', nao: 'prática ainda não' } as const

export default function Trail() {
  const { state, update } = useStore()
  const goal = state.profile!.goal
  const cur = currentLesson(state)
  const doneCount = state.trailDone.filter((n) => n <= goal).length
  const finished = cur > goal
  const lesson = LESSONS.find((l) => l.n === cur)
  const prev = cur > 1 ? LESSONS.find((l) => l.n === cur - 1) : undefined
  const pendingPrev = !!prev && state.trailDone.includes(cur - 1) && !state.trailPractice[String(cur - 1)]?.result
  const lessons = LESSONS.filter((l) => l.n <= goal)
  const stats: [number, string][] = [[streakDay(state), 'dia da sequência'], [totalDays(state), 'dias acumulados'], [doneCount, `de ${goal} lições`], [bestStreak(state), 'melhor sequência']]

  return (
    <main className="space-y-8 pb-8">
      <LiberdadeTabs />
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight">Trilha de {goal} dias</h1>
        <p className="mt-2 text-muted">Uma lição por dia, no seu ritmo. Não expira e não zera: se você parar, continua de onde estava.</p>
      </header>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {stats.map(([n, l]) => <div key={l}><p className="font-display text-5xl font-semibold leading-none">{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>)}
      </div>

      {doneCount === 0 && !finished && (
        <section className="rounded-3xl bg-sand p-6 text-sand-ink">
          <h2 className="font-display text-2xl font-semibold">Como a trilha funciona</h2>
          <ul className="mt-3 space-y-2 leading-snug">
            <li><strong>Cada lição leva uns 5 minutos:</strong> uma Palavra, o contexto, uma prática e uma resposta a Deus.</li>
            <li><strong>A prática é pequena e concreta.</strong> No dia seguinte o app pergunta como foi, sem cobrança.</li>
            <li><strong>Você vive em fases.</strong> Cada uma começa com uma apresentação e termina com um balanço.</li>
          </ul>
        </section>
      )}

      {finished ? (
        <section className="rounded-3xl bg-night p-6 text-night-ink">
          <h2 className="font-display text-3xl font-semibold">{goal === 21 ? 'Você completou os 21 dias.' : 'Você completou os 90 dias.'}</h2>
          <p className="mt-2 opacity-85">{goal === 21 ? 'Quer seguir adiante? As lições seguintes aprofundam a mente, as relações e a perseverança.' : 'Gratidão por cada passo. Você pode revisitar qualquer lição abaixo.'}</p>
          {goal === 21 && <button className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full bg-night-ink px-6 font-semibold text-night" onClick={() => update((s) => ({ ...s, profile: { ...s.profile!, goal: 90 } }))}>Estender para 90 dias</button>}
        </section>
      ) : (
        lesson && (
          <Link to={`/trilha/${cur}`} className="block rounded-3xl bg-night p-6 text-night-ink active:scale-[0.99]">
            <p className="text-sm font-semibold opacity-70">Hoje na trilha · dia {cur} de {goal}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold leading-tight">{lesson.title}</h2>
            <p className="mt-1 opacity-80">{lesson.ref}</p>
            {pendingPrev && <p className="mt-3 rounded-2xl bg-night-ink/10 p-3 text-sm">A lição começa perguntando como foi a prática de ontem.</p>}
            <p className="mt-4 font-semibold">{doneCount === 0 ? 'Começar' : 'Continuar'} →</p>
          </Link>
        )
      )}

      <section className="space-y-3" aria-label="Fases">
        <h2 className="font-display text-2xl font-semibold">As fases</h2>
        {PHASES.filter((p) => p.from <= goal).map((p) => {
          const items = lessons.filter((l) => l.n >= p.from && l.n <= p.to)
          const done = items.filter((l) => state.trailDone.includes(l.n)).length
          const isCurrent = cur >= p.from && cur <= p.to
          return (
            <details key={p.id} open={isCurrent} className="rounded-3xl border border-line bg-surface">
              <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-4 p-5">
                <span>
                  <span className="block font-display text-xl font-semibold">{p.name}</span>
                  <span className="block text-sm text-muted">Dias {p.from} a {Math.min(p.to, goal)} · {done} de {items.length}</span>
                </span>
                <span className="h-2 w-16 shrink-0 overflow-hidden rounded-full bg-line" aria-hidden><span className="block h-full rounded-full bg-accent" style={{ width: `${(done / items.length) * 100}%` }} /></span>
              </summary>
              <div className="space-y-3 px-5 pb-5">
                <p className="text-sm leading-relaxed text-muted">{PHASE_INFO[p.id].intro}</p>
                <ol className="space-y-2">
                  {items.map((l) => {
                    const isDone = state.trailDone.includes(l.n)
                    const locked = l.n > cur
                    const res = state.trailPractice[String(l.n)]?.result
                    const row = (
                      <div className={`flex min-h-[60px] items-center gap-3 rounded-2xl border px-4 py-2 ${l.n === cur ? 'border-accent' : 'border-line'} ${locked ? 'opacity-50' : ''}`}>
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isDone ? 'bg-accent text-accent-ink' : 'bg-bg text-muted'}`}>{isDone ? '✓' : l.n}</span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{l.title}</span>
                          <span className="block text-xs text-muted">Dia {l.n} · {l.ref}{res ? ` · ${RESULT_LABEL[res]}` : ''}</span>
                        </span>
                      </div>
                    )
                    return <li key={l.n}>{locked ? row : <Link to={`/trilha/${l.n}`}>{row}</Link>}</li>
                  })}
                </ol>
              </div>
            </details>
          )
        })}
      </section>
    </main>
  )
}
