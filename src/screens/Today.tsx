import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from '../components/Confetti'
import CountUp from '../components/CountUp'
import SunScene from '../components/SunScene'
import { MILESTONES, MOODS, MOOD_REPLIES, TRIGGERS, verseOfDay } from '../lib/content'
import { addDays, dayKey, diffDays } from '../lib/dates'
import { bestStreak, currentLesson, streakDay, totalDays, useStore } from '../lib/store'
import { LESSONS } from '../lib/trail'
import type { Mood } from '../lib/types'

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function Check({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`flex min-h-[52px] w-full items-center gap-3 rounded-2xl border px-4 text-left font-semibold transition ${on ? 'border-accent bg-accent/15 text-accent' : 'border-line bg-bg'}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm ${on ? 'border-accent bg-accent text-accent-ink' : 'border-muted'}`}>{on ? '✓' : ''}</span>
      {children}
    </button>
  )
}

export default function Today() {
  const { state, saveCheckin, toggleDay, celebrate } = useStore()
  const profile = state.profile!
  const today = dayKey()
  const day = streakDay(state)
  const total = totalDays(state)
  const best = bestStreak(state)
  const waves = state.sos.filter((s) => s.outcome === 'passed').length
  const done = state.checkins.find((c) => c.date === today)
  const verse = verseOfDay(diffDays('2024-01-01', today))
  const read = state.readDays.includes(today)
  const practiced = state.practiceDays.includes(today)

  const [mood, setMood] = useState<Mood | null>(done?.mood ?? null)
  const [triggers, setTriggers] = useState<string[]>(done?.triggers ?? [])
  const [note, setNote] = useState(done?.note ?? '')
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)

  const pending = [...MILESTONES].reverse().find((m) => m.days <= total && !state.celebrated.includes(m.days))
  const next = MILESTONES.find((m) => m.days > total)
  const prev = [...MILESTONES].reverse().find((m) => m.days <= total)?.days ?? 0
  const nextPct = next ? ((total - prev) / (next.days - prev)) * 100 : 100

  const lessonN = currentLesson(state)
  const lesson = LESSONS.find((l) => l.n === lessonN)
  const ritual = [read, practiced, !!done].filter(Boolean).length
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const toggle = (t: string) => setTriggers((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))

  useEffect(() => {
    if (pending && navigator.vibrate) navigator.vibrate(60)
  }, [pending])

  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))

  return (
    <main className="space-y-5">
      {pending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-6" role="dialog" aria-modal="true" aria-label="Nova conquista">
          <Confetti />
          <div className="card pop w-full max-w-sm text-center">
            <div className="text-6xl" aria-hidden>{pending.emoji}</div>
            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-sun">Nova conquista</p>
            <h2 className="font-display text-3xl font-bold">{pending.title}</h2>
            <p className="mt-2 text-muted">{pending.text}</p>
            <button className="btn-primary mt-5 w-full" onClick={() => celebrate(total)}>Gratidão, Deus!</button>
          </div>
        </div>
      )}

      <header className="flex items-end justify-between fade-up">
        <div>
          <p className="text-muted">{greeting},</p>
          <h1 className="font-display text-3xl font-bold">{profile.name}</h1>
        </div>
        <Link to="/queda" className="rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-muted">Recomeçar</Link>
      </header>

      <section className="card !p-3 fade-up">
        <SunScene progress={day / profile.goal} goal={profile.goal} day={day} />
        <div className="px-2 pb-2 pt-4 text-center">
          <p className="font-display text-6xl font-bold leading-none text-accent">Dia <CountUp to={day} /></p>
          <p className="mt-2 text-muted">
            {day >= profile.goal ? `Meta de ${profile.goal} dias alcançada. Gratidão!` : `da sua meta de ${profile.goal} dias · faltam ${profile.goal - day}`}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 px-1 pb-1">
          {[
            [total, 'dias acumulados'],
            [best, 'melhor sequência'],
            [waves, 'ondas vencidas'],
          ].map(([n, l]) => (
            <div key={l} className="rounded-2xl bg-bg px-2 py-3 text-center">
              <p className="font-display text-2xl font-bold"><CountUp to={Number(n)} /></p>
              <p className="text-[11px] font-medium leading-tight text-muted">{l}</p>
            </div>
          ))}
        </div>
        <p className="px-2 pb-2 pt-2 text-center text-xs text-muted">Seu total nunca zera. Cada dia conta.</p>
      </section>

      {next && (
        <section className="card flex items-center gap-4 fade-up">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-bg text-3xl" aria-hidden>{next.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted">Próxima conquista</p>
            <p className="font-display text-lg font-bold">{next.title} <span className="text-sm font-medium text-muted">· faltam {next.days - total}</span></p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-sun transition-all duration-1000" style={{ width: `${nextPct}%` }} /></div>
          </div>
        </section>
      )}

      <section className="card fade-up">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Sua semana</h2>
          <span className="text-sm font-semibold text-muted">Ritual de hoje {ritual}/3</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {week.map((k) => {
            const c = state.checkins.find((x) => x.date === k)
            const isToday = k === today
            return (
              <div key={k} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted">{WEEKDAYS[new Date(k + 'T00:00').getDay()]}</span>
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${c ? 'bg-accent/15' : 'bg-bg'} ${isToday ? 'ring-2 ring-accent' : ''}`}>
                  {c ? MOODS[c.mood - 1].emoji : <i className="h-1.5 w-1.5 rounded-full bg-line" />}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {profile.why && (
        <section className="rounded-3xl bg-accent p-5 text-accent-ink fade-up">
          <p className="text-xs font-bold uppercase tracking-wide opacity-80">Meu porquê</p>
          <p className="mt-1 font-display text-xl leading-snug">“{profile.why}”</p>
        </section>
      )}

      {lesson && lessonN <= profile.goal && (
        <Link to={`/trilha/${lessonN}`} className="card fade-up flex items-center gap-4 active:scale-[0.99]">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl text-accent-ink" aria-hidden>📖</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-muted">Sua trilha · dia {lessonN} de {profile.goal}</span>
            <span className="block truncate font-display text-lg font-bold">{lesson.title}</span>
            <span className="block text-xs text-accent font-semibold">{state.trailDone.length === 0 ? 'Começar a trilha' : 'Continuar de onde parou'} →</span>
          </span>
        </Link>
      )}

      <section className="card fade-up">
        <p className="text-sm font-bold uppercase tracking-wide text-sun">Devocional de hoje</p>
        <blockquote className="mt-2 font-display text-[22px] leading-snug">“{verse.text}”</blockquote>
        <p className="mt-2 text-sm font-semibold text-muted">{verse.ref} · ACF</p>

        <div className="mt-5 space-y-4 rounded-2xl bg-bg p-4">
          <div>
            <h3 className="text-sm font-bold text-accent">Reflexão</h3>
            <p className="mt-1">{verse.reflection}</p>
          </div>
          {open ? (
            <>
              <div className="pop">
                <h3 className="text-sm font-bold text-accent">Oração</h3>
                <p className="mt-1 italic">{verse.prayer}</p>
              </div>
              <div className="pop">
                <h3 className="text-sm font-bold text-accent">Para anotar</h3>
                <p className="mt-1">{verse.prompt}</p>
              </div>
            </>
          ) : (
            <button className="text-sm font-semibold text-accent underline" onClick={() => setOpen(true)}>Ler a oração e a pergunta do dia</button>
          )}
          <div>
            <h3 className="text-sm font-bold text-accent">Prática de hoje</h3>
            <p className="mt-1">{verse.practice}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Check on={read} onClick={() => toggleDay('readDays')}>Li o devocional</Check>
          <Check on={practiced} onClick={() => toggleDay('practiceDays')}>Fiz a prática de hoje</Check>
        </div>
      </section>

      <section className="card fade-up">
        <h2 className="font-display text-xl font-bold">Como você está agora?</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button key={m.value} aria-pressed={mood === m.value} onClick={() => { setMood(m.value); setSaved(false) }} className={`flex min-h-[68px] flex-col items-center justify-center rounded-2xl border text-3xl transition active:scale-95 ${mood === m.value ? 'border-accent bg-accent/15 scale-105' : 'border-line bg-bg'}`}>
              <span aria-hidden>{m.emoji}</span>
              <span className="mt-0.5 text-[11px] font-semibold text-muted">{m.label}</span>
            </button>
          ))}
        </div>

        {mood && (
          <div className="mt-5 space-y-4 pop">
            <p className="rounded-2xl bg-bg p-4 text-[15px]">{MOOD_REPLIES[mood]}</p>
            {mood <= 2 && <Link to="/sos" className="btn-sun w-full">Preciso respirar um pouco</Link>}
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
            <button className="btn-primary w-full" onClick={() => { saveCheckin({ mood, triggers, note: note.trim() }); setSaved(true) }}>
              {done || saved ? 'Atualizar check-in' : 'Salvar check-in'}
            </button>
            {saved && <p className="text-center text-sm font-semibold text-accent" role="status">✓ Registrado. Obrigado por ser sincero(a) consigo.</p>}
          </div>
        )}
      </section>
    </main>
  )
}
