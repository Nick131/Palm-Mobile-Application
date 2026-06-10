import { useLights } from '../context/LightsContext'

export default function SettingsPage() {
  const { state, dispatch } = useLights()
  const { settings } = state

  const update = (partial) => dispatch({ type: 'UPDATE_SETTINGS', settings: partial })

  const updateTuya = (partial) =>
    update({ tuya: { ...settings.tuya, ...partial } })

  const updateHA = (partial) =>
    update({ homeassistant: { ...settings.homeassistant, ...partial } })

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>

      {/* API Mode */}
      <div className="settings-section">
        <div className="settings-section-title">API Mode</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Choose how to connect to your smart lights
        </div>
        <div className="mode-buttons">
          {['mock', 'tuya', 'homeassistant'].map((mode) => (
            <button
              key={mode}
              className={`mode-btn ${settings.apiMode === mode ? 'active' : ''}`}
              onClick={() => update({ apiMode: mode })}
            >
              {mode === 'mock' && 'Mock'}
              {mode === 'tuya' && 'Tuya'}
              {mode === 'homeassistant' && 'Home Assistant'}
            </button>
          ))}
        </div>
      </div>

      {/* Tuya Settings */}
      {settings.apiMode === 'tuya' && (
        <div className="settings-section">
          <div className="settings-section-title">Tuya Settings</div>
          <div className="settings-form">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Access ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your Tuya Access ID"
                value={settings.tuya.accessId}
                onChange={(e) => updateTuya({ accessId: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Access Secret</label>
              <input
                type="password"
                className="form-input"
                placeholder="Your Tuya Access Secret"
                value={settings.tuya.accessSecret}
                onChange={(e) => updateTuya({ accessSecret: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Region</label>
              <select
                className="form-input"
                value={settings.tuya.region}
                onChange={(e) => updateTuya({ region: e.target.value })}
              >
                <option value="us">US (Americas)</option>
                <option value="eu">EU (Europe)</option>
                <option value="cn">CN (China)</option>
                <option value="in">IN (India)</option>
              </select>
            </div>
          </div>
          <div className="api-info" style={{ marginTop: '12px' }}>
            Tuya lights (most Alexa-compatible Chinese brand lights use Tuya). Get credentials
            from <strong>platform.tuya.com</strong>. Note: Tuya API requires a backend proxy due
            to HMAC signing; these settings are saved for reference.
          </div>
        </div>
      )}

      {/* Home Assistant Settings */}
      {settings.apiMode === 'homeassistant' && (
        <div className="settings-section">
          <div className="settings-section-title">Home Assistant Settings</div>
          <div className="settings-form">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Instance URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="http://homeassistant.local:8123"
                value={settings.homeassistant.url}
                onChange={(e) => updateHA({ url: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Long-Lived Access Token</label>
              <input
                type="password"
                className="form-input"
                placeholder="Your long-lived access token"
                value={settings.homeassistant.token}
                onChange={(e) => updateHA({ token: e.target.value })}
              />
            </div>
          </div>
          <div className="api-info" style={{ marginTop: '12px' }}>
            Home Assistant can control virtually any smart home device including Amazon and Tuya
            lights via integrations. Create a long-lived access token in your Home Assistant
            profile settings.
          </div>
        </div>
      )}

      {/* About */}
      <div className="settings-section">
        <div className="settings-section-title">About</div>
        <div className="about-text">
          Smart Lights — a beautiful controller for your smart home lighting.
        </div>
        <div className="about-version">
          v1.0 · Built with React + Vite
        </div>
      </div>
    </div>
  )
}
