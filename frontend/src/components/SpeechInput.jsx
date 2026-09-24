import { useState } from 'react'
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../services/speechService'

export default function SpeechInput({ language, onLanguageChange, recognizedText, onTranscript, onError, t }) {
  const [listening, setListening] = useState(false)
  const [recognitionInstance, setRecognitionInstance] = useState(null)

  const toggleListening = () => {
    if (!isSpeechRecognitionSupported()) {
      onError?.('Speech recognition is not supported in this browser. Text input remains available.')
      return
    }

    if (listening && recognitionInstance) {
      recognitionInstance.stop()
      setListening(false)
      return
    }

    const recognition = startSpeechRecognition({
      language,
      onResult: (transcript) => {
        onTranscript(transcript)
      },
      onError: (error) => {
        onError?.(error)
        setListening(false)
      },
      onStart: () => setListening(true),
      onEnd: () => setListening(false),
    })

    setRecognitionInstance(recognition)
  }

  return (
    <div className="panel-wrap speech-panel">
      <div className="label-row">
        <label className="field-label" htmlFor="speech-language">{t.speechLanguage}</label>
        <select id="speech-language" value={language} onChange={(event) => onLanguageChange(event.target.value)}>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="hi">Hindi</option>
          <option value="ml">Malayalam</option>
          <option value="te">Telugu</option>
        </select>
      </div>

      <div className="button-row">
        <button type="button" className="primary-button" onClick={toggleListening}>
          {listening ? t.stopSpeaking : t.startSpeaking}
        </button>
      </div>

      {recognizedText ? (
        <div className="recognized-box">
          <strong>{t.recognizedSpeech}</strong>
          <p>{recognizedText}</p>
        </div>
      ) : null}
    </div>
  )
}
