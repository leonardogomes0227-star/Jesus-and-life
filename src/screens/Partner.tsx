import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PARTNER_MESSAGES } from '../lib/content'
import { fmtDate } from '../lib/dates'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { useStore } from '../lib/store'

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const TIMES = ['Manhã', 'Tarde', 'Noite']

const FALL_MESSAGE =
  'Quero combinar uma coisa com você. Se eu te contar que caí ou que estou mal, o que mais me ajuda é: 1) você me ouvir sem julgar; 2) perguntar "como posso ajudar agora?"; 3) orar comigo e me lembrar do meu plano. Pode ser?'

export default function Partner() {
  const { state, update } = useStore()
  const p = state.partner
  const ok = !!normalizePhone(p.phone)
  const set = (patch: Partial<typeof p>) => update((s) => ({ ...s, partner: { ...s.partner, ...patch } }))
  const [editing, setEditing] = useState(false)
  const lastMeeting = state.meetings[state.meetings.length - 1]
  const daysSinceMeeting = lastMeeting ? Math.floor((Date.now() - +new Date(lastMeeting.at)) / 86400000) : null
  const invite = `Oi, ${p.name || 'tudo bem'}! Estou criando o hábito de ter um momento diário com Deus e de cuidar de alguns hábitos que quero mudar. Pensei em você porque confio em você. Aceitaria ser meu parceiro de caminhada? Seria uma conversa de uns 10 minutos por semana, em que cada um conta como foi a semana e a gente ora um pelo outro. Sem julgamento, só apoio.`

  /* ---------- Começo: escolher e convidar ---------- */
  // A configuração só termina quando a pessoa confirma (agreed deixa de ser indefinido).
  if (!ok || editing || p.agreed === undefined) {
    return (
      <main className="space-y-8 pb-8">
        <header>
          <h1 className="font-display text-4xl font-semibold leading-tight">Quem caminha com você?</h1>
          <p className="mt-2 text-lg text-muted">Contar o que você vive a uma pessoa de confiança é um dos maiores apoios para mudar um hábito. Aqui você escolhe essa pessoa, faz o convite e combina o encontro.</p>
        </header>

        <section className="rounded-3xl bg-sand p-6 text-sand-ink">
          <h2 className="font-display text-2xl font-semibold">Como escolher</h2>
          <ul className="mt-3 space-y-2 leading-snug">
            <li><strong>Alguém que guarde sigilo</strong> e que não vá te julgar.</li>
            <li><strong>De preferência do mesmo gênero</strong> e igual ou mais maduro na fé. Não escolha namorado(a) nem pessoa por quem você sente atração.</li>
            <li><strong>Alguém que consiga 10 minutos por semana.</strong></li>
            <li>Se você tem menos de 18 anos, escolha um adulto da sua família ou da sua igreja.</li>
          </ul>
        </section>

        <section className="card space-y-4">
          <div>
            <label className="label" htmlFor="pn">Nome</label>
            <input id="pn" className="field" value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ex.: João" maxLength={40} />
          </div>
          <div>
            <label className="label" htmlFor="pt">WhatsApp (com DDD)</label>
            <input id="pt" className="field" inputMode="tel" value={p.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="(11) 91234-5678" />
            {p.phone && !ok && <p className="mt-2 text-sm text-sun">Confira o número: use DDD + telefone.</p>}
          </div>
        </section>

        {ok && (
          <section className="space-y-4 pop">
            <h2 className="font-display text-2xl font-semibold">Faça o convite</h2>
            <p className="rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed">“{invite}”</p>
            <a className="btn-primary w-full" href={waLink(p.phone, invite)} target="_blank" rel="noopener noreferrer">Convidar pelo WhatsApp</a>
            <p className="text-xs text-muted">A mensagem abre no WhatsApp para você revisar. Nada é enviado sozinho.</p>
            <button className="btn-ghost w-full" onClick={() => { set({ agreed: p.agreed ?? false }); setEditing(false) }}>Já conversamos, continuar</button>
          </section>
        )}
      </main>
    )
  }

  /* ---------- Meio e fim: o parceiro e o ritual semanal ---------- */
  return (
    <main className="space-y-8 pb-8">
      <header>
        <h1 className="font-display text-4xl font-semibold leading-tight">Parceiro</h1>
        <p className="mt-1 text-muted">{p.name} · {p.agreed ? 'aceitou caminhar com você' : 'convite enviado'}</p>
      </header>

      {!p.agreed && (
        <section className="rounded-3xl border border-sun/50 p-5">
          <p className="font-semibold">{p.name} já aceitou?</p>
          <p className="mt-1 text-sm text-muted">Quando a pessoa responder que sim, marque aqui e combine o dia do encontro.</p>
          <button className="btn-ghost mt-3 w-full" onClick={() => set({ agreed: true })}>Sim, aceitou</button>
        </section>
      )}

      <section className="rounded-3xl bg-night p-6 text-night-ink">
        <p className="text-sm font-semibold opacity-70">Encontro semanal</p>
        <h2 className="mt-1 font-display text-3xl font-semibold leading-tight">{daysSinceMeeting === null ? 'Faça o primeiro encontro.' : daysSinceMeeting >= 7 ? `Faz ${daysSinceMeeting} dias do último encontro.` : 'Encontro da semana feito.'}</h2>
        <p className="mt-2 opacity-85">Dez minutos: você se prepara, conversa com {p.name} e combina o que vai fazer na semana seguinte.{lastMeeting ? ` Último encontro: ${fmtDate(lastMeeting.at)}.` : ''}</p>
        <Link to="/parceiro/semana" className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full bg-night-ink px-6 font-semibold text-night">{daysSinceMeeting !== null && daysSinceMeeting < 7 ? 'Fazer outro encontro' : 'Começar o encontro'}</Link>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">Nosso combinado</h2>
        <p className="text-sm text-muted">Dia e período em que vocês costumam se falar.</p>
        <div className="flex flex-wrap gap-2">{DAYS.map((d, i) => <button key={d} aria-pressed={p.day === i} className="chip !min-h-[44px] text-sm" onClick={() => set({ day: p.day === i ? undefined : i })}>{d}</button>)}</div>
        <div className="flex flex-wrap gap-2">{TIMES.map((t) => <button key={t} aria-pressed={p.time === t} className="chip !min-h-[44px] text-sm" onClick={() => set({ time: p.time === t ? undefined : t })}>{t}</button>)}</div>
        {p.day !== undefined && <p className="font-semibold">Todo(a) {DAYS[p.day].toLowerCase()}{p.time ? `, de ${p.time.toLowerCase()}` : ''}.</p>}
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-2xl font-semibold">Se eu cair, o que me ajuda</h2>
        <p className="text-muted">Combine antes, com a cabeça tranquila. Na hora, fica mais fácil pedir ajuda.</p>
        <p className="rounded-2xl bg-bg p-4 text-[15px] leading-relaxed">{FALL_MESSAGE}</p>
        <a className="btn-ghost w-full" href={waLink(p.phone, FALL_MESSAGE)} target="_blank" rel="noopener noreferrer">Enviar ao {p.name}</a>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">Mensagens rápidas</h2>
        <p className="text-sm text-muted">Para os dias comuns. O WhatsApp abre com o texto pronto, e você decide se envia.</p>
        {PARTNER_MESSAGES.map((m) => (
          <a key={m.id} className="card block !p-4 active:scale-[0.99]" href={waLink(p.phone, m.text)} target="_blank" rel="noopener noreferrer">
            <span className="block font-semibold">{m.title}</span>
            <span className="mt-1 block text-sm text-muted">“{m.text}”</span>
          </a>
        ))}
      </section>

      <button className="min-h-[48px] w-full text-sm font-semibold text-muted underline" onClick={() => setEditing(true)}>Trocar ou editar o parceiro</button>
    </main>
  )
}
