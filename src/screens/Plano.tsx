import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LiberdadeTabs from '../components/LiberdadeTabs'
import { TRIGGERS } from '../lib/content'
import { fmtDate } from '../lib/dates'
import { ENV_DEFAULTS, RULE_SUGGESTIONS, TIME_BLOCKS, history, newEnv, planMessage } from '../lib/plano'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { useStore } from '../lib/store'
import type { MyPlan, PlanRule } from '../lib/types'

const STEPS = ['O porquê', 'Gatilhos', 'Regras', 'Ambiente', 'Pessoas']
const rid = () => crypto.randomUUID()

function Builder({ onDone }: { onDone: () => void }) {
  const { state, update } = useStore()
  const h = useMemo(() => history(state), []) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [why, setWhy] = useState(state.profile?.why ?? '')
  const [triggers, setTriggers] = useState<string[]>(h.triggers.map(([t]) => t).filter((t) => TRIGGERS.includes(t)).slice(0, 3))
  const [times, setTimes] = useState<string[]>(h.topBlock >= 0 ? [TIME_BLOCKS[h.topBlock]] : [])
  const [rules, setRules] = useState<PlanRule[]>([])
  const [envSel, setEnvSel] = useState<string[]>([])
  const [cWhen, setCWhen] = useState('')
  const [cThen, setCThen] = useState('')

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const hasRule = (t: string, then: string) => rules.some((r) => r.trigger === t && r.then === then)
  const toggleRule = (trigger: string, when: string, then: string) =>
    setRules((l) => (hasRule(trigger, then) ? l.filter((r) => !(r.trigger === trigger && r.then === then)) : [...l, { id: rid(), trigger, when, then }]))

  const finish = () => {
    const now = new Date().toISOString()
    const plan: MyPlan = { createdAt: now, updatedAt: now, triggers, times, rules, env: newEnv(envSel) }
    update((s) => ({ ...s, plan, profile: s.profile ? { ...s.profile, why: why.trim() || s.profile.why } : s.profile }))
    onDone()
  }

  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/trilha" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Trilhas</Link>
        <span className="text-sm font-semibold text-muted">{STEPS[i]} · {i + 1} de {STEPS.length}</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{STEPS.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={i} className="fade-up space-y-5">
        {i === 0 && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Vamos montar o seu plano.</h1>
            <p className="text-lg text-muted">Um plano feito agora, com a cabeça tranquila, vale muito mais do que decidir no meio da vontade. Leva uns cinco minutos.</p>
            <div>
              <label className="label" htmlFor="why">Por que você está nessa caminhada?</label>
              <textarea id="why" className="field py-3" rows={3} maxLength={280} value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Ex.: ter paz com Deus e comigo mesmo; viver sem segredos; ser exemplo para minha família." />
              <p className="mt-2 text-sm text-muted">Essa frase aparece no SOS, nos dias difíceis.</p>
            </div>
          </>
        )}

        {i === 1 && (
          <>
            <h1 className="font-display text-3xl font-semibold">O que costuma puxar você?</h1>
            <p className="text-muted">Escolha o que mais se repete. {h.triggers.length > 0 && 'Já marcamos o que apareceu nos seus registros.'}</p>
            <div className="flex flex-wrap gap-2">{TRIGGERS.map((t) => <button key={t} aria-pressed={triggers.includes(t)} onClick={() => setTriggers(toggle(triggers, t))} className="chip">{t}</button>)}</div>
            <div>
              <p className="label">Em que parte do dia é mais difícil?</p>
              <div className="flex flex-wrap gap-2">{TIME_BLOCKS.map((t) => <button key={t} aria-pressed={times.includes(t)} onClick={() => setTimes(toggle(times, t))} className="chip">{t}</button>)}</div>
            </div>
          </>
        )}

        {i === 2 && (
          <>
            <h1 className="font-display text-3xl font-semibold">O que você faz quando isso acontece?</h1>
            <p className="text-muted">Regras do tipo “se isso, então aquilo”. Escolha as que fazem sentido para você ou escreva a sua.</p>
            {triggers.length === 0 && <p className="card text-muted">Volte e escolha pelo menos um gatilho, ou escreva uma regra própria abaixo.</p>}
            {triggers.map((t) => (
              <section key={t} className="space-y-2">
                <h2 className="font-display text-xl font-semibold">{t}</h2>
                {(RULE_SUGGESTIONS[t] ?? []).map((sg) => (
                  <button key={sg.then} aria-pressed={hasRule(t, sg.then)} onClick={() => toggleRule(t, sg.when, sg.then)} className={`block w-full rounded-2xl border p-4 text-left transition ${hasRule(t, sg.then) ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface'}`}>
                    <span className="block text-sm font-semibold opacity-70">Se {sg.when.charAt(0).toLowerCase() + sg.when.slice(1)}</span>
                    <span className="mt-1 block">então {sg.then.charAt(0).toLowerCase() + sg.then.slice(1)}</span>
                  </button>
                ))}
              </section>
            ))}
            <section className="card space-y-3">
              <h2 className="font-display text-xl font-semibold">Escrever a minha</h2>
              <input className="field" value={cWhen} onChange={(e) => setCWhen(e.target.value)} placeholder="Se… (ex.: estou sozinho(a) à noite)" aria-label="Se" />
              <input className="field" value={cThen} onChange={(e) => setCThen(e.target.value)} placeholder="Então… (ex.: saio do quarto e ligo para alguém)" aria-label="Então" />
              <button className="btn-ghost w-full" disabled={!cWhen.trim() || !cThen.trim()} onClick={() => { setRules((l) => [...l, { id: rid(), trigger: triggers[0] || '', when: cWhen.trim(), then: cThen.trim() }]); setCWhen(''); setCThen('') }}>Adicionar regra</button>
              {rules.filter((r) => !(RULE_SUGGESTIONS[r.trigger] ?? []).some((x) => x.then === r.then)).map((r) => (
                <p key={r.id} className="rounded-xl bg-bg p-3 text-sm">Se {r.when}, então {r.then} <button className="ml-2 underline" onClick={() => setRules((l) => l.filter((x) => x.id !== r.id))}>remover</button></p>
              ))}
            </section>
            <p className="text-sm text-muted">{rules.length} {rules.length === 1 ? 'regra escolhida' : 'regras escolhidas'}.</p>
          </>
        )}

        {i === 3 && (
          <>
            <h1 className="font-display text-3xl font-semibold">Facilite as coisas para você.</h1>
            <p className="text-muted">Mudar o ambiente costuma funcionar mais do que depender de força de vontade. Marque o que você quer incluir no plano.</p>
            <div className="space-y-2">
              {ENV_DEFAULTS.map((e) => (
                <button key={e} aria-pressed={envSel.includes(e)} onClick={() => setEnvSel(toggle(envSel, e))} className={`block w-full rounded-2xl border p-4 text-left transition ${envSel.includes(e) ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface'}`}>{e}</button>
              ))}
            </div>
          </>
        )}

        {i === 4 && (
          <>
            <h1 className="font-display text-3xl font-semibold">Quem pode caminhar com você?</h1>
            <p className="text-muted">Contar o seu plano a alguém de confiança aumenta muito a chance de ele funcionar.</p>
            <div className="card">
              {state.partner.name ? (
                <p>Seu parceiro: <strong>{state.partner.name}</strong>. Depois de salvar, você pode enviar o plano a essa pessoa.</p>
              ) : (
                <p>Você ainda não escolheu um parceiro. <Link to="/parceiro" className="font-semibold underline">Escolher agora</Link> (pode voltar aqui depois).</p>
              )}
            </div>
            <div className="card"><p className="font-semibold">CVV · 188</p><p className="text-sm text-muted">Atende 24 horas, de graça e com sigilo, quando você sentir que precisa conversar.</p></div>
            <div className="rounded-3xl bg-sand p-5 text-sand-ink">
              <p className="font-semibold">Resumo do seu plano</p>
              <p className="mt-1 text-sm">{triggers.length} gatilhos · {rules.length} regras · {envSel.length} mudanças de ambiente</p>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {i < STEPS.length - 1 ? <button className="btn-primary w-full" onClick={() => setI(i + 1)}>{i === 0 && !why.trim() ? 'Pular' : 'Continuar'}</button> : <button className="btn-primary w-full" onClick={finish}>Salvar o meu plano</button>}
        {i > 0 && <button className="btn-ghost w-full" onClick={() => setI(i - 1)}>Voltar</button>}
      </div>
    </main>
  )
}

function View({ onRedo }: { onRedo: () => void }) {
  const { state, update } = useStore()
  const [sp] = useSearchParams()
  const plan = state.plan!
  const h = useMemo(() => history(state), [state.sos, state.slips, state.checkins])
  const [addOpen, setAddOpen] = useState(!!sp.get('then'))
  const [aTrig, setATrig] = useState(sp.get('t') ?? plan.triggers[0] ?? '')
  const [aWhen, setAWhen] = useState('')
  const [aThen, setAThen] = useState(sp.get('then') ?? '')
  const [envNew, setEnvNew] = useState('')
  const [why, setWhy] = useState(state.profile?.why ?? '')
  const partnerOk = !!normalizePhone(state.partner.phone)

  const setPlan = (fn: (p: MyPlan) => MyPlan) => update((s) => (s.plan ? { ...s, plan: { ...fn(s.plan), updatedAt: s.plan.updatedAt } } : s))
  const suggestions = h.triggers.filter(([t, n]) => n >= 2 && (RULE_SUGGESTIONS[t] ?? []).length > 0 && !plan.rules.some((r) => r.trigger === t)).slice(0, 2)
  const done = plan.env.filter((e) => e.done).length

  return (
    <main className="space-y-8 pb-8">
      <LiberdadeTabs />
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight">Meu plano</h1>
        <p className="mt-2 text-muted">Feito com a cabeça tranquila para os momentos difíceis. O SOS usa o que está aqui.</p>
        <p className="mt-1 text-sm text-muted">Última revisão: {fmtDate(plan.updatedAt)} · <button className="font-semibold underline" onClick={() => update((s) => (s.plan ? { ...s, plan: { ...s.plan, updatedAt: new Date().toISOString() } } : s))}>Revisei hoje</button></p>
      </header>

      <section className="rounded-3xl bg-night p-6 text-night-ink">
        <p className="text-sm font-semibold opacity-70">O meu porquê</p>
        <textarea className="mt-2 w-full resize-none bg-transparent font-display text-2xl leading-snug outline-none placeholder:opacity-50" rows={2} value={why} maxLength={280} placeholder="Escreva o motivo que faz você continuar" aria-label="Meu porquê" onChange={(e) => setWhy(e.target.value)} onBlur={() => update((s) => ({ ...s, profile: s.profile ? { ...s.profile, why: why.trim() } : s.profile }))} />
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold">O que puxa e quando</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {plan.triggers.map((t) => <span key={t} className="chip !min-h-[40px] border-accent text-sm">{t}</span>)}
          {plan.times.map((t) => <span key={t} className="chip !min-h-[40px] bg-sand text-sm text-sand-ink">{t}</span>)}
          {plan.triggers.length + plan.times.length === 0 && <p className="text-muted">Nenhum gatilho ainda. Use “Refazer o plano” abaixo.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">O que eu faço</h2>
        {plan.rules.length === 0 && <p className="text-muted">Ainda sem regras. Adicione a primeira.</p>}
        {plan.rules.map((r) => (
          <div key={r.id} className="card !p-4">
            <p className="text-sm font-semibold text-muted">Se {r.when.charAt(0).toLowerCase() + r.when.slice(1)}</p>
            <p className="mt-1 text-lg leading-snug">então {r.then.charAt(0).toLowerCase() + r.then.slice(1)}</p>
            <button className="mt-2 min-h-[44px] text-sm text-muted underline" onClick={() => { if (confirm('Remover esta regra?')) setPlan((p) => ({ ...p, rules: p.rules.filter((x) => x.id !== r.id) })) }}>Remover</button>
          </div>
        ))}
        {suggestions.map(([t, n]) => (
          <div key={t} className="rounded-3xl border border-sun/50 p-5">
            <p className="font-semibold">Você nomeou “{t}” {n} vezes</p>
            <p className="mt-1 text-sm text-muted">Que tal ter uma regra para isso?</p>
            <button className="btn-ghost mt-3 w-full text-sm" onClick={() => { const sg = RULE_SUGGESTIONS[t][0]; setPlan((p) => ({ ...p, triggers: p.triggers.includes(t) ? p.triggers : [...p.triggers, t], rules: [...p.rules, { id: rid(), trigger: t, ...sg }] })) }}>Adicionar: {RULE_SUGGESTIONS[t][0].then}</button>
          </div>
        ))}
        {addOpen ? (
          <div className="card space-y-3 pop">
            <select className="field" value={aTrig} onChange={(e) => setATrig(e.target.value)} aria-label="Gatilho"><option value="">Sem gatilho específico</option>{TRIGGERS.map((t) => <option key={t}>{t}</option>)}</select>
            <input className="field" value={aWhen} onChange={(e) => setAWhen(e.target.value)} placeholder="Se… (ex.: estou sozinho(a) à noite)" aria-label="Se" />
            <input className="field" value={aThen} onChange={(e) => setAThen(e.target.value)} placeholder="Então…" aria-label="Então" />
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-primary !px-3 text-sm" disabled={!aWhen.trim() || !aThen.trim()} onClick={() => { setPlan((p) => ({ ...p, triggers: aTrig && !p.triggers.includes(aTrig) ? [...p.triggers, aTrig] : p.triggers, rules: [...p.rules, { id: rid(), trigger: aTrig, when: aWhen.trim(), then: aThen.trim() }] })); setAWhen(''); setAThen(''); setAddOpen(false) }}>Salvar regra</button>
              <button className="btn-ghost !px-3 text-sm" onClick={() => setAddOpen(false)}>Cancelar</button>
            </div>
          </div>
        ) : <button className="btn-ghost w-full" onClick={() => setAddOpen(true)}>Adicionar uma regra</button>}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between"><h2 className="font-display text-2xl font-semibold">Meu ambiente</h2>{plan.env.length > 0 && <span className="text-sm text-muted">{done} de {plan.env.length} {plan.env.length === 1 ? 'feito' : 'feitos'}</span>}</div>
        {plan.env.map((e) => (
          <button key={e.id} aria-pressed={e.done} onClick={() => setPlan((p) => ({ ...p, env: p.env.map((x) => (x.id === e.id ? { ...x, done: !x.done } : x)) }))} className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-4 text-left ${e.done ? 'border-accent bg-accent/10' : 'border-line bg-surface'}`}>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${e.done ? 'border-accent bg-accent text-accent-ink' : 'border-muted'}`}>{e.done ? '✓' : ''}</span>
            <span>{e.label}</span>
          </button>
        ))}
        <div className="flex gap-2">
          <input className="field" value={envNew} onChange={(e) => setEnvNew(e.target.value)} placeholder="Outra mudança no meu dia a dia" aria-label="Nova mudança de ambiente" />
          <button className="btn-ghost shrink-0 !px-5" disabled={!envNew.trim()} onClick={() => { setPlan((p) => ({ ...p, env: [...p.env, ...newEnv([envNew.trim()])] })); setEnvNew('') }}>Incluir</button>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-2xl font-semibold">Quem caminha comigo</h2>
        <p className="text-muted">{state.partner.name ? `Meu parceiro: ${state.partner.name}.` : 'Ainda sem parceiro.'} Contar o plano a alguém de confiança ajuda ele a funcionar.</p>
        {partnerOk ? <a className="btn-primary w-full" href={waLink(state.partner.phone, planMessage(state))} target="_blank" rel="noopener noreferrer">Enviar o plano ao meu parceiro</a> : <Link to="/parceiro" className="btn-ghost w-full">Escolher meu parceiro</Link>}
        <p className="text-xs text-muted">A mensagem abre no WhatsApp para você revisar. Nada é enviado sozinho.</p>
      </section>

      <button className="min-h-[48px] w-full text-sm font-semibold text-muted underline" onClick={() => { if (confirm('Refazer o plano do zero? Suas regras atuais serão substituídas.')) onRedo() }}>Refazer o plano</button>
    </main>
  )
}

export default function Plano() {
  const { state } = useStore()
  const [building, setBuilding] = useState(!state.plan)
  if (building || !state.plan) return <Builder onDone={() => setBuilding(false)} />
  return <View onRedo={() => setBuilding(true)} />
}
