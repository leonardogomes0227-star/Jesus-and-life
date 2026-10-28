import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Confetti from '../components/Confetti'
import { SOS_ACTIONS, SOS_VERSE } from '../lib/content'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { useStore } from '../lib/store'

const PHASES = [
  { label: 'Inspire', secs: 4, scale: 1 },
  { label: 'Segure', secs: 4, scale: 1 },
  { label: 'Solte devagar', secs: 6, scale: 0.5 },
] as const
const CYCLE = 14
const TOTAL_SECS = 600

const buzz = (ms: number) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* sem vibração */
  }
}

function Breathing() {
  const [phase, setPhase] = useState(0)
  const [left, setLeft] = useState<number>(PHASES[0].secs)
  const [cycles, setCycles] = useState(0)
  const last = useRef(-1)

  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      const e = (Date.now() - t0) / 1000
      const m = e % CYCLE
      const i = m < 4 ? 0 : m < 8 ? 1 : 2
      const end = i === 0 ? 4 : i === 1 ? 8 : 14
      setPhase(i)
      setLeft(Math.max(1, Math.ceil(end - m)))
      setCycles(Math.floor(e / CYCLE))
      if (last.current !== i) {
        last.current = i
        buzz(i === 1 ? 15 : 30)
      }
    }, 150)
    return () => clearInterval(id)
  }, [])

  const p = PHASES[phase]
  const tr = `transform ${phase === 1 ? 0 : p.secs}s ease-in-out`
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-64 w-64 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-accent/10" style={{ transform: `scale(${p.scale})`, transition: tr }} />
        <div className="absolute inset-4 rounded-full bg-accent/20" style={{ transform: `scale(${p.scale})`, transition: tr }} />
        <div className="absolute inset-10 rounded-full bg-accent/35 shadow-[0_0_60px_rgb(var(--accent)/0.35)]" style={{ transform: `scale(${p.scale})`, transition: tr }} />
        <div className="relative text-center" aria-live="polite">
          <p className="font-display text-2xl font-bold">{p.label}</p>
          <p className="font-display text-5xl font-bold text-accent">{left}</p>
        </div>
      </div>
      <p className="text-sm text-muted">Respiração 4 · 4 · 6 {cycles > 0 && `· ${cycles} ${cycles === 1 ? 'ciclo' : 'ciclos'}`}</p>
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
  const pct = ((TOTAL_SECS - secs) / TOTAL_SECS) * 100
  return (
    <div className="card text-center">
      <p className="label">A vontade passa em ondas. Fique mais 10 minutos.</p>
      <p className="font-display text-5xl font-bold tabular-nums" role="timer">{secs === 0 ? 'Você conseguiu!' : `${mm}:${ss}`}</p>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-sun transition-all" style={{ width: `${pct}%` }} /></div>
      <p className="mt-2 text-xs text-muted">{secs === 0 ? 'A parte mais difícil já passou.' : `${Math.round(pct)}% do caminho`}</p>
    </div>
  )
}

const ENCOURAGE = [
  'Isso é uma onda. Ela sobe, chega ao topo e desce.',
  'Você não precisa decidir o resto da vida, só os próximos minutos.',
  'Pedir ajuda é força, não fraqueza.',
  'Deus não está decepcionado com você. Ele está aqui.',
  'Cada minuto que você espera enfraquece a vontade.',
]

export default function Sos() {
  const { state, logSos } = useStore()
  const navigate = useNavigate()
  const [done, setDone] = useState<string[]>([])
  const [won, setWon] = useState(false)
  const [msg, setMsg] = useState(0)
  const partnerOk = !!normalizePhone(state.partner.phone)
  const waves = state.sos.filter((s) => s.outcome === 'passed').length
  const lastPlan = useMemo(() => [...state.slips].reverse().find((s) => s.plan)?.plan, [state.slips])
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  useEffect(() => {
    const id = setInterval(() => setMsg((m) => (m + 1) % ENCOURAGE.length), 9000)
    return () => clearInterval(id)
  }, [])

  if (won) {
    return (
      <div data-theme="dark" className="flex min-h-screen items-center justify-center bg-bg px-6 text-ink">
        <Confetti />
        <div className="pop max-w-sm text-center">
          <div className="text-7xl" aria-hidden>🌊</div>
          <h1 className="mt-4 font-display text-4xl font-bold">A onda passou.</h1>
          <p className="mt-3 text-lg text-muted">Você esperou, respirou e continuou. Isso é força de verdade.{waves > 0 && ` É a sua ${waves}ª onda vencida.`}</p>
          <button className="btn-primary mt-8 w-full" onClick={() => navigate('/', { replace: true })}>Voltar para hoje</button>
        </div>
      </div>
    )
  }

  return (
    <div data-theme="dark" className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgb(var(--accent)/0.18),transparent_60%)] bg-bg text-ink">
      <main className="mx-auto w-full max-w-[520px] space-y-5 px-5 pb-12 pt-[max(1.25rem,env(safe-area-inset-top))] fade-up">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Você não está sozinho(a)</h1>
          <Link to="/" aria-label="Fechar" className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-xl">×</Link>
        </div>
        <p key={msg} className="fade-up min-h-[3.5rem] text-lg text-muted">{ENCOURAGE[msg]}</p>

        <Breathing />
        <Countdown />

        {(state.profile?.why || waves > 0) && (
          <section className="card space-y-3">
            {state.profile?.why && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-sun">Lembre do seu porquê</p>
                <p className="mt-1 font-display text-xl leading-snug">“{state.profile.why}”</p>
              </div>
            )}
            {waves > 0 && <p className="text-sm text-muted">Você já passou por <strong className="text-ink">{waves}</strong> {waves === 1 ? 'onda' : 'ondas'} antes. Dá para passar por esta também.</p>}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">Faça algo agora</h2>
          {SOS_ACTIONS.map((a) => (
            <button key={a.id} onClick={() => { toggle(a.id); buzz(20) }} aria-pressed={done.includes(a.id)} className={`flex min-h-[68px] w-full items-center gap-3 rounded-3xl border p-4 text-left transition active:scale-[0.99] ${done.includes(a.id) ? 'border-accent bg-accent/15' : 'border-line bg-surface'}`}>
              <span className="text-2xl" aria-hidden>{done.includes(a.id) ? '✅' : a.icon}</span>
              <span><span className="block font-semibold">{a.title}</span><span className="block text-sm text-muted">{a.hint}</span></span>
            </button>
          ))}
          {lastPlan && (
            <div className="rounded-3xl border border-sun/50 bg-sun/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-sun">Seu plano</p>
              <p className="mt-1">{lastPlan}</p>
            </div>
          )}
        </section>

        <section className="card">
          <blockquote className="font-display text-lg leading-snug">“{SOS_VERSE.text}”</blockquote>
          <p className="mt-2 text-sm font-semibold text-muted">{SOS_VERSE.ref} · ACF</p>
        </section>

        <section className="grid gap-3">
          {partnerOk ? (
            <a className="btn-ghost" href={waLink(state.partner.phone, 'Oi! Estou num momento difícil agora e queria sua companhia. Pode conversar comigo um pouco?')} target="_blank" rel="noopener noreferrer">💬 Chamar {state.partner.name || 'meu parceiro'} no WhatsApp</a>
          ) : (
            <Link className="btn-ghost" to="/parceiro">💬 Cadastrar um parceiro de confiança</Link>
          )}
          <a className="btn-ghost" href="tel:188">📞 Ligar para o CVV · 188 (24h, gratuito)</a>
        </section>

        <section className="grid gap-3 pt-2">
          <button className="btn-primary w-full" onClick={() => { logSos('passed'); buzz(80); setWon(true) }}>A onda passou</button>
          <button className="btn-ghost w-full" onClick={() => { logSos('slipped'); navigate('/queda', { replace: true }) }}>Não segurei desta vez</button>
          <p className="text-center text-sm text-muted">Nas duas opções, você continua sendo amado(a) e pode recomeçar.</p>
        </section>
      </main>
    </div>
  )
}
