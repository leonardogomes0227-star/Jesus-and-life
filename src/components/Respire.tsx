import { useEffect, useState } from 'react'

const PHASES = [
  { label: 'Inspire', secs: 4, scale: 1 },
  { label: 'Segure', secs: 4, scale: 1 },
  { label: 'Solte devagar', secs: 6, scale: 0.55 },
] as const

/** Respiração 4-4-6 em um círculo que cresce e encolhe. */
export default function Respire() {
  const [phase, setPhase] = useState(0)
  const [left, setLeft] = useState<number>(4)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      const e = (Date.now() - t0) / 1000
      const m = e % 14
      const i = m < 4 ? 0 : m < 8 ? 1 : 2
      const end = i === 0 ? 4 : i === 1 ? 8 : 14
      setPhase(i)
      setLeft(Math.max(1, Math.ceil(end - m)))
      setCycles(Math.floor(e / 14))
    }, 150)
    return () => clearInterval(id)
  }, [])

  const p = PHASES[phase]
  const tr = `transform ${phase === 1 ? 0 : p.secs}s ease-in-out`
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-60 w-60 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-sun/15" style={{ transform: `scale(${p.scale})`, transition: tr }} />
        <div className="absolute inset-8 rounded-full bg-sun/30" style={{ transform: `scale(${p.scale})`, transition: tr }} />
        <div className="relative text-center" aria-live="polite">
          <p className="font-display text-2xl font-semibold">{p.label}</p>
          <p className="font-display text-5xl font-semibold text-sun">{left}</p>
        </div>
      </div>
      <p className="text-sm text-muted">{cycles === 0 ? 'Respire junto com o círculo' : `${cycles} ${cycles === 1 ? 'respiração completa' : 'respirações completas'}`}</p>
    </div>
  )
}
