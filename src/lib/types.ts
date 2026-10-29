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
  id?: string
  at: string
  outcome: 'opened' | 'passed' | 'slipped'
  trigger?: string // o que a pessoa nomeou que sentia
  helped?: string[] // o que ajudou, marcado ao final
}

export interface Partner {
  name: string
  phone: string
  day?: number // dia combinado do encontro semanal (0 = domingo)
  time?: string // manhã, tarde ou noite
  agreed?: boolean // a pessoa aceitou ser parceiro
}

export interface Meeting {
  id: string
  at: string
  shared: string[] // o que a pessoa escolheu compartilhar
  commitment: string // combinado para a semana seguinte
  kept?: 'sim' | 'parte' | 'nao' // se o combinado foi cumprido (respondido no encontro seguinte)
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
  trailPractice: Record<string, { when?: string; result?: 'sim' | 'parte' | 'nao' }> // prática de cada lição e como foi
  marks: Record<string, BibleMark> // chave: livro.capítulo.versículo
  lastRead: { book: string; chapter: number } | null
  moments: Moment[] // momentos com Deus concluídos
  plan: MyPlan | null // plano pessoal de prevenção
  meetings: Meeting[] // encontros semanais com o parceiro
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
  category?: string
  prayedAt?: string[] // quando a pessoa orou por este pedido
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

export interface PlanRule { id: string; trigger: string; when: string; then: string }
export interface PlanEnv { id: string; label: string; done: boolean }
export interface MyPlan {
  createdAt: string
  updatedAt: string // última revisão
  triggers: string[]
  times: string[] // faixas do dia mais difíceis
  rules: PlanRule[]
  env: PlanEnv[]
}
