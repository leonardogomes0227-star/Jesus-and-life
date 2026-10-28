import { useState } from 'react'
import { Link } from 'react-router-dom'
import SunArc from '../components/SunArc'
import { MOODS, TRIGGERS, verseOfDay } from '../lib/content'
import { dayKey, diffDays } from '../lib/dates'
import { streakDay, totalDays, useStore } from '../lib/store'
import type { Mood } from '../lib/types'

export default function Today() {
  const { state, saveCheckin } = useStore()
  const profile = state.profile!
  const today = dayKey()
  const day = streakDay(state)
  const total = totalDays(state)
  const progress = day / profile.goal
  const done = state.checkins.find((c) => c.date === today)
  const verse = verseOfDay(diffDays('2024-01-01', today))

  const [mood, setMood] = useState<Mood | null>(done?.mood ?? null)
  const [triggers, setTriggers] = useState<string[]>(done?.triggers ?? [])
  const [note, setNote] = useState(done?.note ?? '')
  const [saved, setSaved] = useState(false)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const toggle = (t: string) => setTriggers((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))

  return (
    <main className="space-y-5 fade-up">
      <header>
        <p className="text-muted">{greeting},</p>
        <h1 className="font-display text-3xl font-bold">{profile.name}</h1>
      </header>

      <section className="card text-center">
        <SunArc progress={progress} />
        <p className="-mt-4 font-display text-5xl font-bold text-accent">Dia {day}</p>
        <p className="mt-1 text-muted">
          {day >= profile.goal ? `Meta de ${profile.goal} dias alcançada. Gratidão!` : `da sua meta de ${profile.goal} dias`}
        </p>
        <div className="mt-4 rounded-2xl bg-bg px-4 py-3">
          <span className="font-display text-2xl font-bold">{total}</span>{' '}
          <span className="text-muted">{total === 1 ? 'dia acumulado' : 'dias acumulados'}</span>
          <p className="text-xs text-muted">Seu total nunca zera. Cada dia conta.</p>
        </div>
      </section>

      <section className="card">
        <p className="text-sm font-semibold uppercase tracking-wide text-sun">Versículo do dia</p>
        <blockquote className="mt-2 font-display text-xl leading-snug">“{verse.text}”</blockquote>
        <p className="mt-2 text-sm font-semibold text-muted">{verse.ref} · ACF</p>
        <h2 className="mt-4 text-sm font-bold text-accent">Reflexão</h2>
        <p className="mt-1">{verse.reflection}</p>
        <h2 className="mt-4 text-sm font-bold text-accent">Prática de hoje</h2>
        <p className="mt-1">{verse.practice}</p>
      </section>

      <section className="card">
        <h2 className="font-display text-xl font-bold">Como você está agora?</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              aria-pressed={mood === m.value}
              onClick={() => { setMood(m.value); setSaved(false) }}
              className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border text-2xl transition ${
                mood === m.value ? 'border-accent bg-accent/15' : 'border-line bg-bg'
              }`}
            >
              <span aria-hidden>{m.emoji}</span>
              <span className="text-[11px] font-semibold text-muted">{m.label}</span>
            </button>
          ))}
        </div>

        {mood && (
          <div className="mt-5 space-y-4">
            <div>
              <p className="label">O que está pesando? (opcional)</p>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map((t) => (
                  <button key={t} aria-pressed={triggers.includes(t)} onClick={() => { toggle(t); setSaved(false) }} className="chip">{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label" htmlFor="nota">Anotação (opcional)</label>
              <textarea id="nota" className="field py-3" rows={3} value={note} onChange={(e) => { setNote(e.target.value); setSaved(false) }} placeholder="Escreva o que quiser. Fica só com você." />
            </div>
            <button
              className="btn-primary w-full"
              onClick={() => { saveCheckin({ mood, triggers, note: note.trim() }); setSaved(true) }}
            >
              {done || saved ? 'Atualizar check-in' : 'Salvar check-in'}
            </button>
            {saved && <p className="text-center text-sm text-accent" role="status">Registrado. Obrigado por ser sincero(a) consigo.</p>}
          </div>
        )}
      </section>

      <p className="text-center text-sm text-muted">
        Se hoje não foi como você queria, tudo bem.{' '}
        <Link to="/queda" className="font-semibold text-accent underline">Recomece sem culpa</Link>
      </p>
    </main>
  )
}
