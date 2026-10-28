export interface Passage { ref: string; book: string; chapter: number; from?: number; to?: number; why: string }
export interface Need { id: string; title: string; blurb: string; passages: Passage[] }

const p = (ref: string, book: string, chapter: number, from: number | undefined, to: number | undefined, why: string): Passage => ({ ref, book, chapter, from, to, why })

export const NEEDS: Need[] = [
  {
    id: 'ansiedade', title: 'Paz na ansiedade', blurb: 'Quando a mente não para.',
    passages: [
      p('Filipenses 4:4-9', 'fp', 4, 4, 9, 'Paulo, preso, ensina a trocar a ansiedade por oração e gratidão.'),
      p('Mateus 6:25-34', 'mt', 6, 25, 34, 'Jesus fala de preocupação com comida, roupa e futuro.'),
      p('Salmos 23', 'sl', 23, 1, 6, 'O Pastor que cuida, até no vale mais escuro.'),
      p('1 Pedro 5:6-11', '1pe', 5, 6, 11, 'Lançar a ansiedade sobre Deus, porque ele cuida de você.'),
    ],
  },
  {
    id: 'tentacao', title: 'Força na tentação', blurb: 'Quando a vontade aperta.',
    passages: [
      p('1 Coríntios 10:12-13', '1co', 10, 12, 13, 'Toda tentação é comum a todos, e Deus dá uma saída.'),
      p('Tiago 1:12-18', 'tg', 1, 12, 18, 'De onde a tentação vem e como resistir.'),
      p('Mateus 4:1-11', 'mt', 4, 1, 11, 'Jesus é tentado no deserto e responde com a Palavra.'),
      p('Gálatas 5:16-25', 'gl', 5, 16, 25, 'Andar pelo Espírito e o fruto que ele produz.'),
    ],
  },
  {
    id: 'perdao', title: 'Perdão e recomeço', blurb: 'Quando a culpa pesa.',
    passages: [
      p('Salmos 51', 'sl', 51, 1, 19, 'A oração de Davi depois de uma falha grave.'),
      p('1 João 1:5-10', '1jo', 1, 5, 10, 'Confessar e ser purificado.'),
      p('Lucas 15:11-24', 'lc', 15, 11, 24, 'O pai que corre ao encontro do filho que voltou.'),
      p('Romanos 8:1-4', 'rm', 8, 1, 4, 'Nenhuma condenação para quem está em Cristo.'),
    ],
  },
  {
    id: 'tristeza', title: 'Solidão e tristeza', blurb: 'Quando o coração está pesado.',
    passages: [
      p('Salmos 34:15-22', 'sl', 34, 15, 22, 'Deus está perto dos quebrantados.'),
      p('Salmos 42', 'sl', 42, 1, 11, 'Falar com a própria alma e esperar em Deus.'),
      p('Mateus 11:28-30', 'mt', 11, 28, 30, 'O convite de Jesus aos cansados.'),
      p('João 14:15-27', 'jo', 14, 15, 27, 'A promessa do Consolador e da paz.'),
    ],
  },
  {
    id: 'coragem', title: 'Coragem e força', blurb: 'Quando falta ânimo.',
    passages: [
      p('Josué 1:1-9', 'js', 1, 1, 9, 'Deus ordena coragem porque promete estar junto.'),
      p('Isaías 40:27-31', 'is', 40, 27, 31, 'Forças renovadas para quem espera no Senhor.'),
      p('Efésios 6:10-18', 'ef', 6, 10, 18, 'Fortalecer-se no Senhor e usar a armadura de Deus.'),
      p('2 Coríntios 12:7-10', '2co', 12, 7, 10, 'A graça basta, e o poder se aperfeiçoa na fraqueza.'),
    ],
  },
  {
    id: 'direcao', title: 'Direção e decisões', blurb: 'Quando não sabe o que escolher.',
    passages: [
      p('Provérbios 3:1-12', 'pv', 3, 1, 12, 'Confiar no Senhor e não só no próprio entendimento.'),
      p('Salmos 25:1-15', 'sl', 25, 1, 15, 'Pedir a Deus que mostre o caminho.'),
      p('Tiago 1:2-8', 'tg', 1, 2, 8, 'Pedir sabedoria sem duvidar.'),
      p('Romanos 12:1-8', 'rm', 12, 1, 8, 'Renovar a mente para discernir a vontade de Deus.'),
    ],
  },
  {
    id: 'identidade', title: 'Identidade e valor', blurb: 'Quando se sente pouco.',
    passages: [
      p('Salmos 139:1-18', 'sl', 139, 1, 18, 'Conhecido e formado por Deus desde antes de nascer.'),
      p('Efésios 2:1-10', 'ef', 2, 1, 10, 'Salvos pela graça e feitos para boas obras.'),
      p('1 João 3:1-3', '1jo', 3, 1, 3, 'Chamados filhos de Deus.'),
      p('Romanos 8:31-39', 'rm', 8, 31, 39, 'Nada pode nos separar do amor de Deus.'),
    ],
  },
  {
    id: 'gratidao', title: 'Gratidão e alegria', blurb: 'Para agradecer e renovar o olhar.',
    passages: [
      p('Salmos 100', 'sl', 100, 1, 5, 'Entrar na presença de Deus com gratidão.'),
      p('Salmos 103:1-14', 'sl', 103, 1, 14, 'Não esquecer nenhum dos benefícios de Deus.'),
      p('Lamentações 3:19-26', 'lm', 3, 19, 26, 'As misericórdias do Senhor se renovam a cada manhã.'),
      p('Filipenses 4:10-13', 'fp', 4, 10, 13, 'O segredo do contentamento.'),
    ],
  },
  {
    id: 'jesus', title: 'Conhecer Jesus', blurb: 'Para quem está começando.',
    passages: [
      p('João 1:1-18', 'jo', 1, 1, 18, 'Quem é Jesus desde o princípio.'),
      p('Marcos 1:1-20', 'mc', 1, 1, 20, 'O começo do ministério de Jesus.'),
      p('Lucas 15:1-10', 'lc', 15, 1, 10, 'O Deus que procura quem está perdido.'),
      p('João 3:1-21', 'jo', 3, 1, 21, 'Nascer de novo e o amor de Deus.'),
    ],
  },
]
