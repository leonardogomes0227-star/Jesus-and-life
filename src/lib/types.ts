export type Mood = 1 | 2 | 3 | 4 | 5
export type ThemePref = 'auto' | 'light' | 'dark'

export interface Profile {
  name: string
  goal: 21 | 90
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
  partner: Partner
  theme: ThemePref
  pinHash: string | null
  createdAt: string
}
