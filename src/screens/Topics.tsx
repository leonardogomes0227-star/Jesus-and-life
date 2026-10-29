import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import LiberdadeTabs from '../components/LiberdadeTabs'
import { dayKey, addDays } from '../lib/dates'
import { useSpeech } from '../lib/speech'
import { useStore } from '../lib/store'
import { TOPICS, type Article } from '../lib/topics'
import type { AppState } from '../lib/types'

const key = (topic: string, article: string) => `${topic}.${article}`
const minutes = (a: Article) => Math.max(1, Math.round([a.summary, ...a.body, a.action].join(' ').split(/\s+/).length / 170))

const TRIGGER_TOPIC: Record<string, string> = {
  Ansiedade: 'ansiedade', Estresse: 'ansiedade', Tristeza: 'ansiedade', Solidão: 'ansiedade',
  Cansaço: 'telas', 'Celular na cama': 'telas', 'Redes sociais': 'telas', Madrugada: 'telas', Tédio: 'telas', Fome: 'telas', 'Sozinho(a) em casa': 'telas',
  Conflito: 'limites',
}

/** Escolhe o assunto que mais combina com o que a pessoa viveu e devolve as próximas leituras não lidas. */
const recommend = (s: AppState): { topic: string; why: string; items: { topic: string; article: Article }[] } => {
  const recentSlip = s.slips.some((x) => dayKey(new Date(x.at)) >= addDays(dayKey(), -7))
  const counts = new Map<string, number>()
  const add = (t?: string) => t && counts.set(t, (counts.get(t) ?? 0) + 1)
  s.checkins.forEach((c) => c.triggers.forEach(add)); s.sos.forEach((e) => add(e.trigger)); s.slips.forEach((x) => x.triggers.forEach(add))
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).find(([t]) => TRIGGER_TOPIC[t])
  const topic = recentSlip ? 'vergonha' : top ? TRIGGER_TOPIC[top[0]] : 'mente'
  const why = recentSlip ? 'Você registrou um recomeço nesta semana.' : top ? `“${top[0]}” aparece com frequência nos seus registros.` : 'Um bom ponto de partida.'
  const unread = (id: string) => TOPICS.find((t) => t.id === id)!.articles.filter((a) => !s.readArticles.includes(key(id, a.id))).map((article) => ({ topic: id, article }))
  let items = unread(topic).slice(0, 2)
  if (items.length === 0) items = TOPICS.flatMap((t) => unread(t.id)).slice(0, 2)
  return { topic, why, items }
}

export function TopicList() {
  const { state } = useStore()
  const rec = recommend(state)
  const total = TOPICS.reduce((n, t) => n + t.articles.length, 0)
  const done = state.readArticles.length
  return (
    <main className="space-y-8 pb-8">
      <LiberdadeTabs />
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight">Aprender</h1>
        <p className="mt-2 text-muted">Leituras curtas que unem a Bíblia, o entendimento da mente e o cuidado emocional. {done > 0 && `Você leu ${done} de ${total}.`}</p>
      </header>

      {rec.items.length > 0 && (
        <section className="rounded-3xl bg-night p-6 text-night-ink">
          <p className="text-sm font-semibold opacity-70">Para você agora · {rec.why}</p>
          <ul className="mt-3 space-y-3">
            {rec.items.map(({ topic, article }) => (
              <li key={article.id}>
                <Link to={`/temas/${topic}/${article.id}`} className="block rounded-2xl bg-night-ink/10 p-4 active:scale-[0.99]">
                  <span className="block font-display text-2xl font-semibold leading-snug">{article.title}</span>
                  <span className="mt-1 block text-sm opacity-80">{article.summary} · {minutes(article)} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">Assuntos</h2>
        {TOPICS.map((t) => {
          const read = t.articles.filter((a) => state.readArticles.includes(key(t.id, a.id))).length
          return (
            <Link key={t.id} to={`/temas/${t.id}`} className="card block active:scale-[0.99]">
              <span className="block font-display text-2xl font-semibold leading-tight">{t.title}</span>
              <span className="mt-1 block text-muted">{t.blurb}</span>
              <span className="mt-3 flex items-center gap-3 text-sm font-semibold">
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-accent" style={{ width: `${(read / t.articles.length) * 100}%` }} /></span>
                {read} de {t.articles.length} lidas
              </span>
            </Link>
          )
        })}
      </section>
    </main>
  )
}

export function TopicPage() {
  const { id } = useParams()
  const { state } = useStore()
  const topic = TOPICS.find((t) => t.id === id)
  if (!topic) return <Navigate to="/temas" replace />
  return (
    <main className="space-y-6 pb-8">
      <Link to="/temas" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Aprender</Link>
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight">{topic.title}</h1>
        <p className="mt-2 text-muted">{topic.blurb}</p>
      </header>
      <ol className="space-y-3">
        {topic.articles.map((a, i) => {
          const read = state.readArticles.includes(key(topic.id, a.id))
          return (
            <li key={a.id}>
              <Link to={`/temas/${topic.id}/${a.id}`} className="card flex items-center gap-4 active:scale-[0.99]">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${read ? 'bg-accent text-accent-ink' : 'bg-bg text-muted'}`}>{read ? '✓' : i + 1}</span>
                <span className="min-w-0">
                  <span className="block font-display text-xl font-semibold leading-snug">{a.title}</span>
                  <span className="block text-sm text-muted">{a.summary} · {minutes(a)} min</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

export function ArticlePage() {
  const { id, article } = useParams()
  const { state, update } = useStore()
  const { supported, speaking, read: speak } = useSpeech()
  const topic = TOPICS.find((t) => t.id === id)
  const idx = topic ? topic.articles.findIndex((a) => a.id === article) : -1
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')
  if (!topic || idx < 0) return <Navigate to="/temas" replace />
  const a = topic.articles[idx]
  const k = key(topic.id, a.id)
  const isRead = state.readArticles.includes(k)
  const next = topic.articles[idx + 1]
  const nextTopic = TOPICS[TOPICS.findIndex((t) => t.id === topic.id) + 1]

  const markRead = () => update((s) => (s.readArticles.includes(k) ? s : { ...s, readArticles: [...s.readArticles, k] }))
  const addToPlan = () => update((s) => (s.plan ? { ...s, plan: { ...s.plan, env: [...s.plan.env, { id: crypto.randomUUID(), label: a.action, done: false }] } } : s))
  const saveNote = () => {
    if (!note.trim()) return
    update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind: 'reflexao', text: `Aprender, ${a.title}\n${note.trim()}` }, ...s.journal] }))
    setNote(''); setMsg('Guardado no diário.'); markRead()
  }

  return (
    <main className="space-y-7 pb-8">
      <div className="flex items-center justify-between">
        <Link to={`/temas/${topic.id}`} className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← {topic.title}</Link>
        {supported && <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => speak(`${a.title}. ${a.body.join(' ')} ${a.ref}. ${a.text}`)}>{speaking ? 'Parar' : 'Ouvir'}</button>}
      </div>

      <header>
        <p className="text-sm font-semibold text-sun">{topic.title} · {minutes(a)} min de leitura</p>
        <h1 className="mt-1 font-display text-4xl font-semibold leading-tight">{a.title}</h1>
        <p className="mt-2 text-lg text-muted">{a.summary}</p>
      </header>

      <article className="space-y-4 text-lg leading-relaxed">{a.body.map((p, i) => <p key={i}>{p}</p>)}</article>

      <blockquote className="rounded-3xl bg-sand p-6 text-sand-ink">
        <p className="text-sm font-semibold opacity-70">Na Bíblia</p>
        <p className="mt-1 font-display text-2xl leading-snug">“{a.text}”</p>
        <p className="mt-2 text-sm font-semibold opacity-70">{a.ref} · ACF</p>
      </blockquote>

      <section className="rounded-3xl border border-sun/50 p-6">
        <h2 className="font-display text-2xl font-semibold">Para praticar</h2>
        <p className="mt-2 text-lg leading-snug">{a.action}</p>
        {state.plan && <button className="btn-ghost mt-4 w-full text-sm" onClick={addToPlan}>Adicionar ao meu plano</button>}
      </section>

      <section className="space-y-3">
        <label className="label" htmlFor="nota">O que ficou desta leitura? (opcional)</label>
        <textarea id="nota" className="field py-3" rows={3} value={note} onChange={(e) => { setNote(e.target.value); setMsg('') }} placeholder="Escreva em uma ou duas frases. Vai para o seu diário." />
        {note.trim() && <button className="btn-ghost w-full" onClick={saveNote}>Guardar no diário</button>}
        {msg && <p className="text-sm font-semibold text-accent" role="status">{msg}</p>}
      </section>

      <div className="grid gap-3">
        {next ? (
          <Link to={`/temas/${topic.id}/${next.id}`} className="btn-primary w-full" onClick={markRead}>Próxima leitura: {next.title}</Link>
        ) : (
          <Link to={nextTopic ? `/temas/${nextTopic.id}` : '/temas'} className="btn-primary w-full" onClick={markRead}>{nextTopic ? `Seguir para ${nextTopic.title}` : 'Concluir'}</Link>
        )}
        <button className={isRead ? 'btn-ghost w-full' : 'btn-ghost w-full'} aria-pressed={isRead} onClick={markRead}>{isRead ? '✓ Leitura concluída' : 'Marcar como lida'}</button>
      </div>
    </main>
  )
}
