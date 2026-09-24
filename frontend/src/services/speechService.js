const LANG_OPTIONS = {
  en: 'en-US',
  ta: 'ta-IN',
  hi: 'hi-IN',
  ml: 'ml-IN',
  te: 'te-IN',
}

export function getSupportedSpeechLanguages() {
  return Object.entries(LANG_OPTIONS).map(([code, label]) => ({ code, label }))
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

export function startSpeechRecognition({ language = 'en', onResult, onError, onStart, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    onError?.('Speech recognition is not supported in this browser. Text input remains available.')
    return null
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  recognition.lang = LANG_OPTIONS[language] || 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    onStart?.()
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || '')
      .join(' ')
      .trim()

    if (transcript) {
      onResult?.(transcript)
    }
  }

  recognition.onerror = (event) => {
    onError?.(`Speech recognition error: ${event.error}`)
  }

  recognition.onend = () => {
    onEnd?.()
  }

  recognition.start()
  return recognition
}
