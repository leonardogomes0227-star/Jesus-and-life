import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BOOKS } from '../lib/books'
import { bookById, loadBook, parseRef, searchText, type Hit } from '../lib/bible'
import { planById } from '../lib/plans'
import { useStore } from '../lib/store'
import type { MarkColor } from '../lib/types'

const hl: Record<MarkColor, string> = {
  amarelo: 'bg-sun/25',
  azul: 'bg-accent/20',
  verde: 'bg-emerald-500/20',
}
const dot: Record<MarkColor, string> = { amarelo: 'bg-sun', azul: 'bg-accent', verde: 'bg-emerald-500' }
const SIZES = ['text-[17px]', 'text-[19px]', 'text-[22px]']

/** Início da Bíblia: busca por referência ou palavra, continuar lendo e lista de livros. */
export function BibleHome() {
  const { state } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const last = state.lastRead ? bookById(state.lastRead.book) : null
  const favs = Object.entries(state.marks).filter(([, m]) => m.fav || m.color || m.note).length

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const ref = parseRef(q)
    if (ref) return navigate(`/biblia/${ref.book.id}/${ref.chapter}${ref.verse ? `?v=${ref.verse}` : ''}`)
    if (q.trim().length < 3) return setErr('Digite uma passagem (ex.: João 3:16) ou uma palavra com 3 letras ou mais.')
    setBusy(true)
    try {
      setHits(await searchText(q))
    } catch {
      setErr('Não foi possível buscar agora. Verifique a conexão e tente de novo.')
    }
    setBusy(false)
  }

  return (
    <main className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/ler" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Ler</Link>
        {favs > 0 && <Link to="/orar?aba=biblia" className="text-sm font-semibold text-accent">Meus destaques ({favs})</Link>}
      </div>
      <h1 className="font-display text-3xl font-bold">Bíblia</h1>

      <form onSubmit={submit} className="flex gap-2" role="search">
        <input className="field" value={q} onChange={(e) => { setQ(e.target.value); setHits(null) }} placeholder="João 3:16 ou uma palavra" aria-label="Buscar passagem ou palavra" />
        <button className="btn-primary shrink-0 !px-5" disabled={busy}>{busy ? '…' : 'Buscar'}</button>
      </form>
      {err && <p className="text-sm text-sun" role="alert">{err}</p>}

      {hits && (
        <section className="space-y-2">
          <p className="text-sm font-semibold text-muted">{hits.length === 0 ? 'Nada encontrado.' : `${hits.length}${hits.length >= 60 ? '+' : ''} resultados`}</p>
          {hits.map((h, i) => (
            <Link key={i} to={`/biblia/${h.book.id}/${h.chapter}?v=${h.verse}`} className="card block !p-4 active:scale-[0.99]">
              <span className="block text-sm font-bold text-accent">{h.book.name} {h.chapter}:{h.verse}</span>
              <span className="block text-[15px] leading-snug">{h.text}</span>
            </Link>
          ))}
        </section>
      )}

      {!hits && last && (
        <Link to={`/biblia/${last.id}/${state.lastRead!.chapter}`} className="card block active:scale-[0.99]">
          <span className="block text-sm font-semibold text-muted">Continuar de onde parou</span>
          <span className="block font-display text-xl font-bold">{last.name} {state.lastRead!.chapter}</span>
        </Link>
      )}

      {!hits && (['AT', 'NT'] as const).map((t) => (
        <section key={t}>
          <h2 className="mb-3 font-display text-xl font-bold">{t === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</h2>
          <div className="grid grid-cols-2 gap-2">
            {BOOKS.filter((b) => b.testament === t).map((b) => (
              <Link key={b.id} to={`/biblia/${b.id}`} className="flex min-h-[48px] items-center rounded-2xl border border-line bg-surface px-4 text-[15px] font-semibold active:scale-[0.98]">{b.name}</Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}

export function BookPage() {
  const { book } = useParams()
  const b = bookById(book ?? '')
  if (!b) return <main><Link to="/biblia" className="btn-primary">Voltar</Link></main>
  return (
    <main className="space-y-5">
      <Link to="/biblia" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Bíblia</Link>
      <h1 className="font-display text-3xl font-bold">{b.name}</h1>
      <p className="text-muted">{b.chapters} {b.chapters === 1 ? 'capítulo' : 'capítulos'}</p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: b.chapters }, (_, i) => (
          <Link key={i} to={`/biblia/${b.id}/${i + 1}`} className="flex min-h-[52px] items-center justify-center rounded-2xl border border-line bg-surface font-semibold active:scale-95">{i + 1}</Link>
        ))}
      </div>
    </main>
  )
}

export function Reader() {
  const { book, chapter } = useParams()
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const { state, update, setMark, setLastRead } = useStore()
  const b = bookById(book ?? '')
  const ch = Number(chapter)
  const planId = sp.get('plano')
  const plan = planId ? planById(planId) : undefined
  const targetV = Number(sp.get('v')) || 0
  const [verses, setVerses] = useState<string[] | null>(null)
  const [error, setError] = useState(false)
  const [sel, setSel] = useState<number | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')
  const scrolled = useRef(false)

  useEffect(() => {
    if (!b) return
    setVerses(null)
    setError(false)
    setSel(null)
    scrolled.current = false
    loadBook(b.id).then((c) => setVerses(c[ch - 1] ?? [])).catch(() => setError(true))
    setLastRead(b.id, ch)
    window.scrollTo(0, 0)
  }, [b?.id, ch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (verses && targetV && !scrolled.current) {
      scrolled.current = true
      document.getElementById(`v${targetV}`)?.scrollIntoView({ block: 'center' })
    }
  }, [verses, targetV])

  const key = (v: number) => `${b!.id}.${ch}.${v}`
  const mark = sel ? state.marks[key(sel)] : undefined
  const ref = useMemo(() => (b ? `${b.name} ${ch}` : ''), [b, ch])

  if (!b || ch < 1 || ch > b.chapters) return <main><Link to="/biblia" className="btn-primary">Voltar à Bíblia</Link></main>

  const go = (delta: number) => {
    const idx = BOOKS.findIndex((x) => x.id === b.id)
    let nb = b, nc = ch + delta
    if (nc < 1) { const p = BOOKS[idx - 1]; if (!p) return; nb = p; nc = p.chapters }
    else if (nc > b.chapters) { const n = BOOKS[idx + 1]; if (!n) return; nb = n; nc = 1 }
    navigate(`/biblia/${nb.id}/${nc}${planId ? `?plano=${planId}` : ''}`)
  }

  const verseText = sel && verses ? verses[sel - 1] : ''
  const citation = `“${verseText}” (${ref}:${sel}, ACF)`
  const copy = async () => {
    try { await navigator.clipboard.writeText(citation); setMsg('Copiado.') } catch { setMsg('Não deu para copiar.') }
  }
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ text: citation }) } catch { /* cancelado */ } }
    else window.open(`https://wa.me/?text=${encodeURIComponent(citation)}`, '_blank', 'noopener')
  }
  const scale = state.fontScale

  return (
    <main className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <Link to={`/biblia/${b.id}`} className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← {b.name}</Link>
        <div className="flex gap-2" role="group" aria-label="Tamanho da letra">
          <button className="btn-ghost !min-h-[44px] !px-4" disabled={scale === 0} onClick={() => update((s) => ({ ...s, fontScale: Math.max(0, s.fontScale - 1) as 0 | 1 | 2 }))} aria-label="Diminuir letra">A−</button>
          <button className="btn-ghost !min-h-[44px] !px-4" disabled={scale === 2} onClick={() => update((s) => ({ ...s, fontScale: Math.min(2, s.fontScale + 1) as 0 | 1 | 2 }))} aria-label="Aumentar letra">A+</button>
        </div>
      </div>

      {plan && <Link to={`/planos/${plan.id}`} className="block rounded-2xl bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">Plano: {plan.title} · voltar ao plano</Link>}

      <h1 className="font-display text-3xl font-bold">{b.name} {ch}</h1>

      {error && <p className="card text-muted">Não foi possível carregar este capítulo. Verifique a conexão e tente de novo.</p>}
      {!verses && !error && <p className="text-muted">Carregando…</p>}
      {verses && (
        <article className={`${SIZES[scale]} leading-[1.75]`}>
          {verses.map((t, i) => {
            const n = i + 1
            const m = state.marks[key(n)]
            return (
              <span key={n} id={`v${n}`}>
                <button onClick={() => { setSel(sel === n ? null : n); setNoteOpen(false); setNote(state.marks[key(n)]?.note ?? ''); setMsg('') }} className={`rounded px-0.5 text-left align-baseline ${m?.color ? hl[m.color] : ''} ${sel === n ? 'underline decoration-accent decoration-2 underline-offset-4' : ''} ${targetV === n && !sel ? 'bg-sun/30' : ''}`}>
                  <sup className="mr-1 text-[0.6em] font-bold text-accent">{n}</sup>{t}
                  {m?.note && <span className="ml-1 text-[0.7em] text-accent" aria-label="Tem anotação">✎</span>}
                  {m?.fav && <span className="ml-1 text-[0.7em] text-sun" aria-label="Favorito">★</span>}
                </button>{' '}
              </span>
            )
          })}
        </article>
      )}

      {verses && (
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button className="btn-ghost" onClick={() => go(-1)}>← Anterior</button>
          <button className="btn-ghost" onClick={() => go(1)}>Próximo →</button>
        </div>
      )}

      {sel && verses && (
        <div className="fixed inset-x-0 bottom-0 z-30 md:left-60" role="dialog" aria-label={`Ações do versículo ${sel}`}>
          <div className="mx-auto max-w-[520px] rounded-t-3xl border border-line bg-surface p-4 shadow-2xl md:max-w-[680px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-bold">{ref}:{sel}</p>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-line" onClick={() => setSel(null)} aria-label="Fechar">×</button>
            </div>
            <div className="mb-3 flex items-center gap-3">
              {(['amarelo', 'azul', 'verde'] as MarkColor[]).map((c) => (
                <button key={c} aria-label={`Destacar de ${c}`} aria-pressed={mark?.color === c} onClick={() => setMark(key(sel), { color: mark?.color === c ? undefined : c })} className={`h-10 w-10 rounded-full ${dot[c]} ${mark?.color === c ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : 'opacity-70'}`} />
              ))}
              <button className="btn-ghost !min-h-[44px] !px-4 text-sm" aria-pressed={!!mark?.fav} onClick={() => setMark(key(sel), { fav: !mark?.fav })}>{mark?.fav ? '★ Favorito' : '☆ Favoritar'}</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="btn-ghost !min-h-[44px] !px-2 text-sm" onClick={() => setNoteOpen((o) => !o)}>Anotar</button>
              <button className="btn-ghost !min-h-[44px] !px-2 text-sm" onClick={copy}>Copiar</button>
              <button className="btn-ghost !min-h-[44px] !px-2 text-sm" onClick={share}>Enviar</button>
            </div>
            {noteOpen && (
              <div className="mt-3 space-y-2">
                <textarea className="field py-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Sua anotação neste versículo" aria-label="Anotação do versículo" />
                <button className="btn-primary w-full" onClick={() => { setMark(key(sel), { note: note.trim() || undefined }); setNoteOpen(false); setMsg('Anotação salva.') }}>Salvar anotação</button>
              </div>
            )}
            {msg && <p className="mt-2 text-sm font-semibold text-accent" role="status">{msg}</p>}
          </div>
        </div>
      )}
    </main>
  )
}
