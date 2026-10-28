import { BOOKS, type Book } from './books'

const cache = new Map<string, Promise<string[][]>>()

/** Capítulos de um livro (cada capítulo é uma lista de versículos). Cacheado em memória e pelo service worker. */
export const loadBook = (id: string): Promise<string[][]> => {
  let p = cache.get(id)
  if (!p) {
    p = fetch(`/data-acf/${id}.json`).then((r) => {
      if (!r.ok) throw new Error('livro indisponível')
      return r.json() as Promise<string[][]>
    })
    p.catch(() => cache.delete(id))
    cache.set(id, p)
  }
  return p
}

export const bookById = (id: string): Book | undefined => BOOKS.find((b) => b.id === id)

export const norm = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const ALIAS: Record<string, string> = {
  gn: 'gn', ex: 'ex', lv: 'lv', nm: 'nm', dt: 'dt', js: 'js', jz: 'jz', rt: 'rt', ed: 'ed', ne: 'ne', et: 'et',
  jo: 'jo', sl: 'sl', pv: 'pv', ec: 'ec', ct: 'ct', is: 'is', jr: 'jr', lm: 'lm', ez: 'ez', dn: 'dn',
  os: 'os', jl: 'jl', am: 'am', ob: 'ob', jn: 'jn', mq: 'mq', na: 'na', hc: 'hc', sf: 'sf', ag: 'ag', zc: 'zc', ml: 'ml',
  mt: 'mt', mc: 'mc', lc: 'lc', at: 'atos', rm: 'rm', gl: 'gl', ef: 'ef', fp: 'fp', cl: 'cl', tt: 'tt', fm: 'fm',
  hb: 'hb', tg: 'tg', jd: 'jd', ap: 'ap',
}

const bookKey = (b: Book) => norm(b.name).replace(/\s+/g, '')

/** Entende "Jo 3:16", "joão 3", "1 coríntios 13", "Salmos 23:1-3". */
export const parseRef = (input: string): { book: Book; chapter: number; verse?: number } | null => {
  if (/^j[óo]\s*\d/i.test(input.trim()) && input.trim().toLowerCase().startsWith('jó')) input = input.replace(/^jó/i, 'job')
  const m = norm(input).match(/^((?:[123]\s*)?[a-z ]+?)\s*(\d{1,3})(?:\s*[:.,]\s*(\d{1,3}))?(?:\s*-\s*\d{1,3})?$/)
  if (!m) return null
  const raw = m[1].replace(/\s+/g, '')
  const book =
    BOOKS.find((b) => b.id === (ALIAS[raw] ?? raw)) ??
    BOOKS.find((b) => bookKey(b) === raw) ??
    BOOKS.find((b) => bookKey(b).startsWith(raw) && raw.length >= 3)
  if (!book) return null
  const chapter = Number(m[2])
  if (chapter < 1 || chapter > book.chapters) return null
  return { book, chapter, verse: m[3] ? Number(m[3]) : undefined }
}

export interface Hit { book: Book; chapter: number; verse: number; text: string }

/** Busca por palavra(s) em toda a Bíblia: todas as palavras precisam aparecer no versículo. */
export const searchText = async (query: string, limit = 60, testament?: 'AT' | 'NT'): Promise<Hit[]> => {
  const words = norm(query).split(/\s+/).filter((w) => w.length >= 3)
  if (words.length === 0) return []
  const hits: Hit[] = []
  for (const book of BOOKS) {
    if (testament && book.testament !== testament) continue
    const chapters = await loadBook(book.id)
    for (let c = 0; c < chapters.length; c++)
      for (let v = 0; v < chapters[c].length; v++) {
        const t = norm(chapters[c][v])
        if (words.every((w) => t.includes(w))) {
          hits.push({ book, chapter: c + 1, verse: v + 1, text: chapters[c][v] })
          if (hits.length >= limit) return hits
        }
      }
  }
  return hits
}

/** Extrai {livro, capítulo} de uma referência textual do app, ex.: "2 Coríntios 12:9". */
export const chapterOfRef = (ref: string) => parseRef(ref.replace(/\s+/g, ' '))
