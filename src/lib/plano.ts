import type { AppState, PlanEnv } from './types'

export interface Suggestion { when: string; then: string }

export const RULE_SUGGESTIONS: Record<string, Suggestion[]> = {
  Estresse: [
    { when: 'Estou estressado(a) e sem saída', then: 'Faço dez respirações lentas e saio para andar por 10 minutos.' },
    { when: 'A pressão do dia está alta', then: 'Escrevo o que está pesando e escolho uma única coisa para resolver agora.' },
  ],
  Tédio: [
    { when: 'Sinto tédio e pego o celular sem pensar', then: 'Deixo o celular em outro cômodo e faço algo com as mãos por 15 minutos.' },
    { when: 'Estou sem nada para fazer', then: 'Mando mensagem a um amigo e combino de sair ou fazer algo juntos.' },
  ],
  Solidão: [
    { when: 'Me sinto sozinho(a)', then: 'Ligo ou mando mensagem ao meu parceiro ou a alguém de confiança.' },
    { when: 'A casa está em silêncio e me sinto sozinho(a)', then: 'Vou para um lugar com gente: a sala, a rua, a igreja ou a casa de um amigo.' },
  ],
  Cansaço: [
    { when: 'Estou exausto(a) e com a guarda baixa', then: 'Bebo água, tomo banho e vou dormir, mesmo mais cedo.' },
    { when: 'É tarde e estou sem energia', then: 'Deixo o celular fora do quarto e vou para a cama.' },
  ],
  Ansiedade: [
    { when: 'A ansiedade aperta', then: 'Faço a respiração 4-4-6 por três minutos e ouço o áudio de acalmar.' },
    { when: 'Minha cabeça não para', then: 'Escrevo tudo no diário e entrego a Deus em oração.' },
  ],
  Tristeza: [
    { when: 'Estou triste e quero fugir disso', then: 'Escrevo o que sinto, ouço uma música calma e falo com alguém.' },
    { when: 'A tristeza pesa à noite', then: 'Faço o momento da Noite e leio um Salmo.' },
  ],
  'Celular na cama': [
    { when: 'Estou na cama com o celular na mão', then: 'Coloco o celular para carregar fora do quarto e leio duas páginas de um livro ou da Bíblia.' },
    { when: 'Não consigo dormir e o celular está por perto', then: 'Levanto, bebo água e volto para a cama sem o celular.' },
  ],
  'Redes sociais': [
    { when: 'Percebo que estou rolando o feed sem parar', then: 'Fecho o aplicativo, deixo o celular na mesa e levanto por 5 minutos.' },
    { when: 'Um perfil ou aplicativo me puxa para onde não quero ir', then: 'Silencio ou removo esse perfil e limito o aplicativo a 20 minutos por dia.' },
  ],
  Conflito: [
    { when: 'Tive uma briga ou discussão', then: 'Respiro, não respondo na hora e saio para andar antes de falar.' },
    { when: 'Fiquei com raiva de alguém', then: 'Escrevo o que sinto sem enviar e converso com o meu parceiro.' },
  ],
  Fome: [
    { when: 'Estou com fome e irritado(a)', then: 'Faço uma refeição de verdade antes de decidir qualquer coisa.' },
    { when: 'Passei muitas horas sem comer', then: 'Como algo simples e bebo água antes de usar o celular.' },
  ],
  Madrugada: [
    { when: 'Acordo de madrugada e a vontade vem', then: 'Levanto, bebo água, acendo a luz, faço a respiração e não volto para a cama com o celular.' },
    { when: 'Estou acordado(a) depois da meia-noite', then: 'Ouço o áudio de dormir e deixo o celular fora do quarto.' },
  ],
  'Sozinho(a) em casa': [
    { when: 'Fico sozinho(a) em casa', then: 'Fico em área comum com a porta do quarto aberta e aviso o meu parceiro.' },
    { when: 'Sei que vou ficar sozinho(a) por horas', then: 'Combino com alguém de me ligar ou de passar um tempo comigo.' },
  ],
}

export const ENV_DEFAULTS: string[] = [
  'Deixar o celular carregando fora do quarto à noite',
  'Ativar um filtro de conteúdo no celular e no computador',
  'Apagar ou limitar os aplicativos que mais me puxam',
  'Ter um horário fixo para dormir',
  'Usar celular e computador em lugar aberto da casa, com a porta aberta',
  'Deixar uma atividade pronta para os horários difíceis (livro, caminhada, instrumento)',
]

export const TIME_BLOCKS = ['Madrugada (0 às 5h)', 'Manhã (6 às 11h)', 'Tarde (12 às 17h)', 'Noite (18 às 23h)']
const blockOf = (iso: string) => Math.floor(new Date(iso).getHours() / 6)

/** O que a pessoa já registrou: gatilhos nomeados em check-ins, SOS e quedas, e as faixas de maior risco. */
export const history = (s: AppState) => {
  const triggers = new Map<string, number>()
  const add = (t?: string) => t && triggers.set(t, (triggers.get(t) ?? 0) + 1)
  s.checkins.forEach((c) => c.triggers.forEach(add))
  s.slips.forEach((x) => x.triggers.forEach(add))
  s.sos.forEach((e) => add(e.trigger))
  const blocks = [0, 0, 0, 0]
  ;[...s.slips, ...s.sos].forEach((e) => blocks[blockOf(e.at)]++)
  const topBlock = Math.max(...blocks) > 0 ? blocks.indexOf(Math.max(...blocks)) : -1
  return { triggers: [...triggers.entries()].sort((a, b) => b[1] - a[1]), topBlock }
}

export const newEnv = (labels: string[]): PlanEnv[] => labels.map((label) => ({ id: crypto.randomUUID(), label, done: false }))

/** Texto do plano para enviar ao parceiro: só regras e ambiente, sem detalhes íntimos. */
export const planMessage = (s: AppState): string => {
  const p = s.plan!
  const rules = p.rules.slice(0, 5).map((r) => `• Se ${r.when.charAt(0).toLowerCase()}${r.when.slice(1)}, então ${r.then.charAt(0).toLowerCase()}${r.then.slice(1)}`)
  const env = p.env.slice(0, 4).map((e) => `• ${e.label}`)
  return ['Oi! Montei o meu plano para os dias difíceis e queria dividir com você.', rules.length ? `\nO que vou fazer:\n${rules.join('\n')}` : '', env.length ? `\nMudanças no meu dia a dia:\n${env.join('\n')}` : '', '\nPode me perguntar como estou indo?'].join('\n')
}
