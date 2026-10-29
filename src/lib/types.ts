export type Mood = 1 | 2 | 3 | 4 | 5
export type ThemePref = 'auto' | 'light' | 'dark'

export interface Profile {
  name: string
  goal: 21 | 90
  why: string // "meu porquê"
}

export interface Checkin {
  date: string // YYYY-MM-DD
  at: string // ISO
  mood: Mood
  triggers: string[]
  note: string
}

export interface Slip {
  id: string
  at: string // ISO do momento da queda
  place: string
  triggers: string[]
  before: string
  plan: string
  streakDays: number // dias da sequência que terminou
}

export interface SosEvent {
  at: string
  outcome: 'passed' | 'slipped'
}

export interface Partner {
  name: string
  phone: string
}

export interface AppState {
  profile: Profile | null
  streakStart: string // YYYY-MM-DD do dia 1 da sequência atual
  banked: number // dias de sequências anteriores (nunca zera)
  checkins: Checkin[]
  slips: Slip[]
  sos: SosEvent[]
  readDays: string[] // dias com devocional lido
  practiceDays: string[] // dias com prática feita
  celebrated: number[] // conquistas já comemoradas
  trailDone: number[] // lições da trilha concluídas (ritmo próprio, sem expirar)
  trailNotes: Record<string, string> // anotações por lição
  marks: Record<string, BibleMark> // chave: livro.capítulo.versículo
  lastRead: { book: string; chapter: number } | null
  moments: Moment[] // momentos com Deus concluídos
  readChapters: string[] // "livro.capítulo" marcados como lidos
  plans: Record<string, PlanProgress>
  prayers: Prayer[]
  journal: JournalEntry[]
  fontScale: 0 | 1 | 2
  partner: Partner
  theme: ThemePref
  pinHash: string | null
  createdAt: string
}

export type MarkColor = 'amarelo' | 'azul' | 'verde'
export interface BibleMark {
  color?: MarkColor
  note?: string
  fav?: boolean
  to?: number // fim do trecho, quando a nota vale para vários versículos
}
export interface PlanProgress {
  startedAt: string
  done: number[] // índices de dia concluídos (0-based)
}
export interface Prayer {
  id: string
  text: string
  createdAt: string
  prayedCount: number
  answeredAt?: string
  answerNote?: string
}
export interface JournalEntry {
  id: string
  at: string
  kind: 'gratidao' | 'reflexao' | 'livre'
  text: string
}

export interface Moment {
  id: string
  at: string
  feeling: string
  minutes: number
  ref: string
  need: string
  kind?: 'manha' | 'pausa' | 'noite' // ausente em registros antigos = manhã
}
