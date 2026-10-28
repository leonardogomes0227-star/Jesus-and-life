import { useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from '../components/Confetti'
import { MILESTONES, MOODS, MOOD_REPLIES, TRIGGERS, verseOfDay } from '../lib/content'
import { chapterOfRef } from '../lib/bible'
import { dayKey, diffDays } from '../lib/dates'
import { planCursor, streakDay, totalDays, currentLesson, useStore } from '../lib/store'
import { LESSONS } from '../lib/trail'
import { PLANS, planById } from '../lib/plans'
import { BOOKS } from '../lib/books'
import type { Mood } from '../lib/types'

const TIMES = [
  { m: 2, label: 'Tenho 2 min', hint: 'Versículo e oração curta' },
  { m: 5, label: 'Tenho 5 min', hint: 'Reflexão e prática' },
  { m: 10, label: 'Tenho 10 min', hint: 'Leitura, anotação e oração' },
]

export default function Home() {
  const { state, saveCheckin, celebrate } = useStore()
  const profile = state.profile!
  const today = dayKey()
  const total = totalDays(state)
  const verse = verseOfDay(diffDays('2024-01-01', today))
  const ref = chapterOfRef(verse.ref)
  const done = state.checkins.find((c) => c.date === today)
  const readToday = state.readDays.includes(today)
  const lessonN = currentLesson(state)
  const lesson = LESSONS.find((l) => l.n === lessonN)

  const [mood, setMood] = useState<Mood | null>(done?.mood ?? null)
  const [triggers, setTriggers] = useState<string[]>(done?.triggers ?? [])
  const [note, setNote] = useState(done?.note ?? '')
  const [more, setMore] = useState(false)
  const [saved, setSaved] = useState(false)

  const pending = [...MILESTONES].reverse().find((m) => m.days <= total && !state.celebrated.includes(m.days))

  // continuar a leitura: plano ativo com dia pendente, ou último capítulo
  const activePlan = PLANS.find((p) => state.plans[p.id] && planCursor(state, p.id, p.days.length) < p.days.length)
  const lastBook = state.lastRead ? BOOKS.find((b) => b.id === state.lastRead!.book) : null
  const planDay = activePlan ? planCursor(state, activePlan.id, activePlan.days.length) : 0
  const planFirst = activePlan?.days[planDay]?.[0]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const pickMood = (m: Mood) => {
    setMood(m)
    saveCheckin({ mood: m, triggers, note })
    setSaved(true)
  }
  const toggle = (t: string) => setTriggers((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]))
  const openPrayers = state.prayers.filter((p) => !p.answeredAt).length

  return (
    <main className="space-y-5">
      {pending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-6" role="dialog" aria-modal="true" aria-label="Nova conquista">
          <Confetti count={28} />
          <div className="card pop w-full max-w-sm text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-sun">Conquista</p>
            <h2 className="mt-1 font-display text-3xl font-bold">{pending.title}</h2>
            <p className="mt-2 text-muted">{pending.text}</p>
            <button className="btn-primary mt-5 w-full" onClick={() => celebrate(total)}>Obrigado, Deus</button>
          </div>
        </div>
      )}

      <header className="flex items-start justify-between">
        <div>
          <p className="text-muted">{greeting},</p>
          <h1 className="font-display text-3xl font-bold">{profile.name}</h1>
        </div>
        <Link to="/ajustes" aria-label="Ajustes" className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
        </Link>
      </header>
      <p className="-mt-2 text-muted">Chegue do jeito que está. Aqui não tem cobrança.</p>

      <Link to="/sos" className="flex items-center gap-4 rounded-3xl border border-sun/40 bg-sun/10 p-4 active:scale-[0.99]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sun font-display text-lg font-bold text-sun-ink">SOS</span>
        <span>
          <span className="block font-display text-lg font-bold">Momento difícil agora?</span>
          <span className="block text-sm text-muted">Respiração, áudio de 3 minutos e ações rápidas.</span>
        </span>
      </Link>

      <section>
        <h2 className="mb-3 font-display text-xl font-bold">Quanto tempo você tem?</h2>
        <div className="grid grid-cols-3 gap-2">
          {TIMES.map((t) => (
            <Link key={t.m} to={`/agora/${t.m}`} aria-label={t.label} className="flex min-h-[88px] flex-col items-center justify-center rounded-2xl border border-line bg-surface px-2 text-center transition active:scale-95">
              <span className="text-xs font-semibold text-muted">Tenho</span>
              <span className="font-display text-2xl font-bold leading-tight text-accent">{t.m}<span className="text-sm font-semibold"> min</span></span>
              <span className="mt-1 text-[11px] leading-tight text-muted">{t.hint}</span>
            </Link>
          ))}
        </div>
        {readToday && <p className="mt-2 text-sm font-semibold text-accent">✓ Você já passou um tempo com Deus hoje.</p>}
      </section>

      <section className="card">
        <p className="text-sm font-bold uppercase tracking-wide text-sun">Versículo do dia</p>
        <blockquote className="mt-2 font-display text-[22px] leading-snug">“{verse.text}”</blockquote>
        <p className="mt-2 text-sm font-semibold text-muted">{verse.ref} · ACF</p>
        <p className="mt-3 text-[15px] leading-relaxed">{verse.reflection}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/devocional" className="btn-primary !min-h-[44px] !px-5 text-sm">Devocional completo</Link>
          {ref && <Link to={`/biblia/${ref.book.id}/${ref.chapter}${ref.verse ? `?v=${ref.verse}` : ''}`} className="btn-ghost !min-h-[44px] !px-5 text-sm">Ler o capítulo</Link>}
        </div>
      </section>

      {(activePlan || lastBook) && (
        <Link to={activePlan && planFirst ? `/planos/${activePlan.id}` : `/biblia/${state.lastRead!.book}/${state.lastRead!.chapter}`} className="card flex items-center justify-between gap-3 active:scale-[0.99]">
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-muted">Continuar lendo</span>
            <span className="block truncate font-display text-lg font-bold">
              {activePlan && planFirst ? `${planById(activePlan.id)!.title} · dia ${planDay + 1}` : `${lastBook!.name} ${state.lastRead!.chapter}`}
            </span>
          </span>
          <span className="text-accent" aria-hidden>→</span>
        </Link>
      )}

      <section className="card">
        <h2 className="font-display text-xl font-bold">Como você está agora?</h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button key={m.value} aria-pressed={mood === m.value} onClick={() => pickMood(m.value)} className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border text-2xl transition active:scale-95 ${mood === m.value ? 'border-accent bg-accent/15' : 'border-line bg-bg'}`}>
              <span aria-hidden>{m.emoji}</span>
              <span className="mt-0.5 text-[11px] font-semibold text-muted">{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <div className="mt-4 space-y-4 pop">
            <p className="rounded-2xl bg-bg p-4 text-[15px]">{MOOD_REPLIES[mood]}</p>
            {mood <= 2 && <Link to="/descanso/ansiedade" className="btn-ghost w-full">Ouvir um áudio para acalmar</Link>}
            {!more ? (
              <button className="text-sm font-semibold text-accent underline" onClick={() => setMore(true)}>Adicionar o que está pesando e uma anotação</button>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {TRIGGERS.map((t) => (
                    <button key={t} aria-pressed={triggers.includes(t)} onClick={() => { toggle(t); setSaved(false) }} className="chip">{t}</button>
                  ))}
                </div>
                <textarea className="field py-3" rows={3} value={note} onChange={(e) => { setNote(e.target.value); setSaved(false) }} placeholder="Anotação (fica só com você)" aria-label="Anotação" />
                <button className="btn-primary w-full" onClick={() => { saveCheckin({ mood, triggers, note: note.trim() }); setSaved(true) }}>Salvar detalhes</button>
              </>
            )}
            {saved && <p className="text-sm font-semibold text-accent" role="status">Registrado.</p>}
          </div>
        )}
      </section>

      <div className="grid gap-3 md:grid-cols-2">
        {lesson && lessonN <= profile.goal && (
          <Link to={`/trilha/${lessonN}`} className="card active:scale-[0.99]">
            <span className="block text-sm font-semibold text-muted">Trilha de liberdade · dia {lessonN} de {profile.goal}</span>
            <span className="mt-1 block font-display text-lg font-bold">{lesson.title}</span>
            <span className="mt-2 block text-sm font-semibold text-accent">{state.trailDone.length === 0 ? 'Começar' : 'Continuar'} →</span>
          </Link>
        )}
        <Link to="/orar" className="card active:scale-[0.99]">
          <span className="block text-sm font-semibold text-muted">Oração e diário</span>
          <span className="mt-1 block font-display text-lg font-bold">{openPrayers > 0 ? `${openPrayers} ${openPrayers === 1 ? 'pedido' : 'pedidos'} em aberto` : 'Registre um pedido'}</span>
          <span className="mt-2 block text-sm font-semibold text-accent">Abrir →</span>
        </Link>
      </div>

      <p className="text-center text-xs text-muted">{streakDay(state) > 0 && `Você tem ${total} ${total === 1 ? 'dia' : 'dias'} de caminhada. Nada aqui expira ou zera.`}</p>
    </main>
  )
}
