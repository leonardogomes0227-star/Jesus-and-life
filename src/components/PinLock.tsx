import { useState } from 'react'
import { hashPin } from '../lib/store'

export default function PinLock({ hash, onUnlock }: { hash: string; onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const press = (d: string) => {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length === 4) {
      if (hashPin(next) === hash) onUnlock()
      else {
        setError(true)
        setTimeout(() => setPin(''), 350)
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center justify-center px-5">
      <h1 className="font-display text-3xl font-bold">Livre</h1>
      <p className="mt-2 text-muted">Digite seu PIN para entrar</p>
      <div className="my-8 flex gap-3" aria-live="polite">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full border-2 ${
              error ? 'border-sun bg-sun' : i < pin.length ? 'border-accent bg-accent' : 'border-line'
            }`}
          />
        ))}
      </div>
      {error && <p className="mb-4 text-sm text-sun">PIN incorreto. Tente de novo com calma.</p>}
      <div className="grid w-full max-w-[280px] grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
          k === '' ? (
            <span key={i} />
          ) : (
            <button
              key={k}
              className="min-h-[60px] rounded-full border border-line bg-surface text-xl font-semibold active:scale-95"
              onClick={() => (k === '⌫' ? setPin((p) => p.slice(0, -1)) : press(k))}
              aria-label={k === '⌫' ? 'Apagar' : k}
            >
              {k}
            </button>
          ),
        )}
      </div>
    </main>
  )
}
