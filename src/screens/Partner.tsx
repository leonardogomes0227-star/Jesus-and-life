import { PARTNER_MESSAGES } from '../lib/content'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { streakDay, totalDays, useStore } from '../lib/store'
import { dayKey, addDays } from '../lib/dates'
import { useState } from 'react'

export default function Partner() {
  const { state, update } = useStore()
  const { name, phone } = state.partner
  const ok = !!normalizePhone(phone)
  const [withMood, setWithMood] = useState(true)
  const today = dayKey()
  const week = state.checkins.filter((c) => c.date >= addDays(today, -6))
  const avg = week.length ? week.reduce((a, c) => a + c.mood, 0) / week.length : 0
  const moodWord = avg >= 4 ? 'bem' : avg >= 3 ? 'razoável' : 'um pouco pesada'
  const waves = state.sos.filter((s) => s.outcome === 'passed').length
  const progress = [
    `Oi${name ? `, ${name}` : ''}! Atualização da semana: estou no dia ${streakDay(state)} da minha sequência e já somo ${totalDays(state)} ${totalDays(state) === 1 ? 'dia' : 'dias'} no total.`,
    withMood && week.length >= 2 ? `Minha semana foi ${moodWord}.` : '',
    waves > 0 ? `Já venci ${waves} ${waves === 1 ? 'onda' : 'ondas'} de vontade.` : '',
    'Pode orar por mim e perguntar como estou?',
  ].filter(Boolean).join(' ')
  const set = (p: Partial<typeof state.partner>) => update((s) => ({ ...s, partner: { ...s.partner, ...p } }))

  return (
    <main className="space-y-5 fade-up">
      <header>
        <h1 className="font-display text-3xl font-bold">Parceiro</h1>
        <p className="mt-2 text-muted">Ninguém caminha sozinho. Escolha uma pessoa de confiança que pode te apoiar e orar por você.</p>
      </header>

      <section className="card space-y-4">
        <div>
          <label className="label" htmlFor="pn">Nome</label>
          <input id="pn" className="field" value={name} onChange={(e) => set({ name: e.target.value })} placeholder="Ex.: João" maxLength={40} />
        </div>
        <div>
          <label className="label" htmlFor="pt">WhatsApp (com DDD)</label>
          <input id="pt" className="field" inputMode="tel" value={phone} onChange={(e) => set({ phone: e.target.value })} placeholder="(11) 91234-5678" />
          {phone && !ok && <p className="mt-2 text-sm text-sun">Confira o número: use DDD + telefone.</p>}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-xl font-bold">Prestação de contas</h2>
        <p className="text-sm text-muted">Compartilhe só números e uma palavra sobre a semana. Nenhum detalhe íntimo é incluído.</p>
        <p className="rounded-2xl bg-bg p-4 text-sm">“{progress}”</p>
        <label className="flex min-h-[48px] items-center gap-3 text-sm font-semibold">
          <input type="checkbox" className="h-5 w-5 accent-[rgb(var(--accent))]" checked={withMood} onChange={(e) => setWithMood(e.target.checked)} />
          Incluir como foi minha semana
        </label>
        {ok ? (
          <a className="btn-primary w-full" href={waLink(phone, progress)} target="_blank" rel="noopener noreferrer">Compartilhar meu progresso</a>
        ) : (
          <button className="btn-ghost w-full" disabled>Cadastre o número acima</button>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Mensagens prontas</h2>
        <p className="text-sm text-muted">Ao tocar, o WhatsApp abre com o texto preenchido. Nada é enviado sozinho — você decide se envia.</p>
        {PARTNER_MESSAGES.map((m) => (
          <div key={m.id} className="card">
            <p className="font-semibold">{m.title}</p>
            <p className="mt-1 text-sm text-muted">“{m.text}”</p>
            {ok ? (
              <a className="btn-primary mt-3 w-full" href={waLink(phone, m.text)} target="_blank" rel="noopener noreferrer">Abrir no WhatsApp</a>
            ) : (
              <button className="btn-ghost mt-3 w-full" disabled>Cadastre o número acima</button>
            )}
          </div>
        ))}
      </section>
    </main>
  )
}
