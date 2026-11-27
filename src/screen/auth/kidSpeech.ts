type SpeechModule = {
  speak: (text: string) => void
  stop: (onWordBoundary?: boolean) => void
}

const safeCall = (work: () => unknown) => {
  try {
    const result = work()
    if (result && typeof (result as Promise<unknown>).catch === 'function') {
      ;(result as Promise<unknown>).catch(() => undefined)
    }
  } catch {
    // This iOS build rejects the speech library's boolean flag.
  }
}

const loadTts = (): SpeechModule | null => {
  try {
    return require('react-native-tts').default
  } catch {
    return null
  }
}

const Tts = loadTts()

export const speak = (text: string) => {
  if (!Tts) {
    return
  }
  safeCall(() => Tts.stop(false))
  safeCall(() => Tts.speak(text))
}

export const stopSpeak = () => {
  safeCall(() => Tts?.stop(false))
}
