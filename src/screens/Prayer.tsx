import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BOOKS } from '../lib/books'
import { norm } from '../lib/bible'
import { dayKey, diffDays, fmtDate } from '../lib/dates'
import { useStore } from '../lib/store'
import type { JournalEntry, Prayer as PrayerT } from '../lib/types'

const TABS = [
  { id: 'orar', label: 'Orar' },
  { id: 'diario', label: 'Diário' },
  { id: 'respondidos', label: 'Respondidos' },
  { id: 'destaques', label: 'Destaques' },
]
const ALIAS: Record<string, string> = { pedidos: 'orar', biblia: 'destaques' }
const CATS = ['Por mim', 'Família', 'Amigos', 'Estudo e trabalho', 'Igreja', 'Outros']
const KINDS: { id: JournalEntry['kind']; label: string; hint: string }[] = [
  { id: 'gratidao', label: 'Gratidão', hint: 'Pelo que você é grato(a) hoje?' },
  { id: 'reflexao', label: 'Reflexão', hint: 'O que Deus está ensinando?' },
  { id: 'livre', label: 'Livre', hint: 'Escreva o que quiser.' },
]
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const monthKey = (iso: string) => dayKey(new Date(iso)).slice(0, 7)
const monthLabel = (k: string) => `${MONTHS[Number(k.slice(5)) - 1]} de ${k.slice(0, 4)}`
const daysSince = (iso: string) => diffDays(dayKey(new Date(iso)), dayKey())

/** Ordem de oração: primeiro o pedido que está há mais tempo sem ser lembrado. */
const lastTouched = (p: PrayerT) => p.prayedAt?.[p.prayedAt.length - 1] ?? p.createdAt

export default function Prayer() {
  const [sp, setSp] = useSearchParams()
  const tab = ALIAS[sp.get('aba') ?? ''] ?? sp.get('aba') ?? 'orar'
  const { state, update } = useStore()
  const [q, setQ] = useState('')
  const [text, setText] = useState('')
  const [cat, setCat] = useState('')
  const [kind, setKind] = useState<JournalEntry['kind']>('gratidao')
  const [kindFilter, setKindFilter] = useState<'todos' | JournalEntry['kind']>('todos')
  const [catFilter, setCatFilter] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [answering, setAnswering] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [round, setRound] = useState<number | null>(null)
  const [prayed, setPrayed] = useState(0)
  const [thanks, setThanks] = useState('')
  const [copied, setCopied] = useState(false)

  const open = useMemo(() => state.prayers.filter((p) => !p.answeredAt), [state.prayers])
  const answered = useMemo(() => state.prayers.filter((p) => p.answeredAt).sort((a, b) => +new Date(b.answeredAt!) - +new Date(a.answeredAt!)), [state.prayers])
  const queue = useMemo(() => [...open].sort((a, b) => +new Date(lastTouched(a)) - +new Date(lastTouched(b))).slice(0, 7), [round === null]) // eslint-disable-line react-hooks/exhaustive-deps

  const pray = (id: string) => update((s) => ({ ...s, prayers: s.prayers.map((x) => (x.id === id ? { ...x, prayedCount: x.prayedCount + 1, prayedAt: [...(x.prayedAt ?? []), new Date().toISOString()].slice(-200) } : x)) }))
  const addPrayer = () => {
    if (!text.trim()) return
    update((s) => ({ ...s, prayers: [{ id: crypto.randomUUID(), text: text.trim(), createdAt: new Date().toISOString(), prayedCount: 0, category: cat || undefined }, ...s.prayers] }))
    setText(''); setCat('')
  }
  const addEntry = () => {
    if (!text.trim()) return
    update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind, text: text.trim() }, ...s.journal] }))
    setText('')
  }
  const saveEdit = (id: string, type: 'p' | 'j') => {
    if (!draft.trim()) return
    update((s) => (type === 'p' ? { ...s, prayers: s.prayers.map((x) => (x.id === id ? { ...x, text: draft.trim() } : x)) } : { ...s, journal: s.journal.map((x) => (x.id === id ? { ...x, text: draft.trim() } : x)) }))
    setEditing(null)
  }
  const marks = Object.entries(state.marks).map(([k, m]) => { const [book, ch, v] = k.split('.'); return { k, m, book: BOOKS.find((b) => b.id === book)!, ch: Number(ch), v: Number(v) } }).filter((x) => x.book)

  /* ---------- Hora de orar (rodada guiada) ---------- */
  if (round !== null) {
    const cur = queue[round]
    return (
      <main className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <button className="flex min-h-[48px] items-center text-sm font-semibold text-muted" onClick={() => setRound(null)}>← Sair</button>
          <span className="text-sm font-semibold text-muted">{cur ? `${round + 1} de ${queue.length}` : 'Amém'}</span>
        </div>
        {cur ? (
          <div key={cur.id} className="fade-up space-y-6">
            {round === 0 && <p className="text-lg text-muted">Pai, estou aqui. Obrigado por me ouvires. Vou colocar diante de ti o que está no meu coração.</p>}
            <section className="rounded-3xl bg-sand p-6 text-sand-ink">
              {cur.category && <p className="text-sm font-semibold opacity-70">{cur.category}</p>}
              <p className="mt-1 font-display text-3xl font-semibold leading-snug">{cur.text}</p>
              <p className="mt-3 text-sm opacity-70">Pedido há {Math.max(1, daysSince(cur.createdAt))} {Math.max(1, daysSince(cur.createdAt)) === 1 ? 'dia' : 'dias'} · orado {cur.prayedCount} {cur.prayedCount === 1 ? 'vez' : 'vezes'}</p>
            </section>
            <p className="text-muted">Pare um instante e fale com Deus sobre isto, com as suas palavras. Pode ser curto.</p>
            <div className="grid gap-3">
              <button className="btn-primary w-full" onClick={() => { pray(cur.id); setPrayed((n) => n + 1); setRound(round + 1) }}>Orei por isto</button>
              <button className="btn-ghost w-full" onClick={() => setRound(round + 1)}>Pular</button>
            </div>
          </div>
        ) : (
          <div className="fade-up space-y-6 py-4">
            <h1 className="font-display text-4xl font-semibold leading-tight">{prayed > 0 ? `Você orou por ${prayed} ${prayed === 1 ? 'pedido' : 'pedidos'}.` : 'Amém.'}</h1>
            <p className="text-lg text-muted">Agora, em uma frase: pelo que você quer agradecer?</p>
            <textarea className="field py-3" rows={3} value={thanks} onChange={(e) => setThanks(e.target.value)} placeholder="Opcional. Vai para o diário como gratidão." aria-label="Gratidão" />
            <button className="btn-primary w-full" onClick={() => { if (thanks.trim()) update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind: 'gratidao', text: thanks.trim() }, ...s.journal] })); setThanks(''); setRound(null); setPrayed(0) }}>Concluir</button>
          </div>
        )}
      </main>
    )
  }

  /* ---------- Busca em tudo ---------- */
  const nq = norm(q)
  const hit = (s: string) => nq.length >= 2 && norm(s).includes(nq)
  const found = nq.length >= 2 ? { prayers: state.prayers.filter((p) => hit(p.text) || hit(p.answerNote ?? '')), journal: state.journal.filter((j) => hit(j.text)), marks: marks.filter((x) => hit(x.m.note ?? '')) } : null

  /* ---------- Retrospectiva do mês ---------- */
  const mk = dayKey().slice(0, 7)
  const inMonth = (iso?: string) => !!iso && monthKey(iso) === mk
  const retro = {
    oracoes: state.prayers.reduce((n, p) => n + (p.prayedAt?.filter(inMonth).length ?? 0), 0),
    novos: state.prayers.filter((p) => inMonth(p.createdAt)).length,
    respondidos: answered.filter((p) => inMonth(p.answeredAt)),
    registros: state.journal.filter((j) => inMonth(j.at)).length,
    gratidoes: state.journal.filter((j) => j.kind === 'gratidao' && inMonth(j.at)),
    momentos: state.moments.filter((m) => inMonth(m.at)).length,
  }
  const copySummary = async () => {
    const t = [`Meu mês com Deus, ${monthLabel(mk)}`, `Orei ${retro.oracoes} ${retro.oracoes === 1 ? 'vez' : 'vezes'}, comecei ${retro.novos} ${retro.novos === 1 ? 'pedido' : 'pedidos'} e ${retro.respondidos.length} ${retro.respondidos.length === 1 ? 'foi respondido' : 'foram respondidos'}.`, `Tive ${retro.momentos} ${retro.momentos === 1 ? 'momento' : 'momentos'} com Deus e escrevi ${retro.registros} ${retro.registros === 1 ? 'registro' : 'registros'} no diário.`, ...retro.respondidos.map((p) => `Respondido: ${p.text}${p.answerNote ? ` (${p.answerNote})` : ''}`)].join('\n')
    try { await navigator.clipboard.writeText(t); setCopied(true) } catch { setCopied(false) }
  }

  const stale = open.length > 0 ? [...open].sort((a, b) => +new Date(lastTouched(a)) - +new Date(lastTouched(b)))[0] : null
  const staleDays = stale ? daysSince(lastTouched(stale)) : 0

  const entryRow = (j: JournalEntry) => (
    <li key={j.id} className="card !p-4">
      <p className="text-sm font-semibold text-sun">{KINDS.find((k) => k.id === j.kind)!.label} · {fmtDate(j.at)}</p>
      {editing === j.id ? (
        <div className="mt-2 space-y-2">
          <textarea className="field py-3" rows={5} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Editar registro" />
          <div className="grid grid-cols-2 gap-2"><button className="btn-primary !min-h-[44px] text-sm" onClick={() => saveEdit(j.id, 'j')}>Salvar</button><button className="btn-ghost !min-h-[44px] text-sm" onClick={() => setEditing(null)}>Cancelar</button></div>
        </div>
      ) : (
        <>
          <p className="mt-1 whitespace-pre-line leading-relaxed">{j.text}</p>
          <div className="mt-1 flex gap-4"><button className="min-h-[44px] text-sm text-muted underline" onClick={() => { setEditing(j.id); setDraft(j.text) }}>Editar</button><button className="min-h-[44px] text-sm text-muted underline" onClick={() => { if (confirm('Apagar este registro?')) update((s) => ({ ...s, journal: s.journal.filter((x) => x.id !== j.id) })) }}>Apagar</button></div>
        </>
      )}
    </li>
  )

  const journalList = state.journal.filter((j) => kindFilter === 'todos' || j.kind === kindFilter)
  const byMonth = journalList.reduce<Record<string, JournalEntry[]>>((acc, j) => { (acc[monthKey(j.at)] ??= []).push(j); return acc }, {})

  return (
    <main className="space-y-6 pb-8">
      <Link to="/biblia" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Bíblia</Link>
      <h1 className="font-display text-4xl font-semibold leading-tight">Oração e diário</h1>

      <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar em pedidos, diário e notas" aria-label="Buscar" type="search" />

      {found ? (
        <section className="space-y-4">
          <p className="text-sm font-semibold text-muted">{found.prayers.length + found.journal.length + found.marks.length} resultados para “{q}”</p>
          {found.prayers.map((p) => <div key={p.id} className="card !p-4"><p className="text-sm font-semibold text-sun">Pedido{p.answeredAt ? ' respondido' : ''} · {fmtDate(p.createdAt)}</p><p className="mt-1">{p.text}</p>{p.answerNote && <p className="mt-2 rounded-xl bg-bg p-3 text-sm"><strong>Resposta:</strong> {p.answerNote}</p>}</div>)}
          {found.journal.map((j) => <div key={j.id} className="card !p-4"><p className="text-sm font-semibold text-sun">Diário · {fmtDate(j.at)}</p><p className="mt-1 whitespace-pre-line">{j.text}</p></div>)}
          {found.marks.map((x) => <Link key={x.k} to={`/biblia/${x.book.id}/${x.ch}?v=${x.v}`} className="card block !p-4"><p className="text-sm font-semibold text-sun">{x.book.name} {x.ch}:{x.v}</p><p className="mt-1">{x.m.note}</p></Link>)}
          {found.prayers.length + found.journal.length + found.marks.length === 0 && <p className="text-muted">Nada encontrado.</p>}
        </section>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2" role="tablist">
            {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} aria-pressed={tab === t.id} className="chip justify-center !px-1 text-sm" onClick={() => setSp({ aba: t.id })}>{t.label}</button>)}
          </div>

          {tab === 'orar' && (
            <>
              {open.length > 0 ? (
                <section className="rounded-3xl bg-night p-6 text-night-ink">
                  <h2 className="font-display text-3xl font-semibold leading-tight">Hora de orar</h2>
                  <p className="mt-2 opacity-85">Uma rodada guiada pelos seus {open.length} {open.length === 1 ? 'pedido' : 'pedidos'} em aberto, um de cada vez. Leva poucos minutos.</p>
                  {stale && staleDays >= 7 && <p className="mt-3 rounded-2xl bg-night-ink/10 p-3 text-sm">Faz {staleDays} dias que você não ora por “{stale.text.length > 60 ? `${stale.text.slice(0, 60)}…` : stale.text}”.</p>}
                  <button className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full bg-night-ink px-6 font-semibold text-night" onClick={() => { setPrayed(0); setRound(0) }}>Começar a orar</button>
                </section>
              ) : (
                <section className="rounded-3xl bg-sand p-6 text-sand-ink">
                  <h2 className="font-display text-2xl font-semibold">Comece com um pedido.</h2>
                  <p className="mt-2">Pode ser por você, por alguém da família, por um amigo ou por uma decisão. Escreva abaixo, e depois o app guia você a orar por ele.</p>
                </section>
              )}

              <section className="card space-y-3">
                <label className="label" htmlFor="pedido">Novo pedido de oração</label>
                <textarea id="pedido" className="field py-3" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Pelo que você quer orar?" />
                <div className="flex flex-wrap gap-2">{CATS.map((c) => <button key={c} aria-pressed={cat === c} className="chip !min-h-[40px] text-sm" onClick={() => setCat(cat === c ? '' : c)}>{c}</button>)}</div>
                <button className="btn-primary w-full" onClick={addPrayer} disabled={!text.trim()}>Adicionar pedido</button>
              </section>

              {open.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-end justify-between"><h2 className="font-display text-2xl font-semibold">Em aberto</h2>
                    <select className="rounded-full border border-line bg-surface px-3 py-2 text-sm" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} aria-label="Filtrar por categoria"><option value="">Todos</option>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
                  </div>
                  <ul className="space-y-3">
                    {open.filter((p) => !catFilter || p.category === catFilter).map((p) => (
                      <li key={p.id} className="card !p-4">
                        {editing === p.id ? (
                          <div className="space-y-2"><textarea className="field py-3" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Editar pedido" /><div className="grid grid-cols-2 gap-2"><button className="btn-primary !min-h-[44px] text-sm" onClick={() => saveEdit(p.id, 'p')}>Salvar</button><button className="btn-ghost !min-h-[44px] text-sm" onClick={() => setEditing(null)}>Cancelar</button></div></div>
                        ) : (
                          <>
                            {p.category && <p className="text-sm font-semibold text-sun">{p.category}</p>}
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
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => pray(p.id)}>Orei por isso</button>
                                <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => setAnswering(p.id)}>Foi respondido</button>
                                <button className="min-h-[44px] px-2 text-sm text-muted underline" onClick={() => { setEditing(p.id); setDraft(p.text) }}>Editar</button>
                                <button className="min-h-[44px] px-2 text-sm text-muted underline" onClick={() => { if (confirm('Apagar este pedido?')) update((s) => ({ ...s, prayers: s.prayers.filter((x) => x.id !== p.id) })) }}>Apagar</button>
                              </div>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}

          {tab === 'diario' && (
            <>
              <section className="card space-y-3">
                <div className="flex flex-wrap gap-2">{KINDS.map((k) => <button key={k.id} aria-pressed={kind === k.id} className="chip" onClick={() => setKind(k.id)}>{k.label}</button>)}</div>
                <textarea className="field py-3" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder={KINDS.find((k) => k.id === kind)!.hint} aria-label="Nova entrada do diário" />
                <button className="btn-primary w-full" onClick={addEntry} disabled={!text.trim()}>Salvar no diário</button>
              </section>
              {state.journal.length === 0 ? (
                <p className="text-center text-muted">Seu diário está vazio. Ele é só seu e fica neste aparelho. Os momentos com Deus, as lições e a Noite também escrevem aqui.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(['todos', ...KINDS.map((k) => k.id)] as const).map((k) => <button key={k} aria-pressed={kindFilter === k} className="chip !min-h-[40px] text-sm" onClick={() => setKindFilter(k)}>{k === 'todos' ? `Todos (${state.journal.length})` : `${KINDS.find((x) => x.id === k)!.label} (${state.journal.filter((j) => j.kind === k).length})`}</button>)}
                  </div>
                  {Object.entries(byMonth).map(([k, list]) => (
                    <section key={k} className="space-y-3"><h2 className="font-display text-xl font-semibold capitalize">{monthLabel(k)}</h2><ul className="space-y-3">{list.map(entryRow)}</ul></section>
                  ))}
                </>
              )}
            </>
          )}

          {tab === 'respondidos' && (
            <>
              <section className="rounded-3xl bg-night p-6 text-night-ink">
                <p className="font-display text-6xl font-semibold leading-none">{answered.length}</p>
                <p className="mt-2 text-lg">{answered.length === 1 ? 'oração respondida' : 'orações respondidas'}</p>
                <p className="mt-2 text-sm opacity-80">Reler o que Deus já fez ajuda a confiar quando o dia está difícil.</p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-semibold">Seu mês, {monthLabel(mk)}</h2>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  {([[retro.oracoes, 'orações feitas'], [retro.novos, 'pedidos novos'], [retro.respondidos.length, 'respondidos'], [retro.momentos, 'momentos com Deus'], [retro.registros, 'registros no diário']] as [number, string][]).map(([n, l]) => <div key={l}><p className="font-display text-4xl font-semibold leading-none">{n}</p><p className="mt-1 text-sm text-muted">{l}</p></div>)}
                </div>
                {retro.gratidoes.length > 0 && (
                  <div className="rounded-3xl bg-sand p-5 text-sand-ink"><p className="font-semibold">Pelo que você agradeceu neste mês</p><ul className="mt-2 space-y-1">{retro.gratidoes.slice(0, 5).map((g) => <li key={g.id} className="leading-snug">• {g.text.split('\n').slice(-1)[0].slice(0, 120)}</li>)}</ul></div>
                )}
                <button className="btn-ghost w-full" onClick={copySummary}>{copied ? 'Resumo copiado' : 'Copiar o resumo do mês'}</button>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-2xl font-semibold">O que Deus respondeu</h2>
                {answered.length === 0 && <p className="text-muted">Quando você marcar um pedido como respondido, ele aparece aqui, com o tempo que levou.</p>}
                <ul className="space-y-3">
                  {answered.map((p) => {
                    const took = Math.max(0, diffDays(dayKey(new Date(p.createdAt)), dayKey(new Date(p.answeredAt!))))
                    return (
                      <li key={p.id} className="card !p-4">
                        <p className="leading-relaxed">{p.text}</p>
                        {p.answerNote && <p className="mt-2 rounded-xl bg-bg p-3 text-sm"><strong>Resposta:</strong> {p.answerNote}</p>}
                        <p className="mt-2 text-xs text-muted">Pedido em {fmtDate(p.createdAt)} · respondido em {fmtDate(p.answeredAt!)} · {took === 0 ? 'no mesmo dia' : `${took} ${took === 1 ? 'dia' : 'dias'} depois`}</p>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </>
          )}

          {tab === 'destaques' && (
            <>
              {marks.length === 0 && <p className="text-center text-muted">Toque em um versículo na Bíblia para destacar, favoritar ou anotar. Tudo aparece aqui.</p>}
              <ul className="space-y-3">
                {marks.map(({ k, m, book, ch, v }) => (
                  <li key={k}>
                    <Link to={`/biblia/${book.id}/${ch}?v=${v}${m.to ? `&to=${m.to}` : ''}`} className="card block !p-4 active:scale-[0.99]">
                      <span className="block font-bold">{book.name} {ch}:{v}{m.to ? `-${m.to}` : ''} {m.fav && <span className="text-sun">★</span>}</span>
                      {m.note && <span className="mt-1 block text-[15px]">{m.note}</span>}
                      {m.color && !m.note && <span className="mt-1 block text-sm text-muted">Destaque {m.color}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </main>
  )
}
