import { MILESTONES } from '../lib/content'

interface Props {
  progress: number // 0..1 da meta
  goal: number
  day: number
}

const CX = 160
const CY = 150
const R = 120

const pt = (p: number, r = R) => {
  const a = Math.PI * (1 - p)
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) }
}

const STARS = [[28, 24], [70, 52], [118, 18], [205, 30], [250, 60], [292, 22], [48, 90], [276, 98], [160, 14]]

/** Cena do amanhecer: o sol sobe pelo arco conforme a meta. */
export default function SunScene({ progress, goal, day }: Props) {
  const p = Math.min(1, Math.max(0, progress))
  const sun = pt(p)
  const arc = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`
  const marks = MILESTONES.filter((m) => m.days <= goal && m.days < goal)

  return (
    <svg viewBox="0 0 320 180" className="w-full overflow-hidden rounded-[28px]" role="img" aria-label={`Dia ${day} de ${goal}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'rgb(var(--ink))', stopOpacity: 0.05 }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 0.3 }} />
        </linearGradient>
        <radialGradient id="halo">
          <stop offset="0" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 0.8 }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="url(#sky)" />
      <g style={{ opacity: 'var(--stars)' as unknown as number }}>
        {STARS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1.1} fill="rgb(var(--ink))" className="star" style={{ animationDelay: `${i * 0.37}s` }} />
        ))}
      </g>

      <path d={arc} fill="none" stroke="rgb(var(--ink))" strokeOpacity="0.12" strokeWidth="8" strokeLinecap="round" strokeDasharray="1 14" pathLength={undefined} />
      <path d={arc} pathLength={1} fill="none" stroke="rgb(var(--sun))" strokeWidth="8" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - p} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)' }} />
      {marks.map((m) => {
        const q = pt(m.days / goal, R)
        const done = day >= m.days
        return <circle key={m.days} cx={q.x} cy={q.y} r="4" fill={done ? 'rgb(var(--sun))' : 'rgb(var(--surface))'} stroke="rgb(var(--sun))" strokeWidth="2" />
      })}

      <g>
        <circle cx={sun.x} cy={sun.y} r="46" fill="url(#halo)" className="glow" />
        <g className="rays" style={{ transformOrigin: `${sun.x}px ${sun.y}px` }}>
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1={sun.x} y1={sun.y - 22} x2={sun.x} y2={sun.y - 30} stroke="rgb(var(--sun))" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30} ${sun.x} ${sun.y})`} />
          ))}
        </g>
        <circle cx={sun.x} cy={sun.y} r="15" fill="rgb(var(--sun))" />
      </g>

      <path d="M0 150 Q50 128 100 144 T200 140 T320 132 V180 H0Z" fill="rgb(var(--ink))" fillOpacity="0.06" />
      <path d="M0 162 Q70 142 130 158 T250 154 T320 150 V180 H0Z" fill="rgb(var(--ink))" fillOpacity="0.12" />
    </svg>
  )
}
