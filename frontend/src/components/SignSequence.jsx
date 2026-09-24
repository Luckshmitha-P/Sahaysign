export default function SignSequence({ sequence = [], currentIndex = 0, currentSign = '', t }) {
  return (
    <div className="panel-wrap">
      <div className="section-header">
        <h3>{t.signSequence}</h3>
        <span>{sequence.length ? `${currentIndex + 1} / ${sequence.length}` : '0 / 0'}</span>
      </div>
      {sequence.length ? (
        <div className="sign-flow">
          {sequence.map((item, index) => (
            <span key={`${item}-${index}`} className={index === currentIndex ? 'flow-item active' : 'flow-item'}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="muted-text">{t.noSignSequence}</p>
      )}

      <div className="current-sign-box">
        <span className="mini-label">{t.currentSign}</span>
        <strong>{currentSign || t.waitingForInput}</strong>
      </div>
    </div>
  )
}
