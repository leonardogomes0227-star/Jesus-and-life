import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SunScene from '../components/SunScene'
import { WHY_IDEAS } from '../lib/content'
import { useStore } from '../lib/store'

const STEPS = 4

export default function Welcome() {
  const { start } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [days, setDays] = useState('0')
  const [goal, setGoal] = useState<21 | 90>(21)
  const [why, setWhy] = useState('')

  const n = Math.min(9999, Math.max(0, parseInt(days, 10) || 0))
  const canNext = step !== 1 || name.trim().length > 0
  const finish = () => {
    start(name, n, goal, why)
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[520px] flex-col px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2" aria-label={`Passo ${step + 1} de ${STEPS}`}>
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>

      <div key={step} className="fade-up mt-6 flex flex-1 flex-col">
        {step === 0 && (
          <>
            <SunScene progress={0.38} goal={21} day={8} />
            <h1 className="mt-7 font-display text-4xl font-bold leading-tight">Cada manhã é uma chance nova.</h1>
            <p className="mt-3 text-lg text-muted">
              Livre é um espaço para caminhar com Deus e construir bons hábitos, no seu ritmo, sem julgamento e sem culpa.
            </p>
            <ul className="mt-6 space-y-3">
              {[['📖', 'Um devocional curto por dia'], ['🌊', 'Ajuda na hora da vontade, com respiração e ações'], ['🤝', 'Um parceiro de confiança a um toque'], ['🔒', 'Tudo fica só no seu aparelho']].map(([i, t]) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
                  <span className="text-xl" aria-hidden>{i}</span><span className="font-medium">{t}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="font-display text-3xl font-bold">Como você quer ser chamado(a)?</h1>
            <p className="mt-2 text-muted">É só para a gente conversar de um jeito mais próximo.</p>
            <input className="field mt-6 !min-h-[56px] text-lg" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" autoComplete="given-name" maxLength={40} aria-label="Seu nome" onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)} />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="font-display text-3xl font-bold">Onde você está agora, {name.trim()}?</h1>
            <p className="mt-2 text-muted">Sem pressão. Escolha o ponto de partida e a meta que faz sentido para você.</p>
            <label className="label mt-6" htmlFor="dias">Quantos dias você já tem na sua sequência?</label>
            <div className="flex items-center gap-3">
              <button className="btn-ghost !px-0 w-12" aria-label="Menos um dia" onClick={() => setDays(String(Math.max(0, n - 1)))}>−</button>
              <input id="dias" className="field text-center font-display text-2xl font-bold" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value.replace(/\D/g, ''))} />
              <button className="btn-ghost !px-0 w-12" aria-label="Mais um dia" onClick={() => setDays(String(n + 1))}>+</button>
            </div>
            <p className="mt-2 text-sm text-muted">Começando agora? Deixe 0. Hoje já é o seu dia 1.</p>
            <p className="label mt-6">Sua meta</p>
            <div className="grid grid-cols-2 gap-3">
              {([21, 90] as const).map((g) => (
                <button key={g} aria-pressed={goal === g} onClick={() => setGoal(g)} className="chip !min-h-[84px] flex-col justify-center !rounded-3xl text-center">
                  <span className="font-display text-3xl font-bold">{g} dias</span>
                  <span className="text-sm font-normal opacity-80">{g === 21 ? 'Criar o hábito' : 'Consolidar a liberdade'}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="font-display text-3xl font-bold">Qual é o seu porquê?</h1>
            <p className="mt-2 text-muted">Nos dias difíceis, lembrar do motivo ajuda mais que força de vontade. Vamos mostrar isso a você na hora certa.</p>
            <textarea className="field mt-5 py-3" rows={4} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Escreva com suas palavras…" aria-label="Seu porquê" maxLength={280} />
            <div className="mt-3 flex flex-wrap gap-2">
              {WHY_IDEAS.map((w) => (
                <button key={w} className="chip !min-h-[44px] text-sm" onClick={() => setWhy(w)}>{w}</button>
              ))}
            </div>
          </>
        )}

        <div className="mt-auto space-y-3 pt-8">
          {step < STEPS - 1 ? (
            <button className="btn-primary w-full" disabled={!canNext} onClick={() => setStep(step + 1)}>{step === 0 ? 'Vamos começar' : 'Continuar'}</button>
          ) : (
            <button className="btn-primary w-full" onClick={finish}>{why.trim() ? 'Entrar no Livre' : 'Pular e entrar'}</button>
          )}
          {step > 0 && <button className="btn-ghost w-full" onClick={() => setStep(step - 1)}>Voltar</button>}
          {step === 0 && <p className="text-center text-sm text-muted">Seus dados ficam salvos só neste aparelho.</p>}
        </div>
      </div>
    </main>
  )
}
