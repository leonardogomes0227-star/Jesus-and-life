import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BOOKS } from '../lib/books'
import { ABOUT, CATEGORIES } from '../lib/bookInfo'
import { NEEDS } from '../lib/needs'
import { bookById, loadBook, parseRef, searchText, type Hit } from '../lib/bible'
import { planById } from '../lib/plans'
import { verseImage } from '../lib/shareImage'
import { useSpeech } from '../lib/speech'
import { useStore } from '../lib/store'
import type { MarkColor } from '../lib/types'

const hl: Record<MarkColor, string> = { amarelo: 'bg-sun/25', azul: 'bg-accent/20', verde: 'bg-emerald-500/20' }
const dot: Record<MarkColor, string> = { amarelo: 'bg-sun', azul: 'bg-accent', verde: 'bg-emerald-500' }
const SIZES = ['text-[17px]', 'text-[19px]', 'text-[22px]']
const SUGGEST = ['paz', 'medo', 'perdão', 'liberdade', 'esperança', 'força']

const rangeLabel = (sel: number[]): string => {
  const s = [...sel].sort((a, b) => a - b)
  if (s.length === 1) return String(s[0])
  const contiguous = s.every((v, i) => i === 0 || v === s[i - 1] + 1)
  return contiguous ? `${s[0]}-${s[s.length - 1]}` : s.join(', ')
}
const link = (book: string, ch: number, from?: number, to?: number) =>
  `/biblia/${book}/${ch}${from ? `?v=${from}${to ? `&to=${to}` : ''}` : ''}`

/** Trechos que o usuário marcou, com o texto, para relembrar. */
function Notebook() {
  const { state } = useStore()
  const items = Object.entries(state.marks)
    .map(([k, m]) => { const [book, ch, v] = k.split('.'); return { k, m, book, ch: Number(ch), v: Number(v) } })
    .filter((x) => bookById(x.book))
    .slice(-3)
    .reverse()
  const [texts, setTexts] = useState<Record<string, string>>({})
  useEffect(() => {
    let live = true
    items.forEach(async (x) => {
      const c = await loadBook(x.book).catch(() => null)
      if (live && c) setTexts((t) => ({ ...t, [x.k]: c[x.ch - 1]?.[x.v - 1] ?? '' }))
    })
    return () => { live = false }
  }, [state.marks]) // eslint-disable-line react-hooks/exhaustive-deps
  if (items.length === 0) return null
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl font-bold">Do seu caderno</h2>
        <Link to="/orar?aba=biblia" className="text-sm font-semibold text-accent">Ver tudo</Link>
      </div>
      <div className="space-y-2">
        {items.map(({ k, m, book, ch, v }) => (
          <Link key={k} to={link(book, ch, v, m.to)} className="card block !p-4 active:scale-[0.99]">
            <span className="block text-sm font-bold text-accent">{bookById(book)!.name} {ch}:{v}{m.to ? `-${m.to}` : ''} {m.fav && <span className="text-sun">★</span>}</span>
            {texts[k] && <span className="mt-1 block text-[15px] leading-snug">{texts[k]}</span>}
            {m.note && <span className="mt-2 block rounded-xl bg-bg p-3 text-sm"><strong>Sua nota:</strong> {m.note}</span>}
          </Link>
        ))}
      </div>
    </section>
  )
}

export function BibleHome() {
  const { state } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [test, setTest] = useState<'AT' | 'NT' | undefined>(undefined)
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [need, setNeed] = useState<string | null>(null)
  const last = state.lastRead ? bookById(state.lastRead.book) : null
  const readInBook = last ? state.readChapters.filter((c) => c.startsWith(last.id + '.')).length : 0
  const needData = NEEDS.find((n) => n.id === need)

  const run = async (query: string, t = test) => {
    setErr('')
    const ref = parseRef(query)
    if (ref) return navigate(link(ref.book.id, ref.chapter, ref.verse))
    if (query.trim().length < 3) return setErr('Digite uma passagem (ex.: João 3:16) ou uma palavra com 3 letras ou mais.')
    setBusy(true)
    try { setHits(await searchText(query, 60, t)) } catch { setErr('Não foi possível buscar agora. Verifique a conexão e tente de novo.') }
    setBusy(false)
  }

  return (
    <main className="space-y-6">
      <h1 className="font-display text-4xl font-semibold">Bíblia</h1>

      <section className="space-y-3">
        <form onSubmit={(e) => { e.preventDefault(); void run(q) }} className="flex gap-2" role="search">
          <input className="field" value={q} onChange={(e) => { setQ(e.target.value); setHits(null) }} placeholder="João 3:16 ou uma palavra" aria-label="Buscar passagem ou palavra" />
          <button className="btn-primary shrink-0 !px-5" disabled={busy}>{busy ? '…' : 'Buscar'}</button>
        </form>
        {err && <p className="text-sm text-sun" role="alert">{err}</p>}
        {!hits && (
          <div className="flex flex-wrap gap-2">
            {SUGGEST.map((w) => <button key={w} className="chip !min-h-[44px] text-sm" onClick={() => { setQ(w); void run(w) }}>{w}</button>)}
          </div>
        )}
        {hits && (
          <div className="flex flex-wrap items-center gap-2">
            {([[undefined, 'Tudo'], ['AT', 'Antigo Test.'], ['NT', 'Novo Test.']] as const).map(([v, l]) => (
              <button key={l} aria-pressed={test === v} className="chip !min-h-[44px] text-sm" onClick={() => { setTest(v); void run(q, v) }}>{l}</button>
            ))}
            <button className="min-h-[44px] px-2 text-sm font-semibold text-accent underline" onClick={() => { setHits(null); setQ('') }}>Limpar</button>
          </div>
        )}
      </section>

      {hits && (
        <section className="space-y-2">
          <p className="text-sm font-semibold text-muted">{hits.length === 0 ? 'Nada encontrado. Tente outra palavra.' : `${hits.length}${hits.length >= 60 ? '+' : ''} resultados`}</p>
          {hits.map((h, i) => (
            <Link key={i} to={link(h.book.id, h.chapter, h.verse)} className="card block !p-4 active:scale-[0.99]">
              <span className="block text-sm font-bold text-accent">{h.book.name} {h.chapter}:{h.verse}</span>
              <span className="block text-[15px] leading-snug">{h.text}</span>
            </Link>
          ))}
        </section>
      )}

      {!hits && (
        <>
          {last && (
            <Link to={link(last.id, state.lastRead!.chapter)} className="card block active:scale-[0.99]">
              <span className="block text-sm font-semibold text-muted">Continuar de onde parou</span>
              <span className="block font-display text-xl font-bold">{last.name} {state.lastRead!.chapter}</span>
              {readInBook > 0 && <span className="text-xs text-muted">{readInBook} de {last.chapters} capítulos lidos</span>}
            </Link>
          )}

          <section>
            <h2 className="font-display text-xl font-bold">Por onde começar?</h2>
            <p className="mb-3 mt-1 text-sm text-muted">Escolha o que você precisa agora. Cada passagem vem com o motivo de ler.</p>
            <div className="flex flex-wrap gap-2">
              {NEEDS.map((n) => <button key={n.id} aria-pressed={need === n.id} className="chip !min-h-[44px] text-sm" onClick={() => setNeed(need === n.id ? null : n.id)}>{n.title}</button>)}
            </div>
            {needData && (
              <ul className="mt-4 space-y-2 pop">
                <li className="px-1 text-sm text-muted">{needData.blurb}</li>
                {needData.passages.map((p) => (
                  <li key={p.ref}>
                    <Link to={link(p.book, p.chapter, p.from, p.to)} className="card block !p-4 active:scale-[0.99]">
                      <span className="block font-bold text-accent">{p.ref}</span>
                      <span className="block text-[15px]">{p.why}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Notebook />

          <section>
            <h2 className="mb-3 font-display text-xl font-bold">Todos os livros</h2>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <details key={c.id} className="rounded-2xl border border-line bg-surface">
                  <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between px-4 font-semibold">
                    {c.name}<span className="text-sm font-normal text-muted">{c.ids.length}</span>
                  </summary>
                  <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                    {c.ids.map((id) => <Link key={id} to={`/biblia/${id}`} className="flex min-h-[48px] items-center rounded-xl border border-line bg-bg px-3 text-[15px] font-semibold active:scale-[0.98]">{bookById(id)!.name}</Link>)}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold">Para ler, orar e descansar</h2>
            <div className="space-y-2">
              {[
                ['/planos', 'Planos de leitura', 'Da Bíblia em 1 ano a leituras curtas por tema.'],
                ['/orar', 'Oração e diário', 'Pedidos, respostas, gratidão e reflexões.'],
                ['/descanso', 'Meditação e descanso', 'Áudios guiados para desacelerar e dormir.'],
              ].map(([to, t, s]) => (
                <Link key={to} to={to} className="card flex items-center justify-between gap-3 !p-4 active:scale-[0.99]">
                  <span><span className="block font-semibold">{t}</span><span className="block text-sm text-muted">{s}</span></span>
                  <span className="text-muted" aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export function BookPage() {
  const { book } = useParams()
  const { state } = useStore()
  const b = bookById(book ?? '')
  if (!b) return <main><Link to="/biblia" className="btn-primary">Voltar</Link></main>
  const cat = CATEGORIES.find((c) => c.ids.includes(b.id))
  const read = state.readChapters.filter((c) => c.startsWith(b.id + '.')).length
  return (
    <main className="space-y-5">
      <Link to="/biblia" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Bíblia</Link>
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-sun">{cat?.name} · {b.testament === 'AT' ? 'Antigo Testamento' : 'Novo Testamento'}</p>
        <h1 className="font-display text-3xl font-bold">{b.name}</h1>
      </header>
      <section className="card"><h2 className="text-sm font-bold text-accent">Sobre este livro</h2><p className="mt-2 leading-relaxed">{ABOUT[b.id]}</p></section>
      <p className="text-sm text-muted">{b.chapters} {b.chapters === 1 ? 'capítulo' : 'capítulos'}{read > 0 ? ` · ${read} lidos` : ''}</p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: b.chapters }, (_, i) => {
          const done = state.readChapters.includes(`${b.id}.${i + 1}`)
          return <Link key={i} to={link(b.id, i + 1)} aria-label={`Capítulo ${i + 1}${done ? ', lido' : ''}`} className={`flex min-h-[52px] items-center justify-center rounded-2xl border font-semibold active:scale-95 ${done ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-surface'}`}>{done ? '✓ ' : ''}{i + 1}</Link>
        })}
      </div>
    </main>
  )
}

export function Reader() {
  const { book, chapter } = useParams()
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const { state, update, setMark, setLastRead, togglePlanDay } = useStore()
  const b = bookById(book ?? '')
  const ch = Number(chapter)
  const planId = sp.get('plano')
  const planDay = sp.get('dia') !== null ? Number(sp.get('dia')) : null
  const plan = planId ? planById(planId) : undefined
  const from = Number(sp.get('v')) || 0
  const to = Number(sp.get('to')) || from
  const [verses, setVerses] = useState<string[] | null>(null)
  const [error, setError] = useState(false)
  const [sel, setSel] = useState<number[]>([])
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState('')
  const [about, setAbout] = useState(false)
  const [q, setQ] = useState(['', '', ''])
  const [saved, setSaved] = useState('')
  const scrolled = useRef(false)
  const { supported, speaking, read } = useSpeech()
  const [hint, setHint] = useState(() => { try { return localStorage.getItem('livre.hint.verso') !== '1' } catch { return true } })

  useEffect(() => {
    if (!b) return
    setVerses(null); setError(false); setSel([]); setQ(['', '', '']); setSaved(''); setMsg('')
    scrolled.current = false
    loadBook(b.id).then((c) => setVerses(c[ch - 1] ?? [])).catch(() => setError(true))
    setLastRead(b.id, ch)
    setAbout(ch === 1 && !state.readChapters.some((c) => c.startsWith(b.id + '.')))
    window.scrollTo(0, 0)
  }, [b?.id, ch]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (verses && from && !scrolled.current) {
      scrolled.current = true
      document.getElementById(`v${from}`)?.scrollIntoView({ block: 'center' })
    }
  }, [verses, from])

  const key = (v: number) => `${b!.id}.${ch}.${v}`
  const ref = useMemo(() => (b ? `${b.name} ${ch}` : ''), [b, ch])
  const chKey = b ? `${b.id}.${ch}` : ''
  const isRead = state.readChapters.includes(chKey)

  if (!b || ch < 1 || ch > b.chapters) return <main><Link to="/biblia" className="btn-primary">Voltar à Bíblia</Link></main>

  const setRead = (on: boolean) => update((s) => ({ ...s, readChapters: on ? (s.readChapters.includes(chKey) ? s.readChapters : [...s.readChapters, chKey]) : s.readChapters.filter((x) => x !== chKey) }))

  const go = (delta: number, markRead = false) => {
    if (markRead) setRead(true)
    const idx = BOOKS.findIndex((x) => x.id === b.id)
    let nb = b, nc = ch + delta
    if (nc < 1) { const p = BOOKS[idx - 1]; if (!p) return; nb = p; nc = p.chapters }
    else if (nc > b.chapters) { const n = BOOKS[idx + 1]; if (!n) return; nb = n; nc = 1 }
    navigate(`/biblia/${nb.id}/${nc}${planId ? `?plano=${planId}${planDay !== null ? `&dia=${planDay}` : ''}` : ''}`)
  }

  const selSorted = [...sel].sort((a, b2) => a - b2)
  const selText = verses ? selSorted.map((v) => verses[v - 1]).join(' ') : ''
  const selRef = sel.length ? `${ref}:${rangeLabel(sel)}` : ''
  const citation = `“${selText}” (${selRef}, ACF)`
  const marks = selSorted.map((v) => state.marks[key(v)])
  const allColor = (c: MarkColor) => marks.length > 0 && marks.every((m) => m?.color === c)
  const allFav = marks.length > 0 && marks.every((m) => m?.fav)

  const toggleVerse = (n: number) => {
    setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]))
    setNoteOpen(false); setMsg('')
  }
  const openNote = () => {
    const first = selSorted[0]
    setNote(state.marks[key(first)]?.note ?? '')
    setNoteOpen((o) => !o)
  }
  const saveNote = () => {
    const first = selSorted[0], last = selSorted[selSorted.length - 1]
    setMark(key(first), { note: note.trim() || undefined, to: note.trim() && last !== first ? last : undefined })
    setNoteOpen(false); setMsg('Anotação salva.')
  }
  const copy = async () => { try { await navigator.clipboard.writeText(citation); setMsg('Copiado.') } catch { setMsg('Não deu para copiar.') } }
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ text: citation }) } catch { /* cancelado */ } }
    else window.open(`https://wa.me/?text=${encodeURIComponent(citation)}`, '_blank', 'noopener')
  }
  const shareImage = async () => {
    try {
      const blob = await verseImage(selText, selRef)
      const file = new File([blob], 'versiculo.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: citation })
      else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `${selRef.replace(/[^\w]+/g, '-')}.png`
        a.click()
        setMsg('Imagem salva no aparelho.')
      }
    } catch { setMsg('Não deu para gerar a imagem.') }
  }

  const saveReflection = () => {
    const [a, c, d] = q.map((x) => x.trim())
    if (!a && !c && !d) return
    const text = [ref, a && `O texto diz: ${a}`, c && `Sobre Deus: ${c}`, d && `Para hoje: ${d}`].filter(Boolean).join('\n')
    update((s) => ({ ...s, journal: [{ id: crypto.randomUUID(), at: new Date().toISOString(), kind: 'reflexao', text }, ...s.journal] }))
    setRead(true)
    setSaved('Guardado no diário.')
  }
  const toPrayer = () => {
    const d = q[2].trim()
    update((s) => ({ ...s, prayers: [{ id: crypto.randomUUID(), text: d ? `${ref}: ${d}` : `Pedir a Deus que me ensine por meio de ${ref}.`, createdAt: new Date().toISOString(), prayedCount: 0 }, ...s.prayers] }))
    setSaved('Pedido de oração criado.')
  }

  const scale = state.fontScale
  const inRange = (n: number) => from > 0 && n >= from && n <= to && !(from === to && sel.length > 0)

  return (
    <main className="space-y-4 pb-28">
      <div className="flex items-center justify-between gap-2">
        <Link to={`/biblia/${b.id}`} className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← {b.name}</Link>
        <div className="flex gap-2" role="group" aria-label="Ferramentas de leitura">
          {supported && verses && <button className="btn-ghost !min-h-[44px] !px-4 text-sm" onClick={() => read(`${ref}. ${verses.join(' ')}`)}>{speaking ? 'Parar' : 'Ouvir'}</button>}
          <button className="btn-ghost !min-h-[44px] !px-4" disabled={scale === 0} onClick={() => update((s) => ({ ...s, fontScale: Math.max(0, s.fontScale - 1) as 0 | 1 | 2 }))} aria-label="Diminuir letra">A−</button>
          <button className="btn-ghost !min-h-[44px] !px-4" disabled={scale === 2} onClick={() => update((s) => ({ ...s, fontScale: Math.min(2, s.fontScale + 1) as 0 | 1 | 2 }))} aria-label="Aumentar letra">A+</button>
        </div>
      </div>

      {plan && <Link to={`/planos/${plan.id}`} className="block rounded-2xl bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">Plano: {plan.title} · voltar ao plano</Link>}

      <header>
        <h1 className="font-display text-3xl font-bold">{b.name} {ch}</h1>
        <button className="min-h-[44px] text-sm font-semibold text-accent underline" aria-expanded={about} onClick={() => setAbout((v) => !v)}>{about ? 'Esconder' : 'Sobre este livro'}</button>
      </header>
      {about && <p className="card pop leading-relaxed">{ABOUT[b.id]}</p>}

      {hint && verses && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-accent/10 px-4 py-3 text-sm">
          <span>Toque em um ou mais versículos para destacar, anotar, copiar ou enviar como imagem.</span>
          <button className="min-h-[44px] shrink-0 font-semibold text-accent underline" onClick={() => { setHint(false); try { localStorage.setItem('livre.hint.verso', '1') } catch { /* sem armazenamento */ } }}>Entendi</button>
        </div>
      )}

      {error && <p className="card text-muted">Não foi possível carregar este capítulo. Verifique a conexão e tente de novo.</p>}
      {!verses && !error && <p className="text-muted">Carregando…</p>}
      {verses && (
        <article className={`${SIZES[scale]} leading-[1.75]`}>
          {verses.map((t, i) => {
            const n = i + 1
            const m = state.marks[key(n)]
            const on = sel.includes(n)
            return (
              <span key={n} id={`v${n}`}>
                <button onClick={() => toggleVerse(n)} aria-pressed={on} className={`rounded px-0.5 text-left align-baseline ${m?.color ? hl[m.color] : ''} ${on ? 'underline decoration-accent decoration-2 underline-offset-4' : ''} ${inRange(n) && !m?.color ? 'bg-sun/15' : ''}`}>
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
        <section className="card space-y-4" aria-label="Depois de ler">
          <div>
            <h2 className="font-display text-xl font-bold">Depois de ler</h2>
            <p className="mt-1 text-sm text-muted">Três perguntas ajudam o texto a sair da página e chegar na sua vida. Responda só o que quiser.</p>
          </div>
          {[
            ['O que este texto diz?', 'Com suas palavras, o que acontece ou é ensinado.'],
            ['O que ele mostra sobre Deus?', 'Como Deus é, como ele age, o que ele ama.'],
            ['O que eu faço com isso hoje?', 'Uma atitude pequena e concreta.'],
          ].map(([label, ph], i) => (
            <div key={label}>
              <label className="label" htmlFor={`q${i}`}>{i + 1}. {label}</label>
              <textarea id={`q${i}`} className="field py-3" rows={2} placeholder={ph} value={q[i]} onChange={(e) => { const c = [...q]; c[i] = e.target.value; setQ(c); setSaved('') }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-primary !px-3 text-sm" onClick={saveReflection} disabled={!q.some((x) => x.trim())}>Guardar no diário</button>
            <button className="btn-ghost !px-3 text-sm" onClick={toPrayer}>Transformar em oração</button>
          </div>
          {saved && <p className="text-sm font-semibold text-accent" role="status">{saved} <Link to="/orar" className="underline">Abrir</Link></p>}
          <button className={isRead ? 'btn-ghost w-full' : 'btn-ghost w-full'} aria-pressed={isRead} onClick={() => setRead(!isRead)}>{isRead ? '✓ Capítulo lido (tocar para desfazer)' : 'Marcar capítulo como lido'}</button>
          {plan && planDay !== null && (
            <button className="btn-sun w-full" onClick={() => { setRead(true); togglePlanDay(plan.id, planDay); navigate(`/planos/${plan.id}`) }}>Concluir o dia {planDay + 1} do plano</button>
          )}
        </section>
      )}

      {verses && (
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-ghost" onClick={() => go(-1)}>← Anterior</button>
          <button className="btn-primary" onClick={() => go(1, true)}>Próximo →</button>
        </div>
      )}

      {sel.length > 0 && verses && (
        <div className="fixed inset-x-0 bottom-0 z-30 md:left-60" role="dialog" aria-label={`Ações para ${selRef}`}>
          <div className="mx-auto max-w-[520px] rounded-t-3xl border border-line bg-surface p-4 shadow-2xl md:max-w-[680px]">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-bold">{selRef}</p>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-line" onClick={() => setSel([])} aria-label="Fechar">×</button>
            </div>
            <div className="mb-3 flex items-center gap-3">
              {(['amarelo', 'azul', 'verde'] as MarkColor[]).map((c) => (
                <button key={c} aria-label={`Destacar de ${c}`} aria-pressed={allColor(c)} onClick={() => selSorted.forEach((v) => setMark(key(v), { color: allColor(c) ? undefined : c }))} className={`h-10 w-10 rounded-full ${dot[c]} ${allColor(c) ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : 'opacity-70'}`} />
              ))}
              <button className="btn-ghost !min-h-[44px] !px-4 text-sm" aria-pressed={allFav} onClick={() => selSorted.forEach((v) => setMark(key(v), { fav: !allFav }))}>{allFav ? '★ Favorito' : '☆ Favoritar'}</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button className="btn-ghost !min-h-[44px] !px-1 text-sm" onClick={openNote}>Anotar</button>
              <button className="btn-ghost !min-h-[44px] !px-1 text-sm" onClick={copy}>Copiar</button>
              <button className="btn-ghost !min-h-[44px] !px-1 text-sm" onClick={share}>Texto</button>
              <button className="btn-ghost !min-h-[44px] !px-1 text-sm" onClick={shareImage}>Imagem</button>
            </div>
            {noteOpen && (
              <div className="mt-3 space-y-2">
                <textarea className="field py-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Sua anotação em ${selRef}`} aria-label="Anotação do versículo" />
                <button className="btn-primary w-full" onClick={saveNote}>Salvar anotação</button>
              </div>
            )}
            {msg && <p className="mt-2 text-sm font-semibold text-accent" role="status">{msg}</p>}
          </div>
        </div>
      )}
    </main>
  )
}
