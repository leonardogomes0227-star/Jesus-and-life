import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BOOKS } from '../lib/books'
import { fmtDate } from '../lib/dates'
import { useStore } from '../lib/store'
import type { JournalEntry } from '../lib/types'

const TABS = [
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'diario', label: 'Diário' },
  { id: 'biblia', label: 'Destaques' },
]
const KINDS: { id: JournalEntry['kind']; label: string; hint: string }[] = [
  { id: 'gratidao', label: 'Gratidão', hint: 'Pelo que você é grato(a) hoje?' },
  { id: 'reflexao', label: 'Reflexão', hint: 'O que Deus está ensinando?' },
  { id: 'livre', label: 'Livre', hint: 'Escreva o que quiser.' },
]

export default function Prayer() {
  const [sp, setSp] = useSearchParams()
  const tab = sp.get('aba') ?? 'pedidos'
  const { state, update } = useStore()
  const [text, setText] = useState('')
  const [kind, setKind] = useState<JournalEntry['kind']>('gratidao')
  const [answering, setAnswering] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [showAnswered, setShowAnswered] = useState(false)

  const open = state.prayers.filter((p) => !p.answeredAt)
  const answered = state.prayers.filter((p) => p.answeredAt)

  const addPrayer = () => {
    if (!text.trim()) return
    update((s) => ({ ...s, prayers: [{ id: crypto.randomUUID(), text: text.trim(), createdAt: new Date().toISOString(), prayedCount: 0 }, ...s.prayers] }))
    setText('')
  }
  const addEntry = () => {
    if (!text.trim()) return
    update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind, text: text.trim() }, ...s.journal] }))
    setText('')
  }
  const marks = Object.entries(state.marks).map(([k, m]) => {
    const [book, ch, v] = k.split('.')
    return { k, m, book: BOOKS.find((b) => b.id === book)!, ch: Number(ch), v: Number(v) }
  }).filter((x) => x.book)

  return (
    <main className="space-y-5">
      <Link to="/ler" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Ler</Link>
      <h1 className="font-display text-3xl font-bold">Oração e diário</h1>

      <div className="grid grid-cols-3 gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} className="chip justify-center" onClick={() => setSp({ aba: t.id })}>{t.label}</button>
        ))}
      </div>

      {tab === 'pedidos' && (
        <>
          <section className="card space-y-3">
            <label className="label" htmlFor="pedido">Novo pedido de oração</label>
            <textarea id="pedido" className="field py-3" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Pelo que você quer orar?" />
            <button className="btn-primary w-full" onClick={addPrayer} disabled={!text.trim()}>Adicionar pedido</button>
          </section>

          {open.length === 0 && <p className="text-center text-muted">Nenhum pedido em aberto.</p>}
          <ul className="space-y-3">
            {open.map((p) => (
              <li key={p.id} className="card !p-4">
                <p className="leading-relaxed">{p.text}</p>
                <p className="mt-1 text-xs text-muted">{fmtDate(p.createdAt)} · orado {p.prayedCount} {p.prayedCount === 1 ? 'vez' : 'vezes'}</p>
                {answering === p.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea className="field py-3" rows={2} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Como Deus respondeu? (opcional)" aria-label="Como foi respondida" />
                    <div className="grid grid-cols-2 gap-2">
                      <button className="btn-primary !min-h-[44px] text-sm" onClick={() => { update((s) => ({ ...s, prayers: s.prayers.map((x) => (x.id === p.id ? { ...x, answeredAt: new Date().toISOString(), answerNote: answer.trim() || undefined } : x)) })); setAnswering(null); setAnswer('') }}>Salvar</button>
                      <button className="btn-ghost !min-h-[44px] text-sm" onClick={() => setAnswering(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => update((s) => ({ ...s, prayers: s.prayers.map((x) => (x.id === p.id ? { ...x, prayedCount: x.prayedCount + 1 } : x)) }))}>Orei por isso</button>
                    <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => setAnswering(p.id)}>Foi respondido</button>
                    <button className="min-h-[44px] px-3 text-sm text-muted underline" onClick={() => { if (confirm('Apagar este pedido?')) update((s) => ({ ...s, prayers: s.prayers.filter((x) => x.id !== p.id) })) }}>Apagar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {answered.length > 0 && (
            <section>
              <button className="flex min-h-[48px] w-full items-center justify-between font-display text-xl font-bold" aria-expanded={showAnswered} onClick={() => setShowAnswered((v) => !v)}>
                Respondidos ({answered.length}) <span className="text-muted" aria-hidden>{showAnswered ? '−' : '+'}</span>
              </button>
              {showAnswered && (
                <ul className="mt-2 space-y-3">
                  {answered.map((p) => (
                    <li key={p.id} className="card !p-4">
                      <p>{p.text}</p>
                      {p.answerNote && <p className="mt-2 rounded-2xl bg-bg p-3 text-sm"><strong>Resposta:</strong> {p.answerNote}</p>}
                      <p className="mt-1 text-xs text-muted">Respondido em {fmtDate(p.answeredAt!)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}

      {tab === 'diario' && (
        <>
          <section className="card space-y-3">
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => <button key={k.id} aria-pressed={kind === k.id} className="chip" onClick={() => setKind(k.id)}>{k.label}</button>)}
            </div>
            <textarea className="field py-3" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={KINDS.find((k) => k.id === kind)!.hint} aria-label="Nova entrada do diário" />
            <button className="btn-primary w-full" onClick={addEntry} disabled={!text.trim()}>Salvar no diário</button>
          </section>
          {state.journal.length === 0 && <p className="text-center text-muted">Seu diário está vazio. Ele é só seu e fica neste aparelho.</p>}
          <ul className="space-y-3">
            {state.journal.map((e) => (
              <li key={e.id} className="card !p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-sun">{KINDS.find((k) => k.id === e.kind)!.label} · {fmtDate(e.at)}</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed">{e.text}</p>
                <button className="mt-2 min-h-[44px] text-sm text-muted underline" onClick={() => { if (confirm('Apagar esta entrada?')) update((s) => ({ ...s, journal: s.journal.filter((x) => x.id !== e.id) })) }}>Apagar</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === 'biblia' && (
        <>
          {marks.length === 0 && <p className="text-center text-muted">Toque em um versículo na Bíblia para destacar, favoritar ou anotar. Tudo aparece aqui.</p>}
          <ul className="space-y-3">
            {marks.map(({ k, m, book, ch, v }) => (
              <li key={k}>
                <Link to={`/biblia/${book.id}/${ch}?v=${v}`} className="card block !p-4 active:scale-[0.99]">
                  <span className="block font-bold text-accent">{book.name} {ch}:{v} {m.fav && <span className="text-sun">★</span>}</span>
                  {m.note && <span className="mt-1 block text-[15px]">{m.note}</span>}
                  {m.color && !m.note && <span className="mt-1 block text-sm text-muted">Destaque {m.color}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
