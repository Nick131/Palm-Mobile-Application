import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { initialLights, initialScenes } from '../data/initial'

const LightsContext = createContext(null)

const defaultSettings = {
  apiMode: 'mock',
  tuya: { accessId: '', accessSecret: '', region: 'us' },
  homeassistant: { url: '', token: '' },
}

const savedSettings = JSON.parse(localStorage.getItem('smartlights-settings') || 'null')

const initialState = {
  lights: initialLights,
  scenes: initialScenes,
  timers: JSON.parse(localStorage.getItem('smartlights-timers') || '[]'),
  settings: savedSettings ? { ...defaultSettings, ...savedSettings } : defaultSettings,
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_LIGHT':
      return {
        ...state,
        lights: state.lights.map(l =>
          l.id === action.id ? { ...l, on: !l.on } : l
        ),
      }

    case 'SET_BRIGHTNESS':
      return {
        ...state,
        lights: state.lights.map(l =>
          l.id === action.id ? { ...l, brightness: action.value } : l
        ),
      }

    case 'SET_COLOR':
      return {
        ...state,
        lights: state.lights.map(l =>
          l.id === action.id ? { ...l, color: action.value } : l
        ),
      }

    case 'SET_COLOR_TEMP':
      return {
        ...state,
        lights: state.lights.map(l =>
          l.id === action.id ? { ...l, colorTemp: action.value } : l
        ),
      }

    case 'APPLY_SCENE': {
      const scene = state.scenes.find(s => s.id === action.sceneId)
      if (!scene) return state
      return {
        ...state,
        lights: state.lights.map(l => {
          const s = scene.states[l.id]
          if (!s) return l
          return { ...l, ...s }
        }),
      }
    }

    case 'ADD_TIMER': {
      const newTimers = [...state.timers, action.timer]
      localStorage.setItem('smartlights-timers', JSON.stringify(newTimers))
      return { ...state, timers: newTimers }
    }

    case 'TOGGLE_TIMER': {
      const updatedTimers = state.timers.map(t =>
        t.id === action.id ? { ...t, enabled: !t.enabled } : t
      )
      localStorage.setItem('smartlights-timers', JSON.stringify(updatedTimers))
      return { ...state, timers: updatedTimers }
    }

    case 'DELETE_TIMER': {
      const filteredTimers = state.timers.filter(t => t.id !== action.id)
      localStorage.setItem('smartlights-timers', JSON.stringify(filteredTimers))
      return { ...state, timers: filteredTimers }
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings }
      localStorage.setItem('smartlights-settings', JSON.stringify(newSettings))
      return { ...state, settings: newSettings }
    }

    default:
      return state
  }
}

export function LightsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const firedRef = useRef({})

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const currentTime = `${hh}:${mm}`
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const currentDay = days[now.getDay()]

      state.timers.forEach(timer => {
        if (!timer.enabled) return
        if (timer.time !== currentTime) {
          // Reset fired flag when time no longer matches
          delete firedRef.current[timer.id]
          return
        }
        if (firedRef.current[timer.id]) return
        if (timer.days && timer.days.length > 0 && !timer.days.includes(currentDay)) return

        firedRef.current[timer.id] = true

        if (timer.action === 'scene' && timer.sceneId) {
          dispatch({ type: 'APPLY_SCENE', sceneId: timer.sceneId })
        } else if (timer.action === 'on') {
          timer.lightIds.forEach(id => {
            dispatch({ type: 'TOGGLE_LIGHT', id })
          })
        } else if (timer.action === 'off') {
          timer.lightIds.forEach(id => {
            dispatch({ type: 'TOGGLE_LIGHT', id })
          })
        }
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [state.timers])

  return (
    <LightsContext.Provider value={{ state, dispatch }}>
      {children}
    </LightsContext.Provider>
  )
}

export function useLights() {
  const ctx = useContext(LightsContext)
  if (!ctx) throw new Error('useLights must be used within LightsProvider')
  return ctx
}
