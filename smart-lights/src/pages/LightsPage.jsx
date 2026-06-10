import { useState } from 'react'
import { useLights } from '../context/LightsContext'
import LightCard from '../components/LightCard'
import LightPanel from '../components/LightPanel'

export default function LightsPage() {
  const { state, dispatch } = useLights()
  const [selectedLight, setSelectedLight] = useState(null)

  const onCount = state.lights.filter((l) => l.on).length
  const rooms = [...new Set(state.lights.map((l) => l.room))]

  const handleAllOff = () => {
    state.lights.forEach((l) => {
      if (l.on) dispatch({ type: 'TOGGLE_LIGHT', id: l.id })
    })
  }

  return (
    <div className="page">
      <div className="lights-header">
        <h1 className="page-title">My Lights</h1>
        <div className="lights-stats">
          {onCount > 0 && (
            <span className="on-count">{onCount} on</span>
          )}
          {onCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={handleAllOff}>
              All off
            </button>
          )}
        </div>
      </div>

      {rooms.map((room) => (
        <div key={room} className="room-section">
          <div className="room-title">{room}</div>
          <div className="lights-grid">
            {state.lights
              .filter((l) => l.room === room)
              .map((light) => (
                <LightCard
                  key={light.id}
                  light={light}
                  onClick={() => setSelectedLight(light)}
                />
              ))}
          </div>
        </div>
      ))}

      {selectedLight && (
        <LightPanel
          light={state.lights.find((l) => l.id === selectedLight.id)}
          onClose={() => setSelectedLight(null)}
        />
      )}
    </div>
  )
}
