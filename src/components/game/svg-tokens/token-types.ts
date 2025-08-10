// SVG Token System Types
// Parametric tokens that can be recolored/resized without new art

export interface BoatToken {
  id: string
  type: 'dinghy' | 'keel' | 'catamaran'
  hullLength: number // meters
  beam: number // meters
  color: string // CSS custom property or HSL
  pattern: 'solid' | 'striped' | 'checkers' | 'dots'
  headingDeg: number // 0-360 degrees
  sailAngleDeg: number // relative to boat heading
  centerline: boolean // show centerline indicator
  number?: string | number
  team?: 'red' | 'blue'
}

export interface MarkToken {
  id: string
  type: 'mark' | 'rcBoat' | 'pin' | 'start' | 'finish'
  radius: number // meters
  color: string
  label?: string
  strokeWidth?: number
  pattern?: string // pattern ID for accessibility
}

export interface VectorToken {
  id: string
  kind: 'wind' | 'layline' | 'current' | 'bearing' | 'velocity'
  from: { x: number, y: number } // world coordinates
  to: { x: number, y: number }
  dash: boolean
  color: string
  strokeWidth?: number
  arrowHead?: boolean
}

export interface ZoneRing {
  id: string
  center: { x: number, y: number } // world coordinates
  radius: number // meters
  color: string
  alpha: number // 0-1 opacity
  dash?: boolean
  strokeWidth?: number
  fill?: boolean
}

export interface TextToken {
  id: string
  position: { x: number, y: number }
  text: string
  fontSize: number // pixels
  color: string
  anchor: 'start' | 'middle' | 'end'
  background?: boolean
}

// Transform function type
export type WorldToScreen = (worldX: number, worldY: number) => { x: number, y: number }

// Token collection for scene rendering
export interface TokenScene {
  boats: BoatToken[]
  marks: MarkToken[]
  vectors: VectorToken[]
  zones: ZoneRing[]
  text: TextToken[]
}