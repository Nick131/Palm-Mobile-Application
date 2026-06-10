import { useLights } from '../context/LightsContext'

export default function LightCard({ light, onClick }) {
  const { dispatch } = useLights()

  const toggle = (e) => {
    e.stopPropagation()
    dispatch({ type: 'TOGGLE_LIGHT', id: light.id })
  }

  const cardStyle = light.on
    ? {
        boxShadow: `0 0 24px ${light.color}30`,
      }
    : {}

  return (
    <div
      className={`light-card ${light.on ? 'on' : ''}`}
      onClick={onClick}
      style={cardStyle}
    >
      <div className="light-card-top">
        {light.on && <span className="light-on-indicator" />}
        <div className="light-card-name">{light.name}</div>
        <div className="light-card-room">{light.room}</div>
      </div>
      <div className="light-card-bottom">
        <div
          className="light-card-color"
          style={{ backgroundColor: light.on ? light.color : '#333' }}
        />
        <button
          className={`power-btn ${light.on ? 'on' : 'off'}`}
          onClick={toggle}
          aria-label={light.on ? 'Turn off' : 'Turn on'}
        >
          ⏻
        </button>
      </div>
    </div>
  )
}
