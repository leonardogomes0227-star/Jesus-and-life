export interface Reminder {
  id: string
  title: string
  text: string
  time: string // HH:MM
  weekday?: number // 0 = domingo; se definido, repete toda semana nesse dia
  minutes: number
}

const BYDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
const pad = (n: number) => String(n).padStart(2, '0')
const stamp = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
/** Linhas de iCalendar não devem passar de 75 caracteres. */
const fold = (l: string) => (l.length <= 73 ? l : l.match(/.{1,73}/g)!.join('\r\n '))

/** Gera um arquivo de calendário (.ics) com lembretes repetidos. O horário é "flutuante": segue o fuso do aparelho. */
export const buildIcs = (reminders: Reminder[], url: string): string => {
  const now = new Date()
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Livre//Lembretes//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH']
  for (const r of reminders) {
    const [h, m] = r.time.split(':').map(Number)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)
    // para lembretes semanais, começar no próximo dia da semana combinado
    if (r.weekday !== undefined) while (start.getDay() !== r.weekday || start < now) start.setDate(start.getDate() + 1)
    else if (start < now) start.setDate(start.getDate() + 1)
    const end = new Date(start.getTime() + r.minutes * 60000)
    const local = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
    lines.push(
      'BEGIN:VEVENT',
      `UID:livre-${r.id}@livre`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART:${local(start)}`,
      `DTEND:${local(end)}`,
      `RRULE:FREQ=${r.weekday !== undefined ? `WEEKLY;BYDAY=${BYDAY[r.weekday]}` : 'DAILY'}`,
      `SUMMARY:${esc(r.title)}`,
      `DESCRIPTION:${esc(`${r.text}\n${url}`)}`,
      `URL:${url}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(r.title)}`,
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}

export const downloadIcs = (content: string, name = 'livre-lembretes.ics'): void => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
