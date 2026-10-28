import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { verseOfDay } from '../lib/content'
import { chapterOfRef } from '../lib/bible'
import { dayKey, diffDays } from '../lib/dates'
import { useStore } from '../lib/store'

type Step = { id: string; title: string; body: string; kind?: 'verse' | 'note' | 'read' }

/** Sessão guiada conforme o tempo disponível: 2, 5 ou 10 minutos. */
export default function Session() {
  const { m } = useParams()
  const minutes = Number(m)
  const { update } = useStore()
  const navigate = useNavigate()
  const verse = verseOfDay(diffDays('2024-01-01', dayKey()))
  const ref = chapterOfRef(verse.ref)
  const [i, setI] = useState(0)
  const [note, setNote] = useState('')

  if (![2, 5, 10].includes(minutes)) return <Navigate to="/" replace />

  const steps: Step[] = [
    { id: 'v', title: verse.ref, body: `“${verse.text}”`, kind: 'verse' },
    ...(minutes >= 5 ? [{ id: 'r', title: 'Reflexão', body: verse.reflection }] : []),
    ...(minutes >= 10 && ref ? [{ id: 'l', title: 'Leia o capítulo', body: `${ref.book.name} ${ref.chapter}`, kind: 'read' as const }] : []),
    ...(minutes >= 5 ? [{ id: 'p', title: 'Prática de hoje', body: verse.practice }] : []),
    ...(minutes >= 10 ? [{ id: 'n', title: 'Para anotar', body: verse.prompt, kind: 'note' as const }] : []),
    { id: 'o', title: 'Oração', body: minutes === 2 ? 'Senhor, obrigado por este dia. Guia os meus passos e cuida do meu coração. Amém.' : verse.prayer },
  ]
  const s = steps[i]
  const last = i === steps.length - 1

  const finish = () => {
    const d = dayKey()
    update((st) => {
      let next = st.readDays.includes(d) ? st : { ...st, readDays: [...st.readDays, d] }
      if (note.trim()) next = { ...next, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind: 'reflexao', text: `${verse.prompt}\n${note.trim()}` }, ...next.journal] }
      return next
    })
    navigate('/', { replace: true })
  }

  return (
    <main className="flex min-h-[80vh] flex-col">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Sair</Link>
        <span className="text-sm font-semibold text-muted">{minutes} min · {i + 1}/{steps.length}</span>
      </div>
      <div className="mt-2 flex gap-1.5" aria-hidden>
        {steps.map((_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}
      </div>

      <section key={s.id} className="fade-up my-auto py-8">
        <p className="text-sm font-bold uppercase tracking-wide text-sun">{s.title}</p>
        <p className={`mt-3 leading-snug ${s.kind === 'verse' ? 'font-display text-[28px]' : 'text-xl'}`}>{s.body}</p>
        {s.kind === 'read' && ref && <Link to={`/biblia/${ref.book.id}/${ref.chapter}`} className="btn-ghost mt-5">Abrir na Bíblia</Link>}
        {s.kind === 'note' && <textarea className="field mt-4 py-3" rows={5} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escreva o que vier (opcional)" aria-label="Anotação" />}
      </section>

      <div className="grid gap-3">
        <button className="btn-primary w-full" onClick={last ? finish : () => setI(i + 1)}>{last ? 'Amém. Concluir' : 'Continuar'}</button>
        {i > 0 && <button className="btn-ghost w-full" onClick={() => setI(i - 1)}>Voltar</button>}
      </div>
    </main>
  )
}
