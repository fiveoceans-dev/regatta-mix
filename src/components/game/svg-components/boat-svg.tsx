import { Boat } from '../../../types/game-types'

interface BoatSvgProps {
  boat: Boat
  screenPosition: { x: number, y: number }
  isPlayer: boolean
}

export function BoatSvg({ boat, screenPosition, isPlayer }: BoatSvgProps) {
  const size = 12 // overall size in pixels

  // Convert world heading to screen rotation
  const rotation = -boat.heading * (180 / Math.PI)

  // Team colors - red vs blue mapped to CSS variables
  const teamColor = boat.team === 'red'
    ? 'hsl(var(--boat-red))'
    : 'hsl(var(--boat-blue))'

  const strokeColor = teamColor
  const strokeWidth = isPlayer ? 2 : 1

  return (
    <g transform={`translate(${screenPosition.x}, ${screenPosition.y})`}>
      <g transform={`rotate(${rotation})`}>
        {/* Simple triangular hull */}
        <polygon
          points={`0,-${size} ${size / 2},${size / 2} -${size / 2},${size / 2}`}
          fill={teamColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity="0.9"
        />

        {/* Speed vector */}
        {boat.speed > 0.1 && (
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={-boat.speed * 20}
            stroke={strokeColor}
            strokeWidth="1"
            opacity="0.5"
            markerEnd="url(#arrow)"
          />
        )}
      </g>

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
          r={size}
          fill="none"
          stroke={`hsl(var(--neon-aqua)/var(--neon-alpha))`}
          strokeWidth="2"
          strokeDasharray="3,3"
          className="neon-edge"
        />
      )}
    </g>
  )
}