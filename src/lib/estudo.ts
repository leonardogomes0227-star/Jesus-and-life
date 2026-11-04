import { bookById, parseRef } from './bible'
import type { Study } from './types'

export const STEPS = ['Ler', 'Observar', 'Interpretar', 'Aplicar', 'Orar'] as const

export interface Starter { label: string; ref: string }
/** Passagens boas para começar. */
export const STARTERS: Starter[] = [
  { label: 'Salmo 23', ref: 'Salmos 23' },
  { label: 'João 1:1-18', ref: 'João 1:1-18' },
  { label: 'Mateus 5:1-12', ref: 'Mateus 5:1-12' },
  { label: 'Romanos 8:1-17', ref: 'Romanos 8:1-17' },
  { label: 'Filipenses 4:4-9', ref: 'Filipenses 4:4-9' },
  { label: 'Tiago 1:2-8', ref: 'Tiago 1:2-8' },
  { label: '1 Coríntios 13', ref: '1 Coríntios 13' },
  { label: 'Isaías 40:25-31', ref: 'Isaías 40:25-31' },
]

export interface Pick { book: string; chapter: number; from: number; to: number; key?: number; widened?: boolean }

/** Entende "Salmos 23", "João 3:16" ou "Romanos 8:1-17". Os limites são ajustados depois, com o capítulo carregado. */
export const parsePick = (input: string): { book: string; chapter: number; from?: number; to?: number } | null => {
  const r = parseRef(input.trim())
  if (!r) return null
  const range = input.match(/[:.,]\s*(\d{1,3})\s*-\s*(\d{1,3})\s*$/)
  return { book: r.book.id, chapter: r.chapter, from: r.verse, to: range ? Number(range[2]) : r.verse }
}

/** Define o trecho a estudar dado o tamanho do capítulo. */
export const fitPick = (p: { book: string; chapter: number; from?: number; to?: number }, n: number): Pick => {
  if (!p.from) return { book: p.book, chapter: p.chapter, from: 1, to: Math.min(n, 15) }
  const from = Math.min(Math.max(1, p.from), n)
  const to = Math.min(Math.max(p.to ?? from, from), n)
  if (from === to) return { book: p.book, chapter: p.chapter, from: Math.max(1, from - 3), to: Math.min(n, from + 3), key: from, widened: true }
  return { book: p.book, chapter: p.chapter, from, to }
}

export const rangeText = (s: { book: string; chapter: number; from: number; to: number }, whole?: number): string => {
  const b = bookById(s.book)?.name ?? s.book
  if (whole && s.from === 1 && s.to === whole) return `${b} ${s.chapter}`
  return s.from === s.to ? `${b} ${s.chapter}:${s.from}` : `${b} ${s.chapter}:${s.from}-${s.to}`
}

export const newStudy = (p: Pick): Study => {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), book: p.book, chapter: p.chapter, from: p.from, to: p.to, key: p.key, createdAt: now, updatedAt: now, step: 0, observe: '', notice: '', god: '', person: '', change: '', action: '', prayer: '' }
}

/** Texto do estudo para copiar ou enviar. */
export const studyToText = (s: Study, verses: string[]): string => {
  const sec = (t: string, items: [string, string][]) => {
    const f = items.filter(([, v]) => v.trim())
    return f.length ? [`${t}`, ...f.map(([q, v]) => `${q} ${v.trim()}`), ''] : []
  }
  return [
    `Estudo: ${rangeText(s)} (ACF)`,
    new Date(s.doneAt ?? s.updatedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    '',
    ...(s.key && verses[s.key - s.from] ? [`Versículo-chave (${s.key}): “${verses[s.key - s.from]}”`, ''] : []),
    ...sec('OBSERVAR', [['O que o texto diz:', s.observe], ['O que chamou atenção:', s.notice]]),
    ...sec('INTERPRETAR', [['Sobre Deus:', s.god], ['Sobre nós:', s.person]]),
    ...sec('APLICAR', [['O que preciso mudar, crer ou agradecer:', s.change], ['Meu passo para hoje:', s.action]]),
    ...sec('ORAR', [['', s.prayer]]),
  ].join('\n').trim()
}

export const DRAFT_LABEL = (s: Study) => `passo ${s.step + 1} de ${STEPS.length}`
