import { useEffect, useState } from 'react'

/** Avisa quando existe uma versão mais nova publicada e atualiza com um toque. */
export default function UpdateBanner() {
  const [stale, setStale] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD) return
    let live = true
    const check = async () => {
      try {
        const r = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
        const v = (await r.json()) as { id?: string }
        if (live && v.id && v.id !== __BUILD_ID__) setStale(true)
      } catch {
        /* sem rede ou sem version.json: ignora */
      }
    }
    void check()
    const onVisible = () => document.visibilityState === 'visible' && void check()
    document.addEventListener('visibilitychange', onVisible)
    const id = setInterval(check, 10 * 60 * 1000)
    return () => {
      live = false
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(id)
    }
  }, [])

  const update = async () => {
    try {
      const regs = await navigator.serviceWorker?.getRegistrations()
      await Promise.all((regs ?? []).map((r) => r.unregister()))
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    } catch {
      /* segue para o recarregamento */
    }
    location.reload()
  }

  if (!stale) return null
  return (
    <div role="status" className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-accent px-4 py-3 text-accent-ink">
      <span className="text-sm font-semibold">Há uma versão nova do Livre.</span>
      <button onClick={update} className="min-h-[44px] rounded-full bg-accent-ink px-5 text-sm font-bold text-accent">Atualizar</button>
    </div>
  )
}
