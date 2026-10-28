import { MOODS } from '../lib/content'
import { addDays } from '../lib/dates'
import type { Checkin } from '../lib/types'

const W = 320
const H = 140
const PAD = { l: 26, r: 10, t: 12, b: 22 }

export default function MoodChart({ checkins, today, days = 14 }: { checkins: Checkin[]; today: string; days?: number }) {
  const keys = Array.from({ length: days }, (_, i) => addDays(today, i - (days - 1)))
  const by = new Map(checkins.map((c) => [c.date, c.mood]))
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (days - 1)
  const y = (m: number) => PAD.t + ((5 - m) * (H - PAD.t - PAD.b)) / 4

  const pts = keys.map((k, i) => (by.has(k) ? { i, m: by.get(k)!, k } : null)).filter(Boolean) as { i: number; m: number; k: string }[]
  const line = pts.map((p, n) => `${n ? 'L' : 'M'}${x(p.i)} ${y(p.m)}`).join(' ')
  const area = pts.length > 1 ? `${line} L${x(pts[pts.length - 1].i)} ${H - PAD.b} L${x(pts[0].i)} ${H - PAD.b} Z` : ''

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gráfico de humor dos últimos dias">
      <defs>
        <linearGradient id="mood-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      {[1, 2, 3, 4, 5].map((m) => (
        <g key={m}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(m)} y2={y(m)} stroke="rgb(var(--line))" strokeDasharray="3 4" />
          <text x={0} y={y(m) + 5} fontSize="13">{MOODS[m - 1].emoji}</text>
        </g>
      ))}
      {area && <path d={area} fill="url(#mood-area)" />}
      {line && <path d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {pts.map((p) => (
        <circle key={p.k} cx={x(p.i)} cy={y(p.m)} r="4" fill="rgb(var(--surface))" stroke="rgb(var(--accent))" strokeWidth="2.5" />
      ))}
      {keys.map((k, i) => (i % 2 === (days - 1) % 2 ? <text key={k} x={x(i)} y={H - 6} fontSize="9" textAnchor="middle" fill="rgb(var(--muted))">{k.slice(8)}</text> : null))}
    </svg>
  )
}
