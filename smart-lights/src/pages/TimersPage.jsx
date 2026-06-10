import { useState } from 'react'
import { useLights } from '../context/LightsContext'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function TimerModal({ onClose, scenes, lights }) {
  const { dispatch } = useLights()

  const [name, setName] = useState('')
  const [time, setTime] = useState('07:00')
  const [days, setDays] = useState([])
  const [action, setAction] = useState('on')
  const [sceneId, setSceneId] = useState(scenes[0]?.id || '')
  const [lightIds, setLightIds] = useState([])

  const toggleDay = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const toggleLight = (id) => {
    setLightIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!name.trim()) return
    const timer = {
      id: Date.now().toString(),
      name: name.trim(),
      time,
      days,
      action,
      sceneId: action === 'scene' ? sceneId : null,
      lightIds: action !== 'scene' ? lightIds : [],
      enabled: true,
    }
    dispatch({ type: 'ADD_TIMER', timer })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Add Timer</div>

        <div className="form-group">
          <label className="form-label">Timer Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Morning Wake Up"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Time</label>
          <input
            type="time"
            className="form-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Days (empty = every day)</label>
          <div className="days-grid">
            {DAYS.map((d) => (
              <button
                key={d}
                className={`day-btn ${days.includes(d) ? 'selected' : ''}`}
                onClick={() => toggleDay(d)}
                type="button"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Action</label>
          <select
            className="form-input"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="on">Turn On</option>
            <option value="off">Turn Off</option>
            <option value="scene">Apply Scene</option>
          </select>
        </div>

        {action === 'scene' && (
          <div className="form-group">
            <label className="form-label">Scene</label>
            <select
              className="form-input"
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
            >
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {(action === 'on' || action === 'off') && (
          <div className="form-group">
            <label className="form-label">
              Lights to turn {action} (none = all lights)
            </label>
            <div className="lights-checklist">
              {lights.map((l) => (
                <label key={l.id} className="light-checkbox-row">
                  <input
                    type="checkbox"
                    checked={lightIds.includes(l.id)}
                    onChange={() => toggleLight(l.id)}
                  />
                  <span>{l.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {l.room}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="btn-row">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Timer</button>
        </div>
      </div>
    </div>
  )
}

function actionLabel(timer, scenes) {
  if (timer.action === 'scene') {
    const scene = scenes.find((s) => s.id === timer.sceneId)
    return `Apply scene: ${scene ? `${scene.icon} ${scene.name}` : '—'}`
  }
  if (timer.action === 'on') return `Turn on ${timer.lightIds.length > 0 ? `${timer.lightIds.length} light(s)` : 'all lights'}`
  if (timer.action === 'off') return `Turn off ${timer.lightIds.length > 0 ? `${timer.lightIds.length} light(s)` : 'all lights'}`
  return ''
}

export default function TimersPage() {
  const { state, dispatch } = useLights()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="page">
      <h1 className="page-title">Timers</h1>

      {state.timers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏰</div>
          <div className="empty-state-text">
            No timers yet.<br />Tap + to schedule your lights.
          </div>
        </div>
      ) : (
        <div className="timer-list">
          {state.timers.map((timer) => (
            <div key={timer.id} className="timer-item">
              <div className="timer-info">
                <div className="timer-name">{timer.name}</div>
                <div className="timer-details">
                  {timer.time}
                  {timer.days && timer.days.length > 0
                    ? ` · ${timer.days.join(', ')}`
                    : ' · Every day'}
                  {' · '}
                  {actionLabel(timer, state.scenes)}
                </div>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={timer.enabled}
                  onChange={() => dispatch({ type: 'TOGGLE_TIMER', id: timer.id })}
                />
                <span className="toggle-slider" />
              </label>

              <button
                className="timer-delete-btn"
                onClick={() => dispatch({ type: 'DELETE_TIMER', id: timer.id })}
                aria-label="Delete timer"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="add-btn" onClick={() => setShowModal(true)} aria-label="Add timer">
        +
      </button>

      {showModal && (
        <TimerModal
          onClose={() => setShowModal(false)}
          scenes={state.scenes}
          lights={state.lights}
        />
      )}
    </div>
  )
}
