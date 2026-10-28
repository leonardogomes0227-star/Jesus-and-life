/** Normaliza para o formato internacional do Brasil (sem +). Retorna '' se inválido. */
export const normalizePhone = (raw: string): string => {
  const d = raw.replace(/\D/g, '')
  if (d.length === 10 || d.length === 11) return `55${d}`
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) return d
  return ''
}

export const waLink = (phone: string, text: string): string =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`
