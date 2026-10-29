import { useState } from 'react'
import { Link } from 'react-router-dom'
import Respire from '../components/Respire'
import { MOODS, MOOD_REPLIES, TRIGGERS, verseOfDay } from '../lib/content'
import { chapterOfRef } from '../lib/bible'
import { dayKey, diffDays } from '../lib/dates'
import { useStore } from '../lib/store'
import type { Mood } from '../lib/types'

const STEPS = ['Parar', 'Uma frase', 'O seu dia']

/** Pausa do meio do dia: 2 minutos para parar, ouvir uma frase e perceber como o dia está. */
export default function Pausa() {
  const { update } = useStore()
  const today = dayKey()
  const verse = verseOfDay(diffDays('2024-01-01', today) + 7)
  const ref = chapterOfRef(verse.ref)
  const [i, setI] = useState(0)
  const [mood, setMood] = useState<Mood | null>(null)
  const [triggers, setTriggers] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const finish = () => {
    if (!mood) return
    const now = new Date().toISOString()
    update((s) => ({
      ...s,
      checkins: [...s.checkins.filter((c) => c.date !== today), { date: today, at: now, mood, triggers, note: '' }],
      moments: [...s.moments, { id: crypto.randomUUID(), at: now, feeling: String(mood), minutes: 2, ref: verse.ref, need: 'pausa', kind: 'pausa' }],
    }))
    setDone(true)
  }

  if (done) {
    return (
      <main className="space-y-6 py-10 text-center">
        <h1 className="font-display text-4xl font-semibold">Siga o seu dia.</h1>
        <p className="mx-auto max-w-sm text-lg text-muted">{mood ? MOOD_REPLIES[mood] : ''}</p>
        <div className="mx-auto grid max-w-sm gap-3">
          {mood && mood <= 2 && <Link to="/descanso/ansiedade" className="btn-ghost">Ouvir um áudio para acalmar</Link>}
          <Link to="/" className="btn-primary">Voltar ao início</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Início</Link>
        <span className="text-sm font-semibold text-muted">{STEPS[i]} · {i + 1} de 3</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{STEPS.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={i} className="fade-up space-y-6">
        {i === 0 && (
          <section className="space-y-4 text-center">
            <h1 className="font-display text-3xl font-semibold leading-snug">Pare por um minuto.</h1>
            <p className="mx-auto max-w-sm text-muted">Largue o que está fazendo. Duas ou três respirações já mudam o corpo.</p>
            <Respire />
          </section>
        )}
        {i === 1 && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Uma frase para o meio do dia</h1>
            <blockquote className="rounded-3xl bg-sand p-6 text-sand-ink">
              <p className="font-display text-[26px] leading-snug">“{verse.text}”</p>
              <p className="mt-3 text-sm font-semibold opacity-70">{verse.ref} · ACF</p>
            </blockquote>
            <p className="text-lg leading-relaxed">{verse.reflection}</p>
            {ref && <Link to={`/biblia/${ref.book.id}/${ref.chapter}${ref.verse ? `?v=${ref.verse}` : ''}`} className="inline-block text-sm font-semibold underline">Ler o capítulo completo</Link>}
          </section>
        )}
        {i === 2 && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Como está o seu dia até agora?</h1>
            <div className="grid grid-cols-5 gap-2" role="group" aria-label="Como está o dia">
              {MOODS.map((m) => (
                <button key={m.value} aria-pressed={mood === m.value} onClick={() => setMood(m.value)} className="chip !min-h-[72px] flex-col justify-center !px-1 text-center">
                  <span className="font-display text-2xl font-semibold leading-none">{m.value}</span>
                  <span className="mt-1 text-xs">{m.label}</span>
                </button>
              ))}
            </div>
            {mood && (
              <div className="pop space-y-3">
                <p className="label">Tem algo pesando? (opcional)</p>
                <div className="flex flex-wrap gap-2">
                  {TRIGGERS.map((t) => <button key={t} aria-pressed={triggers.includes(t)} onClick={() => setTriggers((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))} className="chip">{t}</button>)}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {i < 2 ? <button className="btn-primary w-full" onClick={() => setI(i + 1)}>Continuar</button> : <button className="btn-primary w-full" disabled={!mood} onClick={finish}>Concluir a pausa</button>}
        {i > 0 && <button className="btn-ghost w-full" onClick={() => setI(i - 1)}>Voltar</button>}
      </div>
    </main>
  )
}
