import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ABOUT } from '../lib/bookInfo'
import { loadBook, bookById } from '../lib/bible'
import { startAmbient } from '../lib/audio'
import { diffDays, dayKey } from '../lib/dates'
import { ARRIVE, BENEDICTION, FEELINGS, PRAYER_BY_NEED, STEPS_BY_MINUTES, STEP_LABEL, pickPassage, type Feeling } from '../lib/momento'
import { useSpeech } from '../lib/speech'
import { useStore } from '../lib/store'

const MINUTES = [2, 5, 10, 20]
const TIME_HINT: Record<number, string> = { 2: 'Palavra e oração', 5: 'Com silêncio e pedidos', 10: 'Com reflexão e resposta', 20: 'Capítulo inteiro' }

export default function Momento() {
  const { state, update, setMark } = useStore()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const today = dayKey()
  const doneToday = state.moments.some((m) => m.at.slice(0, 10) === today)

  const [feeling, setFeeling] = useState<Feeling | null>(null)
  const [minutes, setMinutes] = useState<number>(MINUTES.includes(Number(sp.get('m'))) ? Number(sp.get('m')) : 10)
  const [started, setStarted] = useState(false)
  const [i, setI] = useState(0)
  const [verses, setVerses] = useState<string[] | null>(null)
  const [q, setQ] = useState(['', '', ''])
  const [pr, setPr] = useState({ grat: '', entrega: '', pedido: '' })
  const [resp, setResp] = useState('')
  const [ambient, setAmbient] = useState(false)
  const [saved, setSaved] = useState(false)
  const stopAmb = useRef<(() => void) | null>(null)
  const { supported, speaking, read } = useSpeech()

  const picked = useMemo(
    () => (feeling && started ? pickPassage(feeling, state.moments, diffDays('2024-01-01', today)) : null),
    [feeling, started], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const passage = picked?.passage
  const need = picked?.need ?? ''
  const book = passage ? bookById(passage.book) : undefined
  const steps = STEPS_BY_MINUTES[minutes]
  const step = steps[i]

  useEffect(() => {
    if (!passage) return
    setVerses(null)
    loadBook(passage.book).then((c) => setVerses(c[passage.chapter - 1] ?? [])).catch(() => setVerses([]))
  }, [passage?.ref]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopAmb.current?.(), [])

  const full = minutes === 20
  const from = full ? 1 : passage?.from ?? 1
  const to = full ? verses?.length ?? 1 : passage?.to ?? from
  const shown = useMemo(() => (verses ? verses.map((t, k) => ({ n: k + 1, t })).filter((v) => v.n >= from && v.n <= to) : []), [verses, from, to])
  const key = (n: number) => `${passage!.book}.${passage!.chapter}.${n}`
  const refLabel = passage ? (full ? `${book?.name} ${passage.chapter}` : passage.ref) : ''
  const openPrayers = state.prayers.filter((p) => !p.answeredAt).slice(0, 3)
  const highlighted = passage ? shown.filter((v) => state.marks[key(v.n)]?.color).map((v) => v.n) : []

  const toggleAmbient = () => {
    if (ambient) { stopAmb.current?.(); stopAmb.current = null; setAmbient(false) }
    else { stopAmb.current = startAmbient(); setAmbient(!!stopAmb.current) }
  }

  const finish = () => {
    if (!passage || !feeling) return
    const lines = [
      `Momento com Deus: ${refLabel}`,
      `Cheguei: ${feeling.label}`,
      highlighted.length ? `Destaquei: versículo${highlighted.length > 1 ? 's' : ''} ${highlighted.join(', ')}` : '',
      q[0].trim() && `O que chamou minha atenção: ${q[0].trim()}`,
      q[1].trim() && `Sobre Deus: ${q[1].trim()}`,
      q[2].trim() && `Sobre a minha situação hoje: ${q[2].trim()}`,
      pr.grat.trim() && `Agradeço: ${pr.grat.trim()}`,
      pr.entrega.trim() && `Entrego: ${pr.entrega.trim()}`,
      pr.pedido.trim() && `Peço: ${pr.pedido.trim()}`,
      resp.trim() && `Hoje eu vou: ${resp.trim()}`,
    ].filter(Boolean) as string[]
    const now = new Date().toISOString()
    update((s) => {
      const chKey = `${passage.book}.${passage.chapter}`
      const checkins = s.checkins.filter((c) => c.date !== today)
      return {
        ...s,
        journal: [{ id: crypto.randomUUID(), at: now, kind: 'reflexao', text: lines.join('\n') }, ...s.journal],
        prayers: pr.pedido.trim() ? [{ id: crypto.randomUUID(), text: pr.pedido.trim(), createdAt: now, prayedCount: 1 }, ...s.prayers] : s.prayers,
        readDays: s.readDays.includes(today) ? s.readDays : [...s.readDays, today],
        readChapters: full && !s.readChapters.includes(chKey) ? [...s.readChapters, chKey] : s.readChapters,
        lastRead: { book: passage.book, chapter: passage.chapter },
        checkins: [...checkins, { date: today, at: now, mood: feeling.mood, triggers: feeling.trigger ? [feeling.trigger] : [], note: '' }],
        moments: [...s.moments, { id: crypto.randomUUID(), at: now, feeling: feeling.id, minutes, ref: passage.ref, need, kind: 'manha' }],
      }
    })
    stopAmb.current?.(); stopAmb.current = null; setAmbient(false)
    setSaved(true)
  }

  /* ---------- Tela inicial: como você chega? ---------- */
  if (!started) {
    return (
      <main className="space-y-8">
        <Link to="/" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Início</Link>
        <header>
          <h1 className="font-display text-4xl font-semibold leading-tight">Como você chega hoje?</h1>
          <p className="mt-3 text-lg text-muted">Não existe resposta errada. Conte como você está e a gente escolhe a passagem para este momento.</p>
          {doneToday && <p className="mt-3 text-sm font-semibold text-sun">Você já esteve com Deus hoje. Pode fazer outro momento quando quiser.</p>}
        </header>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Como você está">
          {FEELINGS.map((f) => <button key={f.id} aria-pressed={feeling?.id === f.id} onClick={() => setFeeling(f)} className="chip">{f.label}</button>)}
        </div>
        <section>
          <h2 className="font-display text-xl font-semibold">Quanto tempo você tem?</h2>
          <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Tempo disponível">
            {MINUTES.map((m) => (
              <button key={m} aria-pressed={minutes === m} onClick={() => setMinutes(m)} className="chip !min-h-[64px] flex-col justify-center !px-1 text-center">
                <span className="font-display text-xl font-semibold leading-none">{m}</span><span className="text-xs">min</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{TIME_HINT[minutes]}</p>
        </section>
        <button className="btn-primary w-full" disabled={!feeling} onClick={() => setStarted(true)}>Começar</button>
      </main>
    )
  }

  /* ---------- Final ---------- */
  if (saved) {
    return (
      <main className="space-y-6 py-8 text-center">
        <h1 className="font-display text-4xl font-semibold">Momento guardado.</h1>
        <p className="mx-auto max-w-sm text-lg text-muted">Você esteve diante de Deus hoje. Leve essa palavra com você, e volte quando precisar.</p>
        <blockquote className="mx-auto max-w-md rounded-3xl border border-line bg-surface p-6 text-left">
          <p className="font-display text-xl leading-snug">“{BENEDICTION.text}”</p>
          <p className="mt-2 text-sm font-semibold text-muted">{BENEDICTION.ref} · ACF</p>
        </blockquote>
        <div className="mx-auto grid max-w-sm gap-3">
          <Link to="/orar?aba=diario" className="btn-ghost">Ver no diário</Link>
          <Link to="/" className="btn-primary">Voltar ao início</Link>
        </div>
      </main>
    )
  }

  const next = () => setI((k) => Math.min(steps.length - 1, k + 1))
  const back = () => setI((k) => Math.max(0, k - 1))

  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <button className="flex min-h-[48px] items-center text-sm font-semibold text-muted" onClick={() => { if (confirm('Sair deste momento? O que você escreveu não será guardado.')) navigate('/') }}>← Sair</button>
        <span className="text-sm font-semibold text-muted">{STEP_LABEL[step]} · {i + 1} de {steps.length}</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{steps.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={step} className="fade-up space-y-6">
        {step === 'chegar' && (
          <section className="space-y-6 py-6 text-center">
            <p className="font-display text-3xl font-semibold leading-snug">{ARRIVE[feeling!.id]}</p>
            <p className="mx-auto max-w-sm text-lg text-muted">Antes de ler, pare um instante. Respire fundo e diga em silêncio: “Senhor, estou aqui.”</p>
            <div className="mx-auto flex h-28 w-28 items-center justify-center" aria-hidden>
              <div className="h-20 w-20 rounded-full border border-muted/50 bg-surface" style={{ animation: 'pulse-glow 6s ease-in-out infinite' }} />
            </div>
            <button className="btn-ghost mx-auto" aria-pressed={ambient} onClick={toggleAmbient}>{ambient ? 'Som ambiente ligado' : 'Ligar som ambiente'}</button>
          </section>
        )}

        {step === 'palavra' && passage && (
          <section className="space-y-5">
            <header>
              <p className="text-sm font-semibold uppercase tracking-wide text-sun">A Palavra para hoje</p>
              <h1 className="mt-1 font-display text-3xl font-semibold">{refLabel}</h1>
              <p className="mt-2 text-muted">{passage.why}</p>
              {book && <p className="mt-2 text-sm text-muted"><strong className="text-ink">{book.name}:</strong> {ABOUT[book.id]}</p>}
            </header>
            <article className="rounded-3xl border border-line bg-surface p-5 font-display text-[22px] leading-[1.7]">
              {!verses && <p className="text-base text-muted">Carregando…</p>}
              {shown.map((v) => {
                const on = !!state.marks[key(v.n)]?.color
                return (
                  <span key={v.n}>
                    <button aria-pressed={on} onClick={() => setMark(key(v.n), { color: on ? undefined : 'amarelo' })} className={`rounded px-0.5 text-left align-baseline ${on ? 'bg-sun/25' : ''}`}>
                      <sup className="mr-1 font-sans text-[0.5em] font-bold text-sun">{v.n}</sup>{v.t}
                    </button>{' '}
                  </span>
                )
              })}
            </article>
            <p className="text-sm text-muted">Toque no versículo que mais falou com você para destacá-lo.</p>
            {supported && verses && <button className="btn-ghost" onClick={() => read(`${refLabel}. ${shown.map((v) => v.t).join(' ')}`)}>{speaking ? 'Parar áudio' : 'Ouvir a passagem'}</button>}
          </section>
        )}

        {step === 'refletir' && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Deixe a Palavra falar.</h1>
            <p className="text-muted">Responda só o que quiser. Não existe resposta certa; escreva com as suas palavras.</p>
            <details className="rounded-2xl border border-line bg-surface p-4">
              <summary className="cursor-pointer font-semibold">Reler {refLabel}</summary>
              <p className="mt-3 font-display text-lg leading-relaxed">{shown.map((v) => v.t).join(' ')}</p>
            </details>
            {[
              ['O que chamou a sua atenção?', 'Uma palavra, uma imagem, uma promessa.'],
              ['O que isso mostra sobre Deus?', 'Como ele é e como ele trata você.'],
              ['O que isso diz sobre a sua situação hoje?', 'Onde essa Palavra encontra a sua vida agora.'],
            ].map(([label, ph], k) => (
              <div key={label}>
                <label className="label" htmlFor={`r${k}`}>{label}</label>
                <textarea id={`r${k}`} className="field py-3" rows={3} placeholder={ph} value={q[k]} onChange={(e) => { const c = [...q]; c[k] = e.target.value; setQ(c) }} />
              </div>
            ))}
          </section>
        )}

        {step === 'orar' && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Fale com Deus.</h1>
            <p className="text-muted">Como quem fala com alguém que te ama. Pode escrever abaixo ou só pensar.</p>
            <div className="rounded-3xl border border-line bg-surface p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-sun">Se faltarem palavras, ore assim</p>
              <p className="mt-2 font-display text-xl italic leading-relaxed">{PRAYER_BY_NEED[need] ?? PRAYER_BY_NEED.gratidao}</p>
            </div>
            {minutes >= 5 && (
              <>
                {[
                  ['grat', 'Agradeça', 'Uma coisa pela qual você é grato(a) hoje.'],
                  ['entrega', 'Entregue', 'O que está pesando e você quer deixar nas mãos de Deus.'],
                  ['pedido', 'Peça', 'O que você quer pedir. Ele será guardado como pedido de oração.'],
                ].map(([k, label, ph]) => (
                  <div key={k}>
                    <label className="label" htmlFor={`p${k}`}>{label}</label>
                    <textarea id={`p${k}`} className="field py-3" rows={2} placeholder={ph} value={pr[k as 'grat']} onChange={(e) => setPr({ ...pr, [k]: e.target.value })} />
                  </div>
                ))}
                {openPrayers.length > 0 && (
                  <div>
                    <p className="label">Pedidos que você ainda está orando</p>
                    <ul className="space-y-2">
                      {openPrayers.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3">
                          <span className="text-[15px]">{p.text}</span>
                          <button className="btn-ghost !min-h-[44px] shrink-0 !px-4 text-sm" onClick={() => update((s) => ({ ...s, prayers: s.prayers.map((x) => (x.id === p.id ? { ...x, prayedCount: x.prayedCount + 1 } : x)) }))}>Orei</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {step === 'responder' && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">E agora?</h1>
            <p className="text-muted">A Palavra pede resposta. Escolha uma atitude pequena e possível para hoje.</p>
            <div>
              <label className="label" htmlFor="resp">Hoje eu vou…</label>
              <textarea id="resp" className="field py-3" rows={3} placeholder="Ex.: orar antes de dormir; mandar uma mensagem a alguém; sair do quarto quando a vontade vier." value={resp} onChange={(e) => setResp(e.target.value)} />
            </div>
          </section>
        )}

        {step === 'fechar' && passage && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Receba a bênção.</h1>
            <blockquote className="rounded-3xl border border-line bg-surface p-6">
              <p className="font-display text-2xl leading-snug">“{BENEDICTION.text}”</p>
              <p className="mt-2 text-sm font-semibold text-muted">{BENEDICTION.ref} · ACF</p>
            </blockquote>
            <div className="rounded-2xl bg-surface p-4 text-sm text-muted">
              <p><strong className="text-ink">Passagem:</strong> {refLabel}</p>
              {highlighted.length > 0 && <p><strong className="text-ink">Destacado:</strong> versículo{highlighted.length > 1 ? 's' : ''} {highlighted.join(', ')}</p>}
              {resp.trim() && <p><strong className="text-ink">Hoje eu vou:</strong> {resp.trim()}</p>}
              <p className="mt-2">Ao concluir, tudo é guardado no seu diário.</p>
            </div>
          </section>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {step === 'fechar' ? (
          <button className="btn-primary w-full" onClick={finish}>Amém. Guardar este momento</button>
        ) : (
          <button className="btn-primary w-full" onClick={next} disabled={step === 'palavra' && !verses}>{step === 'chegar' ? 'Estou pronto(a)' : 'Continuar'}</button>
        )}
        {i > 0 && <button className="btn-ghost w-full" onClick={back}>Voltar</button>}
      </div>
    </main>
  )
}
