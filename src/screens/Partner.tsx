import { PARTNER_MESSAGES } from '../lib/content'
import { normalizePhone, waLink } from '../lib/whatsapp'
import { useStore } from '../lib/store'

export default function Partner() {
  const { state, update } = useStore()
  const { name, phone } = state.partner
  const ok = !!normalizePhone(phone)
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
