/** Gera uma imagem (PNG) do versículo para compartilhar. Tudo é feito no aparelho. */
export const verseImage = (text: string, ref: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const W = 1080, H = 1350
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const g = c.getContext('2d')
    if (!g) return reject(new Error('canvas indisponível'))

    const bg = g.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#121110')
    bg.addColorStop(1, '#2B2926')
    g.fillStyle = bg
    g.fillRect(0, 0, W, H)

    g.fillStyle = '#C9A062'
    g.fillRect(96, 160, 96, 6)

    const family = 'Newsreader, Georgia, serif'
    const maxW = W - 192
    let size = 76
    let lines: string[] = []
    const wrap = (s: number) => {
      g.font = `600 ${s}px ${family}`
      const words = `“${text}”`.split(' ')
      const out: string[] = []
      let line = ''
      for (const w of words) {
        const t = line ? `${line} ${w}` : w
        if (g.measureText(t).width > maxW && line) { out.push(line); line = w } else line = t
      }
      if (line) out.push(line)
      return out
    }
    for (; size >= 36; size -= 4) {
      lines = wrap(size)
      if (lines.length * size * 1.32 <= 800) break
    }
    g.fillStyle = '#F4F1EC'
    g.textBaseline = 'top'
    lines.forEach((l, i) => g.fillText(l, 96, 230 + i * size * 1.32))

    g.fillStyle = '#C9A062'
    g.font = `700 44px ${family}`
    g.fillText(`${ref} · ACF`, 96, H - 220)
    g.fillStyle = '#9A948B'
    g.font = `500 34px ${family}`
    g.fillText('Livre', 96, H - 150)

    c.toBlob((b) => (b ? resolve(b) : reject(new Error('falha ao gerar imagem'))), 'image/png')
  })
