import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'

export default function Welcome() {
  const { start } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [adv, setAdv] = useState(false)
  const [days, setDays] = useState('0')
  const [goal, setGoal] = useState<21 | 90>(21)

  const enter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    start(name, Math.min(9999, parseInt(days, 10) || 0), goal, '')
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[520px] flex-col justify-center px-5 py-10">
      <h1 className="font-display text-4xl font-bold leading-tight">Livre</h1>
      <p className="mt-2 text-lg text-muted">Bíblia, devocional, oração e apoio para os dias difíceis. Sem julgamento e sem cobrança.</p>

      <form onSubmit={enter} className="mt-8 space-y-4">
        <div>
          <label className="label" htmlFor="nome">Como podemos te chamar?</label>
          <input id="nome" className="field !min-h-[56px] text-lg" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="given-name" maxLength={40} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={!name.trim()}>Entrar</button>

        <button type="button" className="min-h-[48px] w-full text-sm font-semibold text-accent underline" aria-expanded={adv} onClick={() => setAdv((v) => !v)}>
          {adv ? 'Esconder opções' : 'Já tenho dias de sequência ou quero outra meta'}
        </button>
        {adv && (
          <div className="card space-y-4 pop">
            <div>
              <label className="label" htmlFor="dias">Dias que você já tem (0 se está começando)</label>
              <input id="dias" className="field" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value.replace(/\D/g, ''))} />
            </div>
            <div>
              <p className="label">Meta da trilha de liberdade</p>
              <div className="grid grid-cols-2 gap-3">
                {([21, 90] as const).map((g) => <button key={g} type="button" aria-pressed={goal === g} onClick={() => setGoal(g)} className="chip justify-center">{g} dias</button>)}
              </div>
            </div>
          </div>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-muted">Tudo fica salvo só neste aparelho. Você pode ajustar depois.</p>
    </main>
  )
}
