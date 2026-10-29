import { useEffect, useState } from 'react'
import { clearFails, lockLeftMs, recordFail, verifyPin } from '../lib/pin'

export default function PinLock({ hash, onUnlock }: { hash: string; onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [left, setLeft] = useState(() => lockLeftMs())
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (left <= 0) return
    const t = setInterval(() => setLeft(lockLeftMs()), 500)
    return () => clearInterval(t)
  }, [left > 0]) // eslint-disable-line react-hooks/exhaustive-deps

  const locked = left > 0

  const press = async (d: string) => {
    if (pin.length >= 4 || locked || busy) return
    const next = pin + d
    setPin(next)
    setError(false)
    if (next.length < 4) return
    setBusy(true)
    const ok = await verifyPin(next, hash).catch(() => false)
    setBusy(false)
    if (ok) { clearFails(); onUnlock(); return }
    const ms = recordFail()
    setError(true)
    setLeft(ms)
    setTimeout(() => setPin(''), 350)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[520px] flex-col items-center justify-center px-5">
      <h1 className="font-display text-4xl font-semibold">Livre</h1>
      <p className="mt-2 text-muted">Digite seu PIN para entrar</p>
      <div className="my-8 flex gap-3" aria-live="polite">
        {[0, 1, 2, 3].map((i) => <span key={i} className={`h-4 w-4 rounded-full border-2 ${error ? 'border-sun bg-sun' : i < pin.length ? 'border-accent bg-accent' : 'border-line'}`} />)}
      </div>
      {locked ? (
        <p className="mb-4 text-center text-sm text-sun" role="status">Muitas tentativas. Tente de novo em {Math.ceil(left / 1000)} s.</p>
      ) : error ? (
        <p className="mb-4 text-sm text-sun">PIN incorreto. Tente de novo com calma.</p>
      ) : null}
      <div className="grid w-full max-w-[280px] grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
          k === '' ? <span key={i} /> : (
            <button key={k} disabled={locked} className="min-h-[60px] rounded-full border border-line bg-surface text-xl font-semibold active:scale-95 disabled:opacity-40" onClick={() => (k === '⌫' ? setPin((p) => p.slice(0, -1)) : void press(k))} aria-label={k === '⌫' ? 'Apagar' : k}>{k}</button>
          ),
        )}
      </div>
    </main>
  )
}
