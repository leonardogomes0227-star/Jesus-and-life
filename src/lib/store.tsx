import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState, BibleMark, Slip } from './types'
import { addDays, dayKey, diffDays } from './dates'
import { MILESTONES } from './content'

export const STORAGE_KEY = 'livre.v1'

export const emptyState = (): AppState => ({
  profile: null,
  streakStart: dayKey(),
  banked: 0,
  checkins: [],
  slips: [],
  sos: [],
  readDays: [],
  practiceDays: [],
  celebrated: [],
  trailDone: [],
  trailNotes: {},
  trailPractice: {},
  marks: {},
  lastRead: null,
  readChapters: [],
  moments: [],
  plan: null,
  meetings: [],
  reminders: {},
  readArticles: [],
  discreet: false,
  lastBackupAt: null,
  plans: {},
  prayers: [],
  journal: [],
  fontScale: 1,
  partner: { name: '', phone: '' },
  theme: 'auto',
  pinHash: null,
  createdAt: new Date().toISOString(),
})

/** Mescla um objeto desconhecido com o estado padrão, descartando o que não faz sentido. */
export const normalize = (raw: unknown): AppState => {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Partial<AppState>
  return {
    ...base,
    ...r,
    partner: { ...base.partner, ...(r.partner ?? {}) },
    checkins: Array.isArray(r.checkins) ? r.checkins : [],
    slips: Array.isArray(r.slips) ? r.slips : [],
    sos: Array.isArray(r.sos) ? r.sos : [],
    readDays: Array.isArray(r.readDays) ? r.readDays : [],
    practiceDays: Array.isArray(r.practiceDays) ? r.practiceDays : [],
    celebrated: Array.isArray(r.celebrated) ? r.celebrated : [],
    trailDone: Array.isArray(r.trailDone) ? r.trailDone : [],
    trailNotes: r.trailNotes && typeof r.trailNotes === 'object' ? r.trailNotes : {},
    trailPractice: r.trailPractice && typeof r.trailPractice === 'object' ? r.trailPractice : {},
    marks: r.marks && typeof r.marks === 'object' ? r.marks : {},
    plans: r.plans && typeof r.plans === 'object' ? r.plans : {},
    prayers: Array.isArray(r.prayers) ? r.prayers : [],
    journal: Array.isArray(r.journal) ? r.journal : [],
    lastRead: r.lastRead ?? null,
    readChapters: Array.isArray(r.readChapters) ? r.readChapters : [],
    moments: Array.isArray(r.moments) ? r.moments : [],
    plan: r.plan && typeof r.plan === 'object' ? r.plan : null,
    meetings: Array.isArray(r.meetings) ? r.meetings : [],
    reminders: r.reminders && typeof r.reminders === 'object' ? r.reminders : {},
    readArticles: Array.isArray(r.readArticles) ? r.readArticles : [],
    discreet: r.discreet === true,
    lastBackupAt: typeof r.lastBackupAt === 'string' ? r.lastBackupAt : null,
    fontScale: r.fontScale === 0 || r.fontScale === 2 ? r.fontScale : 1,
    profile: r.profile ? { ...r.profile, why: r.profile.why ?? '' } : null,
    banked: Number.isFinite(r.banked) ? Number(r.banked) : 0,
  }
}

const load = (): AppState => {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? normalize(JSON.parse(s)) : emptyState()
  } catch {
    return emptyState()
  }
}

/** Dia atual da sequência (o dia 1 é o primeiro dia). */
export const streakDay = (s: AppState, today = dayKey()): number =>
  Math.max(1, diffDays(s.streakStart, today) + 1)

/** Total acumulado: nunca zera, mesmo depois de recomeçar. */
export const totalDays = (s: AppState, today = dayKey()): number => s.banked + streakDay(s, today)

interface Store {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  start: (name: string, daysSoFar: number, goal: 21 | 90, why: string) => void
  toggleDay: (key: 'readDays' | 'practiceDays') => void
  celebrate: (upTo: number) => void
  completeLesson: (n: number, note: string) => void
  setMark: (key: string, patch: Partial<BibleMark>) => void
  setLastRead: (book: string, chapter: number) => void
  togglePlanDay: (planId: string, day: number) => void
  saveCheckin: (c: { mood: 1 | 2 | 3 | 4 | 5; triggers: string[]; note: string }) => void
  sosOpen: (id: string) => void
  sosClose: (id: string, outcome: 'passed' | 'slipped', extra?: { trigger?: string; helped?: string[] }) => void
  registerSlip: (s: Omit<Slip, 'id' | 'streakDays'>) => void
  replaceAll: (s: AppState) => void
  wipe: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* armazenamento indisponível: o app segue funcionando em memória */
    }
  }, [state])

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), [])

  const store = useMemo<Store>(
    () => ({
      state,
      update,
      start: (name, daysSoFar, goal, why) =>
        setState((s) => ({
          ...s,
          profile: { name: name.trim(), goal, why: why.trim() },
          celebrated: MILESTONES.filter((m) => m.days <= Math.max(daysSoFar, 1)).map((m) => m.days),
          streakStart: addDays(dayKey(), -Math.max(0, daysSoFar - 1)),
          banked: 0,
        })),
      toggleDay: (key) =>
        setState((s) => {
          const d = dayKey()
          return { ...s, [key]: s[key].includes(d) ? s[key].filter((x) => x !== d) : [...s[key], d] }
        }),
      celebrate: (upTo) =>
        setState((s) => ({ ...s, celebrated: MILESTONES.filter((m) => m.days <= upTo).map((m) => m.days) })),
      completeLesson: (n, note) =>
        setState((s) => ({
          ...s,
          trailDone: s.trailDone.includes(n) ? s.trailDone : [...s.trailDone, n].sort((a, b) => a - b),
          trailNotes: note.trim() ? { ...s.trailNotes, [n]: note.trim() } : s.trailNotes,
        })),
      setMark: (key, patch) =>
        setState((s) => {
          const next = { ...(s.marks[key] ?? {}), ...patch }
          const marks = { ...s.marks }
          if (!next.color && !next.note && !next.fav) delete marks[key]
          else marks[key] = next
          return { ...s, marks }
        }),
      setLastRead: (book, chapter) =>
        setState((s) => (s.lastRead?.book === book && s.lastRead.chapter === chapter ? s : { ...s, lastRead: { book, chapter } })),
      togglePlanDay: (planId, day) =>
        setState((s) => {
          const cur = s.plans[planId] ?? { startedAt: new Date().toISOString(), done: [] }
          const done = cur.done.includes(day) ? cur.done.filter((d) => d !== day) : [...cur.done, day].sort((a, b) => a - b)
          return { ...s, plans: { ...s.plans, [planId]: { ...cur, done } } }
        }),
      saveCheckin: (c) =>
        setState((s) => {
          const date = dayKey()
          const rest = s.checkins.filter((x) => x.date !== date)
          return { ...s, checkins: [...rest, { ...c, date, at: new Date().toISOString() }] }
        }),
      sosOpen: (id) =>
        setState((s) => (s.sos.some((e) => e.id === id) ? s : { ...s, sos: [...s.sos, { id, at: new Date().toISOString(), outcome: 'opened' }] })),
      sosClose: (id, outcome, extra) =>
        setState((s) => ({ ...s, sos: s.sos.map((e) => (e.id === id ? { ...e, outcome, ...extra } : e)) })),
      registerSlip: (data) =>
        setState((s) => {
          const today = dayKey()
          const days = streakDay(s, today)
          const slip: Slip = { ...data, id: crypto.randomUUID(), streakDays: days }
          return {
            ...s,
            slips: [...s.slips, slip],
            // dias já vividos continuam contando; o dia de hoje abre a nova sequência
            banked: s.banked + (days - 1),
            streakStart: today,
            sos: s.sos,
          }
        }),
      replaceAll: (next) => setState(normalize(next)),
      wipe: () => {
        try {
          localStorage.removeItem(STORAGE_KEY)
          sessionStorage.clear()
        } catch {
          /* ignora */
        }
        setState(emptyState())
      },
    }),
    [state, update],
  )

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore fora do StoreProvider')
  return v
}


/** Melhor sequência já registrada. */
export const bestStreak = (s: AppState): number => Math.max(streakDay(s), ...s.slips.map((x) => x.streakDays - 1))

/** Próxima lição da trilha (1 a `goal`); goal + 1 quando tudo foi concluído. */
export const currentLesson = (s: AppState): number => {
  const goal = s.profile?.goal ?? 21
  for (let n = 1; n <= goal; n++) if (!s.trailDone.includes(n)) return n
  return goal + 1
}

/** Primeiro dia ainda não concluído de um plano (0-based); `total` quando acabou. */
export const planCursor = (s: AppState, planId: string, total: number): number => {
  const done = s.plans[planId]?.done ?? []
  for (let d = 0; d < total; d++) if (!done.includes(d)) return d
  return total
}
