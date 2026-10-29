import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { addDays, dayKey, fmtDate } from '../lib/dates'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { totalDays, useStore } from '../lib/store'

type StepId = 'combinado' | 'preparar' | 'refletir' | 'conversar' | 'combinar'
const LABEL: Record<StepId, string> = { combinado: 'Combinado', preparar: 'Preparar', refletir: 'Refletir', conversar: 'Conversar', combinar: 'Combinar' }
const QUESTIONS = [
  'Como foi a minha semana com Deus?',
  'Onde foi mais difícil? O que estava acontecendo antes?',
  'O que funcionou?',
  'Existe algo que eu estou escondendo ou evitando contar?',
  'Pelo que posso agradecer? Pelo que posso pedir oração?',
]
const ROTEIRO = [
  ['1 min', 'Abrir com uma oração curta', 'Qualquer um pode orar: pedir a Deus que a conversa seja honesta e sem julgamento.'],
  ['3 min cada', 'Cada um conta a semana', 'Quem fala conta o que viveu; quem ouve não interrompe nem aconselha de imediato.'],
  ['1 min', 'A pergunta honesta', '“Houve algo que você não me contou?” Quem pergunta espera, em silêncio.'],
  ['1 min', 'Combinar uma atitude', 'Uma coisa pequena e concreta para cada um fazer até o próximo encontro.'],
  ['1 min', 'Orar um pelo outro', 'Pedir a Deus pelo que o outro contou, e agradecer.'],
]
const SHARE = [
  { id: 'numeros', label: 'Meus números (dias e momentos com Deus)', on: true },
  { id: 'ondas', label: 'As ondas de vontade que venci', on: true },
  { id: 'humor', label: 'Como foi o meu humor na semana', on: true },
  { id: 'queda', label: 'Que tive uma queda esta semana (sem detalhes)', on: false },
  { id: 'desafio', label: 'O que foi mais difícil (a minha resposta da pergunta 2)', on: false },
]

export default function Semana() {
  const { state, update } = useStore()
  const p = state.partner
  const last = state.meetings[state.meetings.length - 1]
  const pendingKept = !!last && !!last.commitment && !last.kept
  const [open] = useState(() => pendingKept)
  const steps: StepId[] = [...(open ? (['combinado'] as StepId[]) : []), 'preparar', 'refletir', 'conversar', 'combinar']
  const [i, setI] = useState(0)
  const [shared, setShared] = useState<string[]>(SHARE.filter((s) => s.on).map((s) => s.id))
  const [q, setQ] = useState<string[]>(['', '', '', '', ''])
  const [commit, setCommit] = useState('')
  const [pedido, setPedido] = useState('')
  const [extra, setExtra] = useState('')
  const [done, setDone] = useState(false)

  const since = addDays(dayKey(), -6)
  const week = useMemo(() => {
    const inWeek = (iso: string) => dayKey(new Date(iso)) >= since
    const mood = state.checkins.filter((c) => c.date >= since)
    const avg = mood.length ? mood.reduce((a, c) => a + c.mood, 0) / mood.length : 0
    return {
      moments: state.moments.filter((m) => inWeek(m.at)).length,
      waves: state.sos.filter((s) => s.outcome === 'passed' && inWeek(s.at)).length,
      slips: state.slips.filter((s) => inWeek(s.at)).length,
      moodWord: mood.length >= 2 ? (avg >= 4 ? 'boa' : avg >= 3 ? 'razoável' : 'pesada') : '',
    }
  }, [state.moments, state.sos, state.slips, state.checkins, since])

  if (!normalizePhone(p.phone)) return <Navigate to="/parceiro" replace />

  const has = (k: string) => shared.includes(k)
  const toggle = (k: string) => setShared((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]))
  const total = totalDays(state)
  const message = [
    `Oi, ${p.name}! Meu resumo da semana:`,
    has('numeros') && `• ${total} ${total === 1 ? 'dia' : 'dias'} de caminhada e ${week.moments} ${week.moments === 1 ? 'momento' : 'momentos'} com Deus.`,
    has('ondas') && week.waves > 0 && `• Venci ${week.waves} ${week.waves === 1 ? 'onda' : 'ondas'} de vontade.`,
    has('humor') && week.moodWord && `• Minha semana foi ${week.moodWord}.`,
    has('queda') && week.slips > 0 && '• Tive uma queda esta semana e já recomecei.',
    has('desafio') && q[1].trim() && `• Mais difícil: ${q[1].trim().slice(0, 160)}`,
    commit.trim() && `Para a próxima semana vou: ${commit.trim()}`,
    pedido.trim() && `Pode orar por: ${pedido.trim()}`,
    extra.trim(),
  ].filter(Boolean).join('\n')

  const setKept = (kept: 'sim' | 'parte' | 'nao') => update((s) => ({ ...s, meetings: s.meetings.map((m) => (m.id === last.id ? { ...m, kept } : m)) }))

  const finish = () => {
    const now = new Date().toISOString()
    const lines = [`Encontro semanal com ${p.name}`, ...QUESTIONS.map((t, k) => q[k].trim() && `${t} ${q[k].trim()}`), commit.trim() && `Combinado para a semana: ${commit.trim()}`].filter(Boolean) as string[]
    update((s) => ({
      ...s,
      meetings: [...s.meetings, { id: crypto.randomUUID(), at: now, shared, commitment: commit.trim() }],
      journal: [{ id: crypto.randomUUID(), at: now, kind: 'reflexao', text: lines.join('\n') }, ...s.journal],
    }))
    setDone(true)
  }

  if (done) {
    return (
      <main className="space-y-6 py-10">
        <h1 className="font-display text-4xl font-semibold leading-tight">Encontro registrado.</h1>
        <p className="text-lg text-muted">{commit.trim() ? `No próximo encontro, o app pergunta como foi: “${commit.trim()}”.` : 'Que bom que vocês se encontraram.'} {p.day !== undefined ? 'O próximo é no dia combinado.' : 'Combine o dia do próximo encontro na tela do Parceiro.'}</p>
        <Link to="/parceiro" className="btn-primary w-full">Voltar ao Parceiro</Link>
      </main>
    )
  }

  const step = steps[i]
  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/parceiro" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Parceiro</Link>
        <span className="text-sm font-semibold text-muted">{LABEL[step]} · {i + 1} de {steps.length}</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{steps.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={step} className="fade-up space-y-5">
        {step === 'combinado' && last && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Como foi o combinado da semana passada?</h1>
            <p className="rounded-3xl bg-sand p-6 font-display text-2xl leading-snug text-sand-ink">{last.commitment}</p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Combinado cumprido">
              {([['sim', 'Cumpri'], ['parte', 'Em parte'], ['nao', 'Ainda não']] as const).map(([v, l]) => <button key={v} aria-pressed={last.kept === v} onClick={() => setKept(v)} className="chip justify-center">{l}</button>)}
            </div>
            {last.kept && <p className="pop text-muted">{last.kept === 'sim' ? 'Que bom. Conte isso ao seu parceiro.' : last.kept === 'parte' ? 'Fazer uma parte já conta.' : 'Sem culpa. Pode ser o assunto da conversa de hoje.'}</p>}
          </>
        )}

        {step === 'preparar' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Sua semana em números.</h1>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {([[total, 'dias de caminhada'], [week.moments, 'momentos com Deus'], [week.waves, 'ondas vencidas'], [week.slips, week.slips === 1 ? 'recomeço' : 'recomeços']] as [number, string][]).map(([n, l]) => <div key={l}><p className="font-display text-5xl font-semibold leading-none">{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>)}
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">O que você quer contar?</h2>
              <p className="mb-3 mt-1 text-sm text-muted">Só vai para o seu parceiro o que você marcar. Nada de detalhes íntimos.</p>
              <div className="space-y-2">
                {SHARE.map((s) => <button key={s.id} aria-pressed={has(s.id)} onClick={() => toggle(s.id)} className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-4 text-left ${has(s.id) ? 'border-accent bg-accent/10' : 'border-line bg-surface'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${has(s.id) ? 'border-accent bg-accent text-accent-ink' : 'border-muted'}`}>{has(s.id) ? '✓' : ''}</span><span>{s.label}</span></button>)}
              </div>
              {week.slips > 0 && <p className="mt-3 text-sm text-muted">Você registrou um recomeço nesta semana. Contar que caiu, sem detalhes, ajuda quem caminha com você a ajudar de verdade.</p>}
            </div>
          </>
        )}

        {step === 'refletir' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Antes de conversar.</h1>
            <p className="text-muted">Cinco perguntas, só para você. Escrever antes torna a conversa mais honesta. Vai para o seu diário.</p>
            {QUESTIONS.map((t, k) => (
              <div key={t}><label className="label" htmlFor={`q${k}`}>{k + 1}. {t}</label><textarea id={`q${k}`} className="field py-3" rows={2} value={q[k]} onChange={(e) => { const c = [...q]; c[k] = e.target.value; setQ(c) }} /></div>
            ))}
          </>
        )}

        {step === 'conversar' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Roteiro de 10 minutos.</h1>
            <ol className="space-y-3">
              {ROTEIRO.map(([t, h, d], k) => (
                <li key={h} className="card flex gap-4 !p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">{k + 1}</span><span><span className="block font-semibold">{h} <span className="font-normal text-muted">· {t}</span></span><span className="mt-0.5 block text-sm text-muted">{d}</span></span></li>
              ))}
            </ol>
            <a className="btn-ghost w-full" href={waLink(p.phone, `Oi, ${p.name}! Podemos fazer o nosso encontro da semana agora?`)} target="_blank" rel="noopener noreferrer">Chamar {p.name} para o encontro</a>
          </>
        )}

        {step === 'combinar' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Combine a próxima semana.</h1>
            <div><label className="label" htmlFor="commit">Uma atitude pequena que vou fazer até o próximo encontro</label><textarea id="commit" className="field py-3" rows={2} value={commit} onChange={(e) => setCommit(e.target.value)} placeholder="Ex.: deixar o celular fora do quarto à noite; ligar para o João quando a vontade vier." /></div>
            <div><label className="label" htmlFor="pedido">Pedido de oração para o meu parceiro</label><textarea id="pedido" className="field py-3" rows={2} value={pedido} onChange={(e) => setPedido(e.target.value)} placeholder="Opcional." /></div>
            <div>
              <p className="label">Resumo para enviar ao {p.name}</p>
              <p className="whitespace-pre-line rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed">{message}</p>
              <textarea className="field mt-3 py-3" rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Quer acrescentar alguma coisa? (opcional)" aria-label="Acrescentar ao resumo" />
              <a className="btn-ghost mt-3 w-full" href={waLink(p.phone, message)} target="_blank" rel="noopener noreferrer">Enviar o resumo pelo WhatsApp</a>
              <p className="mt-2 text-xs text-muted">A mensagem abre no WhatsApp para você revisar. Nada é enviado sozinho.</p>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {i < steps.length - 1 ? <button className="btn-primary w-full" onClick={() => setI(i + 1)}>{step === 'conversar' ? 'Já conversamos' : 'Continuar'}</button> : <button className="btn-primary w-full" onClick={finish}>Registrar o encontro</button>}
        {i > 0 && <button className="btn-ghost w-full" onClick={() => setI(i - 1)}>Voltar</button>}
      </div>
      {last && <p className="text-center text-xs text-muted">Último encontro: {fmtDate(last.at)}</p>}
    </main>
  )
}
