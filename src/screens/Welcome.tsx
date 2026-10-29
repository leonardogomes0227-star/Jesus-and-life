import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HourArt from '../components/HourArt'
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
    <main className="mx-auto min-h-screen max-w-[520px]">
      <div className="relative overflow-hidden bg-sand px-6 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))] text-sand-ink md:mt-8 md:rounded-[32px]">
        <HourArt slot="manha" className="pointer-events-none absolute right-4 top-6 w-44 text-sand-ink" />
        <p className="relative font-display text-6xl font-semibold leading-none">Livre</p>
        <p className="relative mt-24 max-w-[16rem] font-display text-3xl font-medium leading-tight">“As suas misericórdias se renovam cada manhã.”</p>
        <p className="relative mt-2 text-sm opacity-70">Lamentações 3:22-23</p>
      </div>

      <form onSubmit={enter} className="space-y-4 px-6 py-8">
        <p className="text-lg leading-relaxed">Bíblia, oração e acompanhamento para o seu dia inteiro, da manhã à noite. Sem cobrança e sem julgamento.</p>
        <div>
          <label className="label" htmlFor="nome">Como podemos te chamar?</label>
          <input id="nome" className="field !min-h-[56px] text-lg" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="given-name" maxLength={40} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={!name.trim()}>Entrar</button>
        <button type="button" className="min-h-[48px] w-full text-sm font-semibold underline" aria-expanded={adv} onClick={() => setAdv((v) => !v)}>
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
        <p className="pt-2 text-center text-sm text-muted">Tudo fica salvo só neste aparelho.</p>
      </form>
    </main>
  )
}
