import { Link, Navigate, useParams } from 'react-router-dom'
import AudioPlayer from '../components/AudioPlayer'
import { AUDIO_SESSIONS } from '../lib/audio'

export function RestList() {
  return (
    <main className="space-y-5">
      <Link to="/biblia" className="flex min-h-[48px] items-center text-sm font-semibold text-muted">← Bíblia</Link>
      <header>
        <h1 className="font-display text-3xl font-bold">Meditação e descanso</h1>
        <p className="mt-1 text-muted">Áudios guiados para desacelerar a mente, com voz do aparelho e som ambiente suave.</p>
      </header>
      <div className="space-y-3">
        {AUDIO_SESSIONS.map((a) => (
          <Link key={a.id} to={`/descanso/${a.id}`} className="card flex items-center gap-4 active:scale-[0.99]">
            <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-bg"><span className="font-display text-xl font-bold leading-none">{a.minutes}</span><span className="text-[11px] font-semibold text-muted">min</span></span>
            <span>
              <span className="block font-display text-lg font-bold">{a.title}</span>
              <span className="block text-sm text-muted">{a.blurb}</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}

export function RestPlayer() {
  const { id } = useParams()
  const s = AUDIO_SESSIONS.find((x) => x.id === id)
  if (!s) return <Navigate to="/descanso" replace />
  return (
    <main className="space-y-5">
      <Link to="/descanso" className="flex min-h-[48px] items-center text-sm font-semibold text-accent">← Áudios</Link>
      <AudioPlayer key={s.id} session={s} />
    </main>
  )
}
