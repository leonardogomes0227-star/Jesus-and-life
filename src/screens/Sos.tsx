import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SOS_ACTIONS, SOS_VERSE } from '../lib/content'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { useStore } from '../lib/store'

const PHASES = [
  { label: 'Inspire', secs: 4, scale: 1 },
  { label: 'Segure', secs: 4, scale: 1 },
  { label: 'Solte devagar', secs: 6, scale: 0.55 },
] as const
const CYCLE = 14
const TOTAL_SECS = 600

function Breathing() {
  const [phase, setPhase] = useState(0)
  const [left, setLeft] = useState<number>(PHASES[0].secs)

  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      const e = ((Date.now() - t0) / 1000) % CYCLE
      const i = e < 4 ? 0 : e < 8 ? 1 : 2
      const end = i === 0 ? 4 : i === 1 ? 8 : 14
      setPhase(i)
      setLeft(Math.max(1, Math.ceil(end - e)))
    }, 150)
    return () => clearInterval(id)
  }, [])

  const p = PHASES[phase]
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-accent/20" style={{ transform: `scale(${p.scale})`, transition: `transform ${phase === 1 ? 0 : p.secs}s ease-in-out` }} />
        <div className="absolute inset-6 rounded-full bg-accent/30" style={{ transform: `scale(${p.scale})`, transition: `transform ${phase === 1 ? 0 : p.secs}s ease-in-out` }} />
        <div className="relative text-center" aria-live="polite">
          <p className="font-display text-2xl font-bold">{p.label}</p>
          <p className="text-4xl font-bold text-accent">{left}</p>
        </div>
      </div>
      <p className="text-sm text-muted">Respiração 4 · 4 · 6</p>
    </div>
  )
}

function Countdown() {
  const end = useRef(Date.now() + TOTAL_SECS * 1000)
  const [secs, setSecs] = useState(TOTAL_SECS)

  useEffect(() => {
    const id = setInterval(() => setSecs(Math.max(0, Math.ceil((end.current - Date.now()) / 1000))), 500)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  return (
    <div className="card text-center">
      <p className="label">A vontade passa em ondas. Fique mais 10 minutos.</p>
      <p className="font-display text-5xl font-bold tabular-nums" role="timer">{secs === 0 ? 'Você conseguiu esperar' : `${mm}:${ss}`}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-sun transition-all" style={{ width: `${((TOTAL_SECS - secs) / TOTAL_SECS) * 100}%` }} />
      </div>
    </div>
  )
}

export default function Sos() {
  const { state, logSos } = useStore()
  const navigate = useNavigate()
  const [done, setDone] = useState<string[]>([])
  const partnerOk = !!normalizePhone(state.partner.phone)
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  return (
    <div data-theme="dark" className="min-h-screen bg-bg text-ink">
      <main className="mx-auto w-full max-w-[520px] space-y-5 px-5 pb-12 pt-[max(1.25rem,env(safe-area-inset-top))] fade-up">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Você não está sozinho(a)</h1>
          <Link to="/" aria-label="Fechar" className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-xl">×</Link>
        </div>
        <p className="text-muted">Respire comigo. Isso vai passar, e você não precisa vencer tudo agora, só os próximos minutos.</p>

        <Breathing />
        <Countdown />

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">Faça algo agora</h2>
          {SOS_ACTIONS.map((a) => (
            <button key={a.id} onClick={() => toggle(a.id)} aria-pressed={done.includes(a.id)} className={`flex w-full min-h-[64px] items-center gap-3 rounded-3xl border p-4 text-left transition ${done.includes(a.id) ? 'border-accent bg-accent/15' : 'border-line bg-surface'}`}>
              <span className="text-2xl" aria-hidden>{done.includes(a.id) ? '✅' : a.icon}</span>
              <span>
                <span className="block font-semibold">{a.title}</span>
                <span className="block text-sm text-muted">{a.hint}</span>
              </span>
            </button>
          ))}
        </section>

        <section className="card">
          <blockquote className="font-display text-lg leading-snug">“{SOS_VERSE.text}”</blockquote>
          <p className="mt-2 text-sm font-semibold text-muted">{SOS_VERSE.ref} · ACF</p>
        </section>

        <section className="grid gap-3">
          {partnerOk ? (
            <a className="btn-ghost" href={waLink(state.partner.phone, 'Oi! Estou num momento difícil agora e queria sua companhia. Pode conversar comigo um pouco?')} target="_blank" rel="noopener noreferrer">
              💬 Chamar {state.partner.name || 'meu parceiro'} no WhatsApp
            </a>
          ) : (
            <Link className="btn-ghost" to="/parceiro">💬 Cadastrar um parceiro de confiança</Link>
          )}
          <a className="btn-ghost" href="tel:188">📞 Ligar para o CVV · 188 (24h, gratuito)</a>
        </section>

        <section className="grid gap-3 pt-2">
          <button className="btn-primary w-full" onClick={() => { logSos('passed'); navigate('/', { replace: true }) }}>A onda passou</button>
          <button className="btn-ghost w-full" onClick={() => { logSos('slipped'); navigate('/queda', { replace: true }) }}>Não segurei desta vez</button>
          <p className="text-center text-sm text-muted">Nas duas opções, você continua sendo amado(a) e pode recomeçar.</p>
        </section>
      </main>
    </div>
  )
}
