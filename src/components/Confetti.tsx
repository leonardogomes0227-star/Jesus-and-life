import { useMemo } from 'react'

const COLORS = ['rgb(var(--sun))', 'rgb(var(--accent))', '#F7D774', '#8FD8C9', '#F2A65E']

export default function Confetti({ count = 46 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 160,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.8,
        size: 6 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [count],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.6),
            background: p.color,
            borderRadius: p.round ? '50%' : 2,
            animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in both`,
            ['--dx' as string]: `${p.dx}px`,
          }}
        />
      ))}
    </div>
  )
}
