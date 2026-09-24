export default function TextInput({ value, onChange, onGenerate, onClear, disabled = false, t }) {
  return (
    <div className="panel-wrap">
      <label className="field-label" htmlFor="announcement">{t.announcement}</label>
      <textarea
        id="announcement"
        className="text-area"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t.announcementPlaceholder}
        disabled={disabled}
      />
      <div className="button-row split">
        <button type="button" className="secondary-button" onClick={onClear}>
          {t.clear}
        </button>
        <button type="button" className="primary-button" onClick={onGenerate}>
          {t.generateSign}
        </button>
      </div>
    </div>
  )
}
