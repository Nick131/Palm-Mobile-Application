import { useState } from 'react'
import { LightsProvider } from './context/LightsContext'
import LightsPage from './pages/LightsPage'
import ScenesPage from './pages/ScenesPage'
import TimersPage from './pages/TimersPage'
import SettingsPage from './pages/SettingsPage'

const TABS = [
  { id: 'lights', label: 'Lights', icon: '💡' },
  { id: 'scenes', label: 'Scenes', icon: '🎨' },
  { id: 'timers', label: 'Timers', icon: '⏰' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('lights')

  return (
    <LightsProvider>
      <div className="app">
        <div className="tab-content">
          {activeTab === 'lights' && <LightsPage />}
          {activeTab === 'scenes' && <ScenesPage />}
          {activeTab === 'timers' && <TimersPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>

        <nav className="nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </LightsProvider>
  )
}
