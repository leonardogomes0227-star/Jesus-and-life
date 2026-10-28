import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TOPICS } from '../lib/topics'
import { useSpeech } from '../lib/speech'

export function TopicList() {
  return (
    <main className="space-y-5">
      <header className="fade-up">
        <Link to="/mais" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Mais</Link>
        <h1 className="font-display text-3xl font-bold">Aprender</h1>
        <p className="mt-1 text-muted">Estudos curtos que unem Bíblia, entendimento da mente e cuidado emocional.</p>
      </header>
      <div className="space-y-3">
        {TOPICS.map((t) => (
          <Link key={t.id} to={`/temas/${t.id}`} className="card fade-up flex items-center gap-4 active:scale-[0.99]">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-bg text-3xl" aria-hidden>{t.emoji}</span>
            <span>
              <span className="block font-display text-xl font-bold">{t.title}</span>
              <span className="block text-sm text-muted">{t.blurb}</span>
              <span className="mt-1 block text-xs font-semibold text-accent">{t.articles.length} leituras</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export function TopicPage() {
  const { id } = useParams()
  const topic = TOPICS.find((t) => t.id === id)
  const [open, setOpen] = useState<string | null>(topic?.articles[0].id ?? null)
  const { supported, speaking, read } = useSpeech()

  if (!topic) return <main><Link to="/temas" className="btn-primary">Voltar</Link></main>

  return (
    <main className="space-y-5">
      <header className="fade-up">
        <Link to="/temas" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Aprender</Link>
        <div className="text-4xl" aria-hidden>{topic.emoji}</div>
        <h1 className="font-display text-3xl font-bold">{topic.title}</h1>
        <p className="mt-1 text-muted">{topic.blurb}</p>
      </header>
      <div className="space-y-3">
        {topic.articles.map((a) => {
          const isOpen = open === a.id
          return (
            <article key={a.id} className="card !p-0 overflow-hidden fade-up">
              <button className="flex min-h-[64px] w-full items-center justify-between gap-3 p-5 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : a.id)}>
                <span>
                  <span className="block font-display text-lg font-bold">{a.title}</span>
                  <span className="block text-sm text-muted">{a.summary}</span>
                </span>
                <span className={`text-xl text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden>⌄</span>
              </button>
              {isOpen && (
                <div className="space-y-4 border-t border-line px-5 pb-5 pt-4 pop">
                  {a.body.map((p, i) => <p key={i} className="leading-relaxed">{p}</p>)}
                  <blockquote className="rounded-2xl bg-bg p-4">
                    <p className="font-display leading-snug">“{a.text}”</p>
                    <p className="mt-1 text-sm font-semibold text-muted">{a.ref} · ACF</p>
                  </blockquote>
                  <div className="rounded-2xl border border-sun/50 bg-sun/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-sun">Para praticar</p>
                    <p className="mt-1">{a.action}</p>
                  </div>
                  {supported && <button className="btn-ghost !min-h-[44px] text-sm" onClick={() => read(`${a.title}. ${a.body.join(' ')} ${a.ref}. ${a.text}`)}>{speaking ? '⏹ Parar' : '🔊 Ouvir'}</button>}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </main>
  )
}
