import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hashPin, normalize, useStore } from '../lib/store'
import type { ThemePref } from '../lib/types'

const THEMES: { v: ThemePref; l: string }[] = [
  { v: 'auto', l: 'Automático' },
  { v: 'light', l: 'Claro' },
  { v: 'dark', l: 'Escuro' },
]

export default function Settings() {
  const { state, update, replaceAll, wipe } = useStore()
  const navigate = useNavigate()
  const profile = state.profile!
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState('')
  const [backup, setBackup] = useState('')
  const [msg, setMsg] = useState('')

  const setProfile = (p: Partial<typeof profile>) => update((s) => ({ ...s, profile: { ...s.profile!, ...p } }))

  const savePin = () => {
    if (!/^\d{4}$/.test(pin)) return setPinMsg('O PIN precisa ter 4 números.')
    update((s) => ({ ...s, pinHash: hashPin(pin) }))
    setPin('')
    setPinMsg('PIN ativado. Ele será pedido ao abrir o app.')
  }

  const exportBackup = () => {
    setBackup(JSON.stringify(state, null, 2))
    setMsg('Backup gerado. Copie o texto e guarde em um lugar seguro.')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(backup)
      setMsg('Copiado!')
    } catch {
      setMsg('Não deu para copiar sozinho. Selecione o texto e copie manualmente.')
    }
  }

  const restore = () => {
    try {
      const data = JSON.parse(backup)
      if (!data || typeof data !== 'object' || !('profile' in data)) throw new Error()
      if (!confirm('Restaurar este backup vai substituir os dados atuais. Continuar?')) return
      replaceAll(normalize(data))
      setMsg('Backup restaurado.')
    } catch {
      setMsg('Esse texto não parece um backup válido do Livre.')
    }
  }

  return (
    <main className="space-y-5 fade-up">
      <h1 className="font-display text-3xl font-bold">Ajustes</h1>

      <section className="card space-y-4">
        <div>
          <label className="label" htmlFor="n">Seu nome</label>
          <input id="n" className="field" value={profile.name} maxLength={40} onChange={(e) => setProfile({ name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="why">Meu porquê</label>
          <textarea id="why" className="field py-3" rows={3} maxLength={280} value={profile.why ?? ''} onChange={(e) => setProfile({ why: e.target.value })} placeholder="O motivo que me faz continuar" />
        </div>
        <div>
          <p className="label">Meta</p>
          <div className="grid grid-cols-2 gap-3">
            {([21, 90] as const).map((g) => (
              <button key={g} aria-pressed={profile.goal === g} onClick={() => setProfile({ goal: g })} className="chip justify-center">{g} dias</button>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Tema</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button key={t.v} aria-pressed={state.theme === t.v} onClick={() => update((s) => ({ ...s, theme: t.v }))} className="chip justify-center !px-2">{t.l}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-xl font-bold">PIN de 4 dígitos</h2>
        <p className="text-sm text-muted">Uma trava simples para guardar sua privacidade neste aparelho.</p>
        {state.pinHash ? (
          <button className="btn-ghost w-full" onClick={() => { update((s) => ({ ...s, pinHash: null })); setPinMsg('PIN removido.') }}>Remover PIN</button>
        ) : (
          <div className="flex gap-2">
            <input className="field" inputMode="numeric" maxLength={4} placeholder="0000" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="Novo PIN" />
            <button className="btn-primary shrink-0" onClick={savePin}>Ativar</button>
          </div>
        )}
        {pinMsg && <p className="text-sm text-accent" role="status">{pinMsg}</p>}
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-xl font-bold">Backup em texto</h2>
        <p className="text-sm text-muted">Seus dados ficam só neste aparelho. Gere um texto para guardar ou cole um backup para restaurar.</p>
        <textarea className="field py-3 font-mono text-xs" rows={6} value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="O backup aparece aqui. Cole um backup para restaurar." aria-label="Texto do backup" />
        <div className="grid grid-cols-3 gap-2">
          <button className="btn-ghost !px-2" onClick={exportBackup}>Gerar</button>
          <button className="btn-ghost !px-2" onClick={copy} disabled={!backup}>Copiar</button>
          <button className="btn-ghost !px-2" onClick={restore} disabled={!backup}>Restaurar</button>
        </div>
        {msg && <p className="text-sm text-accent" role="status">{msg}</p>}
      </section>

      <section className="card space-y-3">
        <h2 className="font-display text-xl font-bold">Apagar tudo</h2>
        <p className="text-sm text-muted">Remove todos os dados deste aparelho. Não dá para desfazer.</p>
        <button
          className="btn-ghost w-full !border-sun !text-sun"
          onClick={() => {
            if (confirm('Apagar todos os seus dados do Livre? Isso não pode ser desfeito.')) {
              wipe()
              navigate('/', { replace: true })
            }
          }}
        >
          Apagar todos os dados
        </button>
      </section>
    </main>
  )
}
