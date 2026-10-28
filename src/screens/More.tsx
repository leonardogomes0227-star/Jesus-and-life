import { Link } from 'react-router-dom'

const ITEMS = [
  { to: '/parceiro', emoji: '🤝', title: 'Parceiro', text: 'Prestação de contas com alguém de confiança.' },
  { to: '/temas', emoji: '📚', title: 'Aprender', text: 'Mente e hábitos, limites e namoro, ansiedade e vazio.' },
  { to: '/queda', emoji: '🌅', title: 'Recomeçar sem culpa', text: 'Entenda o que aconteceu e siga em frente.' },
  { to: '/ajustes', emoji: '⚙️', title: 'Ajustes', text: 'Nome, meta, tema, PIN e backup.' },
]

export default function More() {
  return (
    <main className="space-y-5">
      <h1 className="font-display text-3xl font-bold fade-up">Mais</h1>
      <div className="space-y-3">
        {ITEMS.map((i) => (
          <Link key={i.to} to={i.to} className="card fade-up flex items-center gap-4 active:scale-[0.99]">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-bg text-3xl" aria-hidden>{i.emoji}</span>
            <span>
              <span className="block font-display text-xl font-bold">{i.title}</span>
              <span className="block text-sm text-muted">{i.text}</span>
            </span>
          </Link>
        ))}
      </div>
      <p className="text-center text-sm text-muted">Se precisar conversar agora, o CVV atende 24h pelo telefone 188.</p>
    </main>
  )
}
