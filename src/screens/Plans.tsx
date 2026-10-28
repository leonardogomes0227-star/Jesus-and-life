import { Link, Navigate, useParams } from 'react-router-dom'
import { BOOKS } from '../lib/books'
import { PLANS, planById, type Chapter } from '../lib/plans'
import { planCursor, useStore } from '../lib/store'

const label = (c: Chapter) => `${BOOKS.find((b) => b.id === c.book)!.name} ${c.chapter}`

export function PlanList() {
  const { state } = useStore()
  return (
    <main className="space-y-5">
      <Link to="/ler" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Ler</Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Planos de leitura</h1>
        <p className="mt-1 text-muted">Sem prazo e sem cobrança. Se você parar, continua de onde estava.</p>
      </header>
      <div className="space-y-3">
        {PLANS.map((p) => {
          const done = state.plans[p.id]?.done.length ?? 0
          const started = !!state.plans[p.id]
          return (
            <Link key={p.id} to={`/planos/${p.id}`} className="card block active:scale-[0.99]">
              <span className="block font-display text-xl font-bold">{p.title}</span>
              <span className="block text-sm text-muted">{p.blurb}</span>
              <span className="mt-3 block h-2 overflow-hidden rounded-full bg-bg"><span className="block h-full rounded-full bg-accent" style={{ width: `${(done / p.days.length) * 100}%` }} /></span>
              <span className="mt-1 block text-xs font-semibold text-muted">{started ? `${done} de ${p.days.length} dias` : `${p.days.length} dias`}</span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export function PlanPage() {
  const { id } = useParams()
  const plan = planById(id ?? '')
  const { state, togglePlanDay } = useStore()
  if (!plan) return <Navigate to="/planos" replace />
  const total = plan.days.length
  const done = state.plans[plan.id]?.done ?? []
  const cur = planCursor(state, plan.id, total)
  const upcoming = plan.days.map((d, i) => ({ d, i })).filter(({ i }) => i >= Math.max(0, cur - 3)).slice(0, 12)

  return (
    <main className="space-y-5">
      <Link to="/planos" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Planos</Link>
      <header>
        <h1 className="font-display text-3xl font-bold">{plan.title}</h1>
        <p className="mt-1 text-muted">{plan.blurb}</p>
        <p className="mt-2 text-sm font-semibold text-muted">{done.length} de {total} dias concluídos</p>
      </header>

      {cur >= total ? (
        <section className="card"><p className="font-display text-xl font-bold">Plano concluído.</p><p className="mt-1 text-muted">Que Deus use o que você leu. Escolha outro plano quando quiser.</p></section>
      ) : (
        <p className="text-sm text-muted">Seu próximo dia é o <strong className="text-ink">dia {cur + 1}</strong>. Os dias anteriores continuam disponíveis.</p>
      )}

      <ol className="space-y-3">
        {upcoming.map(({ d, i }) => {
          const ok = done.includes(i)
          return (
            <li key={i} className={`card !p-4 ${i === cur ? 'border-accent' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg font-bold">Dia {i + 1}</p>
                <button onClick={() => togglePlanDay(plan.id, i)} aria-pressed={ok} className={`flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold ${ok ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-bg'}`}>{ok ? '✓ Concluído' : 'Concluir'}</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {d.map((c) => (
                  <Link key={`${c.book}${c.chapter}`} to={`/biblia/${c.book}/${c.chapter}?plano=${plan.id}`} className="chip !min-h-[44px] text-sm">{label(c)}</Link>
                ))}
              </div>
            </li>
          )
        })}
      </ol>
      {cur + 9 < total && <p className="text-center text-xs text-muted">Mostrando os próximos dias. Os seguintes aparecem conforme você avança.</p>}
    </main>
  )
}
