// Compara os versículos citados no conteúdo do app com o texto real da ACF (public/data-acf).
import { readFileSync, writeFileSync } from 'node:fs'
import { BOOKS } from '../src/lib/books'
import { VERSES, WELCOME_VERSE } from '../src/lib/content'
import { LESSONS } from '../src/lib/trail'
import { TOPICS } from '../src/lib/topics'
import { BENEDICTION, NIGHT_BENEDICTION } from '../src/lib/momento'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
const cache = new Map<string, string[][]>()
const load = (id: string) => cache.get(id) ?? (cache.set(id, JSON.parse(readFileSync(`public/data-acf/${id}.json`, 'utf8'))), cache.get(id)!)

const real = (ref: string): string | null => {
  const m = ref.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/)
  if (!m) return null
  const book = BOOKS.find((b) => norm(b.name) === norm(m[1]))
  if (!book) return null
  let ch = Number(m[2]), v1 = m[3] ? Number(m[3]) : undefined, v2 = m[4] ? Number(m[4]) : v1
  if (book.chapters === 1 && v1 === undefined) { v1 = ch; v2 = ch; ch = 1 }
  const verses = load(book.id)[ch - 1]
  if (!verses) return null
  return (v1 ? verses.slice(v1 - 1, v2) : verses).join(' ')
}

type Item = { where: string; ref: string; text: string }
const items: Item[] = [
  ...VERSES.map((v, i) => ({ where: `Devocional #${i + 1}`, ref: v.ref, text: v.text })),
  ...LESSONS.map((l) => ({ where: `Trilha, dia ${l.n}`, ref: l.ref, text: l.text })),
  { where: 'Bênção do Momento com Deus', ref: BENEDICTION.ref, text: BENEDICTION.text },
  { where: 'Bênção da Noite', ref: NIGHT_BENEDICTION.ref, text: NIGHT_BENEDICTION.text },
  { where: 'Tela de entrada', ref: WELCOME_VERSE.ref, text: WELCOME_VERSE.text },
  ...TOPICS.flatMap((t) => t.articles.map((a) => ({ where: `Aprender: ${a.title}`, ref: a.ref, text: a.text }))),
]

let exact = 0, part = 0
const bad: (Item & { actual: string | null })[] = []
for (const it of items) {
  const r = real(it.ref)
  if (r === null) { bad.push({ ...it, actual: null }); continue }
  const a = norm(it.text), b = norm(r)
  if (a === b) exact++
  else if (b.includes(a) || a.includes(b)) part++
  else bad.push({ ...it, actual: r })
}
console.log(`Total: ${items.length} | idênticos: ${exact} | trecho do original: ${part} | diferentes: ${bad.length}`)
for (const b of bad) console.log(`\n[${b.where}] ${b.ref}\n  app:  ${b.text}\n  ACF:  ${b.actual ?? '(referência não encontrada)'}`)

// Com --fix, troca cada citação diferente pelo texto exato da ACF nos arquivos de conteúdo.
if (process.argv.includes('--fix')) {
  const files = ['src/lib/content.ts', 'src/lib/trail.ts', 'src/lib/topics.ts']
  const src = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]))
  const lit = (t: string) => t.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  let fixed = 0, missing = 0
  for (const b of bad) {
    if (!b.actual) continue
    let done = false
    for (const [f, text] of src) {
      const from = `'${lit(b.text)}'`
      if (text.includes(from)) { src.set(f, text.split(from).join(`'${lit(b.actual)}'`)); done = true }
    }
    done ? fixed++ : missing++
  }
  for (const [f, text] of src) writeFileSync(f, text)
  console.log(`\nCorrigidos: ${fixed} | não encontrados no código: ${missing}`)
}
