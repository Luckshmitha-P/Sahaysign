export default function AccessibilityPanel({ developerMode, onToggleDeveloperMode, supported = [], unsupported = [], t }) {
  return (
    <div className="panel-wrap">
      <div className="label-row">
        <h3>{t.developerMode}</h3>
        <button type="button" className="tiny-button" onClick={onToggleDeveloperMode}>
          {developerMode ? t.hide : t.show}
        </button>
      </div>

      {developerMode ? (
        <div className="developer-panel">
          <p><strong>{t.supported}:</strong> {supported.length ? supported.join(', ') : t.none}</p>
          <p><strong>{t.unsupported}:</strong> {unsupported.length ? unsupported.join(', ') : t.none}</p>
        </div>
      ) : null}
    </div>
  )
}
