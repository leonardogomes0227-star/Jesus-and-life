import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AudioPlayer from '../components/AudioPlayer'
import Respire from '../components/Respire'
import { AUDIO_SESSIONS } from '../lib/audio'
import { SOS_VERSE, TRIGGERS } from '../lib/content'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { useStore } from '../lib/store'

type Step = 'sair' | 'respirar' | 'corpo' | 'nomear' | 'alguem' | 'esperar'
const STEPS: Step[] = ['sair', 'respirar', 'corpo', 'nomear', 'alguem', 'esperar']
const TOTAL_SECS = 600

const HELPED = [
  { id: 'sair', label: 'Sair do lugar' },
  { id: 'respirar', label: 'Respirar' },
  { id: 'corpo', label: 'Água e mexer o corpo' },
  { id: 'nomear', label: 'Dar nome ao que eu sentia' },
  { id: 'alguem', label: 'Falar com alguém' },
  { id: 'orar', label: 'Orar' },
  { id: 'audio', label: 'O áudio' },
  { id: 'esperar', label: 'Esperar o tempo passar' },
]

const buzz = (ms: number) => {
  try { navigator.vibrate?.(ms) } catch { /* sem vibração */ }
}

/** SOS: uma coisa de cada vez, do primeiro segundo até o fim da onda. Funciona sem internet. */
export default function Sos() {
  const { state, sosOpen, sosClose } = useStore()
  const navigate = useNavigate()
  const id = useRef(crypto.randomUUID())
  const end = useRef(Date.now() + TOTAL_SECS * 1000)
  const [secs, setSecs] = useState(TOTAL_SECS)
  const [i, setI] = useState(0)
  const [trigger, setTrigger] = useState('')
  const [used, setUsed] = useState<string[]>([])
  const [audio, setAudio] = useState(false)
  const [result, setResult] = useState<'passou' | 'caiu' | null>(null)
  const [helped, setHelped] = useState<string[]>([])

  useEffect(() => { sosOpen(id.current) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setInterval(() => setSecs(Math.max(0, Math.ceil((end.current - Date.now()) / 1000))), 500)
    return () => clearInterval(t)
  }, [])

  const step = STEPS[i]
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const partnerOk = !!normalizePhone(state.partner.phone)
  const waves = state.sos.filter((s) => s.outcome === 'passed').length
  const lastPlan = [...state.slips].reverse().find((s) => s.plan)?.plan
  const rules = state.plan?.rules ?? []
  const myRules = (trigger ? rules.filter((r) => r.trigger === trigger) : []).concat(rules.filter((r) => r.trigger !== trigger)).slice(0, 3)

  const counts = new Map<string, number>()
  state.sos.forEach((e) => e.helped?.forEach((h) => counts.set(h, (counts.get(h) ?? 0) + 1)))
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => HELPED.find((h) => h.id === k)?.label.toLowerCase()).filter(Boolean)

  const mark = (k: string) => setUsed((u) => (u.includes(k) ? u : [...u, k]))
  const go = (k?: string) => { if (k) mark(k); buzz(20); setI((n) => Math.min(STEPS.length - 1, n + 1)) }
  const toStep = (s: Step) => setI(STEPS.indexOf(s))
  /** O passo conta como "ajudou" se a pessoa o cumpriu (no passo de nomear, só se escolheu algo). */
  const next = () => go(step === 'sair' || step === 'respirar' || step === 'corpo' || (step === 'nomear' && trigger) ? step : undefined)

  const close = (outcome: 'passed' | 'slipped') => sosClose(id.current, outcome, { trigger: trigger || undefined, helped: outcome === 'passed' ? helped : used })

  /* ---------- Finais ---------- */
  if (result === 'passou') {
    return (
      <div data-theme="dark" className="min-h-screen bg-bg text-ink">
        <main className="mx-auto max-w-[520px] space-y-6 px-5 py-14">
          <h1 className="font-display text-5xl font-semibold leading-tight">Você atravessou.</h1>
          <p className="text-lg leading-relaxed text-muted">A vontade subiu, chegou ao topo e desceu. Você esperou, e isso é força de verdade.{waves + 1 > 1 && ` Esta foi a sua ${waves + 1}ª onda vencida.`}</p>
          <section>
            <h2 className="font-display text-xl font-semibold">O que mais ajudou?</h2>
            <p className="mb-3 mt-1 text-sm text-muted">Marque o que funcionou. Na próxima vez, o SOS lembra você disso.</p>
            <div className="flex flex-wrap gap-2">
              {HELPED.map((h) => <button key={h.id} aria-pressed={helped.includes(h.id)} onClick={() => setHelped((l) => (l.includes(h.id) ? l.filter((x) => x !== h.id) : [...l, h.id]))} className="chip">{h.label}</button>)}
            </div>
          </section>
          <button className="btn-primary w-full" onClick={() => { close('passed'); navigate('/', { replace: true }) }}>Guardar e voltar</button>
        </main>
      </div>
    )
  }

  if (result === 'caiu') {
    return (
      <div data-theme="dark" className="min-h-screen bg-bg text-ink">
        <main className="mx-auto max-w-[520px] space-y-6 px-5 py-14">
          <h1 className="font-display text-5xl font-semibold leading-tight">Tudo bem.</h1>
          <p className="text-lg leading-relaxed text-muted">Uma queda não apaga o que você construiu, e não diz quem você é. Respire. O que importa agora é o próximo passo.</p>
          <blockquote className="rounded-3xl border border-line bg-surface p-6">
            <p className="font-display text-xl leading-snug">“Porque sete vezes cai o justo, e se levanta.”</p>
            <p className="mt-2 text-sm text-muted">Provérbios 24:16 · ACF</p>
          </blockquote>
          <div className="grid gap-3">
            <button className="btn-primary w-full" onClick={() => { close('slipped'); navigate(`/queda${trigger ? `?t=${encodeURIComponent(trigger)}` : ''}`, { replace: true }) }}>Registrar o que aconteceu</button>
            <button className="btn-ghost w-full" onClick={() => setResult(null)}>Respirar mais um pouco</button>
            <button className="min-h-[48px] text-sm font-semibold text-muted underline" onClick={() => { close('slipped'); navigate('/', { replace: true }) }}>Agora não</button>
          </div>
        </main>
      </div>
    )
  }

  /* ---------- Passos ---------- */
  return (
    <div data-theme="dark" className="min-h-screen bg-bg text-ink">
      <main className="mx-auto flex min-h-screen max-w-[520px] flex-col px-5 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted" role="timer" aria-label="Tempo da onda">Onda · {secs === 0 ? '10 min' : `${mm}:${ss}`}</p>
          <Link to="/" aria-label="Fechar" className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-xl">×</Link>
        </header>
        <div className="mt-3 flex gap-1.5" aria-hidden>{STEPS.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-sun' : 'bg-line'}`} />)}</div>

        <div key={step} className="fade-up flex flex-1 flex-col justify-center py-8">
          {step === 'sair' && (
            <section className="space-y-5">
              <h1 className="font-display text-5xl font-semibold leading-tight">Levante e saia deste lugar.</h1>
              <p className="text-lg leading-relaxed text-muted">Vá para um cômodo com gente ou para o ar livre. Mudar de lugar quebra o ciclo mais rápido do que qualquer pensamento.</p>
              {top.length > 0 && <p className="rounded-2xl border border-line bg-surface p-4 text-sm">Da última vez, o que mais ajudou você: <strong>{top.join(' e ')}</strong>.</p>}
            </section>
          )}
          {step === 'respirar' && (
            <section className="space-y-4 text-center">
              <h1 className="font-display text-4xl font-semibold">Respire comigo.</h1>
              <Respire />
              <p className="text-muted">Faça pelo menos três respirações completas.</p>
            </section>
          )}
          {step === 'corpo' && (
            <section className="space-y-5">
              <h1 className="font-display text-5xl font-semibold leading-tight">Beba água e mexa o corpo.</h1>
              <p className="text-lg leading-relaxed text-muted">Um copo de água, depois um minuto de movimento: agachamentos, flexões ou uma caminhada rápida pela casa. O corpo em movimento tira a mente do automático.</p>
            </section>
          )}
          {step === 'nomear' && (
            <section className="space-y-5">
              <h1 className="font-display text-4xl font-semibold leading-tight">O que você está sentindo de verdade?</h1>
              <p className="text-muted">Dar nome ao que sente já tira força da vontade. Escolha o que mais se parece com agora.</p>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((t) => <button key={t} aria-pressed={trigger === t} onClick={() => setTrigger(trigger === t ? '' : t)} className="chip">{t}</button>)}
              </div>
              {trigger && rules.some((r) => r.trigger === trigger) && (
                <div className="pop rounded-3xl border border-sun/50 p-5">
                  <p className="text-sm font-semibold text-sun">Pelo seu plano</p>
                  <p className="mt-1 text-lg leading-snug">{rules.find((r) => r.trigger === trigger)!.then}</p>
                </div>
              )}
            </section>
          )}
          {step === 'alguem' && (
            <section className="space-y-5">
              <h1 className="font-display text-4xl font-semibold leading-tight">Você não precisa passar por isso sozinho(a).</h1>
              <div className="grid gap-3">
                {partnerOk ? (
                  <a className="btn-ghost" onClick={() => mark('alguem')} href={waLink(state.partner.phone, 'Oi! Estou num momento difícil agora e queria sua companhia. Pode conversar comigo um pouco?')} target="_blank" rel="noopener noreferrer">Chamar {state.partner.name || 'meu parceiro'} no WhatsApp</a>
                ) : (
                  <Link className="btn-ghost" to="/parceiro">Cadastrar um parceiro de confiança</Link>
                )}
                <a className="btn-ghost" onClick={() => mark('alguem')} href="tel:188">Ligar para o CVV, 188 (24h, gratuito)</a>
              </div>
              <div className="rounded-3xl border border-line bg-surface p-5">
                <p className="font-display text-xl italic leading-relaxed">Senhor, estou aqui e preciso de ti agora. Fica comigo nos próximos minutos. Amém.</p>
                <button className="mt-3 min-h-[44px] text-sm font-semibold underline" onClick={() => mark('orar')}>{used.includes('orar') ? 'Orei' : 'Fiz esta oração'}</button>
              </div>
            </section>
          )}
          {step === 'esperar' && (
            <section className="space-y-5">
              <h1 className="font-display text-4xl font-semibold leading-tight">A onda sobe, chega ao topo e desce.</h1>
              <p className="font-display text-7xl font-semibold tabular-nums text-sun">{secs === 0 ? '0:00' : `${mm}:${ss}`}</p>
              <p className="text-muted">{secs === 0 ? 'Os 10 minutos passaram. O pior já ficou para trás.' : 'Fique mais um pouco. A parte mais difícil costuma passar nos primeiros minutos.'}</p>
              {state.profile?.why && <div className="rounded-3xl border border-line bg-surface p-5"><p className="text-sm font-semibold text-sun">O seu porquê</p><p className="mt-1 font-display text-xl leading-snug">“{state.profile.why}”</p></div>}
              {myRules.length > 0 ? (
                <div className="rounded-3xl border border-sun/50 p-5">
                  <p className="text-sm font-semibold text-sun">O seu plano</p>
                  <ul className="mt-2 space-y-2">{myRules.map((r) => <li key={r.id} className="leading-snug"><span className="text-muted">Se {r.when.charAt(0).toLowerCase() + r.when.slice(1)}:</span> {r.then}</li>)}</ul>
                </div>
              ) : lastPlan ? (
                <div className="rounded-3xl border border-sun/50 p-5"><p className="text-sm font-semibold text-sun">O seu plano</p><p className="mt-1">{lastPlan}</p></div>
              ) : (
                <Link to="/plano" className="block rounded-3xl border border-line p-5 text-sm text-muted underline">Você ainda não tem um plano. Monte o seu depois que a onda passar.</Link>
              )}
              <blockquote className="rounded-3xl border border-line bg-surface p-5">
                <p className="font-display text-lg leading-snug">“{SOS_VERSE.text}”</p>
                <p className="mt-2 text-sm text-muted">{SOS_VERSE.ref} · ACF</p>
              </blockquote>
              {audio ? <AudioPlayer session={AUDIO_SESSIONS[0]} onClose={() => setAudio(false)} /> : <button className="btn-ghost w-full" onClick={() => { setAudio(true); mark('audio') }}>Ouvir o áudio de 3 minutos</button>}
            </section>
          )}
        </div>

        <div className="space-y-3">
          {step === 'esperar' ? (
            <>
              <button className="btn-primary w-full" onClick={() => { setHelped(Array.from(new Set([...used, 'esperar']))); setResult('passou') }}>A onda passou</button>
              <button className="btn-ghost w-full" onClick={() => setResult('caiu')}>Não segurei desta vez</button>
            </>
          ) : (
            <>
              <button className="btn-primary w-full" onClick={next}>
                {step === 'sair' ? 'Já saí' : step === 'respirar' ? 'Continuar' : step === 'corpo' ? 'Feito' : step === 'nomear' ? (trigger ? 'Continuar' : 'Pular') : 'Continuar'}
              </button>
              {step === 'sair' && <button className="btn-ghost w-full" onClick={() => go()}>Não consigo agora</button>}
              {step !== 'alguem' && <button className="min-h-[48px] w-full text-sm font-semibold underline" onClick={() => toStep('alguem')}>Preciso falar com alguém agora</button>}
            </>
          )}
          {step !== 'esperar' && (
            <p className="flex justify-center gap-4 pt-1 text-xs text-muted">
              <button className="min-h-[44px] underline" onClick={() => { setHelped(used); setResult('passou') }}>A onda passou</button>
              <button className="min-h-[44px] underline" onClick={() => setResult('caiu')}>Não segurei</button>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
