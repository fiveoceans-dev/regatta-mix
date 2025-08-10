import * as THREE from 'three'
import { GameState } from '../../../types/game-types'

interface RulesOverlayProps {
  gameState: GameState
  getScreenPosition: (worldX: number, worldZ: number) => { x: number, y: number }
  isVisible: (worldX: number, worldZ: number, radius?: number) => boolean
  camera: THREE.Camera
  dimensions: { width: number, height: number }
}

export function RulesOverlay({ 
  gameState, 
  getScreenPosition, 
  isVisible, 
  camera, 
  dimensions 
}: RulesOverlayProps) {
  
  // Check for boat overlaps and right-of-way situations
  const renderBoatOverlaps = () => {
    const overlaps = []
    
    for (let i = 0; i < gameState.boats.length; i++) {
      for (let j = i + 1; j < gameState.boats.length; j++) {
        const boat1 = gameState.boats[i]
        const boat2 = gameState.boats[j]
        
        const distance = Math.sqrt(
          Math.pow(boat1.x - boat2.x, 2) + 
          Math.pow(boat1.z - boat2.z, 2)
        )
        
        // If boats are within 2 hull lengths, show overlap
        if (distance < 6 && isVisible(boat1.x, boat1.z, 10)) {
          const midPoint = {
            x: (boat1.x + boat2.x) / 2,
            z: (boat1.z + boat2.z) / 2
          }
          const screenPos = getScreenPosition(midPoint.x, midPoint.z)
          
          // Determine right-of-way
          const rightOfWay = determineRightOfWay(boat1, boat2)
          
          overlaps.push(
            <g key={`overlap-${boat1.id}-${boat2.id}`}>
              {/* Overlap zone circle */}
              <circle
                cx={screenPos.x}
                cy={screenPos.y}
                r="15"
                fill="hsl(var(--sailing-danger))"
                opacity="0.2"
                stroke="hsl(var(--sailing-danger))"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
              
              {/* Right-of-way indicator */}
              <text
                x={screenPos.x}
                y={screenPos.y + 20}
                textAnchor="middle"
                fontSize="8"
                fill="hsl(var(--sailing-danger))"
                fontWeight="bold"
                className="pointer-events-none select-none"
              >
                {rightOfWay}
              </text>
            </g>
          )
        }
      }
    }
    
    return overlaps
  }

  // Mark zone entry tracking
  const renderMarkZones = () => {
    const zones = []
    
    gameState.marks.forEach(mark => {
      if (!isVisible(mark.x, mark.z, mark.radius + 20)) return
      
      const screenPos = getScreenPosition(mark.x, mark.z)
      const zoneRadius = (mark.radius * 2.5 * dimensions.height) / 100
      
      // Check which boats are in the zone
      const boatsInZone = gameState.boats.filter(boat => {
        const distance = Math.sqrt(
          Math.pow(boat.x - mark.x, 2) + 
          Math.pow(boat.z - mark.z, 2)
        )
        return distance <= mark.radius * 2.5
      })
      
      if (boatsInZone.length > 1) {
        // Highlight zone when multiple boats are present
        zones.push(
          <g key={`zone-${mark.id}`}>
            <circle
              cx={screenPos.x}
              cy={screenPos.y}
              r={zoneRadius}
              fill="hsl(var(--sailing-warning))"
              opacity="0.1"
              stroke="hsl(var(--sailing-warning))"
              strokeWidth="2"
            />
            
            <text
              x={screenPos.x}
              y={screenPos.y - zoneRadius - 10}
              textAnchor="middle"
              fontSize="9"
              fill="hsl(var(--sailing-warning))"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              MARK ROOM
            </text>
          </g>
        )
      }
    })
    
    return zones
  }

  // Penalty flags and notifications
  const renderPenalties = () => {
    return gameState.boats
      .filter(boat => boat.penalties && boat.penalties.length > 0)
      .filter(boat => isVisible(boat.x, boat.z, 5))
      .map(boat => {
        const screenPos = getScreenPosition(boat.x, boat.z)
        
        return (
          <g key={`penalty-${boat.id}`}>
            {/* Penalty flag */}
            <polygon
              points={`${screenPos.x + 15} ${screenPos.y - 10} 
                       ${screenPos.x + 25} ${screenPos.y - 10} 
                       ${screenPos.x + 25} ${screenPos.y + 5} 
                       ${screenPos.x + 15} ${screenPos.y + 5}`}
              fill="hsl(var(--destructive))"
              stroke="white"
              strokeWidth="1"
            />
            
            <text
              x={screenPos.x + 20}
              y={screenPos.y - 2}
              textAnchor="middle"
              fontSize="8"
              fill="white"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              P
            </text>
            
            {/* Penalty count */}
            <text
              x={screenPos.x + 20}
              y={screenPos.y + 15}
              textAnchor="middle"
              fontSize="7"
              fill="hsl(var(--destructive))"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              {boat.penalties.length}
            </text>
          </g>
        )
      })
  }

  return (
    <g className="rules-overlay">
      {renderBoatOverlaps()}
      {renderMarkZones()}
      {renderPenalties()}
    </g>
  )
}

// Helper function to determine right-of-way between two boats
function determineRightOfWay(boat1: any, boat2: any): string {
  // Simplified rules - in reality this would be much more complex
  const relativeAngle = Math.abs(boat1.heading - boat2.heading)
  
  if (relativeAngle < Math.PI / 4) {
    // Similar headings - windward/leeward
    return boat1.x > boat2.x ? "WINDWARD KEEP CLEAR" : "LEEWARD RIGHT OF WAY"
  } else {
    // Crossing - port/starboard
    const boat1Port = Math.sin(boat1.heading) > 0
    const boat2Port = Math.sin(boat2.heading) > 0
    
    if (boat1Port && !boat2Port) return "PORT KEEP CLEAR"
    if (!boat1Port && boat2Port) return "STARBOARD RIGHT OF WAY"
    return "SAME TACK"
  }
}