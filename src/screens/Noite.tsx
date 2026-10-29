import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadBook, bookById } from '../lib/bible'
import { startAmbient } from '../lib/audio'
import { dayKey, diffDays } from '../lib/dates'
import { NIGHT_BENEDICTION, NIGHT_PASSAGES } from '../lib/momento'
import { useSpeech } from '../lib/speech'
import { useStore } from '../lib/store'

const STEPS = ['Silêncio', 'Olhar o dia', 'Entregar', 'A Palavra', 'Descansar']

/** Fim do dia: perceber o que foi bom e o que pesou, entregar, ler um Salmo e descansar. */
export default function Noite() {
  const { state, update } = useStore()
  const today = dayKey()
  const passage = useMemo(() => {
    const recent = state.moments.filter((m) => m.kind === 'noite').slice(-4).map((m) => m.ref)
    const base = diffDays('2024-01-01', today)
    for (let k = 0; k < NIGHT_PASSAGES.length; k++) {
      const c = NIGHT_PASSAGES[(base + k) % NIGHT_PASSAGES.length]
      if (!recent.includes(c.ref)) return c
    }
    return NIGHT_PASSAGES[base % NIGHT_PASSAGES.length]
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [good, setGood] = useState('')
  const [heavy, setHeavy] = useState('')
  const [forgive, setForgive] = useState('')
  const [hand, setHand] = useState('')
  const [verses, setVerses] = useState<string[] | null>(null)
  const [ambient, setAmbient] = useState(false)
  const [done, setDone] = useState(false)
  const stop = useRef<(() => void) | null>(null)
  const { supported, speaking, read } = useSpeech()
  const book = bookById(passage.book)
  const openPrayers = state.prayers.filter((p) => !p.answeredAt).slice(0, 3)

  useEffect(() => {
    loadBook(passage.book).then((c) => setVerses((c[passage.chapter - 1] ?? []).slice((passage.from ?? 1) - 1, passage.to ?? undefined))).catch(() => setVerses([]))
    return () => stop.current?.()
  }, [passage])

  const toggleAmbient = () => {
    if (ambient) { stop.current?.(); stop.current = null; setAmbient(false) }
    else { stop.current = startAmbient(); setAmbient(!!stop.current) }
  }

  const finish = () => {
    const lines = [
      'Noite: entregando o dia',
      good.trim() && `O que foi bom: ${good.trim()}`,
      heavy.trim() && `O que pesou: ${heavy.trim()}`,
      forgive.trim() && `Perdão a pedir ou dar: ${forgive.trim()}`,
      hand.trim() && `Entreguei a Deus: ${hand.trim()}`,
      `Palavra da noite: ${passage.ref}`,
    ].filter(Boolean) as string[]
    const now = new Date().toISOString()
    update((s) => ({
      ...s,
      journal: [{ id: crypto.randomUUID(), at: now, kind: 'gratidao', text: lines.join('\n') }, ...s.journal],
      moments: [...s.moments, { id: crypto.randomUUID(), at: now, feeling: 'noite', minutes: 5, ref: passage.ref, need: 'noite', kind: 'noite' }],
    }))
    stop.current?.(); stop.current = null; setAmbient(false)
    setDone(true)
  }

  if (done) {
    return (
      <main className="-mx-5 min-h-[80vh] space-y-6 bg-night px-5 py-12 text-center text-night-ink md:mx-0 md:rounded-3xl">
        <h1 className="font-display text-4xl font-semibold">Boa noite.</h1>
        <blockquote className="mx-auto max-w-md">
          <p className="font-display text-2xl leading-snug">“{NIGHT_BENEDICTION.text}”</p>
          <p className="mt-2 text-sm opacity-70">{NIGHT_BENEDICTION.ref} · ACF</p>
        </blockquote>
        <div className="mx-auto grid max-w-sm gap-3">
          <Link to="/descanso/dormir" className="flex min-h-[48px] items-center justify-center rounded-full border border-current px-6 font-semibold">Ouvir o áudio para dormir</Link>
          <Link to="/" className="flex min-h-[48px] items-center justify-center rounded-full bg-night-ink px-6 font-semibold text-night">Voltar ao início</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Início</Link>
        <span className="text-sm font-semibold text-muted">{STEPS[i]} · {i + 1} de 5</span>
      </div>
      <div className="flex gap-1.5" aria-hidden>{STEPS.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-accent' : 'bg-line'}`} />)}</div>

      <div key={i} className="fade-up space-y-6">
        {i === 0 && (
          <section className="space-y-6 py-6 text-center">
            <h1 className="font-display text-4xl font-semibold leading-snug">O dia terminou.</h1>
            <p className="mx-auto max-w-sm text-lg text-muted">Você não precisa resolver mais nada agora. Vamos olhar o dia com calma e deixá-lo nas mãos de Deus.</p>
            <button className="btn-ghost mx-auto" aria-pressed={ambient} onClick={toggleAmbient}>{ambient ? 'Som ambiente ligado' : 'Ligar som ambiente'}</button>
          </section>
        )}
        {i === 1 && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Olhe o seu dia.</h1>
            <div><label className="label" htmlFor="good">O que foi bom hoje?</label><textarea id="good" className="field py-3" rows={3} placeholder="Pode ser pequeno: uma conversa, uma refeição, um minuto de calma." value={good} onChange={(e) => setGood(e.target.value)} /></div>
            <div><label className="label" htmlFor="heavy">O que pesou ou não saiu como você queria?</label><textarea id="heavy" className="field py-3" rows={3} placeholder="Escreva sem se defender nem se culpar." value={heavy} onChange={(e) => setHeavy(e.target.value)} /></div>
          </section>
        )}
        {i === 2 && (
          <section className="space-y-5">
            <h1 className="font-display text-3xl font-semibold">Entregue o que ficou.</h1>
            <p className="text-muted">Perdão e entrega fazem parte de fechar o dia em paz.</p>
            <div><label className="label" htmlFor="forgive">Há alguém a quem pedir perdão, ou que você precise perdoar?</label><textarea id="forgive" className="field py-3" rows={2} placeholder="Opcional." value={forgive} onChange={(e) => setForgive(e.target.value)} /></div>
            <div><label className="label" htmlFor="hand">O que você quer deixar nas mãos de Deus esta noite?</label><textarea id="hand" className="field py-3" rows={2} placeholder="Opcional." value={hand} onChange={(e) => setHand(e.target.value)} /></div>
            <div className="rounded-3xl bg-sand p-5 text-sand-ink">
              <p className="font-display text-xl italic leading-relaxed">Pai, obrigado pelo dia. Perdoa o que errei e ajuda-me a perdoar. O que não consegui resolver, entrego a ti. Cuida de quem eu amo. Amém.</p>
            </div>
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
          </section>
        )}
        {i === 3 && (
          <section className="space-y-5">
            <header>
              <h1 className="font-display text-3xl font-semibold">{passage.ref}</h1>
              <p className="mt-2 text-muted">{passage.why}</p>
            </header>
            <article className="rounded-3xl bg-night p-6 font-display text-[22px] leading-[1.7] text-night-ink">
              {!verses && <p className="text-base opacity-70">Carregando…</p>}
              {verses?.map((t, k) => <span key={k}><sup className="mr-1 font-sans text-[0.5em] font-bold text-sun">{(passage.from ?? 1) + k}</sup>{t} </span>)}
            </article>
            {book && <p className="text-sm text-muted">{book.name} · ACF</p>}
            {supported && verses && <button className="btn-ghost" onClick={() => read(`${passage.ref}. ${verses.join(' ')}`)}>{speaking ? 'Parar áudio' : 'Ouvir a passagem'}</button>}
          </section>
        )}
        {i === 4 && (
          <section className="space-y-5 py-4 text-center">
            <h1 className="font-display text-3xl font-semibold">Hora de descansar.</h1>
            <p className="mx-auto max-w-sm text-lg text-muted">Ao concluir, o que você escreveu fica guardado no diário. Deus cuida do resto.</p>
            <blockquote className="mx-auto max-w-md rounded-3xl bg-sand p-6 text-left text-sand-ink">
              <p className="font-display text-2xl leading-snug">“{NIGHT_BENEDICTION.text}”</p>
              <p className="mt-2 text-sm opacity-70">{NIGHT_BENEDICTION.ref} · ACF</p>
            </blockquote>
          </section>
        )}
      </div>

      <div className="grid gap-3 pt-2">
        {i < 4 ? <button className="btn-primary w-full" onClick={() => setI(i + 1)} disabled={i === 3 && !verses}>Continuar</button> : <button className="btn-primary w-full" onClick={finish}>Concluir o dia</button>}
        {i > 0 && <button className="btn-ghost w-full" onClick={() => setI(i - 1)}>Voltar</button>}
      </div>
    </main>
  )
}
