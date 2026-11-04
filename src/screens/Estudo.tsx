import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ABOUT } from '../lib/bookInfo'
import { bookById, loadBook } from '../lib/bible'
import { DRAFT_LABEL, STARTERS, STEPS, fitPick, newStudy, parsePick, rangeText, studyToText, type Pick } from '../lib/estudo'
import { useSpeech } from '../lib/speech'
import { useStore } from '../lib/store'
import type { Study } from '../lib/types'

const date = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })

/** Carrega os versículos de um trecho. */
function useVerses(book: string, chapter: number, from: number, to: number) {
  const [all, setAll] = useState<string[] | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let live = true
    setAll(null); setError(false)
    loadBook(book).then((c) => live && setAll(c[chapter - 1] ?? [])).catch(() => live && setError(true))
    return () => { live = false }
  }, [book, chapter])
  const verses = useMemo(() => (all ? all.slice(from - 1, to) : null), [all, from, to])
  return { all, verses, error }
}

function Passage({ verses, from, keyV, onKey, size = 'text-[19px]' }: { verses: string[]; from: number; keyV?: number; onKey?: (n: number) => void; size?: string }) {
  return (
    <p className={`${size} leading-[1.75]`}>
      {verses.map((t, i) => {
        const n = from + i
        const on = keyV === n
        const cls = `rounded px-0.5 text-left align-baseline ${on ? 'bg-sun/25' : ''}`
        const inner = <><sup className="mr-1 text-[0.6em] font-bold text-accent">{n}</sup>{t}</>
        return onKey
          ? <span key={n}><button onClick={() => onKey(n)} aria-pressed={on} className={cls}>{inner}</button>{' '}</span>
          : <span key={n} className={cls}>{inner}{' '}</span>
      })}
    </p>
  )
}

/* ---------------------------------------------------------------- Início */

export function EstudoHome() {
  const { state, update } = useStore()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const [q, setQ] = useState(sp.get('passagem') ?? '')
  const [err, setErr] = useState('')
  const [pick, setPick] = useState<Pick | null>(null)
  const [count, setCount] = useState(0)
  const { verses } = useVerses(pick?.book ?? 'sl', pick?.chapter ?? 1, pick?.from ?? 1, pick?.to ?? 1)

  const choose = async (input: string) => {
    setErr('')
    const p = parsePick(input)
    if (!p) { setPick(null); return setErr('Não encontrei essa passagem. Exemplos: Salmos 23, João 3:16-21, Romanos 8.') }
    try {
      const n = (await loadBook(p.book))[p.chapter - 1]?.length ?? 0
      if (!n) return setErr('Não encontrei essa passagem.')
      setCount(n)
      setPick(fitPick(p, n))
    } catch { setErr('Não foi possível carregar a Bíblia agora. Verifique a conexão.') }
  }

  useEffect(() => { if (sp.get('passagem')) void choose(sp.get('passagem')!) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const drafts = state.studies.filter((s) => !s.doneAt).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const done = state.studies.filter((s) => s.doneAt).sort((a, b) => b.doneAt!.localeCompare(a.doneAt!))
  const last = state.lastRead

  const start = () => {
    if (!pick) return
    const s = newStudy(pick)
    update((st) => ({ ...st, studies: [s, ...st.studies] }))
    navigate(`/estudo/${s.id}`)
  }
  const nums = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <main className="space-y-8">
      <header>
        <h1 className="font-display text-4xl font-semibold">Estudo da Palavra</h1>
        <p className="mt-2 max-w-md text-muted">Escolha um trecho e responda poucas perguntas, uma por vez: observar, interpretar, aplicar e orar. Leva de 10 a 15 minutos e fica guardado.</p>
      </header>

      {drafts[0] && (
        <Link to={`/estudo/${drafts[0].id}`} className="card block bg-sand text-sand-ink active:scale-[0.99]">
          <span className="block text-sm font-semibold opacity-70">Continuar de onde parou</span>
          <span className="block font-display text-2xl font-semibold">{rangeText(drafts[0])}</span>
          <span className="block text-sm opacity-80">{DRAFT_LABEL(drafts[0])} · {STEPS[drafts[0].step]}</span>
        </Link>
      )}

      <section className="space-y-4" aria-label="Novo estudo">
        <h2 className="font-display text-2xl font-semibold">Novo estudo</h2>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void choose(q) }}>
          <input className="field" value={q} onChange={(e) => { setQ(e.target.value); setErr('') }} placeholder="Qual passagem? Ex.: Salmos 23" aria-label="Passagem" />
          <button className="btn-primary shrink-0 !px-5">Ver</button>
        </form>
        {err && <p className="text-sm text-sun" role="alert">{err}</p>}
        <div className="flex flex-wrap gap-2">
          {last && bookById(last.book) && <button className="chip !min-h-[44px] text-sm" onClick={() => { const r = `${bookById(last.book)!.name} ${last.chapter}`; setQ(r); void choose(r) }}>Onde parei: {bookById(last.book)!.name} {last.chapter}</button>}
          {STARTERS.map((s) => <button key={s.ref} className="chip !min-h-[44px] text-sm" onClick={() => { setQ(s.ref); void choose(s.ref) }}>{s.label}</button>)}
        </div>

        {pick && (
          <div className="card pop space-y-4">
            <div>
              <p className="font-display text-2xl font-semibold">{rangeText(pick, count)}</p>
              {pick.widened && <p className="mt-1 text-sm text-muted">Incluí os versículos ao redor para dar contexto. O versículo {pick.key} fica como versículo-chave.</p>}
              {!pick.widened && pick.from === 1 && pick.to < count && <p className="mt-1 text-sm text-muted">O capítulo é longo; começamos pelo início. Ajuste se quiser.</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="label">Do versículo</span>
                <select className="field" value={pick.from} onChange={(e) => { const f = Number(e.target.value); setPick({ ...pick, from: f, to: Math.max(f, pick.to), widened: false }) }}>{nums.map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
              <label className="block"><span className="label">Até o versículo</span>
                <select className="field" value={pick.to} onChange={(e) => setPick({ ...pick, to: Number(e.target.value), widened: false })}>{nums.filter((n) => n >= pick.from).map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
            </div>
            {pick.to - pick.from + 1 > 30 && <p className="text-sm text-muted">Trechos curtos rendem mais. Considere menos de 30 versículos.</p>}
            {verses && <div className="max-h-64 overflow-y-auto rounded-2xl bg-bg p-4"><Passage verses={verses} from={pick.from} size="text-[16px]" /></div>}
            <button className="btn-primary w-full" onClick={start}>Começar o estudo</button>
          </div>
        )}
      </section>

      {done.length > 0 && (
        <section aria-label="Seus estudos" className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Seus estudos</h2>
          {done.map((s) => (
            <Link key={s.id} to={`/estudo/${s.id}`} className="card block !p-4 active:scale-[0.99]">
              <span className="block text-sm font-semibold text-muted">{date(s.doneAt!)}</span>
              <span className="block font-display text-xl font-semibold">{rangeText(s)}</span>
              {s.action.trim() && <span className="mt-1 block line-clamp-2 text-[15px] text-muted">Passo: {s.action}</span>}
            </Link>
          ))}
        </section>
      )}
      {drafts.length > 1 && (
        <section aria-label="Em andamento" className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Em andamento</h2>
          {drafts.slice(1).map((s) => (
            <Link key={s.id} to={`/estudo/${s.id}`} className="card flex items-center justify-between !p-4"><span>{rangeText(s)}</span><span className="text-sm text-muted">{DRAFT_LABEL(s)}</span></Link>
          ))}
        </section>
      )}
    </main>
  )
}

/* ------------------------------------------------------------------ Passos */

const GUIDE: Record<number, { title: string; intro: string; help: string; fields: { k: keyof Study; label: string; ph: string }[] }> = {
  1: { title: 'Observar', intro: 'O que o texto diz? Ainda não é hora de interpretar: só olhe com atenção.', help: 'Quem fala? Para quem? O que acontece? Que palavra se repete? Há ordens, promessas, avisos?', fields: [
    { k: 'observe', label: 'O que o texto diz, com suas palavras?', ph: 'Resuma o que acontece ou é ensinado.' },
    { k: 'notice', label: 'O que se repete ou chamou sua atenção?', ph: 'Uma palavra, uma ideia, algo que você não entendeu.' } ] },
  2: { title: 'Interpretar', intro: 'O que isso significa? Procure o que o texto ensina, não o que gostaríamos que ele dissesse.', help: 'Pense em quem escreveu e para quem. O que isso revela do caráter de Deus? Como Jesus aparece aqui?', fields: [
    { k: 'god', label: 'O que o texto mostra sobre Deus?', ph: 'Como ele é, o que faz, o que ama.' },
    { k: 'person', label: 'O que mostra sobre nós, pessoas?', ph: 'Nossas necessidades, falhas e esperança.' } ] },
  3: { title: 'Aplicar', intro: 'Agora a vida. Escolha pouco e seja concreto.', help: 'Há algo para crer, agradecer, confessar, deixar ou obedecer? O que dá para fazer hoje, em poucos minutos?', fields: [
    { k: 'change', label: 'O que preciso crer, agradecer ou mudar?', ph: 'Seja sincero. Deus já sabe.' },
    { k: 'action', label: 'Meu passo para hoje', ph: 'Ex.: pedir perdão a alguém; ler este trecho de novo à noite.' } ] },
  4: { title: 'Orar', intro: 'Responda a Deus com o que você leu.', help: 'Agradeça pelo que viu dele, peça ajuda para o seu passo e entregue o que pesa.', fields: [
    { k: 'prayer', label: 'Minha oração', ph: 'Senhor, …' } ] },
}

export function EstudoFlow() {
  const { id } = useParams()
  const { state, update } = useStore()
  const navigate = useNavigate()
  const study = state.studies.find((s) => s.id === id)
  const [editing, setEditing] = useState(false)
  const { verses, error } = useVerses(study?.book ?? 'sl', study?.chapter ?? 1, study?.from ?? 1, study?.to ?? 1)
  const { supported, speaking, read } = useSpeech()
  const [msg, setMsg] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)

  if (!study || !bookById(study.book)) return <Navigate to="/estudo" replace />
  const patch = (p: Partial<Study>) => update((s) => ({ ...s, studies: s.studies.map((x) => (x.id === study.id ? { ...x, ...p, updatedAt: new Date().toISOString() } : x)) }))
  const ref = rangeText(study)
  const finished = !!study.doneAt && !editing
  const go = (n: number) => { patch({ step: n }); window.scrollTo(0, 0) }

  const text = verses ? studyToText(study, verses) : ''
  const copy = async () => { try { await navigator.clipboard.writeText(text); setMsg('Copiado.') } catch { setMsg('Não deu para copiar.') } }
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ text }) } catch { /* cancelado */ } }
    else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }
  const toPrayer = () => {
    update((s) => ({ ...s, prayers: [{ id: crypto.randomUUID(), text: `${ref}: ${study.prayer.trim()}`, createdAt: new Date().toISOString(), prayedCount: 0 }, ...s.prayers] }))
    setMsg('Pedido criado em Oração.')
  }
  const del = () => { update((s) => ({ ...s, studies: s.studies.filter((x) => x.id !== study.id) })); navigate('/estudo', { replace: true }) }

  const keyText = study.key && verses ? verses[study.key - study.from] : ''

  /* ----- Resumo ----- */
  if (finished) {
    const blocks: [string, [string, string][]][] = [
      ['Observar', [['O que o texto diz', study.observe], ['O que chamou atenção', study.notice]]],
      ['Interpretar', [['Sobre Deus', study.god], ['Sobre nós', study.person]]],
      ['Aplicar', [['O que preciso crer, agradecer ou mudar', study.change]]],
      ['Orar', [['Minha oração', study.prayer]]],
    ]
    return (
      <main className="space-y-6">
        <Link to="/estudo" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Estudos</Link>
        <header>
          <p className="text-sm font-semibold text-muted">{new Date(study.doneAt!).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="font-display text-4xl font-semibold">{ref}</h1>
        </header>
        {keyText && <blockquote className="font-display text-2xl leading-snug">“{keyText}” <span className="block text-base font-semibold text-muted">Versículo {study.key}</span></blockquote>}
        {study.action.trim() && <section className="rounded-3xl bg-sand p-5 text-sand-ink"><p className="text-sm font-semibold opacity-70">Meu passo para hoje</p><p className="mt-1 font-display text-2xl">{study.action}</p></section>}
        {blocks.map(([t, items]) => items.some(([, v]) => v.trim()) && (
          <section key={t} className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">{t}</h2>
            {items.filter(([, v]) => v.trim()).map(([l, v]) => <div key={l}><p className="text-sm font-semibold text-muted">{l}</p><p className="whitespace-pre-line leading-relaxed">{v}</p></div>)}
          </section>
        ))}
        {verses && <details className="card"><summary className="cursor-pointer font-semibold">Reler o texto</summary><div className="mt-3"><Passage verses={verses} from={study.from} keyV={study.key} size="text-[17px]" /></div></details>}
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-primary" onClick={copy}>Copiar</button>
          <button className="btn-ghost" onClick={share}>Compartilhar</button>
          {study.prayer.trim() && <button className="btn-ghost col-span-2" onClick={toPrayer}>Guardar como pedido de oração</button>}
          <button className="btn-ghost" onClick={() => { setEditing(true); go(0) }}>Editar</button>
          <Link to="/estudo" className="btn-ghost">Novo estudo</Link>
        </div>
        {msg && <p className="text-sm font-semibold text-accent" role="status">{msg}</p>}
        <button className="min-h-[48px] w-full text-sm font-semibold text-muted underline" onClick={() => (confirmDel ? del() : setConfirmDel(true))}>{confirmDel ? 'Toque de novo para apagar este estudo' : 'Apagar estudo'}</button>
      </main>
    )
  }

  /* ----- Passos ----- */
  const step = Math.min(study.step, STEPS.length - 1)
  const g = GUIDE[step]
  const last = step === STEPS.length - 1
  const about = ABOUT[study.book]

  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/estudo" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Salvo automaticamente</Link>
        <p className="font-display text-lg font-semibold">{ref}</p>
      </div>

      <ol className="flex gap-1" aria-label="Passos do estudo">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <button onClick={() => go(i)} aria-current={i === step ? 'step' : undefined} className="block min-h-[44px] w-full text-center">
              <span className={`mb-1 block h-1.5 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`} />
              <span className={`text-xs font-semibold ${i === step ? 'text-ink' : 'text-muted'}`}>{s}</span>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <section className="space-y-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Leia com calma</h1>
            <p className="mt-1 text-muted">Leia duas vezes, devagar. Se um versículo tocar você, toque nele para marcá-lo como versículo-chave.</p>
          </div>
          {error && <p className="card text-muted">Não foi possível carregar o texto. Verifique a conexão.</p>}
          {!verses && !error && <p className="text-muted">Carregando…</p>}
          {verses && <article className="card"><Passage verses={verses} from={study.from} keyV={study.key} onKey={(n) => patch({ key: study.key === n ? undefined : n })} size={['text-[17px]', 'text-[19px]', 'text-[22px]'][state.fontScale]} /></article>}
          {supported && verses && <button className="btn-ghost w-full" onClick={() => read(`${ref}. ${verses.join(' ')}`)}>{speaking ? 'Parar' : 'Ouvir o texto'}</button>}
          {about && <details className="card"><summary className="cursor-pointer font-semibold">Sobre {bookById(study.book)!.name}</summary><p className="mt-2 leading-relaxed text-muted">{about}</p></details>}
        </section>
      ) : (
        <section className="space-y-5">
          <div>
            <h1 className="font-display text-3xl font-semibold">{g.title}</h1>
            <p className="mt-1 text-muted">{g.intro}</p>
          </div>
          {verses && <details className="card !p-4"><summary className="cursor-pointer font-semibold">Reler {ref}</summary><div className="mt-3"><Passage verses={verses} from={study.from} keyV={study.key} size="text-[17px]" /></div></details>}
          <p className="rounded-2xl bg-accent/10 px-4 py-3 text-sm">{g.help}</p>
          {g.fields.map((f) => (
            <div key={f.k}>
              <label className="label" htmlFor={f.k}>{f.label}</label>
              <textarea id={f.k} className="field py-3" rows={f.k === 'prayer' ? 7 : 4} placeholder={f.ph} value={String(study[f.k] ?? '')} onChange={(e) => patch({ [f.k]: e.target.value } as Partial<Study>)} />
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost" disabled={step === 0} onClick={() => go(step - 1)}>← Voltar</button>
        {last
          ? <button className="btn-primary" onClick={() => { patch({ doneAt: new Date().toISOString(), step: 0 }); setEditing(false); window.scrollTo(0, 0) }}>Concluir estudo</button>
          : <button className="btn-primary" onClick={() => go(step + 1)}>Continuar →</button>}
      </div>
      {last && <p className="text-center text-sm text-muted">Pode concluir mesmo com campos em branco. O que importa é ter estado com Deus.</p>}
    </main>
  )
}
