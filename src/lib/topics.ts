export interface Article {
  id: string
  title: string
  summary: string
  body: string[]
  ref: string
  text: string
  action: string
}

export interface Topic {
  id: string
  title: string
  emoji: string
  blurb: string
  articles: Article[]
}

export const TOPICS: Topic[] = [
  {
    id: 'mente',
    title: 'Mente e hábitos',
    emoji: '🧠',
    blurb: 'Como a mente aprende, deseja e muda, vista pela Bíblia e pela ciência.',
    articles: [
      {
        id: 'ciclo',
        title: 'O ciclo do hábito',
        summary: 'Gatilho, rotina e recompensa: entender é o primeiro passo para mudar.',
        body: [
          'Todo hábito tem três partes: um gatilho (algo que dispara), uma rotina (o que você faz) e uma recompensa (o que você sente depois). O cérebro economiza energia repetindo esse ciclo no automático.',
          'Por isso, tentar apenas "parar" costuma falhar: a rotina some, mas o gatilho e a necessidade continuam lá. A mudança funciona melhor quando você mantém o gatilho e a necessidade, e troca a rotina por outra mais saudável.',
          'A Bíblia chama isso de renovação da mente: não é só reprimir, é reaprender o caminho, com paciência e com ajuda.',
        ],
        ref: 'Romanos 12:2',
        text: 'E não sereis conformados com este mundo, mas sereis transformados pela renovação do vosso entendimento.',
        action: 'Complete a frase: "Quando [gatilho], eu costumo [rotina], porque no fundo busco [necessidade]."',
      },
      {
        id: 'dopamina',
        title: 'Dopamina: por que a vontade pega tão forte',
        summary: 'Ela está mais ligada ao desejo do que ao prazer.',
        body: [
          'A dopamina é uma substância do cérebro ligada à motivação e à busca. Ela dispara mais na expectativa de algo do que durante o próprio momento. Por isso, é comum desejar muito algo que depois decepciona.',
          'Quando você se expõe com frequência a estímulos rápidos e intensos (telas, redes, conteúdos), o cérebro passa a esperar sempre mais e acha as coisas simples sem graça. Isso não é fraqueza de caráter: é biologia respondendo ao ambiente.',
          'A boa notícia é que o cérebro se ajusta. Com semanas de menos estímulo intenso e mais descanso, movimento e conexão, a sensibilidade para as coisas simples volta.',
        ],
        ref: 'Provérbios 27:20',
        text: 'O inferno e a perdição nunca se fartam; assim os olhos do homem nunca se satisfazem.',
        action: 'Durante um dia, troque um momento de tela por uma atividade que exige o corpo: caminhar, cozinhar, alongar, tocar um instrumento.',
      },
      {
        id: 'plasticidade',
        title: 'O seu cérebro pode mudar',
        summary: 'Neuroplasticidade e esperança de um recomeço real.',
        body: [
          'O cérebro continua se reorganizando durante toda a vida. Cada repetição fortalece conexões; o que deixa de ser usado enfraquece aos poucos. Por isso, o recomeço é possível em qualquer idade.',
          'Mudar leva tempo, e o tempo varia de pessoa para pessoa. Falhas ocasionais não apagam o progresso: o que pesa é a direção ao longo dos meses.',
          'Para quem tem fé, isso combina com a promessa de Deus: ele renova. Você coopera com esse processo repetindo pequenas escolhas boas.',
        ],
        ref: '2 Coríntios 5:17',
        text: 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.',
        action: 'Escolha um hábito minúsculo (dois minutos) e repita todos os dias por uma semana, sem se cobrar perfeição.',
      },
      {
        id: 'sono',
        title: 'Sono, corpo e emoções',
        summary: 'Muitas quedas começam com corpo cansado.',
        body: [
          'Quando você dorme pouco, a parte do cérebro responsável por planejar e frear impulsos funciona pior, e a parte emocional fica mais reativa. É por isso que a madrugada e o fim do dia, quando o cansaço bate, são horários de risco.',
          'Cuidados simples ajudam muito: horário regular para dormir, celular longe da cama, luz baixa à noite, movimento durante o dia e alimentação regular.',
          'Cuidar do corpo não é "menos espiritual". Na Bíblia, o descanso é um dom e faz parte do plano de Deus.',
        ],
        ref: 'Salmos 127:2',
        text: 'Pois assim dá ele aos seus amados o sono.',
        action: 'Hoje, defina uma hora de dormir e deixe o celular carregando longe da cama.',
      },
    ],
  },
  {
    id: 'limites',
    title: 'Limites emocionais e namoro',
    emoji: '💞',
    blurb: 'Relacionamentos com respeito, honra e limites que protegem.',
    articles: [
      {
        id: 'proposito',
        title: 'Namorar com propósito',
        summary: 'Relacionamento é construção de confiança, e não pressa.',
        body: [
          'Um bom relacionamento cresce com tempo, conversa e respeito. A intensidade do começo, aquela euforia, é boa, mas não é a base: o que sustenta é a confiança construída aos poucos.',
          'Pergunte-se antes: o que eu busco nessa relação? Estou com alguém para preencher um vazio ou para caminhar junto? Se for vazio, vale cuidar dele antes.',
          'Para quem tem fé, também ajuda perguntar: essa relação me aproxima ou me afasta de Deus e de quem eu quero ser?',
        ],
        ref: '1 Coríntios 13:4',
        text: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece.',
        action: 'Escreva três qualidades que você valoriza em um relacionamento e três coisas que não quer negociar.',
      },
      {
        id: 'protegem',
        title: 'Limites que protegem',
        summary: 'Combinar antes é mais fácil do que decidir no calor do momento.',
        body: [
          'Limites não são desconfiança: são cuidado combinado de antemão. É muito mais fácil decidir com a cabeça tranquila do que no meio da emoção.',
          'Pense em limites práticos: horários, lugares, tempo a sós, uso do celular, como vocês conversam sobre temas sensíveis. O importante é que os dois concordem e saibam por quê.',
          'Se alguém desrespeita seus limites, isso é um sinal importante, e não um detalhe. Você pode dizer não e continuar sendo amado(a).',
        ],
        ref: 'Provérbios 4:23',
        text: 'Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as saídas da vida.',
        action: 'Defina com clareza um limite e converse com uma pessoa de confiança para ela te apoiar.',
      },
      {
        id: 'honra',
        title: 'Honra e respeito',
        summary: 'O outro é pessoa, nunca objeto.',
        body: [
          'Honrar alguém é tratá-lo como pessoa inteira: história, sentimentos, limites e sonhos. Isso vale para como você pensa, como fala e como age.',
          'Respeito também está nas palavras: como você fala do outro quando ele não está presente, e o que você compartilha sobre ele.',
          'Quem aprende a honrar nas pequenas coisas constrói a base para relacionamentos duradouros.',
        ],
        ref: 'Romanos 12:10',
        text: 'Amai-vos cordialmente uns aos outros com amor fraternal, preferindo-vos em honra uns aos outros.',
        action: 'Hoje, observe como você fala sobre as pessoas. Corrija um comentário que não honra.',
      },
      {
        id: 'conversar',
        title: 'Como conversar sobre limites',
        summary: 'Uma conversa honesta vale mais que muitos acordos silenciosos.',
        body: [
          'Escolha um momento calmo, sem pressa. Comece com "eu": "eu me sinto mais tranquilo(a) quando...". Evite acusar.',
          'Escute o que o outro pensa. Um limite combinado em conjunto tende a ser mais respeitado do que um imposto.',
          'Revise de tempos em tempos. Relações mudam, e os acordos também podem ser ajustados com carinho.',
        ],
        ref: 'Tiago 1:19',
        text: 'Todo o homem seja pronto para ouvir, tardio para falar, tardio para se irar.',
        action: 'Prepare três frases começando com "eu" para a próxima conversa importante.',
      },
    ],
  },
  {
    id: 'ansiedade',
    title: 'Ansiedade e vazio interior',
    emoji: '🌫️',
    blurb: 'O que fazer com a inquietação, a solidão e a sensação de vazio.',
    articles: [
      {
        id: 'ansiedade',
        title: 'O que a ansiedade quer te dizer',
        summary: 'É um alarme do corpo, e dá para acalmá-lo.',
        body: [
          'A ansiedade é um alarme do corpo que tenta te proteger de uma ameaça, real ou imaginada. O coração acelera, a respiração encurta, a mente corre.',
          'Respirar devagar, com a expiração mais longa que a inspiração (como no 4-4-6 do SOS), sinaliza ao corpo que está seguro. Nomear o que você sente também reduz a intensidade.',
          'A fé não nega a ansiedade: convida a lançar o peso sobre Deus enquanto você cuida do corpo e da rotina.',
        ],
        ref: '1 Pedro 5:7',
        text: 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
        action: 'Faça três ciclos de respiração 4-4-6 agora e diga a Deus, em uma frase, o que está te inquietando.',
      },
      {
        id: 'oracao',
        title: 'Oração que acalma o corpo',
        summary: 'Oração curta, voz baixa, respiração lenta.',
        body: [
          'A oração não precisa ser longa. Uma frase repetida devagar, no ritmo da respiração, pode acalmar o corpo e a mente: inspire ("Senhor Jesus") e solte o ar ("tem misericórdia de mim").',
          'Orar em voz baixa ajuda a manter o foco. Se a mente fugir, tudo bem: volte com gentileza, sem se cobrar.',
          'Orar é também falar a verdade: você pode dizer a Deus exatamente como se sente.',
        ],
        ref: 'Filipenses 4:6-7',
        text: 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças.',
        action: 'Escolha uma frase curta de oração e a repita por três minutos, no ritmo da respiração.',
      },
      {
        id: 'vazio',
        title: 'Vazio: o que fazer com ele',
        summary: 'Vazio é um sinal, e pode ser ouvido sem pânico.',
        body: [
          'Todo mundo sente vazio de vez em quando. Ele pode vir de solidão, cansaço, falta de sentido ou excesso de estímulo. Ele não é um defeito seu.',
          'Muitos hábitos tentam calar o vazio rápido, mas só adiam o encontro com a causa. Perguntar "o que eu realmente preciso agora?" costuma revelar algo simples: descanso, conversa, movimento, carinho, sentido.',
          'Deus se aproxima de quem se sente assim. A sede é um convite, e não uma condenação.',
        ],
        ref: 'João 4:14',
        text: 'Mas aquele que beber da água que eu lhe der nunca terá sede.',
        action: 'Na próxima vez que sentir vazio, pare e pergunte: "O que eu preciso agora?" Escolha uma resposta e faça.',
      },
      {
        id: 'ajuda',
        title: 'Quando buscar ajuda profissional',
        summary: 'Pedir ajuda faz parte do cuidado, e não é falta de fé.',
        body: [
          'Se a ansiedade ou a tristeza atrapalham seu sono, seus estudos, suas relações ou duram semanas, procurar um psicólogo ou médico é um ato de cuidado. Fé e acompanhamento profissional caminham juntos.',
          'Se você estiver pensando em se machucar ou sentir que não vê saída, fale agora com alguém. O CVV atende pelo telefone 188, 24 horas, de graça e com sigilo. Em emergência, ligue 192 (SAMU).',
          'Você não precisa passar por isso sozinho(a).',
        ],
        ref: 'Salmos 34:18',
        text: 'Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.',
        action: 'Se você sente que precisa, converse hoje com alguém de confiança sobre buscar apoio profissional.',
      },
    ],
  },
]
