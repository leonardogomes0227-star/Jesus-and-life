import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { chapterOfRef } from '../lib/bible'
import { LESSONS, PHASES, PHASE_INFO, WHEN_OPTIONS, phaseOf } from '../lib/trail'
import { currentLesson, useStore } from '../lib/store'
import { useSpeech } from '../lib/speech'

type StepId = 'abrir' | 'palavra' | 'entender' | 'pratica' | 'responder'
const LABEL: Record<StepId, string> = { abrir: 'Abertura', palavra: 'Palavra', entender: 'Entender', pratica: 'Prática', responder: 'Responder' }
const RESULT_REPLY = {
  sim: 'Ótimo. Pequenos passos repetidos é que mudam a mente.',
  parte: 'Fazer um pedaço já conta. O importante é ter tentado.',
  nao: 'Tudo bem, sem culpa. Hoje você pode tentar de novo, no seu tempo.',
} as const

export default function Lesson() {
  const { n: param } = useParams()
  const n = Number(param)
  const { state, update } = useStore()
  const navigate = useNavigate()
  const lesson = LESSONS.find((l) => l.n === n)
  const goal = state.profile!.goal
  const cur = currentLesson(state)
  const { supported, speaking, read } = useSpeech()

  const done = state.trailDone.includes(n)
  const prev = n > 1 ? LESSONS.find((l) => l.n === n - 1) : undefined
  const pendingPrev = !!prev && state.trailDone.includes(n - 1) && !state.trailPractice[String(n - 1)]?.result
  const phase = phaseOf(n)
  const phaseStart = n === phase.from && !done
  const phaseEnd = n === Math.min(phase.to, goal)
  // Os sinais da abertura são fixados ao abrir a lição; responder a pergunta não pode fazer a tela sumir.
  const [open] = useState(() => ({ phaseStart, pendingPrev }))
  const steps: StepId[] = [...(open.phaseStart || open.pendingPrev ? (['abrir'] as StepId[]) : []), 'palavra', 'entender', 'pratica', 'responder']

  const [i, setI] = useState(0)
  const [when, setWhen] = useState(state.trailPractice[String(n)]?.when ?? '')
  const [note, setNote] = useState(state.trailNotes[String(n)] ?? '')
  const [amen, setAmen] = useState(false)
  const [phaseNote, setPhaseNote] = useState('')
  const [finished, setFinished] = useState(false)

  if (!lesson || n > goal || n > cur) return <Navigate to="/trilha" replace />

  const info = PHASE_INFO[phase.id]
  const ref = chapterOfRef(lesson.ref)
  const step = steps[i]
  const prevResult = prev ? state.trailPractice[String(prev.n)]?.result : undefined
  const setPrevResult = (r: 'sim' | 'parte' | 'nao') => update((s) => ({ ...s, trailPractice: { ...s.trailPractice, [String(n - 1)]: { ...s.trailPractice[String(n - 1)], result: r } } }))

  const finish = () => {
    const now = new Date().toISOString()
    update((s) => ({
      ...s,
      trailDone: s.trailDone.includes(n) ? s.trailDone : [...s.trailDone, n].sort((a, b) => a - b),
      trailNotes: note.trim() ? { ...s.trailNotes, [n]: note.trim() } : s.trailNotes,
      trailPractice: { ...s.trailPractice, [String(n)]: { ...s.trailPractice[String(n)], when: when || undefined } },
      journal: [{ id: crypto.randomUUID(), at: now, kind: 'reflexao', text: [`Trilha, dia ${n}: ${lesson.title}`, note.trim(), `Prática: ${lesson.practice}${when ? ` (${when.toLowerCase()})` : ''}`].filter(Boolean).join('\n') }, ...s.journal],
    }))
    setFinished(true)
  }

  /* ---------- Depois de concluir: fechamento ---------- */
  if (finished) {
    const inPhase = LESSONS.filter((l) => l.n >= phase.from && l.n <= Math.min(phase.to, goal))
    const prac = inPhase.map((l) => state.trailPractice[String(l.n)]?.result)
    const notes = inPhase.filter((l) => state.trailNotes[String(l.n)] || l.n === n && note.trim()).length
    const last = n >= goal
    const nextPhase = PHASES.find((p) => p.from === n + 1)
    const go = (to: string) => {
      if (phaseEnd && phaseNote.trim()) update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind: 'reflexao', text: `Fim da fase ${phase.name}\n${info.question}\n${phaseNote.trim()}` }, ...s.journal] }))
      navigate(to, { replace: true })
    }
    return (
      <main className="space-y-6 py-6">
        {phaseEnd ? (
          <>
            <p className="text-sm font-semibold text-sun">Fim da fase · {phase.name}</p>
            <h1 className="font-display text-4xl font-semibold leading-tight">{last ? 'Você completou a trilha.' : 'Você concluiu esta fase.'}</h1>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div><p className="font-display text-5xl font-semibold leading-none">{inPhase.length}</p><p className="text-sm text-muted">lições</p></div>
              <div><p className="font-display text-5xl font-semibold leading-none">{prac.filter((r) => r === 'sim' || r === 'parte').length}</p><p className="text-sm text-muted">práticas feitas</p></div>
              <div><p className="font-display text-5xl font-semibold leading-none">{notes}</p><p className="text-sm text-muted">anotações</p></div>
            </div>
            <div>
              <label className="label" htmlFor="pn">{info.question}</label>
              <textarea id="pn" className="field py-3" rows={3} value={phaseNote} onChange={(e) => setPhaseNote(e.target.value)} placeholder="Opcional. Vai para o seu diário." />
            </div>
            {nextPhase && <p className="rounded-2xl bg-sand p-4 text-sand-ink"><strong>Próxima fase:</strong> {nextPhase.name}. {nextPhase.blurb}</p>}
            {last && goal === 21 && <p className="text-muted">Quer continuar? Dá para estender a trilha até 90 dias na tela da Trilha.</p>}
            <div className="grid gap-3">
              <button className="btn-primary w-full" onClick={() => go(last ? '/trilha' : `/trilha/${n + 1}`)}>{last ? 'Ver a trilha' : 'Seguir para a próxima lição'}</button>
              {!last && <button className="btn-ghost w-full" onClick={() => go('/trilha')}>Voltar à trilha</button>}
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Lição {n} concluída.</h1>
            <p className="text-lg text-muted">{when ? `Sua prática: ${lesson.practice} Você combinou de fazer ${when.toLowerCase()}. Amanhã o app pergunta como foi.` : 'Amanhã o app pergunta como foi a prática de hoje.'}</p>
            <div className="grid gap-3">
              <button className="btn-primary w-full" onClick={() => navigate(`/trilha/${n + 1}`, { replace: true })}>Próxima lição</button>
              <button className="btn-ghost w-full" onClick={() => navigate('/trilha', { replace: true })}>Voltar à trilha</button>
            </div>
          </>
        )}
      </main>
    )
  }

  const script = `${lesson.title}. ${lesson.ref}. ${lesson.text}. ${lesson.teaching} ${lesson.mind ?? ''} Prática. ${lesson.practice}`

  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/trilha" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Trilha</Link>
        <span className="text-sm font-semibold text-muted">Dia {n} · {LABEL[step]} · {i + 1} de {steps.length}</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{steps.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={step} className="fade-up space-y-5">
        {step === 'abrir' && (
          <>
            {open.phaseStart && (
              <section className="rounded-3xl bg-night p-6 text-night-ink">
                <p className="text-sm font-semibold opacity-70">Começa uma fase · dias {phase.from} a {Math.min(phase.to, goal)}</p>
                <h1 className="mt-1 font-display text-4xl font-semibold leading-tight">{phase.name}</h1>
                <p className="mt-3 leading-relaxed opacity-90">{info.intro}</p>
                <p className="mt-3 text-sm"><strong>O que você vai praticar:</strong> {info.focus}</p>
              </section>
            )}
            {open.pendingPrev && prev && (
              <section className="space-y-4">
                <h2 className="font-display text-3xl font-semibold">Como foi a prática de ontem?</h2>
                <p className="rounded-2xl bg-sand p-4 text-sand-ink">{prev.practice}</p>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Como foi a prática">
                  {([['sim', 'Fiz'], ['parte', 'Em parte'], ['nao', 'Ainda não']] as const).map(([v, l]) => <button key={v} aria-pressed={prevResult === v} onClick={() => setPrevResult(v)} className="chip justify-center">{l}</button>)}
                </div>
                {prevResult && <p className="pop text-muted">{RESULT_REPLY[prevResult]}</p>}
              </section>
            )}
          </>
        )}

        {step === 'palavra' && (
          <>
            <header>
              <p className="text-sm font-semibold text-sun">{phase.name}</p>
              <h1 className="mt-1 font-display text-4xl font-semibold leading-tight">{lesson.title}</h1>
            </header>
            <blockquote className="rounded-3xl bg-sand p-6 text-sand-ink">
              <p className="font-display text-[26px] leading-snug">“{lesson.text}”</p>
              <p className="mt-3 text-sm font-semibold opacity-70">{lesson.ref} · ACF</p>
            </blockquote>
            <div className="flex flex-wrap gap-2">
              {ref && <Link to={`/biblia/${ref.book.id}/${ref.chapter}${ref.verse ? `?v=${ref.verse}` : ''}`} className="btn-ghost !min-h-[44px] !px-5 text-sm">Ler o capítulo</Link>}
              {supported && <button className="btn-ghost !min-h-[44px] !px-5 text-sm" onClick={() => read(script)}>{speaking ? 'Parar' : 'Ouvir a lição'}</button>}
            </div>
          </>
        )}

        {step === 'entender' && (
          <>
            <section>
              <h2 className="font-display text-3xl font-semibold">Entenda o texto</h2>
              <p className="mt-3 text-lg leading-relaxed">{lesson.teaching}</p>
            </section>
            {lesson.mind && (
              <section className="rounded-3xl border border-line bg-surface p-6">
                <h2 className="font-display text-2xl font-semibold">Na sua mente</h2>
                <p className="mt-2 text-lg leading-relaxed">{lesson.mind}</p>
              </section>
            )}
          </>
        )}

        {step === 'pratica' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">A prática de hoje</h1>
            <p className="rounded-3xl bg-sand p-6 font-display text-2xl leading-snug text-sand-ink">{lesson.practice}</p>
            <div>
              <p className="label">Quando você vai fazer isso?</p>
              <div className="flex flex-wrap gap-2">{WHEN_OPTIONS.map((w) => <button key={w} aria-pressed={when === w} onClick={() => setWhen(when === w ? '' : w)} className="chip">{w}</button>)}</div>
              <p className="mt-3 text-sm text-muted">Quem decide quando fazer tem muito mais chance de fazer.</p>
            </div>
          </>
        )}

        {step === 'responder' && (
          <>
            <h1 className="font-display text-4xl font-semibold leading-tight">Responda a Deus.</h1>
            <div className="rounded-3xl border border-line bg-surface p-6">
              <p className="font-display text-xl italic leading-relaxed">{lesson.prayer ?? 'Senhor, ajuda-me a viver hoje o que li. Que a tua Palavra me guie nos próximos passos. Amém.'}</p>
              <button className="mt-3 min-h-[44px] text-sm font-semibold underline" onClick={() => setAmen(true)}>{amen ? 'Amém' : 'Fiz esta oração'}</button>
            </div>
            <div>
              <label className="label" htmlFor="nota">{lesson.prompt ?? 'O que ficou desta lição? Que palavra ou ideia você leva?'}</label>
              <textarea id="nota" className="field py-3" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escreva o que vier. Vai para o seu diário." />
            </div>
          </>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {i < steps.length - 1 ? <button className="btn-primary w-full" onClick={() => setI(i + 1)}>{step === 'abrir' ? 'Começar a lição' : 'Continuar'}</button> : <button className="btn-primary w-full" onClick={finish}>{done ? 'Salvar e fechar' : 'Concluir a lição'}</button>}
        {i > 0 && <button className="btn-ghost w-full" onClick={() => setI(i - 1)}>Voltar</button>}
      </div>
    </main>
  )
}
