import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { GameState, GameAction, Boat, Mark, WindData } from '../types/game-types'

// Initial game state for development/testing
const initialGameState: GameState = {
  playerId: 'player-1',
  raceStatus: 'waiting',
  tick: 0,
  deltaTime: 16,
  boats: [
    {
      id: 'player-1',
      number: 1,
      name: 'Player',
      team: 'red',
      x: 0,
      z: -15,
      heading: 0,
      speed: 0,
      position: 1
    },
    {
      id: 'bot-2',
      number: 2,
      name: 'Bot Alpha',
      team: 'blue',
      x: -5,
      z: -15,
      heading: 0.1,
      speed: 8.2,
      position: 2
    },
    {
      id: 'bot-3',
      number: 3,
      name: 'Bot Beta',
      team: 'red',
      x: 3,
      z: -16,
      heading: -0.1,
      speed: 7.8,
      position: 3
    }
  ],
  marks: [
    {
      id: 'start',
      name: 'Start',
      type: 'start',
      x: 0,
      z: -20,
      radius: 2
    },
    {
      id: 'windward',
      name: '1',
      type: 'windward',
      x: 0,
      z: 50,
      radius: 3,
      roundingDirection: 'port'
    },
    {
      id: 'leeward',
      name: '2',
      type: 'leeward',
      x: 0,
      z: -40,
      radius: 3,
      roundingDirection: 'starboard'
    }
  ],
  windField: [
    { x: 0, z: 0, direction: 0, speed: 12 },
    { x: 10, z: 10, direction: 0.1, speed: 13 },
    { x: -10, z: 10, direction: -0.1, speed: 11 },
    { x: 0, z: 20, direction: 0.05, speed: 12.5 }
  ],
  wind: { x: 0, z: 0, direction: 0, speed: 12 },
  courseBounds: [
    {
      start: { x: -50, z: -50 },
      end: { x: -50, z: 100 },
      type: 'boundary'
    },
    {
      start: { x: 50, z: -50 },
      end: { x: 50, z: 100 },
      type: 'boundary'
    }
  ]
}

// Game state reducer
function gameStateReducer(state: GameState, action: GameAction | { type: 'UPDATE_STATE', payload: Partial<GameState> }): GameState {
  switch (action.type) {
    case 'TACK':
      return {
        ...state,
        boats: state.boats.map(boat => 
          boat.id === state.playerId 
            ? { ...boat, heading: -boat.heading, speed: Math.max(0, boat.speed - 1) }
            : boat
        )
      }
      
    case 'GYBE':
      return {
        ...state,
        boats: state.boats.map(boat => 
          boat.id === state.playerId 
            ? { ...boat, heading: Math.PI - boat.heading, speed: Math.max(0, boat.speed - 0.5) }
            : boat
        )
      }
      
    case 'TRIM_SAIL':
      // Implement sail trimming logic
      return state
      
    case 'STEER':
      return {
        ...state,
        boats: state.boats.map(boat => 
          boat.id === state.playerId 
            ? { ...boat, heading: boat.heading + (action as any).angle }
            : boat
        )
      }
      
    case 'UPDATE_STATE':
      return { ...state, ...(action as any).payload }
      
    default:
      return state
  }
}

// Context setup
interface GameStateContextType {
  gameState: GameState
  dispatch: React.Dispatch<GameAction | { type: 'UPDATE_STATE', payload: Partial<GameState> }>
}

const GameStateContext = createContext<GameStateContextType | null>(null)

// Provider component
export function GameStateProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState)
  
  // Simulate basic game loop for development
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          tick: gameState.tick + 1,
          lastUpdate: new Date().toLocaleTimeString()
        }
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [gameState.tick])
  
  return (
    <GameStateContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameStateContext.Provider>
  )
}

// Hook to use game state
export function useGameState() {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}