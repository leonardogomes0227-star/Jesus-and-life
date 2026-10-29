export interface Lesson {
  n: number
  title: string
  ref: string
  text: string // ACF
  teaching: string // contexto bíblico
  mind?: string // o que a ciência do comportamento diz
  practice: string
  prayer?: string
  prompt?: string
}

export interface Phase {
  id: string
  name: string
  blurb: string
  from: number
  to: number
}

export const PHASES: Phase[] = [
  { id: 'a', name: 'Identidade', blurb: 'Quem você é antes de qualquer hábito.', from: 1, to: 7 },
  { id: 'b', name: 'Como a mente funciona', blurb: 'Gatilhos, dopamina e escolhas, à luz da Bíblia.', from: 8, to: 14 },
  { id: 'c', name: 'Não caminhe só', blurb: 'Confissão, comunidade e recomeço.', from: 15, to: 21 },
  { id: 'd', name: 'Renovar a mente', blurb: 'Pensamentos, ansiedade e descanso em Deus.', from: 22, to: 45 },
  { id: 'e', name: 'Relações e comunidade', blurb: 'Amizade, amor e limites saudáveis.', from: 46, to: 66 },
  { id: 'f', name: 'Perseverança e propósito', blurb: 'Constância, esperança e vida nova.', from: 67, to: 90 },
]

const CORE: Lesson[] = [
  {
    n: 1, title: 'Amado antes de qualquer coisa', ref: '1 João 3:1',
    text: 'Vede quão grande amor nos tem concedido o Pai, que fôssemos chamados filhos de Deus.',
    teaching: 'João escreve a cristãos pressionados e cheios de dúvidas. Antes de qualquer ordem, ele lembra quem eles são: filhos amados. Na Bíblia, a identidade vem primeiro e o comportamento vem depois, nunca o contrário.',
    mind: 'O cérebro aprende por repetição. Repetir "eu sou um fracasso" aprofunda um caminho mental. Repetir "eu sou amado" abre um caminho novo, e cada repetição o fortalece.',
    practice: 'Diga em voz alta, três vezes: "Eu sou filho(a) amado(a) de Deus." Faça isso antes de abrir o celular.',
    prayer: 'Pai, obrigado porque o teu amor não depende do meu desempenho. Ajuda-me a viver hoje como filho(a) amado(a). Amém.',
    prompt: 'Que mentira sobre mim mesmo(a) eu mais repito? O que Deus diz no lugar dela?',
  },
  {
    n: 2, title: 'Sem condenação', ref: 'Romanos 8:1',
    text: 'Portanto, agora, nenhuma condenação há para os que estão em Cristo Jesus, que não andam segundo a carne, mas segundo o espírito.',
    teaching: 'No capítulo 7, Paulo descreve a própria luta interior. O capítulo 8 abre com "portanto, agora": a resposta à luta é graça, não mais esforço. "Condenação" aqui é linguagem de tribunal: a sentença já foi retirada.',
    mind: 'Culpa diz "fiz algo que quero corrigir". Vergonha diz "eu sou o problema". A vergonha faz a pessoa se esconder, e esconder-se alimenta o ciclo. Falar com honestidade quebra esse padrão.',
    practice: 'Se um pensamento de condenação surgir hoje, responda em voz baixa: "Em Cristo, não há condenação. Posso recomeçar."',
    prayer: 'Senhor, tira de mim a vergonha que não vem de ti. Quero começar sempre pela tua graça. Amém.',
    prompt: 'Que voz me condena com mais frequência? Ela soa como Deus ou como outra coisa?',
  },
  {
    n: 3, title: 'Uma vida nova é possível', ref: '2 Coríntios 5:17',
    text: 'Assim que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.',
    teaching: 'Corinto era uma cidade portuária conhecida por excessos, e muitos cristãos dali tinham um passado pesado. Paulo não nega o passado: ele diz que não é a palavra final sobre quem a pessoa é.',
    mind: 'A neuroplasticidade mostra que o cérebro continua se reorganizando durante toda a vida. Um hábito novo, repetido, forma novas conexões. Leva semanas, e por isso a constância vale mais que a intensidade.',
    practice: 'Escolha um hábito pequeno para repetir todos os dias desta trilha: dois minutos de oração, um copo de água ao acordar, uma caminhada curta.',
    prayer: 'Jesus, obrigado porque o meu passado não me define. Faz crescer em mim o que é novo. Amém.',
    prompt: 'Que "coisa velha" eu quero deixar para trás? Que "coisa nova" eu quero começar?',
  },
  {
    n: 4, title: 'Feito com cuidado', ref: 'Salmos 139:14',
    text: 'Eu te louvarei, porque de um modo assombroso, e tão maravilhoso fui feito; maravilhosas são as tuas obras, e a minha alma o sabe muito bem.',
    teaching: 'Este salmo de Davi é um poema de louvor sobre o próprio corpo e a própria história. Para a Bíblia, o corpo e os desejos não são vergonha: são parte de uma criação boa que precisa ser conduzida com sabedoria.',
    mind: 'Cuidar do corpo (sono, movimento, alimentação) regula o humor e a impulsividade. Muitos dias difíceis começam com corpo cansado, e não com "fraqueza espiritual".',
    practice: 'Olhe-se no espelho e agradeça a Deus por uma coisa do seu corpo. Depois faça cinco minutos de movimento.',
    prayer: 'Deus, obrigado por me teres feito. Ajuda-me a cuidar do corpo e da mente que me deste. Amém.',
    prompt: 'Como tenho tratado meu corpo e minha mente? O que eu faria diferente se me tratasse como alguém amado?',
  },
  {
    n: 5, title: 'Livre para quê?', ref: 'Gálatas 5:13',
    text: 'Porque vós, irmãos, fostes chamados à liberdade; não useis então da liberdade para dar ocasião à carne, mas servi-vos uns aos outros pelo amor.',
    teaching: 'A igreja da Galácia vivia tensa entre duas ideias: obedecer regras para ser aceito ou fazer tudo o que quisesse. Paulo mostra um terceiro caminho: liberdade para amar. A liberdade cristã é um chamado, não uma licença.',
    mind: 'Metas voltadas "para algo" (servir, criar, cuidar) motivam mais que metas só de "evitar algo". Quem sabe para que está livre aguenta melhor os dias difíceis.',
    practice: 'Escolha uma pessoa e faça algo útil por ela hoje, de forma simples e sem esperar nada em troca.',
    prayer: 'Senhor, mostra-me para que me libertaste. Que a minha liberdade se transforme em amor por quem está perto. Amém.',
    prompt: 'Se eu estivesse totalmente livre, o que eu faria com o tempo e a energia que isso me daria?',
  },
  {
    n: 6, title: 'Graça, não desempenho', ref: 'Efésios 2:8',
    text: 'Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.',
    teaching: 'Paulo insiste: a salvação é presente, não prêmio. Isso não elimina o esforço, mas muda o motivo dele: a gente se esforça porque já foi aceito, e não para ser aceito.',
    mind: 'Estudos sobre autocompaixão indicam que quem se trata com gentileza depois de uma falha tende a recomeçar mais rápido do que quem se cobra com dureza.',
    practice: 'Fale consigo hoje como falaria com um amigo querido que está passando pela mesma dificuldade.',
    prayer: 'Pai, obrigado pela graça que me alcança antes de qualquer mérito. Ensina-me a receber e a viver nela. Amém.',
    prompt: 'Em que área eu ainda tento "merecer" o amor de Deus?',
  },
  {
    n: 7, title: 'Guarde o coração', ref: 'Provérbios 4:23',
    text: 'Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.',
    teaching: 'Na mentalidade hebraica, "coração" é o centro dos pensamentos, desejos e decisões, e não só dos sentimentos. Guardar o coração é cuidar do que entra nele, como uma sentinela cuida de uma cidade.',
    mind: 'Aquilo a que você se expõe com frequência (conteúdos, conversas, rotinas) molda o que o seu cérebro espera e deseja. Escolher o que entra é parte do cuidado.',
    practice: 'Revisão da semana: escreva três coisas que você aprendeu sobre si mesmo(a) nestes sete dias.',
    prayer: 'Senhor, ajuda-me a guardar o meu coração com sabedoria, e não com medo. Amém.',
    prompt: 'O que mais tem entrado no meu coração e na minha mente ultimamente? O que eu gostaria de proteger?',
  },
  {
    n: 8, title: 'O ciclo do hábito', ref: 'Romanos 12:2',
    text: 'E não sede conformados com este mundo, mas sede transformados pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.',
    teaching: 'Paulo usa a palavra grega que deu origem a "metamorfose": mudança de dentro para fora. A transformação começa na mente (entendimento), e só depois aparece no comportamento.',
    mind: 'Pesquisas sobre hábitos descrevem um ciclo: gatilho, rotina e recompensa. Para mudar, não adianta só "parar a rotina": é preciso entender o gatilho e o que a recompensa realmente busca (alívio, conexão, descanso).',
    practice: 'Escreva o seu ciclo em uma linha: "Quando [gatilho], eu [rotina], porque busco [recompensa]." Use a Jornada para se lembrar dos padrões.',
    prayer: 'Deus, renova o meu entendimento. Mostra-me o que de verdade estou buscando quando a vontade vem. Amém.',
    prompt: 'Qual é o meu ciclo mais comum? Que necessidade real está por trás dele?',
  },
  {
    n: 9, title: 'A fome que nunca termina', ref: 'Provérbios 27:20',
    text: 'O inferno e a perdição nunca se fartam; assim os olhos do homem nunca se satisfazem.',
    teaching: 'O livro de Provérbios reúne observações sobre a vida real. Este provérbio descreve algo que qualquer pessoa reconhece: o desejo promete satisfação, mas pede sempre mais. Saber disso é o início da sabedoria.',
    mind: 'A dopamina está mais ligada à expectativa e à busca do que ao prazer em si. Por isso a vontade pode ser fortíssima mesmo quando a "recompensa" é decepcionante. Ela é um sinal do cérebro, e não uma ordem.',
    practice: 'Quando a vontade vier, nomeie: "Isso é a busca pedindo mais, e não uma necessidade." Só nomear já reduz a força dela.',
    prayer: 'Senhor, sacia-me com aquilo que realmente alimenta. Ajuda-me a reconhecer quando é só a fome do desejo. Amém.',
    prompt: 'O que eu busco que, depois de conseguido, não satisfaz de verdade?',
  },
  {
    n: 10, title: 'Conheça o terreno', ref: 'Provérbios 4:26-27',
    text: 'Pondera a vereda de teus pés, e todos os teus caminhos sejam bem ordenados! Não declines nem para a direita nem para a esquerda; retira o teu pé do mal.',
    teaching: '"Ponderar a vereda" é planejar o caminho antes de andar. A sabedoria bíblica não é só reagir bem no momento difícil: é preparar o caminho para que o momento difícil seja menos provável.',
    mind: 'Gatilhos são pistas (lugar, horário, emoção, pessoas, cansaço) que o cérebro associa a uma rotina. Mapeá-los transforma "surpresa" em "previsão", e previsão permite planejamento.',
    practice: 'Liste seus três gatilhos principais. Se quiser, veja a aba Jornada para descobrir os mais frequentes e os horários de risco.',
    prayer: 'Pai, dá-me sabedoria para conhecer os meus caminhos e para prepará-los com cuidado. Amém.',
    prompt: 'Quais são os meus três gatilhos mais comuns? Em que horário e lugar eles aparecem?',
  },
  {
    n: 11, title: 'O poder da pausa', ref: 'Provérbios 16:32',
    text: 'Melhor é o que tarda em irar-se do que o poderoso, e o que controla o seu ânimo do que aquele que toma uma cidade.',
    teaching: 'Numa cultura que admirava conquistas militares, o provérbio diz que governar o próprio ânimo vale mais que conquistar uma cidade. Autocontrole é força, e não repressão.',
    mind: 'O pico da vontade costuma durar alguns minutos. A região do cérebro responsável por planejar e decidir precisa de tempo para voltar a "assumir o volante". É por isso que o timer de 10 minutos do SOS funciona.',
    practice: 'Treine a respiração 4-4-6 uma vez hoje, sem estar em crise. Quem treina com calma consegue usar melhor na hora difícil.',
    prayer: 'Senhor, ensina-me a pausar antes de agir. Que eu confie que tu estás comigo nesses minutos. Amém.',
    prompt: 'O que eu poderia fazer durante dez minutos para a onda passar?',
  },
  {
    n: 12, title: 'Observar sem obedecer', ref: '2 Coríntios 10:5',
    text: 'Destruindo os conselhos, e toda a altivez que se levanta contra o conhecimento de Deus, e levando cativo todo o entendimento à obediência de Cristo.',
    teaching: 'Paulo usa uma imagem militar: examinar cada pensamento e decidir a quem ele serve. Isso não significa não ter pensamentos ruins, e sim não segui-los automaticamente.',
    mind: 'Práticas de atenção plena mostram que observar um pensamento ("estou tendo o pensamento de que...") reduz a força dele. Pensar não é o mesmo que ser obrigado a agir.',
    practice: 'Hoje, quando um pensamento difícil vier, diga: "Estou tendo o pensamento de que..." e entregue a Deus numa frase curta.',
    prayer: 'Jesus, ajuda-me a examinar os meus pensamentos e a trazê-los a ti sem medo. Amém.',
    prompt: 'Que pensamento volta mais vezes? O que acontece quando eu só o observo?',
  },
  {
    n: 13, title: 'Descanso também é espiritual', ref: 'Salmos 127:2',
    text: 'Inútil vos será levantar de madrugada, repousar tarde, comer o pão de dores; pois assim dá ele aos seus amados o sono.',
    teaching: 'O salmo contrasta quem trabalha ansioso, sem parar, com quem confia em Deus e descansa. O sono é apresentado como presente, e não como perda de tempo.',
    mind: 'Dormir mal reduz o autocontrole, aumenta a irritabilidade e torna as vontades mais difíceis de resistir. Muitos escorregões acontecem à noite e na madrugada, quando o corpo está exausto.',
    practice: 'Defina um horário para dormir e deixe o celular carregando fora da cama esta noite.',
    prayer: 'Pai, ensina-me a descansar em ti. Que o meu sono seja confiança e não fuga. Amém.',
    prompt: 'Como é a minha noite hoje? O que posso mudar para dormir melhor?',
  },
  {
    n: 14, title: 'O ambiente ajuda', ref: 'Provérbios 22:3',
    text: 'O prudente prevê o mal, e esconde-se; mas os simples passam e acabam pagando.',
    teaching: 'Sair de cena quando se vê o perigo é chamado de prudência, e não de covardia. A Bíblia valoriza quem usa a inteligência para evitar o problema antes de enfrentá-lo.',
    mind: 'Mudar o ambiente costuma ser mais eficaz que depender só de força de vontade. Dificultar o que você quer evitar e facilitar o que você quer fazer muda o jogo.',
    practice: 'Mude uma coisa do seu ambiente hoje: o lugar do celular à noite, filtros no aparelho, a hora em que fica sozinho(a), o caminho de casa.',
    prayer: 'Senhor, dá-me prudência para ver o caminho e coragem para mudar o que precisa mudar. Amém.',
    prompt: 'Que mudança simples no meu ambiente tornaria o dia difícil menos difícil?',
  },
  {
    n: 15, title: 'Melhor dois do que um', ref: 'Eclesiastes 4:9-10',
    text: 'Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. Porque se um cair, o outro levanta o seu companheiro; mas ai do que estiver só; pois, caindo, não haverá outro que o levante.',
    teaching: 'Eclesiastes é um livro de sabedoria prática. Aqui o autor observa algo simples: quem cai sozinho tem mais dificuldade de se levantar. Companhia é proteção, e não fraqueza.',
    mind: 'O isolamento aumenta o estresse e diminui a resistência emocional. Manter conexões regulares é um dos fatores mais associados a bons resultados na mudança de hábitos.',
    practice: 'Mande uma mensagem ao seu parceiro de confiança hoje, só para contar como você está. Use a aba Parceiro.',
    prayer: 'Deus, obrigado por não me chamares a caminhar sozinho(a). Dá-me coragem para me aproximar de alguém. Amém.',
    prompt: 'Quem poderia ser o meu parceiro ou a minha parceira de caminhada? O que me impede de pedir?',
  },
  {
    n: 16, title: 'Contar a alguém seguro', ref: 'Tiago 5:16',
    text: 'Confessai as vossas culpas uns aos outros, e orai uns pelos outros, para que sareis. A oração feita por um justo pode muito em seus efeitos.',
    teaching: 'Tiago liga confissão, oração e cura. O objetivo não é humilhar, e sim tirar o peso do segredo. A comunidade cristã nasce para ser um lugar onde se pode dizer a verdade sem medo.',
    mind: 'Segredos pesam. Contar o que se vive a alguém seguro reduz a vergonha e aumenta a chance de pedir ajuda cedo. Você escolhe o quanto contar: não é preciso expor detalhes íntimos.',
    practice: 'Conte a uma pessoa segura algo real que você está enfrentando, em poucas palavras. Pode ser só "tenho tido dias difíceis e queria sua oração".',
    prayer: 'Senhor, tira de mim o medo de ser conhecido(a). Dá-me alguém seguro com quem caminhar. Amém.',
    prompt: 'O que eu carrego em segredo que me pesa? Que parte posso compartilhar sem me expor demais?',
  },
  {
    n: 17, title: 'Cair não é o fim', ref: 'Miqueias 7:8',
    text: 'Ó inimiga minha, não te alegres a meu respeito; ainda que eu tenha caído, levantar-me-ei; se morar nas trevas, o Senhor será a minha luz.',
    teaching: 'Miqueias fala em nome de um povo ferido. A frase central é um ato de fé: "ainda que eu tenha caído, levantar-me-ei". A queda é real, mas não é a última palavra.',
    mind: 'Quem encara uma recaída como informação ("o que aconteceu antes? o que posso ajustar?") aprende mais rápido do que quem a encara como veredito sobre si mesmo.',
    practice: 'Se você já escorregou, use a tela "Queda sem culpa" para analisar sem se punir. Se não, escreva um plano "se acontecer X, então eu faço Y".',
    prayer: 'Senhor, sê a minha luz quando estiver escuro. Ajuda-me a levantar sempre que cair. Amém.',
    prompt: 'O que eu diria a um amigo que acabou de cair? Posso dizer isso a mim mesmo(a)?',
  },
  {
    n: 18, title: 'A sede que só Deus sacia', ref: 'João 4:14',
    text: 'Mas aquele que beber da água que eu lhe der nunca terá sede, porque a água que eu lhe der se fará nele uma fonte de água que salte para a vida eterna.',
    teaching: 'Jesus fala com uma mulher samaritana ao lado de um poço. Ela buscava sentido e afeto em relacionamentos que não saciavam. Jesus não a humilha: ele nomeia a sede e oferece algo que sacia de dentro para fora.',
    mind: 'Muitos hábitos tentam resolver um vazio com alívio rápido. Substituir por fontes que nutrem de verdade (oração, movimento, amizade, criatividade, descanso) trata a causa e não só o sintoma.',
    practice: 'Faça uma lista de três "fontes boas" para recorrer quando sentir vazio, e deixe visível no seu quarto.',
    prayer: 'Jesus, sacia a minha sede mais profunda. Mostra-me onde estou buscando água que não sacia. Amém.',
    prompt: 'Quando sinto vazio, o que eu costumo buscar? O que realmente me faria bem?',
  },
  {
    n: 19, title: 'Amar com respeito', ref: '1 Coríntios 13:4',
    text: 'O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece.',
    teaching: 'Paulo escreve a uma igreja cheia de rivalidade e egoísmo. Ele descreve o amor como paciência, bondade e respeito. Esse é o critério para qualquer relacionamento, inclusive o namoro: o outro é pessoa, nunca objeto.',
    mind: 'Vínculos saudáveis crescem com confiança gradual. Intensidade rápida demais costuma ser mais a euforia do início que amor construído. Limites combinados cedo protegem os dois.',
    practice: 'Pense em um limite que você quer ter em relacionamentos (horários, lugares, conversas) e compartilhe com alguém de confiança.',
    prayer: 'Senhor, ensina-me a amar com paciência e respeito. Guarda os meus relacionamentos. Amém.',
    prompt: 'Que limites ajudariam a proteger a mim e a quem eu amo?',
  },
  {
    n: 20, title: 'Criados para algo', ref: 'Efésios 2:10',
    text: 'Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus preparou para que andássemos nelas.',
    teaching: '"Feitura" vem da palavra grega poiema, de onde vem "poema": obra de arte. Paulo diz que você é uma obra feita com propósito, com boas obras já preparadas. A liberdade serve a uma vida com sentido.',
    mind: 'Ter propósito está associado a mais resiliência e recuperação mais rápida depois de falhas. Quem sabe para onde vai se distrai menos pelo caminho.',
    practice: 'Pense em um jeito concreto de servir ou criar algo nesta semana (um talento, um tempo para alguém, um projeto).',
    prayer: 'Pai, mostra-me as boas obras que preparaste para mim. Quero viver com propósito. Amém.',
    prompt: 'O que eu faria com a minha vida se não precisasse mais gastar energia com a luta de sempre?',
  },
  {
    n: 21, title: 'Deus termina o que começa', ref: 'Filipenses 1:6',
    text: 'Tendo por certo isto mesmo, que aquele que em vós começou a boa obra a aperfeiçoará até ao dia de Jesus Cristo.',
    teaching: 'Paulo escreve da prisão, confiante no que Deus começou nos filipenses. A boa obra é de Deus, e ele a completa. Seu papel é continuar caminhando.',
    mind: 'A pesquisa sobre formação de hábitos mostra que o tempo varia de pessoa para pessoa, e que falhas ocasionais não anulam o progresso. O que conta é a direção ao longo de meses.',
    practice: 'Escreva uma carta curta para você mesmo(a) daqui a 90 dias: o que você espera, o que você agradece e o que quer lembrar.',
    prayer: 'Senhor, obrigado pelos 21 dias. Continua a obra que começaste em mim. Amém.',
    prompt: 'O que mudou em mim nestes 21 dias, mesmo que pouco?',
  },
]

type Compact = [string, string, string, string, string] // título, referência, texto, ensino, prática

const EXTRA_DATA: Compact[] = [
  // Fase D: Renovar a mente (22–45)
  ['Pureza começa na Palavra', 'Salmos 119:9', 'Com que purificará o jovem o seu caminho? Observando-o conforme a tua palavra.', 'O salmista, provavelmente um jovem, pergunta como viver com integridade. A resposta é simples: ouvir e guardar a Palavra, como quem segue um mapa.', 'Leia um salmo hoje antes de olhar redes sociais.'],
  ['Guardar a Palavra no coração', 'Salmos 119:11', 'Escondi a tua palavra no meu coração, para eu não pecar contra ti.', 'Guardar é memorizar e amar. Um versículo guardado está disponível justamente quando você não tem a Bíblia à mão.', 'Memorize hoje um versículo desta trilha e repita-o três vezes ao dia.'],
  ['Em que você pensa', 'Filipenses 4:8', 'Quanto ao mais, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai.', 'Paulo dá uma lista de coisas boas para ocupar a mente. Não é só "pare de pensar nisso": é "pense nisto".', 'Escolha uma dessas palavras (verdadeiro, justo, puro, amável) e procure um exemplo dela hoje.'],
  ['Paz no lugar de aflição', 'Filipenses 4:6-7', 'Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.', 'Paulo, preso, ensina como lidar com a ansiedade: oração concreta com gratidão. A paz que ele promete "guarda" o coração, como um soldado guarda uma cidade.', 'Escreva três preocupações e, ao lado de cada uma, uma coisa pela qual você é grato(a). Ore sobre as duas listas.'],
  ['Entregar o peso', '1 Pedro 5:7', 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.', 'Pedro escreve a cristãos perseguidos. "Lançar" é o gesto de jogar um fardo sobre alguém mais forte. A razão é simples: ele tem cuidado de você.', 'Hoje, cada vez que a preocupação voltar, diga: "Senhor, isto é teu."'],
  ['Um dia de cada vez', 'Mateus 6:34', 'Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.', 'No Sermão do Monte, Jesus não promete ausência de problemas, mas ensina a carregar só o peso de hoje. Isso se aplica à recuperação: você só precisa vencer hoje.', 'Pergunte-se de manhã: "O que é possível fazer bem só por hoje?"'],
  ['Falando com a própria alma', 'Salmos 42:11', 'Por que estás abatida, ó minha alma, e por que te perturbas dentro de mim? Espera em Deus, pois ainda o louvarei, o qual é a salvação da minha face, e o meu Deus.', 'O salmista conversa com a própria tristeza, sem negá-la. Ele a questiona e a orienta a esperar em Deus. Ser honesto com a dor faz parte da fé.', 'Escreva uma pergunta para a sua tristeza ou cansaço de hoje e responda como se fosse um amigo.'],
  ['O Pastor cuida', 'Salmos 23:1-2', 'O Senhor é o meu pastor, nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.', 'Pastores levavam ovelhas a lugares de descanso e água. A imagem é de cuidado: o Pastor conhece suas necessidades antes de você pedir.', 'Faça uma pausa de cinco minutos em silêncio, sem telas, imaginando-se descansando nesse pasto.'],
  ['Mente firme, paz profunda', 'Isaías 26:3', 'Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.', 'Isaías fala a um povo em tempo de ameaça. A paz não vem da ausência de problemas, mas de uma mente fixada em Deus.', 'Escolha uma frase curta de oração e repita-a quando a mente se dispersar hoje.'],
  ['Pedir para ser examinado', 'Salmos 139:23-24', 'Sonda-me, ó Deus, e conhece o meu coração; prova-me, e conhece os meus pensamentos; e vê se há em mim algum caminho mau, e guia-me pelo caminho eterno.', 'Davi convida Deus a examiná-lo. Ele não teme a verdade porque confia no amor de quem examina. É um convite à honestidade sem pânico.', 'Faça esta oração antes de dormir e anote o que vier à mente, sem se julgar.'],
  ['Olhar para cima', 'Colossenses 3:2', 'Pensai nas coisas que são de cima, e não nas que são da terra.', 'Paulo convida a mudar o foco: não negar a vida real, mas viver à luz de uma realidade maior. Onde você coloca a atenção, o coração vai atrás.', 'Hoje, fixe uma imagem ou frase que lembre o que é eterno, e olhe para ela quando a mente vagar.'],
  ['Confiar além do que se entende', 'Provérbios 3:5-6', 'Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.', 'O provérbio não despreza a inteligência: ele diz que ela não basta sozinha. Reconhecer a Deus em cada decisão é pedir bússola, e não só mapa.', 'Antes de uma decisão hoje, pare por 30 segundos e pergunte a Deus o que fazer.'],
  ['Resistir com humildade', 'Tiago 4:7', 'Sujeitai-vos, pois, a Deus; resisti ao diabo, e ele fugirá de vós.', 'Tiago liga resistir a se submeter a Deus. A força para resistir não vem de si: vem de estar ao lado de quem é mais forte.', 'Quando a vontade surgir, comece com uma oração de uma frase antes de qualquer outra ação.'],
  ['Entregar o caminho', 'Salmos 37:5', 'Entrega o teu caminho ao Senhor; confia nele, e ele o fará.', '"Entregar" no hebraico é rolar o peso sobre alguém. O salmo não diz "fique parado", mas "confie e continue".', 'Escreva em um papel o que você quer entregar a Deus hoje e guarde-o na Bíblia ou no bolso.'],
  ['Um coração limpo', 'Salmos 51:10', 'Cria em mim, ó Deus, um coração puro, e renova em mim um espírito reto.', 'Davi ora depois de uma falha grave. Ele não pede só perdão: pede renovação por dentro. É um modelo de recomeço honesto, sem fugir nem se esconder.', 'Leia o Salmo 51 completo hoje, devagar, como uma oração sua.'],
  ['A alegria vem pela manhã', 'Salmos 30:5', 'Porque a sua ira dura só um momento; no seu favor está a vida; o choro pode durar uma noite, mas a alegria vem pela manhã.', 'O salmo contrasta uma noite de choro com uma manhã de alegria. Reconhece a dor, mas lembra que ela não é permanente.', 'Se hoje foi um dia difícil, escreva uma frase de esperança para amanhã de manhã.'],
  ['Chegar com confiança', 'Hebreus 4:16', 'Cheguemos, pois, com confiança ao trono da graça, para que possamos alcançar misericórdia e achar graça, a fim de sermos ajudados em tempo oportuno.', 'O autor chama o trono de Deus de "trono da graça". A porta está aberta a quem se sente fraco. A ajuda vem em tempo oportuno, quando é preciso.', 'Quando sentir fraqueza hoje, faça uma oração rápida: "Preciso da tua ajuda agora."'],
  ['De onde vem o socorro', 'Salmos 121:1-2', 'Levantarei os meus olhos para os montes, de onde vem o meu socorro. O meu socorro vem do Senhor que fez o céu e a terra.', 'Era um cântico para peregrinos subindo a Jerusalém. Eles olhavam os montes e lembravam que o socorro vinha do Criador, e não da paisagem.', 'Saia ao ar livre por alguns minutos, olhe para o céu e agradeça pelo socorro que não vem de você.'],
  ['Pedir, buscar, bater', 'Mateus 7:7', 'Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.', 'Jesus ensina persistência na oração, e não uma fórmula mágica. Os três verbos crescem em intensidade: pedir, buscar, bater à porta.', 'Escolha um pedido concreto e faça-o em oração, todos os dias, durante esta semana.'],
  ['Perdão que limpa', '1 João 1:9', 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados, e nos purificar de toda a injustiça.', 'João liga confissão a fidelidade de Deus: o perdão não depende do seu humor, mas do caráter dele. É a base do recomeço sem culpa.', 'Se algo ainda pesa, converse com Deus sobre isso hoje, com as suas palavras, e receba o perdão em voz alta.'],
  ['Longe como o Oriente do Ocidente', 'Salmos 103:12', 'Assim como está longe o oriente do ocidente, assim afasta de nós as nossas transgressões.', 'Oriente e ocidente nunca se encontram: é uma imagem de distância total. Davi quer dizer que Deus não guarda o que você já entregou.', 'Escreva algo que você carrega do passado e risque-o, como símbolo de entrega.'],
  ['Deus faz algo novo', 'Isaías 43:18-19', 'Não vos lembreis das coisas passadas, nem considereis as antigas. Eis que faço uma coisa nova, agora sairá à luz; porventura não a percebeis? Eis que porei um caminho no deserto, e rios no ermo.', 'Isaías fala ao povo no exílio, preso à memória de fracassos. Deus promete caminho no deserto: o novo pode nascer exatamente onde parece não haver saída.', 'Hoje, pergunte: "O que Deus pode estar começando em mim?" e anote uma possibilidade.'],
  ['Esperar em silêncio', 'Salmos 62:5', 'Ó minha alma, espera somente em Deus, porque dele vem a minha esperança.', 'Davi fala consigo mesmo: "alma minha, espera". O silêncio diante de Deus é uma prática ativa de confiança.', 'Fique cinco minutos em silêncio hoje, sem pedir nada. Só estar com Deus.'],
  ['O hábito de Jesus', 'Marcos 1:35', 'E levantando-se de manhã, muito cedo, fazendo ainda escuro, saiu, e foi para um lugar deserto, e ali orava.', 'Mesmo com a agenda lotada, Jesus separava um tempo a sós com o Pai. Ele fazia da oração um hábito, e não só um recurso de emergência.', 'Escolha um horário fixo para orar, mesmo que por cinco minutos, e repita nos próximos dias.'],

  // Fase E: Relações e comunidade (46–66)
  ['Ferro com ferro', 'Provérbios 27:17', 'Como o ferro com ferro se aguça, assim o homem afia o rosto do seu amigo.', 'A imagem é de duas lâminas que se afiam ao atrito. Amizades verdadeiras desafiam e melhoram um ao outro, com respeito.', 'Pense em um amigo que te faz crescer e diga a ele o quanto você valoriza isso.'],
  ['Carregar juntos', 'Gálatas 6:2', 'Levai as cargas uns dos outros, e assim cumprireis a lei de Cristo.', 'Paulo mostra que a vida cristã é coletiva. Todo mundo carrega algo, e a comunidade existe para ajudar a levantar o peso.', 'Pergunte a alguém: "Como posso orar por você esta semana?" E ore de verdade.'],
  ['Não abandone a comunidade', 'Hebreus 10:24-25', 'E consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras, Não deixando a nossa congregação, como é costume de alguns, antes admoestando-nos uns aos outros; e tanto mais, quanto vedes que se vai aproximando aquele dia.', 'O autor percebe que algumas pessoas estavam se afastando. Ele pede o contrário: aproximar-se e animar uns aos outros.', 'Participe de um encontro da sua igreja ou grupo de jovens esta semana, mesmo que esteja sem vontade.'],
  ['Honrar uns aos outros', 'Romanos 12:10', 'Amai-vos cordialmente uns aos outros com amor fraternal, preferindo-vos em honra uns aos outros.', 'Paulo descreve um amor com carinho e respeito. Honrar o outro é tratá-lo como alguém de valor, com palavras e atitudes.', 'Faça hoje um elogio sincero e específico a alguém.'],
  ['Conselho que protege', 'Provérbios 11:14', 'Não havendo sábios conselhos, o povo cai, mas na multidão de conselhos há segurança.', 'O provérbio valoriza buscar conselho de várias pessoas sábias. Ninguém precisa resolver tudo sozinho.', 'Escolha uma pessoa mais madura na fé e marque uma conversa de 20 minutos.'],
  ['Edificar uns aos outros', '1 Tessalonicenses 5:11', 'Por isso, exortai-vos uns aos outros, e edificai-vos uns aos outros, como também o fazeis.', 'Paulo escreve a uma igreja jovem e perseguida e a anima a continuar se fortalecendo mutuamente. Edificar é construir.', 'Mande uma mensagem de incentivo para alguém que esteja passando por um momento difícil.'],
  ['O amigo na hora difícil', 'Provérbios 17:17', 'Em todo o tempo ama o amigo e para a hora da angústia nasce o irmão.', 'A amizade verdadeira se mostra na dificuldade. Ser esse amigo também faz parte do chamado.', 'Pense em quem pode precisar de você agora e entre em contato.'],
  ['Onde dois ou três se reúnem', 'Mateus 18:20', 'Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.', 'Jesus promete a presença dele mesmo em grupos pequenos. Você não precisa de uma multidão para se sentir acompanhado por Deus.', 'Convide um amigo para orar com você por cinco minutos, pessoalmente ou por mensagem.'],
  ['Revestir-se de compaixão', 'Colossenses 3:12', 'Revesti-vos, pois, como eleitos de Deus, santos e amados, de entranhas de misericórdia, de benignidade, humildade, mansidão, longanimidade.', 'Paulo usa a imagem de vestir uma roupa: compaixão, humildade e paciência são escolhas diárias, como se vestir de manhã.', 'Escolha uma dessas qualidades para "vestir" hoje e pratique-a em uma situação concreta.'],
  ['Perdoar como fomos perdoados', 'Efésios 4:32', 'Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.', 'O modelo do perdão ao outro é o perdão recebido de Deus. Perdoar não significa que o que aconteceu foi certo, mas que você escolhe não carregar o peso.', 'Pense em alguém que precisa do seu perdão e ore por essa pessoa, mesmo que ainda não consiga dizer a ela.'],
  ['Palavras que acalmam', 'Provérbios 15:1', 'A resposta branda desvia o furor, mas a palavra dura suscita a ira.', 'Palavras têm peso. Uma resposta calma pode acabar com uma briga antes de começar.', 'Hoje, em uma discussão, respire antes de responder e escolha um tom mais suave.'],
  ['Ouvir primeiro', 'Tiago 1:19', 'Portanto, meus amados irmãos, todo o homem seja pronto para ouvir, tardio para falar, tardio para se irar.', 'Tiago ensina uma regra simples para relacionamentos: ouvir mais, falar menos, demorar a se irritar.', 'Em uma conversa hoje, ouça sem interromper e só depois responda.'],
  ['Companhias que moldam', '1 Coríntios 15:33', 'Não vos enganeis: as más conversações corrompem os bons costumes.', 'Paulo adverte que o ambiente social molda o caráter. Isso não é para julgar pessoas, mas para ser honesto sobre quem nos puxa para cima ou para baixo.', 'Observe: com quem você se sente melhor depois de conversar? Passe mais tempo com essas pessoas.'],
  ['Andar com os sábios', 'Provérbios 13:20', 'O que anda com os sábios ficará sábio, mas o companheiro dos tolos será destruído.', 'O provérbio é uma lei da vida: a gente se parece com quem anda perto. Escolher a companhia é escolher o futuro.', 'Procure ao menos uma amizade nova e saudável este mês (grupo, curso, voluntariado).'],
  ['Exemplo na juventude', '1 Timóteo 4:12', 'Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, no amor, no espírito, na fé, na pureza.', 'Paulo encoraja Timóteo, jovem líder. A idade não é desculpa: a juventude pode ser uma época de exemplo, e não só de aprendizado.', 'Pense em uma atitude sua que poderia inspirar alguém mais novo.'],
  ['Lembrar do Criador na juventude', 'Eclesiastes 12:1', 'Lembra-te também do teu Criador nos dias da tua mocidade, antes que venham os maus dias, e cheguem os anos dos quais venhas a dizer: Não tenho neles contentamento;', 'O sábio de Eclesiastes aconselha: construa cedo a relação com Deus, porque as raízes feitas agora sustentam o resto da vida.', 'Agradeça hoje por algo que Deus fez em você no último ano.'],
  ['O maior mandamento', 'Mateus 22:37-39', 'Amarás o Senhor teu Deus de todo o teu coração, e de toda a tua alma, e de todo o teu pensamento. Este é o primeiro e grande mandamento. E o segundo, semelhante a este, é: Amarás o teu próximo como a ti mesmo.', 'Jesus resume toda a lei em duas frases: amar a Deus e amar ao próximo. Note o "como a ti mesmo": o amor próprio saudável é ponto de partida.', 'Faça hoje uma ação de amor a Deus, uma ao próximo e uma a você mesmo(a).'],
  ['Permanecer na videira', 'João 15:5', 'Eu sou a videira, vós as varas; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.', 'Jesus usa a imagem de uma videira para mostrar dependência. Frutos não vêm de esforço isolado, mas de permanecer ligado à fonte.', 'Reserve um tempo diário em que você apenas "permaneça": ore, leia ou fique em silêncio.'],
  ['O fruto do Espírito', 'Gálatas 5:22-23', 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança; contra estas coisas não há lei.', 'Paulo lista nove qualidades. Note que a temperança (domínio próprio) aparece como fruto, e não como esforço isolado: ela cresce com tempo e com Deus.', 'Escolha uma dessas qualidades para pedir a Deus nesta semana.'],
  ['Humildade e serviço', 'Filipenses 2:3', 'Nada façais por contenda ou por vanglória, mas por humildade; cada um considere os outros superiores a si mesmo.', 'Paulo propõe um estilo de vida oposto à comparação e à competição. Humildade não é se achar pouco, é se preocupar menos consigo e mais com os outros.', 'Hoje, ajude alguém sem que ninguém precise saber.'],
  ['Que bom é viver em união', 'Salmos 133:1', 'Oh! quão bom e quão suave é que os irmãos vivam em união.', 'Este cântico de peregrinos celebra a alegria da convivência. A união é descrita como algo bom e suave, como óleo precioso.', 'Faça um gesto de reconciliação ou aproximação com alguém com quem a relação está distante.'],

  // Fase F: Perseverança e propósito (67–90)
  ['Não desanimar de fazer o bem', 'Gálatas 6:9', 'E não nos cansemos de fazer bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.', 'Paulo usa a imagem da colheita: há um tempo entre plantar e colher. O cansaço é real, mas a colheita também é.', 'Lembre de um pequeno bem que você plantou e que já deu fruto. Agradeça.'],
  ['Correr com paciência', 'Hebreus 12:1', 'Portanto nós também, pois que estamos rodeados de uma tão grande nuvem de testemunhas, deixemos todo o embaraço, e o pecado que tão de perto nos rodeia, e corramos com paciência a carreira que nos está proposta,', 'O autor compara a vida de fé a uma corrida de resistência. Ele convida a largar o que atrapalha e a seguir com paciência, sem pressa e sem desistir.', 'Identifique um "peso" que você pode deixar de carregar nesta semana (uma rotina, um hábito, um pensamento).'],
  ['Olhar para Jesus', 'Hebreus 12:2', 'Olhando para Jesus, autor e consumador da fé, o qual, pelo gozo que lhe estava proposto, suportou a cruz, desprezando a afronta, e assentou-se à destra do trono de Deus.', 'O segredo da perseverança, segundo o autor, é onde você olha. Jesus não só inicia: ele também completa a fé.', 'Quando sentir cansaço hoje, volte o olhar para Jesus em uma oração de uma frase.'],
  ['Forças renovadas', 'Isaías 40:31', 'Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.', 'O profeta anima um povo exausto. A promessa não é só voar: é também andar sem desfalecer, ou seja, constância nos dias comuns.', 'Seja grato por um momento em que você teve forças que não sabia ter.'],
  ['A dor que forma', 'Romanos 5:3-4', 'E não somente isto, mas também nos gloriamos nas tribulações, sabendo que a tribulação produz a paciência, e a paciência a experiência, e a experiência a esperança.', 'Paulo descreve uma cadeia: sofrimento, paciência, caráter e esperança. Ele não diz que a dor é boa, mas que Deus a usa para formar.', 'Pense em uma dificuldade que te ensinou algo. Agradeça por esse aprendizado.'],
  ['Provas que amadurecem', 'Tiago 1:2-3', 'Meus irmãos, tende grande gozo quando cairdes em várias tentações; Sabendo que a prova da vossa fé opera a paciência.', 'Tiago não pede alegria pela dor, mas alegria pelo que ela produz: paciência. Provas revelam e fortalecem a fé.', 'Diante de uma dificuldade desta semana, pergunte: "O que isto pode estar formando em mim?"'],
  ['Coroa da vida', 'Tiago 1:12', 'Bem-aventurado o homem que sofre a tentação; porque, quando for provado, receberá a coroa da vida, a qual o Senhor tem prometido aos que o amam.', 'Resistir à tentação é descrito como sinal de bem-aventurança. Não é ausência de luta: é o prêmio de quem perseverou.', 'Escreva uma vitória recente, por menor que seja, e agradeça.'],
  ['Deus usa tudo para o bem', 'Romanos 8:28', 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.', 'Paulo não diz que tudo é bom, mas que Deus pode trabalhar em tudo para um bem maior. Inclusive nas falhas e recomeços.', 'Pense em algo difícil do passado que Deus transformou em algo bom. Agradeça.'],
  ['Mais que vencedores', 'Romanos 8:37', 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.', 'Paulo termina o capítulo 8 declarando que nada nos separa do amor de Deus. A vitória não é por força própria, mas por quem nos amou.', 'Diga em voz alta: "Sou mais do que vencedor(a), por aquele que me amou."'],
  ['Pensamentos de paz', 'Jeremias 29:11', 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.', 'Jeremias fala a exilados que se sentiam esquecidos. Deus afirma que tem planos de paz mesmo em tempo de espera longa.', 'Escreva uma esperança para o seu futuro e entregue a Deus em oração.'],
  ['Árvore plantada', 'Salmos 1:3', 'Pois será como a árvore plantada junto a ribeiros de águas, a qual dá o seu fruto no seu tempo; as suas folhas não cairão, e tudo quanto fizer prosperará.', 'A árvore plantada junto às águas é constante e estável. Fruto vem "na estação própria", ou seja, no tempo certo, e não de imediato.', 'Escolha um hábito de raiz (leitura, oração, descanso) e proteja-o esta semana.'],
  ['Confiar os planos a Deus', 'Provérbios 16:3', 'Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.', 'Entregar planos a Deus traz firmeza aos pensamentos. Não é passividade: é trabalhar sem ansiedade.', 'Escreva um plano para esta semana e ore sobre ele antes de começar.'],
  ['Fazer tudo de coração', 'Colossenses 3:23', 'E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens.', 'Paulo dá dignidade ao trabalho comum: estudar, lavar louça, trabalhar. Tudo pode ser feito como adoração.', 'Escolha uma tarefa comum hoje e faça-a com o máximo de atenção, como oferta.'],
  ['Brilhar sem se exibir', 'Mateus 5:16', 'Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras, e glorifiquem a vosso Pai, que está nos céus.', 'Jesus quer que a vida de seus seguidores seja visível e boa, sem arrogância. O foco é que o Pai seja glorificado.', 'Faça uma boa ação discreta hoje.'],
  ['Primeiro o Reino', 'Mateus 6:33', 'Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.', 'Jesus fala de prioridades: quando Deus ocupa o lugar certo, o resto se alinha. Não é uma troca, é uma ordem.', 'Revise sua semana: o que está em primeiro lugar? O que precisa mudar de lugar?'],
  ['Contar os dias', 'Salmos 90:12', 'Ensina-nos a contar os nossos dias, de tal maneira que alcancemos corações sábios.', 'Moisés ora pedindo consciência da brevidade da vida. Contar os dias aqui não é pressão, mas sabedoria: viver com atenção.', 'Anote três coisas que você quer ter vivido daqui a um ano.'],
  ['Fortalecer-se no Senhor', 'Efésios 6:10', 'No demais, irmãos meus, fortalecei-vos no Senhor e na força do seu poder.', 'Paulo termina sua carta convidando a buscar força em Deus, e não em si. A força é recebida, e não produzida.', 'Comece o dia pedindo: "Senhor, dá-me força para hoje."'],
  ['Espírito de fortaleza', '2 Timóteo 1:7', 'Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.', 'Paulo encoraja Timóteo, que se sentia inseguro. Deus dá fortaleza, amor e domínio próprio, o contrário do medo paralisante.', 'Quando o medo aparecer hoje, repita: "Deus me deu fortaleza, amor e domínio próprio."'],
  ['Este é o dia', 'Salmos 118:24', 'Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.', 'Cantado em festas de Israel, o salmo convida a receber cada dia como presente. Alegria é escolha e prática.', 'Comece o dia agradecendo por três coisas, em voz alta.'],
  ['Entrar com gratidão', 'Salmos 100:4', 'Entrai pelas portas dele com gratidão, e em seus átrios com louvor; louvai-o, e bendizei o seu nome.', 'O salmo mostra que a gratidão é a porta de entrada para a presença de Deus. Quem agradece enxerga mais.', 'Escreva dez coisas pelas quais você é grato(a), por menores que sejam.'],
  ['Alegria, oração e gratidão', '1 Tessalonicenses 5:16-18', 'Regozijai-vos sempre. Orai sem cessar. Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.', 'Três mandamentos curtos formam um estilo de vida. "Orar sem cessar" é manter uma conversa contínua com Deus, e não ficar de joelhos o tempo todo.', 'Ao longo do dia, faça orações curtas de uma frase: ao acordar, no trajeto, antes de dormir.'],
  ['A bênção', 'Números 6:24-26', 'O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti, e tenha misericórdia de ti; o Senhor sobre ti levante o seu rosto, e te dê a paz.', 'Esta bênção era dita sobre o povo de Israel. Hoje, ela é uma oração de cuidado: guarda, graça e paz.', 'Pronuncie esta bênção sobre você e sobre alguém que ama.'],
  ['Guardado de tropeçar', 'Judas 24', 'Ora, àquele que é poderoso para vos guardar de tropeçar, e apresentar-vos irrepreensíveis, com alegria, perante a sua glória,', 'Judas termina sua carta com uma doxologia: Deus é quem guarda de tropeçar e apresenta com alegria. A confiança final está nele.', 'Agradeça a Deus por cada vez que ele te guardou, mesmo sem você perceber.'],
  ['Tudo novo', 'Apocalipse 21:5', 'E o que estava assentado sobre o trono disse: Eis que faço novas todas as coisas.', 'No fim da Bíblia, o trono declara uma promessa: novidade. A história termina com restauração, e a sua também.', 'Escreva uma carta de gratidão a Deus pelos 90 dias e planeje o próximo passo da sua caminhada.'],
]

const EXTRA: Lesson[] = EXTRA_DATA.map(([title, ref, text, teaching, practice], i) => ({
  n: 22 + i,
  title,
  ref,
  text,
  teaching,
  practice,
}))

export const LESSONS: Lesson[] = [...CORE, ...EXTRA]

export const phaseOf = (n: number): Phase => PHASES.find((p) => n >= p.from && n <= p.to) ?? PHASES[0]

export interface PhaseInfo { intro: string; focus: string; question: string }
export const PHASE_INFO: Record<string, PhaseInfo> = {
  a: {
    intro: 'Antes de qualquer regra vem a pergunta de quem você é. Nesta fase, a vergonha dá lugar à identidade de filho(a) amado(a), e você aprende a cuidar de si como alguém que vale a pena.',
    focus: 'Frases curtas de identidade, gratidão e cuidado com o corpo.',
    question: 'O que mudou, mesmo que pouco, na forma como você enxerga a si mesmo(a)?',
  },
  b: {
    intro: 'Aqui você entende como a vontade funciona: o gatilho, a busca, a pausa. Entender tira o mistério, e o mistério é o que dá força ao hábito.',
    focus: 'Nomear gatilhos, usar a pausa e mudar o ambiente.',
    question: 'Qual gatilho você passou a reconhecer melhor, e o que você faz diferente com ele?',
  },
  c: {
    intro: 'Ninguém muda sozinho. Esta fase trata de contar a alguém, de recomeçar depois de cair e de ter um propósito maior que a luta.',
    focus: 'Falar com o parceiro, recomeçar sem culpa e servir.',
    question: 'Quem caminha com você agora, e o que você quer dizer a essa pessoa?',
  },
  d: {
    intro: 'A mente se renova aos poucos. Aqui você guarda a Palavra, observa os pensamentos e aprende a descansar em Deus no meio da ansiedade.',
    focus: 'Memorizar versículos, orar no ritmo da respiração, entregar preocupações.',
    question: 'Que pensamento repetido você já consegue observar sem obedecer?',
  },
  e: {
    intro: 'Os relacionamentos moldam quem você é. Esta fase fala de amizade, perdão, limites e comunidade.',
    focus: 'Conversar sobre limites, perdoar, escolher boas companhias.',
    question: 'Que relação precisa de uma conversa, de um limite ou de um perdão?',
  },
  f: {
    intro: 'Perseverar é continuar sem pressa. Esta fase olha a caminhada longa: esperança, propósito e gratidão.',
    focus: 'Constância nos dias comuns, gratidão e propósito.',
    question: 'O que você agradece e o que quer continuar nos próximos meses?',
  },
}

export const WHEN_OPTIONS = ['Agora', 'Hoje à tarde', 'Hoje à noite', 'Amanhã cedo']
