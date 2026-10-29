/** Trava de PIN. É uma trava de privacidade casual neste aparelho; o PIN de 4 dígitos não resiste a quem tenha acesso aos dados do navegador. */

const legacy = (pin: string): string => {
  let h = 5381
  const s = `livre:${pin}`
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return String(h >>> 0)
}

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u))
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

const derive = async (pin: string, salt: Uint8Array): Promise<Uint8Array> => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt as BufferSource, iterations: 150_000, hash: 'SHA-256' }, key, 256)
  return new Uint8Array(bits)
}

/** Gera o PIN guardado: PBKDF2 com sal aleatório (ou o formato antigo, se o navegador não tiver crypto.subtle). */
export const makePin = async (pin: string): Promise<string> => {
  if (!globalThis.crypto?.subtle) return legacy(pin)
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return `v2:${b64(salt)}:${b64(await derive(pin, salt))}`
}

/** Confere o PIN, aceitando também PINs criados na versão antiga. */
export const verifyPin = async (pin: string, stored: string): Promise<boolean> => {
  if (!stored.startsWith('v2:')) return legacy(pin) === stored
  if (!globalThis.crypto?.subtle) return false
  const [, salt, hash] = stored.split(':')
  const got = await derive(pin, unb64(salt))
  const want = unb64(hash)
  return got.length === want.length && got.every((b, i) => b === want[i])
}

/* Bloqueio temporário depois de erros seguidos: 5 erros = 30 s, dobrando a cada novo erro, até 15 min. */
const LOCK_KEY = 'livre.pinfail'
type Lock = { n: number; until: number }
const read = (): Lock => {
  try { return JSON.parse(localStorage.getItem(LOCK_KEY) ?? '') as Lock } catch { return { n: 0, until: 0 } }
}
export const lockLeftMs = (): number => Math.max(0, read().until - Date.now())
export const recordFail = (): number => {
  const l = read()
  const n = (l.n || 0) + 1
  const ms = n >= 5 ? Math.min(15 * 60_000, 30_000 * 2 ** (n - 5)) : 0
  try { localStorage.setItem(LOCK_KEY, JSON.stringify({ n, until: Date.now() + ms })) } catch { /* sem armazenamento */ }
  return ms
}
export const clearFails = (): void => {
  try { localStorage.removeItem(LOCK_KEY) } catch { /* sem armazenamento */ }
}

/* A sessão aberta continua destravada: ao criar ou trocar o PIN em Ajustes, o app não deve travar na hora. */
const UNLOCK_KEY = 'livre.unlocked'
export const isUnlocked = (): boolean => {
  try { return sessionStorage.getItem(UNLOCK_KEY) === '1' } catch { return false }
}
export const markUnlocked = (): void => {
  try { sessionStorage.setItem(UNLOCK_KEY, '1') } catch { /* sem armazenamento */ }
}
