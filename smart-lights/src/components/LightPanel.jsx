import { useLights } from '../context/LightsContext'

const COLOR_PRESETS = [
  '#ffffff', '#fff5c0', '#ffd700', '#ff8c42',
  '#ff4500', '#ff0080', '#c084fc', '#6c63ff',
  '#00bfff', '#00ff80',
]

export default function LightPanel({ light, onClose }) {
  const { dispatch } = useLights()

  if (!light) return null

  const setColor = (color) => dispatch({ type: 'SET_COLOR', id: light.id, value: color })
  const setBrightness = (v) => dispatch({ type: 'SET_BRIGHTNESS', id: light.id, value: Number(v) })
  const setColorTemp = (v) => dispatch({ type: 'SET_COLOR_TEMP', id: light.id, value: Number(v) })

  const brightnessHex = Math.round(light.brightness * 2.55).toString(16).padStart(2, '0')
  const previewBg = light.on
    ? `radial-gradient(circle at 50% 0%, ${light.color}${brightnessHex}, transparent 70%)`
    : 'var(--bg-elevated)'

  const tempFill = ((light.colorTemp - 2700) / (6500 - 2700)) * 100

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-handle" />

        <div className="panel-header">
          <div>
            <div className="panel-title">{light.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{light.room}</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Power + brightness preview */}
        <div
          className="panel-preview"
          style={{
            background: previewBg,
            borderRadius: 'var(--radius)',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
          }}
        >
          <button
            className={`power-btn power-btn-lg ${light.on ? 'on' : 'off'}`}
            onClick={() => dispatch({ type: 'TOGGLE_LIGHT', id: light.id })}
            aria-label={light.on ? 'Turn off' : 'Turn on'}
          >
            ⏻
          </button>
        </div>

        {/* Brightness */}
        <div className="control-section">
          <div className="control-label">Brightness — {light.brightness}%</div>
          <input
            type="range"
            min="1"
            max="100"
            value={light.brightness}
            onChange={(e) => setBrightness(e.target.value)}
            className="brightness-slider"
            style={{
              '--fill': `${light.brightness}%`,
              '--thumb-color': light.on ? light.color : 'var(--text-muted)',
            }}
            disabled={!light.on}
          />
        </div>

        {/* Color (only for color-type lights) */}
        {light.type === 'color' && (
          <div className="control-section">
            <div className="control-label">Color</div>
            <div className="color-presets">
              {COLOR_PRESETS.map((c) => (
                <div
                  key={c}
                  className={`color-preset ${light.color === c ? 'selected' : ''}`}
                  style={{
                    backgroundColor: c,
                    opacity: light.on ? 1 : 0.5,
                    cursor: light.on ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => light.on && setColor(c)}
                />
              ))}
            </div>
            <div className="color-input-row">
              <input
                type="color"
                value={light.color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
                disabled={!light.on}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Custom color
              </span>
            </div>
          </div>
        )}

        {/* Color Temperature */}
        <div className="control-section">
          <div className="control-label">Color Temperature — {light.colorTemp}K</div>
          <div className="color-temp-row">
            <span className="temp-label" style={{ color: '#ffd700' }}>Warm</span>
            <input
              type="range"
              min="2700"
              max="6500"
              value={light.colorTemp}
              onChange={(e) => setColorTemp(e.target.value)}
              className="brightness-slider temp-slider"
              style={{
                '--fill': `${tempFill}%`,
              }}
              disabled={!light.on}
            />
            <span className="temp-label" style={{ color: '#e0f0ff', textAlign: 'right' }}>Cool</span>
          </div>
        </div>
      </div>
    </div>
  )
}
