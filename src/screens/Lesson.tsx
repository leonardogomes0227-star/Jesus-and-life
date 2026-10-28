import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { LESSONS, phaseOf } from '../lib/trail'
import { currentLesson, useStore } from '../lib/store'
import { useSpeech } from '../lib/speech'

export default function Lesson() {
  const { n: param } = useParams()
  const n = Number(param)
  const { state, completeLesson } = useStore()
  const navigate = useNavigate()
  const lesson = LESSONS.find((l) => l.n === n)
  const goal = state.profile!.goal
  const cur = currentLesson(state)
  const { supported, speaking, read } = useSpeech()
  const [note, setNote] = useState(state.trailNotes[String(n)] ?? '')
  const [party, setParty] = useState(false)

  if (!lesson || n > goal || n > cur) return <Navigate to="/trilha" replace />

  const done = state.trailDone.includes(n)
  const phase = phaseOf(n)
  const script = `${lesson.title}. ${lesson.ref}. ${lesson.text}. Entenda o texto. ${lesson.teaching} ${lesson.mind ? `Na sua mente. ${lesson.mind}` : ''} Prática de hoje. ${lesson.practice} ${lesson.prayer ? `Oração. ${lesson.prayer}` : ''}`

  const finish = () => {
    completeLesson(n, note)
    if (!done) {
      setParty(true)
      try { navigator.vibrate?.(60) } catch { /* sem vibração */ }
      setTimeout(() => navigate(n < goal ? `/trilha/${n + 1}` : '/trilha', { replace: true }), 1600)
    } else navigate('/trilha')
  }

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/trilha" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Trilha</Link>
        {supported && <button onClick={() => read(script)} className="btn-ghost !min-h-[44px] !px-4 text-sm" aria-pressed={speaking}>{speaking ? '⏹ Parar' : 'Ouvir'}</button>}
      </div>

      <header className="fade-up">
        <p className="text-sm font-bold uppercase tracking-wide text-sun">Dia {n} de {goal} · {phase.name}</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight">{lesson.title}</h1>
      </header>

      <section className="card fade-up">
        <blockquote className="font-display text-[22px] leading-snug">“{lesson.text}”</blockquote>
        <p className="mt-2 text-sm font-semibold text-muted">{lesson.ref} · ACF</p>
      </section>

      <section className="space-y-4 fade-up">
        <div className="card">
          <h2 className="text-sm font-bold text-accent">Entenda o texto</h2>
          <p className="mt-2 leading-relaxed">{lesson.teaching}</p>
        </div>
        {lesson.mind && (
          <div className="card">
            <h2 className="text-sm font-bold text-accent">Na sua mente</h2>
            <p className="mt-2 leading-relaxed">{lesson.mind}</p>
          </div>
        )}
        <div className="card border-sun/50 bg-sun/10">
          <h2 className="text-sm font-bold text-sun">Prática de hoje</h2>
          <p className="mt-2 leading-relaxed">{lesson.practice}</p>
        </div>
        {lesson.prayer && (
          <div className="card">
            <h2 className="text-sm font-bold text-accent">Oração</h2>
            <p className="mt-2 italic leading-relaxed">{lesson.prayer}</p>
          </div>
        )}
      </section>

      <section className="card fade-up">
        <label className="text-sm font-bold text-accent" htmlFor="nota">Para anotar</label>
        {lesson.prompt && <p className="mt-1 text-sm text-muted">{lesson.prompt}</p>}
        <textarea id="nota" className="field mt-3 py-3" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escreva o que vier. Fica só no seu aparelho." />
      </section>

      <button className="btn-primary w-full" onClick={finish} disabled={party}>{done ? 'Salvar anotação' : n < goal ? 'Concluir e seguir' : 'Concluir a trilha'}</button>
      <p className="text-center text-xs text-muted">Sem pressa: você pode concluir esta lição quando quiser.</p>
    </main>
  )
}
