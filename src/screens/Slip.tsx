import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LiberdadeTabs from '../components/LiberdadeTabs'
import { PARTNER_MESSAGES, PLACES, TRIGGERS, VERSES } from '../lib/content'
import { toLocalInput } from '../lib/dates'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { totalDays, useStore } from '../lib/store'

type Phase = 'acolher' | 'quando' | 'antes' | 'depois' | 'fim'
const ORDER: Phase[] = ['quando', 'antes', 'depois']
const LABEL: Record<string, string> = { quando: 'Quando', antes: 'O que veio antes', depois: 'Daqui para frente' }
const verse = (ref: string) => VERSES.find((v) => v.ref === ref)!

const ago = (h: number) => toLocalInput(new Date(Date.now() - h * 3600000))

/** Recomeço sem culpa: acolher primeiro, perguntar pouco e transformar o que aconteceu em ajuste no plano. */
export default function Slip() {
  const { state, registerSlip, update } = useStore()
  const [sp] = useSearchParams()
  const [phase, setPhase] = useState<Phase>('acolher')
  const [when, setWhen] = useState(toLocalInput())
  const [quick, setQuick] = useState('Agora há pouco')
  const [place, setPlace] = useState('')
  const [triggers, setTriggers] = useState<string[]>(sp.get('t') ? [sp.get('t')!] : [])
  const [before, setBefore] = useState('')
  const [ifText, setIfText] = useState('')
  const [thenText, setThenText] = useState('')
  const [addedRule, setAddedRule] = useState(false)

  const rules = state.plan?.rules ?? []
  const fromPlan = (triggers[0] ? rules.filter((r) => r.trigger === triggers[0]) : []).concat(rules.filter((r) => r.trigger !== triggers[0])).slice(0, 2)
  const partnerOk = !!normalizePhone(state.partner.phone)

  const save = (minimal: boolean) => {
    const at = new Date(minimal ? Date.now() : when)
    registerSlip({ at: (Number.isNaN(+at) ? new Date() : at).toISOString(), place: minimal ? '' : place, triggers: minimal ? [] : triggers, before: minimal ? '' : before.trim(), plan: minimal ? '' : thenText.trim() })
    if (!minimal && state.plan && ifText.trim() && thenText.trim()) {
      update((s) => (s.plan ? { ...s, plan: { ...s.plan, updatedAt: new Date().toISOString(), triggers: triggers[0] && !s.plan.triggers.includes(triggers[0]) ? [...s.plan.triggers, triggers[0]] : s.plan.triggers, rules: [...s.plan.rules, { id: crypto.randomUUID(), trigger: triggers[0] ?? '', when: ifText.trim(), then: thenText.trim() }] } } : s))
      setAddedRule(true)
    }
    setPhase('fim')
  }

  /* ---------- Começo: acolher, antes de qualquer pergunta ---------- */
  if (phase === 'acolher') {
    const v = verse('Provérbios 24:16')
    return (
      <main className="space-y-8 pb-8">
        <LiberdadeTabs />
        <header className="space-y-3">
          <h1 className="font-display text-5xl font-semibold leading-tight">Primeiro, respire.</h1>
          <p className="text-lg leading-relaxed text-muted">Uma queda não apaga o que você construiu e não diz quem você é. Você já está fazendo a parte mais difícil, que é voltar.</p>
        </header>
        <blockquote className="rounded-3xl bg-sand p-6 text-sand-ink">
          <p className="font-display text-2xl leading-snug">“{v.text}”</p>
          <p className="mt-2 text-sm font-semibold opacity-70">{v.ref} · ACF</p>
        </blockquote>
        <p className="leading-relaxed text-muted">Você escolhe como quer fazer: pode só recomeçar agora, ou contar o que aconteceu para entender melhor e se preparar. São três perguntas curtas, todas opcionais.</p>
        <div className="grid gap-3">
          <button className="btn-primary w-full" onClick={() => setPhase('quando')}>Contar o que aconteceu</button>
          <button className="btn-ghost w-full" onClick={() => save(true)}>Só recomeçar agora, sem detalhes</button>
          <Link to="/" className="flex min-h-[48px] items-center justify-center text-sm font-semibold text-muted underline">Agora não</Link>
        </div>
      </main>
    )
  }

  /* ---------- Fim: o que foi guardado e o que vem agora ---------- */
  if (phase === 'fim') {
    const lm = verse('Lamentações 3:22-23')
    return (
      <main className="space-y-7 py-6">
        <h1 className="font-display text-5xl font-semibold leading-tight">Você recomeçou.</h1>
        <p className="text-lg leading-relaxed text-muted">Sua sequência recomeça hoje, no dia 1. Os <strong className="text-ink">{totalDays(state)} {totalDays(state) === 1 ? 'dia' : 'dias'} acumulados</strong> continuam seus, e o que você viveu até aqui não se perde.</p>
        {addedRule && <p className="rounded-2xl bg-sand p-4 text-sand-ink">Adicionei ao seu plano: <strong>se {ifText.trim().charAt(0).toLowerCase() + ifText.trim().slice(1)}, então {thenText.trim().charAt(0).toLowerCase() + thenText.trim().slice(1)}</strong></p>}
        <blockquote className="rounded-3xl bg-night p-6 text-night-ink">
          <p className="font-display text-2xl leading-snug">“{lm.text}”</p>
          <p className="mt-2 text-sm opacity-70">{lm.ref} · ACF</p>
        </blockquote>
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Para os próximos passos</h2>
          {partnerOk ? (
            <a className="btn-ghost w-full" href={waLink(state.partner.phone, PARTNER_MESSAGES[2].text)} target="_blank" rel="noopener noreferrer">Contar ao {state.partner.name || 'meu parceiro'}</a>
          ) : (
            <Link to="/parceiro" className="btn-ghost w-full">Escolher alguém para caminhar comigo</Link>
          )}
          <Link to="/plano" className="btn-ghost w-full">{state.plan ? 'Ver o meu plano' : 'Montar o meu plano'}</Link>
          <Link to="/noite" className="btn-ghost w-full">Entregar este dia a Deus</Link>
        </section>
        <p className="text-sm text-muted">Amanhã cedo, o Momento com Deus está esperando por você.</p>
        <Link to="/" className="btn-primary w-full">Voltar ao início</Link>
      </main>
    )
  }

  /* ---------- Meio: três perguntas curtas ---------- */
  const i = ORDER.indexOf(phase)
  const toggle = (t: string) => setTriggers((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))
  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button className="flex min-h-[48px] items-center text-sm font-semibold text-muted" onClick={() => setPhase(i === 0 ? 'acolher' : ORDER[i - 1])}>← Voltar</button>
        <span className="text-sm font-semibold text-muted">{LABEL[phase]} · {i + 1} de 3</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{ORDER.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={phase} className="fade-up space-y-5">
        {phase === 'quando' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Quando foi?</h1>
            <div className="flex flex-wrap gap-2">
              {([['Agora há pouco', 0], ['Hoje mais cedo', 4], ['Ontem', 24]] as const).map(([l, h]) => <button key={l} className="chip" aria-pressed={quick === l} onClick={() => { setQuick(l); setWhen(ago(h)) }}>{l}</button>)}
            </div>
            <div><label className="label" htmlFor="quando">Ou escolha o horário</label><input id="quando" type="datetime-local" className="field" value={when} max={toLocalInput()} onChange={(e) => { setQuick(''); setWhen(e.target.value) }} /></div>
            <div><p className="label">Onde você estava?</p><div className="flex flex-wrap gap-2">{PLACES.map((p) => <button key={p} aria-pressed={place === p} onClick={() => setPlace(place === p ? '' : p)} className="chip">{p}</button>)}</div></div>
          </>
        )}
        {phase === 'antes' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">O que veio antes?</h1>
            <p className="text-muted">Entender o antes é o que muda o depois. Sem se julgar.</p>
            <div className="flex flex-wrap gap-2">{TRIGGERS.map((t) => <button key={t} aria-pressed={triggers.includes(t)} onClick={() => toggle(t)} className="chip">{t}</button>)}</div>
            <div><label className="label" htmlFor="antes">O que estava acontecendo? (opcional)</label><textarea id="antes" className="field py-3" rows={3} value={before} onChange={(e) => setBefore(e.target.value)} placeholder="Como foi o dia, o que você sentia, o que estava fazendo…" /></div>
          </>
        )}
        {phase === 'depois' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">O que muda da próxima vez?</h1>
            <p className="text-muted">Uma regra simples, do tipo “se isso acontecer, eu faço aquilo”. {state.plan ? 'Ela entra no seu plano.' : 'Você pode montar um plano completo depois.'}</p>
            {fromPlan.length > 0 && (
              <div className="space-y-2">
                <p className="label">Do seu plano</p>
                {fromPlan.map((r) => <button key={r.id} className="block w-full rounded-2xl border border-line bg-surface p-4 text-left active:scale-[0.99]" onClick={() => { setIfText(r.when); setThenText(r.then) }}><span className="block text-sm font-semibold text-muted">Se {r.when.charAt(0).toLowerCase() + r.when.slice(1)}</span><span className="mt-1 block">então {r.then.charAt(0).toLowerCase() + r.then.slice(1)}</span></button>)}
              </div>
            )}
            <div><label className="label" htmlFor="se">Se…</label><input id="se" className="field" value={ifText} onChange={(e) => setIfText(e.target.value)} placeholder={before.trim() || 'Ex.: estou sozinho(a) no quarto à noite'} /></div>
            <div><label className="label" htmlFor="entao">Então eu vou…</label><input id="entao" className="field" value={thenText} onChange={(e) => setThenText(e.target.value)} placeholder="Ex.: sair do quarto e ligar para alguém" /></div>
          </>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {phase === 'depois' ? <button className="btn-primary w-full" onClick={() => save(false)}>Recomeçar</button> : <button className="btn-primary w-full" onClick={() => setPhase(ORDER[i + 1])}>Continuar</button>}
        {phase !== 'depois' && <button className="min-h-[48px] text-sm font-semibold text-muted underline" onClick={() => save(false)}>Pular e recomeçar</button>}
      </div>
    </main>
  )
}
