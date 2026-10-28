import { BOOKS } from './books'

export interface Chapter { book: string; chapter: number }
export interface Plan {
  id: string
  title: string
  blurb: string
  days: Chapter[][]
}

const chaptersOf = (ids: string[]): Chapter[] =>
  ids.flatMap((id) => {
    const b = BOOKS.find((x) => x.id === id)!
    return Array.from({ length: b.chapters }, (_, i) => ({ book: id, chapter: i + 1 }))
  })

/** Distribui uma lista de capítulos em N dias, de forma uniforme. */
const spread = (list: Chapter[], days: number): Chapter[][] =>
  Array.from({ length: days }, (_, d) => list.slice(Math.floor((d * list.length) / days), Math.floor(((d + 1) * list.length) / days)))

const one = (s: string): Chapter => {
  const [book, c] = s.split('.')
  return { book, chapter: Number(c) }
}
const curated = (items: string[]): Chapter[][] => items.map((s) => [one(s)])

const ALL = BOOKS.map((b) => b.id)
const NT = BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id)
const psalms = chaptersOf(['sl'])

export const PLANS: Plan[] = [
  {
    id: 'liberdade7',
    title: 'Liberdade em 7 dias',
    blurb: 'Sete leituras sobre graça, identidade e vida livre.',
    days: curated(['rm.6', 'rm.8', 'gl.5', 'sl.51', '1co.10', '1jo.1', 'jo.8']),
  },
  {
    id: 'ansiedade5',
    title: 'Paz para a ansiedade, 5 dias',
    blurb: 'Textos para quando a mente não para.',
    days: curated(['fp.4', 'mt.6', 'sl.23', '1pe.5', 'is.41']),
  },
  {
    id: 'evangelhos30',
    title: 'Os quatro Evangelhos em 30 dias',
    blurb: 'Conheça Jesus por Mateus, Marcos, Lucas e João.',
    days: spread(chaptersOf(['mt', 'mc', 'lc', 'jo']), 30),
  },
  {
    id: 'sabedoria31',
    title: 'Sabedoria em 31 dias',
    blurb: 'Um capítulo de Provérbios e alguns Salmos por dia.',
    days: Array.from({ length: 31 }, (_, d) => [
      { book: 'pv', chapter: d + 1 },
      ...psalms.slice(Math.floor((d * 150) / 31), Math.floor(((d + 1) * 150) / 31)),
    ]),
  },
  {
    id: 'nt90',
    title: 'Novo Testamento em 90 dias',
    blurb: 'De Mateus ao Apocalipse, cerca de 3 capítulos por dia.',
    days: spread(chaptersOf(NT), 90),
  },
  {
    id: 'biblia365',
    title: 'Bíblia em 1 ano',
    blurb: 'Toda a Bíblia em ordem, cerca de 3 capítulos por dia.',
    days: spread(chaptersOf(ALL), 365),
  },
]

export const planById = (id: string): Plan | undefined => PLANS.find((p) => p.id === id)
