export interface Line { t: string; pause: number }
export interface AudioSessionData {
  id: string
  title: string
  minutes: number
  blurb: string
  lines: Line[]
}

export const AUDIO_SESSIONS: AudioSessionData[] = [
  {
    id: 'gatilho',
    title: 'Quebrar o ciclo do gatilho',
    minutes: 3,
    blurb: 'Para o pico da tentação ou da ansiedade. Interrompe o piloto automático.',
    lines: [
      { t: 'Pare por um momento. O que você sente agora tem nome: é uma onda.', pause: 3 },
      { t: 'Ela sobe, chega ao topo e desce. Você não precisa lutar contra ela. Só precisa atravessar.', pause: 4 },
      { t: 'Sinta os seus pés no chão. Sinta o peso do corpo, apoiado.', pause: 5 },
      { t: 'Inspire devagar pelo nariz, contando até quatro.', pause: 4 },
      { t: 'Segure o ar por quatro.', pause: 4 },
      { t: 'Solte pela boca, bem devagar, contando até seis.', pause: 6 },
      { t: 'Mais uma vez. Inspire.', pause: 4 },
      { t: 'Segure.', pause: 4 },
      { t: 'E solte, devagar.', pause: 6 },
      { t: 'Agora, pergunte a si mesmo: o que eu estou sentindo de verdade? Cansaço? Solidão? Tédio? Ansiedade?', pause: 8 },
      { t: 'Dê um nome a isso. Só nomear já diminui a força.', pause: 5 },
      { t: 'Pergunte: o que eu realmente preciso agora? Descanso? Companhia? Ar fresco? Uma conversa?', pause: 8 },
      { t: 'Qual é a menor ação que eu posso fazer agora? Levantar. Beber água. Sair deste lugar.', pause: 6 },
      { t: 'Senhor, estou aqui. Estou cansado, mas não estou sozinho. Dá-me força para os próximos minutos.', pause: 6 },
      { t: 'Quando estiver pronto, faça essa ação. Você já passou por ondas antes. Esta também vai passar.', pause: 4 },
    ],
  },
  {
    id: 'ansiedade',
    title: 'Acalmar a ansiedade',
    minutes: 4,
    blurb: 'Para quando a mente acelera e o corpo não desliga.',
    lines: [
      { t: 'Encontre uma posição confortável. Pode fechar os olhos, se quiser.', pause: 4 },
      { t: 'A ansiedade é um alarme do corpo. Ela quer te proteger. Agora vamos mostrar a ela que está seguro.', pause: 5 },
      { t: 'Inspire pelo nariz, contando até quatro.', pause: 4 },
      { t: 'Solte pela boca, contando até seis. A expiração longa avisa o corpo que ele pode descansar.', pause: 7 },
      { t: 'Mais uma vez, devagar.', pause: 10 },
      { t: 'Perceba cinco coisas que você consegue ver ao redor.', pause: 8 },
      { t: 'Quatro coisas que você consegue tocar.', pause: 7 },
      { t: 'Três sons que você consegue ouvir.', pause: 7 },
      { t: 'Agora diga, em silêncio, aquilo que te preocupa. Sem se julgar.', pause: 8 },
      { t: 'E entregue a Deus, como quem coloca um peso no chão. Ele tem cuidado de você.', pause: 8 },
      { t: 'A paz de Deus, que excede todo o entendimento, guardará o seu coração.', pause: 8 },
      { t: 'Respire mais uma vez. Você está aqui. Você está seguro neste momento.', pause: 6 },
    ],
  },
  {
    id: 'dormir',
    title: 'Descansar antes de dormir',
    minutes: 6,
    blurb: 'Desacelere a mente e entregue o dia a Deus.',
    lines: [
      { t: 'O dia terminou. Você não precisa resolver mais nada agora.', pause: 5 },
      { t: 'Deite-se em uma posição confortável. Deixe o celular de lado.', pause: 6 },
      { t: 'Inspire profundamente e solte devagar. Deixe os ombros caírem.', pause: 8 },
      { t: 'Relaxe a testa. Relaxe os olhos. Relaxe o maxilar.', pause: 8 },
      { t: 'Relaxe o pescoço e os ombros. Sinta o peso do corpo na cama.', pause: 9 },
      { t: 'Relaxe os braços, as mãos, os dedos.', pause: 8 },
      { t: 'Relaxe o peito. Relaxe a barriga. Relaxe as pernas e os pés.', pause: 10 },
      { t: 'Lembre de uma coisa boa que aconteceu hoje, mesmo que pequena. Agradeça.', pause: 10 },
      { t: 'Lembre de algo que não saiu como você queria. Você pode entregar isso a Deus agora.', pause: 10 },
      { t: 'Senhor, obrigado pelo dia. Perdoa o que errei. Cuida de quem eu amo.', pause: 10 },
      { t: 'O Senhor é o meu pastor, nada me faltará. Deitar-me faz em verdes pastos.', pause: 10 },
      { t: 'Deus dá o sono aos seus amados. Você pode descansar.', pause: 12 },
      { t: 'Continue respirando devagar. Boa noite.', pause: 6 },
    ],
  },
  {
    id: 'entregar',
    title: 'Entregar o dia a Deus',
    minutes: 5,
    blurb: 'Uma pausa curta para encerrar o dia com gratidão e paz.',
    lines: [
      { t: 'Pare por alguns minutos. Respire fundo.', pause: 5 },
      { t: 'Pense no seu dia, do começo ao fim, sem pressa.', pause: 8 },
      { t: 'Qual foi o melhor momento de hoje? Agradeça por ele.', pause: 10 },
      { t: 'Qual foi o momento mais difícil? Diga a Deus como foi.', pause: 10 },
      { t: 'Há alguém que você precisa perdoar? Ou de quem precisa de perdão? Entregue isso.', pause: 10 },
      { t: 'O que ficou pendente? Escreva em um papel se quiser, e deixe de lado até amanhã.', pause: 8 },
      { t: 'Senhor, este dia é teu. O que eu fiz bem, agradeço. O que eu não consegui, entrego.', pause: 8 },
      { t: 'As misericórdias do Senhor são novas cada manhã. Amanhã é um novo começo.', pause: 8 },
      { t: 'Descanse. Você fez o que podia.', pause: 5 },
    ],
  },
  {
    id: 'manha',
    title: 'Acordar com clareza',
    minutes: 3,
    blurb: 'Comece o dia com o corpo calmo e a mente no lugar.',
    lines: [
      { t: 'Bom dia. Antes de pegar o celular, respire.', pause: 4 },
      { t: 'Inspire pelo nariz, expanda a barriga. Solte devagar.', pause: 7 },
      { t: 'Mais uma vez. Inspire. E solte.', pause: 8 },
      { t: 'Hoje é um dia novo, com misericórdia nova.', pause: 5 },
      { t: 'Diga em voz baixa: eu sou amado por Deus. Hoje eu dou um passo de cada vez.', pause: 7 },
      { t: 'Qual é a única coisa mais importante para hoje? Escolha uma.', pause: 8 },
      { t: 'Qual momento do dia costuma ser mais difícil? Decida agora o que você vai fazer nele.', pause: 8 },
      { t: 'Senhor, guia os meus passos hoje. Amém.', pause: 5 },
      { t: 'Levante-se devagar. Beba um copo de água. Bom dia.', pause: 4 },
    ],
  },
]

/** Som ambiente gerado no próprio aparelho (ruído suave + tom grave). Retorna uma função de parada. */
export const startAmbient = (volume = 0.14): (() => void) | null => {
  const AC = (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as
    | typeof AudioContext
    | undefined
  if (!AC) return null
  const ctx = new AC()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const len = ctx.sampleRate * 4
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buf
  noise.loop = true
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 500
  noise.connect(lp).connect(master)
  noise.start()

  const oscs = [110, 164.81].map((f, i) => {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = 0.05
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.08 + i * 0.03
    const lg = ctx.createGain()
    lg.gain.value = 0.03
    lfo.connect(lg).connect(g.gain)
    o.connect(g).connect(master)
    o.start()
    lfo.start()
    return [o, lfo] as const
  })

  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 3)
  return () => {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
    setTimeout(() => {
      try {
        noise.stop()
        oscs.forEach(([o, l]) => { o.stop(); l.stop() })
        void ctx.close()
      } catch {
        /* já encerrado */
      }
    }, 1200)
  }
}
