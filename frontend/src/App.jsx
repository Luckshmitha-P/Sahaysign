import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AvatarViewer from './components/AvatarViewer'
import TextInput from './components/TextInput'
import SpeechInput from './components/SpeechInput'
import SignSequence from './components/SignSequence'
import AnnouncementHistory from './components/AnnouncementHistory'
import AccessibilityPanel from './components/AccessibilityPanel'
import LetterMode from './components/LetterMode'
import SignGuidance from './components/SignGuidance'
import { generateSignMotion } from './services/signGenerator'
import { SIGN_LIBRARY } from './services/signMotionLibrary'
import { normalizeSentence, extractConcepts } from './utils/textProcessor'
import { APP_LANGUAGES, getTranslations } from './i18n/translations'

const TEST_SENTENCES = [
  'HELLO',
  'WELCOME',
]

function App() {
  const [announcement, setAnnouncement] = useState('')
  const [activeView, setActiveView] = useState('home')
  const [appLanguage, setAppLanguage] = useState(() => localStorage.getItem('sahaysign-app-language') || 'en')
  const [speechLanguage, setSpeechLanguage] = useState('en')
  const [recognizedText, setRecognizedText] = useState('')
  const [signSequence, setSignSequence] = useState([])
  const [currentSign, setCurrentSign] = useState('')
  const [letterModeSign, setLetterModeSign] = useState('')
  const [handPreviewMode, setHandPreviewMode] = useState(false)
  const [guidanceQuery, setGuidanceQuery] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [progress, setProgress] = useState(0)
  const [developerMode, setDeveloperMode] = useState(false)
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('sahaysign-history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [latestResult, setLatestResult] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')
  const t = getTranslations(appLanguage)

  useEffect(() => {
    localStorage.setItem('sahaysign-app-language', appLanguage)
  }, [appLanguage])

  useEffect(() => {
    localStorage.setItem('sahaysign-history', JSON.stringify(history))
  }, [history])

  const supportedVocabulary = useMemo(() => Object.keys(SIGN_LIBRARY), [])

  const performGeneration = (textValue) => {
    const cleanText = (textValue || '').trim()
    if (!cleanText) {
      setStatusMessage(t.enterSentence)
      return
    }

    const result = generateSignMotion(cleanText, 'ISL', speechLanguage)
    const sequence = result.glossSequence || []

    setLatestResult(result)
    setAnnouncement(cleanText)
    setRecognizedText(cleanText)
    setSignSequence(sequence)
    setCurrentSign(sequence[0] || '')
    setCurrentIndex(0)
    setProgress(0)
    setIsPlaying(true)

    if (!sequence.length) {
      setStatusMessage(t.noMotion)
      return
    }

    setStatusMessage(`${t.generated} ${sequence.length} ${t.signs}`)
    setHistory((prev) => [
      {
        text: cleanText,
        language: speechLanguage,
        sequence,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 8))
  }

  useEffect(() => {
    if (!signSequence.length) return

    if (!isPlaying) return undefined

    const wordBreaks = latestResult?.wordBreaks || []
    const isWordBoundary = wordBreaks.includes(currentIndex)
    const timer = setTimeout(() => {
      setCurrentIndex((previous) => {
        const nextIndex = previous + 1
        if (nextIndex >= signSequence.length) {
          setIsPlaying(false)
          setCurrentSign(signSequence[signSequence.length - 1] || '')
          setProgress(1)
          return signSequence.length - 1
        }

        setCurrentSign(signSequence[nextIndex])
        setProgress(nextIndex / signSequence.length)
        return nextIndex
      })
    }, (isWordBoundary ? 1500 : 900) / animationSpeed)

    return () => clearTimeout(timer)
  }, [signSequence, currentIndex, isPlaying, animationSpeed, latestResult])

  useEffect(() => {
    if (!signSequence.length) {
      setCurrentSign('')
      return
    }

    setCurrentSign(signSequence[currentIndex] || signSequence[0])
    setProgress(signSequence.length ? currentIndex / signSequence.length : 0)
  }, [currentIndex, signSequence])

  const handleGenerate = () => {
    const textValue = recognizedText || announcement
    performGeneration(textValue)
  }

  const handleReplay = (entry) => {
    const sentence = entry?.text || announcement
    setAnnouncement(sentence)
    setRecognizedText(sentence)
    setSignSequence(entry?.sequence || [])
    setCurrentIndex(0)
    setCurrentSign(entry?.sequence?.[0] || '')
    setIsPlaying(true)
    setProgress(0)
  }

  const handleReuse = (entry) => {
    setAnnouncement(entry.text)
    setRecognizedText(entry.text)
    setSignSequence(entry.sequence)
    setCurrentSign(entry.sequence[0] || '')
    setCurrentIndex(0)
    setProgress(0)
  }

  const handleClear = () => {
    setAnnouncement('')
    setRecognizedText('')
    setSignSequence([])
    setCurrentSign('')
    setCurrentIndex(0)
    setProgress(0)
    setStatusMessage('')
  }

  const handleSpeech = (transcript) => {
    setRecognizedText(transcript)
    setAnnouncement(transcript)
    setStatusMessage(t.speechCaptured)
  }

  const handleLetterPreview = (letter) => {
    setActiveView('home')
    setHandPreviewMode(true)
    setLetterModeSign(letter)
    setAnnouncement('')
    setRecognizedText('')
    setSignSequence([letter])
    setCurrentSign(letter)
    setCurrentIndex(0)
    setProgress(0)
    setIsPlaying(false)
    setStatusMessage(`${t.preview}: ${letter}`)
  }

  const unsupportedTerms = useMemo(() => {
    const normalized = normalizeSentence(announcement)
    const detected = extractConcepts(normalized)
    return detected.filter((concept) => !supportedVocabulary.includes(concept))
  }, [announcement, supportedVocabulary])

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <div className="brand">SAHAYSIGN</div>
          <div className="tagline">{t.tagline}</div>
        </div>
        <nav className="nav side-nav" aria-label="Primary navigation">
          <button className={activeView === 'home' ? 'nav-option active' : 'nav-option'} type="button" onClick={() => { setActiveView('home'); setHandPreviewMode(false) }}>{t.home}</button>
          <button className={activeView === 'generate' ? 'nav-option active' : 'nav-option'} type="button" onClick={() => setActiveView('generate')}>{t.generateSign}</button>
          <button className={activeView === 'guidance' ? 'nav-option active' : 'nav-option'} type="button" onClick={() => setActiveView('guidance')}>{t.guidance}</button>
          <button className={activeView === 'history' ? 'nav-option active' : 'nav-option'} type="button" onClick={() => setActiveView('history')}>{t.history}</button>
          <button className={activeView === 'about' ? 'nav-option active' : 'nav-option'} type="button" onClick={() => setActiveView('about')}>{t.about}</button>
          <label className="language-picker">
            <span>{t.appLanguage}</span>
            <select value={appLanguage} onChange={(event) => setAppLanguage(event.target.value)} aria-label={t.appLanguage}>
              {APP_LANGUAGES.map((language) => <option key={language.code} value={language.code}>{t.languageNames?.[language.code] || language.label}</option>)}
            </select>
          </label>
        </nav>
      </header>

      {activeView === 'home' || activeView === 'generate' ? <main className={activeView === 'home' ? 'app-grid single-view' : 'app-grid'}>
        <section className="left-panel" id="home">
          <div className="hero-copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.heroTitle}</h1>
          </div>

          <AvatarViewer currentSign={currentSign} t={t} focusHand={handPreviewMode} />

          <div className="player-controls">
            <button type="button" className="control-button" onClick={() => setIsPlaying(true)}>▶ {t.play}</button>
            <button type="button" className="control-button" onClick={() => setIsPlaying(false)}>⏸ {t.pause}</button>
            <button type="button" className="control-button" onClick={() => { setIsPlaying(false); setCurrentIndex(0); setCurrentSign(signSequence[0] || ''); setProgress(0) }}>⏹ {t.stop}</button>
            <button type="button" className="control-button" onClick={() => { setCurrentIndex(0); setCurrentSign(signSequence[0] || ''); setIsPlaying(true); setProgress(0) }}>↻ {t.replay}</button>
          </div>

          <div className="speed-row">
            <span>{t.animationSpeed}</span>
            <div className="speed-buttons">
              {[0.5, 1, 1.5].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  className={animationSpeed === speed ? 'speed-button active' : 'speed-button'}
                  onClick={() => setAnimationSpeed(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }} />
          </div>

          <div className="status-row">
            <span>{t.animationStatus}</span>
            <strong>{isPlaying ? t.playing : t.paused}</strong>
          </div>
        </section>

        {activeView === 'generate' ? <aside className="right-panel" id="generate">
          <TextInput
            value={announcement}
            onChange={setAnnouncement}
            onGenerate={handleGenerate}
            onClear={handleClear}
            t={t}
          />

          <SpeechInput
            language={speechLanguage}
            onLanguageChange={setSpeechLanguage}
            recognizedText={recognizedText}
            onTranscript={handleSpeech}
            onError={(message) => setStatusMessage(message)}
            t={t}
          />

          <div className="panel-wrap">
            <h3>{t.signGenerationTest}</h3>
            <div className="test-sentence-list">
              {TEST_SENTENCES.map((sentence) => (
                <button
                  key={sentence}
                  type="button"
                  className="linkbutton"
                  onClick={() => {
                    setAnnouncement(sentence)
                    setRecognizedText(sentence)
                    performGeneration(sentence)
                  }}
                >
                  {sentence}
                </button>
              ))}
            </div>
          </div>

          <SignSequence sequence={signSequence} currentIndex={currentIndex} currentSign={currentSign} t={t} />

          <LetterMode currentLetter={letterModeSign} onSelect={handleLetterPreview} t={t} />

          <AccessibilityPanel
            developerMode={developerMode}
            onToggleDeveloperMode={() => setDeveloperMode((prev) => !prev)}
            supported={latestResult?.supportedTerms || []}
            unsupported={latestResult?.unsupportedTerms || unsupportedTerms}
            t={t}
          />

          {statusMessage ? <div className="alert-box">{statusMessage}</div> : null}

          <div className="panel-wrap">
            <h3>{t.developerPanel}</h3>
            <p><strong>{t.inputSentence}:</strong> {announcement || t.none}</p>
            <p><strong>{t.inputLanguage}:</strong> {(latestResult?.inputLanguage || speechLanguage).toUpperCase()}</p>
            <p><strong>{t.outputSignLanguage}:</strong> {(latestResult?.language || 'ISL').toUpperCase()}</p>
            <p><strong>{t.normalized}:</strong> {normalizeSentence(announcement) || '—'}</p>
            <p><strong>{t.detectedConcepts}:</strong> {extractConcepts(normalizeSentence(announcement)).join(', ') || t.none}</p>
            <p><strong>{t.glossSequence}:</strong> {signSequence.join(' → ') || t.none}</p>
            <p><strong>{t.supported}:</strong> {latestResult?.supportedTerms?.join(', ') || t.none}</p>
            <p><strong>{t.unsupported}:</strong> {(latestResult?.unsupportedTerms || unsupportedTerms).join(', ') || t.none}</p>
            <p><strong>{t.motionSequence}:</strong> {(latestResult?.motionSequence || []).map((item) => item.name).join(' → ') || t.none}</p>
          </div>
        </aside> : null}
      </main> : null}

      {activeView === 'guidance' ? <SignGuidance query={guidanceQuery} onQueryChange={setGuidanceQuery} onPreview={handleLetterPreview} t={t} language={appLanguage} /> : null}

      {activeView === 'history' ? <section className="bottom-area" id="history">
          <AnnouncementHistory history={history} onReplay={handleReplay} onReuse={handleReuse} t={t} />
      </section> : null}

      {activeView === 'about' ? <footer className="footer" id="about">
        <div>
          <strong>SahaySign</strong>
            <p>{t.prototypeDescription}</p>
        </div>
        <div>
          <p>{t.prototypeNote}</p>
        </div>
      </footer> : null}
    </div>
  )
}

export default App
