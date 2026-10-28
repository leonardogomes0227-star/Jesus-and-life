import { useCallback, useEffect, useState } from 'react'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Leitura em voz alta (pt-BR) usando a voz do próprio aparelho. Nada sai do dispositivo. */
export const speak = (text: string, rate = 0.92): void => {
  if (!supported) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'pt-BR'
  u.rate = rate
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith('pt'))
  if (v) u.voice = v
  window.speechSynthesis.speak(u)
}

export const stopSpeaking = (): void => {
  if (supported) window.speechSynthesis.cancel()
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => stopSpeaking(), [])

  const read = useCallback((text: string) => {
    if (!supported) return
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    u.rate = 0.92
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith('pt'))
    if (v) u.voice = v
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(u)
  }, [speaking])

  return { supported, speaking, read }
}
