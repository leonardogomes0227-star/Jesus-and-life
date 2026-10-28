import { useState } from 'react'
import { Link } from 'react-router-dom'
import LiberdadeTabs from '../components/LiberdadeTabs'
import SunScene from '../components/SunScene'
import { LESSONS, PHASES } from '../lib/trail'
import { bestStreak, currentLesson, streakDay, totalDays, useStore } from '../lib/store'

export default function Trail() {
  const { state, update } = useStore()
  const goal = state.profile!.goal
  const [whyDraft, setWhyDraft] = useState('')
  const cur = currentLesson(state)
  const doneCount = state.trailDone.filter((n) => n <= goal).length
  const pct = doneCount / goal
  const finished = cur > goal
  const lessons = LESSONS.filter((l) => l.n <= goal)
  const R = 38
  const C = 2 * Math.PI * R

  return (
    <main className="space-y-5">
      <LiberdadeTabs />
      <header className="fade-up">
        <h1 className="font-display text-3xl font-bold">Trilha de {goal} dias</h1>
        <p className="mt-1 text-muted">Uma lição por dia, no seu ritmo. Não expira e não zera: se você parar, continua de onde estava.</p>
      </header>

      <section className="card flex items-center gap-5 fade-up">
        <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0" role="img" aria-label={`${doneCount} de ${goal} lições`}>
          <circle cx="48" cy="48" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="9" />
          <circle cx="48" cy="48" r={R} fill="none" stroke="rgb(var(--sun))" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 48 48)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
          <text x="48" y="54" textAnchor="middle" className="fill-ink font-display" fontSize="20" fontWeight="700">{doneCount}</text>
        </svg>
        <div>
          <p className="font-display text-xl font-bold">{finished ? 'Trilha concluída!' : `Próxima: dia ${cur}`}</p>
          <p className="text-sm text-muted">{doneCount} de {goal} lições concluídas</p>
          {!finished && <Link to={`/trilha/${cur}`} className="btn-primary mt-3 !min-h-[44px] !px-5">{doneCount === 0 ? 'Começar' : 'Continuar'}</Link>}
        </div>
      </section>
      {!state.profile!.why && (
        <section className="card space-y-3">
          <p className="font-display text-lg font-bold">Qual é o seu porquê?</p>
          <p className="text-sm text-muted">Uma frase sobre o motivo desta caminhada. Ela aparece no SOS, nos dias difíceis.</p>
          <input className="field" value={whyDraft} onChange={(e) => setWhyDraft(e.target.value)} placeholder="Ex.: ter paz com Deus e comigo mesmo" maxLength={280} aria-label="Seu porquê" />
          <button className="btn-ghost w-full" disabled={!whyDraft.trim()} onClick={() => update((s) => ({ ...s, profile: { ...s.profile!, why: whyDraft.trim() } }))}>Salvar</button>
        </section>
      )}
      <section className="card !p-3">
        <SunScene progress={streakDay(state) / goal} goal={goal} day={streakDay(state)} />
        <div className="grid grid-cols-3 gap-2 pt-3">
          {[[streakDay(state), 'dia atual'], [totalDays(state), 'dias acumulados'], [bestStreak(state), 'melhor sequência']].map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-bg px-2 py-3 text-center"><p className="font-display text-2xl font-bold">{n}</p><p className="text-xs font-medium leading-tight text-muted">{l}</p></div>
          ))}
        </div>
        <p className="px-2 pb-1 pt-3 text-center text-xs text-muted">Seu total nunca zera. Se houver uma queda, a sequência recomeça e o total continua.</p>
      </section>

      {finished && goal === 21 && (
        <section className="card fade-up">
          <p className="font-display text-xl font-bold">Parabéns pelos 21 dias.</p>
          <p className="mt-1 text-muted">Quer continuar até 90 dias? As lições seguintes aprofundam mente, relações e perseverança.</p>
          <button className="btn-primary mt-3 w-full" onClick={() => update((s) => ({ ...s, profile: { ...s.profile!, goal: 90 } }))}>Estender para 90 dias</button>
        </section>
      )}
      {finished && goal === 90 && (
        <section className="card fade-up"><p className="font-display text-xl font-bold">Você completou os 90 dias.</p><p className="mt-1 text-muted">Gratidão por cada passo. Você pode revisitar qualquer lição abaixo.</p></section>
      )}

      {PHASES.filter((p) => p.from <= goal).map((p) => {
        const items = lessons.filter((l) => l.n >= p.from && l.n <= p.to)
        const done = items.filter((l) => state.trailDone.includes(l.n)).length
        return (
          <section key={p.id} className="fade-up">
            <div className="mb-2 flex items-end justify-between px-1">
              <div>
                <h2 className="font-display text-xl font-bold">{p.name}</h2>
                <p className="text-sm text-muted">{p.blurb}</p>
              </div>
              <span className="text-sm font-semibold text-muted">{done}/{items.length}</span>
            </div>
            <ol className="space-y-2">
              {items.map((l) => {
                const isDone = state.trailDone.includes(l.n)
                const locked = l.n > cur
                const row = (
                  <div className={`flex min-h-[60px] items-center gap-3 rounded-2xl border px-4 py-2 ${l.n === cur ? 'border-accent bg-accent/10' : 'border-line bg-surface'} ${locked ? 'opacity-50' : ''}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isDone ? 'bg-accent text-accent-ink' : 'bg-bg text-muted'}`}>{isDone ? '✓' : l.n}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{l.title}</span>
                      <span className="block text-xs text-muted">Dia {l.n} · {l.ref}</span>
                    </span>
                  </div>
                )
                return <li key={l.n}>{locked ? row : <Link to={`/trilha/${l.n}`}>{row}</Link>}</li>
              })}
            </ol>
          </section>
        )
      })}
    </main>
  )
}
