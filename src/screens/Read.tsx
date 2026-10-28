import { Link } from 'react-router-dom'
import { BOOKS } from '../lib/books'
import { useStore } from '../lib/store'

const ITEMS = [
  { to: '/devocional', title: 'Devocional do dia', text: 'Versículo, reflexão, oração e anotação.' },
  { to: '/biblia', title: 'Bíblia', text: 'Leia, busque, destaque e anote.' },
  { to: '/planos', title: 'Planos de leitura', text: 'Da Bíblia em 1 ano a leituras curtas por tema.' },
  { to: '/orar', title: 'Oração e diário', text: 'Pedidos, respostas, gratidão e reflexões.' },
  { to: '/descanso', title: 'Meditação e descanso', text: 'Áudios guiados para desacelerar e dormir.' },
]

export default function Read() {
  const { state } = useStore()
  const last = state.lastRead ? BOOKS.find((b) => b.id === state.lastRead!.book) : null
  return (
    <main className="space-y-5">
      <h1 className="font-display text-3xl font-bold">Leitura e devocionais</h1>
      {last && (
        <Link to={`/biblia/${last.id}/${state.lastRead!.chapter}`} className="card block active:scale-[0.99]">
          <span className="block text-sm font-semibold text-muted">Continuar de onde parou</span>
          <span className="block font-display text-xl font-bold">{last.name} {state.lastRead!.chapter}</span>
        </Link>
      )}
      <div className="space-y-3">
        {ITEMS.map((i) => (
          <Link key={i.to} to={i.to} className="card flex items-center justify-between gap-4 active:scale-[0.99]">
            <span>
              <span className="block font-display text-xl font-bold">{i.title}</span>
              <span className="block text-sm text-muted">{i.text}</span>
            </span>
            <span className="text-accent" aria-hidden>→</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
