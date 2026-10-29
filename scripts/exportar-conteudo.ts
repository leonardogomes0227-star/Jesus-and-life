// Gera docs/conteudo-para-revisao.md com todo o texto do app, para revisão pastoral e psicológica.
import { writeFileSync } from 'node:fs'
import { VERSES, PRAYERS, PROMPTS, MILESTONES, MOOD_REPLIES, SOS_ACTIONS, PARTNER_MESSAGES, TRIGGERS } from '../src/lib/content'
import { LESSONS, PHASES, PHASE_INFO } from '../src/lib/trail'
import { TOPICS } from '../src/lib/topics'
import { NEEDS } from '../src/lib/needs'
import { ABOUT } from '../src/lib/bookInfo'
import { BOOKS } from '../src/lib/books'
import { ARRIVE, PRAYER_BY_NEED, FEELINGS, NIGHT_PASSAGES, BENEDICTION, NIGHT_BENEDICTION } from '../src/lib/momento'
import { RULE_SUGGESTIONS, ENV_DEFAULTS } from '../src/lib/plano'
import { AUDIO_SESSIONS } from '../src/lib/audio'

const out: string[] = []
const h = (n: number, t: string) => out.push(`\n${'#'.repeat(n)} ${t}\n`)
const item = (t: string) => out.push(`- [ ] ${t}`)
const p = (t: string) => out.push(t)

p('# Livre: conteúdo para revisão pastoral e psicológica')
p('')
p('Este documento reúne **todo o texto escrito para o app**, para que um pastor (ou líder de jovens) e um psicólogo cristão possam ler, marcar e sugerir mudanças. O texto bíblico é conferido por script contra a ACF e não precisa de revisão de transcrição (ver `npm run verificar:versiculos`).')
p('')
h(2, 'Como revisar')
p('Marque cada item com **OK**, **ajustar** (escreva a sugestão ao lado) ou **retirar**. Critérios:')
for (const c of [
  '**Doutrina:** fiel à Escritura e à linha da igreja? Evita afirmar como certeza o que é debatido?',
  '**Culpa e vergonha:** o tom acolhe e não condena, sem relativizar o que a Bíblia chama de pecado?',
  '**Segurança:** respostas a risco (se machucar, desesperança) encaminham ao CVV 188 e a ajuda real?',
  '**Psicologia:** as explicações sobre hábito, dopamina, gatilho, pausa e vínculo são honestas, sem prometer cura nem prazo?',
  '**Contexto bíblico:** as explicações de autor, destinatário e época estão corretas?',
  '**Público jovem e menores:** linguagem adequada para 16 a 25 anos? Algo inadequado para menores de 18?',
  '**Termos:** o app evita nomear diretamente certos temas e usa “hábitos” e “liberdade”. Isso está adequado?',
]) item(c)

h(2, '1. Devocional do dia (14 versículos em rotação)')
VERSES.forEach((v, i) => { h(3, `${i + 1}. ${v.ref}`); p(`> ${v.text}`); p(`**Reflexão:** ${v.reflection}`); p(`**Prática:** ${v.practice}`); p(`**Oração:** ${PRAYERS[i]}`); p(`**Pergunta:** ${PROMPTS[i]}`); item('OK / ajustar / retirar') })

h(2, '2. Trilha de liberdade (90 lições)')
for (const ph of PHASES) {
  const info = PHASE_INFO[ph.id]
  h(3, `Fase: ${ph.name} (dias ${ph.from} a ${ph.to})`)
  p(`**Apresentação:** ${info.intro}`); p(`**O que se pratica:** ${info.focus}`); p(`**Pergunta de fechamento:** ${info.question}`); item('OK / ajustar / retirar')
  for (const l of LESSONS.filter((x) => x.n >= ph.from && x.n <= ph.to)) {
    h(4, `Dia ${l.n}: ${l.title} (${l.ref})`)
    p(`> ${l.text}`); p(`**Entenda o texto:** ${l.teaching}`)
    if (l.mind) p(`**Na sua mente:** ${l.mind}`)
    p(`**Prática:** ${l.practice}`)
    if (l.prayer) p(`**Oração:** ${l.prayer}`)
    if (l.prompt) p(`**Pergunta:** ${l.prompt}`)
    item('OK / ajustar / retirar')
  }
}

h(2, '3. Aprender (leituras temáticas)')
for (const t of TOPICS) { h(3, t.title); for (const a of t.articles) { h(4, a.title); p(`_${a.summary}_`); a.body.forEach((b) => p(b)); p(`> ${a.text} (${a.ref})`); p(`**Para praticar:** ${a.action}`); item('OK / ajustar / retirar') } }

h(2, '4. Momento com Deus (manhã)')
h(3, 'Frases de acolhida por sentimento'); FEELINGS.forEach((f) => { p(`- **${f.label}:** ${ARRIVE[f.id]}`) }); item('OK / ajustar / retirar')
h(3, 'Orações escritas por necessidade'); Object.entries(PRAYER_BY_NEED).forEach(([k, v]) => p(`- **${k}:** ${v}`)); item('OK / ajustar / retirar')
h(3, 'Bênção final'); p(`> ${BENEDICTION.text} (${BENEDICTION.ref})`)
h(3, 'Passagens por necessidade e o motivo de ler')
for (const n of NEEDS) { h(4, n.title); n.passages.forEach((x) => p(`- **${x.ref}:** ${x.why}`)); item('OK / ajustar / retirar') }

h(2, '5. Noite')
NIGHT_PASSAGES.forEach((x) => p(`- **${x.ref}:** ${x.why}`)); p(`> ${NIGHT_BENEDICTION.text} (${NIGHT_BENEDICTION.ref})`); item('OK / ajustar / retirar')

h(2, '6. Meu plano (regras “se… então…”)')
for (const [t, list] of Object.entries(RULE_SUGGESTIONS)) { h(4, t); list.forEach((s) => p(`- Se ${s.when.charAt(0).toLowerCase()}${s.when.slice(1)}, então ${s.then.charAt(0).toLowerCase()}${s.then.slice(1)}`)); item('OK / ajustar / retirar') }
h(3, 'Mudanças de ambiente'); ENV_DEFAULTS.forEach((e) => p(`- ${e}`)); item('OK / ajustar / retirar')
h(3, 'Gatilhos oferecidos'); p(TRIGGERS.join(', '))

h(2, '7. Áudios guiados (meditação e descanso)')
for (const a of AUDIO_SESSIONS) { h(3, `${a.title} (${a.minutes} min)`); p(`_${a.blurb}_`); a.lines.forEach((l) => p(`- ${l.t}`)); item('OK / ajustar / retirar') }

h(2, '8. Respostas, conquistas e mensagens')
h(3, 'Resposta ao humor'); Object.entries(MOOD_REPLIES).forEach(([k, v]) => p(`- **Humor ${k}:** ${v}`)); item('OK / ajustar / retirar')
h(3, 'Conquistas'); MILESTONES.forEach((m) => p(`- **${m.days} dias, ${m.title}:** ${m.text}`)); item('OK / ajustar / retirar')
h(3, 'Ações do SOS'); SOS_ACTIONS.forEach((a) => p(`- **${a.title}:** ${a.hint}`)); item('OK / ajustar / retirar')
h(3, 'Mensagens para o parceiro'); PARTNER_MESSAGES.forEach((m) => p(`- **${m.title}:** ${m.text}`)); item('OK / ajustar / retirar')

h(2, '9. Apresentação dos livros da Bíblia')
BOOKS.forEach((b) => p(`- **${b.name}:** ${ABOUT[b.id]}`)); item('OK / ajustar / retirar')

h(2, '10. Textos escritos diretamente nas telas (revisar no código)')
p('Estes textos estão dentro dos componentes. Peça ao desenvolvedor para colar aqui o texto atual, ou revise o app navegando:')
for (const f of [
  '`src/screens/Sos.tsx`: passos do SOS, finais “A onda passou” e “Não segurei desta vez”.',
  '`src/screens/Pausa.tsx` e `src/screens/Noite.tsx`: textos da pausa e da noite.',
  '`src/screens/Partner.tsx` e `src/screens/Semana.tsx`: critérios para escolher parceiro, convite, roteiro do encontro e perguntas.',
  '`src/screens/Sobre.tsx`: avisos de segurança e privacidade.',
  '`src/screens/Slip.tsx`: tela “Queda sem culpa”.',
]) item(f)

writeFileSync('docs/conteudo-para-revisao.md', out.join('\n') + '\n')
console.log(`docs/conteudo-para-revisao.md gerado (${out.length} linhas)`)
