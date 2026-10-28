import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'

export default function Welcome() {
  const { start } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [days, setDays] = useState('0')
  const [goal, setGoal] = useState<21 | 90>(21)

  const n = Math.min(9999, Math.max(0, parseInt(days, 10) || 0))

  return (
    <main className="mx-auto flex min-h-screen max-w-[520px] flex-col px-5 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="fade-up">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden>
            <path d="M12 42a20 20 0 0 1 40 0" fill="none" stroke="rgb(var(--sun))" strokeWidth="5" strokeLinecap="round" />
            <circle cx="32" cy="22" r="6" fill="rgb(var(--sun))" />
          </svg>
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight">Que bom que você está aqui.</h1>
        <p className="mt-3 text-lg text-muted">
          Livre é um espaço para caminhar com Deus e construir bons hábitos, no seu ritmo, sem julgamento e sem culpa.
        </p>
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          start(name, n, goal)
          navigate('/', { replace: true })
        }}
      >
        <div>
          <label className="label" htmlFor="nome">Como você quer ser chamado(a)?</label>
          <input id="nome" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="given-name" maxLength={40} required />
        </div>

        <div>
          <label className="label" htmlFor="dias">Quantos dias você já tem na sua sequência?</label>
          <input id="dias" className="field" inputMode="numeric" pattern="[0-9]*" value={days} onChange={(e) => setDays(e.target.value.replace(/\D/g, ''))} />
          <p className="mt-2 text-sm text-muted">Se está começando agora, deixe 0. Hoje já é o seu dia 1.</p>
        </div>

        <fieldset>
          <legend className="label">Qual meta você quer buscar?</legend>
          <div className="grid grid-cols-2 gap-3">
            {([21, 90] as const).map((g) => (
              <button key={g} type="button" aria-pressed={goal === g} onClick={() => setGoal(g)} className="chip justify-center !min-h-[64px] flex-col !rounded-3xl">
                <span className="font-display text-2xl font-bold">{g}</span>
                <span className="text-sm font-normal opacity-80">dias</span>
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary w-full" disabled={!name.trim()}>Começar</button>
        <p className="text-center text-sm text-muted">Tudo fica salvo só neste aparelho.</p>
      </form>
    </main>
  )
}
