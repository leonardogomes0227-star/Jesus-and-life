import { useState } from 'react'
import { Link } from 'react-router-dom'
import { verseOfDay } from '../lib/content'
import { chapterOfRef } from '../lib/bible'
import { dayKey, diffDays } from '../lib/dates'
import { useSpeech } from '../lib/speech'
import { useStore } from '../lib/store'

export default function Devotional() {
  const { state, update } = useStore()
  const today = dayKey()
  const verse = verseOfDay(diffDays('2024-01-01', today))
  const ref = chapterOfRef(verse.ref)
  const { supported, speaking, read } = useSpeech()
  const read_ = state.readDays.includes(today)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  const markRead = () => update((s) => (s.readDays.includes(today) ? s : { ...s, readDays: [...s.readDays, today] }))
  const saveNote = () => {
    if (!note.trim()) return
    update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind: 'reflexao', text: `${verse.prompt}\n${note.trim()}` }, ...s.journal] }))
    setSaved(true)
    setNote('')
    markRead()
  }

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/ler" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Ler</Link>
        {supported && <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => read(`${verse.ref}. ${verse.text}. ${verse.reflection}. Oração. ${verse.prayer}`)}>{speaking ? 'Parar' : 'Ouvir'}</button>}
      </div>
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-sun">Devocional de hoje</p>
        <h1 className="mt-1 font-display text-3xl font-bold">{verse.ref}</h1>
      </header>
      <section className="card">
        <blockquote className="font-display text-[22px] leading-snug">“{verse.text}”</blockquote>
        <p className="mt-2 text-sm font-semibold text-muted">{verse.ref} · ACF</p>
        {ref && <Link to={`/biblia/${ref.book.id}/${ref.chapter}${ref.verse ? `?v=${ref.verse}` : ''}`} className="mt-3 inline-block text-sm font-semibold text-accent underline">Ler o capítulo completo</Link>}
      </section>
      <section className="card"><h2 className="text-sm font-bold text-accent">Reflexão</h2><p className="mt-2 leading-relaxed">{verse.reflection}</p></section>
      <section className="card border-sun/50 bg-sun/10"><h2 className="text-sm font-bold text-sun">Prática de hoje</h2><p className="mt-2 leading-relaxed">{verse.practice}</p></section>
      <section className="card"><h2 className="text-sm font-bold text-accent">Oração</h2><p className="mt-2 italic leading-relaxed">{verse.prayer}</p></section>
      <section className="card">
        <h2 className="text-sm font-bold text-accent">Para anotar</h2>
        <p className="mt-1 text-sm text-muted">{verse.prompt}</p>
        <textarea className="field mt-3 py-3" rows={4} value={note} onChange={(e) => { setNote(e.target.value); setSaved(false) }} placeholder="Escreva o que vier. Vai para o seu diário." aria-label="Anotação do devocional" />
        <button className="btn-primary mt-3 w-full" onClick={saveNote} disabled={!note.trim()}>Salvar no diário</button>
        {saved && <p className="mt-2 text-sm font-semibold text-accent" role="status">Salvo no diário.</p>}
      </section>
      <button className={read_ ? 'btn-ghost w-full' : 'btn-primary w-full'} onClick={markRead} disabled={read_}>{read_ ? 'Devocional de hoje concluído' : 'Marcar como concluído'}</button>
      <p className="text-center text-xs text-muted">Sem sequência a manter. Volte quando puder.</p>
    </main>
  )
}
