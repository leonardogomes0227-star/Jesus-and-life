import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { buildIcs, downloadIcs, type Reminder } from '../lib/ics'
import { makePin, markUnlocked, verifyPin } from '../lib/pin'
import { normalize, useStore } from '../lib/store'
import type { ThemePref } from '../lib/types'

const THEMES: { v: ThemePref; l: string }[] = [
  { v: 'auto', l: 'Automático' },
  { v: 'light', l: 'Claro' },
  { v: 'dark', l: 'Escuro' },
]

const REMINDERS: { id: string; title: string; text: string; time: string; minutes: number }[] = [
  { id: 'manha', title: 'Momento com Deus', text: 'Hora de ler, orar e responder.', time: '07:00', minutes: 10 },
  { id: 'pausa', title: 'Pausa do meio do dia', text: 'Dois minutos para parar e respirar.', time: '12:30', minutes: 2 },
  { id: 'noite', title: 'Entregar o dia a Deus', text: 'Olhar o dia, orar e descansar.', time: '21:30', minutes: 5 },
]
const PERIOD_TIME: Record<string, string> = { Manhã: '08:00', Tarde: '15:00', Noite: '20:00' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="card space-y-4">{children}</div>
    </section>
  )
}

export default function Settings() {
  const { state, update, replaceAll, wipe } = useStore()
  const navigate = useNavigate()
  const profile = state.profile!
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState('')
  const [backup, setBackup] = useState('')
  const [msg, setMsg] = useState('')
  const [icsMsg, setIcsMsg] = useState('')
  const [curPin, setCurPin] = useState('')
  const [confirmWipe, setConfirmWipe] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const setProfile = (p: Partial<typeof profile>) => update((s) => ({ ...s, profile: { ...s.profile!, ...p } }))

  const rem = (id: string, def: string) => state.reminders[id] ?? { on: false, time: def }
  const setRem = (id: string, def: string, patch: Partial<{ on: boolean; time: string }>) => update((s) => ({ ...s, reminders: { ...s.reminders, [id]: { ...(s.reminders[id] ?? { on: false, time: def }), ...patch } } }))
  const partnerTime = state.partner.time ? PERIOD_TIME[state.partner.time] : '20:00'
  const weekly = state.partner.name && state.partner.day !== undefined
  const downloadReminders = () => {
    const list: Reminder[] = [
      ...REMINDERS.filter((r) => rem(r.id, r.time).on).map((r) => ({ ...r, time: rem(r.id, r.time).time })),
      ...(weekly && rem('encontro', partnerTime).on ? [{ id: 'encontro', title: `Encontro semanal com ${state.partner.name}`, text: 'Dez minutos para se preparar, conversar e combinar a semana.', time: rem('encontro', partnerTime).time, weekday: state.partner.day, minutes: 20 }] : []),
    ]
    if (list.length === 0) return setIcsMsg('Marque pelo menos um lembrete.')
    downloadIcs(buildIcs(list, window.location.origin))
    setIcsMsg('Arquivo baixado. Abra-o para adicionar ao calendário do seu celular.')
  }

  const savePin = async () => {
    if (!/^\d{4}$/.test(pin)) return setPinMsg('O PIN precisa ter 4 números.')
    if (state.pinHash && !(await verifyPin(curPin, state.pinHash))) return setPinMsg('O PIN atual não confere.')
    const h = await makePin(pin)
    markUnlocked()
    update((s) => ({ ...s, pinHash: h }))
    setPin(''); setCurPin('')
    setPinMsg(state.pinHash ? 'PIN trocado.' : 'PIN ativado. Ele será pedido ao abrir o app.')
  }
  const removePin = async () => {
    if (state.pinHash && !(await verifyPin(curPin, state.pinHash))) return setPinMsg('Digite o PIN atual para remover.')
    update((s) => ({ ...s, pinHash: null }))
    setCurPin('')
    setPinMsg('PIN removido.')
  }

  /** O backup não leva o PIN: assim ele não pode ser descoberto por quem encontrar o arquivo. */
  const snapshot = () => JSON.stringify({ ...state, pinHash: null, lastBackupAt: new Date().toISOString() }, null, 2)
  const stamp = () => update((s) => ({ ...s, lastBackupAt: new Date().toISOString() }))
  const daysSinceBackup = state.lastBackupAt ? Math.floor((Date.now() - +new Date(state.lastBackupAt)) / 86400000) : null

  const downloadBackup = () => {
    const blob = new Blob([snapshot()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `livre-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    stamp()
    setMsg('Arquivo baixado. Guarde em um lugar seguro, como o seu e-mail ou a nuvem.')
  }
  const exportBackup = () => { setBackup(snapshot()); stamp(); setMsg('Backup gerado. Copie o texto e guarde em um lugar seguro.') }
  const copy = async () => {
    try { await navigator.clipboard.writeText(backup); setMsg('Copiado!') } catch { setMsg('Não deu para copiar sozinho. Selecione o texto e copie manualmente.') }
  }
  const restoreText = (text: string) => {
    try {
      const data = JSON.parse(text)
      if (!data || typeof data !== 'object' || !('profile' in data)) throw new Error()
      if (!confirm('Restaurar este backup vai substituir os dados atuais. Continuar?')) return
      replaceAll({ ...normalize(data), pinHash: state.pinHash })
      setMsg('Backup restaurado.')
    } catch {
      setMsg('Esse conteúdo não parece um backup válido do Livre.')
    }
  }
  const onFile = async (f?: File) => { if (f) restoreText(await f.text()) }

  return (
    <main className="space-y-8 pb-8">
      <h1 className="font-display text-4xl font-semibold leading-tight">Ajustes</h1>

      <Section title="Perfil">
        <div>
          <label className="label" htmlFor="n">Seu nome</label>
          <input id="n" className="field" value={profile.name} maxLength={40} onChange={(e) => setProfile({ name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="why">Meu porquê</label>
          <textarea id="why" className="field py-3" rows={3} maxLength={280} value={profile.why ?? ''} onChange={(e) => setProfile({ why: e.target.value })} placeholder="O motivo que me faz continuar" />
          <p className="mt-2 text-xs text-muted">Aparece no SOS e no seu plano.</p>
        </div>
        <div>
          <p className="label">Meta da trilha</p>
          <div className="grid grid-cols-2 gap-3">{([21, 90] as const).map((g) => <button key={g} aria-pressed={profile.goal === g} onClick={() => setProfile({ goal: g })} className="chip justify-center">{g} dias</button>)}</div>
          <p className="mt-2 text-xs text-muted">Mudar a meta não apaga o seu progresso.</p>
        </div>
      </Section>

      <Section title="Aparência">
        <div>
          <p className="label">Tema</p>
          <div className="grid grid-cols-3 gap-2">{THEMES.map((t) => <button key={t.v} aria-pressed={state.theme === t.v} onClick={() => update((s) => ({ ...s, theme: t.v }))} className="chip justify-center !px-2">{t.l}</button>)}</div>
        </div>
        <div>
          <p className="label">Tamanho da letra na Bíblia</p>
          <div className="grid grid-cols-3 gap-2">{(['Pequena', 'Média', 'Grande'] as const).map((l, i) => <button key={l} aria-pressed={state.fontScale === i} onClick={() => update((s) => ({ ...s, fontScale: i as 0 | 1 | 2 }))} className="chip justify-center !px-2">{l}</button>)}</div>
        </div>
      </Section>

      <Section title="Privacidade">
        <div className="space-y-3">
          <p className="font-semibold">PIN de 4 dígitos</p>
          <p className="text-sm text-muted">Pede o PIN ao abrir o app e bloqueia por um tempo depois de várias tentativas erradas. É uma trava de privacidade neste aparelho, e não uma proteção forte: quem tiver acesso aos dados do navegador consegue contorná-la.</p>
          {state.pinHash && <input className="field" inputMode="numeric" maxLength={4} placeholder="PIN atual" value={curPin} onChange={(e) => setCurPin(e.target.value.replace(/\D/g, ''))} aria-label="PIN atual" />}
          <div className="flex gap-2">
            <input className="field" inputMode="numeric" maxLength={4} placeholder={state.pinHash ? 'Novo PIN' : '0000'} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} aria-label="Novo PIN" />
            <button className="btn-primary shrink-0" onClick={() => void savePin()}>{state.pinHash ? 'Trocar' : 'Ativar'}</button>
          </div>
          {state.pinHash && <button className="btn-ghost w-full" onClick={() => void removePin()}>Remover o PIN</button>}
          {pinMsg && <p className="text-sm text-accent" role="status">{pinMsg}</p>}
        </div>
        <div className="space-y-2 border-t border-line pt-4">
          <button aria-pressed={state.discreet} onClick={() => update((s) => ({ ...s, discreet: !s.discreet }))} className="flex min-h-[48px] w-full items-center gap-3 text-left">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${state.discreet ? 'border-accent bg-accent text-accent-ink' : 'border-muted'}`}>{state.discreet ? '✓' : ''}</span>
            <span className="font-semibold">Modo discreto</span>
          </button>
          <p className="text-sm text-muted">A aba do navegador passa a se chamar “Notas” e usa um ícone neutro. O ícone na tela inicial do celular não muda.</p>
        </div>
      </Section>

      <Section title="Lembretes no calendário">
        <p className="text-sm text-muted">O Livre não envia notificações. Em vez disso, gere um arquivo de calendário: o seu celular passa a avisar nos horários que você escolher, e o toque no aviso abre o app.</p>
        {[...REMINDERS, ...(weekly ? [{ id: 'encontro', title: `Encontro semanal com ${state.partner.name}`, text: '', time: partnerTime, minutes: 20 }] : [])].map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3">
            <button aria-pressed={rem(r.id, r.time).on} onClick={() => setRem(r.id, r.time, { on: !rem(r.id, r.time).on })} className="flex min-h-[48px] flex-1 items-center gap-3 text-left">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${rem(r.id, r.time).on ? 'border-accent bg-accent text-accent-ink' : 'border-muted'}`}>{rem(r.id, r.time).on ? '✓' : ''}</span>
              <span className="font-semibold">{r.title}</span>
            </button>
            <input type="time" aria-label={`Horário: ${r.title}`} className="field !w-[140px] !px-3" value={rem(r.id, r.time).time} onChange={(e) => setRem(r.id, r.time, { time: e.target.value || r.time })} />
          </div>
        ))}
        <button className="btn-primary w-full" onClick={downloadReminders}>Baixar lembretes (.ics)</button>
        {icsMsg && <p className="text-sm text-accent" role="status">{icsMsg}</p>}
        <p className="text-xs text-muted">Depois de importar, os lembretes se repetem sozinhos. Para parar, apague os eventos “Livre” no calendário.</p>
      </Section>

      <Section title="Seus dados">
        <p className="text-sm text-muted">Tudo fica só neste aparelho. Se você trocar de aparelho ou limpar o navegador, perde o que escreveu, então vale guardar uma cópia.</p>
        <p className={`rounded-2xl p-3 text-sm ${daysSinceBackup === null || daysSinceBackup > 30 ? 'bg-sand text-sand-ink' : 'bg-bg text-muted'}`}>
          {daysSinceBackup === null ? 'Você ainda não fez backup.' : daysSinceBackup === 0 ? 'Último backup: hoje.' : `Último backup: há ${daysSinceBackup} ${daysSinceBackup === 1 ? 'dia' : 'dias'}.`}
        </p>
        <button className="btn-primary w-full" onClick={downloadBackup}>Baixar arquivo de backup</button>
        <button className="btn-ghost w-full" onClick={() => fileRef.current?.click()}>Restaurar de um arquivo</button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Arquivo de backup" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = '' }} />
        <details className="rounded-2xl border border-line p-4">
          <summary className="cursor-pointer font-semibold">Backup em texto (avançado)</summary>
          <div className="mt-3 space-y-3">
            <textarea className="field py-3 font-mono text-xs" rows={6} value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="O backup aparece aqui. Cole um backup para restaurar." aria-label="Texto do backup" />
            <div className="grid grid-cols-3 gap-2">
              <button className="btn-ghost !px-2" onClick={exportBackup}>Gerar</button>
              <button className="btn-ghost !px-2" onClick={() => void copy()} disabled={!backup}>Copiar</button>
              <button className="btn-ghost !px-2" onClick={() => restoreText(backup)} disabled={!backup}>Restaurar</button>
            </div>
          </div>
        </details>
        <p className="text-xs text-muted">O backup não inclui o seu PIN.</p>
        {msg && <p className="text-sm text-accent" role="status">{msg}</p>}
      </Section>

      <Section title="Sobre">
        <Link to="/sobre" className="flex items-center justify-between gap-3">
          <span><span className="block font-semibold">Sobre e privacidade</span><span className="block text-sm text-muted">Seus dados, avisos de segurança e créditos.</span></span>
          <span className="text-muted" aria-hidden>→</span>
        </Link>
        <p className="text-sm text-muted">Versão <strong className="text-ink">{__BUILD_ID__}</strong> · publicada em {new Date(__BUILD_TIME__).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
      </Section>

      <Section title="Apagar tudo">
        <p className="text-sm text-muted">Remove todos os dados deste aparelho: diário, pedidos, plano, tudo. Não dá para desfazer. Faça um backup antes, se quiser guardar algo.</p>
        <input className="field" value={confirmWipe} onChange={(e) => setConfirmWipe(e.target.value)} placeholder="Digite APAGAR para liberar o botão" aria-label="Confirmação para apagar" />
        <button className="btn-ghost w-full !border-sun !text-sun" disabled={confirmWipe.trim().toUpperCase() !== 'APAGAR'} onClick={() => { if (confirm('Último aviso: apagar todos os dados do Livre?')) { wipe(); navigate('/', { replace: true }) } }}>Apagar todos os dados</button>
      </Section>
    </main>
  )
}
