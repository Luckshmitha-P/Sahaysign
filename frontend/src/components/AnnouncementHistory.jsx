export default function AnnouncementHistory({ history = [], onReplay, onReuse, t }) {
  return (
    <div className="panel-wrap">
      <h3>{t.recentHistory}</h3>
      {history.length ? (
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={`${item.text}-${index}`}>
              <div>
                <strong>{(item.language || 'en').toUpperCase()}</strong>
                <p>{item.text}</p>
                <small>{item.sequence.join(' → ') || 'No sequence'}</small>
              </div>
              <div className="history-actions">
                <button type="button" className="tiny-button" onClick={() => onReplay(item)}>{t.replay}</button>
                <button type="button" className="tiny-button" onClick={() => onReuse(item)}>{t.reuse}</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted-text">{t.noAnnouncements}</p>
      )}
    </div>
  )
}
