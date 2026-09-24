const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function LetterMode({ currentLetter, onSelect, t }) {
  return (
    <div className="panel-wrap">
      <div className="section-header">
        <h3>{t.letterMode}</h3>
        <span>{currentLetter || t.none}</span>
      </div>
      <div className="letter-grid" role="list" aria-label={t.chooseLetter}>
        {LETTERS.map((letter) => (
          <button
            key={letter}
            type="button"
            className={currentLetter === letter ? 'speed-button active' : 'speed-button'}
            onClick={() => onSelect(letter)}
            aria-label={`${t.preview} ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  )
}