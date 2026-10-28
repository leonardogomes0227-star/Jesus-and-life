interface Props {
  progress: number // 0..1
}

const CX = 120
const CY = 120
const R = 100

/** Arco de sol: o sol sobe pelo horizonte conforme o progresso da meta. */
export default function SunArc({ progress }: Props) {
  const p = Math.min(1, Math.max(0, progress))
  const theta = Math.PI * (1 - p)
  const sx = CX + R * Math.cos(theta)
  const sy = CY - R * Math.sin(theta)
  const arc = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`

  return (
    <svg viewBox="0 0 240 140" className="w-full" role="img" aria-label={`Progresso da meta: ${Math.round(p * 100)}%`}>
      <path d={arc} fill="none" stroke="rgb(var(--line))" strokeWidth="10" strokeLinecap="round" />
      <path
        d={arc}
        pathLength={1}
        fill="none"
        stroke="rgb(var(--sun))"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <line x1="8" y1={CY + 6} x2="232" y2={CY + 6} stroke="rgb(var(--line))" strokeWidth="2" strokeLinecap="round" />
      <g style={{ transition: 'transform 0.8s ease' }}>
        <circle cx={sx} cy={sy} r="22" fill="rgb(var(--sun))" opacity="0.22" />
        <circle cx={sx} cy={sy} r="13" fill="rgb(var(--sun))" />
      </g>
    </svg>
  )
}
