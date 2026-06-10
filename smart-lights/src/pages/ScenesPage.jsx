import { useState } from 'react'
import { useLights } from '../context/LightsContext'
import SceneCard from '../components/SceneCard'

export default function ScenesPage() {
  const { state, dispatch } = useLights()
  const [activeScene, setActiveScene] = useState(null)

  const handleApply = (scene) => {
    dispatch({ type: 'APPLY_SCENE', sceneId: scene.id })
    setActiveScene(scene.id)
  }

  return (
    <div className="page">
      <h1 className="page-title">Scenes</h1>

      <div className="scenes-grid">
        {state.scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            active={activeScene === scene.id}
            onApply={() => handleApply(scene)}
          />
        ))}
      </div>
    </div>
  )
}
