import { Link } from 'react-router-dom'
import HourArt from '../components/HourArt'
import { bookById, chapterOfRef } from '../lib/bible'
import { MILESTONES, verseOfDay } from '../lib/content'
import { dayKey, diffDays, fmtDate } from '../lib/dates'
import { slotNow, type Slot } from '../lib/momento'
import { currentLesson, totalDays, useStore } from '../lib/store'
import { LESSONS } from '../lib/trail'
import { useSpeech } from '../lib/speech'

const HOURS: { slot: Slot; to: string; title: string; promise: string; time: string; box: string; art: string }[] = [
  { slot: 'manha', to: '/momento', title: 'Manhã', promise: 'Diga como você chega e receba a passagem para o seu dia. Leia, ore e responda.', time: '2 a 20 min', box: 'bg-sand text-sand-ink', art: 'text-sand-ink' },
  { slot: 'pausa', to: '/pausa', title: 'Pausa', promise: 'Pare, respire e ouça uma frase. Perceba como o dia está indo.', time: '2 min', box: 'border border-line bg-surface text-ink', art: 'text-ink' },
  { slot: 'noite', to: '/noite', title: 'Noite', promise: 'Olhe o dia, entregue o que pesou, leia um Salmo e descanse.', time: '5 min', box: 'bg-night text-night-ink', art: 'text-night-ink' },
]


export default function Home() {
  const { state, celebrate } = useStore()
  const profile = state.profile!
  const today = dayKey()
  const total = totalDays(state)
  const now = new Date()
  const slot = slotNow(now.getHours())
  const todays = state.moments.filter((m) => m.at.slice(0, 10) === today)
  const done = (k: Slot) => todays.some((m) => (m.kind ?? 'manha') === k)
  const verse = verseOfDay(diffDays('2024-01-01', today))
  const ref = chapterOfRef(verse.ref)
  const { supported, speaking, read } = useSpeech()
  const lessonN = currentLesson(state)
  const lesson = LESSONS.find((l) => l.n <= profile.goal && l.n === lessonN)
  const lastBook = state.lastRead ? bookById(state.lastRead.book) : null
  const entry = state.journal[0]
  const prayer = state.prayers.find((p) => !p.answeredAt)
  const answered = state.prayers.filter((p) => p.answeredAt).length
  const pending = [...MILESTONES].reverse().find((m) => m.days <= total && !state.celebrated.includes(m.days))

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const date = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const stats = [
    [total, total === 1 ? 'dia de caminhada' : 'dias de caminhada'],
    ...(state.moments.length ? [[state.moments.length, state.moments.length === 1 ? 'momento com Deus' : 'momentos com Deus']] : []),
    ...(state.readChapters.length ? [[state.readChapters.length, state.readChapters.length === 1 ? 'capítulo lido' : 'capítulos lidos']] : []),
    ...(answered ? [[answered, answered === 1 ? 'oração respondida' : 'orações respondidas']] : []),
  ] as [number, string][]

  return (
    <main className="space-y-10">
      {pending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6" role="dialog" aria-modal="true" aria-label="Conquista">
          <div className="card pop w-full max-w-sm text-center">
            <p className="text-sm font-semibold text-sun">{pending.days} {pending.days === 1 ? 'dia' : 'dias'}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold">{pending.title}</h2>
            <p className="mt-2 text-muted">{pending.text}</p>
            <button className="btn-primary mt-5 w-full" onClick={() => celebrate(total)}>Obrigado, Deus</button>
          </div>
        </div>
      )}

      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted first-letter:uppercase">{date}</p>
          <h1 className="mt-1 font-display text-4xl font-semibold leading-none">{greeting}, {profile.name}</h1>
        </div>
        <Link to="/ajustes" aria-label="Ajustes" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
        </Link>
      </header>

      <section aria-label="Palavra de hoje">
        <span className="font-display text-7xl leading-[0.6] text-sun" aria-hidden>“</span>
        <blockquote className="mt-2 font-display text-[30px] font-medium leading-[1.25]">{verse.text}</blockquote>
        <p className="mt-4 font-semibold">{verse.ref} <span className="font-normal text-muted">· ACF</span></p>
        <p className="mt-3 max-w-md leading-relaxed text-muted">{verse.reflection}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {ref && <Link to={`/biblia/${ref.book.id}/${ref.chapter}${ref.verse ? `?v=${ref.verse}` : ''}`} className="btn-ghost !min-h-[44px] !px-5 text-sm">Ler o capítulo</Link>}
          {supported && <button className="btn-ghost !min-h-[44px] !px-5 text-sm" onClick={() => read(`${verse.ref}. ${verse.text}`)}>{speaking ? 'Parar' : 'Ouvir'}</button>}
        </div>
      </section>

      <section aria-label="Seu dia com Deus" className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-semibold">Seu dia com Deus</h2>
          <p className="mt-1 text-muted">Três encontros, do começo ao fim do dia. Faça o que couber hoje.</p>
        </div>
        {HOURS.map((h) => {
          const isDone = done(h.slot)
          const label = isDone ? 'Feito hoje' : h.slot === slot ? 'Agora' : 'Quando quiser'
          return (
            <Link key={h.slot} to={h.to} className={`relative block min-h-[170px] overflow-hidden rounded-[28px] p-6 active:scale-[0.99] ${h.box}`}>
              <HourArt slot={h.slot} className={`pointer-events-none absolute -right-2 top-3 w-36 ${h.art}`} />
              <div className="relative max-w-[60%]">
                <p className="text-sm font-semibold opacity-70">{label} · {h.time}</p>
                <h3 className="mt-1 font-display text-4xl font-semibold">{h.title}</h3>
                <p className="mt-2 text-[15px] leading-snug opacity-85">{h.promise}</p>
                <p className="mt-4 font-semibold">{isDone ? 'Fazer de novo' : 'Começar'} →</p>
              </div>
            </Link>
          )
        })}
      </section>

      <Link to="/sos" className="flex items-center gap-4 rounded-3xl border border-sun/50 bg-surface p-5 active:scale-[0.99]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sun text-sm font-bold text-sun-ink">SOS</span>
        <span>
          <span className="block font-display text-xl font-semibold">Está difícil agora?</span>
          <span className="block text-sm text-muted">Respiração, áudio guiado e o que fazer nos próximos minutos.</span>
        </span>
      </Link>

      <section aria-label="Seu caminho" className="space-y-5">
        <h2 className="font-display text-3xl font-semibold">Seu caminho</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {stats.map(([n, l]) => (
            <div key={l}><p className="font-display text-5xl font-semibold leading-none">{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>
          ))}
        </div>
        <p className="text-sm text-muted">Seu total nunca zera. Cada dia que você esteve aqui continua contando.</p>

        {(entry || prayer) && (
          <div className="grid gap-3 md:grid-cols-2">
            {entry && (
              <Link to="/orar?aba=diario" className="card block active:scale-[0.99]">
                <p className="text-sm font-semibold text-muted">Último registro do diário · {fmtDate(entry.at)}</p>
                <p className="mt-2 line-clamp-4 whitespace-pre-line leading-relaxed">{entry.text.split('\n').slice(0, 4).join('\n')}</p>
              </Link>
            )}
            {prayer && (
              <Link to="/orar" className="card block active:scale-[0.99]">
                <p className="text-sm font-semibold text-muted">Pedido em aberto</p>
                <p className="mt-2 line-clamp-4 leading-relaxed">{prayer.text}</p>
                <p className="mt-3 text-sm text-muted">Orado {prayer.prayedCount} {prayer.prayedCount === 1 ? 'vez' : 'vezes'}</p>
              </Link>
            )}
          </div>
        )}
      </section>

      <nav aria-label="Mais" className="-mt-2 divide-y divide-line border-y border-line">
        {[
          { to: lastBook ? `/biblia/${state.lastRead!.book}/${state.lastRead!.chapter}` : '/biblia', t: 'Bíblia', s: lastBook ? `Continuar em ${lastBook.name} ${state.lastRead!.chapter}` : 'Ler, buscar e marcar' },
          { to: lesson ? `/trilha/${lessonN}` : '/trilha', t: 'Trilha de liberdade', s: lesson ? `Dia ${lessonN}: ${lesson.title}` : 'Ver a trilha' },
          { to: '/orar', t: 'Oração e diário', s: 'Pedidos, respostas e anotações' },
          { to: '/parceiro', t: 'Parceiro', s: state.partner.name ? `Falar com ${state.partner.name}` : 'Alguém de confiança para caminhar junto' },
        ].map((x) => (
          <Link key={x.t} to={x.to} className="flex min-h-[64px] items-center justify-between gap-4 py-3 active:opacity-70">
            <span><span className="block font-display text-xl font-semibold">{x.t}</span><span className="block text-sm text-muted">{x.s}</span></span>
            <span className="text-muted" aria-hidden>→</span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
