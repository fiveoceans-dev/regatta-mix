// Core game state types for 2D sailing multiplayer

export interface Boat {
  id: string
  number: number
  name?: string
  team: 'red' | 'blue'
  x: number
  z: number
  heading: number // radians
  speed: number // knots
  vmg?: number // velocity made good
  position?: number // race position
  penalties?: Penalty[]
  sailTrim?: number
  rudderAngle?: number
  lastUpdate?: number
}

export interface Mark {
  id: string
  name: string
  type: 'start' | 'finish' | 'windward' | 'leeward' | 'offset'
  x: number
  z: number
  radius: number
  roundingDirection?: 'port' | 'starboard'
}

export interface WindData {
  x: number
  z: number
  direction: number // radians
  speed: number // knots
  isShift?: boolean
  gustiness?: number
}

export interface Penalty {
  type: 'DSQ' | 'DNF' | 'OCS' | 'UFD' | 'BFD' | '720' | '360'
  description: string
  timestamp: number
  markId?: string
}

export interface CourseBound {
  start: { x: number, z: number }
  end: { x: number, z: number }
  type: 'boundary' | 'layline' | 'start-line' | 'finish-line'
}

export interface GameState {
  // Core state
  playerId: string
  raceStatus: 'waiting' | 'starting' | 'racing' | 'finished'
  raceTime?: string
  tick: number
  deltaTime: number
  lastUpdate?: string
  ping?: number
  
  // Game objects
  boats: Boat[]
  marks: Mark[]
  windField: WindData[]
  wind?: WindData // global wind
  courseBounds: CourseBound[]
  
  // Race data
  startSequence?: StartSequence
  raceResults?: RaceResult[]
}

export interface StartSequence {
  timeToStart: number // seconds
  signals: StartSignal[]
  isRecalled?: boolean
}

export interface StartSignal {
  type: 'preparatory' | 'warning' | 'start'
  timeRemaining: number
  flag?: string
}

export interface RaceResult {
  boatId: string
  position: number
  finishTime: number
  penalties: Penalty[]
}

// Input/Action types
export type GameAction = 
  | { type: 'TACK' }
  | { type: 'GYBE' }
  | { type: 'TRIM_SAIL', angle: number }
  | { type: 'STEER', angle: number }
  | { type: 'REQUEST_PROTEST', targetBoatId: string }
  | { type: 'ACKNOWLEDGE_PENALTY', penaltyId: string }

// WebSocket message types
export interface WSMessage {
  type: 'GAME_STATE' | 'PLAYER_ACTION' | 'PING' | 'ERROR'
  data: any
  timestamp?: number
  playerId?: string
}

// Physics/simulation types
export interface BoatPhysics {
  polars: PolarData[]
  tackingPenalty: number // seconds
  gybingPenalty: number // seconds
  hullLength: number // meters
  maxRudderAngle: number // radians
}

export interface PolarData {
  trueWindAngle: number // radians
  trueWindSpeed: number // knots
  boatSpeed: number // knots
}

// Wind simulation
export interface WindField {
  globalDirection: number
  globalSpeed: number
  shifts: WindShift[]
  gusts: WindGust[]
}

export interface WindShift {
  x: number
  z: number
  radius: number
  direction: number
  strength: number
  duration: number
}

export interface WindGust {
  x: number
  z: number
  radius: number
  speedMultiplier: number
  duration: number
}