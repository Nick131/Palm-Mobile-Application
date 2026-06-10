export default function SceneCard({ scene, active, onApply }) {
  const colors = Object.values(scene.states)
    .filter((s) => s.on !== false)
    .map((s) => s.color)
    .filter(Boolean)
    .slice(0, 4)

  return (
    <div className={`scene-card ${active ? 'active' : ''}`} onClick={onApply}>
      <div className="scene-icon">{scene.icon}</div>
      <div className="scene-name">{scene.name}</div>
      <div className="scene-preview">
        {colors.map((c, i) => (
          <div
            key={i}
            className="scene-preview-dot"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  )
}
