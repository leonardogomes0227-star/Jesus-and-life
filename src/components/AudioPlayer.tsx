import { useEffect, useRef, useState } from 'react'
import { startAmbient, type AudioSessionData } from '../lib/audio'
import { stopSpeaking } from '../lib/speech'

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const say = (text: string): Promise<void> =>
  new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    u.rate = 0.88
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith('pt'))
    if (v) u.voice = v
    const safety = setTimeout(resolve, text.length * 110 + 4000)
    u.onend = u.onerror = () => {
      clearTimeout(safety)
      resolve()
    }
    window.speechSynthesis.speak(u)
  })

export default function AudioPlayer({ session, onClose }: { session: AudioSessionData; onClose?: () => void }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const [ambient, setAmbient] = useState(true)
  const [voice, setVoice] = useState(canSpeak)
  const run = useRef(0)
  const stopAmb = useRef<(() => void) | null>(null)
  const idxRef = useRef(0)

  const halt = () => {
    run.current++
    if (canSpeak) stopSpeaking()
    stopAmb.current?.()
    stopAmb.current = null
    setPlaying(false)
  }

  useEffect(() => halt, []) // eslint-disable-line react-hooks/exhaustive-deps

  const play = async () => {
    const id = ++run.current
    setPlaying(true)
    setDone(false)
    if (ambient && !stopAmb.current) stopAmb.current = startAmbient()
    for (let i = idxRef.current; i < session.lines.length; i++) {
      if (run.current !== id) return
      idxRef.current = i
      setIdx(i)
      const line = session.lines[i]
      if (voice && canSpeak) await say(line.t)
      else await wait(Math.max(2500, line.t.length * 55))
      if (run.current !== id) return
      await wait(line.pause * 1000)
    }
    if (run.current !== id) return
    idxRef.current = 0
    setIdx(0)
    setDone(true)
    halt()
  }

  const pause = () => halt()
  const restart = () => { halt(); idxRef.current = 0; setIdx(0); setDone(false) }
  const pct = Math.round(((done ? session.lines.length : idx) / session.lines.length) * 100)

  return (
    <div className="space-y-4">
      <div className="card text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-sun">{session.minutes} min · áudio guiado</p>
        <h2 className="mt-1 font-display text-2xl font-bold">{session.title}</h2>
        <p key={idx} className="fade-up mt-5 min-h-[7rem] font-display text-xl leading-snug">
          {playing || idx > 0 || done ? (done ? 'Quando quiser, volte ao seu dia. Que Deus vá com você.' : session.lines[idx].t) : session.blurb}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} /></div>
        <div className="mt-5 flex items-center justify-center gap-3">
          {playing ? (
            <button className="btn-primary min-w-[160px]" onClick={pause}>Pausar</button>
          ) : (
            <button className="btn-primary min-w-[160px]" onClick={play}>{done ? 'Ouvir de novo' : idx > 0 ? 'Continuar' : 'Começar'}</button>
          )}
          {(idx > 0 || done) && <button className="btn-ghost" onClick={restart}>Reiniciar</button>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost text-sm" aria-pressed={ambient} onClick={() => {
          const next = !ambient
          setAmbient(next)
          if (playing) { if (next) stopAmb.current = startAmbient(); else { stopAmb.current?.(); stopAmb.current = null } }
        }}>{ambient ? 'Som ambiente: ligado' : 'Som ambiente: desligado'}</button>
        {canSpeak ? (
          <button className="btn-ghost text-sm" aria-pressed={voice} onClick={() => setVoice((v) => !v)}>{voice ? 'Voz: ligada' : 'Voz: desligada (só texto)'}</button>
        ) : (
          <p className="flex items-center justify-center text-center text-xs text-muted">Seu aparelho não tem voz. Siga pelo texto.</p>
        )}
      </div>
      {onClose && <button className="btn-ghost w-full" onClick={() => { halt(); onClose() }}>Fechar áudio</button>}
    </div>
  )
}
