import { Boat } from '../../../types/game-types'

interface BoatSvgProps {
  boat: Boat
  screenPosition: { x: number, y: number }
  isPlayer: boolean
}

export function BoatSvg({ boat, screenPosition, isPlayer }: BoatSvgProps) {
  const boatLength = 12 // pixels
  const boatWidth = 4
  
  // Convert world heading to screen rotation
  const rotation = -boat.heading * (180 / Math.PI)
  
  // Team colors - red vs blue mapped to CSS variables
  const teamColor = boat.team === 'red'
    ? 'hsl(var(--boat-red))'
    : 'hsl(var(--boat-blue))'

  const strokeColor = teamColor

  const strokeWidth = isPlayer ? 2 : 1
  
  // Sail pattern for accessibility
  const sailPattern = boat.team === 'red' ? 'url(#port-pattern)' : 'url(#starboard-pattern)'

  return (
    <g transform={`translate(${screenPosition.x}, ${screenPosition.y})`}>
      {/* Boat hull */}
      <ellipse
        cx="0"
        cy="0"
        rx={boatWidth}
        ry={boatLength / 2}
        fill={teamColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        transform={`rotate(${rotation})`}
        opacity="0.9"
      />
      
      {/* Sail (simplified triangle) */}
      <polygon
        points={`0,-${boatLength/2} -6,-${boatLength/4} 0,${boatLength/4}`}
        fill={sailPattern}
        stroke={strokeColor}
        strokeWidth="1"
        transform={`rotate(${rotation})`}
        opacity="0.8"
      />
      
      {/* Boat number */}
      <text
        x="0"
        y="2"
        textAnchor="middle"
        fontSize="8"
        fill="white"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {boat.number}
      </text>
      
      {/* Player indicator */}
      {isPlayer && (
        <circle
          cx="0"
          cy="0"
          r={boatLength}
          fill="none"
          stroke={`hsl(var(--neon-aqua)/var(--neon-alpha))`}
          strokeWidth="2"
          strokeDasharray="3,3"
          className="neon-edge"
        />
      )}
      
      {/* Speed vector line */}
      {boat.speed > 0.1 && (
        <line
          x1="0"
          y1="0"
          x2={Math.sin(boat.heading) * boat.speed * 20}
          y2={-Math.cos(boat.heading) * boat.speed * 20}
          stroke={strokeColor}
          strokeWidth="1"
          opacity="0.5"
          markerEnd="url(#arrow)"
        />
      )}
    </g>
  )
}