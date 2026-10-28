import { Link } from 'react-router-dom'
import { bookById } from '../lib/bible'
import { MILESTONES } from '../lib/content'
import { dayKey } from '../lib/dates'
import { currentLesson, totalDays, useStore } from '../lib/store'
import { LESSONS } from '../lib/trail'

export default function Home() {
  const { state, celebrate } = useStore()
  const profile = state.profile!
  const today = dayKey()
  const total = totalDays(state)
  const last = state.moments[state.moments.length - 1]
  const doneToday = !!last && last.at.slice(0, 10) === today
  const lessonN = currentLesson(state)
  const lesson = LESSONS.find((l) => l.n === lessonN)
  const lastBook = state.lastRead ? bookById(state.lastRead.book) : null
  const openPrayers = state.prayers.filter((p) => !p.answeredAt).length
  const pending = [...MILESTONES].reverse().find((m) => m.days <= total && !state.celebrated.includes(m.days))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <main className="space-y-6">
      {pending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6" role="dialog" aria-modal="true" aria-label="Conquista">
          <div className="card pop w-full max-w-sm text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-sun">{pending.days} {pending.days === 1 ? 'dia' : 'dias'}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold">{pending.title}</h2>
            <p className="mt-2 text-muted">{pending.text}</p>
            <button className="btn-primary mt-5 w-full" onClick={() => celebrate(total)}>Obrigado, Deus</button>
          </div>
        </div>
      )}

      <header className="flex items-start justify-between">
        <div>
          <p className="text-muted">{greeting},</p>
          <h1 className="font-display text-4xl font-semibold">{profile.name}</h1>
        </div>
        <Link to="/ajustes" aria-label="Ajustes" className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-muted">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
        </Link>
      </header>

      <section className="rounded-[28px] bg-accent p-6 text-accent-ink">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-70">Momento com Deus</p>
        {doneToday ? (
          <>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">Hoje você esteve com Deus.</h2>
            <p className="mt-2 opacity-80">Passagem de hoje: {last.ref}.</p>
            <Link to="/momento" className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-full border border-current px-6 font-semibold">Fazer outro momento</Link>
          </>
        ) : (
          <>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">Leia, ore e responda. Do seu jeito, no seu tempo.</h2>
            <p className="mt-2 opacity-80">Você diz como está chegando, e a passagem vem para esse momento. De 2 a 20 minutos.</p>
            <Link to="/momento" className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-full bg-accent-ink px-6 font-semibold text-accent">Começar</Link>
          </>
        )}
      </section>

      <Link to="/sos" className="flex items-center gap-4 rounded-2xl border border-sun/40 bg-surface p-4 active:scale-[0.99]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun text-sm font-bold text-sun-ink">SOS</span>
        <span>
          <span className="block font-semibold">Momento difícil agora?</span>
          <span className="block text-sm text-muted">Respiração, áudio guiado e o que fazer nos próximos minutos.</span>
        </span>
      </Link>

      <section aria-label="Atalhos" className="grid grid-cols-2 gap-3">
        {[
          { to: lastBook ? `/biblia/${state.lastRead!.book}/${state.lastRead!.chapter}` : '/biblia', t: 'Bíblia', s: lastBook ? `Continuar ${lastBook.name} ${state.lastRead!.chapter}` : 'Ler, buscar e marcar' },
          { to: '/orar', t: 'Oração e diário', s: openPrayers > 0 ? `${openPrayers} ${openPrayers === 1 ? 'pedido' : 'pedidos'} em aberto` : 'Pedidos e anotações' },
          { to: lesson && lessonN <= profile.goal ? `/trilha/${lessonN}` : '/trilha', t: 'Trilha de liberdade', s: lesson && lessonN <= profile.goal ? `Dia ${lessonN}: ${lesson.title}` : 'Ver trilha' },
          { to: '/parceiro', t: 'Parceiro', s: state.partner.name ? `Falar com ${state.partner.name}` : 'Alguém de confiança' },
        ].map((x) => (
          <Link key={x.t} to={x.to} className="card flex min-h-[96px] flex-col justify-between !p-4 active:scale-[0.98]">
            <span className="font-display text-xl font-semibold leading-tight">{x.t}</span>
            <span className="mt-1 text-sm text-muted">{x.s}</span>
          </Link>
        ))}
      </section>

      <p className="text-center text-sm text-muted">Você tem {total} {total === 1 ? 'dia' : 'dias'} de caminhada. Nada aqui expira ou zera.</p>
    </main>
  )
}
