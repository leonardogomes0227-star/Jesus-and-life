import type { Slot } from '../lib/momento'

/** Ilustração simples de cada hora do dia, desenhada em SVG: sol nascendo, sol alto e lua. */
export default function HourArt({ slot, className = '' }: { slot: Slot; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden fill="none">
      {slot === 'manha' && (
        <>
          <circle cx="92" cy="86" r="34" fill="rgb(var(--sun))" />
          <rect x="40" y="86" width="120" height="40" fill="rgb(var(--sand))" />
          <path d="M40 86H160" stroke="currentColor" strokeWidth="2" />
          {[-60, -30, 0, 30, 60].map((a) => (
            <line key={a} x1="92" y1="38" x2="92" y2="28" stroke="rgb(var(--sun))" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 92 86)`} />
          ))}
        </>
      )}
      {slot === 'pausa' && (
        <>
          <circle cx="80" cy="46" r="26" fill="rgb(var(--sun))" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="80" y1="8" x2="80" y2="0" stroke="rgb(var(--sun))" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} 80 46)`} />
          ))}
          <path d="M40 104H160" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {slot === 'noite' && (
        <>
          <mask id="moon">
            <rect width="160" height="120" fill="#fff" />
            <circle cx="104" cy="44" r="26" fill="#000" />
          </mask>
          <circle cx="86" cy="52" r="30" fill="rgb(var(--sun))" mask="url(#moon)" />
          {[[28, 24], [128, 22], [140, 78], [40, 80], [64, 14]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k % 2 ? 2 : 3} fill="rgb(var(--night-ink))" opacity="0.8" />)}
          <path d="M40 108H160" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        </>
      )}
    </svg>
  )
}
