export const dayKey = (d: Date = new Date()): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const utc = (key: string): number => {
  const [y, m, d] = key.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export const diffDays = (from: string, to: string): number =>
  Math.round((utc(to) - utc(from)) / 86_400_000)

export const addDays = (key: string, n: number): string => {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + n))
}

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

export const fmtDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

/** Valor para <input type="datetime-local"> no fuso local. */
export const toLocalInput = (d: Date = new Date()): string =>
  `${dayKey(d)}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
