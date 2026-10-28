import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PLACES, TRIGGERS, VERSES } from '../lib/content'
import { toLocalInput } from '../lib/dates'
import { totalDays, useStore } from '../lib/store'

export default function Slip() {
  const { state, registerSlip } = useStore()
  const [when, setWhen] = useState(toLocalInput())
  const [place, setPlace] = useState('')
  const [triggers, setTriggers] = useState<string[]>([])
  const [before, setBefore] = useState('')
  const [plan, setPlan] = useState('')
  const [saved, setSaved] = useState(false)

  if (saved) {
    const v = VERSES[4]
    return (
      <main className="space-y-5 fade-up">
        <h1 className="font-display text-3xl font-bold">Recomeçar também é caminhar.</h1>
        <div className="card">
          <p>Você foi honesto(a) e isso é coragem. Sua sequência recomeçou hoje, mas os <strong>{totalDays(state)} dias</strong> que você já viveu continuam seus.</p>
        </div>
        <div className="card">
          <blockquote className="font-display text-lg">“{v.text}”</blockquote>
          <p className="mt-2 text-sm font-semibold text-muted">{v.ref} · ACF</p>
        </div>
        <Link to="/" className="btn-primary w-full">Voltar para hoje</Link>
      </main>
    )
  }

  const toggle = (t: string) => setTriggers((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))
  const at = new Date(when)
  const valid = !Number.isNaN(at.getTime())

  return (
    <main className="space-y-5 fade-up">
      <header>
        <h1 className="font-display text-3xl font-bold">Queda sem culpa</h1>
        <p className="mt-2 text-muted">Aqui não tem julgamento. Entender o que aconteceu ajuda a se preparar melhor. Responda só o que quiser.</p>
      </header>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          registerSlip({ at: at.toISOString(), place, triggers, before: before.trim(), plan: plan.trim() })
          setSaved(true)
        }}
      >
        <div>
          <label className="label" htmlFor="quando">Quando foi?</label>
          <input id="quando" type="datetime-local" className="field" value={when} max={toLocalInput()} onChange={(e) => setWhen(e.target.value)} />
        </div>

        <div>
          <p className="label">Onde você estava?</p>
          <div className="flex flex-wrap gap-2">
            {PLACES.map((p) => (
              <button type="button" key={p} aria-pressed={place === p} onClick={() => setPlace(place === p ? '' : p)} className="chip">{p}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="label">O que estava pesando?</p>
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((t) => (
              <button type="button" key={t} aria-pressed={triggers.includes(t)} onClick={() => toggle(t)} className="chip">{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="antes">O que veio antes?</label>
          <textarea id="antes" className="field py-3" rows={3} value={before} onChange={(e) => setBefore(e.target.value)} placeholder="Como foi o dia, o que você sentia, o que estava fazendo…" />
        </div>

        <div>
          <label className="label" htmlFor="plano">Qual é o seu plano para a próxima vez?</label>
          <textarea id="plano" className="field py-3" rows={3} value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="Ex.: deixar o celular fora do quarto, ligar para meu parceiro, sair para caminhar…" />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={!valid}>Salvar e recomeçar</button>
        <Link to="/" className="btn-ghost w-full">Agora não</Link>
      </form>
    </main>
  )
}
