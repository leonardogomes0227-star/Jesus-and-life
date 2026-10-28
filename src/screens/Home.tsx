import { useState } from 'react'
import { Link } from 'react-router-dom'
import Confetti from '../components/Confetti'
import { MILESTONES, MOODS, MOOD_REPLIES, TRIGGERS, verseOfDay } from '../lib/content'
import { dayKey, diffDays } from '../lib/dates'
import { totalDays, currentLesson, useStore } from '../lib/store'
import { LESSONS } from '../lib/trail'
import { BOOKS } from '../lib/books'
import type { Mood } from '../lib/types'

export default function Home() {
  const { state, saveCheckin, celebrate } = useStore()
  const profile = state.profile!
  const today = dayKey()
  const total = totalDays(state)
  const verse = verseOfDay(diffDays('2024-01-01', today))
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

  const lastBook = state.lastRead ? BOOKS.find((b) => b.id === state.lastRead!.book) : null
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

      <section className="card">
        <p className="text-sm font-bold uppercase tracking-wide text-sun">Seu momento com Deus hoje</p>
        <blockquote className="mt-2 font-display text-[22px] leading-snug">“{verse.text}”</blockquote>
        <p className="mt-2 text-sm font-semibold text-muted">{verse.ref} · ACF</p>
        <Link to="/agora/5" className="btn-primary mt-4 w-full">{readToday ? 'Fazer de novo' : 'Começar o devocional'}</Link>
        <div className="mt-3 flex items-center justify-center gap-1 text-sm text-muted">
          <span>Pouco tempo?</span>
          <Link to="/agora/2" className="flex min-h-[44px] items-center px-2 font-semibold text-accent underline">2 min</Link>
          <span>·</span>
          <Link to="/agora/10" className="flex min-h-[44px] items-center px-2 font-semibold text-accent underline">10 min</Link>
        </div>
        {readToday && <p className="text-center text-sm font-semibold text-accent">Você já esteve com Deus hoje.</p>}
      </section>

      <Link to="/sos" className="flex items-center gap-3 rounded-2xl border border-sun/40 bg-sun/10 p-3 active:scale-[0.99]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun font-display font-bold text-sun-ink">SOS</span>
        <span className="font-semibold">Momento difícil agora? Toque aqui.</span>
      </Link>

      <section className="card">
        <h2 className="font-display text-lg font-bold">Como você está?</h2>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button key={m.value} aria-pressed={mood === m.value} onClick={() => pickMood(m.value)} className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border text-2xl transition active:scale-95 ${mood === m.value ? 'border-accent bg-accent/15' : 'border-line bg-bg'}`}>
              <span aria-hidden>{m.emoji}</span>
              <span className="mt-0.5 text-xs font-semibold text-muted">{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <div className="mt-4 space-y-3 pop">
            <p className="rounded-2xl bg-bg p-4 text-[15px]">{MOOD_REPLIES[mood]}</p>
            {mood <= 2 && <Link to="/descanso/ansiedade" className="btn-ghost w-full">Ouvir um áudio para acalmar</Link>}
            {!more ? (
              <button className="min-h-[44px] text-sm font-semibold text-accent underline" onClick={() => setMore(true)}>Contar mais (opcional)</button>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {TRIGGERS.map((t) => (
                    <button key={t} aria-pressed={triggers.includes(t)} onClick={() => { toggle(t); setSaved(false) }} className="chip">{t}</button>
                  ))}
                </div>
                <textarea className="field py-3" rows={3} value={note} onChange={(e) => { setNote(e.target.value); setSaved(false) }} placeholder="Anotação (fica só com você)" aria-label="Anotação" />
                <button className="btn-primary w-full" onClick={() => { saveCheckin({ mood, triggers, note: note.trim() }); setSaved(true) }}>Salvar</button>
              </>
            )}
            {saved && <p className="text-sm font-semibold text-accent" role="status">Registrado.</p>}
          </div>
        )}
      </section>

      <section aria-label="Atalhos" className="grid grid-cols-2 gap-3">
        {[
          { to: lastBook ? `/biblia/${state.lastRead!.book}/${state.lastRead!.chapter}` : '/biblia', t: 'Bíblia', s: lastBook ? `Continuar ${lastBook.name} ${state.lastRead!.chapter}` : 'Ler e buscar' },
          { to: '/orar', t: 'Oração e diário', s: openPrayers > 0 ? `${openPrayers} ${openPrayers === 1 ? 'pedido' : 'pedidos'} em aberto` : 'Anotar um pedido' },
          { to: lesson && lessonN <= profile.goal ? `/trilha/${lessonN}` : '/trilha', t: 'Trilha de liberdade', s: lesson && lessonN <= profile.goal ? `Dia ${lessonN}: ${lesson.title}` : 'Ver trilha' },
          { to: '/parceiro', t: 'Parceiro', s: state.partner.name ? `Falar com ${state.partner.name}` : 'Escolher alguém de confiança' },
        ].map((x) => (
          <Link key={x.t} to={x.to} className="card flex min-h-[96px] flex-col justify-between !p-4 active:scale-[0.98]">
            <span className="font-display text-lg font-bold leading-tight">{x.t}</span>
            <span className="mt-1 text-sm text-muted">{x.s}</span>
          </Link>
        ))}
      </section>
    </main>
  )
}
