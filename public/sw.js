// Livre: modo offline simples. Páginas e arquivos do app em cache; a Bíblia é guardada ao ser lida.
const VERSION = 'livre-v3'
const SHELL = ['/', '/favicon.svg', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // Navegação: rede primeiro, cai para a página em cache (o app é uma SPA).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone()
        caches.open(VERSION).then((c) => c.put('/', copy))
        return res
      }).catch(() => caches.match('/').then((r) => r || Response.error())),
    )
    return
  }

  // Bíblia e assets com hash: cache primeiro.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)) }
      return res
    })),
  )
})
