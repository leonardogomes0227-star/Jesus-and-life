import { NEEDS, type Passage } from './needs'
import type { Moment } from './types'

export interface Feeling { id: string; label: string; need: string | null; mood: 1 | 2 | 3 | 4 | 5; trigger?: string }

export const FEELINGS: Feeling[] = [
  { id: 'ansioso', label: 'Ansioso(a)', need: 'ansiedade', mood: 2, trigger: 'Ansiedade' },
  { id: 'cansado', label: 'Cansado(a)', need: 'tristeza', mood: 2, trigger: 'Cansaço' },
  { id: 'culpado', label: 'Com culpa', need: 'perdao', mood: 2 },
  { id: 'sozinho', label: 'Sozinho(a)', need: 'tristeza', mood: 2, trigger: 'Solidão' },
  { id: 'tentado', label: 'Em luta', need: 'tentacao', mood: 2 },
  { id: 'perdido', label: 'Sem direção', need: 'direcao', mood: 3 },
  { id: 'fraco', label: 'Sem forças', need: 'coragem', mood: 2 },
  { id: 'grato', label: 'Grato(a)', need: 'gratidao', mood: 5 },
  { id: 'bem', label: 'Em paz', need: null, mood: 4 },
]

export const ARRIVE: Record<string, string> = {
  ansioso: 'Você chegou ansioso(a). Não precisa organizar a cabeça antes de entrar. Pode vir assim.',
  cansado: 'Você chegou cansado(a). Hoje basta estar aqui, sem produzir nada.',
  culpado: 'Você chegou com peso na consciência. Aqui o primeiro passo é ser acolhido(a), e não cobrado(a).',
  sozinho: 'Você chegou sentindo solidão. Você não está falando sozinho(a).',
  tentado: 'Você chegou no meio de uma luta. Vir até aqui já é um passo, e dos mais corajosos.',
  perdido: 'Você chegou sem saber o que fazer. Deus não exige clareza para você chegar perto.',
  fraco: 'Você chegou sem forças. A força aqui é recebida, e não produzida.',
  grato: 'Você chegou com gratidão. Vamos guardar isso diante de Deus.',
  bem: 'Você chegou em paz. Vamos manter essa paz diante de Deus.',
}

export const PRAYER_BY_NEED: Record<string, string> = {
  ansiedade: 'Pai, minha cabeça está cheia e eu não consigo desligar. Entrego a ti o que me preocupa, uma coisa de cada vez. Guarda o meu coração e os meus pensamentos hoje. Amém.',
  tentacao: 'Senhor, estou numa luta e preciso de ti. Mostra a saída, como prometeste. Dá-me força para os próximos passos e levanta-me se eu cair. Amém.',
  perdao: 'Pai, venho como estou, sem esconder nada. Perdoa-me e limpa-me. Obrigado porque em Cristo não há condenação. Ajuda-me a recomeçar hoje. Amém.',
  tristeza: 'Senhor, o meu coração está pesado. Fica perto de mim, pois tu te aproximas de quem está quebrantado. Dá-me consolo e alguém para caminhar comigo. Amém.',
  coragem: 'Deus, estou sem forças. Renova as minhas, como prometeste a quem espera em ti. Dá-me coragem para o que me espera hoje. Amém.',
  direcao: 'Pai, não sei qual caminho seguir. Dá-me sabedoria e endireita as minhas veredas. Ajuda-me a confiar em ti, mesmo sem ver tudo. Amém.',
  identidade: 'Senhor, ensina-me a ver quem sou em ti. Que o teu amor fale mais alto do que as vozes que me diminuem. Amém.',
  gratidao: 'Pai, obrigado. Abre os meus olhos para ver o que tens feito por mim. Que a minha gratidão me aproxime ainda mais de ti. Amém.',
  jesus: 'Jesus, quero te conhecer de verdade. Mostra-te a mim e ensina-me a te seguir. Amém.',
}

export const BENEDICTION = {
  ref: 'Números 6:24-26',
  text: 'O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti, e tenha misericórdia de ti; o Senhor sobre ti levante o seu rosto, e te dê a paz.',
}

export type StepId = 'chegar' | 'palavra' | 'refletir' | 'orar' | 'responder' | 'fechar'
export const STEPS_BY_MINUTES: Record<number, StepId[]> = {
  2: ['palavra', 'orar', 'fechar'],
  5: ['chegar', 'palavra', 'orar', 'fechar'],
  10: ['chegar', 'palavra', 'refletir', 'orar', 'responder', 'fechar'],
  20: ['chegar', 'palavra', 'refletir', 'orar', 'responder', 'fechar'],
}
export const STEP_LABEL: Record<StepId, string> = {
  chegar: 'Chegar', palavra: 'Palavra', refletir: 'Refletir', orar: 'Orar', responder: 'Responder', fechar: 'Fechar',
}

/** Escolhe a passagem: segue o que a pessoa sente e evita repetir as últimas. */
export const pickPassage = (feeling: Feeling, moments: Moment[], dayIndex: number): { passage: Passage; need: string } => {
  const recent = moments.slice(-6).map((m) => m.ref)
  if (feeling.need) {
    const list = NEEDS.find((n) => n.id === feeling.need)!.passages
    const count = moments.filter((m) => m.need === feeling.need).length
    return { passage: list.find((p) => !recent.includes(p.ref)) ?? list[count % list.length], need: feeling.need }
  }
  const all = NEEDS.flatMap((n) => n.passages.map((p) => ({ passage: p, need: n.id })))
  for (let i = 0; i < all.length; i++) {
    const c = all[(dayIndex + i) % all.length]
    if (!recent.includes(c.passage.ref)) return c
  }
  return all[dayIndex % all.length]
}
