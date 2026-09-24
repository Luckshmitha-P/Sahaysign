const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
import { GUIDANCE_DETAILS } from '../data/guidanceDetails'

const HAND_GLYPHS = {
  A: '✊', B: '🖐️', C: '🤏', D: '☝️', E: '🤏', F: '👌', G: '👉', H: '🖐️',
  I: '🤙', J: '🤙', K: '🤞', L: '🤟', M: '🖐️', N: '🖐️', O: '⭕', P: '👇',
  Q: '👇', R: '🤞', S: '✊', T: '☝️', U: '✌️', V: '✌️', W: '🖐️', X: '☝️',
  Y: '🤙', Z: '👉',
}

function GuidanceCard({ letter, onPreview, result = false, t, details }) {
  const [rightHand, leftHand] = details[letter] || ['', '']

  return (
    <article className={result ? 'guidance-card guidance-result-card' : 'guidance-card'}>
      <div className="guidance-letter">{letter}</div>
      <div className="guidance-hand-mark" aria-hidden="true">{HAND_GLYPHS[letter]}</div>
      <div className="guidance-details">
        <p><strong>{t.rightHand}:</strong> {rightHand}</p>
        <p><strong>{t.leftHand}:</strong> {leftHand}</p>
      </div>
      <button type="button" className="tiny-button" onClick={() => onPreview(letter)}>{t.preview} 3D</button>
    </article>
  )
}

export default function SignGuidance({ query, onQueryChange, onPreview, t, language }) {
  const searchLetters = String(query || '').toUpperCase().match(/[A-Z]/g) || []
  const details = GUIDANCE_DETAILS[language] || GUIDANCE_DETAILS.en
  const handleSearchChange = (event) => onQueryChange(event.target.value.replace(/[^a-z]/gi, '').toUpperCase())

  return (
    <section className="guidance-section" id="guidance">
      <div className="guidance-heading">
        <div>
          <span className="eyebrow">{t.guidanceEyebrow}</span>
          <h2>{t.guidanceTitle}</h2>
          <p>{t.guidanceDescription}</p>
        </div>
        <label className="guidance-search">
          <span>{t.searchLetters}</span>
          <span className="search-control">
            <input value={query} onChange={handleSearchChange} placeholder={t.searchPlaceholder} aria-label={t.searchLetters} />
            {query ? <button type="button" className="search-clear" onClick={() => onQueryChange('')} aria-label={t.clear}>x</button> : null}
          </span>
        </label>
      </div>

      <div className="guidance-grid" aria-label={t.alphabetGuide}>
        {LETTERS.map((letter) => <GuidanceCard key={letter} letter={letter} onPreview={onPreview} t={t} details={details} />)}
      </div>

      <div className="guidance-results">
        <div className="section-header">
          <h3>{query ? `${t.searchResults}: ${searchLetters.join(' → ')}` : t.searchResults}</h3>
          <span>{searchLetters.length ? `${searchLetters.length} ${t.letters}` : t.none}</span>
        </div>
        {searchLetters.length ? (
          <div className="guidance-result-grid">
            {searchLetters.map((letter, index) => <GuidanceCard key={`${letter}-${index}`} letter={letter} onPreview={onPreview} result t={t} details={details} />)}
          </div>
        ) : <p className="muted-text">{t.searchHelp}</p>}
      </div>
    </section>
  )
}
